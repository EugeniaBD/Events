"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByMemberId } from "@/firebase/firestore/groupsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TGroup } from "@/lib/types";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [groups, setGroups] = React.useState<TGroup[]>([]);

  const fetchGroups = React.useCallback(() => {
    if (user) {
      getAllByMemberId(user.uid).then(({ result }) => {
        if (result) setGroups(result);
      });
    }
  }, [user]);

  React.useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="">
        <h6 className="font-semibold text-lg">Joined Groups</h6>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {groups.map(({ id, title, description }) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
