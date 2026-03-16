"use client";

import { useState } from "react";
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
  Building
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  university: string;
  career: string;
  semester: string;
  linkedin_url: string;
  github_url: string;
  created_at: string;
}

export default function MiPerfil() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos del usuario (normalmente vendrían de una API)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    name: "María García",
    email: "maria.garcia@universidad.edu.co",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Estudiante de Ingeniería de Sistemas apasionada por la inteligencia artificial y el desarrollo de software. Enfocada en preparar el Saber Pro con excelencia.",
    role: "Estudiante",
    university: "Universidad Nacional de Colombia",
    career: "Ingeniería de Sistemas",
    semester: "8vo Semestre",
    linkedin_url: "https://linkedin.com/in/mariagarcia",
    github_url: "https://github.com/mariagarcia",
    created_at: "2025-09-15"
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edición
      setEditedProfile(userProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Aquí se haría la llamada a la API PUT /user/profile
    setUserProfile(editedProfile);
    setIsEditing(false);
    // toast.success("Perfil actualizado correctamente");
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const profileCompletion = () => {
    const fields = [
      userProfile.name,
      userProfile.email,
      userProfile.bio,
      userProfile.university,
      userProfile.career,
      userProfile.semester
    ];
    const completedFields = fields.filter(field => field && field.trim() !== "").length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const currentProfile = isEditing ? editedProfile : userProfile;

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
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar & Basic Info */}
            <Card className="shadow-md border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                      <img 
                        src={currentProfile.avatar_url} 
                        alt={currentProfile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentProfile.name}
                  </h2>
                  
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <Award className="w-4 h-4" />
                    {currentProfile.role}
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Mail className="w-4 h-4" />
                    {currentProfile.email}
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Miembro desde {formatDate(currentProfile.created_at)}
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
                    <span className="text-sm font-semibold text-blue-600">
                      {profileCompletion()}%
                    </span>
                  </div>
                  <Progress value={profileCompletion()} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {profileCompletion() === 100 
                      ? "¡Perfil completo! 🎉" 
                      : "Completa tu perfil para aprovechar todas las funciones"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pruebas realizadas</span>
                  <span className="text-sm font-semibold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Puntaje promedio</span>
                  <span className="text-sm font-semibold text-green-600">245/300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Racha actual</span>
                  <span className="text-sm font-semibold text-orange-600">12 días</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Actions */}
            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <Button 
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleEditToggle}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
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
                <CardDescription>
                  Datos básicos de tu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={currentProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg">
                        {currentProfile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded-lg">
                      {currentProfile.email}
                      <span className="text-xs text-gray-500 block mt-1">
                        (No se puede modificar)
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={currentProfile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-1 min-h-[100px]"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg leading-relaxed">
                      {currentProfile.bio}
                    </p>
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
                <CardDescription>
                  Detalles de tu formación universitaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="university">Universidad</Label>
                  {isEditing ? (
                    <Input
                      id="university"
                      value={currentProfile.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                      <Building className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-900">{currentProfile.university}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="career">Carrera</Label>
                    {isEditing ? (
                      <Input
                        id="career"
                        value={currentProfile.career}
                        onChange={(e) => handleInputChange('career', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-900">{currentProfile.career}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="semester">Semestre</Label>
                    {isEditing ? (
                      <Input
                        id="semester"
                        value={currentProfile.semester}
                        onChange={(e) => handleInputChange('semester', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-900">{currentProfile.semester}</p>
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
                <CardDescription>
                  Tus perfiles en redes profesionales (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  {isEditing ? (
                    <Input
                      id="linkedin"
                      value={currentProfile.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      className="mt-1"
                      placeholder="https://linkedin.com/in/tu-perfil"
                    />
                  ) : (
                    <a 
                      href={currentProfile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1 p-2 bg-gray-50 rounded-lg block hover:bg-blue-50 transition-colors"
                    >
                      {currentProfile.linkedin_url}
                    </a>
                  )}
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  {isEditing ? (
                    <Input
                      id="github"
                      value={currentProfile.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      className="mt-1"
                      placeholder="https://github.com/tu-usuario"
                    />
                  ) : (
                    <a 
                      href={currentProfile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1 p-2 bg-gray-50 rounded-lg block hover:bg-blue-50 transition-colors"
                    >
                      {currentProfile.github_url}
                    </a>
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
