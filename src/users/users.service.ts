import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/connection/connection.service';
import { UserDTO } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: ConnectionService) {}

  async findAll() {
    return await this.db.users.findMany();
  }

  async register(user: UserDTO) {
    const userAlreadyRegistered = await this.db.users.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyRegistered) {
      throw new BadRequestException();
    }

    const userCreated = await this.db.users.create({
      data: {
        ...user,
        senha: bcrypt.hashSync(user.senha, 10),
      },
      select: {
        id: true,
        email: true,
        nome: true,
      },
    });

    return userCreated;
  }

  async findByEmail(email: string) {
    return await this.db.users.findFirst({
      where: {
        email: email,
      },
    });
  }
}
