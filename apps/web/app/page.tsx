import Image, { type ImageProps } from "next/image";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import Capabilities from "./components/Capabilities";
import BentoGrid from "./components/BentoGrid";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Footer from "./components/Footer";





export default function Home() {
  return (
    <div>
     
      
      <Hero />
      <Capabilities />
      <BentoGrid />
      <Pricing />
      <Faq/>
      <Footer/>

      {/* <FeatureShowcase /> */}
      {/* <PlatformGrid /> */}
      {/* <Pricing /> */}
      {/* <Footer /> */}
    </div>
  );
}
