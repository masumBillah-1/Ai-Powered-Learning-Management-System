import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionDocument extends Document {
  type: "payment" | "payout" | "refund";
  amount: number;
  currency: "BDT" | "USD";
  status: "pending" | "completed" | "failed" | "cancelled";
  studentId?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  paymentMethod?: "bkash" | "nagad" | "rocket" | "card" | "bank";
  paymentId?: string;
  instructorId?: mongoose.Types.ObjectId;
  payoutMethod?: "bank" | "bkash" | "nagad" | "rocket";
  accountDetails?: string;
  description: string;
  metadata?: any;
  platformFee?: number;
  gatewayFee?: number;
  netAmount?: number;
  parentTransactionId?: mongoose.Types.ObjectId;
  courseName?: string;
  instructorName?: string;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    type: { type: String, enum: ["payment", "payout", "refund"], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["BDT", "USD"], default: "BDT" },
    status: { type: String, enum: ["pending", "completed", "failed", "cancelled"], default: "pending" },

    studentId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId:      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    paymentMethod: { type: String, enum: ["bkash", "nagad", "rocket", "card", "bank"] },
    paymentId:     { type: String },

    instructorId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payoutMethod:  { type: String, enum: ["bank", "bkash", "nagad", "rocket"] },
    accountDetails:{ type: String },

    description: { type: String, required: true, trim: true },
    metadata:    { type: Schema.Types.Mixed, default: {} },

    platformFee: { type: Number, default: 0, min: 0 },
    gatewayFee:  { type: Number, default: 0, min: 0 },
    netAmount:   { type: Number, min: 0 },

    courseName:     { type: String, default: "" },
    instructorName: { type: String, default: "" },

    parentTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    processedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
TransactionSchema.index({ studentId: 1, type: 1 });
TransactionSchema.index({ instructorId: 1, type: 1 });
TransactionSchema.index({ courseId: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ paymentId: 1 });


TransactionSchema.pre("save", async function () {
  if (this.netAmount === undefined) {
    this.netAmount = this.amount - (this.platformFee || 0) - (this.gatewayFee || 0);
  }
  if (this.status === "completed" && !this.processedAt) {
    this.processedAt = new Date();
  }

});

// ✅ Export
const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);

export default Transaction;