// pass: "tawr xonr olrn rovc"
import { MailerModule as NestMailerModule} from "@nestjs-modules/mailer"
import { MailerService } from "./mailer.service";
import { Global, Module } from "@nestjs/common";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Global()
@Module({
    imports: [
        NestMailerModule.forRoot({
            transport: {
                service: "gmail",
                auth: {
                    user: "karimjonovamukhtasar2003@gmail.com",
                    pass: "tawr xonr olrn rovc"
                }
            },
            defaults: {
                    from: "N25STUDENT<karimjonovamukhtasar2003@gmail.com>"
                },
            template:{
                    dir: join(process.cwd(), "src","template"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
        })
    ],
    providers: [MailerService],
    exports: [MailerService]
})
export class MailerModule{}