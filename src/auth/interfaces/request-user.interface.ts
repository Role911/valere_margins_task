import { Users } from '../../users/entities/users.entity';

export interface RequestUser extends Request {
  user: Users;
}
