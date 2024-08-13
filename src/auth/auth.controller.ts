import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: AuthDTO) {
    return await this.authService.auth(user);
  }
}
