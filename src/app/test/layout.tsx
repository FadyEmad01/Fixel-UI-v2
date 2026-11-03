export default function TestLayout({ children }: LayoutProps<"/test">) {
  return (
     <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="flex max-h-[82svh] w-full max-w-5xl items-center justify-center">
          {children}
        </div>
      </div>

      
    </main>
  );
}