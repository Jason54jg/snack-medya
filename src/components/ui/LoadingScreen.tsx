type Props = {
  fullPage?: boolean;
  label?: string;
};

export function LoadingScreen({
  fullPage = true,
  label = "Snack Medya",
}: Props) {
  return (
    <div
      className={
        fullPage
          ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          : "flex min-h-[50vh] flex-col items-center justify-center py-20"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-bordeaux/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-bordeaux border-r-bordeaux/40" />
          <span className="absolute inset-3 rounded-full bg-bordeaux/10" />
        </div>
        <p className="font-display text-2xl font-semibold tracking-tight text-bordeaux sm:text-3xl">
          {label}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bordeaux [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bordeaux [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bordeaux [animation-delay:300ms]" />
        </div>
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
