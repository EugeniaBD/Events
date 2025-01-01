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
import { getById, update } from "@/firebase/firestore/groupsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TGroup, TRequest } from "@/lib/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [group, setGroup] = React.useState<TGroup | null>(null);

  const fetchById = React.useCallback(() => {
    getById(id).then((club) => {
      setGroup(club);
    });
  }, [id]);

  React.useEffect(() => {
    if (params.get("action") === "join" && user) {
      handleJoin();
      router.replace(`/groups/${id}`, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, user]);

  React.useEffect(() => {
    fetchById();
  }, [id]);

  const handleBack = () => router.back();

  const handleJoin = useCallback(() => {
    if (!group) {
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
    const requests: TRequest[] = group.requests
      ? [...group.requests, { ...request }]
      : [{ ...request }];
    update({ ...group, requests }).then(() => fetchById());
  }, [group, user]);

  const handleLeave = () => {};

  return (
    <>
      <div className="flex">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {group && (
          <Card>
            <CardHeader className="flex flex-row items-start space-x-1 space-y-0">
              <div className="flex-grow">
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
              {user && group && (
                <EntityUserActions
                  user={user}
                  requests={group.requests ?? []}
                  members={group.members ?? []}
                  join={handleJoin}
                  leave={handleLeave}
                />
              )}
            </CardHeader>
            <EntityChildrenCardContent events={group.events || []} />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
