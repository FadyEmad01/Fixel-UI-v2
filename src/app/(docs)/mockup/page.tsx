// // "use client"
// // import { ArrowLeft, ArrowRight } from "lucide-react"
// // import { useState } from "react";

// // const EXAMPLES = [1, 2, 3];

// // export default function Page({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <div className="relative flex min-h-[200vh] w-full flex-col overflow-x-clip bg-background">
// //       {/* Background pattern */}
// //       <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]" />

// //       {/* Content */}
// //       <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 py-12 pb-24 sm:px-12">
// //         <div className="flex max-h-[82svh] w-full max-w-5xl items-center justify-center">
// //           {children}
// //         </div>
// //       </div>

// //       {/* Fixed bottom navigation */}
// //       <div className="sticky inset-x-0 mb-6 bottom-6 z-1 flex justify-center px-4">
// //         <PrevNextControls />
// //       </div>
// //     </div>
// //   );
// // }


// // function PrevNextControls() {
// //   const [exampleIndex, setExampleIndex] = useState(0);

// //   const goToPrevious = () => {
// //     setExampleIndex((index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length);
// //   };

// //   const goToNext = () => {
// //     setExampleIndex((index) => (index + 1) % EXAMPLES.length);
// //   };

// //   return (
// //     <nav
// //       aria-label="Example navigation"
// //       className="relative mx-auto flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
// //     >
// //       <button
// //         type="button"
// //         onClick={() =>
// //           setExampleIndex(
// //             (index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length,
// //           )
// //         }
// //         aria-label="Previous example"
// //         title="Previous example (←)"
// //         className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-7 text-foreground transition hover:bg-my-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-muted"
// //       >
// //         <ArrowLeft className="size-4" aria-hidden="true" />
// //       </button>

// //       <div className="flex items-center gap-1">
// //         {EXAMPLES.map((number, index) => (
// //           <button
// //             key={number}
// //             type="button"
// //             onClick={() => setExampleIndex(index)}
// //             aria-label={`Show example ${index + 1}: ${number}`}
// //             aria-current={index === exampleIndex ? "true" : undefined}
// //             className="group flex size-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
// //           >
// //             <span
// //               className={`size-1.5 rounded-full transition-all ${index === exampleIndex ? "scale-125 bg-foreground" : "bg-foreground/20 group-hover:bg-foreground/45"}`}
// //             />
// //           </button>
// //         ))}
// //       </div>

// //       <button
// //         type="button"
// //         onClick={() =>
// //           setExampleIndex((index) => (index + 1) % EXAMPLES.length)
// //         }
// //         aria-label="Next example"
// //         title="Next example (→)"
// //         className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-7 text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
// //       >
// //         <ArrowRight className="size-4" aria-hidden="true" />
// //       </button>
// //     </nav>
// //   );
// // }


// "use client";

// import {
//   ArrowLeft,
//   ArrowRight,
//   ArrowUpRight,
//   Layers3,
//   Sparkles,
//   Play,
// } from "lucide-react";
// import {
//   useEffect,
//   useRef,
//   useState,
//   type ReactNode,
//   type Dispatch,
//   type SetStateAction,
// } from "react";

// const EXAMPLES = [1, 2, 3];

// const FRAME_WIDTH = 1440;
// const FRAME_HEIGHT = 900;

// const HANDLE_POSITIONS = [
//   "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
//   "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
//   "right-0 top-0 translate-x-1/2 -translate-y-1/2",
//   "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
//   "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
//   "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
//   "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
//   "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
// ];

// export default function Page({
//   children,
// }: {
//   children?: ReactNode;
// }) {
//   const [exampleIndex, setExampleIndex] = useState(0);

//   return (
//     <div className="relative flex min-h-[200vh] w-full flex-col overflow-x-clip bg-background">
//       {/* Background pattern */}
//       <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]" />

//       {/* Preview content */}
//       <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-12">
//         <PreviewFrame>
//           {children ?? <DemoExample index={exampleIndex} />}
//         </PreviewFrame>
//       </main>

//       {/* Fixed bottom navigation */}
//       <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
//         <PrevNextControls
//           exampleIndex={exampleIndex}
//           setExampleIndex={setExampleIndex}
//         />
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------- */
// /* Preview Frame                      */
// /* ---------------------------------- */

// function PreviewFrame({ children }: { children: ReactNode }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const container = containerRef.current;

//     if (!container) return;

//     const updateScale = () => {
//       const { width, height } = container.getBoundingClientRect();

//       const nextScale = Math.min(
//         width / FRAME_WIDTH,
//         height / FRAME_HEIGHT,
//       );

//       setScale(nextScale);
//     };

//     updateScale();

//     const observer = new ResizeObserver(updateScale);
//     observer.observe(container);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="flex h-[72svh] w-full max-w-5xl items-center justify-center"
//     >
//       {/* Frame wrapper */}
//       <div
//         className="relative shrink-0"
//         style={{
//           width: FRAME_WIDTH * scale,
//           height: FRAME_HEIGHT * scale,
//         }}
//       >
//         {/* Actual preview */}
//         <div className="absolute inset-0 overflow-hidden bg-background shadow-sm">
//           <div
//             className="absolute left-0 top-0 origin-top-left"
//             style={{
//               width: FRAME_WIDTH,
//               height: FRAME_HEIGHT,
//               transform: `scale(${scale})`,
//             }}
//           >
//             <div className="h-full w-full">{children}</div>
//           </div>
//         </div>

