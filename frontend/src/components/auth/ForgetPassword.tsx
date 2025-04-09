"use client";

import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitButton } from "../common/SubmitButton";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { forgetPasswordAction } from "@/actions/authActions";

export default function ForgetPassword() {
  const initialState = {
    status: 0,
    message: "",
    errors: {},
  };
  const [state, formAction] = useFormState(forgetPasswordAction, initialState);
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email..."
        />
        <span className="text-sm text-red-500">{state.errors?.email}</span>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
