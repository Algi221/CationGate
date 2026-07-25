"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function FounderLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate backend call for Founder
    setTimeout(() => {
      if (username === "founder" && password === "founder") {
        // Successful login
        localStorage.setItem("founder_token", "dummy-founder-token");
        router.push("/founder/dashboard");
      } else {
        setError("Username atau password salah");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          CG
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">CationGate</span>
      </div>

      <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Founder Portal</CardTitle>
          <CardDescription>Masuk untuk mengelola sistem SaaS CationGate</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="dark:bg-slate-900 dark:border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark:bg-slate-900 dark:border-slate-800"
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Memproses..." : "Masuk ke Sistem"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Akses terbatas hanya untuk administrator pusat (Founder). 
            Demo credential: <br/><code>founder / founder</code>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
