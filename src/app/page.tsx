// import Image from "next/image";
// import { absoluteUrl } from "@/lib/utils";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert h-5 w-[100px]"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the{" "}
//             <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
//               page.tsx
//             </code>{" "}
//             file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert h-[14px] w-4"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={14}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//         {absoluteUrl("/collections")}
//       </main>
//     </div>
//   );
// }

export default function DocumentationLayout() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#F1F1F1] selection:bg-[#C9FE6E] selection:text-black">
      {/* Main Grid: 15px gutter, 25px outer margin */}
      <div className="flex flex-col lg:flex-row gap-[15px] px-[25px] py-10 max-w-[1600px] mx-auto">
        {/* LEFT COLUMN: Navigation / Table of Contents */}
        <aside className="hidden lg:block w-[250px] shrink-0">
          <div className="sticky top-10 flex flex-col gap-6 justify-end h-[calc(100vh-80px)]">
            {/* SVG Logo Placeholder */}
            <div className="w-8 h-8 bg-[#323232] rounded flex items-center justify-center text-xs">
              M
            </div>
            <ul className="flex flex-col gap-3 text-sm text-[#999]">
              <li>
                <a
                  href="#anchor1"
                  className="text-white hover:text-white transition-colors"
                >
                  Free Effect 002 - Gravity Mouse Trail
                </a>
              </li>
              <li>
                <a
                  href="#anchor1"
                  className="hover:text-white transition-colors"
                >
                  HTML Structure
                </a>
              </li>
              <li>
                <a
                  href="#anchor2"
                  className="hover:text-white transition-colors"
                >
                  Some CSS
                </a>
              </li>
              <li>
                <a
                  href="#anchor3"
                  className="hover:text-white transition-colors"
                >
                  Starting the animation
                </a>
              </li>
              <li>
                <a
                  href="#anchor4"
                  className="hover:text-white transition-colors"
                >
                  Triggering image creation
                </a>
              </li>
              <li>
                <a
                  href="#anchor5"
                  className="hover:text-white transition-colors"
                >
                  Inside createMedia()
                </a>
              </li>
              <li>
                <a
                  href="#anchor6"
                  className="hover:text-white transition-colors"
                >
                  Going further
                </a>
              </li>
              <li>
                <a
                  href="#anchor7"
                  className="hover:text-white transition-colors"
                >
                  Final code
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* MIDDLE COLUMN: Main Content area (610px width centered)[cite: 2] */}
        <main className="flex-1 lg:max-w-[610px] mx-auto w-full">
          {/* Hero / Video section[cite: 1] */}
          <div className="relative rounded-2xl overflow-hidden bg-[#232323] aspect-[4/3] mb-8 flex flex-col items-center justify-center p-8 text-center border border-[#323232]">
            {/* Placeholder for video / visual effect */}
            <h1 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4">
              <span className="block text-[#999] text-lg mb-2">
                Codrops x MWG
              </span>
              Gravity Mouse Trail
            </h1>
            <p className="text-[#999] text-sm md:text-base max-w-md">
              This mouse trail has a unique twist. As the user moves the cursor,
              images are created, fall to the bottom of the screen, bounce, and
              eventually fade away. Let's see how it works!
            </p>
          </div>

          <h2 className="text-xl font-medium mb-4 mt-12" id="anchor1">
            HTML Structure
          </h2>
          <p className="text-[#999] mb-6 leading-relaxed">
            The structure here is quite simple. We will simply call the set of
            images we want for our effect:
          </p>

          {/* Code Wrapper Component[cite: 1] */}
          <div className="relative bg-[#232323] rounded-xl border border-[#323232] overflow-hidden mb-12 group">
            {/* Copy Button[cite: 1] */}
            <button
              type="button"
              className="absolute top-4 right-4 bg-[#323232] hover:bg-white hover:text-black text-white p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </button>

            <div className="p-6 overflow-x-auto text-sm font-mono text-[#999]">
              <pre>
                <code>
                  <span className="text-[#28DF7D]">&lt;section</span>{" "}
                  <span className="text-[#C9FE6E]">class=</span>
                  <span className="text-white">"mwg_free_effect002"</span>
                  <span className="text-[#28DF7D]">&gt;</span>
                  {"\n"}
                  {"    "}
                  <span className="text-[#28DF7D]">&lt;div</span>{" "}
                  <span className="text-[#C9FE6E]">class=</span>
                  <span className="text-white">"medias"</span>
                  <span className="text-[#28DF7D]">&gt;</span>
                  {"\n"}
                  {"        "}
                  <span className="text-[#28DF7D]">&lt;img</span>{" "}
                  <span className="text-[#C9FE6E]">src=</span>
                  <span className="text-white">"./assets/medias/01.png"</span>{" "}
                  <span className="text-[#C9FE6E]">alt=</span>
                  <span className="text-white">""</span>
                  <span className="text-[#28DF7D]">&gt;</span>
                  {"\n"}
                  {"        "}
                  <span className="text-[#28DF7D]">&lt;img</span>{" "}
                  <span className="text-[#C9FE6E]">src=</span>
                  <span className="text-white">"./assets/medias/02.png"</span>{" "}
                  <span className="text-[#C9FE6E]">alt=</span>
                  <span className="text-white">""</span>
                  <span className="text-[#28DF7D]">&gt;</span>
                  {"\n"}
                  {"    "}
                  <span className="text-[#28DF7D]">&lt;/div&gt;</span>
                  {"\n"}
                  <span className="text-[#28DF7D]">&lt;/section&gt;</span>
                </code>
              </pre>
            </div>
          </div>

          <h2 className="text-xl font-medium mb-4 mt-12" id="anchor2">
            Some CSS
          </h2>
          <p className="text-[#999] mb-6 leading-relaxed">
            Now, I will hide these images using a bit of CSS.
          </p>

          <div className="relative bg-[#232323] rounded-xl border border-[#323232] overflow-hidden mb-12 group">
            <button
              type="button"
              className="absolute top-4 right-4 bg-[#323232] hover:bg-white hover:text-black text-white p-2 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </button>
            <div className="p-6 overflow-x-auto text-sm font-mono text-[#999]">
              <pre>
                <code>
                  <span className="text-white">
                    .mwg_free_effect002 .medias img
                  </span>{" "}
                  {"{\n"}
                  {"    "}
                  <span className="text-[#C9FE6E]">width</span>:{" "}
                  <span className="text-[#28DF7D]">1px</span>;{"\n"}
                  {"    "}
                  <span className="text-[#C9FE6E]">height</span>:{" "}
                  <span className="text-[#28DF7D]">1px</span>;{"\n"}
                  {"    "}
                  <span className="text-[#C9FE6E]">visibility</span>:{" "}
                  <span className="text-[#28DF7D]">hidden</span>;{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Methods & Properties (Fixed width 325px)[cite: 2] */}
        <aside className="hidden xl:flex w-[250px] shrink-0 flex-col justify-between">
          <div className="sticky top-10 flex flex-col h-[calc(100vh-80px)]">
            {/* Top Tabs[cite: 1] */}
            <div
              id="methods"
              className="flex justify-between items-center border-b border-[#323232] pb-4 mb-6"
            >
              <button type="button" className="text-white font-medium text-sm">
                Methods & Properties
              </button>
              <button
                type="button"
                aria-label="Information"
                className="text-[#999] hover:text-white"
              >
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 14 14"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="m6.61719 9.01914v-2.4m0-2.4h.006m5.99401 2.4c0 3.31371-2.6863 5.99996-6.00001 5.99996s-6.000002-2.68625-6.000002-5.99996 2.686292-5.999999 6.000002-5.999999 6.00001 2.686289 6.00001 5.999999z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Methods Lists[cite: 1] */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-xs text-[#777] uppercase tracking-wider mb-3">
                  Key JS Methods
                </h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      href="#methods"
                      className="flex justify-between items-center text-sm text-[#999] hover:text-white group"
                    >
                      <span>Array.prototype.forEach()</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#methods"
                      className="flex justify-between items-center text-sm text-[#999] hover:text-white group"
                    >
                      <span>Math.random()</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#methods"
                      className="flex justify-between items-center text-sm text-[#999] hover:text-white group"
                    >
                      <span>getBoundingClientRect()</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xs text-[#777] uppercase tracking-wider mb-3">
                  Key GSAP Methods
                </h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <a
                      href="#methods"
                      className="flex justify-between items-center text-sm text-[#999] hover:text-white group"
                    >
                      <span>gsap.fromTo()</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#methods"
                      className="flex justify-between items-center text-sm text-[#999] hover:text-white group"
                    >
                      <span>gsap.timeline()</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Action Buttons (Copy / Download)[cite: 1] */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                className="w-full bg-[#232323] hover:bg-[#323232] text-white py-4 rounded-xl flex items-center justify-between px-6 transition-colors border border-[#323232]"
              >
                <span className="flex items-center gap-3">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Copy to Webflow
                </span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 bg-white hover:bg-gray-200 text-black py-4 rounded-xl flex items-center justify-between px-6 transition-colors font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                    COPY EFFECT
                  </span>
                  <span>↗</span>
                </button>
                <button
                  type="button"
                  aria-label="Preview effect"
                  className="w-14 bg-[#232323] border border-[#323232] rounded-xl flex items-center justify-center hover:bg-[#323232] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
