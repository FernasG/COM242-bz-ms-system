import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@database';
import { CreateUserDto, UpdateUserDto } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('NOTIFICATIONS_SERVICE') private readonly clientRMQ: ClientRMQ
  ) { }

  public async create(createUserDto: CreateUserDto) {
    const { name, email, cellphone, password, register, role } = createUserDto;

    const userAlreadyExists = await this.prismaService.user.findFirst({ where: { OR: [{ email }, { register }] } });

    if (userAlreadyExists) throw new BadRequestException('An account with these credentials already exists.');

    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const { id } = await this.prismaService.role.findFirst({ where: { name: role } })
    const data = { name, email, cellphone, register, role_id: id, balance: 0, password_hash: passwordHash };

    const user = await this.prismaService.user.create({ data });

    if (!user) throw new InternalServerErrorException('Failed to create your account.');

    this.clientRMQ.emit('notify', { destination: email });

    return user;
  }

  public async findAll() {
    return this.prismaService.user.findMany({ where: { deleted_at: null } });
  }

  public async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, cellphone, password } = updateUserDto;

    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found.');

    const data: Partial<UpdateUserDto> = {};

    if (email) data.email = email;
    if (cellphone) data.cellphone = cellphone;
    if (password) data.password_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    return this.prismaService.user.update({ where: { id }, data });
  }

  public async remove(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found.');

    return this.prismaService.user.delete({ where: { id } });
  }
}
