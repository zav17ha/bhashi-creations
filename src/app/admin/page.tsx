import { AdminApp } from "@/components/admin/AdminApp";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { readClients, readProjects, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <h1 className="title">Admin not set up</h1>
          <p className="muted">
            Add an <code>ADMIN_PASSWORD</code> environment variable (Vercel → Project → Settings → Environment Variables, or
            <code> .env.local</code> when running locally), then redeploy.
          </p>
        </div>
      </div>
    );
  }
  if (!(await isAdmin())) return <AdminLogin />;
  const [{ projects, fromSeed }, clients] = await Promise.all([readProjects(), readClients()]);
  return (
    <AdminApp
      initial={projects}
      fromSeed={fromSeed}
      storage={storageMode()}
      clients={clients.groups}
      clientsFromSeed={clients.fromSeed}
    />
  );
}
