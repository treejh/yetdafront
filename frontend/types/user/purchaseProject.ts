export interface PurchaseOption {
  title: string;
  content: string;
  price: number;
  fileUrl: string | null;
  optionStatus: string;
}

export interface ProjectContent {
  id: number;
  title: string;
  contentImageUrls: string;
  hostName: string;
  purchaseOptions: PurchaseOption[];
}

export interface PurchaseProject {
  totalElements: number;
  content: ProjectContent[];
}
