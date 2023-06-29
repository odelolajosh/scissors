import { Schema, model, Model, Document } from 'mongoose';

interface LocationDefinition extends Document {
  ip: string;
  browser?: string;
  slName: string;
  userId?: Schema.Types.ObjectId;
}

const LocationSchema = new Schema<LocationDefinition, Model<LocationDefinition>>(
  {
    ip: { type: String, required: true },
    browser: { type: String },
    slName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Location = model<LocationDefinition, Model<LocationDefinition>>('Location', LocationSchema);
export default Location;
