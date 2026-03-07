# ServiceFlow OS - Functional Product Document

## 1) Product Summary

### Product name
- ServiceFlow OS

### Product type
- Multi-tenant vertical SaaS + productized implementation for home service SMBs.

### Primary users
- Owner/Operator
- Office Manager / Dispatcher
- Technician (light role, mobile-first)

### Core business problem
- Home service businesses lose revenue because lead response, quote follow-up, and booking workflows are inconsistent.

### Product promise
- Increase booked jobs from existing demand by standardizing lead-to-booking operations with automation.

## 2) Target Segment

### Ideal customer profile (ICP)
- Home service companies in HVAC, plumbing, electrical, cleaning, landscaping.
- 3-20 field technicians.
- 1-5 office staff.
- Owner-led decision making.
- Uses at least one channel for digital leads (web form, Google Business Profile calls, social DM, ad leads).

### Buying triggers
- Missed calls and slow first response.
- Low estimate-to-booking conversion.
- No consistent follow-up process.
- Inability to measure pipeline performance by source and service line.

## 3) Product Scope

### In-scope for MVP
- Lead intake and unified lead inbox.
- Missed call recovery automation (SMS).
- Estimate follow-up automation.
- Booking pipeline board.
- Dispatch-lite scheduling.
- Post-job review and referral automation.
- Basic reporting dashboard.
- Multi-tenant administration and basic branding personalization.

### Out-of-scope for MVP
- Full accounting/ERP.
- Complex route optimization.
- Native telephony carrier switching logic.
- AI call transcription and advanced voice bot.
- Deep custom enterprise workflows per tenant.

## 4) Functional Requirements by Module

## 4.1 Tenant and User Management

### Goal
- Support N clients on one core platform with isolated data and independent configuration.

### Functional requirements
- Tenant creation via admin onboarding wizard.
- Tenant-level branding:
- Company name.
- Logo.
- Primary color.
- Service lines.
- Service area.
- Business hours.
- User roles:
- Platform Admin (you).
- Tenant Admin (owner/manager).
- Dispatcher.
- Technician.
- Each record must include `tenant_id`.
- Tenant cannot access data from other tenants.

### Acceptance criteria
- Tenant A user cannot see Tenant B records in any endpoint or UI.
- Platform Admin can impersonate tenant context for support.

## 4.2 Lead Intake and Inbox

### Goal
- Capture every inbound opportunity in one system.

### Functional requirements
- Create lead from:
- Manual entry.
- Embedded web form.
- Twilio call event webhook.
- Import CSV (optional MVP+).
- Store lead attributes:
- Name, phone, email.
- Service needed.
- Zip/city.
- Lead source.
- Urgency level.
- Lead inbox with filters:
- New.
- Uncontacted.
- Contacted.
- Booked.
- Lost.

### Acceptance criteria
- New lead appears in under 3 seconds after webhook event.
- Dispatcher can update lead status in 1 click.

## 4.3 Missed Call Recovery

### Goal
- Recover leads from unanswered inbound calls.

### Functional requirements
- Detect missed inbound call events from Twilio.
- Trigger SMS auto-response template with opt-out language.
- Create callback task for dispatcher.
- Stop automation if lead responds or books.
- Log message events and delivery status.

### Acceptance criteria
- 100% of missed calls generate a lead + callback task.
- SMS retries and failures are visible in activity log.

## 4.4 Estimate Follow-Up Automation

### Goal
- Increase quote-to-booking conversion.

### Functional requirements
- Quote record linked to lead/job:
- Amount.
- Sent timestamp.
- Expiration date.
- Status (`pending`, `accepted`, `declined`).
- Follow-up sequence engine:
- Day 1 reminder.
- Day 3 value reminder.
- Day 7 last reminder.
- Per-tenant templates and scheduling window.
- Pause/cancel sequence when status changes.

### Acceptance criteria
- No follow-up message sent after accepted/declined.
- Dispatcher can force-send or skip next step.

## 4.5 Booking Pipeline Board

