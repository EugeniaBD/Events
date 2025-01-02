"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntityUserActions from "@/features/entity-user-actions";
import { getById, update } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEvent } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = React.useState<TEvent | null>(null);
  const { user } = useFirebaseAuth();

  const fetchById = React.useCallback(() => {
    if (id) {
      getById(id).then((data) => {
        setEvent(data);
      });
    }
  }, [id]);

  React.useEffect(() => {
    fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => router.back();

  const handleJoin = React.useCallback(
    () => {
      if (!user) {
        return;
      }
      console.log("handleJoin", user.uid, event);

      const { uid, displayName, email } = user;

      const { ...rest } = event as unknown as TEvent;
      let { bookings } = rest;
      bookings = bookings ?? [];
      bookings = [...bookings, { id: uid, displayName, email }];
      update({
        ...rest,
        bookings,
      }).then(() => fetchById());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, event]
  );
  const handleLeave = () => {};

  return (
    <>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {event && (
          <Card>
            <CardHeader className="flex flex-row items-start space-x-1 space-y-0">
              <div className="flex-grow">
                <span className="flex justify-between">
                  <CardTitle>{event.title}</CardTitle>
                  {event?.isCancled && <Badge>Canceled</Badge>}
                </span>
                <CardDescription>{event.description}</CardDescription>
              </div>
              {user && event && (
                <EntityUserActions
                  user={user}
                  entity={{ ...event, type: "Event" }}
                  join={handleJoin}
                  leave={handleLeave}
                />
              )}
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
