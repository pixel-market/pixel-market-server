import {
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
// import { lastValueFrom } from 'rxjs'
import { Response } from 'express'
import * as argon2 from 'argon2'
// import { AxiosResponse } from 'axios'

// import {
//   SignUpDto,
//   SignInDto,
//   ThirdPartyDto,
//   EmailConfirmDto,
//   RestoreDto,
//   ChangePasswordDto,
//   LogoutDto,
// } from './dto/auth.dto'
// import { AuthRes, ThirdPartyUserData, Tokens } from './types/response.type'
// import { TokenParams } from './types/params.type'
// import { TokenData } from './types/tokens.type'

import { UsersService } from 'modules/users/users.service'
import { E_AuthType } from 'types/app'

import { SignInDto, SignUpDto } from './dto/auth.dto'
import { T_AuthResponse, T_Tokens } from './types/response.type'
import { T_TokenData } from './types/tokens.type'
// import { MailService } from 'modules/mail/mail.service'
// // import { LobbyService } from 'modules/lobby/lobby.service'
// // import { AuthTypeEnum } from 'interfaces/app'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    // private httpService: HttpService,
    private usersService: UsersService, // private mailService: MailService,
  ) {}

  async signUpLocal(
    dto: SignUpDto,
    response: Response,
  ): Promise<T_AuthResponse> {
    // Проверяем существует ли пользователь
    const userExists = await this.usersService.findOneByEmail(dto.email)
    if (userExists) throw new ForbiddenException('User already exists.')

    const hashedPassword = await argon2.hash(dto.password)

    const user = await this.usersService.create(
      dto.email,
      dto.first_name,
      dto.last_name,
      dto.phone,
      hashedPassword,
      E_AuthType.email,
    )

    const tokens = await this.generateTokens(user.id, user.email)
    this.setCookies(tokens.access_token, tokens.refresh_token, response)

    // Email верификация
    // const verifyToken = await this.generateMailToken(user.id, user.email)
    // await this.mailService.sendUserConfirmation(user, verifyToken)

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      tokens,
    }
  }
  async signInLocal(
    dto: SignInDto,
    response: Response,
  ): Promise<T_AuthResponse> {
    const user = await this.usersService.findUnique('email', dto.email)

    // Если пользователь не найден
    if (!user) throw new ForbiddenException('User not found')

    const passwordMatches = await argon2.verify(user.hash, dto.password)

    // Если пароли не совпадают
    if (!passwordMatches) throw new ForbiddenException('Wrong password')

    const tokens = await this.generateTokens(user.id, user.email)
    this.setCookies(tokens.access_token, tokens.refresh_token, response)

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      tokens,
    }
  }

  //   async logout(userId: number, response: Response, dto: LogoutDto) {
  //     if (dto.from === AuthTypeEnum.guest) {
  //       this.usersService.removeById(userId)
  //     }
  //     response.clearCookie('access_token')
  //     response.clearCookie('refresh_token')
  //   }

  async refreshTokens(refresh_token: string, res: Response) {
    try {
      // RT не найден в куки
      if (!refresh_token) {
        throw new UnauthorizedException('Unauthorized!')
      }
      const tokenData: T_TokenData = this.jwtService.verify(refresh_token, {
        secret: this.config.get('JWT_SECRET_RT'),
      })
      if (!tokenData) {
        throw new UnauthorizedException('Unauthorized!')
      }
      const user = await this.usersService.findUnique('id', tokenData.sub)
      const tokens = await this.generateTokens(user.id, user.email)
      this.setCookies(tokens.access_token, tokens.refresh_token, res)
      return tokens
    } catch {
      throw new NotFoundException('Refresh token expired')
    }
  }
  //   async emailConfirmation(dto: EmailConfirmDto) {
  //     const tokenData: TokenData = this.jwtService.verify(dto.token, {
  //       secret: this.config.get('JWT_SECRET_MAIL'),
  //     })
  //     const user = await this.usersService.verifyEmail(tokenData.email)
  //     if (!user) throw new NotFoundException('User does not exist')
  //     if (!user.verified) throw new NotFoundException('Failed to verify email')
  //   }

  setCookies(at: string, rt: string, response: Response) {
    response.cookie('access_token', at, {
      httpOnly: false,
      maxAge: 60_000 * 15, // 15 минут
    })
    response.cookie('refresh_token', rt, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // неделя
    })
  }

  async generateTokens(userId: number, email: string): Promise<T_Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_SECRET_AT'),
          expiresIn: 15 * 60, // 15 минут
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get('JWT_SECRET_RT'),
          expiresIn: 60 * 60 * 24 * 7, // неделя
        },
      ),
    ])
    return {
      access_token: at,
      refresh_token: rt,
    }
  }
}
