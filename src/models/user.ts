import type { ReturnModelType } from '@typegoose/typegoose';
import { getModelForClass, index, prop } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import type { Document } from 'mongoose';

@index({ username: 1 }, { unique: true })
export class User {
  @prop()
  username: string;

  @prop()
  password: string;

  static async findByUsername(
    this: ReturnModelType<typeof User>,
    username: string,
    project?: Record<string, unknown>,
  ): Promise<TestDocument | null> {
    return this.findOne({ username }, project).lean();
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(data: { input: string; hash: string }): Promise<boolean> {
    return bcrypt.compare(data.input, data.hash);
  }
}

export type TestDocument = User & Document;

const UserModel = getModelForClass(User);

export default UserModel;
