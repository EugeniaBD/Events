import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEvent, TUserInfo } from "@/lib/types";
import React from "react";
import EventList from "./event-list";
import MemberList from "./member-list";
import RequestList, { RequestListProps } from "./request-list";
import { Badge } from "@/components/ui/badge";

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
          {requests && (
            <TabsTrigger
              value="requests"
              className="flex items-center space-x-1"
            >
              <span>Requests</span>
              {requests.length > 0 && (
                <Badge className="rounded-full">{requests.length}</Badge>
              )}
            </TabsTrigger>
          )}
          {members && (
            <TabsTrigger
              value="members"
              className="flex items-center space-x-1"
            >
              <span>Members</span>
              {members.length > 0 && (
                <Badge className="rounded-full">{members.length}</Badge>
              )}
            </TabsTrigger>
          )}
          {events && (
            <TabsTrigger value="events" className="flex items-center space-x-1">
              <span>Events</span>
              {events.length > 0 && (
                <Badge className="rounded-full">{events.length}</Badge>
              )}
            </TabsTrigger>
          )}
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
