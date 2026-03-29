// src/models/FeatureRequest.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeatureRequest extends Document {
  user: {
    userId: string;
    name: string;
    email: string;
    image: string;
  };
  title: string;
  description: string;
  platform: "Desktop App" | "Android App" | "Website";
  status: "Acknowledged" | "Planned" | "In Progress" | "Resolved";
  votes: string[];      // array of userIds
  comments: {
    userId: string;
    userName: string;
    userImage: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FeatureRequestSchema = new Schema<IFeatureRequest>(
  {
    user: {
      userId: { type: String, required: true },
      name:   { type: String, required: true },
      email:  { type: String, required: true },
      image:  { type: String, default: "" },
    },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    platform: {
      type:    String,
      enum:    ["Desktop App", "Android App", "Website"],
      default: "Website",
    },
    status: {
      type:    String,
      enum:    ["Acknowledged", "Planned", "In Progress", "Resolved"],
      default: "Acknowledged",
    },
    votes: [{ type: String }],
    comments: [
      {
        userId:    { type: String },
        userName:  { type: String },
        userImage: { type: String, default: "" },
        content:   { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const FeatureRequest: Model<IFeatureRequest> =
  mongoose.models.FeatureRequest ||
  mongoose.model<IFeatureRequest>("FeatureRequest", FeatureRequestSchema);

export default FeatureRequest;