import { getAuth } from "firebase/auth";
import firebaseApp from "../config";

const auth = getAuth(firebaseApp);
export default auth;
