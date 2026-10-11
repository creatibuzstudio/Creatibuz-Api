import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DesignationModule } from './designation/designation.module';
import { DepartmentModule } from './department/department.module';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { PackageModule } from './package/package.module';
import { PackageBookingModule } from './package-booking/package-booking.module';
import { BannerModule } from './banner/banner.module';
import { CasestudiesModule } from './casestudies/casestudies.module';
import { CategoryModule } from './category/category.module';
import { OrdersModule } from './orders/orders.module';
import { PackageCategoryModule } from './package-category/package-category.module';
import { BlogModule } from './blog/blog.module';
import { ReviewModule } from './review/review.module';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DesignationModule,
    DepartmentModule,
    AuthModule,
    PartnersModule,
    PackageModule,
    PackageBookingModule,
    BannerModule,
    CasestudiesModule,
    CategoryModule,
    OrdersModule,
    PackageCategoryModule,
    BlogModule,
    ReviewModule,
    ContactModule,
    StatsModule,
    UploadsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/cdn/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
