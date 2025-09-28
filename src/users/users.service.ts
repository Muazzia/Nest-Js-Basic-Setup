import { Injectable } from '@nestjs/common';
import { User } from './types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'test@gmail.com',
      password: '123123',
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'test@gmail.com',
      password: '123123',
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'test@gmail.com',
      password: '123123',
    },
    {
      id: 4,
      name: 'John Doe',
      email: 'test@gmail.com',
      password: '123123',
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: CreateUserDto) {
    this.users.push({ id: Date.now(), ...user });
  }

  updateUser(id: number, updatedUser: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
    }
  }

  deleteUser(id: number) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
