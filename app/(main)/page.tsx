"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { searchInAll } from "@/firebase/firestore/operations/searchInAll";
import { TEntity } from "@/lib/types";
import Link from "next/link";
import React, { ChangeEventHandler } from "react";

const Page: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [entities, setEntities] = React.useState<TEntity[]>([]);

  React.useEffect(() => {
    searchInAll(searchQuery).then((d) => setEntities(d));
  }, [searchQuery]);

  const handleSearchQueryInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-dvh max-h-dvh overflow-auto p-4 space-y-2">
      <div className="p-4 bg-white border space-y-4">
        <Input
          value={searchQuery}
          onChange={handleSearchQueryInput}
          placeholder="search groups, clubs and events"
        />
        <div>
          <ul className="divide-y ">
            {entities.map(({ id, title, description, type }) => (
              <li key={id} className="list-none p-2">
                <Link href={`/${type.toLowerCase()}s/${id}`}>
                  <span className="flex gap-x-1">
                    <h6 className="font-semibold size inline-block">{title}</h6>
                    <Badge variant="secondary">{type}</Badge>
                  </span>
                  <p className="text-muted-foreground">{description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
