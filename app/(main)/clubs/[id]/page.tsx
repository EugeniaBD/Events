"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityChildrenCardContent from "@/features/entity-children-card-content";
import { getById, update } from "@/firebase/firestore/clubsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TClub, TRequest } from "@/lib/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [club, setClub] = React.useState<TClub | null>(null);

  React.useEffect(() => {
    getById(id).then((club) => {
      setClub(club);
    });
  }, [id]);

  React.useEffect(() => {
    if (params.get("action") === "join" && user) {
      handleJoin();
    }
  }, [params, user]);

  const handleBack = () => router.back();
  const handleJoin = () => {
    if (!club) {
      return;
    }

    if (!user) {
      router.push(`/signin?redirect-url=/clubs/${id}?action=join`, {
        scroll: true,
      });
      return;
    }

    const { uid, displayName, email } = user;
    const request: TRequest = {
      user: { id: uid, displayName, email },
    };
    const requests: TRequest[] = club.requests
      ? [...club.requests, { ...request }]
      : [{ ...request }];
    update({ ...club, requests }).then((data) => console.log(data));
  };

  return (
    <>
      <div className="flex">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {club && (
          <Card>
            <CardHeader className="flex flex-row items-start space-x-1 space-y-0">
              <div className="flex-grow">
                <CardTitle>{club.title}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </div>
              <div className="m-0">
                <Button onClick={handleJoin}>Join</Button>
              </div>
            </CardHeader>
            <EntityChildrenCardContent events={club.events || []} />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
