"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllByUserId } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEvent } from "@/lib/types";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page: React.FC = () => {
  const [events, setEvents] = React.useState<TEvent[]>([]);
  const { user } = useFirebaseAuth();

  React.useEffect(() => {
    if (user) {
      getAllByUserId(user.uid).then((data) => setEvents(data));
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Events</h6>
        <Button asChild>
          <Link href="/admin/events/create">Create</Link>
        </Button>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {events.map(({ id, title, description }) => (
          <Card key={id}>
            <CardHeader className="flex flex-row items-start">
              <Link href={`/admin/events/${id}`} className="flex-grow">
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </Link>
              <div>
                <Button asChild size="icon" variant="ghost">
                  <Link href={`/admin/events/${id}/edit`}>
                    <Edit />
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
