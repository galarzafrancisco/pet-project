# How to Create an Entity  
**SQLite-first**, portable to Postgres (and Spanner).

Entities represent **persistent domain data**. They belong entirely to the **data layer**—no HTTP, validation, or business logic.  
Services enforce invariants; entities define structure.

---

## 1. Naming & Location

**File name:** `<entity>.entity.ts`  
**Class name:** `<Entity>Entity`  
**Folder:** `apps/backend/src/<domain>/`  

**Example:**  
```
apps/backend/src/product/product.entity.ts
```

**Table name:** snake_case plural (e.g., `products`).  
**Column names:** snake_case.  
**Relations:** explicit, never eager.

---

## 2. Command

```bash
cd apps/backend
npx nest g resource product --no-spec --type entity
# or manually:
npx nest g class product/product.entity --flat
```

---

## 3. Rules

✅ **SQLite-first design**
- Use `TEXT`, `INTEGER`, `REAL`, and `DATETIME`.  
- Avoid JSON when possible.  
- Keep constraints in services (SQLite doesn’t enforce partial unique or advanced checks).

✅ **Portable to Postgres**
- Use UUIDs, enums, and timestamps in a compatible way.  
- You can later swap `simple-json` → `jsonb`, `datetime` → `timestamptz`, add partial/GIN indexes.

✅ **Strict boundaries**
- No imports from other domains.  
- No logic or derived values (compute those in services).  
- Never return entities in API responses.

---

## 4. Example (SQLite-First, Portable)

```ts
// apps/backend/src/product/product.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn,
} from 'typeorm';

export enum ProductCategory {
  FOOD = 'FOOD',
  ELECTRONICS = 'ELECTRONICS',
  APPAREL = 'APPAREL',
}

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // TEXT in SQLite; UUID in Postgres

  @Index()
  @Column({ type: 'text' })
  sku!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: ProductCategory })
  category!: ProductCategory; // TEXT in SQLite; enum in Postgres

  @Column({ type: 'integer', name: 'unit_price_cents' })
  unitPriceCents!: number; // store money in cents

  @Column({ type: 'integer', default: 0 })
  quantity!: number;

  // Only use JSON for small metadata, never structured data
  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @VersionColumn({ name: 'row_version' })
  rowVersion!: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
```

---

## 5. Column Standards

| Concept | SQLite type | Postgres type | Rule |
|----------|--------------|---------------|------|
| Primary key | `TEXT` (UUID v4) | `uuid` | Always app-generated |
| Dates | `datetime` | `timestamptz` | Always UTC |
| Money | `integer` (cents) | `integer`/`numeric` | Never floats |
| Enum | `text` | `enum` | Keep values stable |
| JSON | `simple-json` | `jsonb` | Prefer explicit columns |
| Soft delete | `datetime` | `timestamptz` | Always include |
| Optimistic lock | `integer` | `integer` | Always include `@VersionColumn` |

---

## 6. Soft Delete

- Always use `@DeleteDateColumn`.  
- SQLite: enforce “unique while active” in services.  
- Postgres: add partial unique index in migration:
  ```sql
  CREATE UNIQUE INDEX uq_products_sku_active
  ON products (sku)
  WHERE deleted_at IS NULL;
  ```

---

## 7. Migrations

**Local/dev (SQLite):**
```ts
synchronize: true
```
Use for rapid iteration only.  
Run `migration:generate` regularly to confirm portability.

**Prod (Postgres):**
```ts
synchronize: false
```
Generate, review, and commit migrations.

---

## 8. Upgrade Paths

**→ Postgres**
- Change `datetime` → `timestamptz`, `simple-json` → `jsonb`.
- Add GIN/partial indexes.
- Use native enums.

**→ Spanner**
- Map types (`STRING`, `BOOL`, `INT64`, `NUMERIC`, `TIMESTAMP`, `JSON`).
- Use UUIDs, not sequences.
- Review FK behavior and latency.

---

## 9. Don’ts

🚫 No eager relations.  
🚫 No business logic.  
🚫 No floats for money.  
🚫 No unbounded JSON blobs.  
🚫 No entities in API responses.  

---

## Related Guides

- `create-a-service` — business logic & transactions  
- `create-a-controller` — API boundary  
- `create-a-dto` — input/output contracts  
- `create-a-domain` — structure overview  
- `create-error` — domain error patterns
