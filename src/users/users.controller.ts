import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ForgotPasswordStepOneDTO, ForgotPasswordStepTwoDTO, UpdateDTO, UserDTO } from './users.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() user: UserDTO) {
    return await this.usersService.register(user);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async updateUserOne(@Body() body: UpdateDTO, @Req() request) {
    const token = request.headers.authorization.split(' ')[1];
    return await this.usersService.updateOne(token, body);
  }

  @Get('clientes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async findAll() {
    return await this.usersService.findAllFilter();
  }

  @Get('clientes/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async findAllMoreInfo(@Param('id') id: string) {
    return await this.usersService.findAllFilterMoreInfo(id);
  }

  @Post('forgot-password/code')
  async sendCode(@Body() body: ForgotPasswordStepOneDTO) {
    return await this.usersService.sendEmailCode(body.email);
  }

  @Patch('forgot-password')
  async fotgotPassowrd(@Body() body: ForgotPasswordStepTwoDTO) {
    return await this.usersService.forgotPassword(body);
  }

  // @Post('register/conjuge')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  // async createConjuge(@Body() conjuge: ConjugeDTO, @Req() request) {
  //   const token = request.headers.authorization.split(' ')[1];
  //   return await this.usersService.registerConjuge(token, conjuge);
  // }
}
