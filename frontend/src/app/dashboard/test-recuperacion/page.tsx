"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { TestRecuperacion } from '@/pages_old/TestRecuperacion';

export default function TestRecuperacionPage() {
  return (
    <ProtectedRoute>
      <TestRecuperacion />
    </ProtectedRoute>
  );
}
