"use client";

import { usePageStore } from "@/store/PageStore";

export default function BackgroundImage() {
  const { background, mobileBackground } = usePageStore();
  return (
    <picture className="fixed inset-0 -z-10 pointer-events-none select-none">
      {/* Mobile: se usará cuando el viewport sea <= 767px */}
      <source media="(max-width: 767px)" srcSet={mobileBackground} />

      {/* Desktop: cuando sea >= 768px */}
      <source media="(min-width: 768px)" srcSet={background} />

      {/* Fallback */}
      <img
        src={background}
        alt={background}
        className="fixed inset-0 w-full max-w-screen h-full object-cover
         -z-10 select-none pointer-events-none"
        fetchPriority="high"
      />
    </picture>
  );
}
