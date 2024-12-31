"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityChildrenCardContent from "@/features/entity-children-card-content";
import { getById } from "@/firebase/firestore/groupsCollection";
import { TGroup } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [group, setGroup] = React.useState<TGroup | null>(null);

  React.useEffect(() => {
    getById(id).then((data) => {
      setGroup(data);
    });
  }, [id]);

  const handleBack = () => router.back();

  return (
    <>
      <div className="flex">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {group && (
          <Card>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <EntityChildrenCardContent
              events={group.events}
              requests={group.requests}
              members={group.members}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
