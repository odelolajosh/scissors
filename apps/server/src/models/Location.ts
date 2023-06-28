import { Schema, model, Model, Document } from 'mongoose';

interface LocationDefinition extends Document {
  ip: string;
  browser: string;
  slId: Schema.Types.ObjectId;
  visits: number;
}

const LocationSchema = new Schema<LocationDefinition, Model<LocationDefinition>>(
  {
    ip: { type: String, required: true },
    browser: { type: String, required: true },
    slId: { type: Schema.Types.ObjectId, ref: 'SL', required: true },
    visits: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Location = model<LocationDefinition, Model<LocationDefinition>>('Location', LocationSchema);
export default Location;
