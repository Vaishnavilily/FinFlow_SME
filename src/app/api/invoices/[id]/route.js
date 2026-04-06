import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    
    // Check if invoice is Paid
    const existing = await Invoice.findById(id);
    if (existing && existing.status === 'Paid') {
      return NextResponse.json({ success: false, error: "Cannot edit a paid invoice." }, { status: 400 });
    }

    const updated = await Invoice.findByIdAndUpdate(id, body, { new: true, runValidators: true });
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
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
