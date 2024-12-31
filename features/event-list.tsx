import { TEvent } from "@/lib/types";
import React from "react";

const EventList: React.FC<{ events?: TEvent[] }> = ({ events }) => {
  if (!events) {
    return <div>empty</div>;
  }
  return <div>{events.length}</div>;
};
export default EventList;
