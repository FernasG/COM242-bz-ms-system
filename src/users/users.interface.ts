export class CreateUserDto {
  name: string;
  email: string;
  cellphone: string;
  password: string;
  register: string;
  role: string;
}

export class UpdateUserDto {
  id: string;
  email?: string;
  password?: string;
  cellphone?: string;
  password_hash?: string;
}