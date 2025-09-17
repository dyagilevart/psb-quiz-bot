import { UserDto } from '@dto/user.dto';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/DatabaseModule/UserModule/user.service';

@Injectable()
export class RegistrationService {
  constructor(private userService: UserService) {}

  async isUserAlreadyRegistered(userId: number) {
    if (await this.userService.getUser(userId)) {
      return true;
    }
    return false;
  }

  async register(user: UserDto) {
    return this.userService.setUser({ userId: user.id});
  }
}
