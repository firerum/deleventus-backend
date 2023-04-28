import {
    Controller,
    Body,
    Get,
    Post,
    Put,
    Delete,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Get()
    findAllUsers(): string {
        return this.userService.findAll();
    }

    @Get(':id')
    findOneUser(@Param('id') id: string): string {
        return this.userService.findOne(id);
    }

    @Post()
    createUser(): string {
        return this.userService.create();
    }

    @Put(':id')
    updateUser(@Param('id') id: string): string {
        return this.userService.update(id);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string): string {
        return this.userService.delete(id);
    }
}
