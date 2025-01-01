"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByUserId } from "@/firebase/firestore/clubsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TClub } from "@/lib/types";
import Link from "next/link";
import React from "react";

const Page: React.FC = () => {
  const [clubs, setClubs] = React.useState<TClub[]>([]);
  const { user } = useFirebaseAuth();

  React.useEffect(() => {
    if (user) {
      getAllByUserId(user.uid).then((data) => setClubs(data));
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Clubs</h6>
        <Button asChild>
          <Link href="/admin/clubs/create">Create</Link>
        </Button>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {clubs.map(({ id, title, description, requests, members }) => (
          <Card key={id}>
            <CardHeader>
              <Link href={`/admin/clubs/${id}`}>
                <CardTitle className="text-2xl flex items-start space-x-1 ">
                  <span className="flex-grow">{title}</span>
                  <span className="flex space-x-1">
                    {requests && requests.length > 0 && (
                      <Badge className="rounded-full">
                        Requests {requests.length}
                      </Badge>
                    )}
                    {members && members.length > 0 && (
                      <Badge className="rounded-full">
                        Members {members.length}
                      </Badge>
                    )}
                  </span>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
