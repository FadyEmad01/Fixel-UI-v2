"use client";
import React, { PropsWithChildren, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function LenisScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis && !window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

const Lenis = ({ children }: PropsWithChildren) => {
  return (
    <ReactLenis
      options={{
        // duration: 1.2,
        // easing: (t) => 1 - Math.pow(1 - t, 5),
        // smoothWheel: true,
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        lerp: 0.08,
        wheelMultiplier: 0.9,
      }}
      root={true}
    >
      <LenisScrollReset />
      {children}
    </ReactLenis>
  );
};

export default Lenis;

// "use client";
// import { PropsWithChildren } from "react";
// import { ReactLenis } from "lenis/react";

// const Lenis = ({ children }: PropsWithChildren) => {
//   return (
//     <ReactLenis
//       options={{
//         duration: 0.8,
//         easing: (t) => 1 - Math.pow(1 - t, 3),
//         smoothWheel: true,
//         lerp: 0.08,
//         wheelMultiplier: 0.9,
//       }}
//       root={true}
//     >
//       {children}
//     </ReactLenis>
//   );
// };

// export default Lenis;
