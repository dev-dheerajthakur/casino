"use server";

import { api } from "@/axios/api";
import { cookies } from "next/headers";

type ReturnValueType = {
  isValidToken: boolean;
  parsedToken?: any;
};

export async function validateAuthToken(
  token: string | undefined
): Promise<ReturnValueType> {
  if (!token) return { isValidToken: false };

  try {
    const axiosRes = await api.post("/users/validate-token", {
      token,
    });
    console.log(axiosRes.data);

    return {
      isValidToken: axiosRes.data.data.isValidToken,
      parsedToken: axiosRes.data.data.parsedToken,
    };
  } catch (error) {
    return {
      isValidToken: false,
    };
  }
}
