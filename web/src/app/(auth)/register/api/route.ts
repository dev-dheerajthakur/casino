import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export function POST(req: NextRequest) {
  console.log(req);
  return NextResponse.json(
    { message: "Register API endpoint" },
    { status: 200 }
  );
}

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 10000);
  });
}


export async function handlerRegister(state: any, formData: FormData) {
  "use server";
  console.log("calling");
  const result = await resolveAfter2Seconds();
  console.log(formData);

  return { error: "Invalid data Try again!" };
}