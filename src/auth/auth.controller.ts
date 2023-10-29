import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { SigninDto } from './dto/sing-in.dto';

@Controller('auth')
export class AuthController {
  @Inject() private readonly authService: AuthService;

  @Public()
  @Post('sign-in')
  async signin(@Body() body: SigninDto) {
    return await this.authService.signin(body);
  }

  @Public()
  @Post('sign-up')
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }
}
