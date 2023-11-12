import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.interface';
import { PrismaService } from '@database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  public async create(createUserDto: CreateUserDto) {
    const { name, email, cellphone, password, register } = createUserDto;

    const userAlreadyExists = await this.prismaService.user.findFirst({ where: { OR: [{ email }, { register }] } });

    if (userAlreadyExists) throw new BadRequestException('An account with these credentials already exists.');

    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const role = await this.prismaService.role.findFirst({ where: { name: 'User' } })
    const data = { name, email, cellphone, register, role_id: role.id, balance: 0, password_hash: passwordHash };

    const user = await this.prismaService.user.create({ data });

    if (!user) throw new InternalServerErrorException('Failed to create your account.');

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

    return this.prismaService.user.update({ where: { id }, data });;
  }

  public async remove(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found.');

    return this.prismaService.user.delete({ where: { id } });
  }
}
