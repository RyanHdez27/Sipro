"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, Mail, Lock, Eye, EyeOff, User, GraduationCap, CheckCircle, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { registerUser, registerTeacher } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipoUsuario: "estudiante" as "estudiante" | "docente",
    carrera: "",
  });
  const [teacherCode, setTeacherCode] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.tipoUsuario === "docente" && !teacherCode) {
      setError("El código de autorización es requerido para registrarse como docente.");
      return;
    }

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);

    try {
      switch (formData.tipoUsuario) {
        case "docente":
          await registerTeacher({ 
            name: formData.nombre, 
            email: formData.email, 
            password: formData.password, 
            wants_newsletter: aceptaTerminos, 
            teacher_code: teacherCode 
          });
          break;
        case "estudiante":
          if (!formData.carrera) {
            setError("Debes seleccionar una carrera.");
            setLoading(false);
            return;
          }
          await registerUser({
            name: formData.nombre,
            email: formData.email,
            password: formData.password,
            carrera: formData.carrera,
            wants_newsletter: aceptaTerminos
          });
          break;
      }

      // Redirigir al login en caso de exito
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Fallo en la conexión al servidor. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-emerald-500">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold">SIPRO UDC</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Sistema Integral de Preparación para el Saber Pro
          </h2>
          <h3 className="text-2xl font-bold mb-3">
            Únete a nuestra plataforma educativa
          </h3>
          <p className="text-xl text-emerald-50 mb-8">
            Crea tu cuenta y comienza a mejorar tus habilidades con tecnología de punta.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Acceso Completo</h3>
                <p className="text-emerald-50">Todas las funcionalidades disponibles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Totalmente Gratis</h3>
                <p className="text-emerald-50">Sin cargos ocultos ni suscripciones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Soporte 24/7</h3>
                <p className="text-emerald-50">Asistencia cuando la necesites</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de Registro */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto border-t border-transparent">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 my-8">
            {/* Logo para móvil */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-emerald-600">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">SIPRO</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Crear Cuenta</h2>
              <p className="text-gray-500 dark:text-gray-400">Completa tus datos para registrarte</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegistro} className="space-y-5">
              {/* Tipo de Usuario */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Usuario
                </label>
                {/* NOTA: Removido el botón de Admin */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipoUsuario: "estudiante" })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.tipoUsuario === "estudiante"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <User className={`w-5 h-5 mx-auto mb-1 ${formData.tipoUsuario === "estudiante" ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${formData.tipoUsuario === "estudiante" ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      Estudiante
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipoUsuario: "docente" })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.tipoUsuario === "docente"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 mx-auto mb-1 ${formData.tipoUsuario === "docente" ? 'text-emerald-500' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${formData.tipoUsuario === "docente" ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      Docente
                    </span>
                  </button>
                </div>
              </div>

              {/* Mostrar código docente si es el tipo seleccionado */}
              {formData.tipoUsuario === "docente" && (
                <div>
                  <label htmlFor="teacherCode" className="block text-sm font-medium mb-2">
                    Código de Autorización Docente
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="teacherCode"
                      name="teacherCode"
                      type="text"
                      value={teacherCode}
                      onChange={(e) => setTeacherCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                      placeholder="Ej: PROF-2026-XYZ"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Nombre Completo */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              {/* Carrera (solo estudiante) */}
              {formData.tipoUsuario === "estudiante" && (
                <div>
                  <label htmlFor="carrera" className="block text-sm font-medium mb-2">
                    Carrera / Programa
                  </label>
                  <select
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                  >
                    <option value="" className="dark:bg-slate-900">Selecciona tu carrera...</option>
                    <option value="Ingeniería de Sistemas" className="dark:bg-slate-900">Ingeniería de Sistemas</option>
                    <option value="Ingeniería de Software" className="dark:bg-slate-900">Ingeniería de Software</option>
                    <option value="Administración de Empresas" className="dark:bg-slate-900">Administración de Empresas</option>
                    <option value="Contaduría Pública" className="dark:bg-slate-900">Contaduría Pública</option>
                    <option value="Ingeniería Industrial" className="dark:bg-slate-900">Ingeniería Industrial</option>
                    <option value="Derecho" className="dark:bg-slate-900">Derecho</option>
                    <option value="Psicología" className="dark:bg-slate-900">Psicología</option>
                    <option value="Arquitectura" className="dark:bg-slate-900">Arquitectura</option>
                    <option value="Medicina Veterinaria y Zootecnia" className="dark:bg-slate-900">Medicina Veterinaria y Zootecnia</option>
                  </select>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    placeholder="tucorreo@iudc.edu.co"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={mostrarPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={mostrarConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start">
                <input
                  id="terminos"
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 bg-transparent"
                  required
                />
                <label htmlFor="terminos" className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  He leído y acepto los{" "}
                  <button type="button" onClick={() => setShowTerms(true)} className="font-medium hover:underline text-emerald-600">
                    Términos y Condiciones
                  </button>
                  {" "}de SIPRO.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-emerald-500 hover:bg-emerald-600"
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => router.push("/auth/login")}
                  className="font-semibold hover:underline text-emerald-600"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for Terms */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              Términos de Servicio y Políticas de Privacidad
            </DialogTitle>
            <DialogDescription>
              SIPRO UDC
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">1. Aceptación de los Términos</h3>
            <p>Al acceder y utilizar SIPRO usted acepta estar sujeto a estos términos de servicio y a nuestra política de privacidad. Esta plataforma está diseñada para la preparación exclusiva de competencias.</p>
            
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">2. Uso de la Plataforma</h3>
            <p>Las pruebas, estadísticas y chat de la Inteligencia Artificial proporcionados son estrictamente para uso académico. No se permite compartir o comercializar este contenido a terceros bajo ningún motivo.</p>
          </div>
          <DialogFooter className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setShowTerms(false)}>
                Cerrar
              </Button>
              <Button onClick={() => {
                setAceptaTerminos(true);
                setShowTerms(false);
              }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Aceptar Términos
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
