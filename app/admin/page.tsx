import type { Metadata } from "next";
import { LocalAdminPage } from "@/src/features/admin/local-admin-page";

export const metadata: Metadata = {
  title: "Админка | Viola Community",
  description: "Локальная админка для новостей, трансферов и обложек Viola Community.",
};

export default function AdminPage() {
  return <LocalAdminPage />;
}
