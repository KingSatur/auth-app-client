import { User } from './user.dto';

export interface CheckTokenResponseDto {
  user: User;
  token: string;
}
