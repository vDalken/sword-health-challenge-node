import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { Task } from 'src/tasks/entity/task.entity'
import { TaskRepositoryORM } from 'src/tasks/repository/task.repository.orm'
import { Role } from 'src/users/entity/role.enum'
import { User } from 'src/users/entity/user.entity'
import { UserRepositoryORM } from 'src/users/repository/user.repository.orm'
import * as request from 'supertest'

describe('TaskController (e2e) [PUT] /task', () => {
  let app: INestApplication
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        validateCustomDecorators: true
      })
    )

    await app.init()
  })

  it('Should fail - no authentication', async function () {
    await request(app.getHttpServer()).put('/task').expect(401)
  })

  it('Should fail - no authorization', async function () {
    const user = new User('foo', [], 'bar', 'apiKey', Promise.resolve([]))
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await request(app.getHttpServer())
      .put('/task')
      .set({ Authorization: 'apiKey' })
      .expect(403)
  })

  it('Should fail - no authorization', async function () {
    const user = new User(
      'foo',
      [Role.Manager],
      'bar',
      'apiKey',
      Promise.resolve([])
    )
    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await request(app.getHttpServer())
      .put('/task')
      .set({ Authorization: 'apiKey' })
      .expect(403)
  })

  it('Should fail - bad request - missing field {id}', async function () {
    const user = new User(
      'foo',
      [Role.Technician],
      'bar',
      'apiKey',
      Promise.resolve([])
    )

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await request(app.getHttpServer())
      .put('/task')
      .send({ summary: 'The little dog' })
      .set({ Authorization: 'apiKey' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toStrictEqual([
          'id should not be empty',
          'id must be a number'
        ])
      })
  })

  it('Should fail - bad request - missing field {summary}', async function () {
    const user = new User(
      'foo',
      [Role.Technician],
      'bar',
      'apiKey',
      Promise.resolve([])
    )

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await request(app.getHttpServer())
      .put('/task')
      .send({ id: 1 })
      .set({ Authorization: 'apiKey' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toStrictEqual([
          'summary must be longer than or equal to 1 characters',
          'summary should not be empty',
          'summary must be a string'
        ])
      })
  })

  it('Should fail - bad request - missing fields {summary} and {id}', async function () {
    const user = new User(
      'foo',
      [Role.Technician],
      'bar',
      'apiKey',
      Promise.resolve([])
    )

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await request(app.getHttpServer())
      .put('/task')
      .send({})
      .set({ Authorization: 'apiKey' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toStrictEqual([
          'summary must be longer than or equal to 1 characters',
          'summary should not be empty',
          'summary must be a string',
          'id should not be empty',
          'id must be a number'
        ])
      })
  })

  it('Success - updated a task', async function () {
    const user = new User(
      'foo',
      [Role.Technician],
      'bar',
      'apiKey',
      Promise.resolve([])
    )

    await moduleRef.get<UserRepositoryORM>(UserRepositoryORM).persist(user)

    await moduleRef.get<TaskRepositoryORM>(TaskRepositoryORM).persist(new Task('brilliant', user))

    await request(app.getHttpServer())
      .put('/task')
      .send({ id: 1, summary: 'maravilhoso' })
      .set({ Authorization: 'apiKey' })
      .expect(200)
      .then(response =>{
        expect(response.body.id).toBe(1)
        expect(response.body.summary).toBe('maravilhoso');
        expect(response.body.userId).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
      })
  })
})
