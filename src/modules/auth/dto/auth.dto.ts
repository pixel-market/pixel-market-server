import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

import { E_AuthType } from 'types/app'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  first_name: string

  last_name: string

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class ThirdPartyDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  authType: E_AuthType
}

export class EmailConfirmDto {
  @IsString()
  @IsNotEmpty()
  token: string
}

export class RestoreDto {
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  from: E_AuthType
}
