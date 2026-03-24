/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import gsap from "gsap";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { LiveDemo } from "./components/sections/LiveDemo";
import { BeforeAfter } from "./components/sections/BeforeAfter";
import { Features } from "./components/sections/Features";
import { Stats } from "./components/sections/Stats";
import { ChartImpact } from "./components/sections/ChartImpact";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Pricing } from "./components/sections/Pricing";
import { Testimonials } from "./components/sections/Testimonials";
import { FAQ } from "./components/sections/FAQ";

export default function App() {
  useEffect(() => {
    // Page load curtain animation
    gsap.to(".page-curtain", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        const curtain = document.querySelector(".page-curtain");
        if (curtain) {
          curtain.remove();
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <div className="page-curtain"></div>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <LiveDemo />
        <BeforeAfter />
        <Features />
        <Stats />
        <ChartImpact />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
