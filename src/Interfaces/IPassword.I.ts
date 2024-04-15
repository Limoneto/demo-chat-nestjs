import { Prop, Schema } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { promises } from "dns";
import {env} from "process";
import { Document } from "mongoose";

@Schema()
export abstract class AbstractPassword {
    @Prop({required: true})
    protected password: string;
    

    async encryptMyPassword() {
        this.password = await this.encryptPassword(this.password);
    }
    
    async encryptPassword(key: string) {
        return await bcrypt.hash(key + env.PASS_KEY, env.SALT_ROUNDS);
    }
    
    async verifyPassword(key: string):Promise<boolean> {
        const pass = await this.encryptPassword(key); // Added 'await' keyword
        const decryptedPassword = await bcrypt.compare(pass, this.password);
        return decryptedPassword;
    }

    getPassword() {
        return this.password;
    }


    public fieldWithData(userDocument: Document): void {
        
    }
}

