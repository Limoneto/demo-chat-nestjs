import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument} from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(): Promise<UserDocument[]> {
    try{
      const users= this.userModel.find().exec().then((users) => {
      if(!users){
        this.logger.log('findAll - Theres no users \n'+ Date.now());
        return null;
      }
      return users;
    }
    );
    return users;}
    catch(e){
      this.logger.log('findAll - Error \n'+ Date.now()+'\n'+e);
    };

  }

  async findOne(nick: string) : Promise<UserDocument> {
    const user = this.userModel.findOne({nick: nick}).exec().then((user) => {
      if(!user){
        this.logger.log('findOne - User not exists \n'+ Date.now()+'\n'+nick);
        return null;
      }
      return user;
    } );
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
