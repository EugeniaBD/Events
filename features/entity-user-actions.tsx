import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRequest, TUser, TUserInfo } from "@/lib/types";
import React from "react";

type EntityUserActionsProps = {
  user: TUser;
  requests: TRequest[];
  members: TUserInfo[];
  join: () => void;
  leave: () => void;
};

const EntityUserActions: React.FC<EntityUserActionsProps> = ({
  user,
  requests,
  members,
  join,
  leave,
}) => {
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

  return (
    <div className="m-0">
      {joined && (
        <Button variant="destructive" onClick={leave}>
          Leave
        </Button>
      )}
      {requestSent && <Badge variant="default">Request Sent</Badge>}
      {!requestSent && !joined && <Button onClick={join}>Join</Button>}
    </div>
  );
};

export default EntityUserActions;
