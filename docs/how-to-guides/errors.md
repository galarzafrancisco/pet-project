# Shared
packages/shared/src/error-codes.ts
packages/shared/src/problem-details.ts
packages/shared/index.ts

# Backend
## Domain
app/<backend_name>/src/errors/domain-error.ts
app/<backend_name>/src/errors/<domain>.errors.ts
app/<backend_name>/src/errors/factories.ts
## HTTP boundary
app/<backend_name>/src/http/error-catalog.ts
app/<backend_name>/src/http/problem-details.ts
app/<backend_name>/src/http/problem-details.filter.ts
app/<backend_name>/src/http/request-id.interceptor.ts
app/<backend_name>/src/http/validation-problem.mapper.ts
app/<backend_name>/src/http/logging.middleware.ts

# Backend for front end
## Upstream client edge
src/http/upstream.ts
src/http/upstream-problem.ts
src/http/code-translation.ts
## BFF boundary (outbound to FE)
src/http/problem-details.filter.ts
src/http/request-id.interceptor.ts
src/http/validation-problem.mapper.ts