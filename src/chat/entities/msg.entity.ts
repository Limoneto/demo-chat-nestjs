import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user.schema';
export type MsgDocument = Msg & Document;

@Schema()
export class Msg {
    @Prop({ required: true })
    from: User;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true})
    data: any;

    @Prop({ required: true, default: new Date() })
    dateTime: Date;

    @Prop({ required: true})
    to: User|Room;
}
export const MsgSchema = SchemaFactory.createForClass(Msg);

