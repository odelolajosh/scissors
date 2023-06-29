import { Schema, model, Model, Document } from 'mongoose';

// Short Link Definition
export interface SLDefinition extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  url: string;
  shortLink: string;
  isCustom: boolean;
  visits?: number;
  qrUrl?: string;
}

const SLSchema = new Schema<SLDefinition, Model<SLDefinition>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true, unique: true },
    shortLink: { type: String, required: true, unique: true },
    isCustom: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
    qrUrl: { type: String }
  },
  { timestamps: true }
);

const SL = model<SLDefinition, Model<SLDefinition>>('SL', SLSchema);
export default SL;
