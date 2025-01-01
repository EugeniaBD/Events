import React from "react";
import auth from "@/firebase/auth";
import { getUserRole } from "@/firebase/firestore/usersCollection";
import { TUser } from "@/lib/types";

const useFirebaseAuth = () => {
  const [user, setUser] = React.useState<TUser | null>(null);

  React.useEffect(() => {
    auth.onAuthStateChanged(async (data) => {
      let _user: TUser | null = null;
      if (data) {
        const userRole = await getUserRole(data?.uid);
        _user = { ...data, role: "" };
        if (userRole) {
          _user = { ..._user, role: userRole.role };
        }
      }
      setUser(_user);
    });
  }, [auth]);

  return { user };
};

export default useFirebaseAuth;
