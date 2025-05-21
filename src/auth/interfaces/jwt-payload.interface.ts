import { RoleType } from '../../users/enums/role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  role: RoleType;
}
