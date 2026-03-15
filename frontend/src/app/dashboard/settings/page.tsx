"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, Lock, Palette } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  const router = useRouter();
  
  // Mock Settings State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setIsSaving(true);
    setMessage("");
    
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      setMessage("Configuraciones guardadas localmente (Modo Dev).");
    }, 800);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>

          <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
            <p className="text-muted-foreground">
              Administra las preferencias de tu cuenta y ajustes del sistema.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Notifications Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notificaciones</CardTitle>
                  <CardDescription>Controla qué alertas deseas recibir.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Correos Electrónicos</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones y recordatorios de tutorías en tu email.
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifs} 
                    onCheckedChange={setEmailNotifs} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Mensajes SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas urgentes directamente a tu teléfono móvil.
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifs} 
                    onCheckedChange={setSmsNotifs} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Palette className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Apariencia</CardTitle>
                  <CardDescription>Personaliza cómo se ve el entorno.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Cambia el tema visual de SIPRO a colores oscuros.
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Privacidad</CardTitle>
                  <CardDescription>Ajustes de visibilidad de tu cuenta.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Perfil Público Estudiantil</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que otros estudiantes del semillero vean tu perfil.
                    </p>
                  </div>
                  <Switch 
                    checked={publicProfile} 
                    onCheckedChange={setPublicProfile} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
               {message && (
                  <div className="p-3 w-full sm:w-auto rounded-md text-sm bg-green-50 text-green-600 border border-green-200">
                    {message}
                  </div>
                )}
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full sm:w-auto ml-auto"
                size="lg"
              >
                {isSaving ? "Guardando..." : "Guardar Preferencias"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
