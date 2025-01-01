import { Button } from "@/components/ui/button";
import { TRequest } from "@/lib/types";
import React from "react";

const RequestList: React.FC<{ requests?: TRequest[] }> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <div>empty</div>;
  }

  const handleAccept = () => {};
  const handleReject = () => {};

  return (
    <div className="my-4 space-y-2 border rounded-md p-2">
      {requests.map((request) => (
        <div key={request.user.id} className="flex space-x-1 items-center">
          <h6 className="inline-block flex-grow">{request.user.email}</h6>
          <div className="flex space-x-1 align-top">
            <Button onClick={handleReject} variant="destructive">
              Reject
            </Button>
            <Button onClick={handleAccept}>Accept</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default RequestList;
