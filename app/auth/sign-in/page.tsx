import Link from "next/link";

import { SignInForm } from "@/components/auth/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "/dashboard";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Sign in with a magic link to access your personalized dashboard.
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <SignInForm nextPath={nextPath} />
      </div>
      <p className="text-center text-xs text-zinc-500">
        By continuing, you agree to our terms and privacy policy.
        {" "}
        <Link href="/pricing" className="text-emerald-600 underline">
          See plans
        </Link>
      </p>
    </div>
  );
}
