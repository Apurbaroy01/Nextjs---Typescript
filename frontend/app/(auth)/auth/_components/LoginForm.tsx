"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../_actions/authAction";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const LoginForm = () => {

  const [state, formAction, isPending] = useActionState(loginAction, false);

  useEffect(() => {
    if (!state) return;
    if(state?.success) {
      toast.success(state.message || 'Logged in successfully');
    } else {
      toast.error(state.message || 'Failed to login');
    }
  }, [state]);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          className="w-full"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="w-full"
          required
        />
      </div>
      <Button type="submit" className="w-full mt-2 font-medium">
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;