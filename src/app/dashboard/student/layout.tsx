// app/dashboard/layout.tsx

import StudentSidebar from "@/components/layout/StudentSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="hidden md:block w-[300px] sticky top-0 h-screen overflow-y-auto p-4">
        <StudentSidebar/>
      </aside>

      {/* Dynamic Right Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}