### Goal
- Give office staff a visual and actionable workflow.

### Functional requirements
- Kanban stages:
- New Lead.
- Contacted.
- Estimate Scheduled.
- Quote Sent.
- Booked.
- Lost.
- Drag-and-drop stage updates.
- Stage-level counts and conversion rates.
- Mandatory loss reason when moved to Lost.

### Acceptance criteria
- Stage move updates activity timeline and audit log.
- Dashboard conversion metrics update within 1 minute.

## 4.6 Dispatch-lite Scheduling

### Goal
- Basic booking operations without full field service complexity.

### Functional requirements
- Create jobs from booked leads.
- Assign technician and time window.
- Calendar day/week views.
- Job statuses (`scheduled`, `en route`, `completed`, `canceled`).
- Technician mobile-friendly view for assigned jobs only.

### Acceptance criteria
- Dispatcher can schedule a job in < 60 seconds.
- Technician can view all assigned jobs for today.

## 4.7 Post-Job Review and Referral Automation

### Goal
- Improve reputation and referrals with minimal manual work.

### Functional requirements
- Trigger review request after job completion.
- Per-tenant review URL configuration.
- Optional second reminder if no response.
- Referral prompt after positive review action.

### Acceptance criteria
- Completed jobs are eligible for review workflow automatically.
- Opt-out is respected globally per contact.

## 4.8 Maintenance Plan Renewals

### Goal
- Support recurring revenue services.

### Functional requirements
- Plan record:
- Customer.
- Plan type.
- Renewal date.
- Renewal status.
- Pre-renewal reminder sequence (30/14/3 days configurable).
- Renewal outcome tracking (`renewed`, `pending`, `lost`).

### Acceptance criteria
- Renewal reminders execute at configured cadence.
- Renewal conversion visible in monthly report.

## 4.9 Reporting and KPI Dashboard

### Goal
- Prove business impact to reduce churn and justify upgrades.

### Required KPI views
- Lead response time.
- Missed call recovery rate.
- Quote-to-booking conversion.
- Booked jobs by source.
- Lost reason breakdown.
- Review request completion rate.
- Renewal conversion (if enabled).

### Functional requirements
- Date range filtering.
- Export CSV.
- Monthly performance summary email (tenant admin).

### Acceptance criteria
- KPI values are consistent with underlying event data.
- Exports complete for up to 12 months in under 30 seconds.

## 5) Key User Workflows

## Workflow A: Missed call to booked job
- Inbound call missed.
- Twilio webhook creates lead.
- Auto SMS sent.
- Dispatcher receives callback task.
- Lead moved through pipeline.
- Job scheduled.
- Job completed.
- Review request sent.

## Workflow B: Quote follow-up conversion
- Lead receives estimate.
- Quote follow-up automation starts.
- Customer replies and books.
- Sequence stops automatically.
- Job created and assigned.

## Workflow C: Renewal cycle
- Plan enters renewal window.
- Reminder sequence starts.
- Customer renews or is marked lost.
- KPI updated in dashboard.

## 6) Personalization and White-Label Boundaries

### Included in setup
- Branding and theme.
- Service lines and service areas.
- Message templates.
- Business hours and routing rules.
- Basic reporting configuration.

### Paid add-ons
- Additional integrations not in standard connector list.
- Custom workflow branches beyond packaged logic.
- Advanced reporting widgets.
- Migration from legacy systems requiring data cleanup.

## 7) Non-Functional Requirements

### Security
- Tenant data isolation at database and API layers.
- RBAC on every endpoint.
- Secrets in managed secret store.
- HTTPS everywhere.

### Reliability
- Target uptime: 99.5% for MVP, 99.9% for growth stage.
- Daily backups and point-in-time recovery.

### Performance
- P95 page load < 2.5s on office broadband.
- P95 API read < 300ms for standard list endpoints.

### Compliance baseline
- TCPA-safe opt-out handling for SMS.
- Basic privacy controls (data deletion request path).
- Audit logs for key status and workflow changes.

## 8) Suggested Tech Stack (Recommended)

