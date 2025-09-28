import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // max 5 requests per 60 seconds for this route
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('/')
  createUser(@Body(ValidationPipe) user: CreateUserDto) {
    this.userService.createUser(user);
  }

  @Post('/:id')
  updateUser(
    @Param('id') id: number,
    @Body(ValidationPipe) updatedUser: UpdateUserDto,
  ) {
    this.userService.updateUser(id, updatedUser);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    this.userService.deleteUser(id);
  }
}
