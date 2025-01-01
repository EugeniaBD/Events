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
import {
  getAllByUserId as getAllClubsByUserId,
  update as updateClub,
} from "@/firebase/firestore/clubsCollection";
import {
  getAllByUserId as getAllGroupsByUserId,
  update as updateGroup,
} from "@/firebase/firestore/groupsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TAdminRequestGroupItem, TEntity } from "@/lib/types";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();

  const [requestGroups, setRequestGroups] = React.useState<
    TAdminRequestGroupItem[]
  >([]);

  const fetchRequests = React.useCallback(() => {
    if (!user) {
      return;
    }

    Promise.all([
      getAllClubsByUserId(user.uid).then(
        (entities) =>
          ({
            type: "Clubs",
            entities: entities.filter(
              (e) => e.requests && e.requests.length > 0
            ),
          } as TAdminRequestGroupItem)
      ),
      getAllGroupsByUserId(user.uid).then(
        (entities) =>
          ({
            type: "Groups",
            entities: entities.filter(
              (e) => e.requests && e.requests.length > 0
            ),
          } as TAdminRequestGroupItem)
      ),
    ]).then((results) => {
      const data = results.filter((e) => e.entities && e.entities.length > 0);
      console.log("data", data);
      setRequestGroups(data);
    });
  }, [user]);

  React.useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleRequestReject = (
    { type, ...rest }: TEntity,
    requestId: string
  ) => {
    const requests = rest.requests?.filter((r) => r.id !== requestId);
    const _rest = { ...rest, requests };
    let promise = undefined;
    if (type.toLocaleLowerCase() === "club") {
      promise = updateClub({ ..._rest });
    } else if (type.toLocaleLowerCase() === "group") {
      promise = updateGroup({ ..._rest });
    }

    if (!promise) {
      return;
    }

    promise.then(() => fetchRequests());
  };

  const handleRequestAccept = (
    { type, ...rest }: TEntity,
    requestId: string
  ) => {
    const requestByUser = rest.requests?.find((r) => r.id === requestId);
    const members = rest.members ? [...rest.members] : [];
    if (requestByUser) {
      members.push(requestByUser.user);
    }
    const requests = rest.requests?.filter((r) => r.id !== requestId);
    const _rest = { ...rest, requests, members };
    let promise = undefined;
    if (type.toLocaleLowerCase() === "club") {
      promise = updateClub({ ..._rest });
    } else if (type.toLocaleLowerCase() === "group") {
      promise = updateGroup({ ..._rest });
    }

    if (!promise) {
      return;
    }

    promise.then(() => fetchRequests());
  };

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
                    <RequestList
                      requests={entity.requests}
                      onAccept={(requestId: string) =>
                        handleRequestAccept(entity, requestId)
                      }
                      onReject={(requestId: string) =>
                        handleRequestReject(entity, requestId)
                      }
                    />
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
