import { AdminConsole } from "@/components/admin-console";

export default function AdminPage() {
  return (
    <main className="page band">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">Admin</span>
          <h1>EasyHarvest operations console</h1>
          <p>Manage products, publish home page posts, respond to comments, update quote status, and reply to buyer quote threads.</p>
        </div>
        <AdminConsole />
      </div>
    </main>
  );
}
