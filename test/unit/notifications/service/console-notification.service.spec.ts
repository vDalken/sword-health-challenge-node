import { Test } from "@nestjs/testing";
import { AppModule } from "../../../../src/app.module";
import { ConsoleNotificationService } from "../../../../src/notification/service/console-notification.service";
import { CreateTaskNotification } from "../../../../src/notification/dto/request/create-task.notification";

describe('ConsoleNotificationService', () => {

    let sut : ConsoleNotificationService;

    beforeEach(async () => {
        let moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

      sut = moduleRef.get(ConsoleNotificationService);
    });

    it('processNotification', async function () {
        const notification = new CreateTaskNotification(
            'foo',
            'user1',
            new Date()
        )

        await expect(sut.processNotification(notification)).resolves.not.toThrowError();
    });
});