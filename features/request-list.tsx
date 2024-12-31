import { TRequest } from "@/lib/types";
import React from "react";

const RequestList: React.FC<{ requests?: TRequest[] }> = ({ requests }) => {
  if (!requests) {
    return <div>empty</div>;
  }
  return <div>{requests.length}</div>;
};
export default RequestList;
