import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument} from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDTO } from './dto/singin-user.dto';
import { NotFoundError } from 'rxjs';
import {JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { ResponseHelper } from 'src/http/response.helper';
import { ResponseDTO } from 'src/http/responses.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private jwtService: JwtService;
  
  constructor( 
    private readonly userRepository: UserRepository,
    private readonly responseHelper : ResponseHelper
    ) {}
  
  async create(createUserDto: CreateUserDto) {
    const user = new User();

    return 'This action adds a new user';
  }
  
  async resetChanels() {
     return this.userRepository.resetChanels().then((res) => {return res});
  }

  async signIn(data: LoginDTO) : Promise<ResponseDTO> {
    const { nick, password , email } = data;
    const user = await this.userRepository.findOneByNick( nick);
    if (!user) {
      this.logger.log('signIn - User not exists \n'+ Date.now()+'\n'+nick);
      throw new NotFoundError('User not exists');
    }
    if (!user.verifyPassword(password).then((res)=>{return res})) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, nick: user.getNick(), email: user.getMail() };
    const access_token = await this.jwtService.signAsync(payload);
    const response = this.responseHelper.makeResponse(false, 'User found', access_token, HttpStatus.OK);
    return response;
  }

  findAll(): Promise<User[]> {
    try{
      const users= this.userRepository.findAll().then((users) => {
      if(!users){
        this.logger.log('findAll - Theres no users \n'+ Date.now());
        return null;
      }
      return users;
    }
    )
    return users;}
    catch(e){
      this.logger.log('findAll - Error \n'+ Date.now()+'\n'+e);
    };

  }

  async handleConnection(channel: string, id:string): Promise<boolean> {
    this.userRepository.addConnection(id, channel);
    return true;
  }
  async handleDisconnetion(channel: string): Promise<boolean> {
    const user = await this.userRepository.getUserByChannel(channel);
    const result = await this.userRepository.removeConnectionById(user.id, channel);
    return result;
  }

  

  }
