import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEvent, TUserInfo } from "@/lib/types";
import React from "react";
import EventList from "./event-list";
import MemberList from "./member-list";
import RequestList, { RequestListProps } from "./request-list";

type EntityChildrenCardContentProps = Partial<RequestListProps> & {
  events?: TEvent[];
  members?: TUserInfo[];
};

const EntityChildrenCardContent: React.FC<EntityChildrenCardContentProps> = ({
  requests,
  onAccept,
  onReject,
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
          {members && <TabsTrigger value="members">Members</TabsTrigger>}
          {events && <TabsTrigger value="events">Events</TabsTrigger>}
        </TabsList>
        {requests && (
          <TabsContent value="requests" className="py-2">
            <RequestList
              requests={requests}
              onAccept={onAccept}
              onReject={onReject}
            />
          </TabsContent>
        )}
        {members && (
          <TabsContent value="members" className="py-2">
            <MemberList members={members} />
          </TabsContent>
        )}
        {events && (
          <TabsContent value="events" className="py-2">
            <EventList events={events} />
          </TabsContent>
        )}
      </Tabs>
    </CardContent>
  );
};

EntityChildrenCardContent.displayName = "EntityChildrenCardContent";

export default EntityChildrenCardContent;
