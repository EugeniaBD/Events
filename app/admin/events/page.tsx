"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAll } from "@/firebase/firestore/eventsCollection";
import { TEvent } from "@/lib/types";
import Link from "next/link";
import React from "react";

const Page: React.FC = () => {
  const [events, setEvents] = React.useState<TEvent[]>([]);

  React.useEffect(() => {
    getAll().then((data) => setEvents(data));
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h6 className="text-lg font-bold">Events</h6>
        <Button asChild>
          <Link href="/admin/events/create">Create</Link>
        </Button>
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {events.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <Link href={`/admin/clubs/${club.id}`}>
                <CardTitle className="text-2xl">{club.title}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;