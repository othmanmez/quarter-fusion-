import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  // Redirection automatique vers le dashboard
  redirect('/admin/dashboard');
}