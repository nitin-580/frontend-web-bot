import Link from "next/link";

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="block p-2 rounded-lg hover:bg-gray-100 text-gray-600"
    >
      {label}
    </Link>
  );
}
export default function Sidebar() {
    return (
      <div className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          Motomation
        </h1>
  
        <div className="space-y-4 text-sm">
          <p className="text-gray-400 uppercase">Analytics</p>
          <NavItem label="Dashboard" href="/" />
          <NavItem label="Jobs" href="/Jobs" />
          <NavItem label="Scheduled Task" href="/schedule" />
          <NavItem label="History" href="/history" />
        </div>
      </div>
    );
  }
  
  function SidebarItem({ label }: { label: string }) {
    return (
      <div className="p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
        {label}
      </div>
    );
  }