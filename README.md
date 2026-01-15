Project Overview

This backend is a Node.js + Express + MongoDB API that powers a role- and permission-based access control system.

It is responsible for:

Authentication using JWT

Role and permission management

Team-based user grouping

Audit logging for sensitive actions

Enforcing authorization rules at the API level

The frontend only displays UI conditionally — all critical security checks are enforced here.

Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt

Role-Based Access Control (RBAC)

Permission Scoping (self / team / global)

High-Level Architecture
Client (React)
   ↓ JWT
Auth Middleware
   ↓
Permission Middleware
   ↓
Controllers
   ↓
MongoDB

Project Structure
server/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── admin.controller.js
│   └── audit.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── permission.middleware.js
│   └── error.middleware.js
├── models/
│   ├── User.js
│   ├── Role.js
│   ├── Permission.js
│   ├── Team.js
│   └── AuditLog.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── admin.routes.js
│   └── audit.routes.js
├── utils/
│   └── permissions.js
├── app.js
└── server.js

Authentication
JWT-Based Authentication

Users authenticate using email & password

JWT is generated on login

Token is required for all protected routes

Security

Passwords hashed using bcrypt

Tokens validated on every request

Unauthorized access blocked early in middleware

Authorization Model
Roles

Users can have one or more roles

Roles contain permissions

Roles are dynamic and configurable

Permissions

Each permission consists of:

permissionKey (e.g. manage_users)

scope:

self

team

global

Permissions are checked per request using middleware.

Middleware
auth.middleware.js

Purpose

Verifies JWT

Attaches authenticated user to req.user

Blocks:

Missing token

Invalid or expired token

permission.middleware.js

Purpose

Enforces fine-grained access control

Verifies required permission + scope

Logic

Collects permissions from all user roles

Matches required permission key

Applies scope rules:

Self: user’s own resource

Team: same team users

Global: unrestricted

Unauthorized requests return 403 Forbidden.

Controllers
auth.controller.js

User login

Token generation

Returns user + permissions

user.controller.js

Fetch profile

Update profile

Fetch team members

Remove user from team

Enforces scope-based access

admin.controller.js

Admin-only operations:

Create users

Create teams

Manage roles

Assign permissions to roles

All endpoints protected by permission middleware.

audit.controller.js

Records sensitive actions

Stores actor, action, metadata, timestamp

Read-only access for admins

Models
User

Email, password, roles, team

Relationships to Role & Team

Role

Name

Assigned permissions

Permission:

Key

Scope

Team

Name

Members

AuditLog

Actor

Action

Metadata

Timestamp

API Security Flow:

Client sends JWT

Auth middleware validates token

Permission middleware checks permission & scope

Controller executes logic

Audit log written for sensitive actions

Environment Variables

Create a .env file inside server/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/access-control
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=development