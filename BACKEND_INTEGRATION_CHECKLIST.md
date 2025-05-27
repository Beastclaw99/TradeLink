
# ProLinkTT Backend Integration Checklist (Supabase Setup Guide)

## 📋 Overview
This document outlines all backend elements needed to fully implement the ProLinkTT trade professional platform based on the frontend components analysis.

---

## 🗄️ Database Tables Required

### 1. **profiles** (User Profiles)
```sql
- id: uuid (Primary Key, references auth.users)
- first_name: text
- last_name: text  
- account_type: enum ('client', 'professional', 'business')
- skills: text[] (Array for professionals)
- rating: decimal(3,2)
- bio: text
- phone: text
- address: text
- city: text
- parish: text
- profile_image_url: text
- created_at: timestamp
- updated_at: timestamp
```

### 2. **projects** (Job/Project Listings)  
```sql
- id: uuid (Primary Key)
- client_id: uuid (Foreign Key to profiles)
- title: text (NOT NULL)
- description: text
- category: text
- location: text
- budget: decimal(10,2)
- timeline: text
- urgency: enum ('low', 'medium', 'high', 'urgent')
- requirements: text[]
- skills_needed: text[]
- status: enum ('open', 'in_progress', 'completed', 'cancelled')
- assigned_to: uuid (Foreign Key to profiles)
- created_at: timestamp
- updated_at: timestamp
```

### 3. **applications** (Professional Applications to Projects)
```sql  
- id: uuid (Primary Key)
- project_id: uuid (Foreign Key to projects)
- professional_id: uuid (Foreign Key to profiles)
- bid_amount: decimal(10,2)
- cover_letter: text
- proposal_message: text
- status: enum ('pending', 'accepted', 'rejected', 'withdrawn')
- created_at: timestamp
- updated_at: timestamp
```

### 4. **project_updates** (Timeline & Communication)
```sql
- id: uuid (Primary Key)
- project_id: uuid (Foreign Key to projects)
- user_id: uuid (Foreign Key to profiles)
- update_type: enum ('message', 'status_change', 'file_upload', 'site_check', 'start_time', 'completion_note', 'check_in', 'check_out', 'on_my_way', 'delayed', 'cancelled', 'revisit_required', 'expense_submitted', 'expense_approved', 'payment_processed', 'schedule_updated', 'task_completed', 'custom_field_updated')
- message: text
- status_update: text
- file_url: text
- metadata: jsonb (For structured data like geolocation, amounts, etc.)
- created_at: timestamp
```

### 5. **reviews** (Client Reviews for Professionals)
```sql
- id: uuid (Primary Key)
- project_id: uuid (Foreign Key to projects)
- client_id: uuid (Foreign Key to profiles)
- professional_id: uuid (Foreign Key to profiles)
- rating: integer (1-5)
- comment: text
- created_at: timestamp
- updated_at: timestamp
```

### 6. **payments** (Payment Tracking)
```sql
- id: uuid (Primary Key)
- project_id: uuid (Foreign Key to projects)
- client_id: uuid (Foreign Key to profiles)
- professional_id: uuid (Foreign Key to profiles)
- amount: decimal(10,2)
- status: enum ('pending', 'processing', 'completed', 'failed', 'refunded')
- payment_method: text
- transaction_id: text
- paid_at: timestamp
- created_at: timestamp
```

### 7. **messages** (Direct Messaging)
```sql
- id: uuid (Primary Key)
- sender_id: uuid (Foreign Key to profiles)
- recipient_id: uuid (Foreign Key to profiles)
- project_id: uuid (Foreign Key to projects, nullable)
- content: text
- is_read: boolean (Default: false)
- message_type: enum ('text', 'image', 'file')
- file_url: text (nullable)
- created_at: timestamp
```

### 8. **notifications** (System Notifications)
```sql
- id: uuid (Primary Key)
- user_id: uuid (Foreign Key to profiles)
- type: enum ('new_application', 'application_status', 'new_message', 'project_update', 'payment_received', 'review_submitted')
- title: text
- message: text
- is_read: boolean (Default: false)
- related_id: uuid (Could reference project, application, etc.)
- created_at: timestamp
```

---

## 🔐 Row Level Security (RLS) Policies Required

### profiles
- Users can view their own profile
- Users can update their own profile  
- Public read access for basic professional info (name, skills, rating)

### projects
- Clients can CRUD their own projects
- Professionals can read open projects
- Assigned professionals can read/update their assigned projects

### applications
- Professionals can create applications for open projects
- Professionals can read/update their own applications
- Project owners can read applications for their projects