//         {/* Selection outline */}
//         <div className="pointer-events-none absolute inset-0 z-10 border-2 border-my-secondary">
//           {HANDLE_POSITIONS.map((position) => (
//             <span
//               key={position}
//               className={`absolute size-3 rounded-full border-2 border-my-secondary bg-background shadow-sm ${position}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------- */
// /* Demo Examples                      */
// /* ---------------------------------- */

// function DemoExample({ index }: { index: number }) {
//   switch (index) {
//     case 0:
//       return <StudioHero />;
//     case 1:
//       return <ProductHero />;
//     case 2:
//       return <PortfolioHero />;
//     default:
//       return <StudioHero />;
//   }
// }

// /* ---------------------------------- */
// /* Example 01 — Studio Landing Page   */
// /* ---------------------------------- */

// function StudioHero() {
//   return (
//     <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#F1F0EB] text-[#171717]">
//       <header className="flex h-28 items-center justify-between border-b border-black/10 px-20">
//         <span className="text-3xl font-bold tracking-[-0.08em]">
//           forma<span className="text-[#777]">.</span>
//         </span>

//         <nav className="flex items-center gap-12 text-sm font-medium">
//           <span>Our Studio</span>
//           <span>Selected Work</span>
//           <span>About</span>
//         </nav>

//         <button className="flex items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm text-white">
//           Let's talk
//           <ArrowUpRight className="size-4" />
//         </button>
//       </header>

//       <main className="relative grid flex-1 grid-cols-2 items-center gap-12 px-24">
//         <div className="relative z-10">
//           <div className="mb-10 flex items-center gap-3">
//             <span className="size-2 rounded-full bg-[#6A8B69]" />
//             <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
//               Independent creative studio
//             </span>
//           </div>

//           <h1 className="max-w-2xl text-[104px] font-semibold leading-[0.95] tracking-[-0.085em]">
//             Design
//             <br />
//             beyond
//             <br />
//             expected<span className="text-[#8B9D7B]">.</span>
//           </h1>

//           <p className="mt-10 max-w-md text-xl leading-relaxed text-[#777]">
//             We create thoughtful digital experiences that connect
//             brands, people, and ideas.
//           </p>

//           <div className="mt-12 flex items-center gap-5">
//             <button className="flex items-center gap-4 rounded-full bg-[#171717] px-8 py-5 text-sm text-white">
//               Explore our work
//               <ArrowUpRight className="size-4" />
//             </button>

//             <span className="text-sm font-medium text-[#777]">
//               Scroll to discover
//             </span>
//           </div>
//         </div>

//         <div className="relative flex h-[590px] items-center justify-center">
//           <div className="absolute right-0 top-8 size-[470px] rounded-full bg-[#D1DFCA]" />
//           <div className="absolute right-20 top-24 size-[360px] rotate-12 rounded-[100px] bg-[#A8B99F]" />

//           <div className="absolute right-20 top-28 z-10 flex h-[390px] w-[330px] rotate-[-8deg] flex-col justify-between rounded-[28px] bg-[#303E35] p-9 text-white shadow-2xl">
//             <div className="flex items-center justify-between">
//               <Layers3 className="size-8" />
//               <span className="text-xs text-white/50">001 / 003</span>
//             </div>

//             <div>
//               <div className="mb-5 size-20 rounded-full border-[14px] border-[#B9C9AB]" />
//               <h2 className="text-5xl font-semibold tracking-[-0.06em]">
//                 Make it
//                 <br />
//                 meaningful.
//               </h2>
//             </div>

//             <div className="flex justify-between border-t border-white/20 pt-5 text-xs text-white/60">
//               <span>Creative direction</span>
//               <span>2026</span>
//             </div>
//           </div>

//           <div className="absolute bottom-12 left-0 z-20 rounded-2xl bg-white px-6 py-5 shadow-xl">
//             <span className="text-xs text-[#888]">Selected projects</span>
//             <p className="mt-1 text-3xl font-semibold tracking-tight">
//               24<span className="text-[#8B9D7B]">+</span>
//             </p>
//           </div>
//         </div>
//       </main>

//       <footer className="flex h-20 items-center justify-between border-t border-black/10 px-20 text-xs text-[#888]">
//         <span>© 2026 Forma Studio</span>
//         <span>Based everywhere. Working worldwide.</span>
//         <span>Instagram ↗</span>
//       </footer>
//     </section>
//   );
// }

// /* ---------------------------------- */
// /* Example 02 — Product Landing Page  */
// /* ---------------------------------- */

// function ProductHero() {
//   return (
//     <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#101014] text-white">
//       <header className="flex h-28 items-center justify-between px-24">
//         <div className="flex items-center gap-3">
//           <div className="flex size-11 items-center justify-center rounded-xl bg-[#B7A2FF] text-[#171020]">
//             <Sparkles className="size-6" />
//           </div>
//           <span className="text-2xl font-semibold tracking-tight">
//             orbit<span className="text-[#B7A2FF]">.</span>
//           </span>
//         </div>

//         <nav className="flex items-center gap-12 text-sm text-white/60">
//           <span>Features</span>
//           <span>Solutions</span>
//           <span>Pricing</span>
//           <span>Resources</span>
//         </nav>

//         <button className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#101014]">
//           Get started
//         </button>
//       </header>

//       <main className="relative grid flex-1 grid-cols-2 items-center px-24">
//         <div className="relative z-10">
//           <div className="mb-9 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3">
//             <span className="size-2 rounded-full bg-[#B7A2FF]" />
//             <span className="text-xs text-white/70">
//               A better way to work
//             </span>
//           </div>

