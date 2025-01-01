import { TUserRole } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import { queryWhere } from "./operations/query";

const USERS = "users";

export const setUserRole = (userRole: Omit<TUserRole, "id">) => {
  return createDocument(USERS, userRole);
};

export const getUserRole = async (userId: string) => {
  const records = await queryWhere<TUserRole>(USERS, "userId", "==", userId);
  if (!records || records.length === 0) {
    return;
  }
  return records[0];
};
