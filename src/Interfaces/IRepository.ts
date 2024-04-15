import { Model, Document, ClientSession, modelNames } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export abstract class BaseRepository<T extends Document, C> {
    protected readonly logger: Logger;
    protected session: ClientSession;
    protected model:Model<T>;

    async startSession(): Promise<void> {
        this.session = await this.model.startSession();
    }

    async commitTransaction(): Promise<void> {
        this.session.commitTransaction();
    }

    async abortTransaction(): Promise<void> {
        this.session.abortTransaction();
    }

    async endSession(): Promise<void> {
        this.session.endSession();
    }

    async create(obj: T): Promise<T|C> {
        try {
            const createdObj = new this.model(obj);
            const savedObj = await createdObj.save();
            this.logger.log(`${this.constructor.name} | create | ${new Date().toISOString()}: Object created successfully`);
            return savedObj;
        } catch (error) {
            this.logger.error(`${this.constructor.name} | create | ${new Date().toISOString()}: Error creating object: ${error.message}`);
            throw error;
        }
    }

    async findById(id: string): Promise<T|C | null> { 
        try {
            const foundObj = await this.model.findById(id).exec();
            if (foundObj) {
                this.logger.log(`${this.constructor.name} | findById | ${new Date().toISOString()}: Object found by id`);
            } else {
                this.logger.log(`${this.constructor.name} | findById | ${new Date().toISOString()}: Object not found by id`);
            }
            return foundObj;
        } catch (error) {
            this.logger.error(`${this.constructor.name} | findById | ${new Date().toISOString()}: Error finding object by id: ${error.message}`);
            throw error;
        }
    }
    async findByQuery(query: any): Promise<T|C | null> {
        try {
            const foundObj = await this.model.findOne(query).exec();
            if (foundObj) {
                this.logger.log(`${this.constructor.name} | findByQuery | ${new Date().toISOString()}: Object found by query`);
            } else {
                this.logger.log(`${this.constructor.name} | findByQuery | ${new Date().toISOString()}: Object not found by query`);
            }
            return foundObj;
        } catch (error) {
            this.logger.error(`${this.constructor.name} | findByQuery | ${new Date().toISOString()}: Error finding object by query: ${error.message}`);
            throw error;
        }
        }
    }


//     async create(obj: C): Promise<C> {
//         try {
//             const createdChat = new this.model(obj);
//             this.logger.log(`${this.constructor.name} | create | ${new Date().toISOString()}: Chat created successfully`);
//             return createdChat;
//         } catch (error) {
//             this.logger.error(`ChatRepository | create | ${new Date().toISOString()}: Error creating chat: ${error.message}`);
//             throw error;
//         }
    
// }

// async findById(id: string): Promise<Chat | null> {
//     try {
//         const foundChat = await this.model.findById(id).exec();
//         if (foundChat) {
//             this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat found by id`);
//         } else {
//             this.logger.log(`ChatRepository | findById | ${new Date().toISOString()}: Chat not found by id`);
//         }
//         return foundChat;
//     } catch (error) {
//         this.logger.error(`ChatRepository | findById | ${new Date().toISOString()}: Error finding chat by id: ${error.message}`);
//         throw error;
//     }
// }

// async findAll(): Promise<Chat[]> {
//     try {
//         const chats = await this.model.find().exec();
//         this.logger.log(`ChatRepository | findAll | ${new Date().toISOString()}: All chats found`);
//         return chats;
//     } catch (error) {
//         this.logger.error(`ChatRepository | findAll | ${new Date().toISOString()}: Error finding all chats: ${error.message}`);
//         throw error;
//     }
// }

// async update(id: string, chat: Chat): Promise<Chat | null> {
//     try {
//         const updatedChat = await this.model.findByIdAndUpdate(id, chat, { new: true }).exec();
//         if (updatedChat) {
//             this.logger.log(`ChatRepository | update | ${new Date().toISOString()}: Chat with id ${id} updated successfully`);
//         } else {
//             this.logger.log(`ChatRepository | update | ${new Date().toISOString()}: Chat with id ${id} not found`);
//         }
//         return updatedChat;
//     } catch (error) {
//         this.logger.error(`ChatRepository | update | ${new Date().toISOString()}: Error updating chat with id ${id}: ${error.message}`);
//         throw error;
//     }
// }

// async delete(id: string): Promise<Chat | null> {
//     try {
//         const deletedChat = await this.model.findByIdAndDelete(id).exec();
//         if (deletedChat) {
//             this.logger.log(`ChatRepository | delete | ${new Date().toISOString()}: Chat with id ${id} deleted successfully`);
//         } else {
//             this.logger.log(`ChatRepository | delete | ${new Date().toISOString()}: Chat with id ${id} not found`);
//         }
//         return deletedChat;
//     } catch (error) {
//         this.logger.error(`ChatRepository | delete | ${new Date().toISOString()}: Error deleting chat with id ${id}: ${error.message}`);
//         throw error;
//     }
// }

// async deleteAll(): Promise<number> { 
//     try {
//         const deletedChats = await this.model.deleteMany({}).exec();
//         this.logger.log(`ChatRepository | deleteAll | ${new Date().toISOString()}: All chats deleted successfully`);
//         const result = deletedChats.deletedCount;
//         return result;
//     } catch (error) {
//         this.logger.error(`ChatRepository | deleteAll | ${new Date().toISOString()}: Error deleting all chats: ${error.message}`);
//         throw error;
//     }
// }
