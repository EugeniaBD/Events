import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEntity, TEvent, TUser } from "@/lib/types";
import React from "react";

type EntityUserActionsProps = {
  entity: TEntity;
  user: TUser;
  join: () => void;
  leave: () => void;
};

const EntityUserActions: React.FC<EntityUserActionsProps> = ({
  user,
  entity,
  join,
  leave,
}) => {
  const { type, requests, members } = entity;

  const requestSent = React.useMemo(() => {
    if (!user) {
      return false;
    }
    if (!requests) {
      return false;
    }
    return !!requests.find((r) => r.user.id === user?.uid);
  }, [user, requests]);

  const joined = React.useMemo(() => {
    if (!user) {
      return false;
    }
    if (!members) {
      return false;
    }
    return !!members.find((r) => r.id === user?.uid);
  }, [user, members]);

  if (type.toLocaleLowerCase() === "event") {
    const { bookings, isCancled } = entity as unknown as TEvent;
    const booked = !!bookings?.find((r) => r.id === user?.uid);

    return (
      <div className="m-0">
        {isCancled && <Badge>Canceled</Badge>}
        {isCancled && (
          <>
            {booked && (
              <Badge variant="outline" onClick={leave}>
                Booked
              </Badge>
            )}
            {!booked && (
              <Button size="sm" onClick={join}>
                Book
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="m-0">
      {requestSent && <Badge variant="secondary">Request Sent</Badge>}
      {joined && (
        <Badge variant="outline" onClick={leave}>
          Joined
        </Badge>
      )}
      {!requestSent && !joined && (
        <Button size="sm" onClick={join}>
          Join
        </Button>
      )}
    </div>
  );
};

export default EntityUserActions;
