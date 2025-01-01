import { TClub } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import getCollection from "./operations/getCollectionSnapshot";
import { findById, queryWhere } from "./operations/query";
import updateDocument from "./operations/updateDocumentSnapshot";

export const PATH = "clubs";

export const create = (club: Omit<TClub, "id">) => {
  return createDocument(PATH, club);
};

export const update = (club: TClub) => {
  return updateDocument(PATH, club.id, club);
};

export const getById = async (id: string) => {
  return await findById<TClub>(PATH, id);
};

export const getAll = async () => {
  const { error, result } = await getCollection<TClub>(PATH);
  if (error || !result) {
    console.error(error);
    return [];
  }
  if (!result) {
    return [];
  }
  return result;
};

export const getAllByUserId = async (userId: string) => {
  const records = await queryWhere<TClub>(PATH, "userId", "==", userId);
  if (!records) {
    return [];
  }
  return records;
};
