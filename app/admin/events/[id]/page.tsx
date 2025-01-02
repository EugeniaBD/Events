"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getById, update } from "@/firebase/firestore/eventsCollection";
import { TEvent } from "@/lib/types";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = React.useState<TEvent | null>(null);

  const fetchById = React.useCallback(() => {
    if (!id) {
      return;
    }
    getById(id).then((data) => {
      setEvent(data);
    });
  }, [id]);

  React.useEffect(() => {
    fetchById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => router.back();

  const handleCancled = React.useCallback(() => {
    if (!event) {
      return;
    }
    update({ ...event, isCancled: true }).then(() => fetchById());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <>
      <div className="flex justify-between">
        <Button onClick={handleBack}>Back</Button>
        <span className="flex gap-1 items-center">
          <Button asChild size="icon" variant="ghost">
            <Link href={`/admin/events/${id}/edit`}>
              <Edit />
            </Link>
          </Button>
          {event?.isCancled || <Button onClick={handleCancled}>Cancel</Button>}
          {event?.isCancled && <Badge>Canceled</Badge>}
        </span>
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
