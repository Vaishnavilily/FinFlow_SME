import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BankConnection from "@/models/BankConnection";

export async function GET() {
  try {
    await connectToDatabase();
    const connections = await BankConnection.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: connections });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Simulate initial bank connection balance logic with some random data
    if (!body.balance) {
      body.balance = Math.floor(Math.random() * 5000) + 1000;
    }
    if (!body.accountMask) {
      // Generate random 4 digits
      body.accountMask = Math.floor(1000 + Math.random() * 9000).toString();
    }
    
    body.status = 'Connected';
    body.lastSync = new Date();

    const connection = await BankConnection.create(body);
    return NextResponse.json({ success: true, data: connection }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
