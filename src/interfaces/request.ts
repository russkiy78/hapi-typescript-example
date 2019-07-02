import * as Hapi from "@hapi/hapi";


export interface ICredentials extends Hapi.AuthCredentials {
  id: string;
}

export interface IRequestAuth extends Hapi.RequestAuth {
  credentials: ICredentials;
}

export interface IRequest extends Hapi.Request {
  auth: IRequestAuth;
}

export interface IRequestCreateTask extends Hapi.Request {
  payload: {
    name: string;
    description: string;
  };
  auth: IRequestAuth;
}

export interface IRequestUpdateUser extends Hapi.Request {
  payload: {
    email: string;
    name: string;
    password: string;
  };
  auth: IRequestAuth;
}


export interface IRequestUpdateTask extends Hapi.Request {
  payload: {
    name: string;
    description: string;
    completed: boolean;
  };
  params: {
    id: number;
  };
  auth: IRequestAuth;
}

export interface IRequestDeleteTask extends Hapi.Request {
  params: {
    id: number;
  };
  auth: IRequestAuth;
}

export interface IRequestGetTask extends Hapi.Request {
  query: {
    top: number;
    skip: number;
  };
  auth: IRequestAuth;
}


export interface ILoginRequest extends IRequest {
  payload: {
    email: string;
    password: string;
  };
}
