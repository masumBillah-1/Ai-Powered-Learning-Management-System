import HelpNavbar from "@/components/layout/helpnavbar";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HelpNavbar />
      {children}
    </div>
  );
}