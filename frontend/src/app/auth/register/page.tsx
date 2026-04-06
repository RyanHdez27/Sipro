"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, wants_newsletter: wantsNewsletter }),
      });

      if (res.ok) {
        // Automatically redirect to login or login directly
        router.push("/auth/login");
      } else {
        const errData = await res.json();
        setError(errData.detail || "Error en el registro. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Fallo en la conexión al servidor. Inténtalo más tarde.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg my-8">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Crear cuenta</CardTitle>
          <CardDescription>Ingrese sus datos para crear su cuenta</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Nombre completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="newsletter" 
                checked={wantsNewsletter}
                onCheckedChange={(checked) => setWantsNewsletter(checked as boolean)}
              />
              <Label htmlFor="newsletter" className="text-xs font-normal leading-snug text-muted-foreground">
                Deseo recibir correos con material de estudio y novedades (Recomendado)
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit">
              Registrarse
            </Button>
            <div className="text-sm text-center text-muted-foreground w-full">
              ¿Ya tienes una cuenta?{" "}
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
