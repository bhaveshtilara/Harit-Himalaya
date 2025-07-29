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
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const verifier = await User.findById(verifierData.id);
    if (!verifier || verifier.role !== 'VERIFIER') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }
    if (!verifier.assignedLocation) {
        return NextResponse.json(
            { success: false, message: 'You must be assigned to a location to start a journey.' },
            { status: 400 }
        );
    }
    const { trekkerEmail } = await request.json();
    if (!trekkerEmail) {
        return NextResponse.json({ success: false, message: 'Trekker email is required.' }, { status: 400 });
    }
    const trekker = await User.findOne({ email: trekkerEmail });
    if (!trekker) {
      return NextResponse.json({ success: false, message: 'Trekker not found with that email.' }, { status: 404 });
    }
    const existingActiveJourney = await Journey.findOne({ trekker: trekker._id, status: 'ACTIVE' });
    if(existingActiveJourney) {
        return NextResponse.json(
            { success: false, message: 'This trekker already has an active journey.' },
            { status: 400 }
        );
    }
    const newJourney = new Journey({
      trekker: trekker._id,
      startVerifier: verifier._id,
      location: verifier.assignedLocation,
    });

    await newJourney.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Journey started successfully',
        journey: newJourney,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}