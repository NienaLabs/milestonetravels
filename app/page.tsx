import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import { headers } from "next/headers";
import Hero from "@/components/Hero";
import FlightExperience from "@/components/FlightExperience";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import {auth} from '@/lib/auth'
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role==="ADMIN") {
    return  redirect('/admin')}else if(session?.user.role==='USER'){
    return  redirect('/dashboard')
      }
  
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen text-white-pure selection:bg-navy-bright selection:text-white-pure relative">
        <Navbar />     
        <main className="grow">
          <Hero />
          <FlightExperience />
          <Services />
          <Reviews />
          <CTA />
          <FAQ />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
