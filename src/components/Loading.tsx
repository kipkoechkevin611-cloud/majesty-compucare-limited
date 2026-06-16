export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        <p className="text-white mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}
