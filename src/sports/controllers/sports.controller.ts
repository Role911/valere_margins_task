import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { RoleType } from '../../users/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorators';
import { SportsService } from '../services/sports.service';
import { Sports } from '../entities/sports.entity';
import { CreateSportDto } from '../dto/create-sport.dto';

@ApiTags('sports')
@Controller('sports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Roles(RoleType.ADMIN, RoleType.USER)
  @Get()
  @ApiOperation({
    summary: 'Retrieve all sports accessible to Admin and User roles',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all registered sports has been successfully retrieved.',
    type: [Sports],
  })
  async findAll(): Promise<Sports[]> {
    return this.sportsService.findAll();
  }

  @Roles(RoleType.ADMIN, RoleType.USER)
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve details of a specific sport by its unique ID (Admin and User access)',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the sport to retrieve',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the sport details.',
    type: Sports,
  })
  @ApiResponse({
    status: 404,
    description: 'Sport with the specified ID was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sports> {
    return this.sportsService.findOne(id);
  }

  @Roles(RoleType.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new sport (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'The sport has been successfully created.',
    type: Sports,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request validation failed or invalid data provided.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict a sport with the same name already exists.',
  })
  async create(@Body() sportData: CreateSportDto): Promise<Sports> {
    return this.sportsService.create(sportData);
  }

  @Roles(RoleType.ADMIN)
  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing sport (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the sport to update',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The sport has been successfully updated.',
    type: Sports,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request invalid data or payload.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sport not found invalid sport ID.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict another sport with the same name already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateSportDto,
  ): Promise<Sports> {
    return this.sportsService.update(id, data);
  }

  @Roles(RoleType.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a sport (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the sport to delete',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The sport has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Sport not found for the provided ID.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Cannot delete the sport because it has associated classes. Please remove those classes first.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sportsService.remove(id);
  }
}
