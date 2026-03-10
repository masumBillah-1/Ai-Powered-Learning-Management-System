import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IAssessmentResult {
  lessonId: string;
  type: "quiz" | "assignment";
  score: number;
  maxScore: number;
  submittedAt: Date;
  feedback?: string;
  attempt?: number;
}

export interface ICertificate {
  issued: boolean;
  issuedAt?: Date;
  certificateUrl?: string;
  verificationCode?: string;
}

export interface IProgress {
  completedLessons: string[];
  currentLesson?: string;
  progressPercentage: number;
  totalTimeSpent: number; // in minutes
  lastAccessedAt: Date;
}

export interface IEnrollmentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progress: IProgress;
  results?: IAssessmentResult[];
  certificate?: ICertificate;
  status: "active" | "completed" | "dropped";
  enrolledAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub Schemas ──────────────────────────────────────────────────────────────
const AssessmentResultSchema = new Schema<IAssessmentResult>({
  lessonId: { type: String, required: true },
  type: { type: String, enum: ["quiz", "assignment"], required: true },
  score: { type: Number, required: true, min: 0 },
  maxScore: { type: Number, required: true, min: 0 },
  submittedAt: { type: Date, required: true, default: Date.now },
  feedback: { type: String, default: "" },
  attempt: { type: Number, default: 1, min: 1 },
});

const CertificateSchema = new Schema<ICertificate>({
  issued: { type: Boolean, default: false },
  issuedAt: { type: Date },
  certificateUrl: { type: String, default: "" },
  verificationCode: { type: String, default: "" },
});

const ProgressSchema = new Schema<IProgress>({
  completedLessons: [{ type: String }],
  currentLesson: { type: String, default: "" },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  totalTimeSpent: { type: Number, default: 0, min: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
});

// ─── Main Schema ──────────────────────────────────────────────────────────────
const EnrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: ProgressSchema,
      required: true,
      default: () => ({
        completedLessons: [],
        currentLesson: "",
        progressPercentage: 0,
        totalTimeSpent: 0,
        lastAccessedAt: new Date(),
      }),
    },
    results: [AssessmentResultSchema],
    certificate: {
      type: CertificateSchema,
      default: () => ({
        issued: false,
        issuedAt: null,
        certificateUrl: "",
        verificationCode: "",
      }),
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    enrolledAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "enrollments",
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
EnrollmentSchema.index({ studentId: 1 });
EnrollmentSchema.index({ courseId: 1 });
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ enrolledAt: -1 });

// ─── Methods ──────────────────────────────────────────────────────────────────
EnrollmentSchema.methods.updateProgress = function(lessonId: string, timeSpent: number = 0) {
  if (!this.progress.completedLessons.includes(lessonId)) {
    this.progress.completedLessons.push(lessonId);
  }
  this.progress.currentLesson = lessonId;
  this.progress.totalTimeSpent += timeSpent;
  this.progress.lastAccessedAt = new Date();
  
  // Calculate progress percentage (this would need course data to be accurate)
  // For now, we'll update it when we have the total lesson count
  return this.save();
};

EnrollmentSchema.methods.addAssessmentResult = function(result: Omit<IAssessmentResult, 'submittedAt'>) {
  const assessmentResult: IAssessmentResult = {
    ...result,
    submittedAt: new Date(),
  };
  
  if (!this.results) {
    this.results = [];
  }
  
  this.results.push(assessmentResult);
  return this.save();
};

EnrollmentSchema.methods.issueCertificate = function(certificateUrl: string, verificationCode: string) {
  this.certificate = {
    issued: true,
    issuedAt: new Date(),
    certificateUrl,
    verificationCode,
  };
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// ✅ Better model export pattern
const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollmentDocument>("Enrollment", EnrollmentSchema);
export default Enrollment;