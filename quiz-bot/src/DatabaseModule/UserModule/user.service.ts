/*
https://docs.nestjs.com/providers#services
*/

import { CreateUserDto } from '@dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(userId: number) {
    return this.userModel.findOne({ userId: userId }).exec();
  }

  async getActiveUsers() {
    return this.userModel
      .find({ isAdmin: false, chatId: { $exists: true, $ne: null } })
      .exec();
  }

  async setUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }
}
