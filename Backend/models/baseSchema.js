import { Schema } from 'mongoose';

const baseSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  isActive: { type: Boolean, default: true, required: true },
  createdBy: { type: String, required: true, default: 'system' },
  createdOn: { type: Date, required: true, default: Date.now },
  modifiedBy: { type: String, default: null }, 
  modifiedOn: { type: Date, default: null }
}, { _id: false });

export default baseSchema;