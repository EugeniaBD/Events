"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getById } from "@/firebase/firestore/eventsCollection";
import { TEvent } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = React.useState<TEvent | null>(null);

  React.useEffect(() => {
    getById(id).then((data) => {
      setEvent(data);
    });
  }, [id]);

  const handleBack = () => router.back();

  return (
    <>
      <div className="flex">
        <Button onClick={handleBack}>Back</Button>
      </div>
      <div className="py-4">
        {event && (
          <Card>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            {/* <EntityChildrenCardContent
              events={event.events}
              requests={event.requests}
              members={event.members}
            /> */}
          </Card>
        )}
      </div>
    </>
  );
};

export default Page;
