// src/models/ReleaseNote.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReleaseNote extends Document {
  date: string;
  title: string;
  version: string;
  tag: string;
  description: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReleaseNoteSchema = new Schema<IReleaseNote>(
  {
    date:        { type: String, required: true },
    title:       { type: String, required: true, trim: true },
    version:     { type: String, required: true },
    tag:         { type: String, default: "" },
    description: { type: String, default: "" },
    published:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ReleaseNote: Model<IReleaseNote> =
  mongoose.models.ReleaseNote ||
  mongoose.model<IReleaseNote>("ReleaseNote", ReleaseNoteSchema);

export default ReleaseNote;