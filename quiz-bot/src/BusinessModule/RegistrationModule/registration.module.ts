import { DatabaseModule } from 'src/DatabaseModule/database.module';
import { RegistrationService } from './registration.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/DatabaseModule/UserModule/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
