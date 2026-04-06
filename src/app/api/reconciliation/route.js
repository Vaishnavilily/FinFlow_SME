import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Fetch internal transactions that are NOT reconciled yet
    const pendingInternalTransactions = await Transaction.find({ 
      isReconciled: { $ne: true } 
    }).sort({ date: -1 }).lean();

    // 2. Generate the "Mock Bank Feed"
    const bankFeed = [];
    
    // Create perfect mock bank items based on real internal transactions
    pendingInternalTransactions.forEach((tx) => {
      // Simulate real bank descriptions which are often uppercase and messy
      const prefix = tx.type === 'Income' ? 'DEPOSIT DEPOSIT-WEB ' : 'VISA DEBIT ';
      bankFeed.push({
        id: `bank-${tx._id}`,
        date: tx.date,
        description: `${prefix}${tx.description.toUpperCase().substring(0, 15)}`,
        amount: tx.type === 'Income' ? tx.amount : -tx.amount,
        type: tx.type,
        // Pre-compute the suggestion logic
        suggestedMatch: tx
      });
    });

    // Generate a couple of completely random, unmatched mock bank items
    const today = new Date();
    bankFeed.push({
      id: `bank-random-1`,
      date: new Date(today.getTime() - 86400000 * 2), // 2 days ago
      description: "MONTHLY ACCOUNT FEE",
      amount: -12.50,
      type: "Expense",
      suggestedMatch: null
    });

    bankFeed.push({
      id: `bank-random-2`,
      date: new Date(today.getTime() - 86400000 * 5), // 5 days ago
      description: "ACH TRANSFER IN - STRIPE",
      amount: 450.00,
      type: "Income",
      suggestedMatch: null
    });

    // Shuffle the bank feed to make it look realistic
    bankFeed.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Send back both the structured feed (with matches) and the raw pending internal pool (useful for manual matching UI)
    return NextResponse.json({ 
      success: true, 
      data: {
        bankFeed,
        internalUnreconciled: pendingInternalTransactions
      } 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
