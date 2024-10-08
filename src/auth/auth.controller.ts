import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: AuthDTO) {
    return await this.authService.auth(user);
  }
}
