import mongoose from 'mongoose';

const FinancialDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  fields: {
    necessities: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    investment: { type: Number, default: 0 },
    leisure: { type: Number, default: 0 },
    charity: { type: Number, default: 0 },
  },
});

export default mongoose.models.FinancialData || mongoose.model('FinancialData', FinancialDataSchema);
