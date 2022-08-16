import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { SignUpDto, SignInDto } from './dto/auth.dto'
import { T_AuthResponse } from './types/response.type'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация через почту
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SignUpDto })
  signUpLocal(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<T_AuthResponse> {
    return this.authService.signUpLocal(dto, response)
  }

  // Аутентификация через почту
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDto })
  signInLocal(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<T_AuthResponse> {
    return this.authService.signInLocal(dto, response)
  }

  // Сторонняя авторизация
  // @Post('token')
  // @HttpCode(HttpStatus.OK)
  // async tokenAuth(
  //   @Body() dto: ThirdPartyDto,
  //   @Res({ passthrough: true }) response: Response,
  // ): Promise<AuthRes> {
  //   try {
  //     // Получаем токен пользователя с помощью кода
  //     const responseToken = await this.authService.getTokenFromThirdParty(dto)

  //     // Получаем юзера
  //     const responseUser = await this.authService.getDataFromThirdParty(
  //       dto.authType,
  //       responseToken.data.access_token,
  //     )

  //     const userData: ThirdPartyUserData = responseUser.data

  //     // Регистрируем или аутентифицируем юзера
  //     return this.authService.authByThirdParty(dto.authType, userData, response)
  //   } catch (error) {
  //     throw new ForbiddenException('Unauthorized!')
  //   }
  // }

  // @Get('guest')
  // @HttpCode(HttpStatus.OK)
  // guestAuth(@Res({ passthrough: true }) response: Response): Promise<AuthRes> {
  //   return this.authService.guestAuth(response)
  // }

  // @UseGuards(AtGuard)
  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // logout(
  //   @Body() dto: LogoutDto,
  //   @GetCurrentUserId() userId: number,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.logout(userId, response, dto)
  // }

  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetReqRT() rt: string,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   return this.authService.refreshTokens(rt, response)
  // }

  // @Post('confirm')
  // @HttpCode(HttpStatus.OK)
  // emailConfirmation(@Body() dto: EmailConfirmDto) {
  //   return this.authService.emailConfirmation(dto)
  // }
}
