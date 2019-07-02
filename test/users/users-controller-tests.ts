import * as chai from "chai";
import { IUser } from "../../src/api/users/user";
import * as Configs from "../../src/configurations";
import * as Server from "../../src/server";
import * as Database from "../../src/database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();

describe("UserController Tests", () => {
  let server;

  before(done => {
    Server.init(serverConfig, database).then(s => {
      server = s;
      done();
    });
  });

  beforeEach(done => {
     Utils.createSeedUserData(database, done);
  });


  afterEach(done => {
    Utils.clearDatabase(database, done);
  });


  it("Create user", async () => {
    const user = {
      email: "user@mail.com",
      name: "John Robot",
      password: "123123"
    };
    const res = await server.inject({
      method: "POST",
      url: serverConfig.routePrefix + "/users",
      payload: user
    });

    const responseBody: any = JSON.parse(res.payload);
    assert.equal(201, res.statusCode);
    assert.isNotNull(responseBody.token);
  });

  it("Create user invalid data", async () => {
    const user = {
      email: "user",
      name: "John Robot",
      password: "123123"
    };

    const res = await server.inject({
      method: "POST",
      url: serverConfig.routePrefix + "/users",
      payload: user
    });

    assert.equal(400, res.statusCode);
  });

  it("Create user with same email", async () => {
    const res = await server.inject({
      method: "POST",
      url: serverConfig.routePrefix + "/users",
      payload: Utils.createUserDummy()
    });

    assert.equal(500, res.statusCode);
  });

  it("Get user Info", async () => {
    const user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    const login: any = JSON.parse(loginResponse.payload);

    const res = await server.inject({
      method: "GET",
      url: serverConfig.routePrefix + "/users/info",
      headers: { authorization: login.token }
    });

    const responseBody: IUser = <IUser>JSON.parse(res.payload);
    assert.equal(200, res.statusCode);
    assert.equal(user.email, responseBody.email);
  });

  it("Get User Info Unauthorized", async () => {
    const res = await server.inject({
      method: "GET",
      url: serverConfig.routePrefix + "/users/info",
      headers: { authorization: "dummy token" }
    });

    assert.equal(401, res.statusCode);
  });

  it("Delete user", async () => {
    const user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    const login: any = JSON.parse(loginResponse.payload);

    const res = await server.inject({
      method: "DELETE",
      url: serverConfig.routePrefix + "/users",
      headers: { authorization: login.token }
    });

    assert.equal(200, res.statusCode);
    const responseBody: IUser = <IUser>JSON.parse(res.payload);
    assert.equal(user.email, responseBody.email);

    const deletedUser = await database.userModel.findOne({ email: user.email });
    assert.isNull(deletedUser);
  });

  it("Update user info", async () => {
    const user = Utils.createUserDummy();

    const loginResponse = await Utils.login(server, serverConfig, user);
    assert.equal(200, loginResponse.statusCode);
    const login: any = JSON.parse(loginResponse.payload);
    const updateUser = { name: "New Name" };

    const res = await server.inject({
      method: "PUT",
      url: serverConfig.routePrefix + "/users",
      payload: updateUser,
      headers: { authorization: login.token }
    });

    const responseBody: IUser = <IUser>JSON.parse(res.payload);
    assert.equal(200, res.statusCode);
    assert.equal("New Name", responseBody.name);
  });
});
