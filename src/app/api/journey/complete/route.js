import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import Journey from '@/models/journey.model';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const verifierData = getDataFromToken(request);
    if (!verifierData) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    const verifier = await User.findById(verifierData.id);
    if (!verifier || verifier.role !== 'VERIFIER') {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }
    const { journeyId, wasteCollectedKg } = await request.json();

    const journey = await Journey.findById(journeyId);
    if (!journey) {
      return NextResponse.json(
        { success: false, message: 'Journey not found' },
        { status: 404 }
      );
    }
    if (journey.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, message: 'Journey is already completed' },
        { status: 400 }
      );
    }
    journey.status = 'COMPLETED';
    journey.wasteCollectedKg = wasteCollectedKg;
    journey.endTime = new Date();
    journey.endVerifier = verifier._id;
    await journey.save();
    const pointsAwarded = Math.round(wasteCollectedKg * 10); 
    await User.findByIdAndUpdate(journey.trekker, {
      $inc: { points: pointsAwarded },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Journey completed successfully',
        pointsAwarded,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}