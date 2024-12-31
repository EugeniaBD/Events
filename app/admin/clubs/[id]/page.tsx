"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityChildrenCardContent from "@/features/entity-children-card-content";
import { getById } from "@/firebase/firestore/clubsCollection";
import { TClub } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [club, setClub] = React.useState<TClub | null>(null);

  React.useEffect(() => {
    getById(id).then((club) => {
      setClub(club);
    });
  }, [id]);

  const handleBack = () => router.back();

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
              members={club.members || []}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
