### Technical Assessment

#### Tech Stack:
- Docker & docker-compose
- Node.js + TypeScript
- MySQL
- RabbitMQ

#### Notable libraries:
- NestJS: Node.js framework
- fastify: http requests handler
- typeORM: database handler
- amqlib: message queue handler
- passport: authentication
- eslint: code quality and linting
- nestjs/testing, supertest and jest: testing module

#### Project Structure:
- **migrations**: optional migrations & data sample to run
- **src/users**: module with features related with user data and authentication
- **src/tasks**: module with features related with task creation and task listing
- **src/notifications**: consumer module to process and notify all managers
- **src/*/controller**: entry point for the http requests
- **src/*/consumer**: entry point for the message queue consumer
- **src/*/dto**: request and response mapping files
- **src/*/entity**: domain entities
- **src/*/repository**: entity persistence
- **src/*/service**: domain logic and processing
- **src/main.ts**: main fail for the application boostrap
- **.module.ts**: configuration files for the module
- **tests/integration**: bulk of the tests, with in memory database and http service
- **tests/unit**: unit tests

#### Install dependencies and Run:

```docker-compose up -d```

or

```docker-compose up``` (easy way to see the application logs)

node container access: ```docker exec -it backend /bin/bash```

mysql container access: ```docker exec -it database /bin/bash```


#### Generate users & tasks sample
```docker exec -it database /bin/bash```
```mysql -u root -proot database < /var/home/data/data/demo.sql```

#### Run the migrations 
(This step is not required. 
For simplicity the application will generate the database relations automatically
But it's a good practise to have migrations.)

```docker exec -it npm run migrations:run```

#### Tests:

##### To run the tests

```docker exec -it backend npm run test:cov```

- nestjs/testing module, supertest and jest for tests (code coverage ~97%):
1) Integration: In-memory SQLLite for persistence, 
2) Unit: automock for nearly all dependencies:

#### Quality Tools:

##### Run eslint

```docker exec -it backend npm run lint```

#### Solution:

##### Node:

- [GET,POST] /task endpoints that require token authentication and role authorization 

- POST /task
```
curl --location --request POST 'http://localhost:8080/task' \
--header 'Authorization: tech1_api_key' \
--header 'Content-Type: application/json' \
--data-raw '{
    "summary": "dummy1"
}'
```

- GET /task

Optional query parameters: offset & limit
```
curl --location --request GET 'http://localhost:8080/task?offset=1&limit=5' \
--header 'Authorization: tech1_api_key' \
--header 'Content-Type: application/json'
```

ROLE_TECHNICIAN TOKENS: tech1_api_key, tech2_api_key
ROLE_MANAGER TOKENS: manager_api_key

##### RabbitMQ:
- When the technician creates a new task, it actually sends a message to a rabbit-mq queue. 
A consumer picks up the message and runs the process to notify all managers.
The system can be extended to support multiple notification systems but at the moment it only supports stdout notifications.
(see App/Message/ and (see config/packages/messenger.yaml))

  
### Future work & Limitations:

- Create a more complex role system.
- TypeORM doesn't support protected or private properties for the entities it manages. 
To avoid breaking encapsulation, a rule was added to eslint to prevent direct access to the properties.
- Add new notification systems (sms, email, etc...).









