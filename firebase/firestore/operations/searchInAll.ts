import { firestore } from "@/firebase/config";
import { TEntity } from "@/lib/types";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { PATH as CLUBS } from "../clubsCollection";
import { PATH as EVENTS } from "../eventsCollection";
import { PATH as GROUPS } from "../groupsCollection";

export const searchIn = async <T>(
  searchQuery: string,
  path: string,
  type: string
) => {
  let q = undefined;
  if (searchQuery && searchQuery !== "") {
    q = query(
      collection(firestore, path),
      orderBy("title"),
      startAt(searchQuery),
      endAt(searchQuery + "\uf8ff")
    );
  } else {
    q = query(collection(firestore, path));
  }

  const { empty, docs } = await getDocs(q);
  if (empty) {
    return [];
  }
  return docs.map((d) => ({ id: d.id, type, ...d.data() } as T));
};

export const searchInAll = async (searchQuery: string) => {
  const allPromiseResults = await Promise.all([
    searchIn<TEntity>(searchQuery, CLUBS, "Club"),
    searchIn<TEntity>(searchQuery, GROUPS, "Group"),
    searchIn<TEntity>(searchQuery, EVENTS, "Event"),
  ]);
  const entities = allPromiseResults.flatMap((d) => d);
  return [...entities];
};
