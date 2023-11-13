import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.interface';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('createUser')
  public async create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  public async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  public async findOne(@Payload('id') id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('updateUser')
  public async update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  public async remove(@Payload('id') id: string) {
    return this.usersService.remove(id);
  }
}
