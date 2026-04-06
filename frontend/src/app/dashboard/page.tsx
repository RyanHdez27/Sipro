"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { Dashboard } from '@/pages_old/Dashboard';

export default function DashboardPage() {
  return <ProtectedRoute><Dashboard /></ProtectedRoute>;
}

