import CodeBlock from '@/components/ui/CodeBlock'
import CreateIndexEngine from '@/components/viz/CreateIndexEngine'

export default function PostgresPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-light border-2 border-blue/30 text-blue text-sm font-medium mb-4">
          🐘 PostgreSQL
        </div>
        <h1 className="text-4xl font-bold text-text mb-3">PostgreSQL Guide</h1>
        <p className="text-lg text-text-secondary max-w-xl">
          PostgreSQL-specific features, syntax, and concepts. What makes Postgres unique among relational databases.
        </p>
      </div>

      <div className="space-y-10">
        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">Why PostgreSQL?</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            PostgreSQL is the world&apos;s most advanced open-source relational database. It offers:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Full SQL standard compliance',
              'ACID transactions with MVCC',
              'Powerful indexing (B-tree, Hash, GiST, GIN, BRIN)',
              'Native JSON/JSONB support',
              'Window functions & CTEs',
              'EXPLAIN ANALYZE for query tuning',
              'Materialized views',
              'Extensions (PostGIS, pgvector)',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 px-4 py-3 bg-cream-dark rounded-xl border border-border text-sm text-text">
                <span className="text-green">✓</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">EXPLAIN ANALYZE</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            EXPLAIN ANALYZE shows how PostgreSQL executes a query: which scan methods it uses, how rows flow through join nodes, and where time is spent.
          </p>
          <CodeBlock
            title="sql"
            code={`EXPLAIN ANALYZE
SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.salary > 100000
ORDER BY e.name;`}
          />
          <div className="mt-4 text-sm text-text-secondary bg-cream-dark border-2 border-border rounded-xl p-4">
            <strong className="text-text block mb-1">Output interpretation:</strong>
            Look for Seq Scans on large tables (add an index), nested loops vs hash joins, and the &quot;actual time&quot; numbers. If actual rows &raquo; estimated rows, your table statistics may be stale.
          </div>
        </section>

        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">Indexes</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Indexes speed up data retrieval at the cost of write performance. PostgreSQL supports many index types.
          </p>
          <div className="space-y-4">
            <div>
              <CodeBlock
                title="sql"
                code={`-- B-tree index (default) — for =, <, >, BETWEEN, LIKE (prefix)
CREATE INDEX idx_employees_salary ON employees(salary);

-- Partial index — only index relevant rows
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Covering index — include extra columns to avoid heap lookups
CREATE INDEX idx_employees_dept_salary ON employees(department_id, salary);

-- GIN index — for JSONB, arrays, full-text search
CREATE INDEX idx_products_data ON products USING GIN(data);`}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 bg-cream-dark rounded-xl border border-border">
                <h4 className="text-sm font-semibold text-text mb-2">When to index</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Columns in WHERE clauses (highly selective)</li>
                  <li>• JOIN columns (foreign keys)</li>
                  <li>• ORDER BY columns</li>
                  <li>• Columns used in MIN/MAX</li>
                </ul>
              </div>
              <div className="p-4 bg-cream-dark rounded-xl border border-border">
                <h4 className="text-sm font-semibold text-text mb-2">When NOT to index</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Small tables (full scan is faster)</li>
                  <li>• Columns rarely queried</li>
                  <li>• High-write tables (index maintenance cost)</li>
                  <li>• Low-cardinality columns (boolean, status)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">How CREATE INDEX Works (B-tree Construction)</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            When you run CREATE INDEX, PostgreSQL doesn&apos;t just &quot;add an index&quot; — it builds a balanced B-tree from scratch.
            Watch the step-by-step process below to see how raw table data becomes a search tree.
          </p>
          <CreateIndexEngine />
        </section>

        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">Performance Basics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-text mb-2">1. Use EXPLAIN ANALYZE</h3>
              <p className="text-sm text-text-secondary">Never guess — measure. Prefix any slow query with EXPLAIN ANALYZE to see the actual plan.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text mb-2">2. Avoid SELECT *</h3>
              <p className="text-sm text-text-secondary">Only fetch the columns you need. This reduces I/O and allows index-only scans.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text mb-2">3. Use connection pooling</h3>
              <p className="text-sm text-text-secondary">PostgreSQL forks a process per connection. Use PgBouncer for high-concurrency applications.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text mb-2">4. Vacuum regularly</h3>
              <p className="text-sm text-text-secondary">PostgreSQL uses MVCC — deleted/updated rows create dead tuples. Autovacuum handles this, but monitor it.</p>
            </div>
          </div>
        </section>

        <section className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-3">PostgreSQL vs MySQL</h2>
          <div className="space-y-3">
            {[
              ['JSONB', 'PostgreSQL has native JSONB with GIN indexes. MySQL has JSON but fewer indexing options.'],
              ['Window Functions', 'PostgreSQL has the most complete implementation. MySQL added them in 8.0.'],
              ['CTEs', 'Both support CTEs. PostgreSQL supports MATERIALIZED / NOT MATERIALIZED hints.'],
              ['Full-Text Search', 'PostgreSQL has built-in tsvector/tsquery. MySQL needs FULLTEXT indexes.'],
              ['Indexes', 'PostgreSQL offers GiST, GIN, BRIN, partial, and expression indexes. MySQL is limited to B-tree and Hash.'],
              ['Upsert', 'PostgreSQL: ON CONFLICT ... DO UPDATE. MySQL: ON DUPLICATE KEY UPDATE.'],
              ['Returning', 'PostgreSQL supports RETURNING clause. MySQL does not.'],
            ].map(([feature, diff]) => (
              <div key={feature as string} className="flex items-start gap-3 p-3 bg-cream-dark rounded-xl border border-border">
                <span className="text-sm font-semibold text-text whitespace-nowrap min-w-[130px]">{feature as string}</span>
                <span className="text-sm text-text-secondary">{diff as string}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
