export type T_Tokens = {
  access_token: string
  refresh_token: string
}

export type T_AuthResponse = {
  id: number
  first_name: string
  last_name: string
  phone: string
  email: string
  tokens: T_Tokens
}

export type ThirdPartyUserData = {
  id: string
  email: string
}

// Ответ от discord.com/api/v6/users/@me
// type DiscordUserResData = {
//   id: string;
//   username: string;
//   avatar: string;
//   discriminator: string;
//   public_flags: number;
//   flags: number;
//   banner: string;
//   banner_color: string;
//   accent_color: string;
//   locale: string;
//   mfa_enabled: boolean;
//   email: string;
//   verified: boolean;
// };

// Ответ от googleapis.com/oauth2/v2/userinfo
// type GoogleUserResData = {
//   id: string;
//   email: string;
//   verified_email: boolean;
//   picture: string;
// };
