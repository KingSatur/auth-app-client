import { User } from './user.dto';

export interface LoginResponseDto {
  user: User;
  token: string;
}
