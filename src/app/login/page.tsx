import { Input } from "@/components/ui/input";
import { login } from "./actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <form>
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Admin Login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email">Email:</label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex gap-2">
              <Button formAction={login} className="w-full items-end">
                Log in
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
