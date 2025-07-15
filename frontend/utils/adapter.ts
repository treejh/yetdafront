export interface CardData {
  id: number;
  hostName: string;
  thumbnail: string;
  title: string;
  sellingAmount: number;
}

export function toCardData(raw: any): CardData {
  return {
    id: raw.id,
    hostName: raw.hostName ?? raw.ownerName ?? "알 수 없는 호스트",
    thumbnail: raw.thumbnail ?? raw.thumbnailUrl ?? "/images/sample-image.jpg",
    title: raw.title,
    sellingAmount: raw.sellingAmount ?? 0,
  };
}
