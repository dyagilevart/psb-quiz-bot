import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/DatabaseModule/UserModule/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
