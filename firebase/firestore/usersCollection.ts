import { TUserRole } from "@/lib/types";
import createDocument from "./operations/createDocumentSnapshot";
import { queryWhere } from "./operations/query";

const USERS = "users";

export const setUserRole = (userRole: Omit<TUserRole, "id">) => {
  return createDocument(USERS, userRole);
};

export const getUserRole = async (userId: string) => {
  const queryResult = await queryWhere(USERS, "userId", "==", userId);
  if (queryResult.empty) {
    return;
  }
  return queryResult.docs.map(
    (d) => ({ id: d.id, ...d.data() } as TUserRole)
  )[0];
};
