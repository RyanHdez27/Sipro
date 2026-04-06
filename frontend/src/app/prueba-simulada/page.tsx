"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { PruebaSimulada } from '@/pages_old/PruebaSimulada';

export default function PruebaSimuladaPage() {
  return <ProtectedRoute><PruebaSimulada /></ProtectedRoute>;
}