//           <h1 className="max-w-2xl text-[100px] font-semibold leading-[0.98] tracking-[-0.075em]">
//             Focus on
//             <br />
//             what really
//             <br />
//             <span className="text-[#B7A2FF]">matters.</span>
//           </h1>

//           <p className="mt-8 max-w-lg text-xl leading-relaxed text-white/50">
//             Everything you need to organize your work, connect
//             your team, and bring your best ideas to life.
//           </p>

//           <div className="mt-11 flex items-center gap-6">
//             <button className="flex items-center gap-4 rounded-full bg-[#B7A2FF] px-8 py-5 font-semibold text-[#171020]">
//               Start for free
//               <ArrowUpRight className="size-4" />
//             </button>

//             <button className="flex items-center gap-3 text-sm text-white/70">
//               <span className="flex size-11 items-center justify-center rounded-full border border-white/20">
//                 <Play className="size-4 fill-white" />
//               </span>
//               Watch the film
//             </button>
//           </div>
//         </div>

//         {/* Dashboard illustration */}
//         <div className="relative flex h-full items-center justify-center">
//           <div className="absolute size-[540px] rounded-full bg-[#7253C9]/20 blur-[100px]" />

//           <div className="relative z-10 w-[540px] rotate-[-4deg] rounded-[30px] border border-white/10 bg-[#1C1C25] p-7 shadow-2xl">
//             <div className="flex items-center justify-between border-b border-white/10 pb-7">
//               <div>
//                 <span className="text-xs text-white/40">Workspace</span>
//                 <h3 className="mt-2 text-2xl font-semibold">Overview</h3>
//               </div>
//               <div className="flex size-11 items-center justify-center rounded-full bg-[#B7A2FF]/15 text-[#B7A2FF]">
//                 <Sparkles />
//               </div>
//             </div>

//             <div className="mt-7 grid grid-cols-2 gap-4">
//               <div className="rounded-2xl bg-[#292833] p-5">
//                 <span className="text-xs text-white/40">Total projects</span>
//                 <p className="mt-4 text-4xl font-semibold">128</p>
//                 <span className="mt-2 block text-xs text-[#A8DAA8]">
//                   +12.8% this month
//                 </span>
//               </div>

//               <div className="rounded-2xl bg-[#292833] p-5">
//                 <span className="text-xs text-white/40">Completed</span>
//                 <p className="mt-4 text-4xl font-semibold">86</p>
//                 <span className="mt-2 block text-xs text-[#B7A2FF]">
//                   67% completion
//                 </span>
//               </div>
//             </div>

//             <div className="mt-5 rounded-2xl bg-[#292833] p-6">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Recent activity</span>
//                 <span className="text-xs text-white/40">This week</span>
//               </div>

//               <div className="mt-7 flex h-32 items-end gap-3">
//                 {[35, 60, 45, 85, 55, 100, 70, 90, 58, 78, 45, 88].map(
//                   (height, i) => (
//                     <div
//                       key={i}
//                       className="flex-1 rounded-t-md bg-[#B7A2FF]"
//                       style={{ height: `${height}%`, opacity: 0.5 + i * 0.04 }}
//                     />
//                   ),
//                 )}
//               </div>
//             </div>

//             <div className="mt-5 flex items-center justify-between text-xs text-white/40">
//               <span>Updated just now</span>
//               <span>View analytics ↗</span>
//             </div>
//           </div>

//           <div className="absolute bottom-24 right-[-10px] z-20 rounded-2xl border border-white/10 bg-[#27232F] px-6 py-5 shadow-xl">
//             <span className="text-xs text-white/50">Productivity score</span>
//             <p className="mt-2 text-3xl font-semibold text-[#B7A2FF]">
//               94.8%
//             </p>
//           </div>
//         </div>
//       </main>

//       <footer className="flex h-20 items-center justify-between border-t border-white/10 px-24 text-xs text-white/40">
//         <span>© 2026 Orbit Inc.</span>
//         <span>Made for teams that build.</span>
//         <span>Twitter ↗</span>
//       </footer>
//     </section>
//   );
// }

// /* ---------------------------------- */
// /* Example 03 — Portfolio Landing Page */
// /* ---------------------------------- */

// function PortfolioHero() {
//   return (
//     <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#EAE7E0] text-[#20201E]">
//       <header className="flex h-28 items-center justify-between px-24">
//         <span className="text-3xl font-bold tracking-[-0.07em]">
//           FOLIO<span className="text-[#99948A]">/</span>26
//         </span>

//         <div className="flex items-center gap-10 text-sm">
//           <span>Work</span>
//           <span>About</span>
//           <span>Contact</span>
//         </div>

//         <div className="flex items-center gap-3 text-sm">
//           <span className="size-2 rounded-full bg-[#6C806A]" />
//           Available for projects
//         </div>
//       </header>

//       <main className="flex flex-1 flex-col justify-center px-24">
//         <div className="mb-9 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-[#827F77]">
//           <span>Digital designer & developer</span>
//           <span className="h-px w-16 bg-[#C1BDB3]" />
//           <span>Cairo, Egypt</span>
//         </div>

//         <div className="flex items-end justify-between gap-10">
//           <h1 className="text-[126px] font-semibold leading-[0.9] tracking-[-0.09em]">
//             Creative
//             <br />
//             by nature<span className="text-[#A1A18B]">.</span>
//           </h1>

//           <p className="mb-4 max-w-sm text-xl leading-relaxed text-[#77746D]">
//             I build digital experiences that combine thoughtful
//             design, modern technology, and meaningful interactions.
//           </p>
//         </div>

