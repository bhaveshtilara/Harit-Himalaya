import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema(
  {
    trekker: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startVerifier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    endVerifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Location', 
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED'],
      default: 'ACTIVE',
    },
    wasteCollectedKg: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Journey =
  mongoose.models.Journey || mongoose.model('Journey', journeySchema);

export default Journey;