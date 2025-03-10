"use server";
import { request } from "@arcjet/next";
import { protectSignUpRules } from "../arcjet";

export const protectSignUpActions = async (email: string) => {
  const req = await request();
  const decision = await protectSignUpRules.protect(req, { email });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE")) {
        return {
          error: "Please use a valid email address",
          success: false,
        };
      } else if (emailTypes.includes("INVALID")) {
        return {
          error: "Please use a valid email address",
          success: false,
        };
      }
    } else if (decision.reason.isBot()) {
      return {
        error: "Bots are not allowed to sign up",
        success: false,
      };
    } else if (decision.reason.isRateLimit()) {
      return {
        error: "Too many requests",
        success: false,
      };
    }
  }
  return {
    success: true,
  };
};
