import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MsgRoom, MsgRoomDocument, MsgChat, MsgChatDocument,  }from './entities/msg.entity';
import {  } from './entities/msg.entity';

@Injectable()
export class MsgRepository {
    private readonly logger = new Logger(MsgRepository.name);

    constructor(
        @InjectModel(MsgChat.name) private msgChatModel: Model<MsgChatDocument>,
        @InjectModel(MsgRoom.name) private msgRoomModel: Model<MsgRoomDocument>,
    ) {}

    async createMsgChat(msgChat: MsgChat): Promise<MsgChatDocument> {
        try {
            const createdMsgChat = new this.msgChatModel(msgChat);
            const savedMsgChat = await createdMsgChat.save();
            this.logger.log(`MsgRepository | createMsgChat | ${new Date().toISOString()}: MsgChat created successfully`);
            return savedMsgChat;
        } catch (error) {
            this.logger.error(`MsgRepository | createMsgChat | ${new Date().toISOString()}: Error creating MsgChat: ${error.message}`);
            throw error;
        }
    }

    async createMsgRoom(msgRoom: MsgRoom): Promise<MsgRoom> {
        try {
            const createdMsgRoom = new this.msgRoomModel(msgRoom);
            const savedMsgRoom = await createdMsgRoom.save();
            this.logger.log(`MsgRepository | createMsgRoom | ${new Date().toISOString()}: MsgRoom created successfully`);
            return savedMsgRoom;
        } catch (error) {
            this.logger.error(`MsgRepository | createMsgRoom | ${new Date().toISOString()}: Error creating MsgRoom: ${error.message}`);
            throw error;
        }
    }

}