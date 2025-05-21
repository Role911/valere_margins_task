import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ParseIntPipe,
  Put,
  ConsoleLogger,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { RoleType } from '../../users/enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { ClassesService } from '../services/classes.service';
import { Roles } from '../../auth/decorators/roles.decorators';
import { Classes } from '../entities/classes.entity';
import { QueryDto } from '../../shared/dtos/query.dto';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { CreateClassDto } from '../dto/classes.dto';
import { Applications } from '../../applications/entities/application.entity';

@ApiTags('classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiOperation({
    summary: 'Retrieve all sports classes (Admin and User access)',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of sports classes successfully retrieved along with total count.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Classes' },
        },
        total: { type: 'integer' },
      },
    },
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to return (default: 30).',
    example: 30,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip (default: 0).',
    example: 0,
  })
  @ApiQuery({
    name: 'sports',
    required: false,
    description: 'Filter classes by one or more sport names (comma-separated).',
    example: 'Soccer,Basketball',
  })
  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<{ data: Classes[]; total: number }> {
    console.log(query)
    return this.classesService.findAll(query);
  }

  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiOperation({
    summary: 'Get a sports class by ID (Admin and User access)',
  })
  @ApiResponse({
    status: 200,
    description: 'Sports class details retrieved successfully.',
    type: Classes,
  })
  @ApiResponse({
    status: 404,
    description: 'Sports class not found for the given ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to retrieve',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Classes> {
    return this.classesService.findOne(id);
  }

  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiOperation({
    summary: 'Register the authenticated user for a sports class',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully for the class.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or registration criteria not met.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed or missing.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sports class not found for registration.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to register for',
  })
  @Post(':id/register')
  async register(
    @Param('id', ParseIntPipe) classId: number,
    @Request() req: RequestUser,
  ): Promise<any> {
    return this.classesService.register(classId, req.user.id);
  }

  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new sports class (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Sports class created successfully.',
    type: Classes,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or required data missing.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin privileges required.',
  })
  @Post()
  async create(@Body() classData: CreateClassDto): Promise<Classes> {
    return this.classesService.create(classData);
  }

  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update an existing sports class (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Sports class updated successfully.',
    type: Classes,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid update data or payload.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - login required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin role required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sports class not found for updating.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to update',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() classData: CreateClassDto,
  ): Promise<Classes> {
    return this.classesService.update(id, classData);
  }

  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all applications for a specific sports class (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of applications for the class retrieved successfully.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(Applications) },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only.' })
  @ApiResponse({ status: 404, description: 'Sports class not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to fetch applications for',
  })
  @Get(':id/registrations')
  async getClassRegistrations(
    @Param('id', ParseIntPipe) classId: number,
  ): Promise<Applications[]> {
    return this.classesService.getClassApplications(classId);
  }

  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiOperation({ summary: 'Unregister from a sports class (Admin and User)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unregistered from the class.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid class ID or registration does not exist.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Registration not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to unregister from',
  })
  @Delete(':id/unregister')
  async unregister(
    @Param('id', ParseIntPipe) classId: number,
    @Request() req: RequestUser,
  ): Promise<void> {
    return this.classesService.unregister(classId, req.user.id);
  }

  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete a sports class (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Sports class deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sports class not found.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Deletion failed due to existing registrations. Remove all registrations first.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the sports class to delete',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.classesService.removeClass(id);
  }
}
