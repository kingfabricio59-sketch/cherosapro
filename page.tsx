import CherosaApp from "./cherosa-app";

export const dynamic = "force-dynamic";

export default function Home() {
  const adminName = process.env.ADMIN_NAME?.trim() || "Administración Cherosa";
  return <CherosaApp adminName={adminName} />;
}
