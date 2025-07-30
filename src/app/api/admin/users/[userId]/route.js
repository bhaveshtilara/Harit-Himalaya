import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function PUT(request, context) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // --- NEW WORKAROUND: Manually parse the ID from the URL ---
    const urlParts = request.nextUrl.pathname.split('/');
    const userId = urlParts[urlParts.length - 1];
    // This bypasses the problematic context.params object entirely.
    // --- END OF WORKAROUND ---

    const { role, assignedLocation, status } = await request.json();

    if (!userId) {
        return NextResponse.json({ success: false, message: 'User ID not found in URL.' }, { status: 400 });
    }

    if (role === 'VERIFIER' && !assignedLocation) {
      return NextResponse.json(
        { success: false, message: 'A location must be assigned to a user with the VERIFIER role.' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    updateData.assignedLocation = (role === 'VERIFIER') ? assignedLocation : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}