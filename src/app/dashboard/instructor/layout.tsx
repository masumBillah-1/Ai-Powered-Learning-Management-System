import InstructorSidebar from "@/components/layout/InstructorSidebar";


export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Sidebar - Fix thakbe */}
      <aside className="sticky top-0 h-screen hidden md:block">
        <InstructorSidebar />
      </aside>

      {/* Main Content - Eikhane Dashboard ba onno page show korbe */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}