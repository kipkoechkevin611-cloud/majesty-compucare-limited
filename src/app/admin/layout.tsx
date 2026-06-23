import AdminLayout from '@/components/AdminLayout'

// Force dynamic rendering so middleware always runs for admin routes
export const dynamic = 'force-dynamic'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
