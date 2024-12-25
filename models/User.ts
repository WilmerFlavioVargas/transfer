import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  twoFactorSecret?: string;
  isTwoFactorEnabled: boolean;
  loyaltyPoints: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  firstName: String,
  lastName: String,
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  twoFactorSecret: String,
  isTwoFactorEnabled: { type: Boolean, default: false },
  loyaltyPoints: { type: Number, default: 0 },
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

