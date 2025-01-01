import { Button } from "@/components/ui/button";
import { TRequest } from "@/lib/types";
import React from "react";

export type RequestListProps = Partial<{
  requests: TRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}>;

const RequestList: React.FC<RequestListProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  if (!requests || requests.length === 0) {
    return <div>empty</div>;
  }

  const handleAccept = (requestId: string) => {
    if (onAccept) onAccept(requestId);
  };
  const handleReject = (requestId: string) => {
    if (onReject) onReject(requestId);
  };

  return (
    <div className="my-4 space-y-2 border rounded-md p-2">
      {requests?.map(({ id, user }) => (
        <div key={user.id} className="flex space-x-1 items-center">
          <h6 className="inline-block flex-grow">{user.email}</h6>
          <div className="flex space-x-1 align-top">
            <Button onClick={() => handleReject(id)} variant="destructive">
              Reject
            </Button>
            <Button onClick={() => handleAccept(id)}>Accept</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default RequestList;
