"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByMemberId } from "@/firebase/firestore/clubsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TClub } from "@/lib/types";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [clubs, setClubs] = React.useState<TClub[]>([]);

  const fetchClubs = React.useCallback(() => {
    if (user) {
      getAllByMemberId(user.uid).then(({ result }) => {
        if (result) setClubs(result);
      });
    }
  }, [user]);

  React.useEffect(() => {
    fetchClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="">
        <h6 className="font-semibold text-lg">Joined Clubs</h6>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {clubs.map(({ id, title, description }) => (
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
