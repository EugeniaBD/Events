"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EntityUserActions from "@/features/entity-user-actions";
import { update as updateClub } from "@/firebase/firestore/clubsCollection";
import { update as updateGroup } from "@/firebase/firestore/groupsCollection";
import { searchInAll } from "@/firebase/firestore/operations/searchInAll";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { TEntity, TRequest } from "@/lib/types";
import Link from "next/link";
import React, { ChangeEventHandler } from "react";

const Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [entities, setEntities] = React.useState<TEntity[]>([]);
  const { user } = useFirebaseAuth();

  const fetchSearchInAll = React.useCallback(() => {
    searchInAll(searchQuery).then((d) => setEntities(d));
  }, [searchQuery]);

  React.useEffect(() => {
    fetchSearchInAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearchQueryInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleJoin = React.useCallback(
    (entity: TEntity) => {
      if (!user) {
        return;
      }
      console.log("handleJoin", user.uid, entity);

      const { uid, displayName, email } = user;
      const request: TRequest = {
        id: uid,
        user: { id: uid, displayName, email },
      };
      const requests: TRequest[] = entity.requests
        ? [...entity.requests, { ...request }]
        : [{ ...request }];

      let promise = null;

      if (entity.type.toLowerCase() === "club") {
        promise = updateClub({ ...entity, requests });
      } else if (entity.type.toLowerCase() === "group") {
        promise = updateGroup({ ...entity, requests });
      }
      if (!promise) {
        return;
      }
      promise.then(() => fetchSearchInAll());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const handleLeave = (entity: TEntity) => {
    console.log("leave", entity);
  };

  return (
    <div className="h-dvh max-h-full overflow-auto space-y-2 px-2 pt-2 pb-4">
      <div className="p-4 bg-white border rounded-xl space-y-4">
        <Input
          value={searchQuery}
          onChange={handleSearchQueryInput}
          placeholder="search groups, clubs and events"
        />
        <div className="">
          <ul className="divide-y">
            {entities.map((entity) => (
              <li key={entity.id} className="list-none p-2 flex space-x-1">
                <Link
                  href={`/${entity.type.toLowerCase()}s/${entity.id}`}
                  className="flex-grow"
                >
                  <span className="inline-flex space-x-1">
                    <h6 className="font-semibold size inline-block">
                      {entity.title}
                    </h6>
                    <Badge variant="secondary" className="rounded-full">
                      {entity.type}
                    </Badge>
                  </span>
                  <p className="text-muted-foreground">{entity.description}</p>
                </Link>
                {user && (
                  <EntityUserActions
                    requests={entity.requests || []}
                    members={entity.members || []}
                    user={user}
                    join={() => handleJoin(entity)}
                    leave={() => handleLeave(entity)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
