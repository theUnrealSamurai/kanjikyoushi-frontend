import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      {children}
    </div>
  );
}
