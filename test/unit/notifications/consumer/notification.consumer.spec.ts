import { Test } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { ConsoleNotificationService } from "../../../../src/notification/service/console-notification.service";
import { CreateTaskNotification } from "../../../../src/notification/dto/request/create-task.notification";
import { NotificationConsumer } from "../../../../src/notification/consumer/notification.consumer";
import {
    CreateTaskNotificationInterface
} from "../../../../src/notification/dto/request/create-task.notification.interface";

describe('NotificationConsumer', () => {

    let sut : NotificationConsumer;

    beforeEach(async () => {
        let moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

      sut = moduleRef.get(NotificationConsumer);
    });

    it('handle', async function () {
        const notification = new CreateTaskNotification(
            'foo',
            'user1',
            new Date()
        );

        const record :Record<string, CreateTaskNotificationInterface> = {
            'foo': notification,
        };

        await expect(sut.handle(record)).resolves.not.toThrowError();
    });
});