## 8.1 Why this stack
- Fast to build as solo founder.
- Strong TypeScript ecosystem.
- Good balance between speed now and scale later.

## 8.2 Core stack
- Frontend:
- Next.js (App Router) + TypeScript.
- Tailwind CSS + component library (shadcn/ui).
- Backend:
- Next.js route handlers for MVP, then extract service modules if needed.
- Zod for request validation.
- Database:
- PostgreSQL (Neon/Supabase/AWS RDS).
- Prisma ORM.
- Queue and async jobs:
- Redis + BullMQ.
- Scheduler:
- BullMQ delayed jobs + repeatable jobs for automation cadences.
- Auth:
- Clerk or Auth.js with tenant-aware RBAC.
- Messaging:
- Twilio for SMS and call webhooks.
- Resend for email notifications/reports.
- File storage:
- S3-compatible storage for logos/import files.
- Hosting:
- Vercel (web) + managed background worker service (Railway/Fly/Render).
- Observability:
- Sentry (errors) + PostHog (product analytics) + structured logs.

## 8.3 Multi-tenant data strategy
- Single database, shared schema, `tenant_id` partition key.
- Every query scoped by `tenant_id`.
- Optional PostgreSQL RLS for defense in depth.
- Composite indexes with `tenant_id` first for hot tables.

## 8.4 Suggested high-level architecture
- Web app serves tenant UI.
- API endpoints write domain events.
- Worker consumes queue for automations and notifications.
- Integrations handled via webhook ingestion service.
- Reporting computed from transactional + event tables.

## 9) Data Model (Core Entities)

### Core tables
- tenants
- users
- memberships (user <-> tenant role mapping)
- contacts
- leads
- lead_events
- quotes
- quote_followups
- jobs
- job_assignments
- automation_rules
- automation_runs
- messages
- renewal_plans
- renewals
- audit_logs

### Required cross-table conventions
- Every business table includes:
- `id` (UUID)
- `tenant_id` (UUID, indexed)
- `created_at`
- `updated_at`

## 10) Integrations

### MVP integrations
- Twilio:
- inbound call webhooks.
- SMS send/status callbacks.
- Google Calendar (optional in MVP+):
- dispatch sync for office teams.
- Resend:
- monthly performance report emails.

### Integration design rules
- Connector isolation in integration modules.
- Retry logic with exponential backoff for all outbound calls.
- Dead-letter queue for failed integration events.

## 11) Delivery Plan

## Phase 1 (4-6 weeks): MVP
- Tenant onboarding + RBAC.
- Lead inbox.
- Missed call recovery.
- Quote follow-up.
- Pipeline board.
- Basic KPI dashboard.

## Phase 2 (3-4 weeks): Operations layer
- Dispatch-lite.
- Review/referral workflows.
- Renewal reminders.
- Monthly report emails.

## Phase 3 (ongoing): Scale and upsell
- Advanced analytics.
- More connectors.
- Partner/admin tooling.
- Stronger SLA and reliability controls.

## 12) Product Metrics and Success Criteria

### Product success metrics
- Weekly active dispatch users per tenant.
- Automation completion rate.
- Time-to-first-booking after go-live.
- Tenant retention at 90 days.

### Business success metrics
- MRR growth.
- Gross margin per tenant.
- Support hours per tenant.
- Setup-to-subscription conversion.

## 13) Risks and Design Constraints

### Main risk
- Becoming a custom agency with fragmented code paths.

### Mitigation
- Product policy:
- One core product.
- Configuration over customization.
- Paid add-ons only for bounded extensions.
- Convert repeated custom requests into product features only when 3+ tenants need them.

## 14) Build Recommendation Summary

- Build ServiceFlow OS as a multi-tenant TypeScript web app with queue-driven automation.
- Prioritize lead-to-booking and quote follow-up outcomes before adding deeper dispatch complexity.
- Keep custom requests packaged and scoped to protect margin.
- Use dashboard KPI proof to drive retention and upgrade from Launch to Growth tiers.
