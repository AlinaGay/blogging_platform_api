<!-- Sync Impact Report
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (I–IV)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (generic)
    - .specify/templates/spec-template.md ✅ no changes needed (generic)
    - .specify/templates/tasks-template.md ✅ no changes needed (generic)
  Follow-up TODOs: None
-->

# Blogging Platform API Constitution

## Core Principles

### I. Simplicity First

Every architectural and implementation decision MUST favor the simplest
viable approach. No abstraction layers, design patterns, or indirection
unless a concrete, immediate problem demands it. YAGNI (You Aren't Gonna
Need It) governs all scope decisions. A flat module structure is preferred
over deep nesting. If a feature can be delivered with fewer files, fewer
lines, or fewer dependencies, that path MUST be chosen.

### II. RESTful CRUD as the Contract

The API MUST expose resources as standard REST endpoints using
conventional HTTP methods (GET, POST, PUT, DELETE) and status codes.
Every endpoint MUST map directly to a CRUD operation on a well-defined
resource. Response payloads MUST use JSON. URL paths MUST follow the
pattern `/api/v1/{resource}` and `/api/v1/{resource}/{id}`. No GraphQL,
no RPC-style endpoints, no custom protocols.

### III. Clear Separation of Backend and Frontend

The FastAPI backend and the React frontend MUST be independently
runnable and deployable. The backend MUST NOT serve the frontend; the
frontend communicates exclusively via the REST API. Each side has its
own dependency management, build process, and test suite. Shared types
or contracts are defined once in API documentation, not duplicated.

### IV. Data Integrity at the Database Level

PostgreSQL MUST be the single source of truth for all persistent data.
Schema constraints (NOT NULL, UNIQUE, FOREIGN KEY, CHECK) MUST enforce
data integrity rather than relying solely on application-level
validation. Migrations MUST be versioned and repeatable. Every schema
change MUST have a corresponding migration file.

## Technology Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy (async), Alembic for
  migrations, Pydantic for request/response validation
- **Frontend**: TypeScript, React 18+, standard fetch or axios for API
  calls
- **Database**: PostgreSQL 15+
- **Testing**: pytest (backend), Vitest or Jest (frontend)
- **API Documentation**: Auto-generated via FastAPI OpenAPI (Swagger UI)

No additional frameworks, ORMs, or middleware MUST be introduced without
an explicit justification that references a concrete requirement.

## Development Workflow

- All changes MUST be made on feature branches and merged via pull
  request.
- Every pull request MUST pass linting and existing tests before merge.
- Commits MUST be atomic and describe the "why" not just the "what."
- Database migrations MUST be tested against a fresh database before
  merge.
- The API MUST remain backwards-compatible within a major version; any
  breaking change increments the API version prefix.

## Governance

This constitution is the authoritative source for architectural and
process decisions in the Blogging Platform API project. All code reviews
and pull requests MUST verify compliance with the principles above.

Amendments to this constitution require:
1. A written proposal describing the change and its rationale.
2. An updated version number following semantic versioning (see below).
3. A review of all dependent templates and documentation for consistency.

Versioning policy:
- MAJOR: Removal or incompatible redefinition of a principle.
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarifications, wording, or non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: 2026-03-31 | **Last Amended**: 2026-03-31
