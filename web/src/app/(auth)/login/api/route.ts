"use server";

import { api } from "@/axios/api";
import { AxiosError } from "axios";
import { waitForDebugger } from "inspector";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z, { email } from "zod";

export async function POST() {}

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 5000);
  });
}
export async function handleLoging(state: unknown, formData: FormData) {
  "use server";
  const schema = z.object({
    emailOrUsername: z
      .string({ message: "email or username required!" })
      .min(3, {
        message: "username or email length must be at least 3 character long",
      })
      .max(50, {
        message:
          "username or email lenght must be less than 50 character long.",
      }),
    password: z
      .string({ message: "password is required!d" })
      .min(3, { message: "password length must be at least 3 character long" })
      .max(50, {
        message: "password lenght must be less than 50 character long.",
      }),
  });

  const parsedData = await schema.safeParseAsync({
    emailOrUsername: formData
      .get("emailOrUsername")
      ?.toString()
      .split(" ")
      .join(""),
    password: formData.get("password")?.toString().trim(),
  });
  if (!parsedData.success) return parsedData.error.issues;

  try {
    const axiosRes = await api.post("/users/login", parsedData.data);
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

  } catch (err) {
    console.log("in catch");
    console.log(err);
    if (!(err instanceof AxiosError)) {
      console.log("Unknown error", err);
      return { error: "An unknown error occurred" };
    }
    const er = err as AxiosError;
    // console.error("Registration failed:", er?.response?.data);
    return er.response?.data
  }

  redirect("/casino")

  console.log(parsedData);
  await resolveAfter2Seconds();
  return { hi: "hello" };
}
