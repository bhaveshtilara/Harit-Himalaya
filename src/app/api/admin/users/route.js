import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || tokenData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const query = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } }, 
            { email: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}