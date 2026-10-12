import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
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
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
}
