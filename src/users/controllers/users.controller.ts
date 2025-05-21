import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { RoleType } from '../enums/role.enum';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { Roles } from '../../auth/decorators/roles.decorators';
import { Users } from '../entities/users.entity';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: Users,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data provided.',
  })
  @ApiResponse({
    status: 409,
    description: 'A user with the same email already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users.',
    type: [Users],
  })
  async findAll(): Promise<Users[]> {
    return this.usersService.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified id.',
    type: Users
  })
  @ApiResponse({
    status: 404,
    description: 'User with the specified id was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to update',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: Users,
  })
  @ApiResponse({
    status: 404,
    description: 'User with the specified id was not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Another user with the same email already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'User with id was not found.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete the user because they have associated class registrations. The registrations must be deleted first.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete your own account.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestUser,
  ): Promise<void> {
    return this.usersService.remove(id, req.user.id);
  }
}
