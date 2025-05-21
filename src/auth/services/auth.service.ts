import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcryptjs';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response.interface';
import { Users } from '../../users/entities/users.entity';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<any> {
    return this.usersService.create(data);
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await bycrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async loginUser(data: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(data.email, data.password);
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  getProfile(@Request() req: RequestUser) {
    return req.user;
  }
}
