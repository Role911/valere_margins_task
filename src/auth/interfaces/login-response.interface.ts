import { RoleType } from '../../users/enums/role.enum';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    surname?: string;
    role: RoleType;
  };
}
