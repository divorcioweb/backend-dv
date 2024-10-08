import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const comparePasswordHashed = bcrypt.compareSync(pass, user.senha);

    if (user && comparePasswordHashed) {
      const { senha, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }

  async auth({ email, senha }: { email: string; senha: string }) {
    const user = await this.validateUser(email, senha);
    return {
      token: this.jwtService.sign(
        { id: user.id },
        {
          secret: process.env.KEY_SECRET_JWT as string,
          expiresIn: '24h',
        },
      ),
      ...user,
    };
  }
}
