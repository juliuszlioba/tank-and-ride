import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { login } from "./actions";

const errorMessages: Record<string, string> = {
  missing: "Please enter email and password.",
  invalid: "Invalid email or password.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  const { error } = await searchParams;
  const errorMessage = error ? (errorMessages[error] ?? null) : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <form action={login}>
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Admin Login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
            <Button type="submit" className="w-full items-end">
              Log in
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
