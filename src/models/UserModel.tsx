export interface UserModel {
  UserId: string,
  FirstName: string;
  LastName: string;
  PhoneNumber: number;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  UserName: string;
  Roles: any[];
  SocietyId: string;
}

export interface AuthModel {
  Token: string;
  UserId: string;
  UserName: string;
  FullName: string;
  Roles: string[];
  SocietyId: string; //this is used when role is Society
}

export interface LoginResponse {
  isSuccess: boolean;
  user: UserModel;
}

export interface ResetPasswordModel {
  UserId: string,
  Password: string;
  ConfirmPassword: string;
  
}