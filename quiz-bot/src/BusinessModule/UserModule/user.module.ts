import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModule as DatabaseUserModule } from 'src/DatabaseModule/UserModule/user.module';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseUserModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
