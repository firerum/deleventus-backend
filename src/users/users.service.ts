import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    // @routes /users
    // @method GET request
    // @desc retrieve all users
    findAll(): string {
        return 'all users';
    }
    // @routes /users/:id
    // @method GET request
    // @desc retrieve user with a given id
    findOne(id: string): string {
        return `single user ${id}`;
    }
    // @routes /users
    // @method POST request
    // @desc create new user
    create(): string {
        return 'user created successfully';
    }
    // @routes /users/:id
    // @method PUT request
    // @desc update user details with a given id
    update(id: string): string {
        return `user updated ${id}`;
    }
    // @routes /users/:id
    // @method DELETE request
    // @desc delete user with a given id
    delete(id: string): string {
        return `user deleted ${id}`;
    }
}
