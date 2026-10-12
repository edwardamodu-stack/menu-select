
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const menu = [
  { id: 1, name: "White Rice and Stew", price: 2000 },
  { id: 2, name: "White Rice and Vegetable", price: 2500 },
  { id: 3, name: "Fufu with Egusi", price: 2000 },
  { id: 4, name: "Fufu with Vegetable Soup", price: 2000 },
  { id: 5, name: "Eba with Egusi", price: 2000 },
  { id: 6, name: "Eba with Vegetable Soup", price: 2000 },
  { id: 7, name: "Semo with Egusi", price: 2000 },
  { id: 8, name: "Semo with Vegetable Soup", price: 2000 },
  { id: 9, name: "Shawarma", price: 6000, sundayOnly: true },
];

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secret) {
      return NextResponse.json(
        { error: "Server configuration is incomplete." },
        { status: 500 }
      );
    }

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const part = (type: string) =>
      parts.find((entry) => entry.type === type)?.value;

    const weekday = part("weekday");
    const minutes = Number(part("hour")) * 60 + Number(part("minute"));

    if (minutes >= 14 * 60 + 30) {
      return NextResponse.json(
        { error: "Ordering is closed. Please order before 2:30 PM." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const customerName =
      typeof body.customerName === "string" ? body.customerName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const requestedItems = body.items;

    if (
      customerName.length < 2 ||
      customerName.length > 100 ||
      !/^[+0-9()\-\s]{7,20}$/.test(phone) ||
      !Array.isArray(requestedItems) ||
      requestedItems.length === 0
    ) {
      return NextResponse.json(
        { error: "Enter a valid name, phone number, and order." },
        { status: 400 }
      );
    }

    const orderItems = [];
    let total = 0;

    for (const requested of requestedItems) {
      const item = menu.find((meal) => meal.id === requested.id);
      const quantity = requested.quantity;

      if (
        !item ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          { error: "An item or quantity is invalid." },
          { status: 400 }
        );
      }

      if ("sundayOnly" in item && weekday !== "Sun") {
        return NextResponse.json(
          { error: "Shawarma is available on Sundays only." },
          { status: 400 }
        );
      }

      const lineTotal = item.price * quantity;
      total += lineTotal;
      orderItems.push({
        id: item.id,
        name: item.name,
        quantity,
        price: item.price,
        lineTotal,
      });
    }

    const supabase = createClient(url, secret, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        phone,
        items: orderItems,
        total,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Order save failed:", error.message);
      return NextResponse.json(
        { error: "Couldn't save your order. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Order placed successfully.", orderId: data.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
