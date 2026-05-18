export interface LessonExample {
  title: string
  sql: string
  explanation: string
}

export interface PracticeQuestion {
  question: string
  hint: string
  solution: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  topics: string[]
  explanation: string
  syntax?: string
  examples: LessonExample[]
  commonMistakes: string[]
  practiceQuestions: PracticeQuestion[]
}

export const lessons: Lesson[] = [
  {
    id: 'select',
    title: 'SELECT',
    description: 'Retrieve data from tables with precise column selection',
    icon: '🔍',
    difficulty: 'beginner',
    prerequisites: [],
    topics: ['SELECT', 'FROM', 'AS', 'DISTINCT', 'LIMIT'],
    explanation: `SELECT is the most fundamental SQL operation. It retrieves rows and columns from a table.

The basic structure: SELECT columns FROM table.

You can select specific columns by name, use * for all columns, create aliases with AS, remove duplicates with DISTINCT, and limit results with LIMIT.`,
    syntax: `SELECT column1, column2, ...
FROM table_name;

-- Select all columns
SELECT * FROM table_name;

-- With alias
SELECT column AS alias FROM table_name;

-- Remove duplicates
SELECT DISTINCT column FROM table_name;

-- Limit results
SELECT column FROM table_name LIMIT n;`,
    examples: [
      {
        title: 'Basic SELECT',
        sql: `SELECT name, age, email
FROM users;`,
        explanation: 'Retrieves the name, age, and email columns for all rows in the users table.'
      },
      {
        title: 'SELECT with alias',
        sql: `SELECT 
  first_name || ' ' || last_name AS full_name,
  salary * 12 AS annual_salary
FROM employees;`,
        explanation: 'Concatenates first and last names into a full name, and calculates annual salary by multiplying monthly salary by 12.'
      },
      {
        title: 'DISTINCT and LIMIT',
        sql: `SELECT DISTINCT department
FROM employees
LIMIT 5;`,
        explanation: 'Returns up to 5 unique department names from the employees table.'
      }
    ],
    commonMistakes: [
      'Using SELECT * in production code (fetch unnecessary columns)',
      'Forgetting that SELECT without ORDER BY returns rows in unspecified order',
      'Using DISTINCT when GROUP BY would be more appropriate',
      'Confusing LIMIT with filtering logic'
    ],
    practiceQuestions: [
      {
        question: 'Write a query to select the first 10 distinct city names from the customers table, showing them as "city_name".',
        hint: 'Use DISTINCT, AS for the alias, and LIMIT 10.',
        solution: `SELECT DISTINCT city AS city_name
FROM customers
LIMIT 10;`
      },
      {
        question: 'Select product names and their prices, with the price displayed as "price_with_tax" (price * 1.1).',
        hint: 'Use arithmetic in the SELECT clause with an alias.',
        solution: `SELECT name, price * 1.1 AS price_with_tax
FROM products;`
      },
      {
        question: 'Challenge: From the employees table, write a query that returns the top 3 most common email domains and their count, sorted by count descending. Use SUBSTRING, INSTR, and GROUP BY.',
        hint: 'Use SUBSTRING(email, POSITION(\'@\' IN email) + 1) to extract the domain, then GROUP BY and COUNT with ORDER BY and LIMIT.',
        solution: `SELECT SUBSTRING(email, POSITION('@' IN email) + 1) AS domain,
  COUNT(*) AS count
FROM employees
GROUP BY domain
ORDER BY count DESC
LIMIT 3;`
      },
      {
        question: 'Challenge: Write a single query using the built-in data in the playground that shows each department name alongside its employee count, total salary budget, and average salary — but only for departments whose total salary exceeds $150,000. Name the columns clearly.',
        hint: 'JOIN employees to departments, use GROUP BY with COUNT, SUM, and AVG. Filter with HAVING SUM(e.salary) > 150000. Use ROUND on the average.',
        solution: `SELECT d.name AS department,
  COUNT(*) AS employee_count,
  ROUND(SUM(e.salary), 2) AS total_salary,
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name
HAVING SUM(e.salary) > 150000
ORDER BY total_salary DESC;`
      }
    ]
  },
  {
    id: 'where',
    title: 'WHERE',
    description: 'Filter rows based on conditions',
    icon: '🔎',
    difficulty: 'beginner',
    prerequisites: ['select'],
    topics: ['WHERE', 'AND', 'OR', 'IN', 'BETWEEN', 'LIKE', 'IS NULL'],
    explanation: `The WHERE clause filters rows based on specified conditions. Only rows that satisfy the condition are returned.

Key operators:
- Comparison: =, <>, <, >, <=, >=
- Logical: AND, OR, NOT
- Range: BETWEEN x AND y
- Set: IN (value1, value2, ...)
- Pattern: LIKE (with % and _ wildcards)
- NULL: IS NULL, IS NOT NULL`,
    syntax: `SELECT column1, column2
FROM table_name
WHERE condition;

-- Multiple conditions
SELECT * FROM products
WHERE price > 100
  AND category = 'Electronics';

-- Range check
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';

-- Pattern matching
SELECT * FROM users
WHERE email LIKE '%@gmail.com';

-- NULL check
SELECT * FROM employees
WHERE manager_id IS NULL;`,
    examples: [
      {
        title: 'Comparison and Logical Operators',
        sql: `SELECT name, salary, department
FROM employees
WHERE salary >= 50000
  AND department IN ('Engineering', 'Product')
  AND status != 'inactive';`,
        explanation: 'Finds active employees in Engineering or Product departments earning $50k or more.'
      },
      {
        title: 'Pattern Matching with LIKE',
        sql: `SELECT title, isbn
FROM books
WHERE title LIKE 'The %'
   OR title LIKE '%SQL%';`,
        explanation: 'Finds books starting with "The " or containing "SQL" anywhere in the title.'
      },
      {
        title: 'Date Ranges and NULLs',
        sql: `SELECT order_id, customer_id, shipped_date
FROM orders
WHERE order_date >= '2024-01-01'
  AND shipped_date IS NULL;`,
        explanation: 'Finds orders placed in 2024 that have not yet been shipped.'
      }
    ],
    commonMistakes: [
      'Using = instead of IS NULL to check for NULL values',
      'Forgetting that NULL comparisons with = always return false (even NULL = NULL)',
      'Using OR without parentheses when mixing with AND (AND binds tighter)',
      'Using LIKE without wildcards (equivalent to =)'
    ],
    practiceQuestions: [
      {
        question: 'Find all products that cost between $10 and $50, are in category "Books" or "Music", and have stock quantity greater than 0.',
        hint: 'Combine BETWEEN, IN, AND, and comparison operators.',
        solution: `SELECT *
FROM products
WHERE price BETWEEN 10 AND 50
  AND category IN ('Books', 'Music')
  AND stock_quantity > 0;`
      },
      {
        question: 'Find customers whose email ends with @company.com and who have a phone number on file (not NULL).',
        hint: 'Use LIKE with a pattern and IS NOT NULL.',
        solution: `SELECT name, email, phone
FROM customers
WHERE email LIKE '%@company.com'
  AND phone IS NOT NULL;`
      },
      {
        question: 'Challenge: From the products table, find all products where the name contains at least two spaces (i.e., has three or more words) AND the price is either under $20 or over $500. Order by price descending.',
        hint: 'Use LIKE with two wildcards to match two spaces. Combine with OR for the price condition. Parentheses matter for mixing AND with OR.',
        solution: `SELECT name, price, category
FROM products
WHERE name LIKE '% % %'
  AND (price < 20 OR price > 500)
ORDER BY price DESC;`
      },
      {
        question: 'Challenge: Write a query that finds all employees whose name starts with a vowel (A, E, I, O, U) and whose salary is between $60,000 and $90,000. Use the employees table in the playground.',
        hint: 'Check multiple LIKE patterns OR\'d together for each starting vowel: name LIKE \'A%\' OR name LIKE \'E%\' etc. Combine with salary BETWEEN.',
        solution: `SELECT name, salary, department_id
FROM employees
WHERE (name LIKE 'A%' OR name LIKE 'E%' OR name LIKE 'I%' OR name LIKE 'O%' OR name LIKE 'U%')
  AND salary BETWEEN 60000 AND 90000
ORDER BY salary DESC;`
      }
    ]
  },
  {
    id: 'order-by',
    title: 'ORDER BY',
    description: 'Sort query results in ascending or descending order',
    icon: '📊',
    difficulty: 'beginner',
    prerequisites: ['select'],
    topics: ['ORDER BY', 'ASC', 'DESC', 'multiple columns'],
    explanation: `ORDER BY sorts the result set. You can sort by one or more columns, in ascending (ASC, default) or descending (DESC) order.

Sorting applies after filtering (WHERE) but before limiting (LIMIT).

NULL values sort last by default in PostgreSQL (NULLS LAST), first in some other databases.`,
    syntax: `SELECT column1, column2
FROM table_name
ORDER BY column1 ASC, column2 DESC;

-- Sort by computed value
SELECT name, price * quantity AS total
FROM orders
ORDER BY total DESC;

-- Sort by column position
SELECT name, salary, department
FROM employees
ORDER BY 3, 2 DESC;

-- Control NULL placement
SELECT name, email
FROM users
ORDER BY email ASC NULLS LAST;`,
    examples: [
      {
        title: 'Basic Sorting',
        sql: `SELECT name, salary, department
FROM employees
ORDER BY salary DESC
LIMIT 10;`,
        explanation: 'Returns the 10 highest-paid employees.'
      },
      {
        title: 'Multi-Column Sort',
        sql: `SELECT department, name, salary
FROM employees
ORDER BY department ASC, salary DESC;`,
        explanation: 'Groups employees by department (alphabetically), then within each department sorts by salary from highest to lowest.'
      },
      {
        title: 'Sort by Expression',
        sql: `SELECT 
  name, 
  price, 
  discount,
  price * (1 - discount/100.0) AS final_price
FROM products
WHERE discount > 0
ORDER BY final_price ASC;`,
        explanation: 'Calculates discounted price and sorts products by the final price.'
      }
    ],
    commonMistakes: [
      'Assuming ORDER BY guarantees row order across queries without specifying all tie-breaking columns',
      'Forgetting that ORDER BY is evaluated after SELECT, so you can sort by aliases',
      'Not considering that sorting large datasets is expensive (use indexes)',
      'Using ORDER BY on text columns without considering case sensitivity'
    ],
    practiceQuestions: [
      {
        question: 'List the top 5 most expensive products in the "Electronics" category, from highest to lowest price.',
        hint: 'Use WHERE to filter category, ORDER BY price DESC, and LIMIT 5.',
        solution: `SELECT name, price
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC
LIMIT 5;`
      },
      {
        question: 'Show all employees sorted by department alphabetically, then by hire date with most recent first.',
        hint: 'Use ORDER BY with two columns.',
        solution: `SELECT name, department, hire_date
FROM employees
ORDER BY department ASC, hire_date DESC;`
      },
      {
        question: 'Challenge: From the products table, write a query that shows the category, the most expensive product name in that category, and its price. Sort by category alphabetically. (Hint: you need a subquery or a window function.)',
        hint: 'Use a CTE with ROW_NUMBER() PARTITION BY category ORDER BY price DESC, then filter rank = 1.',
        solution: `WITH ranked AS (
  SELECT category, name, price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM products
)
SELECT category, name AS most_expensive_product, price
FROM ranked
WHERE rn = 1
ORDER BY category;`
      },
      {
        question: 'Challenge: Write a query that lists employees ordered by hire_date within each department (newest first), but with a twist — all Engineering employees should appear first, then the rest. Within Engineering, order by hire_date DESC. Outside Engineering, order by hire_date ASC.',
        hint: 'Use ORDER BY with a CASE expression: CASE WHEN department_id = 1 THEN 0 ELSE 1 END, then DESC or ASC for hire_date.',
        solution: `SELECT e.name, d.name AS department, e.hire_date
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY
  CASE WHEN d.name = 'Engineering' THEN 0 ELSE 1 END,
  CASE WHEN d.name = 'Engineering' THEN e.hire_date END DESC,
  CASE WHEN d.name != 'Engineering' THEN e.hire_date END ASC;`
      }
    ]
  },
  {
    id: 'group-by',
    title: 'GROUP BY',
    description: 'Group rows and apply aggregate functions',
    icon: '📦',
    difficulty: 'beginner',
    prerequisites: ['select', 'where'],
    topics: ['GROUP BY', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'],
    explanation: `GROUP BY groups rows that have the same values in specified columns into summary rows.

It is used with aggregate functions (COUNT, SUM, AVG, MIN, MAX) to produce summary statistics for each group.

Every column in SELECT must either be in GROUP BY or be wrapped in an aggregate function.`,
    syntax: `SELECT column, AGGREGATE_FUNC(column)
FROM table_name
WHERE condition
GROUP BY column;

-- Multiple columns
SELECT department, status, COUNT(*) AS count
FROM employees
GROUP BY department, status;

-- Common aggregates
SELECT 
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price,
  MAX(price) AS max_price,
  SUM(stock) AS total_stock
FROM products
GROUP BY category;`,
    examples: [
      {
        title: 'Count per Group',
        sql: `SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
ORDER BY employee_count DESC;`,
        explanation: 'Counts how many employees are in each department, sorted from largest to smallest.'
      },
      {
        title: 'Multiple Aggregates',
        sql: `SELECT 
  category,
  COUNT(*) AS num_products,
  ROUND(AVG(price), 2) AS avg_price,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive
FROM products
GROUP BY category;`,
        explanation: 'For each product category, shows the number of products, average price, cheapest, and most expensive product.'
      },
      {
        title: 'GROUP BY with FILTERing',
        sql: `SELECT 
  department,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE salary > 100000) AS high_earners,
  AVG(salary) FILTER (WHERE status = 'active') AS avg_active_salary
FROM employees
GROUP BY department;`,
        explanation: 'Uses FILTER clauses to compute multiple conditional aggregates in a single query.'
      }
    ],
    commonMistakes: [
      'Forgetting that all non-aggregate columns in SELECT must be in GROUP BY',
      'Using WHERE instead of HAVING to filter groups (WHERE filters rows before grouping)',
      'Assuming GROUP BY guarantees ordering (it does not — use ORDER BY)',
      'Not using ROUND() on averages, leading to many decimal places'
    ],
    practiceQuestions: [
      {
        question: 'For each product category, show the total revenue (sum of price * units_sold) and the number of products. Only include categories with at least 5 products.',
        hint: 'Use GROUP BY with SUM() and COUNT(), then HAVING for the filter. But wait — this needs HAVING. If you don\'t know HAVING yet, you can first get categories with >= 5 products.',
        solution: `SELECT 
  category,
  SUM(price * units_sold) AS total_revenue,
  COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING COUNT(*) >= 5
ORDER BY total_revenue DESC;`
      },
      {
        question: 'Find the average salary per department, but only for active employees.',
        hint: 'Use WHERE to filter active employees before GROUP BY.',
        solution: `SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
WHERE status = 'active'
GROUP BY department
ORDER BY avg_salary DESC;`
      },
      {
        question: 'Challenge: Write a query that shows for each department: the department name, total number of employees, and the salary range (max - min). Only include departments where the salary range is greater than $30,000. Sort by salary range descending.',
        hint: 'JOIN employees to departments, GROUP BY department, use COUNT, MAX, MIN in SELECT. Filter with HAVING MAX(salary) - MIN(salary) > 30000.',
        solution: `SELECT d.name AS department,
  COUNT(*) AS total_employees,
  MAX(e.salary) - MIN(e.salary) AS salary_range
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name
HAVING MAX(e.salary) - MIN(e.salary) > 30000
ORDER BY salary_range DESC;`
      },
      {
        question: 'Challenge: From the orders and products tables, find the customer who spent the most money total (price * quantity per order). Show their name, total spent, and number of orders placed.',
        hint: 'JOIN orders to products, calculate SUM(price * quantity) as total_spent. Use GROUP BY customer_name with SUM and COUNT. ORDER BY total_spent DESC LIMIT 1.',
        solution: `SELECT o.customer_name,
  ROUND(SUM(p.price * o.quantity), 2) AS total_spent,
  COUNT(*) AS order_count
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY o.customer_name
ORDER BY total_spent DESC
LIMIT 1;`
      }
    ]
  },
  {
    id: 'having',
    title: 'HAVING',
    description: 'Filter groups after aggregation',
    icon: '🔬',
    difficulty: 'beginner',
    prerequisites: ['group-by'],
    topics: ['HAVING', 'filtering groups'],
    explanation: `HAVING filters groups created by GROUP BY, similar to how WHERE filters individual rows.

The key difference: WHERE filters BEFORE grouping, HAVING filters AFTER grouping.

HAVING can reference aggregate functions (COUNT, SUM, AVG, etc.), which WHERE cannot.`,
    syntax: `SELECT column, AGGREGATE_FUNC(column)
FROM table_name
WHERE condition
GROUP BY column
HAVING aggregate_condition;

-- Example
SELECT department, COUNT(*) AS count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;

-- HAVING with multiple aggregates
SELECT 
  customer_id,
  COUNT(*) AS order_count,
  SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 3 AND SUM(amount) > 1000;`,
    examples: [
      {
        title: 'Filter Groups by Count',
        sql: `SELECT department, COUNT(*) AS headcount
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING COUNT(*) >= 5
ORDER BY headcount DESC;`,
        explanation: 'Shows departments with 5 or more active employees. WHERE filters to active employees first, GROUP BY creates department groups, and HAVING filters to departments with 5+ members.'
      },
      {
        title: 'Average with Threshold',
        sql: `SELECT 
  category,
  AVG(price) AS avg_price,
  COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING AVG(price) > 50 AND COUNT(*) >= 3;`,
        explanation: 'Finds categories where the average product price exceeds $50 and there are at least 3 products.'
      },
      {
        title: 'Customer Analysis',
        sql: `SELECT 
  customer_id,
  COUNT(*) AS num_orders,
  SUM(total) AS lifetime_value
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY customer_id
HAVING SUM(total) > 500
ORDER BY lifetime_value DESC
LIMIT 10;`,
        explanation: 'Top 10 customers by lifetime value who spent over $500 in orders placed during 2024.'
      }
    ],
    commonMistakes: [
      'Using HAVING without GROUP BY (possible but usually wrong)',
      'Using WHERE instead of HAVING to filter aggregate results',
      'Using HAVING for conditions that could be WHERE (inefficient — WHERE filters before aggregation)',
      'Forgetting that HAVING cannot use column aliases from SELECT in some databases'
    ],
    practiceQuestions: [
      {
        question: 'Find departments where the average salary is above $60,000 and there are more than 3 employees.',
        hint: 'GROUP BY department, use AVG(salary) and COUNT(*) in HAVING.',
        solution: `SELECT department, 
  COUNT(*) AS headcount,
  ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 60000 AND COUNT(*) > 3
ORDER BY avg_salary DESC;`
      },
      {
        question: 'Show product categories where the total stock value (SUM of price * stock_quantity) exceeds $10,000.',
        hint: 'Use GROUP BY with SUM in HAVING.',
        solution: `SELECT category, 
  SUM(price * stock_quantity) AS total_stock_value
FROM products
GROUP BY category
HAVING SUM(price * stock_quantity) > 10000
ORDER BY total_stock_value DESC;`
      },
      {
        question: 'Challenge: Find departments where the average salary is more than double the average salary of another department. Show both department names and their average salaries.',
        hint: 'This requires a self-join of two aggregate subqueries: first compute avg_salary per department, then CROSS JOIN to compare each pair. Filter where one is more than double the other.',
        solution: `WITH dept_avg AS (
  SELECT d.name, AVG(e.salary) AS avg_sal
  FROM employees e
  JOIN departments d ON e.department_id = d.id
  GROUP BY d.name
)
SELECT a.name AS dept_a,
  ROUND(a.avg_sal, 2) AS avg_salary_a,
  b.name AS dept_b,
  ROUND(b.avg_sal, 2) AS avg_salary_b
FROM dept_avg a
CROSS JOIN dept_avg b
WHERE a.avg_sal > b.avg_sal * 2
ORDER BY a.avg_sal DESC;`
      },
      {
        question: 'Challenge: Write a query that returns the percentage contribution of each product category to total stock value (price × stock). Show category, total_value, and percentage rounded to 2 decimal places.',
        hint: 'First compute total_value per category with GROUP BY and SUM. Then compute the grand total in a subquery or CROSS JOIN. The percentage is category_total / grand_total * 100.',
        solution: `WITH category_totals AS (
  SELECT category,
    ROUND(SUM(price * stock), 2) AS total_value
  FROM products
  GROUP BY category
),
grand_total AS (
  SELECT SUM(total_value) AS all_total
  FROM category_totals
)
SELECT ct.category, ct.total_value,
  ROUND(ct.total_value * 100.0 / gt.all_total, 2) AS percentage
FROM category_totals ct
CROSS JOIN grand_total gt
ORDER BY percentage DESC;`
      }
    ]
  },
  {
    id: 'joins',
    title: 'Joins',
    description: 'Combine data from multiple tables',
    icon: '🔗',
    difficulty: 'intermediate',
    prerequisites: ['where', 'select'],
    topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'SELF JOIN'],
    explanation: `Joins combine rows from two or more tables based on a related column between them.

INNER JOIN: Returns only rows with matching values in both tables.
LEFT JOIN: Returns all rows from the left table, matching rows from the right (NULL for no match).
RIGHT JOIN: Returns all rows from the right table, matching rows from the left.
FULL JOIN: Returns all rows when there is a match in either table.
CROSS JOIN: Cartesian product of all rows.`,
    syntax: `-- INNER JOIN
SELECT a.col, b.col
FROM table_a a
JOIN table_b b ON a.id = b.a_id;

-- LEFT JOIN
SELECT a.col, b.col
FROM table_a a
LEFT JOIN table_b b ON a.id = b.a_id;

-- SELF JOIN
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Multiple JOINs
SELECT o.id, c.name, p.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;`,
    examples: [
      {
        title: 'INNER JOIN',
        sql: `SELECT 
  o.id AS order_id,
  c.name AS customer_name,
  o.total
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.total DESC
LIMIT 10;`,
        explanation: 'Top 10 orders with customer names. Only orders with valid customer IDs are included.'
      },
      {
        title: 'LEFT JOIN with NULL Check',
        sql: `SELECT 
  p.name AS product_name,
  oi.order_id
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.order_id IS NULL;`,
        explanation: 'Finds products that have never been ordered. Products without any order_items will have NULL for order_id.'
      },
      {
        title: 'Multiple Joins',
        sql: `SELECT 
  u.name AS user_name,
  p.title AS post_title,
  c.body AS comment_body
FROM users u
JOIN posts p ON u.id = p.author_id
LEFT JOIN comments c ON p.id = c.post_id
ORDER BY u.name, p.title;`,
        explanation: 'Shows all users with their posts and any comments on those posts. Users without posts are excluded (JOIN), but posts without comments still appear (LEFT JOIN).'
      }
    ],
    commonMistakes: [
      'Forgetting the JOIN condition (creates a Cartesian product — CROSS JOIN)',
      'Using LEFT JOIN when INNER JOIN is sufficient (worse performance, unexpected NULLs)',
      'Not qualifying column names when both tables have the same column name',
      'Confusing ON clause filtering with WHERE clause filtering in outer joins'
    ],
    practiceQuestions: [
      {
        question: 'List all customers and their most recent order date. Include customers who have never placed an order (they should show NULL for the date).',
        hint: 'Use LEFT JOIN from customers to orders with GROUP BY and MAX.',
        solution: `SELECT 
  c.id,
  c.name,
  MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY last_order_date DESC NULLS LAST;`
      },
      {
        question: 'Find employees who earn more than their managers. Show employee name, employee salary, manager name, and manager salary.',
        hint: 'Use a SELF JOIN on the employees table.',
        solution: `SELECT 
  e.name AS employee_name,
  e.salary AS employee_salary,
  m.name AS manager_name,
  m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;`
      },
      {
        question: 'Challenge: Find products that have been ordered by EVERY customer who has placed an order. In other words, find products that appear in at least one order from each customer. (This is a relational division problem.)',
        hint: 'First find the total distinct customer count. Then GROUP BY product_id and count distinct customers who ordered it. Use HAVING to keep only products where that count equals the total customer count.',
        solution: `WITH total_customers AS (
  SELECT COUNT(DISTINCT customer_name) AS cnt FROM orders
)
SELECT p.name, p.category
FROM products p
JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name, p.category
HAVING COUNT(DISTINCT o.customer_name) = (SELECT cnt FROM total_customers);`
      },
      {
        question: 'Challenge: Write a query that finds employees whose salary is above the average salary of employees hired in the same year as them. Show name, salary, hire_year, and their year-group average.',
        hint: 'Use a correlated subquery: SELECT AVG(salary) FROM employees WHERE strftime(\'%Y\', hire_date) = strftime(\'%Y\', outer.hire_date). In the outer query, compare salary to this subquery result.',
        solution: `SELECT e1.name, e1.salary,
  strftime('%Y', e1.hire_date) AS hire_year,
  ROUND((SELECT AVG(e2.salary) FROM employees e2
   WHERE strftime('%Y', e2.hire_date) = strftime('%Y', e1.hire_date)), 2) AS year_avg
FROM employees e1
WHERE e1.salary > (
  SELECT AVG(e2.salary) FROM employees e2
  WHERE strftime('%Y', e2.hire_date) = strftime('%Y', e1.hire_date)
)
ORDER BY hire_year, e1.salary DESC;`
      }
    ]
  },
  {
    id: 'subqueries',
    title: 'Subqueries',
    description: 'Nest queries within queries for powerful data retrieval',
    icon: '🪆',
    difficulty: 'intermediate',
    prerequisites: ['where', 'select', 'group-by'],
    topics: ['scalar subquery', 'correlated subquery', 'EXISTS', 'IN', 'ANY', 'ALL'],
    explanation: `A subquery is a query nested inside another query. Subqueries can be used in SELECT, FROM, WHERE, and HAVING clauses.

Types:
- Scalar subquery: Returns a single value (one row, one column)
- Row subquery: Returns a single row
- Table subquery: Returns a table (used in FROM)
- Correlated subquery: References columns from the outer query

EXISTS is typically more efficient than IN for large result sets.`,
    syntax: `-- Scalar subquery in SELECT
SELECT 
  name,
  salary,
  (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;

-- Subquery in WHERE with IN
SELECT name, department
FROM employees
WHERE department_id IN (
  SELECT id FROM departments 
  WHERE budget > 100000
);

-- Correlated subquery with EXISTS
SELECT name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.employee_id = e.id
    AND o.total > 10000
);

-- Subquery in FROM (derived table)
SELECT dept, avg_salary
FROM (
  SELECT department AS dept, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department
) sub
WHERE avg_salary > 60000;`,
    examples: [
      {
        title: 'Scalar Subquery',
        sql: `SELECT 
  name,
  salary,
  (SELECT MAX(salary) FROM employees) AS max_salary,
  ROUND(100.0 * salary / (SELECT AVG(salary) FROM employees), 1) AS pct_of_avg
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`,
        explanation: 'Shows employees earning above average, with their salary compared to the company max and average.'
      },
      {
        title: 'EXISTS Correlated Subquery',
        sql: `SELECT c.name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id
    AND o.total > 500
)
AND NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'refunded'
);`,
        explanation: 'Finds customers who have placed an order over $500 but have never had a refund.'
      },
      {
        title: 'Subquery in FROM',
        sql: `SELECT 
  department,
  avg_salary,
  employee_count
FROM (
  SELECT 
    department,
    AVG(salary) AS avg_salary,
    COUNT(*) AS employee_count
  FROM employees
  GROUP BY department
) dept_stats
WHERE employee_count >= 5
ORDER BY avg_salary DESC;`,
        explanation: 'First computes department statistics in a subquery, then filters and sorts the results.'
      }
    ],
    commonMistakes: [
      'Using IN with a subquery that returns NULLs (IN becomes UNKNOWN for NULL comparisons)',
      'Writing correlated subqueries that execute row-by-row (performance killer)',
      'Forgetting to alias subqueries in FROM clause',
      'Using a subquery where a JOIN would be more efficient and readable'
    ],
    practiceQuestions: [
      {
        question: 'Find employees whose salary is above the average salary of their own department.',
        hint: 'Use a correlated subquery in the WHERE clause that references the outer employee\'s department.',
        solution: `SELECT name, salary, department
FROM employees e
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department = e.department
)
ORDER BY department, salary DESC;`
      },
      {
        question: 'Find departments that have no employees assigned.',
        hint: 'Use NOT EXISTS with a correlated subquery.',
        solution: `SELECT d.name, d.id
FROM departments d
WHERE NOT EXISTS (
  SELECT 1 FROM employees e
  WHERE e.department_id = d.id
);`
      },
      {
        question: 'Challenge: From the products table, find the category that has the largest gap between its most expensive and least expensive product. Show the category, min price, max price, and the gap. Do not use a subquery.',
        hint: 'Use GROUP BY category with MIN(price), MAX(price), and compute MAX(price) - MIN(price) directly. Use ORDER BY with LIMIT 1.',
        solution: `SELECT category,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive,
  MAX(price) - MIN(price) AS price_gap
FROM products
GROUP BY category
ORDER BY price_gap DESC
LIMIT 1;`
      },
      {
        question: 'Challenge: Write a query to find the employee who earns the closest to the company average salary (absolute difference). Show their name, salary, the average, and the difference.',
        hint: 'Compute ABS(salary - (SELECT AVG(salary) FROM employees)) in SELECT. Use ORDER BY that expression. LIMIT 1. Use a CTE or duplicate the subquery.',
        solution: `SELECT name, salary,
  ROUND((SELECT AVG(salary) FROM employees), 2) AS company_avg,
  ROUND(ABS(salary - (SELECT AVG(salary) FROM employees)), 2) AS diff_from_avg
FROM employees
ORDER BY ABS(salary - (SELECT AVG(salary) FROM employees))
LIMIT 1;`
      }
    ]
  },
  {
    id: 'case-when',
    title: 'CASE WHEN',
    description: 'Conditional logic and value mapping in SQL queries',
    icon: '🔄',
    difficulty: 'intermediate',
    prerequisites: ['select', 'where'],
    topics: ['CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'conditional aggregation'],
    explanation: `CASE WHEN is SQL's version of if-then-else logic. It evaluates conditions sequentially and returns a value when the first condition is true.

Two forms:
- Simple CASE: Compares one expression to multiple values
- Searched CASE: Evaluates multiple boolean conditions

CASE can be used in SELECT, WHERE, ORDER BY, and GROUP BY.`,
    syntax: `-- Searched CASE (most common)
SELECT 
  name,
  CASE 
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    ELSE 'F'
  END AS grade
FROM students;

-- Simple CASE
SELECT 
  name,
  CASE status
    WHEN 'active' THEN 'Current'
    WHEN 'inactive' THEN 'Former'
    ELSE 'Unknown'
  END AS status_label
FROM users;

-- CASE in ORDER BY
SELECT name, status, priority
FROM tickets
ORDER BY 
  CASE status
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    ELSE 3
  END;`,
    examples: [
      {
        title: 'Value Categorization',
        sql: `SELECT 
  name,
  salary,
  CASE 
    WHEN salary < 30000 THEN 'Entry Level'
    WHEN salary BETWEEN 30000 AND 60000 THEN 'Mid Level'
    WHEN salary BETWEEN 60001 AND 100000 THEN 'Senior'
    ELSE 'Executive'
  END AS level
FROM employees
ORDER BY salary;`,
        explanation: 'Categorizes employees into salary bands with readable level names.'
      },
      {
        title: 'Conditional Aggregation (Pivot)',
        sql: `SELECT 
  department,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE salary >= 100000) AS exec_count,
  SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_count,
  SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_count
FROM employees
GROUP BY department;`,
        explanation: 'Pivots gender data into separate columns per department using conditional aggregation.'
      },
      {
        title: 'CASE in ORDER BY for Custom Sorting',
        sql: `SELECT task_id, title, priority
FROM tasks
WHERE status = 'pending'
ORDER BY 
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    ELSE 5
  END, due_date ASC;`,
        explanation: 'Sorts pending tasks by a custom priority order (not alphabetical), then by due date.'
      }
    ],
    commonMistakes: [
      'Forgetting the END keyword',
      'Using CASE WHEN with overlapping conditions (first match wins, so order matters)',
      'Not including an ELSE clause (returns NULL for unmatched values)',
      'Putting aggregate functions inside CASE without GROUP BY'
    ],
    practiceQuestions: [
      {
        question: 'Categorize orders into "Small" (< $50), "Medium" ($50-$200), or "Large" (> $200). Show the count in each category.',
        hint: 'Use CASE in GROUP BY or use conditional aggregation.',
        solution: `SELECT 
  CASE 
    WHEN total < 50 THEN 'Small'
    WHEN total <= 200 THEN 'Medium'
    ELSE 'Large'
  END AS order_size,
  COUNT(*) AS order_count
FROM orders
GROUP BY order_size
ORDER BY order_count DESC;`
      },
      {
        question: 'Show each employee with a bonus column: 20% of salary if they are in Engineering, 10% if in Sales, otherwise 5%.',
        hint: 'Use CASE in SELECT to calculate the bonus percentage.',
        solution: `SELECT 
  name,
  salary,
  department,
  CASE department
    WHEN 'Engineering' THEN salary * 0.20
    WHEN 'Sales' THEN salary * 0.10
    ELSE salary * 0.05
  END AS bonus
FROM employees;`
      },
      {
        question: 'Challenge: Write a query that categorizes each employee into a performance band based on their salary relative to their department average: "Above Avg" (salary > dept avg), "At Avg" (salary = dept avg), or "Below Avg" (salary < dept avg). Show name, department, salary, dept_avg, and band. Use a window function inside a CTE.',
        hint: 'First compute AVG(salary) OVER (PARTITION BY department_id) in a CTE. Then SELECT from the CTE with a CASE expression to determine the band.',
        solution: `WITH dept_data AS (
  SELECT e.name, e.salary, d.name AS department,
    AVG(e.salary) OVER (PARTITION BY e.department_id) AS dept_avg
  FROM employees e
  JOIN departments d ON e.department_id = d.id
)
SELECT name, department, salary,
  ROUND(dept_avg, 2) AS dept_avg_salary,
  CASE
    WHEN salary > dept_avg THEN 'Above Avg'
    WHEN salary = dept_avg THEN 'At Avg'
    ELSE 'Below Avg'
  END AS band
FROM dept_data
ORDER BY department, salary DESC;`
      },
      {
        question: 'Challenge: The products table has categories with varying numbers of products. Write a query that flags products as "Underpriced" if their price is less than 50% of the average price in their category, "Overpriced" if more than 150%, and "Standard" otherwise.',
        hint: 'Use AVG(price) OVER (PARTITION BY category) in a CTE. Then CASE WHEN price < 0.5 * cat_avg THEN ... WHEN price > 1.5 * cat_avg THEN ...',
        solution: `WITH category_pricing AS (
  SELECT name, category, price,
    AVG(price) OVER (PARTITION BY category) AS cat_avg
  FROM products
)
SELECT name, category, price,
  ROUND(cat_avg, 2) AS category_avg,
  CASE
    WHEN price < 0.5 * cat_avg THEN 'Underpriced'
    WHEN price > 1.5 * cat_avg THEN 'Overpriced'
    ELSE 'Standard'
  END AS price_band
FROM category_pricing
ORDER BY category, price DESC;`
      }
    ]
  },
  {
    id: 'cte',
    title: 'CTE (Common Table Expressions)',
    description: 'Write readable, reusable named subqueries with WITH',
    icon: '📋',
    difficulty: 'intermediate',
    prerequisites: ['subqueries', 'select'],
    topics: ['WITH', 'CTE', 'readability', 'multiple CTEs'],
    explanation: `A CTE (Common Table Expression) is a named temporary result set that you can reference within a query. Defined using the WITH keyword.

CTEs make complex queries more readable by breaking them into logical steps. Unlike subqueries, you can reference a CTE multiple times in the same query.

CTEs are not materialized by default in PostgreSQL — they act like views that exist only for the duration of the query.`,
    syntax: `-- Basic CTE
WITH sales_summary AS (
  SELECT 
    employee_id,
    SUM(amount) AS total_sales
  FROM sales
  WHERE sale_date >= '2024-01-01'
  GROUP BY employee_id
)
SELECT e.name, s.total_sales
FROM employees e
JOIN sales_summary s ON e.id = s.employee_id;

-- Multiple CTEs
WITH 
dept_stats AS (
  SELECT department_id, AVG(salary) AS avg_sal
  FROM employees GROUP BY department_id
),
high_depts AS (
  SELECT department_id FROM dept_stats
  WHERE avg_sal > 80000
)
SELECT d.name, ds.avg_sal
FROM departments d
JOIN dept_stats ds ON d.id = ds.department_id
WHERE d.id IN (SELECT department_id FROM high_depts);`,
    examples: [
      {
        title: 'CTE for Readability',
        sql: `WITH 
high_value_customers AS (
  SELECT customer_id, SUM(total) AS lifetime_value
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total) > 10000
),
recent_orders AS (
  SELECT customer_id, COUNT(*) AS orders_2024
  FROM orders
  WHERE order_date >= '2024-01-01'
  GROUP BY customer_id
)
SELECT 
  c.name,
  hvc.lifetime_value,
  COALESCE(ro.orders_2024, 0) AS orders_2024
FROM customers c
JOIN high_value_customers hvc ON c.id = hvc.customer_id
LEFT JOIN recent_orders ro ON c.id = ro.customer_id
ORDER BY hvc.lifetime_value DESC;`,
        explanation: 'Breaks a complex analytics query into two CTEs: one for high-value customers and one for their 2024 order counts.'
      },
      {
        title: 'Recursive CTE (Hierarchy)',
        sql: `WITH RECURSIVE org_tree AS (
  -- Base case: top-level managers
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive step: direct reports
  SELECT e.id, e.name, e.manager_id, t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id
)
SELECT name, level
FROM org_tree
ORDER BY level, name;`,
        explanation: 'Traverses the employee hierarchy from top to bottom, showing each employee\'s level in the org tree.'
      }
    ],
    commonMistakes: [
      'Forgetting the RECURSIVE keyword for recursive CTEs',
      'Creating cycles in recursive CTEs (infinite loop)',
      'Using CTE when a subquery or view would be simpler',
      'Assuming CTEs are always materialized (PostgreSQL inlines them by default)'
    ],
    practiceQuestions: [
      {
        question: 'Write a query using a CTE to find the top 3 products by revenue in each category.',
        hint: 'Create a CTE with ROW_NUMBER() partitioned by category, ordered by revenue DESC.',
        solution: `WITH product_revenue AS (
  SELECT 
    category,
    name,
    SUM(price * units_sold) AS revenue,
    ROW_NUMBER() OVER (
      PARTITION BY category 
      ORDER BY SUM(price * units_sold) DESC
    ) AS rank
  FROM products
  GROUP BY category, name
)
SELECT category, name, revenue
FROM product_revenue
WHERE rank <= 3
ORDER BY category, rank;`
      },
      {
        question: 'Use a recursive CTE to generate a series of dates from 2024-01-01 to 2024-01-10.',
        hint: 'Start with the base date and UNION ALL adding 1 day.',
        solution: `WITH RECURSIVE dates AS (
  SELECT '2024-01-01'::DATE AS dt
  UNION ALL
  SELECT dt + 1
  FROM dates
  WHERE dt < '2024-01-10'
)
SELECT dt FROM dates
ORDER BY dt;`
      },
      {
        question: 'Challenge: Using a recursive CTE, generate a hierarchy of products based on their category. Since products don\'t have a parent-child relationship in our schema, instead generate a numbers table from 1 to 20 using a recursive CTE, and then JOIN it with products to show product name, its price, and the number. Only show rows where the product ID matches the number. Explain why some numbers have no products.',
        hint: 'Start with SELECT 1 AS n as the anchor. UNION ALL SELECT n + 1 FROM numbers WHERE n < 20 for the recursion. Then LEFT JOIN products ON n = products.id.',
        solution: `WITH RECURSIVE numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 20
)
SELECT n AS number,
  p.name AS product_name,
  p.price
FROM numbers n
LEFT JOIN products p ON n = p.id
ORDER BY n;`
      },
      {
        question: 'Challenge: Write a query using multiple CTEs that finds the top-spending customer in each product category. For each category, show the category, customer name, and total they spent. Use CTEs to compute customer spend per category, then rank them.',
        hint: 'First CTE: JOIN orders to products and compute SUM(price * quantity) per (customer, category). Second CTE: Use ROW_NUMBER() PARTITION BY category. Final SELECT: Filter rank = 1.',
        solution: `WITH customer_category AS (
  SELECT o.customer_name, p.category,
    SUM(p.price * o.quantity) AS total_spent
  FROM orders o
  JOIN products p ON o.product_id = p.id
  GROUP BY o.customer_name, p.category
),
ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY category ORDER BY total_spent DESC
  ) AS rn
  FROM customer_category
)
SELECT category, customer_name, ROUND(total_spent, 2) AS total_spent
FROM ranked
WHERE rn = 1
ORDER BY category;`
      }
    ]
  },
  {
    id: 'window-functions',
    title: 'Window Functions',
    description: 'Perform calculations across rows related to the current row',
    icon: '📈',
    difficulty: 'advanced',
    prerequisites: ['group-by', 'order-by'],
    topics: ['OVER', 'PARTITION BY', 'ORDER BY in window', 'frame clause', 'ROWS', 'RANGE'],
    explanation: `Window functions perform calculations across a set of rows related to the current row, while preserving individual row details.

Unlike GROUP BY, window functions do NOT collapse rows — each row retains its identity.

Key concepts:
- OVER(): Defines the window (set of rows)
- PARTITION BY: Divides rows into groups (optional)
- ORDER BY: Orders rows within the partition
- Frame: ROWS BETWEEN, RANGE BETWEEN (defines the sliding window)

PostgreSQL is one of the most standards-compliant databases for window functions.`,
    syntax: `-- Basic window function
SELECT 
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg,
  salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg
FROM employees;

-- With ORDER BY (running total)
SELECT 
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM daily_sales;

-- With frame clause
SELECT 
  date,
  amount,
  AVG(amount) OVER (
    ORDER BY date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7day_avg
FROM daily_sales;`,
    examples: [
      {
        title: 'Running Total',
        sql: `SELECT 
  order_date,
  total,
  SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders
WHERE order_date >= '2024-01-01'
ORDER BY order_date;`,
        explanation: 'Computes a running total of order amounts over time. Each row shows the cumulative sum up to that date.'
      },
      {
        title: 'Moving Average',
        sql: `SELECT 
  sale_date,
  daily_revenue,
  AVG(daily_revenue) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7day_avg,
  COUNT(*) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS days_in_window
FROM daily_revenue
ORDER BY sale_date;`,
        explanation: 'Calculates a 7-day rolling average of daily revenue. The COUNT shows how many days are in each window (fewer at the start).'
      },
      {
        title: 'Difference from Group Average',
        sql: `SELECT 
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg,
  ROUND(salary - AVG(salary) OVER (PARTITION BY department), 2) AS diff,
  CASE 
    WHEN salary > AVG(salary) OVER (PARTITION BY department) 
    THEN 'Above Avg'
    ELSE 'Below Avg'
  END AS standing
FROM employees
ORDER BY department, salary DESC;`,
        explanation: 'Shows how each employee\'s salary compares to their department average, with a label.'
      }
    ],
    commonMistakes: [
      'Forgetting that window functions cannot be used in WHERE or HAVING (use a subquery/CTE)',
      'Confusing ROWS and RANGE frame boundaries (RANGE considers ties as equal)',
      'Not including ORDER BY in the OVER when the frame depends on order',
      'Assuming PARTITION BY creates separate result sets (it just defines scope)'
    ],
    practiceQuestions: [
      {
        question: 'Calculate a running total of sales per month, partitioned by year (reset each year).',
        hint: 'Use SUM() OVER (PARTITION BY year ORDER BY month).',
        solution: `SELECT 
  EXTRACT(YEAR FROM order_date) AS year,
  EXTRACT(MONTH FROM order_date) AS month,
  SUM(total) AS monthly_total,
  SUM(SUM(total)) OVER (
    PARTITION BY EXTRACT(YEAR FROM order_date)
    ORDER BY EXTRACT(MONTH FROM order_date)
  ) AS year_to_date
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ORDER BY year, month;`
      },
      {
        question: 'For each employee, show their salary and the difference from the next higher-paid employee in the same department.',
        hint: 'Use LEAD(salary) OVER (PARTITION BY department ORDER BY salary DESC).',
        solution: `SELECT 
  name,
  department,
  salary,
  LEAD(salary) OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) AS next_higher_salary,
  salary - LEAD(salary) OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) AS gap
FROM employees
ORDER BY department, salary DESC;`
      },
      {
        question: 'Challenge: Write a query that shows for each month in 2024 (from the orders table), the total quantity ordered, and a 3-month rolling average of quantity ordered. Use a window function with a frame clause.',
        hint: 'First aggregate orders by month to get monthly_quantity. Then use AVG(monthly_quantity) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).',
        solution: `WITH monthly AS (
  SELECT strftime('%m', order_date) AS month,
    SUM(quantity) AS total_qty
  FROM orders
  WHERE order_date >= '2024-01-01'
  GROUP BY month
)
SELECT month, total_qty,
  ROUND(AVG(total_qty) OVER (
    ORDER BY month
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ), 1) AS rolling_3mo_avg
FROM monthly
ORDER BY month;`
      },
      {
        question: 'Challenge: For each employee, calculate their salary percentile within their department using NTILE(100). Show name, department, salary, and percentile. Then flag employees in the top 25% of their department.',
        hint: 'Use NTILE(100) OVER (PARTITION BY department_id ORDER BY salary DESC). Use CASE to flag percentile <= 25.',
        solution: `SELECT e.name, d.name AS department, e.salary,
  NTILE(100) OVER (
    PARTITION BY e.department_id
    ORDER BY e.salary DESC
  ) AS percentile,
  CASE WHEN NTILE(100) OVER (
    PARTITION BY e.department_id
    ORDER BY e.salary DESC
  ) <= 25 THEN 'Top 25%' ELSE '-' END AS badge
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY department, percentile;`
      }
    ]
  },
  {
    id: 'rank-functions',
    title: 'RANK, DENSE_RANK, ROW_NUMBER',
    description: 'Assign ranks and row numbers within partitions',
    icon: '🏆',
    difficulty: 'advanced',
    prerequisites: ['window-functions'],
    topics: ['RANK', 'DENSE_RANK', 'ROW_NUMBER', 'NTILE'],
    explanation: `These three ranking functions assign a number to each row within a partition. The key difference is how they handle ties:

ROW_NUMBER: Assigns a unique number to each row (1, 2, 3, 4, ...). Ties are broken arbitrarily (or by ORDER BY).

RANK: Same rank for ties, then skips the next rank(s). Example: 1, 1, 3, 4.

DENSE_RANK: Same rank for ties, but does NOT skip ranks. Example: 1, 1, 2, 3.

NTILE(n): Divides rows into n roughly equal buckets.`,
    syntax: `SELECT 
  name,
  department,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
  NTILE(4) OVER (ORDER BY salary DESC) AS quartile
FROM employees;

-- With PARTITION BY
SELECT 
  name,
  department,
  salary,
  ROW_NUMBER() OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) AS dept_rank
FROM employees;`,
    examples: [
      {
        title: 'Top N Per Department with ROW_NUMBER',
        sql: `WITH ranked AS (
  SELECT 
    name,
    department,
    salary,
    ROW_NUMBER() OVER (
      PARTITION BY department 
      ORDER BY salary DESC
    ) AS rank
  FROM employees
)
SELECT name, department, salary
FROM ranked
WHERE rank <= 3
ORDER BY department, rank;`,
        explanation: 'Finds the top 3 highest-paid employees in each department. ROW_NUMBER ensures exactly 3 per department (no ties).'
      },
      {
        title: 'RANK vs DENSE_RANK Comparison',
        sql: `SELECT 
  name,
  department,
  salary,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_number
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Shows the difference: RANK skips numbers after ties, DENSE_RANK does not, ROW_NUMBER is always unique and consecutive.'
      },
      {
        title: 'Quartiles with NTILE',
        sql: `SELECT 
  name,
  salary,
  NTILE(4) OVER (ORDER BY salary DESC) AS quartile,
  CASE NTILE(4) OVER (ORDER BY salary DESC)
    WHEN 1 THEN 'Top 25%'
    WHEN 2 THEN '25-50%'
    WHEN 3 THEN '50-75%'
    WHEN 4 THEN 'Bottom 25%'
  END AS band
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Divides employees into 4 quartiles based on salary. Each quartile has an equal number of employees (or as close as possible).'
      }
    ],
    commonMistakes: [
      'Using ROW_NUMBER when you want ties to have the same rank',
      'Forgetting PARTITION BY when you need per-group ranking',
      'Assuming NTILE always creates exactly equal buckets (it distributes remainders)',
      'Not understanding that ROW_NUMBER with ties gives non-deterministic results'
    ],
    practiceQuestions: [
      {
        question: 'Find the top 2 highest-selling products in each category based on total revenue.',
        hint: 'Use ROW_NUMBER() PARTITION BY category ORDER BY SUM(revenue) DESC inside a CTE.',
        solution: `WITH product_rankings AS (
  SELECT 
    category,
    name,
    SUM(price * units_sold) AS revenue,
    ROW_NUMBER() OVER (
      PARTITION BY category 
      ORDER BY SUM(price * units_sold) DESC
    ) AS rank
  FROM products
  GROUP BY category, name
)
SELECT category, name, revenue
FROM product_rankings
WHERE rank <= 2
ORDER BY category, rank;`
      },
      {
        question: 'Show each employee\'s salary with their department-wide rank (using DENSE_RANK) and indicate if they are in the top 3 of their department.',
        hint: 'Use DENSE_RANK with PARTITION BY department, then CASE to label.',
        solution: `SELECT 
  name,
  department,
  salary,
  DENSE_RANK() OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) AS dept_rank,
  CASE WHEN DENSE_RANK() OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) <= 3 THEN 'Top 3' ELSE '-' END AS badge
FROM employees
ORDER BY department, dept_rank;`
      },
      {
        question: 'Challenge: Write a query that assigns a "tier" to each employee within their department based on salary. Use these rules: Top 1 employee by salary = "Platinum", Next 2 = "Gold", Rest = "Standard". Use ROW_NUMBER, not NTILE.',
        hint: 'Use ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC). Then CASE WHEN rn = 1 THEN \'Platinum\' WHEN rn <= 3 THEN \'Gold\' ELSE \'Standard\' END.',
        solution: `WITH ranked AS (
  SELECT e.name, d.name AS department, e.salary,
    ROW_NUMBER() OVER (
      PARTITION BY e.department_id
      ORDER BY e.salary DESC
    ) AS rn
  FROM employees e
  JOIN departments d ON e.department_id = d.id
)
SELECT name, department, salary,
  CASE
    WHEN rn = 1 THEN 'Platinum'
    WHEN rn <= 3 THEN 'Gold'
    ELSE 'Standard'
  END AS tier
FROM ranked
ORDER BY department, rn;`
      },
      {
        question: 'Challenge: Using RANK and DENSE_RANK together, write a query that shows employee names, their salary, and three different ranking columns to illustrate the difference between the functions on the same salary data. Use the full company (no department partition).',
        hint: 'Use RANK(), DENSE_RANK(), and ROW_NUMBER() all with OVER (ORDER BY salary DESC). This will show how tied salaries are handled differently.',
        solution: `SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees
ORDER BY salary DESC;`
      }
    ]
  },
  {
    id: 'string-functions',
    title: 'Advanced String Functions',
    description: 'Manipulate and transform text data with SQL string functions',
    icon: '🔤',
    difficulty: 'intermediate',
    prerequisites: ['select'],
    topics: ['CONCAT', 'SUBSTRING', 'REPLACE', 'TRIM', 'UPPER', 'LOWER', 'LENGTH', 'POSITION'],
    explanation: `SQL provides a rich set of string functions to manipulate text data. PostgreSQL has one of the most comprehensive implementations.

Key functions:
- CONCAT / ||: Join strings together
- SUBSTRING: Extract part of a string
- REPLACE: Replace occurrences of a substring
- TRIM / LTRIM / RTRIM: Remove whitespace
- UPPER / LOWER: Change case
- LENGTH: Get string length
- POSITION / STRPOS: Find substring position
- LPAD / RPAD: Pad strings to a length

PostgreSQL also supports function chaining: UPPER(TRIM(column)) works naturally.`,
    syntax: `-- Concatenation
SELECT CONCAT(first_name, ' ', last_name) AS full_name;
-- or using ||
SELECT first_name || ' ' || last_name AS full_name;

-- Substring extraction
SELECT SUBSTRING('Hello World' FROM 1 FOR 5);  -- 'Hello'
SELECT SUBSTRING('Hello World' FROM 7);        -- 'World'

-- Replace
SELECT REPLACE('Hello World', 'World', 'SQL');  -- 'Hello SQL'

-- Trimming
SELECT TRIM('  hello  ');               -- 'hello'
SELECT LTRIM('  hello  ');              -- 'hello  '
SELECT RTRIM('  hello  ');              -- '  hello'

-- Case conversion
SELECT UPPER('hello');  -- 'HELLO'
SELECT LOWER('WORLD');  -- 'world'

-- String length
SELECT LENGTH('Hello');  -- 5

-- Find position
SELECT POSITION('World' IN 'Hello World');  -- 7
SELECT STRPOS('Hello World', 'World');      -- 7

-- Padding
SELECT LPAD('5', 3, '0');   -- '005'
SELECT RPAD('SQL', 6, '*'); -- 'SQL***'`,
    examples: [
      {
        title: 'Formatting Names',
        sql: `SELECT 
  UPPER(last_name) AS last_name_upper,
  INITCAP(first_name) AS first_name_capitalized,
  CONCAT(last_name, ', ', first_name) AS formal_name,
  LENGTH(CONCAT(first_name, ' ', last_name)) AS name_length
FROM employees
LIMIT 5;`,
        explanation: 'Demonstrates various string formatting: uppercasing last names, capitalizing first names, creating formal "Last, First" format, and measuring name lengths.'
      },
      {
        title: 'Data Cleaning with TRIM and REPLACE',
        sql: `SELECT 
  TRIM(description) AS cleaned_description,
  REPLACE(description, '  ', ' ') AS single_spaced,
  LENGTH(description) AS original_length,
  LENGTH(TRIM(description)) AS trimmed_length
FROM products
WHERE description IS NOT NULL;`,
        explanation: 'TRIM removes leading/trailing whitespace, REPLACE collapses double spaces. Shows how string functions clean messy text data.'
      },
      {
        title: 'Email Domain Extraction',
        sql: `SELECT 
  email,
  SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain,
  SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) AS username
FROM employees
LIMIT 5;`,
        explanation: 'Uses POSITION to find the @ symbol, then SUBSTRING to extract the username (before @) and domain (after @) from email addresses.'
      }
    ],
    commonMistakes: [
      'Using CONCAT when || would be simpler for two-value concatenation (CONCAT handles NULLs gracefully; || does not)',
      'Forgetting that string positions in SQL start at 1, not 0',
      'Assuming LENGTH counts characters (it does in PostgreSQL) vs bytes (LENGTH in some databases)',
      'Not handling NULLs — string functions on NULL return NULL (use COALESCE)'
    ],
    practiceQuestions: [
      {
        question: 'Extract the first name (everything before the first space) and last initial from the name column in employees. Display as "First L." format.',
        hint: 'Use SUBSTRING with POSITION to find the space, then CONCAT with a dot.',
        solution: `SELECT 
  name,
  SUBSTRING(name FROM 1 FOR POSITION(' ' IN name) - 1) || ' ' ||
  SUBSTRING(name FROM POSITION(' ' IN name) + 1 FOR 1) || '.' AS short_name
FROM employees;`
      },
      {
        question: 'Clean up product names by removing leading/trailing spaces, converting to proper case (first letter capitalized), and replacing underscores with spaces.',
        hint: 'Chain TRIM, INITCAP, and REPLACE functions.',
        solution: `SELECT 
  name AS original,
  REPLACE(INITCAP(TRIM(name)), '_', ' ') AS cleaned_name
FROM products
WHERE name != TRIM(name)
   OR name LIKE '%_%';`
      },
      {
        question: 'Challenge: Write a query that extracts the first name and last initial from each employee name, and formats it as "First L." where L is the last initial capitalized. Then sort by the last initial descending.',
        hint: 'Use SUBSTRING with POSITION to split at the space. Concatenate with ||. For the last initial: SUBSTRING(name FROM POSITION(\' \' IN name) + 1 FOR 1). Convert to uppercase with UPPER().',
        solution: `SELECT name,
  SUBSTRING(name FROM 1 FOR POSITION(' ' IN name) - 1)
    || ' '
    || UPPER(SUBSTRING(name FROM POSITION(' ' IN name) + 1 FOR 1))
    || '.' AS short_name
FROM employees
ORDER BY SUBSTRING(name FROM POSITION(' ' IN name) + 1 FOR 1) DESC;`
      },
      {
        question: 'Challenge: From the products table, create a "product_code" column by taking the first 3 letters of the category (uppercased), the first 2 letters of the product name (uppercased), and the ID zero-padded to 3 digits. Example: "ELELP001" for a Laptop Pro in Electronics with ID 1.',
        hint: 'Use UPPER(SUBSTRING(category FROM 1 FOR 3)) concatenated with UPPER(SUBSTRING(name FROM 1 FOR 2)) and LPAD(CAST(id AS TEXT), 3, \'0\').',
        solution: `SELECT name, category, id,
  UPPER(SUBSTRING(category FROM 1 FOR 3))
    || UPPER(SUBSTRING(name FROM 1 FOR 2))
    || LPAD(CAST(id AS TEXT), 3, '0') AS product_code
FROM products
ORDER BY id;`
      }
    ]
  },
  {
    id: 'pattern-matching',
    title: 'Pattern Matching & Regex',
    description: 'Advanced text search with LIKE, ILIKE, and regular expressions',
    icon: '🎯',
    difficulty: 'intermediate',
    prerequisites: ['where'],
    topics: ['LIKE', 'ILIKE', 'SIMILAR TO', 'regex', '~', '~*', 'regexp_replace', 'regexp_match'],
    explanation: `SQL offers multiple ways to search for patterns in text data, from simple wildcards to full regular expressions.

Comparison of approaches:
- LIKE: Simple wildcard matching (% for any sequence, _ for single char)
- ILIKE: Case-insensitive LIKE (PostgreSQL extension)
- SIMILAR TO: SQL standard regex (less common, use regex operators instead)
- ~ : POSIX regex match (PostgreSQL)
- ~* : Case-insensitive POSIX regex match
- !~ / !~* : Negated regex match
- regexp_match(): Returns matched substrings as an array
- regexp_replace(): Replace using regex patterns

PostgreSQL has the most powerful regex implementation among major databases.`,
    syntax: `-- LIKE wildcards
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE sku LIKE 'ABC_'; -- _ = single char

-- ILIKE (case-insensitive)
SELECT * FROM users WHERE name ILIKE 'john%';

-- POSIX regex matches
SELECT * FROM users WHERE email ~ '^[a-z]+@[a-z]+\\.com$';
SELECT * FROM users WHERE name ~* '^smith'; -- case-insensitive

-- regexp_match (extract matches)
SELECT 
  email,
  regexp_match(email, '@(.+)$') AS domain
FROM users;

-- regexp_replace
SELECT 
  phone,
  regexp_replace(phone, '[^0-9]', '', 'g') AS digits_only
FROM contacts;

-- Common regex patterns
-- ^    start of string
-- $    end of string
-- .    any character
-- *    zero or more
-- +    one or more
-- []   character class
-- |    alternation
-- ()   grouping`,
    examples: [
      {
        title: 'Email Pattern Validation',
        sql: `SELECT 
  name,
  email,
  CASE 
    WHEN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    THEN 'Valid'
    ELSE 'Invalid'
  END AS email_valid
FROM employees
WHERE email IS NOT NULL;`,
        explanation: 'Uses a POSIX regex to validate email format. The pattern checks for standard email structure: username @ domain.tld.'
      },
      {
        title: 'Extracting Data with regexp_match',
        sql: `SELECT 
  name,
  email,
  regexp_match(email, '@(.+)$') AS domain_array,
  (regexp_match(email, '@(.+)$'))[1] AS domain
FROM employees
LIMIT 5;`,
        explanation: 'regexp_match returns matched groups as a PostgreSQL array. Access the first element with [1] to get the domain name.'
      },
      {
        title: 'Advanced Data Cleaning',
        sql: `SELECT 
  name,
  email,
  regexp_replace(email, '(@).+$', '\\1company.com') AS standardized_email,
  regexp_replace(name, '[^a-zA-Z ]', '', 'g') AS clean_name
FROM employees
LIMIT 5;`,
        explanation: 'regexp_replace with the g (global) flag replaces all occurrences. Standardizes email domains and removes non-alphabetic characters from names.'
      }
    ],
    commonMistakes: [
      'Using LIKE when you need real regex (LIKE only supports % and _ wildcards)',
      'Forgetting the g flag in regexp_replace (without it, only first match is replaced)',
      'Using SIMILAR TO instead of POSIX regex (~) — SIMILAR TO is verbose and less powerful',
      'Not escaping special regex characters (. * + ? etc.) when doing literal matching',
      'Overusing regex on simple patterns — LIKE is faster for simple prefix/suffix matching'
    ],
    practiceQuestions: [
      {
        question: 'Find all employees whose name starts with a vowel (A, E, I, O, U) and ends with a consonant, case-insensitively.',
        hint: 'Use ~* with a regex pattern: ^[aeiou] for starting vowel, [^aeiou]$ for ending consonant.',
        solution: `SELECT name, email
FROM employees
WHERE name ~* '^[aeiou].*[^aeiou]$'
ORDER BY name;`
      },
      {
        question: 'Extract the area code from phone numbers stored in various formats like (555) 123-4567, 555-123-4567, or 5551234567.',
        hint: 'Use regexp_match with a pattern that captures 3 digits at the start of the number.',
        solution: `SELECT 
  '(555) 123-4567' AS phone,
  (regexp_match('(555) 123-4567', '(\\d{3})'))[1] AS area_code;`
      }
    ]
  },
  {
    id: 'set-operations',
    title: 'Set Operations',
    description: 'Combine result sets with UNION, INTERSECT, and EXCEPT',
    icon: '🧩',
    difficulty: 'intermediate',
    prerequisites: ['select'],
    topics: ['UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT', 'set operations'],
    explanation: `Set operations combine results from multiple SELECT queries into a single result set. Each SELECT must have the same number of columns with compatible data types.

UNION: Combines results, removing duplicates (slower due to sort/distinct).
UNION ALL: Combines results, keeping all duplicates (faster).
INTERSECT: Returns rows that appear in both result sets.
EXCEPT: Returns rows from the first result set that are NOT in the second.

Unlike JOINs which combine columns from different tables horizontally, set operations stack results vertically.`,
    syntax: `-- UNION (removes duplicates)
SELECT city FROM customers
UNION
SELECT city FROM suppliers
ORDER BY city;

-- UNION ALL (preserves duplicates, faster)
SELECT product_id FROM orders_2024
UNION ALL
SELECT product_id FROM orders_2025;

-- INTERSECT
SELECT product_id FROM products
INTERSECT
SELECT product_id FROM order_items;

-- EXCEPT
SELECT employee_id FROM employees
EXCEPT
SELECT employee_id FROM terminated_employees;

-- Multiple set operations
SELECT name FROM full_time_employees
UNION
SELECT name FROM part_time_employees
INTERSECT
SELECT name FROM award_winners;`,
    examples: [
      {
        title: 'Merging Customer Lists',
        sql: `SELECT name, email, 'Premium' AS source
FROM premium_customers
UNION ALL
SELECT name, email, 'Standard' AS source
FROM standard_customers
ORDER BY name;`,
        explanation: 'Combines two customer tables into one list, adding a source column to identify where each row came from.'
      },
      {
        title: 'Finding Common Records with INTERSECT',
        sql: `SELECT product_id, product_name
FROM current_inventory
INTERSECT
SELECT product_id, product_name
FROM discontinued_products;`,
        explanation: 'INTERSECT finds products that appear in both tables — products that are both in current inventory and marked as discontinued (possibly a data inconsistency).'
      },
      {
        title: 'Excluding Results with EXCEPT',
        sql: `SELECT email FROM newsletter_subscribers
EXCEPT
SELECT email FROM unsubscribed
ORDER BY email;`,
        explanation: 'EXCEPT returns all subscribed emails that are NOT in the unsubscribed list. This gives the active subscriber list.'
      }
    ],
    commonMistakes: [
      'Using UNION when UNION ALL would suffice (UNION sorts/deduplicates, which is slower)',
      'Mismatching column count or types between SELECT queries',
      'Assuming ORDER BY applies to each subquery individually (ORDER BY only applies to the final result)',
      'Forgetting that INTERSECT and EXCEPT also remove duplicates (use parentheses and WHERE for more control)',
      'Not parenthesizing when mixing UNION, INTERSECT, and EXCEPT (INTERSECT binds tighter than UNION/EXCEPT)'
    ],
    practiceQuestions: [
      {
        question: 'List all unique cities that appear in either the employees table or the departments table. Include a label showing which table the city came from (if from both, show it once with "Both" label).',
        hint: 'Use UNION to combine two SELECT queries, adding a literal source column.',
        solution: `SELECT DISTINCT city, 'Employees' AS source
FROM employees
UNION
SELECT DISTINCT city, 'Departments' AS source
FROM departments
ORDER BY city;`
      },
      {
        question: 'Find products that have never been ordered — use EXCEPT to compare products that exist vs products that appear in orders.',
        hint: 'Select product IDs from products, EXCEPT product IDs from order_items.',
        solution: `SELECT id, name
FROM products
WHERE id IN (
  SELECT id FROM products
  EXCEPT
  SELECT product_id FROM order_items
);`
      },
      {
        question: 'Challenge: Write a query using set operations to find all possible pairs of (employee, department) where the employee is NOT in that department. In other words, find the Cartesian product of all employees and departments, then subtract the actual assignments. Show employee name and department name.',
        hint: 'CROSS JOIN employees and departments to get all combinations. Then use EXCEPT to remove the actual assignments. Or: SELECT FROM employees CROSS JOIN departments EXCEPT SELECT e.name, d.name FROM employees e JOIN departments d ON e.department_id = d.id.',
        solution: `SELECT e.name AS employee_name, d.name AS department_name
FROM employees e
CROSS JOIN departments d
EXCEPT
SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY department_name, employee_name;`
      },
      {
        question: 'Challenge: Using UNION and string functions, write a query that produces a single-column report showing all table names, column names, and their types from the playground database schema. Format each row as "TABLE: <name>" for tables and "  COLUMN: <name> (<type>)" for columns. Order by table name then column position.',
        hint: 'Use two SELECT queries UNION ALL: one querying sqlite_master for tables, another querying PRAGMA table_info for each table\'s columns. But since PRAGMA cannot be directly UNION\'d, instead query sqlite_master and use a second SELECT from a derived table of column metadata.',
        solution: `SELECT 'TABLE: ' || name AS info
FROM sqlite_master
WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
UNION ALL
SELECT '  COLUMN: ' || c.name || ' (' || c.type || ')'
FROM sqlite_master m, pragma_table_info(m.name) c
WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
ORDER BY info;`
      }
    ]
  }
]
