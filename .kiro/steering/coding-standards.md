# DummyAI Auth Service Standards

## Error Handling
- All async operations must be properly awaited
- Never swallow errors silently — log and return appropriate HTTP status codes
- Use try/catch blocks around all external calls (bcrypt, jwt, database)

## Security
- Never log passwords, tokens, or secrets
- Use constant-time comparison for sensitive values
- All authentication endpoints must have rate limiting

## Testing
- Every bug fix must include a regression test
- Tests must cover both the happy path and the failure case
