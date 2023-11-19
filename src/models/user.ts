import type { ReturnModelType } from '@typegoose/typegoose';
import { getModelForClass, index, prop } from '@typegoose/typegoose';
import type { Document } from 'mongoose';

@index({ username: 1 }, { unique: true })
export class User {
  @prop()
  username: string;

  @prop()
  email: string;

  static async findByUsername(
    this: ReturnModelType<typeof User>,
    username: string,
    project?: Record<string, unknown>,
  ): Promise<TestDocument | null> {
    return this.findOne({ username }, project).lean();
  }
}

export type TestDocument = User & Document;

const UserModel = getModelForClass(User);

export default UserModel;
