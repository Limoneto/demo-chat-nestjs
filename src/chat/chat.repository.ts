import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';
import { BaseRepository } from 'src/Interfaces/IRepository';

@Injectable()
export class ChatRepository extends BaseRepository<ChatDocument, Chat> {
    protected readonly logger = new Logger(ChatRepository.name);
    
    constructor(@InjectModel(Chat.name) protected model: Model<ChatDocument>) {
        super();
    }

    async create(chat: Chat): Promise<Chat> {
            try {
                const createdChat = new this.model(chat);
                this.logger.log(`ChatRepository | create | ${new Date().toISOString()}: Chat created successfully`);
                return createdChat;
            } catch (error) {
                this.logger.error(`ChatRepository | create | ${new Date().toISOString()}: Error creating chat: ${error.message}`);
                throw error;
            }
        
    }

    async findById(id: string): Promise<Chat | null> {
        try {
            const foundChat = await this.model.findById(id).exec();
            if (foundChat) {
                this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat found by id`);
            } else {
                this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat not found by id`);
            }
            return foundChat;
        } catch (error) {
            this.logger.error(`ChatRepository | findById | ${new Date().toISOString()}: Error finding chat by id: ${error.message}`);
            throw error;
        }
    }

    async findAll(): Promise<Chat[]> {
        try {
            const chats = await this.model.find().exec();
            this.logger.log(`ChatRepository | findAll | ${new Date().toISOString()}: All chats found`);
            return chats;
        } catch (error) {
            this.logger.error(`ChatRepository | findAll | ${new Date().toISOString()}: Error finding all chats: ${error.message}`);
            throw error;
        }
    }

    async update(id: string, chat: Chat): Promise<Chat | null> {
        try {
            const updatedChat = await this.model.findByIdAndUpdate(id, chat, { new: true }).exec();
            if (updatedChat) {
                this.logger.log(`ChatRepository | update | ${new Date().toISOString()}: Chat with id ${id} updated successfully`);
            } else {
                this.logger.log(`ChatRepository | update | ${new Date().toISOString()}: Chat with id ${id} not found`);
            }
            return updatedChat;
        } catch (error) {
            this.logger.error(`ChatRepository | update | ${new Date().toISOString()}: Error updating chat with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async addMessageToChatByID(id: string, messageId: string): Promise<Chat | null> {
        try {
            const updatedChat = await this.model.findByIdAndUpdate(id, { $push: { messages: messageId } }, { new: true }).exec(); 
            if (updatedChat) {
                this.logger.log(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Chat with id ${id} updated successfully`);}
            else {
                this.logger.log(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Chat with id ${id} not found`);
            }
            return updatedChat;
        }
        catch (error) {
            this.logger.error(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Error updating chat with id ${id}: ${error.message}`);
            throw error;
        }
    }
    async addMessageToChatByUsers(users: Set<string>, messageId: string): Promise<Chat | null> {
        try {
            const updatedChat = await this.model.findOneAndUpdate({users:users}, { $push: { messages: messageId } }, { new: true }).exec();
            if (updatedChat) {
                this.logger.log(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Chat with users ${users} updated successfully`);}
            else {
                this.logger.log(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Chat with users ${users} not found`);
            }
            return updatedChat;
        }
        catch (error) {
            this.logger.error(`ChatRepository | addMessageToChat | ${new Date().toISOString()}: Error updating chat with users ${users}: ${error.message}`);
            throw error;
        }
    }

    async delete(id: string): Promise<Chat | null> {
        try {
            const deletedChat = await this.model.findByIdAndDelete(id).exec();
            if (deletedChat) {
                this.logger.log(`ChatRepository | delete | ${new Date().toISOString()}: Chat with id ${id} deleted successfully`);
            } else {
                this.logger.log(`ChatRepository | delete | ${new Date().toISOString()}: Chat with id ${id} not found`);
            }
            return deletedChat;
        } catch (error) {
            this.logger.error(`ChatRepository | delete | ${new Date().toISOString()}: Error deleting chat with id ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteAll(): Promise<number> { 
        try {
            const deletedChats = await this.model.deleteMany({}).exec();
            this.logger.log(`ChatRepository | deleteAll | ${new Date().toISOString()}: All chats deleted successfully`);
            const result = deletedChats.deletedCount;
            return result;
        } catch (error) {
            this.logger.error(`ChatRepository | deleteAll | ${new Date().toISOString()}: Error deleting all chats: ${error.message}`);
            throw error;
        }
    }

    async findByIdAndPopulate(id: string): Promise<Chat | null> {
        try {
            const foundChat = await this.model.findById(id);
            if (foundChat) {
                await foundChat.populate('users');
                await foundChat.populate('messages');
                this.logger.log(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Chat found by id`);
            } else {
                this.logger.log(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Chat not found by id`);
            }
            return foundChat;
        } catch (error) {
            this.logger.error(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Error finding chat by id: ${error.message}`);
            throw error;
        }
    }

    async findByUsersID(users: string[]): Promise<Chat | null> {
        try {
            const foundChat = await this.model.findOne({users:users}).exec();
            if (foundChat) {
                this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat found by id`);
            } else {
                this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat not found by id`);
            }
            return foundChat;
        } catch (error) {
            this.logger.error(`ChatRepository | findById | ${new Date().toISOString()}: Error finding chat by id: ${error.message}`);
            throw error;
        }
    }

    async findByUsersIDAndPopulate(users: string[]): Promise<Chat | null> {
        try {
            const foundChat = await this.model.findOne({users:users});
            if (foundChat) {
                await foundChat.populate('users');
                await foundChat.populate('messages');
                this.logger.log(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Chat found by id`);
            } else {
                this.logger.log(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Chat not found by id`);
            }
            return foundChat;
        } catch (error) {
            this.logger.error(`ChatRepository | findByIdAndPopulate | ${new Date().toISOString()}: Error finding chat by id: ${error.message}`);
            throw error;
        }
    }

    

    async findAllAndPopulate(): Promise<Chat[]> {
        try {
            const chats = await this.model.find().exec();
            await chats?.map((chat)=>{chat.populate('users');
            chat.populate('messages')});
            this.logger.log(`ChatRepository | findAll | ${new Date().toISOString()}: All chats found`);
            return chats;
        } catch (error) {
            this.logger.error(`ChatRepository | findAll | ${new Date().toISOString()}: Error finding all chats: ${error.message}`);
            throw error;
        }
    }

    async findAllByUserId(userId: string): Promise<Chat[]> {
        try {
            const chats = await this.model.find({ users: { $in: [userId] } }).exec();
            this.logger.log(`ChatRepository | findAll | ${new Date().toISOString()}: All chats found`);
            return chats;
        } catch (error) {
            this.logger.error(`ChatRepository | findAll | ${new Date().toISOString()}: Error finding all chats: ${error.message}`);
            throw error;
        }
    }

    async findAllByUserIdAndPopulate(userId: string): Promise<Chat[]> {
        try {
            const chats = await this.model.find({ users: { $in: [userId] } }).exec();
            await chats?.map((chat) => {
                chat.populate('users');
                chat.populate('messages');
            });
            this.logger.log(`ChatRepository | findAll | ${new Date().toISOString()}: All chats found`);
            return chats;
        } catch (error) {
            this.logger.error(`ChatRepository | findAll | ${new Date().toISOString()}: Error finding all chats: ${error.message}`);
            throw error;
        }
    }

    
}