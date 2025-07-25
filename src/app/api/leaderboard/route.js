import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const topUsers = await User.find({ role: 'TREKKER' }) 
      .sort({ points: -1 })
      .limit(20) 
      .select('name points'); 
    return NextResponse.json({
      success: true,
      data: topUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}