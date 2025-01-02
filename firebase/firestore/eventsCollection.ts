import { TEvent } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import getCollection from "./operations/getCollectionSnapshot";
import * as query from "./operations/query";
import updateDocument from "./operations/updateDocumentSnapshot";

export const PATH = "events";

export const create = (event: Omit<TEvent, "id">) => {
  return createDocument(PATH, event);
};

export const update = (event: TEvent) => {
  return updateDocument(PATH, event.id, event);
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

export const getAllByUserId = async (userId: string) => {
  const records = await query.queryWhere<TEvent>(PATH, "userId", "==", userId);
  if (!records || records.length === 0) {
    return [];
  }
  return records;
};

export const getAllByMemberId = async (userId: string) => {
  const records = await getCollection<TEvent>(PATH);
  const { error } = records;
  let { result } = records;
  if (result) {
    result = result.filter((r) => !!r.bookings?.find((m) => m.id === userId));
  }
  return { error, result };
};
