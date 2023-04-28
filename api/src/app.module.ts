import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebtsModule } from './debts/debts.module';
import { PaymentsModule } from './payments/payments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    DebtsModule,
    PaymentsModule,
    EmailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: 'sandbox.smtp.mailtrap.io',
          auth: {
            user: 'f978ef6b6c3123',
            pass: '3b620b5e137bbf',
          },
        },
        defaults: {
          from: '<sendgrid_from_email_address>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'kanastra-db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    QrcodeModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
