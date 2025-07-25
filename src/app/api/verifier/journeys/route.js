import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import Journey from '@/models/journey.model';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const verifier = await User.findById(tokenData.id);
    if (!verifier || verifier.role !== 'VERIFIER') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    const activeJourneys = await Journey.find({
      location: verifier.assignedLocation,
      status: 'ACTIVE',
    })
      .populate('trekker', 'name email') 
      .sort({ createdAt: 'asc' }); 

    return NextResponse.json({
      success: true,
      data: activeJourneys,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}