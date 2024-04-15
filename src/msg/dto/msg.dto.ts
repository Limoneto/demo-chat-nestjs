import { AnyAaaaRecord } from "dns";
import { MsgChatDocument, MsgRoomDocument } from "../entities/msg.entity";

export class MsgChatDTO {

    id: string;

    from: string;

    message: string;

    data: any;

    dateTime: string;

    to: string;
    constructor(msgChatDocument: any) { this.id = msgChatDocument.id; this.from = msgChatDocument.from.toString(); this.message = msgChatDocument.message; this.data = msgChatDocument.data; this.dateTime = msgChatDocument.dateTime.toDateString(); this.to = msgChatDocument.to.toString(); }

}

export class MsgRoomDTO {

    id: string;

    from: string;

    message: string;

    data: any;

    dateTime: string;

    to: string;

    constructor(msgChatDocument: any) { this.id = msgChatDocument.id; this.from = msgChatDocument.from.toString(); this.message = msgChatDocument.message; this.data = msgChatDocument.data; this.dateTime = msgChatDocument.dateTime.toDateString(); this.to = msgChatDocument.to.toString(); }

}


