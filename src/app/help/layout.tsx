import HelpNavbar from "@/components/layout/helpnavbar";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
     <HelpNavbar/>
      {children}
    </div>
  );
}
