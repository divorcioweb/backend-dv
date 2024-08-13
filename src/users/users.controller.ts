import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConjugeDTO, UserDTO } from './users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('send')
  async send() {}

  @Post('register')
  async createUser(@Body() user: UserDTO) {
    return await this.usersService.register(user);
  }

  @Post('register/conjuge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createConjuge(@Body() conjuge: ConjugeDTO, @Req() request) {
    const token = request.headers.authorization.split(' ')[1];
    return await this.usersService.registerConjuge(token, conjuge);
  }
}
