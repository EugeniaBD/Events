"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityChildrenCardContent from "@/features/entity-children-card-content";
import { getById, update } from "@/firebase/firestore/groupsCollection";
import { TGroup } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [group, setGroup] = React.useState<TGroup | null>(null);

  const fetchById = React.useCallback(() => {
    getById(id).then((data) => {
      setGroup(data);
    });
  }, [id]);

  React.useEffect(() => {
    if (id) fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => router.back();

  const handleRequestReject = React.useCallback(
    (requestId: string) => {
      if (group) {
        const requests = group.requests?.filter((r) => r.id !== requestId);
        const _group = { ...group, requests };
        update({ ..._group }).then(() => fetchById());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group]
  );

  const handleRequestAccept = React.useCallback(
    (requestId: string) => {
      if (group) {
        console.log("group", group);
        const requestByUser = group.requests?.find((r) => r.id === requestId);
        const members = group.members ? [...group.members] : [];
        if (requestByUser) {
          members.push(requestByUser.user);
        }
        const requests = group.requests?.filter((r) => r.id !== requestId);
        const _group = { ...group, requests, members };
        update({ ..._group }).then(() => fetchById());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group]
  );

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
              events={group.events || []}
              requests={group.requests || []}
              onAccept={handleRequestAccept}
              onReject={handleRequestReject}
              members={group.members || []}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
