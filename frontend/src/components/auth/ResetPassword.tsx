"use client";

import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { registerAction, resetPasswordAction } from "@/actions/authActions";
import { SubmitButton } from "../common/SubmitButton";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const initialState = {
    status: 0,
    message: "",
    errors: {},
  };

  const [state, formAction] = useFormState(resetPasswordAction, initialState);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="token"
        value={searchParams.get("token") ?? ""}
      />
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email..."
          readOnly
          value={searchParams.get("email") ?? ""}
        />
        <span className="text-sm text-red-500">{state.errors?.email}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password..."
        />
        <span className="text-sm text-red-500">{state.errors?.password}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="cpassword">Confirm Password</Label>
        <Input
          id="cpassword"
          type="password"
          name="confirm_password"
          placeholder="Confirm your password..."
        />
        <span className="text-sm text-red-500">
          {state.errors?.confirm_password}
        </span>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
