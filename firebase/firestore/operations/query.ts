import {
  collection,
  documentId,
  FieldPath,
  getDocs,
  query,
  QueryConstraint,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { firestore } from "../../config";

export const findById = async <T>(path: string, id: string) => {
  console.log("path, id", path, id);
  const querySnap = await queryWhere(path, documentId(), "==", id);
  if (querySnap.empty) {
    return null;
  }
  return querySnap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as T)
  )[0];
};

export const queryWhere = async (
  path: string,
  fieldPath: string | FieldPath,
  opStr: WhereFilterOp,
  value: unknown
) => {
  return queryFrom(path, where(fieldPath, opStr, value));
};

export const queryFrom = async (
  path: string,
  ...queryConstraints: QueryConstraint[]
) => {
  const q = query(collection(firestore, path), ...queryConstraints);
  return await getDocs(q);
};
