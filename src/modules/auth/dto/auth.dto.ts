import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

import { E_AuthType } from 'models/app'

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class ThirdPartyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authType: E_AuthType
}

export class EmailConfirmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string
}

export class LogoutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  from: E_AuthType
}
