"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <div className="glass-card w-full max-w-md p-8 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-accent-brown">Pulse</h1>
          <p className="text-accent-brown/60">Small steps, big changes.</p>
        </div>

        <div className="py-10 flex justify-center">
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌱</span>
             </div>
        </div>

        <button
          onClick={() => signIn("google")}
          className="w-full py-4 px-6 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
        >
          Sign in with Google
        </button>
        
        <p className="text-xs text-accent-brown/40">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
