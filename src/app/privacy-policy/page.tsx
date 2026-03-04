import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";

export default function Page() {
  return (
    <>
      <Navbar></Navbar>
      <PrivacyPolicy />
      <Footer></Footer>
    </>
  );
}
