import { NextRequest, NextResponse } from "next/server";
import { getMongoClientPromise, getMongoDbName } from "@/lib/mongodb";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, email, phone, trucks, weekly_revenue } = body;

    // Validation
    if (!first_name || typeof first_name !== "string") {
      return NextResponse.json(
        { success: false, error: "First name is required." },
        { status: 400 }
      );
    }
    const trimmedFirstName = first_name.trim();
    if (trimmedFirstName.length < 1) {
      return NextResponse.json(
        { success: false, error: "First name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const client = await getMongoClientPromise();
    const db = client.db(getMongoDbName());
    const leads = db.collection("early_access_leads");

    // Ensure unique email (best-effort; if already exists, this is quick no-op)
    await leads.createIndex({ email: 1 }, { unique: true });

    try {
      await leads.insertOne({
        first_name: trimmedFirstName,
        email: trimmedEmail,
        phone: phone && typeof phone === "string" ? phone.trim() || null : null,
        trucks: trucks && typeof trucks === "string" ? trucks.trim() || null : null,
        weekly_revenue:
          weekly_revenue && typeof weekly_revenue === "string"
            ? weekly_revenue.trim() || null
            : null,
        created_at: new Date(),
      });
    } catch (err: any) {
      // Duplicate key in Mongo
      if (err?.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            error: "This email is already on the list. We'll be in touch!",
          },
          { status: 409 }
        );
      }
      console.error("Mongo insert error:", err);
      return NextResponse.json(
        { success: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll reach out soon.",
    });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