//         <div className="mt-20 grid grid-cols-3 gap-5">
//           <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#C7D2C0] p-7">
//             <span className="text-xs uppercase tracking-widest text-black/50">
//               01 / Web design
//             </span>
//             <div>
//               <h3 className="text-3xl font-semibold tracking-tight">Digital spaces</h3>
//               <span className="mt-3 flex items-center justify-between text-sm">
//                 Explore project
//                 <ArrowUpRight />
//               </span>
//             </div>
//             <div className="absolute -right-10 -top-12 size-48 rounded-full border-[30px] border-[#8CA187]/60 transition-transform duration-500 group-hover:scale-110" />
//           </div>

//           <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#D8C7B6] p-7">
//             <span className="text-xs uppercase tracking-widest text-black/50">
//               02 / Development
//             </span>
//             <div>
//               <h3 className="text-3xl font-semibold tracking-tight">Creative code</h3>
//               <span className="mt-3 flex items-center justify-between text-sm">
//                 Explore project
//                 <ArrowUpRight />
//               </span>
//             </div>
//             <div className="absolute -right-12 -top-12 size-52 rotate-45 rounded-[40px] bg-[#B69A7D]/50 transition-transform duration-500 group-hover:rotate-90" />
//           </div>

//           <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#BFC4D4] p-7">
//             <span className="text-xs uppercase tracking-widest text-black/50">
//               03 / Animation
//             </span>
//             <div>
//               <h3 className="text-3xl font-semibold tracking-tight">Motion studies</h3>
//               <span className="mt-3 flex items-center justify-between text-sm">
//                 Explore project
//                 <ArrowUpRight />
//               </span>
//             </div>
//             <div className="absolute -right-6 -top-12 size-44 rounded-full border-[25px] border-[#929BB5]/60 transition-transform duration-500 group-hover:scale-125" />
//           </div>
//         </div>
//       </main>

//       <footer className="flex h-20 items-center justify-between border-t border-black/10 px-24 text-xs text-[#827F77]">
//         <span>© 2026 Folio</span>
//         <span>Designed with intention.</span>
//         <span>Get in touch ↗</span>
//       </footer>
//     </section>
//   );
// }

// /* ---------------------------------- */
// /* Navigation Controls                */
// /* ---------------------------------- */

// function PrevNextControls({
//   exampleIndex,
//   setExampleIndex,
// }: {
//   exampleIndex: number;
//   setExampleIndex: Dispatch<SetStateAction<number>>;
// }) {
//   const goToPrevious = () => {
//     setExampleIndex(
//       (index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length,
//     );
//   };

//   const goToNext = () => {
//     setExampleIndex((index) => (index + 1) % EXAMPLES.length);
//   };

//   return (
//     <nav
//       aria-label="Example navigation"
//       className="relative mx-auto flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
//     >
//       <button
//         type="button"
//         onClick={goToPrevious}
//         aria-label="Previous example"
//         title="Previous example (←)"
//         className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-7 text-foreground transition hover:bg-my-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-muted"
//       >
//         <ArrowLeft className="size-4" aria-hidden="true" />
//       </button>

//       <div className="flex items-center">
//         {EXAMPLES.map((number, index) => (
//           <button
//             key={number}
//             type="button"
//             onClick={() => setExampleIndex(index)}
//             aria-label={`Show example ${number}`}
//             aria-current={index === exampleIndex ? "true" : undefined}
//             className="group flex size-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
//           >
//             <span
//               className={`size-1.5 rounded-full transition-all ${
//                 index === exampleIndex
//                   ? "scale-125 bg-foreground"
//                   : "bg-foreground/20 group-hover:bg-foreground/45"
//               }`}
//             />
//           </button>
//         ))}
//       </div>

//       <button
//         type="button"
//         onClick={goToNext}
//         aria-label="Next example"
//         title="Next example (→)"
//         className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-7 text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
//       >
//         <ArrowRight className="size-4" aria-hidden="true" />
//       </button>
//     </nav>
//   );
// }

"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Frame,
  Layers3,
  Play,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SetStateAction,
  useLayoutEffect,
} from "react";

/* ---------------------------------- */
/* Types and Configuration            */
/* ---------------------------------- */

type HandleDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

type ViewportPresetKey = "mobile" | "tablet" | "laptop" | "desktop";

type ExampleItem = {
  componentName: string;
  brand: string;
};

const EXAMPLES = [1, 2, 3];

const INITIAL_FRAME = {
  width: 1440,
  height: 900,
};

const MIN_FRAME_WIDTH = 280;
const MAX_FRAME_WIDTH = 1920;
const MIN_FRAME_HEIGHT = 320;
const MAX_FRAME_HEIGHT = 1600;

const SNAP_WIDTHS = [
  320, 375, 390, 414, 768, 1024, 1280, 1366, 1440, 1536, 1920,
];

const EXAMPLE_ITEMS: ExampleItem[] = [
  { componentName: "Studio Hero", brand: "Forma Studio" },
  { componentName: "Product Hero", brand: "Orbit" },
  { componentName: "Portfolio Hero", brand: "Folio" },
];

