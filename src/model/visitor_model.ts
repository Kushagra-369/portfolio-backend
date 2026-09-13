import mongoose, { Document, Schema } from "mongoose";

export interface IVisitor extends Document {
  visitorId: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);

export default Visitor;