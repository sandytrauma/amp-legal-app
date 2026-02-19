import { pgTable, serial, text, timestamp, integer, pgEnum, boolean, unique } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['ADMIN', 'LAWYER', 'CLIENT', 'CLERK']);
export const statusEnum = pgEnum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(), // Add this field for the Passkey
  role: roleEnum('role').default('LAWYER'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').default('PENDING'),
  assignedTo: integer('assigned_to').references(() => users.id),
  deadline: timestamp('deadline'),
  isPriority: boolean('is_priority').default(false),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hearings = pgTable('hearings', {
  id: serial('id').primaryKey(),
  caseName: text('case_name').notNull(),
  hearingDate: timestamp('hearing_date').notNull(),
  courtRoom: text('court_room'),
  judgeName: text('judge_name'),
  proxyRequired: boolean('proxy_required').default(false),
  proxyStatus: text('proxy_status').default('NONE'), // 'NONE', 'SENT', 'CONFIRMED'
});

// Statutory Master Table (For Law/Act references)
export const statutoryMaster = pgTable("statutory_master", {
  id: serial("id").primaryKey(),
  actName: text("act_name").notNull(),
  section: text("section").notNull(),
  description: text("description"),
  penalty: text("penalty"),
}, (t) => ({
  // This prevents the AI from adding the same law twice
  unq: unique().on(t.actName, t.section),
}));

// Client Inquiries Table
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  contactNumber: text('contact_number').notNull(),
  subject: text('subject').notNull(),
  message: text('message'),
  status: text('status').default('NEW'), // 'NEW', 'FOLLOW_UP', 'CONVERTED'
  assignedTo: integer('assigned_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Documents Table
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type'), // e.g., 'PDF', 'DOCX'
  relatedToType: text('related_to_type'), // 'TASK', 'HEARING', 'CLIENT'
  relatedToId: integer('related_to_id'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  message: text("message").notNull(),
  type: text("type").default("TASK_UPDATE"), // e.g., 'TASK_UPDATE', 'HEARING_REMINDER'
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});