const RESIZE_HANDLES: {
  dir: HandleDirection;
  positionClass: string;
  cursorClass: string;
  label: string;
}[] = [
    {
      dir: "nw",
      positionClass: "-left-3 -top-3",
      cursorClass: "cursor-nwse-resize",
      label: "Resize northwest",
    },
    {
      dir: "n",
      positionClass: "left-1/2 -top-3 -translate-x-1/2",
      cursorClass: "cursor-ns-resize",
      label: "Resize north",
    },
    {
      dir: "ne",
      positionClass: "-right-3 -top-3",
      cursorClass: "cursor-nesw-resize",
      label: "Resize northeast",
    },
    {
      dir: "e",
      positionClass: "-right-3 top-1/2 -translate-y-1/2",
      cursorClass: "cursor-ew-resize",
      label: "Resize east",
    },
    {
      dir: "se",
      positionClass: "-bottom-3 -right-3",
      cursorClass: "cursor-nwse-resize",
      label: "Resize southeast",
    },
    {
      dir: "s",
      positionClass: "-bottom-3 left-1/2 -translate-x-1/2",
      cursorClass: "cursor-ns-resize",
      label: "Resize south",
    },
    {
      dir: "sw",
      positionClass: "-bottom-3 -left-3",
      cursorClass: "cursor-nesw-resize",
      label: "Resize southwest",
    },
    {
      dir: "w",
      positionClass: "-left-3 top-1/2 -translate-y-1/2",
      cursorClass: "cursor-ew-resize",
      label: "Resize west",
    },
  ];

/* ---------------------------------- */
/* Page                               */
/* ---------------------------------- */

