import { TGroup } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import getCollection from "./operations/getCollectionSnapshot";
import * as query from "./operations/query";

export const PATH = "groups";

export const create = (club: Omit<TGroup, "id">) => {
  return createDocument(PATH, club);
};

export const getById = async (id: string) => {
  return await query.findById<TGroup>(PATH, id);
};

export const getAll = async () => {
  const { error, result } = await getCollection<TGroup>(PATH);
  if (error || !result) {
    console.error(error);
    return [];
  }
  if (!result) {
    return [];
  }
  return result;
};
