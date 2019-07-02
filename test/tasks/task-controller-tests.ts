import * as chai from "chai";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const serverConfig = Configs.getServerConfigs();

describe("TastController Tests", () => {
  let server;

  before(done => {
    Server.init(serverConfig, database).then(s => {
      server = s;
      done();
    });
  });

  beforeEach(done => {
    Utils.createSeedTaskData(database, done);
  });

  afterEach(done => {
    Utils.clearDatabase(database, done);
  });
});
