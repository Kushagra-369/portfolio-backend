import mongoose, { Document, Schema } from "mongoose";

export interface IVisitor extends Document {
  visitorId: string;
  date: string;
  createdAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    visitorId: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// One device/browser can be counted only once per day
visitorSchema.index(
  { visitorId: 1, date: 1 },
  { unique: true }
);


const Visitor = mongoose.model<IVisitor>(
  "Visitor",
  visitorSchema
);

export default Visitor;