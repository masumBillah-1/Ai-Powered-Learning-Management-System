// src/models/RoadmapTicket.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoadmapTicket extends Document {
  user: {
    userId: string;
    name: string;
    email: string;
    image: string;
  };
  title: string;
  tags: string[];
  category: string;
  column: "investigating" | "inProgress" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapTicketSchema = new Schema<IRoadmapTicket>(
  {
    user: {
      userId: { type: String, required: true },
      name:   { type: String, required: true },
      email:  { type: String, required: true },
      image:  { type: String, default: "" },
    },
    title:    { type: String, required: true, trim: true },
    tags:     [{ type: String }],
    category: { type: String, default: "" },
    column: {
      type:    String,
      enum:    ["investigating", "inProgress", "resolved"],
      default: "investigating",
    },
  },
  { timestamps: true }
);

const RoadmapTicket: Model<IRoadmapTicket> =
  mongoose.models.RoadmapTicket ||
  mongoose.model<IRoadmapTicket>("RoadmapTicket", RoadmapTicketSchema);

export default RoadmapTicket;