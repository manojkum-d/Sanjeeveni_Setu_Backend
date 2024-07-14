export interface UserOTP {
  userId: String;
  otp: String;
  createdAt: Date;
  expiresAt: Date;
  isAdmin: Boolean;
}
