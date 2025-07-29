import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import Location from '@/models/location.model';
import Journey from '@/models/journey.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    const userCount = await User.countDocuments();
    const locationCount = await Location.countDocuments();
    const completedJourneysCount = await Journey.countDocuments({ status: 'COMPLETED' });

    return NextResponse.json({
      success: true,
      data: {
        users: userCount,
        locations: locationCount,
        completedJourneys: completedJourneysCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}