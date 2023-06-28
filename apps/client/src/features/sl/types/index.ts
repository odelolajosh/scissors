
// SL = Short Link
export type SL = {
  _id: string;
  name: string;
  url: string;
  shortLink: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clicks: number;
}

export type GetSLsResponse = {
  sls: SL[];
  total: number;
  page: number;
}

export type GetNameUniquenessResponse = {
  available: boolean;
}