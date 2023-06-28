import { GetNameUniquenessResponse } from "../types";

export const checkNameUniquenessStub = async (name: string): Promise<GetNameUniquenessResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ available: name.length % 2 === 0 });
    }, 3000);
  });
}