### project_updates
- Project participants (client + assigned professional) can CRUD updates
- Read access for project stakeholders

### reviews
- Clients can create reviews for completed projects
- Public read access for professional ratings/reviews
- Users can read reviews about themselves

### payments
- Users can read their own payment records
- Project stakeholders can read project-related payments

### messages
- Users can CRUD messages they send/receive
- No access to other users' private messages

### notifications
- Users can read/update their own notifications only

---

## 📂 Storage Buckets Required

### 1. **profile-images**
- Purpose: User profile photos/avatars
- Access: Public read, authenticated write with user validation
- File types: jpg, png, webp
- Max size: 5MB

### 2. **project-files**
- Purpose: Project documentation, progress photos, contracts
- Access: Private (project stakeholders only)
- File types: pdf, jpg, png, doc, docx
- Max size: 25MB

### 3. **compliance-documents**
- Purpose: Professional certifications, licenses, insurance docs
- Access: Private (document owner + verified reviewers)
- File types: pdf, jpg, png
- Max size: 10MB

### 4. **message-attachments**
- Purpose: Files shared in direct messages
- Access: Private (conversation participants only)
- File types: All common types
- Max size: 15MB

---

## ⚡ Database Functions & Triggers

### 1. **handle_new_user()** (Trigger Function)
- Automatically create profile entry when user signs up
- Extract metadata from auth.users to populate profile

### 2. **update_project_status()** (Function)
- Business logic for project status transitions
- Validate status changes based on current state

### 3. **calculate_professional_rating()** (Function)
- Recalculate average rating when new review is added
- Update profiles.rating field

### 4. **notify_stakeholders()** (Function)
- Send notifications on key events (new applications, status changes)
- Manage notification preferences

### 5. **auto_archive_old_projects()** (Scheduled Function)
- Archive completed projects after 90 days
- Clean up old notifications

---

## 🔍 Database Indexes (Performance Optimization)

### High-Priority Indexes
```sql
- profiles.account_type (Filter by user type)
- projects.status (Filter active projects)
- projects.client_id (User's projects)
- projects.category (Search by trade category)
- applications.project_id (Project applications)
- applications.professional_id (User applications)
- applications.status (Filter by status)
- project_updates.project_id (Project timeline)
- messages.sender_id, messages.recipient_id (User conversations)
- reviews.professional_id (Professional ratings)
```

### Composite Indexes
```sql
- (projects.status, projects.created_at) - Active projects by date
- (applications.professional_id, applications.status) - User's active applications
- (messages.sender_id, messages.recipient_id, messages.created_at) - Conversation history
```

---

## 🔄 Real-time Subscriptions

### Tables requiring real-time updates:
- **project_updates** - Live project progress tracking
- **messages** - Instant messaging
- **applications** - Application status changes
- **notifications** - Real-time alerts

---

## 🎯 API Endpoints (Edge Functions)

### 1. **search-professionals**
- Filter professionals by skills, location, rating
- Fuzzy search capabilities
- Pagination support

### 2. **project-recommendations**
- Suggest relevant projects to professionals
- ML-based matching algorithm

### 3. **send-email-notification**
- Email alerts for critical events
- Template-based email system

### 4. **payment-webhook**
- Handle payment gateway callbacks
- Update payment status in database

### 5. **generate-report**
- Analytics and reporting for dashboard
- PDF generation for contracts/invoices

---

## 🛡️ Security Considerations

### Authentication
- Email/password authentication via Supabase Auth
- Social login options (Google, Facebook)
- Password reset functionality

### Data Validation
- Input sanitization for all user-generated content
- File type/size validation for uploads
- Rate limiting on API endpoints

### Privacy
- GDPR compliance for data deletion
- User consent management
- Data encryption for sensitive information

---

## 📊 Analytics & Monitoring

### Metrics to Track
- User registration/activation rates
- Project completion rates
- Average response times
- Payment success rates
- User engagement metrics

### Logging Requirements
- Application errors and exceptions
- Performance monitoring
- Security audit trails
- User activity logs

---

## 🚀 Deployment Checklist

### Environment Setup
- [ ] Supabase project configured
- [ ] Database tables created with proper RLS
- [ ] Storage buckets configured
- [ ] Edge functions deployed
- [ ] Environment variables set

### Testing
- [ ] Unit tests for database functions
- [ ] Integration tests for API endpoints
- [ ] Load testing for performance
- [ ] Security penetration testing

### Go-Live
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Documentation updated
- [ ] User training materials ready

---

This checklist provides a comprehensive backend setup guide for the ProLinkTT platform. Each component should be implemented and tested thoroughly before moving to production.
