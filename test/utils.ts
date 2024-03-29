import * as Database from "../src/database";

export function createTaskDummy(userId?: string, name?: string, description?: string) {
  let user = {
    name: name || "dummy task",
    description: description || "I'm a dummy task!"
  };

  if (userId) {
    user["userId"] = userId;
  }

  return user;
}

export function createUserDummy(email?: string) {
  return {
    email: email || "dummy@mail.com",
    name: "Dummy Jones",
    password: "123123"
  };

}

export function clearDatabase(database: Database.IDatabase, done: MochaDone) {
  const promiseUser = database.userModel.remove({});
  const promiseTask = database.taskModel.remove({});

  Promise.all([promiseUser, promiseTask])
    .then(() => {
      done();
    })
    .catch(error => {
      console.log(error);
    });
}

export function createSeedTaskData(database: Database.IDatabase, done: MochaDone) {
  return database.userModel
    .create(createUserDummy())
    .then(user => {
      return Promise.all([
        database.taskModel.create(
          createTaskDummy(user._id, "Task 1", "Some dummy data 1")
        ),
        database.taskModel.create(
          createTaskDummy(user._id, "Task 2", "Some dummy data 2")
        ),
        database.taskModel.create(
          createTaskDummy(user._id, "Task 3", "Some dummy data 3")
        )
      ]);
    })
    .then(task => {
      done();
    })
    .catch(error => {
      console.log(error);
    });
}

export function createSeedUserData(database: Database.IDatabase, done: MochaDone) {

  database.userModel
    .create(createUserDummy())
    .then(user => {
      done();
    })
    .catch(error => {
      console.log(error);
    });

}

export async function login(server, config, user) {
  if (!user) {
    user = createUserDummy();
  }

  return server.inject({
    method: "POST",
    url: config.routePrefix + "/users/login",
    payload: {email: user.email, password: user.password}
  });
}
