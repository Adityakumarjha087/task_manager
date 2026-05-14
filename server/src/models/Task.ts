import mongoose, { Schema, Document } from 'mongoose';

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  project: mongoose.Types.ObjectId;
  assignee: mongoose.Types.ObjectId[];
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { 
    type: String, 
    enum: Object.values(TaskPriority), 
    default: TaskPriority.MEDIUM 
  },
  status: { 
    type: String, 
    enum: Object.values(TaskStatus), 
    default: TaskStatus.TODO 
  },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
