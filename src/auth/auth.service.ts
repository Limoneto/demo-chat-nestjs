
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { NotFoundError } from 'rxjs';
import { LogoutDTO } from './dto/logout.dto';

@Injectable()
export class AuthService {
    private jwtService: JwtService;
    private readonly logger = new Logger(AuthService.name);

    constructor(private usersService: UsersService) {}

    async signIn(login:LoginDTO): Promise<any> {
        const { nick, password } = login;
        const user = await this.usersService.findOne(nick);
        if (!user) {
            this.logger.log('signIn - User not exists \n'+ Date.now()+'\n'+nick);
            throw new NotFoundError('User not exists');
        }
        if (user.password !== password) {
            throw new UnauthorizedException();
            this.logger.log('signIn - password incorrect \n'+ Date.now()+'\n'+nick);
        }
        const obj ={ nick:user.nick, id:user._id}
        const payload = {user:obj};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    } 
    async signOut(logout:LogoutDTO): Promise<any> {
        //to do
    }  
}
