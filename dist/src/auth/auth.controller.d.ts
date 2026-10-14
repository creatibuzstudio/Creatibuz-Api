import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        accessToken: string;
        user: any;
        data: any;
    }>;
    adminLogin(loginDto: LoginDto): Promise<{
        access_token: string;
        accessToken: string;
        user: any;
        data: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../users/entities/user.entity").User;
    }>;
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
}
