"use client";

import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { SubmitButton } from "../common/SubmitButton";
import { useFormState } from "react-dom";
import { loginAction } from "@/actions/authActions";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function Login() {
  const initialState = {
    status: 0,
    message: "",
    errors: {},
    data: {},
  };
  const [state, formAction] = useFormState(loginAction, initialState);
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      signIn("credentials", {
        email: state.data.email,
        password: state.data.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password..."
        />
        <span className="text-sm text-red-500">{state.errors?.password}</span>
        <div className="text-right font-bold">
          <Link href="forget-password" className="text">
            Forget Password ?
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
