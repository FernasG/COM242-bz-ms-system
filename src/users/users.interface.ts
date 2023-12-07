export class CreateUserDto {
  name: string;
  email: string;
  cellphone: string;
  password: string;
  register: string;
}

export class CreateSupervisiorDto {
  name: string;
  email: string;
  cellphone: string;
  password: string;
  register: string;
}

export class UpdateUserDto {
  id: string;
  email?: string;
  password?: string;
  cellphone?: string;
  password_hash?: string;
}