import { Model, set } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { BaseRepository } from 'src/Interfaces/IRepository';
import { BlobOptions } from 'buffer';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument, User>{
    logger = new Logger(UserRepository.name);
    
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super();
    }
    
    async resetChanels():Promise<boolean> {
        try {
            const users = await this.userModel.find().exec();
            users.forEach((user) => {
                user.setChannels(new Set<string>());
                user.save();
            });
            this.logger.log(`UserRepository | resetChanels | ${new Date().toISOString()}: All users channels reset`);
            return true;
        }
        catch (error) {
            this.logger.error(`UserRepository | resetChanels | ${new Date().toISOString()}: Error reseting users channels: ${error.message}`);
            throw error;
            return false ;
        }
    }

    override async create(user: User): Promise<User> {
        try {
            const createdUser = new this.userModel(user);
            const savedUser = await createdUser.save();
            this.logger.log(`UserRepository | create | ${new Date().toISOString()}: User created successfully`);
            return savedUser;
        } catch (error) {
            this.logger.error(`UserRepository | create | ${new Date().toISOString()}: Error creating user: ${error.message}`);
            throw error;
        }
    }

    override async findById(id: string): Promise<User | null> {
        try {
            const foundUser = await this.userModel.findById(id).exec();
            if (foundUser) {
                this.logger.log(`UserRepository | findById | ${new Date().toISOString()}: User found by id`);
            } else {
                this.logger.log(`UserRepository | findById | ${new Date().toISOString()}: User not found by id`);
            }
            return foundUser;
        } catch (error) {
            this.logger.error(`UserRepository | findById | ${new Date().toISOString()}: Error finding user by id: ${error.message}`);
            throw error;
        }
    }
    async findByIdAndPopulate(id: string): Promise<User | null> {
        try {
            const foundUser = await this.userModel.findById(id).exec();
            if (foundUser) {
                this.logger.log(`UserRepository | findByIdAndPopulate | ${new Date().toISOString()}: User found by id`);
                await foundUser.populate('chats');
                await foundUser.populate('messages');
            } else {
                this.logger.log(`UserRepository | findByIdAndPopulate | ${new Date().toISOString()}: User not found by id`);
            }
            return foundUser;
        } catch (error) {
            this.logger.error(`UserRepository | findByIdAndPopulate | ${new Date().toISOString()}: Error finding user by id: ${error.message}`);
            throw error;
        }
    }

    async findOneByNick(nick: string): Promise<User | null> {
        try {
            const foundUser = await this.userModel.findOne({ nick: nick }).exec();
            if (foundUser) {
                this.logger.log(`UserRepository | findOneByNick | ${new Date().toISOString()}: User found by nick`);
            } else {
                this.logger.log(`UserRepository | findOneByNick | ${new Date().toISOString()}: User not found by nick`);
            }
            return foundUser;
        } catch (error) {
            this.logger.error(`UserRepository | findOneByNick | ${new Date().toISOString()}: Error finding user by nick: ${error.message}`);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userModel.find().exec();
            this.logger.log(`UserRepository | findAll | ${new Date().toISOString()}: All users found`);
            return users;
        } catch (error) {
            this.logger.error(`UserRepository | findAll | ${new Date().toISOString()}: Error finding all users: ${error.message}`);
            throw error;
        }
    }

    async findAllAndPopulate(): Promise<User[]> {
        try {
            const users = await this.userModel.find().exec();
            await users?.map((user)=>{user.populate('chats');user.populate('room')});
            this.logger.log(`UserRepository | findAllAndPopulate | ${new Date().toISOString()}: All users found`);
            return users;
        } catch (error) {
            this.logger.error(`UserRepository | findAllAndPopulate | ${new Date().toISOString()}: Error finding all users: ${error.message}`);
            throw error;
        }
    }

    async update(id: string, user: User): Promise<User | null> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
            if (updatedUser) {
                this.logger.log(`UserRepository | update | ${new Date().toISOString()}: User with id ${id} updated successfully`);
            } else {
                this.logger.log(`UserRepository | update | ${new Date().toISOString()}: User with id ${id} not found`);
            }
            return updatedUser;
        } catch (error) {
            this.logger.error(`UserRepository | update | ${new Date().toISOString()}: Error updating user with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async delete(id: string): Promise<User | null> {
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
            if (deletedUser) {
                this.logger.log(`UserRepository | delete | ${new Date().toISOString()}: User with id ${id} deleted successfully`);
            } else {
                this.logger.log(`UserRepository | delete | ${new Date().toISOString()}: User with id ${id} not found`);
            }
            return deletedUser;
        } catch (error) {
            this.logger.error(`UserRepository | delete | ${new Date().toISOString()}: Error deleting user with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async addConnection(id: string, connection: string): Promise<Set<string>> {
        const user = await this.userModel.findByIdAndUpdate(id, { $push: { channels: connection } }, { new: true }).exec();
        if (user) {
            this.logger.log(`UserRepository | addConnection | ${new Date().toISOString()}: Connection added to user with id ${id}`);
        } else {
            this.logger.log(`UserRepository | addConnection | ${new Date().toISOString()}: User with id ${id} not found`);
        }
        return user.getChannels();
    }

    async removeConnectionById(id: string, connection: string): Promise<boolean> {
        try{
            const user = await this.userModel.findByIdAndUpdate(id, { $pull: { channels: connection } }, { new: true }).exec();
            if (user) {
                this.logger.log(`UserRepository | removeConnection | ${new Date().toISOString()}: Connection removed from user with id ${id}`);
                return true;
            } else {
                this.logger.log(`UserRepository | removeConnection | ${new Date().toISOString()}: User with id ${id} not found`);
                return false
            }
        }
        catch (error) {
            this.logger.error(`UserRepository | removeConnection | ${new Date().toISOString()}: Error removing connection from user with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async getUserByChannel(channel: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({ channels: { $in: [channel] } }).exec();
            if (user) {
                this.logger.log(`UserRepository | getUserByChannel | ${new Date().toISOString()}: User found by channel`);
            } else {
                this.logger.log(`UserRepository | getUserByChannel | ${new Date().toISOString()}: User not found by channel`);
            }
            return user;
        } catch (error) {
            this.logger.error(`UserRepository | getUserByChannel | ${new Date().toISOString()}: Error finding user by channel: ${error.message}`);
            throw error;
        }
    }

}
