export default function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col rounded-[16px] overflow-hidden bg-white border border-gray-200/60 shadow-sm">
      {/* Image Skeleton */}
      <div className="relative w-full h-[300px] min-h-[300px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="absolute inset-0 animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex-1">
          {/* Category Skeleton */}
          <div className="h-3 w-16 rounded-md bg-slate-200 mb-2 animate-pulse" />
          
          {/* Title Skeleton */}
          <div className="h-5 w-full rounded-md bg-slate-200 mb-2 animate-pulse" />
          <div className="h-5 w-3/4 rounded-md bg-slate-200 mb-3 animate-pulse" />
          
          {/* Price Skeleton */}
          <div className="h-6 w-24 rounded-md bg-slate-200 mb-3 animate-pulse" />
          
          {/* Stock Skeleton */}
          <div className="h-3 w-20 rounded-md bg-slate-200 animate-pulse" />
        </div>

        {/* Buttons Skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center gap-2">
          <div className="flex-1 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-10 w-20 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
