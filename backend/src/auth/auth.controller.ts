import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const identifier = signInDto.email || signInDto.nic || signInDto.identifier;
    const user = await this.authService.validateUser(
      identifier,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register/resident')
  async registerResident(@Body() registerDto: Record<string, any>) {
    return this.authService.registerResident(registerDto);
  }
}
