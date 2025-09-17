/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/DatabaseModule/database.module';
import { UserModule } from './UserModule/user.module';
import { AdminModule } from './AdminModule/admin.module';
import { RegistrationModule } from './RegistrationModule/registration.module';

@Module({
    imports: [DatabaseModule, UserModule, AdminModule, RegistrationModule],
    controllers: [],
    providers: [],
    exports: [RegistrationModule, AdminModule]
})
export class BusinessModule { }
