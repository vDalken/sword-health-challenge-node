import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from './services.enum';
import { User } from './users/entity/user.entity';
import { Task } from './tasks/entity/task.entity';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notification/notifications.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'dev'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: process.env.DATABASE_TYPE as any,
        host: String(process.env.DATABASE_HOST),
        port: Number(process.env.DATABASE_PORT),
        username: String(process.env.DATABASE_USERMAME),
        password: String(process.env.DATABASE_PASSWORD),
        database: String(process.env.DATABASE_NAME),
        synchronize: Boolean(JSON.parse(process.env.DATABASE_SYNC)),
        autoLoadEntities: true,
        entities: ['.src/*/entity/*.entity.ts'],
        logging: Boolean(JSON.parse(process.env.DATABASE_LOGGING)),
      }),

    }),
    ClientsModule.registerAsync([
      {
        name: Services.ConsumerService,
        imports: [ConfigModule],
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [String(process.env.TRANSPORT_URL)],
            queue: String(process.env.TRANSPORT_QUEUE),
          },
        }),
      },
    ]),
    UsersModule,
    TasksModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: Services.ListingLimit,
      useValue: Number(process.env.LISTING_LIMIT),
    },
  ],
  exports: [ClientsModule, Services.ListingLimit],
})

export class AppModule {}
