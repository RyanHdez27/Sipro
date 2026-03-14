"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { Resultados } from '@/pages_old/Resultados';

export default function ResultadosPage() {
  return <ProtectedRoute><Resultados /></ProtectedRoute>;
}

