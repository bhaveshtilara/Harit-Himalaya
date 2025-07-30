import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import Location from '@/models/location.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user = await User.findById(tokenData.id).select('-password').populate('assignedLocation');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (user.status === 'BLOCKED') {
        return NextResponse.json({ error: 'User is blocked' }, { status: 403 });
    }
    return NextResponse.json({
      success: true,
      message: 'User found',
      data: user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}