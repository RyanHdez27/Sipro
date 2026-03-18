"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Home,
  Award,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
  GraduationCap,
  Building,
} from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  role?: string;
  university?: string;
  career?: string;
  semester?: string;
  linkedin_url?: string;
  github_url?: string;
  created_at?: string;
}

const DEFAULT_PROFILE: Partial<UserProfile> = {
  bio: "",
  role: "Estudiante",
  university: "",
  career: "",
  semester: "",
  linkedin_url: "",
  github_url: "",
};

export default function MiPerfil() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentUser();
        const merged = { ...DEFAULT_PROFILE, ...data };
        setUserProfile(merged);
        setEditedProfile(merged);
      } catch {
        // Session expired or no token → redirect to login
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleEditToggle = () => {
    if (isEditing) setEditedProfile(userProfile);
    setIsEditing(!isEditing);
    setMessage("");
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateCurrentUser({
        name: editedProfile.name,
        phone: editedProfile.phone,
        avatar_url: editedProfile.avatar_url,
        wants_newsletter: undefined,
      });
      const merged = { ...DEFAULT_PROFILE, ...updated };
      setUserProfile(merged);
      setEditedProfile(merged);
      setIsEditing(false);
      setMessage("✅ Perfil actualizado con éxito");
    } catch (e: any) {
      setMessage(`❌ ${e.message || "Error al guardar"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const profileCompletion = () => {
    if (!userProfile) return 0;
    const fields = [
      userProfile.name,
      userProfile.email,
      userProfile.bio,
      userProfile.university,
      userProfile.career,
      userProfile.semester,
    ];
    const completed = fields.filter((f) => f && f.trim() !== "").length;
    return Math.round((completed / fields.length) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const current = isEditing ? editedProfile : userProfile;
  if (!current) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-gray-600">Gestiona tu información personal</p>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-gray-300">
              <Home className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar & Basic Info */}
            <Card className="shadow-md border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-100 flex items-center justify-center">
                      {current.avatar_url ? (
                        <img src={current.avatar_url} alt={current.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{current.name}</h2>

                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <Award className="w-4 h-4" />
                    {current.role || "Estudiante"}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Mail className="w-4 h-4" />
                    {current.email}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Miembro desde {formatDate(current.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Completitud del Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-semibold text-blue-600">{profileCompletion()}%</span>
                  </div>
                  <Progress value={profileCompletion()} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {profileCompletion() === 100 ? "¡Perfil completo! 🎉" : "Completa tu perfil para aprovechar todas las funciones"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Actions */}
            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <Button onClick={handleEditToggle} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button onClick={handleEditToggle} variant="outline" className="border-gray-300">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              )}
            </div>

            {/* Personal Information */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Información Personal
                </CardTitle>
                <CardDescription>Datos básicos de tu perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    {isEditing ? (
                      <Input id="name" value={current.name} onChange={(e) => handleInputChange("name", e.target.value)} className="mt-1" />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg">{current.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded-lg">
                      {current.email}
                      <span className="text-xs text-gray-500 block mt-1">(No se puede modificar)</span>
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  {isEditing ? (
                    <Input id="phone" value={current.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} className="mt-1" placeholder="+57 300 000 0000" />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg">{current.phone || "—"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="avatar_url">URL de imagen de perfil</Label>
                  {isEditing ? (
                    <Input id="avatar_url" value={current.avatar_url || ""} onChange={(e) => handleInputChange("avatar_url", e.target.value)} className="mt-1" placeholder="https://..." />
                  ) : (
                    <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg">{current.avatar_url || "—"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={current.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="mt-1 min-h-[100px]"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg leading-relaxed">{current.bio || "—"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  Información Académica
                </CardTitle>
                <CardDescription>Detalles de tu formación universitaria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="university">Universidad</Label>
                  {isEditing ? (
                    <Input id="university" value={current.university || ""} onChange={(e) => handleInputChange("university", e.target.value)} className="mt-1" />
                  ) : (
                    <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">{current.university || "—"}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="career">Carrera</Label>
                    {isEditing ? (
                      <Input id="career" value={current.career || ""} onChange={(e) => handleInputChange("career", e.target.value)} className="mt-1" />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-900">{current.career || "—"}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="semester">Semestre</Label>
                    {isEditing ? (
                      <Input id="semester" value={current.semester || ""} onChange={(e) => handleInputChange("semester", e.target.value)} className="mt-1" />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-900">{current.semester || "—"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                  Enlaces Profesionales
                </CardTitle>
                <CardDescription>Tus perfiles en redes profesionales (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  {isEditing ? (
                    <Input id="linkedin" value={current.linkedin_url || ""} onChange={(e) => handleInputChange("linkedin_url", e.target.value)} className="mt-1" placeholder="https://linkedin.com/in/tu-perfil" />
                  ) : current.linkedin_url ? (
                    <a href={current.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 mt-1 p-2 bg-gray-50 rounded-lg block hover:bg-blue-50 transition-colors">
                      {current.linkedin_url}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1 p-2 bg-gray-50 rounded-lg">—</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  {isEditing ? (
                    <Input id="github" value={current.github_url || ""} onChange={(e) => handleInputChange("github_url", e.target.value)} className="mt-1" placeholder="https://github.com/tu-usuario" />
                  ) : current.github_url ? (
                    <a href={current.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 mt-1 p-2 bg-gray-50 rounded-lg block hover:bg-blue-50 transition-colors">
                      {current.github_url}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1 p-2 bg-gray-50 rounded-lg">—</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
