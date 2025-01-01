import { User } from "firebase/auth";

export type TUser = User & {
  role: string;
};

export type TUserRole = {
  id: string;
  userId: string;
  role: string;
};

export type TMenuItem = {
  id: string;
  title: string;
  url: string;
};

export type TMenuItems = TMenuItem[];

export type TUserInfo = {
  id: string;
  email: string | null;
  displayName: string | null;
};

export type TEvent = {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: string;
  places: number;
  datetime: Date;
  parentId?: string;
};

export type TRequest = {
  id: string;
  user: TUserInfo;
};

export type TEntityRequest = {
  id?: string;
  title: string;
  user: TUserInfo;
};

export type TAdminRequestGroupItem = {
  type: string;
  entities: TEntity[];
};

export type TEntity = {
  id: string;
  title: string;
  description: string;
  type: string;
  userId?: string;
  events?: TEvent[];
  members?: TUserInfo[];
  requests?: TRequest[];
};

export type TClub = Omit<TEntity, "type">;
export type TGroup = Omit<TEntity, "type">;
