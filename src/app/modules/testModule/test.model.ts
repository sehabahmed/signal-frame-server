import mongoose, { Schema } from "mongoose";
import { TTest } from "./test.interface";

const testSchema = new Schema<TTest>({
  test: {
    type: String,
    required: true,
  },
  test2: {
    type: Number,
    required: true,
  },
  tests: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
});

export const Test = mongoose.model<TTest>('Test', testSchema);
