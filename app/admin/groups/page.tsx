"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByUserId } from "@/firebase/firestore/groupsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TGroup } from "@/lib/types";
import Link from "next/link";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [groups, setGroups] = React.useState<TGroup[]>([]);

  React.useEffect(() => {
    if (user) {
      getAllByUserId(user.uid).then((data) => setGroups(data));
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Groups</h6>
        <Button asChild>
          <Link href="/admin/groups/create">Create</Link>
        </Button>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {groups.map(({ id, title, description, requests }) => (
          <Card key={id}>
            <CardHeader>
              <Link href={`/admin/groups/${id}`}>
                <CardTitle className="text-2xl inline-flex items-center space-x-1">
                  <span>{title}</span>
                  {requests && requests.length > 0 && (
                    <Badge className="rounded-full">{requests.length}</Badge>
                  )}
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
