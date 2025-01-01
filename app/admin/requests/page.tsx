"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestList from "@/features/request-list";
import { getAllByUserId as getAllClubsByUserId } from "@/firebase/firestore/clubsCollection";
import { getAllByUserId as getAllGroupsByUserId } from "@/firebase/firestore/groupsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TAdminRequestGroupItem } from "@/lib/types";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [requestGroups, setrequestGroups] = React.useState<
    TAdminRequestGroupItem[]
  >([]);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    Promise.all([
      getAllClubsByUserId(user.uid).then(
        (entities) =>
          ({
            type: "Clubs",
            entities: entities.filter((e) => e.requests),
          } as TAdminRequestGroupItem)
      ),
      getAllGroupsByUserId(user.uid).then(
        (entities) =>
          ({
            type: "Groups",
            entities: entities.filter((e) => e.requests),
          } as TAdminRequestGroupItem)
      ),
    ]).then((results) => {
      const data = results;
      console.log("data", data);
      setrequestGroups(data);
    });
  }, [user]);

  return (
    <>
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Requests</h6>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {requestGroups.map((request) => (
          <Card key={request.type}>
            <CardHeader className="border-b p-4">
              <CardTitle className="text-xl">
                {request.type}{" "}
                <Badge className="rounded-full">
                  {request.entities.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                <Badge className="rounded-full">
                  {request.entities.flatMap((e) => e.requests ?? []).length}{" "}
                  Requests are pending
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {request.entities.map((entity) => (
                  <div key={entity.id} className="space-y-2">
                    <h6 className="font-semibold">
                      {entity.title}{" "}
                      <Badge className="rounded-full">
                        Requests: {entity.requests?.length}
                      </Badge>
                    </h6>
                    <RequestList requests={entity.requests} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
