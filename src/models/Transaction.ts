import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface ITransactionDocument extends Document {
  type: "payment" | "payout" | "refund";
  amount: number;
  currency: "BDT" | "USD";
  status: "pending" | "completed" | "failed" | "cancelled";
  
  // Payment-specific fields
  studentId?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  paymentMethod?: "bkash" | "nagad" | "rocket" | "card" | "bank";
  paymentId?: string; // Gateway transaction ID
  
  // Payout-specific fields
  instructorId?: mongoose.Types.ObjectId;
  payoutMethod?: "bank" | "bkash" | "nagad" | "rocket";
  accountDetails?: string;
  
  // Common fields
  description: string;
  metadata?: any; // Store gateway-specific data
  
  // Commission and fees
  platformFee?: number;
  gatewayFee?: number;
  netAmount?: number; // Amount after fees
  
  // References
  parentTransactionId?: mongoose.Types.ObjectId; // For refunds
  
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
const TransactionSchema = new Schema<ITransactionDocument>(
  {
    type: {
      type: String,
      enum: ["payment", "payout", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["BDT", "USD"],
      default: "BDT",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    
    // Payment-specific fields
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function(this: ITransactionDocument) {
        return this.type === "payment";
      },
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: function(this: ITransactionDocument) {
        return this.type === "payment";
      },
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "rocket", "card", "bank"],
      required: function(this: ITransactionDocument) {
        return this.type === "payment";
      },
    },
    paymentId: {
      type: String,
      required: function(this: ITransactionDocument) {
        return this.type === "payment" && this.status === "completed";
      },
    },
    
    // Payout-specific fields
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function(this: ITransactionDocument) {
        return this.type === "payout";
      },
    },
    payoutMethod: {
      type: String,
      enum: ["bank", "bkash", "nagad", "rocket"],
      required: function(this: ITransactionDocument) {
        return this.type === "payout";
      },
    },
    accountDetails: {
      type: String,
      required: function(this: ITransactionDocument) {
        return this.type === "payout";
      },
    },
    
    // Common fields
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    
    // Commission and fees
    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    gatewayFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    netAmount: {
      type: Number,
      min: 0,
    },
    
    // References
    parentTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    
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
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ paymentId: 1 });
TransactionSchema.index({ parentTransactionId: 1 });

// ─── Pre-save middleware ─────────────────────────────────────────────────────
TransactionSchema.pre('save', function(next: any) {
  // Calculate net amount if not set
  if (this.netAmount === undefined) {
    this.netAmount = this.amount - (this.platformFee || 0) - (this.gatewayFee || 0);
  }
  
  // Set processedAt when status changes to completed
  if (this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  
  next();
});

// ─── Methods ──────────────────────────────────────────────────────────────────
TransactionSchema.methods.markCompleted = function(paymentId?: string) {
  this.status = "completed";
  this.processedAt = new Date();
  if (paymentId) {
    this.paymentId = paymentId;
  }
  return this.save();
};

TransactionSchema.methods.markFailed = function(reason?: string) {
  this.status = "failed";
  if (reason) {
    this.metadata = { ...this.metadata, failureReason: reason };
  }
  return this.save();
};

TransactionSchema.methods.createRefund = function(refundAmount?: number) {
  const refundData = {
    type: "refund" as const,
    amount: refundAmount || this.amount,
    currency: this.currency,
    studentId: this.studentId,
    courseId: this.courseId,
    description: `Refund for transaction ${this._id}`,
    parentTransactionId: this._id,
    metadata: {
      originalTransactionId: this._id,
      originalAmount: this.amount,
    },
  };
  
  return new (this.constructor as any)(refundData);
};

// ─── Static methods ───────────────────────────────────────────────────────────
TransactionSchema.statics.calculateInstructorEarnings = function(instructorId: string, startDate?: Date, endDate?: Date) {
  const matchStage: any = {
    type: "payment",
    status: "completed",
    instructorId: new mongoose.Types.ObjectId(instructorId),
  };
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalPlatformFees: { $sum: "$platformFee" },
        totalGatewayFees: { $sum: "$gatewayFee" },
        netEarnings: { $sum: "$netAmount" },
        transactionCount: { $sum: 1 },
      },
    },
  ]);
};

// ✅ Better model export pattern
const Transaction = mongoose.models.Transaction || mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);
export default Transaction;