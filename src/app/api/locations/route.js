import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import Location from '@/models/location.model';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { name, trailName, state } = await request.json();
    const newLocation = new Location({ name, trailName, state });
    await newLocation.save();

    return NextResponse.json({
      success: true,
      message: 'Location created successfully',
      data: newLocation,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET() {
    await dbConnect();
    try {
        const locations = await Location.find({});
        return NextResponse.json({
            success: true,
            data: locations
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}