"use server";
import { api } from "@/axios/api";
import { AxiosError } from "axios";
import { error } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import z, { email } from "zod";

export async function POST(req: NextRequest) {
  const res = NextResponse;

  return res.json("sldkaj", {
    headers: {
      setCookie: "hello",
    },
  });
}

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}

export async function handlerRegister(state: any, formData: FormData) {
  "use server";

  const schema = z.object({
    username: z
      .string({ message: "Username required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" }),
    password: z
      .string({ message: "Password required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" }),
    email: z.email({ message: "Invalid email address" }),
  });

  try {
    const parsedData = await schema.safeParseAsync({
      username: formData.get("username")?.toString().split(" ").join("").toLowerCase(),
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString().trim(),
    });

    if (!parsedData.success) {
      return {
        error: parsedData.error.issues,
      };
    }

    try {
      const axiosRes = await api.post("/users/register", parsedData.data);

      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth_token",
        value: axiosRes?.data?.data?.accessToken,
        httpOnly: true,
        secure: true, // REQUIRED for HTTPS
        sameSite: "lax", // or "strict"
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

    } catch (err: unknown) {
      console.log("in catch");
      console.log(err);
      if (!(err instanceof AxiosError)) {
        console.log("Unknown error", err);
        return { error: "An unknown error occurred" };
      };
      const er = err as AxiosError;
      console.error("Registration failed:", er?.response?.data);
    }
  } catch (error) {
    return error;
  }


redirect('/casino')
}
