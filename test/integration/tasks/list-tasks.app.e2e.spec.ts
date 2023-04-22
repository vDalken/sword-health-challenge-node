import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {User} from "../../../src/users/entity/user.entity";
import {
  UserRepositoryORM
} from "../../../src/users/repository/user.repository.orm";
import {Role} from "../../../src/users/entity/role.enum";
import {Task} from "../../../src/tasks/entity/task.entity";
import {
  TaskRepositoryORM
} from "../../../src/tasks/repository/task.repository.orm";
import {AppModule} from "../../../src/app.module";

describe('TaskController (e2e) [GET] /task', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      validateCustomDecorators: true,
    }));

    await app.init();
  });

  it('Should fail - no authentication', async function () {
    await request(app.getHttpServer())
        .get('/task')
        .expect(401);

  });

  it('Should fail - no authorization', async function () {
    const user = new User(
        'foo',[],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task')
        .set({Authorization: 'apiKey'})
        .expect(403);
  });

  it('Should fail - invalid limit input (string)', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task?limit=xxxx')
        .set({Authorization: 'apiKey'})
        .expect(400)
  });

  it('Should fail - invalid limit input (-1)', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task?limit=-1')
        .set({Authorization: 'apiKey'})
        .expect(400)
  });

  it('Should fail - invalid offset input (string)', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task?offset=xxxx')
        .set({Authorization: 'apiKey'})
        .expect(400)
  });

  it('Should fail - invalid offset input (-1)', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task?offset=-1')
        .set({Authorization: 'apiKey'})
        .expect(400)
  });

  it('Success - no results', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);

    await request(app.getHttpServer())
        .get('/task')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .expect([])
  });

  it('Success - display two results', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const task1 = new Task('task1', user);
    const task2 = new Task('task2', user);
    const task3 = new Task('task3', user);
    const task4 = new Task('task4', user);

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task3);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task4);

    await request(app.getHttpServer())
        .get('/task')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(2);
        })
  });

  it('Success - display one result', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const task1 = new Task('task1', user);
    const task2 = new Task('task2', user);
    const task3 = new Task('task3', user);
    const task4 = new Task('task4', user);

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task3);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task4);

    await request(app.getHttpServer())
        .get('/task?limit=1')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
        })
  });

  it('Success - display without exceeding limit', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const task1 = new Task('task1', user);
    const task2 = new Task('task2', user);
    const task3 = new Task('task3', user);
    const task4 = new Task('task4', user);

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task3);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task4);

    await request(app.getHttpServer())
        .get('/task?limit=5')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(2);
        })
  });

  it('Success - display second task only', async function () {
    const user = new User(
        'foo',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const task1 = new Task('task1', user);
    const task2 = new Task('task2', user);
    const task3 = new Task('task3', user);
    const task4 = new Task('task4', user);

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task3);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task4);

    await request(app.getHttpServer())
        .get('/task?limit=1&offset=1')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].id).toBe(2);
        })
  });

  it('Success - display only its own tasks', async function () {
    const tech1 = new User(
        'tech1',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const tech2 = new User(
        'tech2',[Role.Technician],'bar', 'apiKey2', Promise.resolve([])
    );

    const task1 = new Task('task1', tech1);
    const task2 = new Task('task2', tech2);
    const task3 = new Task('task3', tech2);
    const task4 = new Task('task4', tech2);

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(tech1);
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(tech2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task3);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task4);

    await request(app.getHttpServer())
        .get('/task')
        .set({Authorization: 'apiKey'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(1);
        })
  });

  it('Success - manager should be able to see all tasks', async function () {
    const tech1 = new User(
        'tech1',[Role.Technician],'bar', 'apiKey', Promise.resolve([])
    );

    const tech2 = new User(
        'tech2',[Role.Technician],'bar', 'apiKey2', Promise.resolve([])
    );

    const manager1 = new User(
        'manager',[Role.Manager],'bar', 'apiKey3', Promise.resolve([])
    );

    const task1 = new Task('task1', tech1);
    const task2 = new Task('task2', tech2);


    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(tech1);
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(tech2);
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(manager1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task1);
    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(task2);

    await request(app.getHttpServer())
        .get('/task')
        .set({Authorization: 'apiKey3'})
        .expect(200)
        .then((response) => {
          expect(response.body.length).toBe(2);
        })
  });

});