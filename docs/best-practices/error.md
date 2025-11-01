# Error Handling & Propagation — Best Practices

This document defines **how errors are modeled, propagated, and exposed** across our stack.

It is the **source of truth** for error design in all services (Backend API, BFF, and Frontend).  
Implementation details and step-by-step examples will live in separate “How-To” guides.

---

## 📖 Core Principles

1. **Errors carry meaning, not implementation details.**  
   An error should tell *what went wrong* in business terms — not *how* or *where* it failed.

2. **Separate concerns:**  
   - **Domain errors** describe business or logical problems inside an app.  
   - **Transport errors** describe how those problems are sent across the network (HTTP, gRPC, etc.).

3. **Error boundaries convert formats, not meanings.**  
   - Within a process → throw/handle typed `DomainError`s.
   - Across processes → emit/consume a stable data format (RFC 7807 Problem Details).

4. **Each error has a stable, product-level code.**  
   Codes are short, upper-snake-case identifiers (`PRODUCT_NOT_FOUND`, `AUTH_INVALID_CREDENTIALS`) that never change once published.

5. **The contract is the data shape, not the class.**  
   Never rely on exception class names across services; rely on `code`, `status`, and `context`.

6. **Mapping happens only at boundaries.**  
   Services throw domain errors → controllers map them → HTTP clients parse them → frontends present them.

7. **Human messages are for users; codes are for machines.**  
   UI logic, retries, and telemetry key on `code`, not on `title` or `detail`.

8. **Every error must be traceable.**  
   Include a correlation or `requestId` in all Problem Details and log entries.

---

## 🧩 Domain Errors

**Purpose:** represent business logic failures inside a service.

- Extend a common `DomainError` base.  
- Contain: `message`, `code`, and optional safe `context`.  
- **Never** reference HTTP or transport details.

```ts
export abstract class DomainError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly context?: Record<string, any>,
  ) {
    super(message);
  }
}
```

Example:
```typescript
export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super('Product not found.', 'PRODUCT_NOT_FOUND', { productId });
  }
}
```