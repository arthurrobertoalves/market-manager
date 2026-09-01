import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
}
