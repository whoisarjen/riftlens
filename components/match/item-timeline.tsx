import Image from "next/image";
import { itemImageUrl } from "@/lib/riot/ddragon";
import type { ParticipantDetail } from "@/lib/types/internal";

interface ItemTimelineProps {
  participant: ParticipantDetail;
  version: string;
}

function ItemIcon({
  itemId,
  version,
}: {
  itemId: number;
  version: string;
}) {
  if (!itemId || itemId === 0) {
    return (
      <div
        className="h-8 w-8 rounded border border-[#27272A] bg-[#09090B]"
        title="Empty slot"
      />
    );
  }

  return (
    <div className="group relative">
      <Image
        src={itemImageUrl(version, itemId)}
        alt={`Item ${itemId}`}
        width={32}
        height={32}
        className="rounded border border-[#27272A] transition-transform group-hover:scale-110"
      />
      <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-[#18181B] px-2 py-1 text-xs text-foreground shadow-lg ring-1 ring-[#27272A] group-hover:block">
        Item {itemId}
      </div>
    </div>
  );
}

export function ItemTimeline({ participant, version }: ItemTimelineProps) {
  const items = participant.items ?? [];

  return (
    <div className="flex items-center gap-1">
      {/* Main items (slots 0-5) */}
      {items.slice(0, 6).map((itemId, idx) => (
        <ItemIcon key={idx} itemId={itemId} version={version} />
      ))}
      {/* Trinket (slot 6) */}
      {items.length > 6 && (
        <div className="ml-2 rounded border border-dashed border-[#27272A]">
          <ItemIcon itemId={items[6]} version={version} />
        </div>
      )}
    </div>
  );
}
