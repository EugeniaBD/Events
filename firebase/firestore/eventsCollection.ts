import { TEvent } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import getCollection from "./operations/getCollectionSnapshot";
import * as query from "./operations/query";

export const PATH = "events";

export const create = (club: Omit<TEvent, "id">) => {
  return createDocument(PATH, club);
};

export const getById = async (id: string) => {
  return await query.findById<TEvent>(PATH, id);
};

export const getAll = async () => {
  const { error, result } = await getCollection<TEvent>(PATH);
  if (error || !result) {
    console.error(error);
    return [];
  }
  if (!result) {
    return [];
  }
  return result;
};
