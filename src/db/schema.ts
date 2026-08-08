import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow()
});

export const candidateProfiles = pgTable('candidate_profiles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or 'default_candidate'
  name: text('name').notNull(),
  targetRole: text('target_role').notNull(),
  yearsOfExperience: integer('years_of_experience').notNull(),
  targetCompany: text('target_company').notNull(),
  primaryLanguage: text('primary_language').notNull(),
  resumeText: text('resume_text'),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const interviewSessions = pgTable('interview_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  uid: text('uid'),
  candidateName: text('candidate_name'),
  currentTrack: text('current_track'),
  currentDifficulty: text('current_difficulty'),
  currentQuestionIndex: integer('current_question_index'),
  messagesCount: integer('messages_count'),
  messagesJson: jsonb('messages_json'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const evaluationReports = pgTable('evaluation_reports', {
  id: serial('id').primaryKey(),
  reportId: text('report_id').notNull().unique(),
  uid: text('uid'),
  candidateName: text('candidate_name'),
  overallScore: integer('overall_score'),
  hiringRecommendation: text('hiring_recommendation'),
  reportJson: jsonb('report_json'),
  createdAt: timestamp('created_at').defaultNow()
});

export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  uid: text('uid'),
  candidateName: text('candidate_name').notNull(),
  rating: integer('rating').notNull(),
  category: text('category').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
  feedbacks: many(feedbacks),
  evaluationReports: many(evaluationReports)
}));
