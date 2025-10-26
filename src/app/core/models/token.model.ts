export interface TokenDecoded {
  sub: string;
  jti: string;
  UserId: string;
  Username: string;
  RoleId: string;
  exp: number;
  iss: string;
  aud: string;
}
