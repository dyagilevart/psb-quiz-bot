import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller()
export class AdminController {
  constructor(adminService: AdminService) {
    adminService.init();
  }
}
