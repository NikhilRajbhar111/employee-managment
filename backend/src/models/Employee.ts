import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  departmentId: mongoose.Types.ObjectId;
  supervisorId?: mongoose.Types.ObjectId;
  jobTitle: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
      index: true,
    },
    supervisorId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [2, 'Job title must be at least 2 characters long'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
      index: true,
    },
    location: {
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text search index for name and email
employeeSchema.index({ name: 'text', email: 'text' });

// Populate department and supervisor by default
employeeSchema.pre(/^find/, function (next) {
  this.populate('departmentId', 'name').populate('supervisorId', 'name email jobTitle');
  next();
});

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);