# Leave Manager MCP Server

A custom **Model Context Protocol (MCP) server** built with **TypeScript** for managing employee leave-related operations through AI clients such as **Claude Desktop**.

This project is currently designed for **internal development and testing** and uses a **dummy/in-memory database** instead of a production database.

The architecture is designed so that the dummy database can later be replaced with a real database or internal Leave Management API without changing the MCP tool interface.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Technology Stack](#technology-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Project Structure](#project-structure)
* [Configuration](#configuration)
* [Available MCP Tools](#available-mcp-tools)
* [Run the MCP Server](#run-the-mcp-server)
* [Build the Project](#build-the-project)
* [Run the Production Build](#run-the-production-build)
* [Test with MCP Inspector](#test-with-mcp-inspector)
* [Connect with Claude Desktop](#connect-with-claude-desktop)
* [Test Leave Manager with Claude](#test-leave-manager-with-claude)
* [Dummy Database](#dummy-database)
* [Development Workflow](#development-workflow)
* [Troubleshooting](#troubleshooting)
* [Future Enhancements](#future-enhancements)
* [Production Considerations](#production-considerations)
* [License](#license)

---

# Overview

The Leave Manager MCP Server exposes leave-management functionality as MCP tools that can be used by AI clients.

For example, instead of manually calling an API, a user can ask Claude:

> How many casual leaves do I have?

Claude can identify the appropriate MCP tool and invoke:

```text
get_leave_balance
```

The MCP server processes the request and returns structured information that Claude can use to generate a natural-language response.

### Example

```text
User
 │
 │ "How many leaves do I have?"
 ▼
Claude Desktop
 │
 │ MCP Tool Call
 ▼
Leave Manager MCP Server
 │
 ▼
Dummy Database
 │
 ▼
Leave Balance
 │
 ▼
Claude Desktop
 │
 ▼
Natural Language Response
```

---

# Features

The current version provides the following MCP tools:

* Get employee leave balance
* Get employee leave history
* Get available leave types
* Apply for leave
* Cancel leave
* Input validation using Zod
* Dummy/in-memory database
* TypeScript implementation
* stdio-based MCP transport
* MCP Inspector support
* Claude Desktop integration

---

# Architecture

The current architecture is:

```text
                    ┌──────────────────────┐
                    │    Claude Desktop    │
                    │                      │
                    │   User Interaction   │
                    └──────────┬───────────┘
                               │
                               │ MCP / stdio
                               ▼
                    ┌──────────────────────┐
                    │ Leave Manager MCP    │
                    │      Server          │
                    │                      │
                    │ MCP Tool Layer       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Leave Service     │
                    │    / Repository      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Dummy DB         │
                    │                      │
                    │ employees[]          │
                    │ leaveBalances[]      │
                    │ leaveRequests[]      │
                    └──────────────────────┘
```

The server uses **stdio** because Claude Desktop can launch the MCP server as a local process and communicate with it through standard input/output. The MCP TypeScript SDK provides `serveStdio()` for this use case.

---

# Technology Stack

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| TypeScript         | Application development   |
| Node.js            | Runtime                   |
| npm                | Dependency management     |
| MCP TypeScript SDK | MCP server implementation |
| Zod                | Input validation          |
| Claude Desktop     | MCP client                |
| MCP Inspector      | Local MCP testing         |
| Dummy DB           | Temporary data storage    |

The current MCP TypeScript SDK v2 is the stable SDK line and uses `@modelcontextprotocol/server`.

---

# Prerequisites

Before starting, make sure the following are installed.

## Node.js

Node.js **20 or later** is required.

Check the installed version:

```bash
node --version
```

Example:

```text
v22.9.0
```

Check npm:

```bash
npm --version
```

---

## Claude Desktop

Install Claude Desktop on your machine.

Claude Desktop will act as the MCP client and will launch the Leave Manager MCP server locally.

---

# Installation

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd leave-manager-mcp
```

---

## 2. Install dependencies

Run:

```bash
npm install
```

The project uses the MCP TypeScript server package:

```bash
npm install @modelcontextprotocol/server
```

Zod is used for validating tool input:

```bash
npm install zod
```

For TypeScript development:

```bash
npm install -D typescript tsx @types/node
```

The official MCP server setup currently uses Node.js 20+, ES modules, `@modelcontextprotocol/server`, Zod, and `tsx`.

---

# Project Structure

Recommended project structure:

```text
leave-manager-mcp/
│
├── src/
│   │
│   ├── index.ts
│   │
│   ├── data/
│   │   └── dummy-db.ts
│   │
│   ├── models/
│   │   └── leave.ts
│   │
│   ├── repositories/
│   │   └── leave-repository.ts
│   │
│   └── tools/
│       └── leave-tools.ts
│
├── dist/
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Responsibilities

#### `src/index.ts`

Creates and starts the MCP server.

#### `src/models/leave.ts`

Contains TypeScript models/interfaces related to employees and leave.

#### `src/data/dummy-db.ts`

Contains temporary in-memory test data.

#### `src/repositories/leave-repository.ts`

Provides data-access operations.

#### `src/tools/leave-tools.ts`

Registers MCP tools that Claude can invoke.

---

# Configuration

## package.json

A typical configuration:

```json
{
  "name": "leave-manager-mcp",
  "version": "1.0.0",
  "description": "Leave Manager MCP Server",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/server": "^2.0.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "tsx": "^4.0.0",
    "typescript": "^6.0.0"
  }
}
```

> Dependency versions may differ depending on when `npm install` is executed. Always prefer the versions generated by npm.

---

# TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "outDir": "dist"
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

The Node types entry is important with current TypeScript versions because the MCP SDK's published type definitions reference Node APIs.

---

# Available MCP Tools

The current Leave Manager MCP server exposes the following tools.

## 1. get_leave_balance

Returns the current leave balance for an employee.

### Input

```json
{
  "employeeId": "EMP001"
}
```

### Example result

```json
{
  "employeeId": "EMP001",
  "casual": 8,
  "sick": 5,
  "earned": 12,
  "unpaid": 0
}
```

---

## 2. get_leave_history

Returns the leave history for an employee.

### Input

```json
{
  "employeeId": "EMP001"
}
```

### Example result

```json
[
  {
    "id": "LR001",
    "employeeId": "EMP001",
    "leaveType": "CASUAL",
    "startDate": "2026-08-20",
    "endDate": "2026-08-21",
    "reason": "Personal work",
    "status": "APPROVED"
  }
]
```

---

## 3. get_leave_types

Returns available leave types.

### Example result

```json
[
  {
    "type": "CASUAL",
    "description": "Casual leave"
  },
  {
    "type": "SICK",
    "description": "Sick leave"
  },
  {
    "type": "EARNED",
    "description": "Earned leave"
  },
  {
    "type": "UNPAID",
    "description": "Unpaid leave"
  }
]
```

---

## 4. apply_leave

Creates a new leave request.

### Input

```json
{
  "employeeId": "EMP001",
  "leaveType": "CASUAL",
  "startDate": "2026-09-10",
  "endDate": "2026-09-11",
  "reason": "Family function"
}
```

### Example result

```json
{
  "id": "LR002",
  "employeeId": "EMP001",
  "leaveType": "CASUAL",
  "startDate": "2026-09-10",
  "endDate": "2026-09-11",
  "reason": "Family function",
  "status": "PENDING"
}
```

---

## 5. cancel_leave

Cancels an existing leave request.

### Input

```json
{
  "leaveId": "LR002"
}
```

### Example result

```json
{
  "id": "LR002",
  "status": "CANCELLED"
}
```

---

# Run the MCP Server

There are two ways to run the server during development.

---

## Option 1: Run directly with tsx

This is recommended during development.

```bash
npm run dev
```

Internally this executes:

```bash
tsx src/index.ts
```

You should see:

```text
Leave Manager MCP server running...
```

The process will continue running because an stdio MCP server waits for a client to communicate with it.

Stop the server using:

```text
Ctrl + C
```

---

# Build the Project

Before using the compiled version, run:

```bash
npm run build
```

This executes:

```bash
tsc
```

The compiled JavaScript files will be generated inside:

```text
dist/
```

Expected structure:

```text
dist/
├── index.js
├── data/
│   └── dummy-db.js
├── models/
│   └── leave.js
├── repositories/
│   └── leave-repository.js
└── tools/
    └── leave-tools.js
```

---

# Run the Production Build

After building:

```bash
npm start
```

This executes:

```bash
node dist/index.js
```

The MCP server will start using the compiled JavaScript.

---

# Test with MCP Inspector

Before connecting the server to Claude Desktop, it is recommended to test it with the MCP Inspector.

The MCP Inspector provides a local UI for connecting to an MCP server and directly invoking its tools.

## Start Inspector

From the project root:

```bash
npx @modelcontextprotocol/inspector npm run dev
```

Alternatively:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

The Inspector will provide a browser URL.

Open that URL in your browser.

---

# Test Tools in MCP Inspector

After connecting the server, open the:

```text
Tools
```

section.

You should see:

```text
get_leave_balance
get_leave_history
get_leave_types
apply_leave
cancel_leave
```

---

## Test `get_leave_balance`

Select:

```text
get_leave_balance
```

Provide:

```json
{
  "employeeId": "EMP001"
}
```

Expected response:

```json
{
  "employeeId": "EMP001",
  "casual": 8,
  "sick": 5,
  "earned": 12,
  "unpaid": 0
}
```

---

## Test `get_leave_history`

Input:

```json
{
  "employeeId": "EMP001"
}
```

---

## Test `get_leave_types`

This tool does not require any input.

---

## Test `apply_leave`

Input:

```json
{
  "employeeId": "EMP001",
  "leaveType": "CASUAL",
  "startDate": "2026-09-10",
  "endDate": "2026-09-11",
  "reason": "Family function"
}
```

---

## Test `cancel_leave`

Input:

```json
{
  "leaveId": "LR002"
}
```

---

# Connect with Claude Desktop

Once the server works correctly in MCP Inspector, connect it to Claude Desktop.

The MCP server should be configured as a local stdio server because Claude Desktop launches the process and communicates through stdin/stdout.

---

## 1. Build the project

First run:

```bash
npm run build
```

Make sure this file exists:

```text
dist/index.js
```

---

## 2. Get the absolute project path

From the project root:

```bash
pwd
```

Example:

```text
/Users/ashish/projects/leave-manager-mcp
```

Your server path will therefore be:

```text
/Users/ashish/projects/leave-manager-mcp/dist/index.js
```

Use an **absolute path** in the Claude Desktop configuration.

---

# Claude Desktop Configuration

Add the Leave Manager MCP server to Claude Desktop's MCP configuration.

Example:

```json
{
  "mcpServers": {
    "leave-manager": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/leave-manager-mcp/dist/index.js"
      ]
    }
  }
}
```

For example, on macOS:

```json
{
  "mcpServers": {
    "leave-manager": {
      "command": "node",
      "args": [
        "/Users/ashish/projects/leave-manager-mcp/dist/index.js"
      ]
    }
  }
}
```

> Replace the path with the actual absolute path on your machine.

---

# Important: Restart Claude Desktop

After changing the MCP configuration:

1. Save the configuration.
2. Completely quit Claude Desktop.
3. Start Claude Desktop again.
4. Open a new conversation.
5. Check the available MCP tools.

You should see the Leave Manager server and its tools.

---

# Test Leave Manager with Claude

Once connected, you don't need to manually invoke the MCP tools.

You can simply ask Claude natural-language questions.

---

## Example 1 — Leave Balance

Ask:

```text
How many leaves does EMP001 have?
```

Claude should use:

```text
get_leave_balance
```

with:

```json
{
  "employeeId": "EMP001"
}
```

---

## Example 2 — Leave History

Ask:

```text
Show me the leave history of EMP001.
```

Claude should use:

```text
get_leave_history
```

---

## Example 3 — Available Leave Types

Ask:

```text
What types of leaves are available?
```

Claude should use:

```text
get_leave_types
```

---

## Example 4 — Apply Leave

Ask:

```text
Apply casual leave for EMP001 from September 10 to September 11 because of a family function.
```

Claude should use:

```text
apply_leave
```

with the appropriate parameters.

---

## Example 5 — Cancel Leave

Ask:

```text
Cancel leave request LR002.
```

Claude should use:

```text
cancel_leave
```

---

# Dummy Database

The current implementation uses an in-memory database.

Example:

```typescript
export const employees = [
  {
    id: "EMP001",
    name: "Ashish Kushwaha",
    email: "ashish@example.com",
    department: "Engineering"
  }
];
```

Leave balance:

```typescript
export const leaveBalances = [
  {
    employeeId: "EMP001",
    casual: 8,
    sick: 5,
    earned: 12,
    unpaid: 0
  }
];
```

Leave requests:

```typescript
export const leaveRequests = [
  {
    id: "LR001",
    employeeId: "EMP001",
    leaveType: "CASUAL",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    reason: "Personal work",
    status: "APPROVED",
    createdAt: "2026-08-10"
  }
];
```

---

# Important Dummy DB Limitation

The current database is stored in application memory.

Therefore:

```text
Server starts
      ↓
Dummy data loaded
      ↓
Apply leave
      ↓
New request added
      ↓
Server stops
      ↓
Data is lost
```

This is expected.

The dummy database is only intended for development and MCP testing.

---

# Development Workflow

Recommended development workflow:

```text
1. Modify TypeScript
        ↓
2. Run npm run build
        ↓
3. Run MCP Inspector
        ↓
4. Test MCP tools
        ↓
5. Fix issues
        ↓
6. Test with Claude Desktop
        ↓
7. Commit changes
```

During development you can also use:

```bash
npm run dev
```

instead of building after every change.

---

# Logging

Because the server uses stdio, **do not use `console.log()` for normal server logging**.

Avoid:

```typescript
console.log("Server started");
```

Use:

```typescript
console.error("Server started");
```

The reason is that stdout is used by MCP for protocol communication. Writing normal logs to stdout can corrupt the JSON-RPC/MCP communication stream.

---

# Troubleshooting

## Problem: `Cannot find module`

Run:

```bash
rm -rf node_modules
rm -f package-lock.json
npm install
```

Then:

```bash
npm run build
```

---

## Problem: TypeScript build error

Run:

```bash
npx tsc --noEmit
```

This will show TypeScript errors without generating files.

---

## Problem: `dist/index.js` does not exist

Run:

```bash
npm run build
```

Then verify:

```bash
ls dist
```

---

## Problem: Claude Desktop does not show the MCP server

Check:

1. The MCP configuration is valid JSON.
2. The path to `dist/index.js` is absolute.
3. `npm run build` completed successfully.
4. `dist/index.js` exists.
5. Node.js is installed.
6. Claude Desktop was completely restarted.
7. The MCP server works in MCP Inspector.

---

## Problem: MCP Inspector cannot connect

First run:

```bash
npm run dev
```

If the server starts successfully, stop it and then run:

```bash
npx @modelcontextprotocol/inspector npm run dev
```

Check the terminal for errors.

---

## Problem: Server starts but tools are not visible

Check:

```text
src/index.ts
```

and make sure your tools are registered:

```typescript
registerLeaveTools(
  server,
  repository
);
```

Also make sure `serveStdio()` is called:

```typescript
void serveStdio(createServer);
```

---

## Problem: JSON-RPC/MCP protocol errors

Check the code for:

```typescript
console.log(...)
```

Replace normal logging with:

```typescript
console.error(...)
```

stdout must remain available for MCP protocol communication.

---

# Future Enhancements

The current version is a prototype. The following improvements are recommended.

## Database

Replace the dummy database with:

```text
PostgreSQL
MySQL
MongoDB
```

or an existing internal Leave Management API.

---

## Authentication

Add employee authentication so that the user doesn't have to provide:

```text
employeeId
```

manually.

Future architecture:

```text
Claude
   ↓
MCP Server
   ↓
Authentication
   ↓
Employee Context
   ↓
Leave Service
```

---

## Leave Validation

Add business rules:

* Validate leave dates
* Validate leave balance
* Prevent overlapping leave
* Check company holidays
* Check weekends
* Validate minimum/maximum leave duration
* Validate employee status
* Validate leave type
* Prevent cancellation after approval, if applicable

---

## Manager Approval

Add tools such as:

```text
get_pending_leave_requests
approve_leave
reject_leave
```

---

## Team Calendar

Add:

```text
get_team_leave_calendar
```

Example user request:

```text
Who from my team is on leave next week?
```

---

## Notifications

Integrate with:

```text
Email
Slack
Microsoft Teams
```

to notify employees and managers.

---

# Recommended Production Architecture

The long-term architecture should separate MCP from business logic:

```text
                    Claude Desktop
                          │
                          │ MCP
                          ▼
                ┌───────────────────┐
                │    MCP Server     │
                │                   │
                │ Tool Definitions  │
                │ Input Validation  │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   Leave Service   │
                │                   │
                │ Business Rules    │
                │ Validation        │
                │ Authorization     │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Leave Repository  │
                └─────────┬─────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
          Internal Leave API    Database
```

This makes it possible to replace the dummy database without changing the tools exposed to Claude.

---

# Security Considerations

The current project is intended for development/testing only.

Before using it with real employee data:

* Add authentication.
* Add authorization.
* Do not trust `employeeId` supplied by the model.
* Validate all tool inputs.
* Protect employee information.
* Avoid exposing unnecessary employee data.
* Add audit logging.
* Implement role-based access control.
* Protect manager-only operations.
* Add rate limiting where applicable.
* Do not store secrets in source code.
* Use environment variables for credentials.
* Secure connections to internal APIs/databases.

The MCP server should enforce business permissions rather than relying on Claude to make security decisions.

---

# Environment Variables

When connecting to real services, use environment variables.

Example `.env`:

```text
LEAVE_API_URL=https://internal.example.com/api
LEAVE_API_KEY=your-api-key
```

Do not commit `.env` to Git.

Add:

```text
.env
```

to `.gitignore`.

---

# Git Ignore

Recommended `.gitignore`:

```text
node_modules/
dist/
.env
.DS_Store
*.log
```

---

# Useful Commands

## Install dependencies

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run compiled server

```bash
npm start
```

## Type check

```bash
npx tsc --noEmit
```

## Run MCP Inspector

```bash
npx @modelcontextprotocol/inspector npm run dev
```

## Check Node version

```bash
node --version
```

## Check npm version

```bash
npm --version
```

---

# MCP Development Checklist

Before considering the MCP server ready for internal testing:

* [ ] Node.js 20+ installed
* [ ] Dependencies installed
* [ ] TypeScript build succeeds
* [ ] Dummy database configured
* [ ] MCP server starts successfully
* [ ] MCP Inspector connects successfully
* [ ] `get_leave_balance` tested
* [ ] `get_leave_history` tested
* [ ] `get_leave_types` tested
* [ ] `apply_leave` tested
* [ ] `cancel_leave` tested
* [ ] Claude Desktop configuration added
* [ ] Claude Desktop restarted
* [ ] Leave Manager tools visible in Claude
* [ ] Natural-language requests tested
* [ ] Error scenarios tested

---

# Example User Queries

Once connected to Claude Desktop, users should be able to ask questions such as:

```text
How many casual leaves do I have?
```

```text
Show my leave history.
```

```text
What leave types are available?
```

```text
Apply casual leave from September 10 to September 11.
```

```text
Cancel my leave request LR002.
```

Future examples:

```text
Do I have enough leave for next Monday?
```

```text
Who from my team is on leave next week?
```

```text
Show all pending leave requests.
```

```text
Approve Rahul's leave request.
```

---

# MCP Resources

Official MCP TypeScript SDK:

https://ts.sdk.modelcontextprotocol.io/v2/

Official first-server guide:

https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server

Official server API:

https://ts.sdk.modelcontextprotocol.io/v2/api/@modelcontextprotocol/server/

The project currently follows the MCP TypeScript SDK v2 architecture and the modern 2026-07-28 protocol line.

---

# License

This project is intended for internal development and testing.

Add your organization's license and usage policy here.

---

# Maintainer

**Ashish Kushwaha**

Leave Manager MCP Server
TypeScript + MCP + Claude Desktop

---

## Quick Start

For experienced developers, the complete setup can be summarized as:

```bash
# Clone
git clone <YOUR_REPOSITORY_URL>

# Enter project
cd leave-manager-mcp

# Install
npm install

# Build
npm run build

# Run
npm start

# Development
npm run dev

# MCP Inspector
npx @modelcontextprotocol/inspector npm run dev
```

Then configure Claude Desktop to launch:

```text
dist/index.js
```

using:

```json
{
  "mcpServers": {
    "leave-manager": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/leave-manager-mcp/dist/index.js"
      ]
    }
  }
}
```

Restart Claude Desktop and start testing the Leave Manager MCP tools.
