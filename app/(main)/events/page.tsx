"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByMemberId } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEvent } from "@/lib/types";
import React from "react";

const Page: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [events, setEvents] = React.useState<TEvent[]>([]);

  const fetchEvents = React.useCallback(() => {
    if (user) {
      getAllByMemberId(user.uid).then(({ result }) => {
        if (result) setEvents(result);
      });
    }
  }, [user]);

  React.useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="">
        <h6 className="font-semibold text-lg">Booked Events</h6>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {events.map(({ id, title, description, datetime }) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <CardDescription>{datetime}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
