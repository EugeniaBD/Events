import { TGroup } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import getCollection from "./operations/getCollectionSnapshot";
import * as query from "./operations/query";
import updateDocument from "./operations/updateDocumentSnapshot";

export const PATH = "groups";

export const create = (group: Omit<TGroup, "id">) => {
  return createDocument(PATH, group);
};

export const update = (group: TGroup) => {
  console.log("update", group);
  return updateDocument(PATH, group.id, group);
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

export const getAllByUserId = async (userId: string) => {
  const records = await query.queryWhere<TGroup>(PATH, "userId", "==", userId);
  if (!records || records.length === 0) {
    return [];
  }
  return records;
};
