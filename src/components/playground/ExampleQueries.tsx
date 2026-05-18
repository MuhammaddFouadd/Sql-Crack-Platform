'use client'

// ── Dropdown of curated SQL examples for the playground ──
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Example {
  label: string
  query: string
}

// E-commerce schema query examples (Basic, Aggregation, Joins, Insert, Update, Delete, Create, Window Functions, Set Operations)
const ecommerceExamples: { name: string; examples: Example[] }[] = [
  {
    name: 'Basic',
    examples: [
      { label: 'All employees', query: 'SELECT * FROM employees LIMIT 20;' },
      { label: 'Select columns with alias', query: "SELECT name AS employee_name, salary, department_id FROM employees LIMIT 10;" },
      { label: 'Filter with WHERE', query: "SELECT name, salary FROM employees WHERE salary > 80000 ORDER BY salary DESC;" },
      { label: 'Pattern matching', query: "SELECT name, email FROM employees WHERE email LIKE '%@company.com';" },
    ],
  },
  {
    name: 'Aggregation',
    examples: [
      { label: 'COUNT per department', query: "SELECT d.name AS department, COUNT(*) AS headcount FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name ORDER BY headcount DESC;" },
      { label: 'Average salary by dept', query: "SELECT d.name AS department, ROUND(AVG(e.salary), 2) AS avg_salary, ROUND(SUM(e.salary), 2) AS total_payroll FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name ORDER BY avg_salary DESC;" },
      { label: 'HAVING filter', query: "SELECT d.name AS department, COUNT(*) AS headcount, ROUND(AVG(e.salary), 2) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY d.name HAVING COUNT(*) >= 2 AND AVG(e.salary) > 70000;" },
    ],
  },
  {
    name: 'Joins',
    examples: [
      { label: 'INNER JOIN employees + dept', query: "SELECT e.name, e.salary, d.name AS department, d.budget FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY e.salary DESC LIMIT 10;" },
      { label: 'LEFT JOIN products + orders', query: "SELECT p.name AS product, p.category, p.price, o.customer_name, o.quantity, o.order_date FROM products p LEFT JOIN orders o ON p.id = o.product_id ORDER BY o.order_date DESC NULLS LAST;" },
      { label: 'Products never ordered', query: "SELECT p.name, p.category, p.price FROM products p LEFT JOIN orders o ON p.id = o.product_id WHERE o.id IS NULL;" },
    ],
  },
  {
    name: 'Insert',
    examples: [
      { label: 'Insert new department', query: "INSERT INTO departments (name, budget) VALUES ('Research', 350000);" },
      { label: 'Insert new product', query: "INSERT INTO products (name, category, price, stock) VALUES ('Wireless Keyboard', 'Electronics', 79.99, 120);" },
      { label: 'Insert with all columns', query: "INSERT INTO employees VALUES (11, 'Zara Khan', 'zara@company.com', 78000, 2, '2024-06-01');" },
    ],
  },
  {
    name: 'Update',
    examples: [
      { label: 'Raise salaries in Engineering', query: "UPDATE employees SET salary = salary * 1.1 WHERE department_id = 1;" },
      { label: 'Update product price', query: "UPDATE products SET price = 39.99 WHERE name = 'Wireless Mouse';" },
      { label: 'Reset all stock', query: "UPDATE products SET stock = stock + 50 WHERE category = 'Electronics';" },
    ],
  },
  {
    name: 'Delete',
    examples: [
      { label: 'Delete unstocked products', query: "DELETE FROM products WHERE stock = 0;" },
      { label: 'Delete by condition', query: "DELETE FROM orders WHERE order_date < '2024-01-01';" },
    ],
  },
  {
    name: 'Create',
    examples: [
      { label: 'Create temp table', query: "CREATE TABLE temp_stats AS SELECT department_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal FROM employees GROUP BY department_id;" },
      { label: 'Create view-like query', query: "CREATE VIEW high_earners AS SELECT name, salary, department_id FROM employees WHERE salary > 80000;" },
    ],
  },
  {
    name: 'Window Functions',
    examples: [
      { label: 'ROW_NUMBER per dept', query: "SELECT e.name, e.salary, d.name AS department, ROW_NUMBER() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS rank FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY department, rank;" },
      { label: 'Running total of orders', query: "SELECT order_date, customer_name, quantity, SUM(quantity) OVER (ORDER BY order_date) AS running_total FROM orders ORDER BY order_date;" },
      { label: 'Salary vs dept average', query: "SELECT e.name, e.salary, d.name AS department, ROUND(AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS dept_avg, ROUND(e.salary - AVG(e.salary) OVER (PARTITION BY e.department_id), 2) AS diff FROM employees e JOIN departments d ON e.department_id = d.id ORDER BY department, salary DESC;" },
    ],
  },
  {
    name: 'Set Operations',
    examples: [
      { label: 'UNION employees & products', query: "SELECT name AS item, 'Employee' AS type FROM employees UNION ALL SELECT name, 'Product' AS type FROM products ORDER BY item LIMIT 20;" },
    ],
  },
]

