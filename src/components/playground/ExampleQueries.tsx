'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Example {
  label: string
  query: string
}

const categories: { name: string; examples: Example[] }[] = [
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
      { label: 'UNION customers & products', query: "SELECT name AS item, 'Employee' AS type FROM employees UNION ALL SELECT name, 'Product' AS type FROM products ORDER BY item LIMIT 20;" },
    ],
  },
]

interface ExampleQueriesProps {
  onSelect: (query: string) => void
}

export default function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('Basic')

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all"
      >
        <ChevronDown size={14} />
        Examples
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-[480px] bg-card border-2 border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="flex">
              <div className="w-32 border-r-2 border-border p-1 space-y-0.5 bg-cream-dark/50">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
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
              <div className="flex-1 p-2 space-y-0.5 max-h-64 overflow-y-auto">
                {categories
                  .find((c) => c.name === activeCategory)
                  ?.examples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => {
                        onSelect(ex.query)
                        setOpen(false)
                      }}
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
