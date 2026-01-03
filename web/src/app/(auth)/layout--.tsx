"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  const cookieStore = await cookies();
  const auth_token = cookieStore.get("auth_token")?.value;
  if(auth_token) redirect("/casino")

  return children;
}
