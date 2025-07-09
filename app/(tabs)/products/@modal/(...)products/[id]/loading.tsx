export default function ProductModalSkeleton({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-neutral-800 p-6 rounded-lg max-w-lg w-full mx-4 relative">
        {/* 닫기 버튼 스켈레톤 */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-neutral-700 rounded animate-pulse" />

        {/* 이미지 스켈레톤 */}
        <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4">
          <div className="w-full h-full bg-neutral-700 shimmer" />
        </div>

        {/* 사용자 정보 스켈레톤 */}
        <div className="flex gap-3 border-b border-neutral-700 items-center mb-4 pb-3">
          <div className="size-10 rounded-full bg-neutral-700 animate-pulse" />
          <div className="h-5 w-20 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* 제목과 가격 스켈레톤 */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-8 w-32 bg-neutral-700 rounded animate-pulse" />
          <div className="h-6 w-24 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* 설명 스켈레톤 */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-700 rounded animate-pulse" />
        </div>

        {/* 안내 텍스트 스켈레톤 */}
        <div className="text-center mt-4">
          <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
