"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      // DEV BYPASS: Load mock user data if no token
      const token = localStorage.getItem("token");
      if (!token) {
          setName("Usuario Pruebas");
          setEmail("pruebas@sipro.edu.co");
          setPhone("+57 300 123 4567");
          setAvatarUrl("https://api.dicebear.com/7.x/notionists/svg?seed=Felix");
          setWantsNewsletter(true);
          setLoading(false);
          return;
      }

      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone || "");
          setAvatarUrl(data.avatar_url || "");
          setWantsNewsletter(data.wants_newsletter);
        } else {
            console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    
    // DEV BYPASS: Allow mock updating without crash
    if (!token) {
        setMessage("¡Perfil simulado actualizado con éxito (Modo Dev)!");
        setPassword("");
        return;
    }

    try {
      const payload: any = { 
        name, 
        wants_newsletter: wantsNewsletter,
        phone,
        avatar_url: avatarUrl 
      };
      if (password) payload.password = password;

      const res = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("¡Perfil actualizado con éxito!");
        setPassword(""); // Clear password field after update
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.detail || "No se pudo actualizar"}`);
      }
    } catch (error) {
      setMessage("Error de conexión");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando perfil...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal y preferencias</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico (No modificable)</Label>
                  <Input id="email" type="email" value={email} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57 300..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">URL de Imagen de Perfil</Label>
                  <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://ejemplo.com/mifoto.jpg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Nueva Contraseña (Opcional)</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Déjalo en blanco para mantener la actual"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Checkbox 
                    id="newsletter" 
                    checked={wantsNewsletter}
                    onCheckedChange={(checked) => setWantsNewsletter(checked as boolean)}
                  />
                  <Label htmlFor="newsletter" className="text-sm font-normal leading-snug">
                    Deseo recibir correos con material de estudio y novedades (Recomendado)
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Guardar Cambios</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