// Library schema query examples (Basic, Aggregation, Joins, Insert, Update, Delete, Create)
const libraryExamples: { name: string; examples: Example[] }[] = [
  {
    name: 'Basic',
    examples: [
      { label: 'All books', query: 'SELECT * FROM books LIMIT 20;' },
      { label: 'All members', query: 'SELECT * FROM members LIMIT 20;' },
      { label: 'Books with authors', query: "SELECT b.title, a.name AS author, b.genre FROM books b JOIN authors a ON b.author_id = a.id LIMIT 10;" },
    ],
  },
  {
    name: 'Aggregation',
    examples: [
      { label: 'Books per author', query: "SELECT a.name, COUNT(*) AS book_count FROM authors a JOIN books b ON a.id = b.author_id GROUP BY a.name ORDER BY book_count DESC;" },
      { label: 'Books per genre', query: "SELECT genre, COUNT(*) AS count, AVG(year) AS avg_year FROM books GROUP BY genre;" },
    ],
  },
  {
    name: 'Joins',
    examples: [
      { label: 'Books currently on loan', query: "SELECT b.title, m.name AS member, l.loan_date FROM loans l JOIN books b ON l.book_id = b.id JOIN members m ON l.member_id = m.id WHERE l.return_date IS NULL;" },
      { label: 'Members with no loans', query: "SELECT m.name, m.email FROM members m LEFT JOIN loans l ON m.id = l.member_id WHERE l.id IS NULL;" },
    ],
  },
  {
    name: 'Insert',
    examples: [
      { label: 'Add a new book', query: "INSERT INTO books (title, author_id, genre, year, copies) VALUES ('Dune', 1, 'Sci-Fi', 1965, 3);" },
      { label: 'Register new member', query: "INSERT INTO members (name, email, join_date) VALUES ('Olivia Green', 'olivia@email.com', '2024-06-01');" },
    ],
  },
  {
    name: 'Update',
    examples: [
      { label: 'Return a book', query: "UPDATE loans SET return_date = '2024-06-15' WHERE id = 2;" },
      { label: 'Add book copies', query: "UPDATE books SET copies = copies + 1 WHERE title LIKE '%Harry Potter%';" },
    ],
  },
  {
    name: 'Delete',
    examples: [
      { label: 'Remove old loans', query: "DELETE FROM loans WHERE return_date IS NOT NULL AND return_date < '2024-01-01';" },
    ],
  },
  {
    name: 'Create',
    examples: [
      { label: 'Create author stats', query: "CREATE VIEW author_stats AS SELECT a.name, COUNT(*) AS books_written FROM authors a JOIN books b ON a.id = b.author_id GROUP BY a.name;" },
    ],
  },
]

interface ExampleQueriesProps {
  onSelect: (query: string) => void
  schemaId: string
}

export default function ExampleQueries({ onSelect, schemaId }: ExampleQueriesProps) {
  const [open, setOpen] = useState(false) // Whether the dropdown is visible
  const [activeCategory, setActiveCategory] = useState('Basic') // Selected category tab

  // Pick the example set based on the active schema
  const categories = schemaId === 'library' ? libraryExamples : ecommerceExamples

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open examples"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all"
      >
        <ChevronDown size={14} />
        Examples
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-[520px] bg-card border-2 border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="flex">
              <div className="w-28 border-r-2 border-border p-1 space-y-0.5 bg-cream-dark/50">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    aria-label={`${cat.name} category`}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeCategory === cat.name
                        ? 'bg-card text-text shadow-sm border border-border'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-2 space-y-0.5 max-h-72 overflow-y-auto">
                {categories
                  .find((c) => c.name === activeCategory)
                  ?.examples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => {
                        onSelect(ex.query)
                        setOpen(false)
                      }}
                      aria-label={`Load ${ex.label} query`}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-text hover:bg-cream-dark transition-colors border border-transparent hover:border-border"
                    >
                      {ex.label}
                      <span className="block text-[10px] text-text-muted font-mono mt-0.5 truncate">
                        {ex.query.substring(0, 80)}...
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
