import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/auth.guard';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { DiscountModule } from './discount/discount.module';
import { CartModule } from './cart/cart.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    UserModule,
    MailModule,
    DiscountModule,
    CartModule,
    FileModule,
    AdminModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: true,
      }),
    }),
  ],
  // controllers: [],
  providers: [
    // JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
