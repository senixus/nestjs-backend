import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { SigninDto } from './dto/sing-in.dto';
import { RefreshTokenGuard } from './refresh.token.guard';

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

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.sendResetPasswordCode(body.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() data: { code: string; email: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(
      data.code,
      data.email,
      data.newPassword,
    );
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshJwt(@Body() data: { id: number; refreshToken: string }) {
    return await this.authService.refreshToken(data.id, data.refreshToken);
  }
}
