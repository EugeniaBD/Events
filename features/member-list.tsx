import { TUserInfo } from "@/lib/types";
import React from "react";

const MemberList: React.FC<{ members?: TUserInfo[] }> = ({ members }) => {
  if (!members) {
    return <div>empty</div>;
  }
  return <div>{members.length}</div>;
};

export default MemberList;
