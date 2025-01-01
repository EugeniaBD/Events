"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityChildrenCardContent from "@/features/entity-children-card-content";
import EntityUserActions from "@/features/entity-user-actions";
import { getById, update } from "@/firebase/firestore/clubsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TClub, TRequest } from "@/lib/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [club, setClub] = React.useState<TClub | null>(null);

  const fetchById = React.useCallback(() => {
    if (id) {
      getById(id).then((club) => {
        setClub(club);
      });
    }
  }, [id]);

  React.useEffect(() => {
    if (params.get("action") === "join" && user) {
      handleJoin();
      router.replace(`/clubs/${id}`, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, user]);

  React.useEffect(() => {
    fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => router.back();

  const handleJoin = useCallback(() => {
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
      id: uid,
      user: { id: uid, displayName, email },
    };
    const requests: TRequest[] = club.requests
      ? [...club.requests, { ...request }]
      : [{ ...request }];
    update({ ...club, requests }).then(() => fetchById());
  }, [club, user]);

  const handleLeave = () => {};

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
              {user && club && (
                <EntityUserActions
                  user={user}
                  requests={club.requests ?? []}
                  members={club.members ?? []}
                  join={handleJoin}
                  leave={handleLeave}
                />
              )}
            </CardHeader>
            <EntityChildrenCardContent events={club.events || []} />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
