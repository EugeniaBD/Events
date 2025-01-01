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
import { TClub } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [club, setClub] = React.useState<TClub | null>(null);

  const fetchById = React.useCallback(() => {
    getById(id).then((club) => {
      setClub(club);
    });
  }, [id]);

  React.useEffect(() => {
    if (id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => router.back();

  const handleRequestReject = React.useCallback(
    (requestId: string) => {
      if (club) {
        const requests = club.requests?.filter((r) => r.id !== requestId);
        const _club = { ...club, requests };
        update({ ..._club }).then(() => fetchById());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [club]
  );

  const handleRequestAccept = React.useCallback(
    (requestId: string) => {
      if (club) {
        const requestByUser = club.requests?.find((r) => r.id === requestId);
        const members = club.members ? [...club.members] : [];
        if (requestByUser) {
          members.push(requestByUser.user);
        }
        const requests = club.requests?.filter((r) => r.id !== requestId);
        const _club = { ...club, requests, members };
        update({ ..._club }).then(() => fetchById());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [club]
  );

  return (
    <>
      <div className="flex">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {club && (
          <Card>
            <CardHeader>
              <CardTitle>{club.title}</CardTitle>
              <CardDescription>{club.description}</CardDescription>
            </CardHeader>
            <EntityChildrenCardContent
              events={club.events || []}
              requests={club.requests || []}
              onAccept={handleRequestAccept}
              onReject={handleRequestReject}
              members={club.members || []}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
