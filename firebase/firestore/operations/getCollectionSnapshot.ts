import { firestore } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

const getCollection = async <T>(path: string) => {
  let result = null;
  let error = null;
  try {
    result = (await getDocs(collection(firestore, path))).docs.map(
      (d) => ({ id: d.id, ...d.data() } as T)
    );
  } catch (e) {
    error = e;
  }
  return { result, error };
};

export default getCollection;
