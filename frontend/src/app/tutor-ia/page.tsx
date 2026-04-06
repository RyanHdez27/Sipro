"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { TutorIA } from '@/pages_old/TutorIA';

export default function TutorIAPage() {
  return <ProtectedRoute><TutorIA /></ProtectedRoute>;
}

