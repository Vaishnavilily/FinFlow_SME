import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Estimate from "@/models/Estimate";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const updated = await Estimate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await Estimate.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
