export default function ProductsListingSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
        <div className="h-7 w-20 bg-tint animate-pulse" />
        <div className="h-3 w-16 bg-tint animate-pulse" />
      </div>

      <div className="w-full px-3 py-3">
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 gap-2" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-full bg-light-grey rounded-sm animate-pulse" style={{ aspectRatio: "2 / 3" }} />
          ))}
        </div>
      </div>
    </>
  );
}
