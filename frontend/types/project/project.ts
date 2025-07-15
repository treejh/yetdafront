export interface ProductOption {
  title: string;
  content: string;
  price: number;
  fileUrl: string | null;
  optionStatus: string;
  providingMethod: string;
  purchaseOptionId: number;
}

export interface Creator {
  userId: number;
  name: string;
  userProfileImage: string;
  userIntroduce: string;
  email: string;
  followerCount: number;
}

export interface ProjectStats {
  likes: number;
  shares: number;
  views: number;
}

export interface Project {
  projectId: number;
  title: string;
  introduce: string;
  content: string;
  purchaseCategoryId: number;
  purchaseCategoryName: string;
  averageDeliveryTime: string;
  contentImageUrls: string[];

  purchaseOptions: ProductOption[];

  userId: number;
  name: string;
  userProfileImage: string;
  userIntroduce: string;
  email: string;

  projectCount: number;
  followerCount: number;

  stats?: ProjectStats;
}
