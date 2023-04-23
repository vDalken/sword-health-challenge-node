import { DataSource } from 'typeorm';
import { User } from "./src/users/entity/user.entity";
import { Task } from "./src/tasks/entity/task.entity";

/**
 * Migrations
 */
export const DatabaseSource = new DataSource({
    type: 'mysql',
    host: 'database',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'database',
    synchronize: false,
    entities: [User, Task],
    migrations: ['./migrations/*.js'],
    migrationsTableName: 'migrations_table',
});