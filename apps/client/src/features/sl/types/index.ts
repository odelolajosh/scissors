
// SL = Short Link
export type SL = {
  _id: string;
  name: string;
  url: string;
  shortLink: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  visits: number;
  qrUrl?: string;
}

export type GetSLsResponse = {
  sls: SL[];
  total: number;
  page: number;
}

export type GetSLResponse = {
  sl: SL;
}

export type GetNameUniquenessResponse = {
  available: boolean;
}

export type GetStatResponse = {
  activities: {
    timeline: {
      date: string;
      visits: number;
    }[],
    ip: string;
  }[]
}