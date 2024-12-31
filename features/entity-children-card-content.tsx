import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import RequestList from "./request-list";
import EventList from "./event-list";
import MemberList from "./member-list";
import { TEvent, TRequest, TUserInfo } from "@/lib/types";

type EntityChildrenCardContentProps = {
  requests?: TRequest[];
  events?: TEvent[];
  members?: TUserInfo[];
};

const EntityChildrenCardContent: React.FC<EntityChildrenCardContentProps> = ({
  requests,
  events,
  members,
}) => {
  const defaultValue = React.useMemo(() => {
    if (requests) {
      return "requests";
    }
    if (events) {
      return "events";
    }
    return "members";
  }, [requests, events]);

  return (
    <CardContent>
      <Tabs defaultValue={defaultValue}>
        <TabsList className="flex justify-stretch w-full">
          {requests && <TabsTrigger value="requests">Requests</TabsTrigger>}
          {events && <TabsTrigger value="events">Events</TabsTrigger>}
          {members && <TabsTrigger value="members">Members</TabsTrigger>}
        </TabsList>
        {requests && (
          <TabsContent value="requests" className="py-2">
            <RequestList requests={requests} />
          </TabsContent>
        )}
        {events && (
          <TabsContent value="events" className="py-2">
            <EventList events={events} />
          </TabsContent>
        )}
        {members && (
          <TabsContent value="members" className="py-2">
            <MemberList members={members} />
          </TabsContent>
        )}
      </Tabs>
    </CardContent>
  );
};

EntityChildrenCardContent.displayName = "EntityChildrenCardContent";

export default EntityChildrenCardContent;
