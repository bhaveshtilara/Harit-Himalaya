import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import Journey from '@/models/journey.model';
import { NextResponse } from 'next/server';
import Location from '@/models/location.model';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const journeys = await Journey.find({ trekker: tokenData.id })
      .populate('location', 'trailName') 
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      data: journeys,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}