"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`http://localhost:8000/auth/reset-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.msg || "Password reset link sent to your email.");
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Restablecer contraseña</CardTitle>
          <CardDescription>Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña</CardDescription>
        </CardHeader>
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">{error}</div>}
            {message && <div className="p-3 text-sm text-primary bg-primary/10 rounded-md">{message}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo electrónico"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit">
              Enviar enlace de restablecimiento
            </Button>
            <div className="text-sm text-center text-muted-foreground w-full">
              ¿Ya tienes una contraseña?{" "}
              <a href="/auth/login" className="text-primary hover:underline font-medium">
                Iniciar sesión
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
