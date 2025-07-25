import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user = await User.findById(tokenData.id).select('-password'); 
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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