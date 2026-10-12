
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function isAuthorized(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("authorization");

  return Boolean(
    password &&
      provided &&
      provided === `Bearer ${password}`
  );
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error("Server configuration is incomplete.");
  }

  return createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ orders: data });
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Incorrect admin password." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = body.id;
    const status = body.status;

    if (
      !Number.isInteger(id) ||
      !["pending", "confirmed", "completed", "cancelled"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid order or status." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Order status updated." });
  } catch {
    return NextResponse.json(
      { error: "Unable to update order." },
      { status: 500 }
    );
  }
}
