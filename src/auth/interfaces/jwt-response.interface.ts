import { RoleType } from "../../users/enums/role.enum";

export interface JwtResponse {
  id: number;
  email: string;
  role: RoleType;
}