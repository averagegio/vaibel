import { AdminSecretProvider } from "@/components/admin/AdminSecretProvider";

export default function AdminArticlesLayout({ children }: { children: React.ReactNode }) {
  return <AdminSecretProvider>{children}</AdminSecretProvider>;
}