export default function Page({
  children,
}: {
  children?: ReactNode;
}) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [frameWidth, setFrameWidth] = useState(INITIAL_FRAME.width);
  const [frameHeight, setFrameHeight] = useState(INITIAL_FRAME.height);
  const [activePreset, setActivePreset] = useState<ViewportPresetKey | "custom">(
    "desktop",
  );

  const resetFrame = () => {
    setFrameWidth(INITIAL_FRAME.width);
    setFrameHeight(INITIAL_FRAME.height);
    setActivePreset("desktop");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-background">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* Preview content */}
      <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-12">
        <PreviewFrame
          example={EXAMPLE_ITEMS[exampleIndex]}
          frameWidth={frameWidth}
          frameHeight={frameHeight}
          setFrameWidth={setFrameWidth}
          setFrameHeight={setFrameHeight}
          activePreset={activePreset}
          setActivePreset={setActivePreset}
          onReset={resetFrame}
        >
          {children ?? <DemoExample index={exampleIndex} />}
        </PreviewFrame>
      </main>

      {/* Fixed bottom navigation */}
      <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <PrevNextControls
          exampleIndex={exampleIndex}
          setExampleIndex={setExampleIndex}
        />
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Resizable Preview Frame            */
/* ---------------------------------- */

function PreviewFrame({
  children,
  example,
  frameWidth,
  frameHeight,
  setFrameWidth,
  setFrameHeight,
  activePreset,
  setActivePreset,
  onReset,
}: {
  children: ReactNode;
  example: ExampleItem;
  frameWidth: number;
  frameHeight: number;
  setFrameWidth: Dispatch<SetStateAction<number>>;
  setFrameHeight: Dispatch<SetStateAction<number>>;
  activePreset: ViewportPresetKey | "custom";
  setActivePreset: Dispatch<SetStateAction<ViewportPresetKey | "custom">>;
  onReset: () => void;
}) {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const [containerSize, setContainerSize] = useState({
  //   width: 1024,
  //   height: 640,
  // });
  // const [activeHandle, setActiveHandle] = useState<HandleDirection | null>(null);

  // const dragRef = useRef<{
  //   dir: HandleDirection;
  //   startX: number;
  //   startY: number;
  //   startWidth: number;
  //   startHeight: number;
  //   startScale: number;
  // } | null>(null);

  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const updateSize = () => {
  //     const { width, height } = container.getBoundingClientRect();
  //     setContainerSize({ width, height });
  //   };

  //   updateSize();

  //   const observer = new ResizeObserver(updateSize);
  //   observer.observe(container);

  //   return () => observer.disconnect();
  // }, []);

  // const availW = Math.max(240, containerSize.width - 32);
  // const availH = Math.max(240, containerSize.height - 56);
  // const scale = Math.min(1, availW / frameWidth, availH / frameHeight);
  // const isResizing = activeHandle !== null;

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [activeHandle, setActiveHandle] =
    useState<HandleDirection | null>(null);

  const dragRef = useRef<{
    dir: HandleDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startScale: number;
  } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();

      if (width <= 0 || height <= 0) return;

      setContainerSize({ width, height });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const availW = containerSize
    ? Math.max(1, containerSize.width - 32)
    : 0;

  const availH = containerSize
    ? Math.max(1, containerSize.height - 56)
    : 0;

  const scale = containerSize
    ? Math.min(1, availW / frameWidth, availH / frameHeight)
    : 0;

  const isResizing = activeHandle !== null;

  const onPointerDown = (
    dir: HandleDirection,
    e: ReactPointerEvent<HTMLElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: frameWidth,
      startHeight: frameHeight,
      startScale: scale || 1,
    };

    setActiveHandle(dir);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    let nextW = drag.startWidth;
    let nextH = drag.startHeight;

    if (drag.dir.includes("e")) {
      nextW = drag.startWidth + (dx * 2) / drag.startScale;
    } else if (drag.dir.includes("w")) {
      nextW = drag.startWidth - (dx * 2) / drag.startScale;
    }

    if (drag.dir.includes("s")) {
      nextH = drag.startHeight + (dy * 2) / drag.startScale;
    } else if (drag.dir.includes("n")) {
      nextH = drag.startHeight - (dy * 2) / drag.startScale;
    }

    const lockRatio = e.shiftKey && drag.dir.length === 2;
    const ratio = drag.startWidth / drag.startHeight;

    if (lockRatio) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        nextH = nextW / ratio;
      } else {
        nextW = nextH * ratio;
      }
    }

    if (!e.altKey && (drag.dir.includes("e") || drag.dir.includes("w"))) {
      const snap = SNAP_WIDTHS.find((value) => Math.abs(nextW - value) <= 10);

      if (snap !== undefined) {
        nextW = snap;
        if (lockRatio) nextH = nextW / ratio;
      }
    }

    nextW = Math.min(MAX_FRAME_WIDTH, Math.max(MIN_FRAME_WIDTH, nextW));
    nextH = Math.min(MAX_FRAME_HEIGHT, Math.max(MIN_FRAME_HEIGHT, nextH));

    setFrameWidth(Math.round(nextW));
    setFrameHeight(Math.round(nextH));
    setActivePreset("custom");
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore pointer capture errors.
    }

    dragRef.current = null;
    setActiveHandle(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[75svh] w-full max-w-5xl items-center justify-center"
    >
      {containerSize && (
        <>
          {/* Frame wrapper */}
          <div
            className={`relative shrink-0  ${!containerSize || isResizing ? "" : "transition-[width,height] duration-0 ease-out"
              }`}
            style={{
              width: frameWidth * scale,
              height: frameHeight * scale,
            }}
          >
            {/* Top Figma Frame Header */}
            <div className="pointer-events-none absolute inset-x-0 -top-7 z-20 flex select-none items-center justify-between text-xs">
              <div className="flex min-w-0 items-center gap-2 font-medium text-my-secondary">
                <Frame className="size-3.5 shrink-0" />
                <span className="truncate">
                  {example.componentName} — {example.brand}
                </span>
              </div>

              <span className="ml-3 shrink-0 rounded-full bg-my-secondary/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-my-secondary">
                {activePreset}
              </span>
            </div>

            {/* Actual preview */}
            <div className="absolute inset-0 overflow-hidden bg-background shadow-sm">
              <div
                className={`absolute left-0 top-0 origin-top-left ${!containerSize || isResizing
                  ? "pointer-events-none select-none"
                  : "transition-transform duration-0 ease-out"
                  }`}
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  transform: `scale(${scale})`,
                }}
              >
                <div className="h-full w-full overflow-x-hidden overflow-y-auto">
                  {children}
                </div>
              </div>
            </div>

            {/* Selection outline + interactive drag edges and handles */}
            <div className="pointer-events-none absolute inset-0 z-10 border-2 border-my-secondary">
              {/* East edge */}
              <div
                onPointerDown={(e) => onPointerDown("e", e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDoubleClick={onReset}
                className="pointer-events-auto absolute -right-1.5 inset-y-3 z-10 w-3 cursor-ew-resize touch-none"
              />

              {/* West edge */}
              <div
                onPointerDown={(e) => onPointerDown("w", e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDoubleClick={onReset}
                className="pointer-events-auto absolute -left-1.5 inset-y-3 z-10 w-3 cursor-ew-resize touch-none"
              />

              {/* South edge */}
              <div
                onPointerDown={(e) => onPointerDown("s", e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDoubleClick={onReset}
                className="pointer-events-auto absolute -bottom-1.5 inset-x-3 z-10 h-3 cursor-ns-resize touch-none"
              />

              {/* North edge */}
              <div
                onPointerDown={(e) => onPointerDown("n", e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDoubleClick={onReset}
                className="pointer-events-auto absolute -top-1.5 inset-x-3 z-10 h-3 cursor-ns-resize touch-none"
              />

              {/* Eight resize handles */}
              {RESIZE_HANDLES.map(({ dir, positionClass, cursorClass, label }) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={label}
                  onPointerDown={(e) => onPointerDown(dir, e)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onDoubleClick={onReset}
                  className={`group pointer-events-auto absolute z-20 flex size-6 items-center justify-center focus:outline-none touch-none ${positionClass} ${cursorClass}`}
                >
                  <span
                    className={`size-3 rounded border-2 border-my-secondary shadow-sm transition-transform ${activeHandle === dir
                      ? " bg-my-secondary"
                      : "bg-background  group-hover:bg-my-secondary"
                      }`}
                  />
                </button>
              ))}
            </div>

            {/* Bottom Figma dimension badge */}
            <div className="pointer-events-none absolute -bottom-7 left-1/2 z-20 -translate-x-1/2 select-none">
              <div className="inline-flex items-center gap-1.5 text-nowrap rounded-md bg-my-secondary px-2.5 py-0.5 font-mono text-[11px] font-medium text-white shadow-xs">
                <span>
                  {Math.round(frameWidth)} × {Math.round(frameHeight)}
                </span>
                <span className="opacity-70">·</span>
                <span>{Math.round(scale * 100)}%</span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

/* ---------------------------------- */
/* Demo Examples                      */
/* ---------------------------------- */

function DemoExample({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <StudioHero />;
    case 1:
      return <ProductHero />;
    case 2:
      return <PortfolioHero />;
    default:
      return <StudioHero />;
  }
}

/* ---------------------------------- */
/* Example 01 — Studio Landing Page   */
/* ---------------------------------- */

function StudioHero() {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#F1F0EB] text-[#171717]">
      <header className="flex h-28 items-center justify-between border-b border-black/10 px-20">
        <span className="text-3xl font-bold tracking-[-0.08em]">
          forma<span className="text-[#777]">.</span>
        </span>

        <nav className="flex items-center gap-12 text-sm font-medium">
          <span>Our Studio</span>
          <span>Selected Work</span>
          <span>About</span>
        </nav>

        <button className="flex items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm text-white">
          Let's talk
          <ArrowUpRight className="size-4" />
        </button>
      </header>

      <main className="relative grid flex-1 grid-cols-2 items-center gap-12 px-24">
        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-3">
            <span className="size-2 rounded-full bg-[#6A8B69]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
              Independent creative studio
            </span>
          </div>

          <h1 className="max-w-2xl text-[104px] font-semibold leading-[0.95] tracking-[-0.085em]">
            Design
            <br />
            beyond
            <br />
            expected<span className="text-[#8B9D7B]">.</span>
          </h1>

          <p className="mt-10 max-w-md text-xl leading-relaxed text-[#777]">
            We create thoughtful digital experiences that connect brands,
            people, and ideas.
          </p>

          <div className="mt-12 flex items-center gap-5">
            <button className="flex items-center gap-4 rounded-full bg-[#171717] px-8 py-5 text-sm text-white">
              Explore our work
              <ArrowUpRight className="size-4" />
            </button>

            <span className="text-sm font-medium text-[#777]">
              Scroll to discover
            </span>
          </div>
        </div>

        <div className="relative flex h-[590px] items-center justify-center">
          <div className="absolute right-0 top-8 size-[470px] rounded-full bg-[#D1DFCA]" />
          <div className="absolute right-20 top-24 size-[360px] rotate-12 rounded-[100px] bg-[#A8B99F]" />

          <div className="absolute right-20 top-28 z-10 flex h-[390px] w-[330px] rotate-[-8deg] flex-col justify-between rounded-[28px] bg-[#303E35] p-9 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <Layers3 className="size-8" />
              <span className="text-xs text-white/50">001 / 003</span>
            </div>

            <div>
              <div className="mb-5 size-20 rounded-full border-[14px] border-[#B9C9AB]" />
              <h2 className="text-5xl font-semibold tracking-[-0.06em]">
                Make it
                <br />
                meaningful.
              </h2>
            </div>

            <div className="flex justify-between border-t border-white/20 pt-5 text-xs text-white/60">
              <span>Creative direction</span>
              <span>2026</span>
            </div>
          </div>

          <div className="absolute bottom-12 left-0 z-20 rounded-2xl bg-white px-6 py-5 shadow-xl">
            <span className="text-xs text-[#888]">Selected projects</span>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              24<span className="text-[#8B9D7B]">+</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="flex h-20 items-center justify-between border-t border-black/10 px-20 text-xs text-[#888]">
        <span>© 2026 Forma Studio</span>
        <span>Based everywhere. Working worldwide.</span>
        <span>Instagram ↗</span>
      </footer>
    </section>
  );
}

/* ---------------------------------- */
/* Example 02 — Product Landing Page  */
/* ---------------------------------- */

function ProductHero() {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#101014] text-white">
      <header className="flex h-28 items-center justify-between px-24">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#B7A2FF] text-[#171020]">
            <Sparkles className="size-6" />
          </div>
          <span className="text-2xl font-semibold tracking-tight">
            orbit<span className="text-[#B7A2FF]">.</span>
          </span>
        </div>

        <nav className="flex items-center gap-12 text-sm text-white/60">
          <span>Features</span>
          <span>Solutions</span>
          <span>Pricing</span>
          <span>Resources</span>
        </nav>

        <button className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#101014]">
          Get started
        </button>
      </header>

      <main className="relative grid flex-1 grid-cols-2 items-center px-24">
        <div className="relative z-10">
          <div className="mb-9 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3">
            <span className="size-2 rounded-full bg-[#B7A2FF]" />
            <span className="text-xs text-white/70">A better way to work</span>
          </div>

          <h1 className="max-w-2xl text-[100px] font-semibold leading-[0.98] tracking-[-0.075em]">
            Focus on
            <br />
            what really
            <br />
            <span className="text-[#B7A2FF]">matters.</span>
          </h1>

          <p className="mt-8 max-w-lg text-xl leading-relaxed text-white/50">
            Everything you need to organize your work, connect your team, and
            bring your best ideas to life.
          </p>

          <div className="mt-11 flex items-center gap-6">
            <button className="flex items-center gap-4 rounded-full bg-[#B7A2FF] px-8 py-5 font-semibold text-[#171020]">
              Start for free
              <ArrowUpRight className="size-4" />
            </button>

            <button className="flex items-center gap-3 text-sm text-white/70">
              <span className="flex size-11 items-center justify-center rounded-full border border-white/20">
                <Play className="size-4 fill-white" />
              </span>
              Watch the film
            </button>
          </div>
        </div>

        {/* Dashboard illustration */}
        <div className="relative flex h-full items-center justify-center">
          <div className="absolute size-[540px] rounded-full bg-[#7253C9]/20 blur-[100px]" />

          <div className="relative z-10 w-[540px] rotate-[-4deg] rounded-[30px] border border-white/10 bg-[#1C1C25] p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-7">
              <div>
                <span className="text-xs text-white/40">Workspace</span>
                <h3 className="mt-2 text-2xl font-semibold">Overview</h3>
              </div>
              <div className="flex size-11 items-center justify-center rounded-full bg-[#B7A2FF]/15 text-[#B7A2FF]">
                <Sparkles />
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#292833] p-5">
                <span className="text-xs text-white/40">Total projects</span>
                <p className="mt-4 text-4xl font-semibold">128</p>
                <span className="mt-2 block text-xs text-[#A8DAA8]">
                  +12.8% this month
                </span>
              </div>

              <div className="rounded-2xl bg-[#292833] p-5">
                <span className="text-xs text-white/40">Completed</span>
                <p className="mt-4 text-4xl font-semibold">86</p>
                <span className="mt-2 block text-xs text-[#B7A2FF]">
                  67% completion
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#292833] p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recent activity</span>
                <span className="text-xs text-white/40">This week</span>
              </div>

              <div className="mt-7 flex h-32 items-end gap-3">
                {[35, 60, 45, 85, 55, 100, 70, 90, 58, 78, 45, 88].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-[#B7A2FF]"
                      style={{ height: `${height}%`, opacity: 0.5 + i * 0.04 }}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-white/40">
              <span>Updated just now</span>
              <span>View analytics ↗</span>
            </div>
          </div>

          <div className="absolute bottom-24 right-[-10px] z-20 rounded-2xl border border-white/10 bg-[#27232F] px-6 py-5 shadow-xl">
            <span className="text-xs text-white/50">Productivity score</span>
            <p className="mt-2 text-3xl font-semibold text-[#B7A2FF]">94.8%</p>
          </div>
        </div>
      </main>

      <footer className="flex h-20 items-center justify-between border-t border-white/10 px-24 text-xs text-white/40">
        <span>© 2026 Orbit Inc.</span>
        <span>Made for teams that build.</span>
        <span>Twitter ↗</span>
      </footer>
    </section>
  );
}

/* ---------------------------------- */
/* Example 03 — Portfolio Landing Page */
/* ---------------------------------- */

function PortfolioHero() {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#EAE7E0] text-[#20201E]">
      <header className="flex h-28 items-center justify-between px-24">
        <span className="text-3xl font-bold tracking-[-0.07em]">
          FOLIO<span className="text-[#99948A]">/</span>26
        </span>

        <div className="flex items-center gap-10 text-sm">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="size-2 rounded-full bg-[#6C806A]" />
          Available for projects
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-24">
        <div className="mb-9 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-[#827F77]">
          <span>Digital designer & developer</span>
          <span className="h-px w-16 bg-[#C1BDB3]" />
          <span>Cairo, Egypt</span>
        </div>

        <div className="flex items-end justify-between gap-10">
          <h1 className="text-[126px] font-semibold leading-[0.9] tracking-[-0.09em]">
            Creative
            <br />
            by nature<span className="text-[#A1A18B]">.</span>
          </h1>

          <p className="mb-4 max-w-sm text-xl leading-relaxed text-[#77746D]">
            I build digital experiences that combine thoughtful design, modern
            technology, and meaningful interactions.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-5">
          <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#C7D2C0] p-7">
            <span className="text-xs uppercase tracking-widest text-black/50">
              01 / Web design
            </span>
            <div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Digital spaces
              </h3>
              <span className="mt-3 flex items-center justify-between text-sm">
                Explore project
                <ArrowUpRight />
              </span>
            </div>
            <div className="absolute -right-10 -top-12 size-48 rounded-full border-[30px] border-[#8CA187]/60 transition-transform duration-500 group-hover:scale-110" />
          </div>

          <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#D8C7B6] p-7">
            <span className="text-xs uppercase tracking-widest text-black/50">
              02 / Development
            </span>
            <div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Creative code
              </h3>
              <span className="mt-3 flex items-center justify-between text-sm">
                Explore project
                <ArrowUpRight />
              </span>
            </div>
            <div className="absolute -right-12 -top-12 size-52 rotate-45 rounded-[40px] bg-[#B69A7D]/50 transition-transform duration-500 group-hover:rotate-90" />
          </div>

          <div className="group relative flex h-[235px] flex-col justify-between overflow-hidden rounded-2xl bg-[#BFC4D4] p-7">
            <span className="text-xs uppercase tracking-widest text-black/50">
              03 / Animation
            </span>
            <div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Motion studies
              </h3>
              <span className="mt-3 flex items-center justify-between text-sm">
                Explore project
                <ArrowUpRight />
              </span>
            </div>
            <div className="absolute -right-6 -top-12 size-44 rounded-full border-[25px] border-[#929BB5]/60 transition-transform duration-500 group-hover:scale-125" />
          </div>
        </div>
      </main>

      <footer className="flex h-20 items-center justify-between border-t border-black/10 px-24 text-xs text-[#827F77]">
        <span>© 2026 Folio</span>
        <span>Designed with intention.</span>
        <span>Get in touch ↗</span>
      </footer>
    </section>
  );
}

/* ---------------------------------- */
/* Navigation Controls                */
/* ---------------------------------- */

function PrevNextControls({
  exampleIndex,
  setExampleIndex,
}: {
  exampleIndex: number;
  setExampleIndex: Dispatch<SetStateAction<number>>;
}) {
  const goToPrevious = () => {
    setExampleIndex((index) => (index - 1 + EXAMPLES.length) % EXAMPLES.length);
  };

  const goToNext = () => {
    setExampleIndex((index) => (index + 1) % EXAMPLES.length);
  };

  return (
    <nav
      aria-label="Example navigation"
      className="relative mx-auto flex items-center justify-between gap-3 rounded-full border border-border/60 bg-my-primary/70 px-2 py-1.5 shadow-sm backdrop-blur"
    >
      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous example"
        title="Previous example (←)"
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-my-bg px-7 text-foreground transition hover:bg-my-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-muted"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
      </button>

      <div className="flex items-center">
        {EXAMPLES.map((number, index) => (
          <button
            key={number}
            type="button"
            onClick={() => setExampleIndex(index)}
            aria-label={`Show example ${number}`}
            aria-current={index === exampleIndex ? "true" : undefined}
            className="group flex size-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span
              className={`size-1.5 rounded-full transition-all ${index === exampleIndex
                ? "scale-125 bg-foreground"
                : "bg-foreground/20 group-hover:bg-foreground/45"
                }`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next example"
        title="Next example (→)"
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-7 text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
