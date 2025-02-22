import { RequestMethod } from "../enums/main.ts";

export interface ApiProps {
  requests: RequestType[];
  testMode?: boolean;
  checkAccess?: CheckAccess;
}

export type RequestType<Data = undefined> = {
  pathname: string;
  method: RequestMethod;
  kind: RequestKind | RequestKind[];
  func: (
    request: Request,
    url: URL,
    data?: Data,
  ) => Response | Promise<Response>;
};

export enum RequestKind {
  PUBLIC,
  ACCOUNT,
  ACCOUNT_REFRESH,
  LICENSE,
  CONNECTION,
  ADMIN,
  TOKEN,
  APPS,
}

export type CheckAccess = (params: {
  request: Request;
  kind: RequestKind | RequestKind[];
}) => Promise<boolean>;
