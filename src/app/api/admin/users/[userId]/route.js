import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    const { userId } = params;
    const { role, assignedLocation } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role, assignedLocation },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}