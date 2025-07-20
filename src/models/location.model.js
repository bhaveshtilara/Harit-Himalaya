import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    trailName: {
      type: String,
      required: [true, 'Trail name is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      default: 'Uttarakhand',
    },
    // allows an Admin to enable or disable a location
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Location =
  mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;