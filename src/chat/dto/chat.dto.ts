import { User } from "src/users/entities/user.entity";
import { MsgChat } from "../../msg/entities/msg.entity";
import { ChatDocument } from "../entities/chat.entity";
import { UserDTO } from "src/users/dto/user.dto"; // Import the missing UserDTO class
import { MsgChatDTO } from "src/msg/dto/msg.dto";
export class ChatDto {
    id: string;
    users: UserDTO[];
    messages: MsgChatDTO[];

    constructor(chatDocument: any) {
        this.id = chatDocument.id.toStrng();
        this.users = chatDocument.users.map((user)=>{ return new UserDTO(user)});
        this.messages = chatDocument.messages.map((msg)=>{ return new MsgChatDTO(msg)});
    }
}