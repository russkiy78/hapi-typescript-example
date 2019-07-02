import * as Hapi from  "@hapi/hapi";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export function init(
  server: Hapi.Server,
  configs: IServerConfigurations,
  database: IDatabase
) {}
