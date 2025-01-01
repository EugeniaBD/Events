import { TUserInfo } from "@/lib/types";
import React from "react";

const MemberList: React.FC<{ members?: TUserInfo[] }> = ({ members }) => {
  if (!members) {
    return <div>empty</div>;
  }
  return (
    <div>
      {members.map((m) => (
        <h6 className="font-semibold" key={m.id}>
          {m.email}
        </h6>
      ))}
    </div>
  );
};

export default MemberList;
