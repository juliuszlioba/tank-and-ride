import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export default async function WebsiteAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex justify-end p-8">
        <Button asChild variant="secondary" className="items-end">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end justify-center gap-2 p-8">
      {user.email}
      <form action={signOut} className="inline-flex">
        <Button variant="secondary">Logout</Button>
      </form>
    </div>
  );
}
