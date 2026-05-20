export interface LessonExample {
  title: string
  sql: string
  explanation: string
  sourceTables?: string[]
  cppRepresentation?: string
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
        title: 'Basic SELECT — all columns',
        sql: `SELECT *
FROM employees;`,
        explanation: 'Returns every column and every row from the employees table.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT * FROM employees;
struct Employee { string name; string department; double salary; string status; string city; };
vector<Employee> result = employees;  // Pass-through: all columns, all rows
for (auto& e : result)
    cout << e.name << " | " << e.department << " | " << e.salary << "\\n";`
      },
      {
        title: 'Select specific columns',
        sql: `SELECT name, department, salary
FROM employees;`,
        explanation: 'Returns only the name, department, and salary columns for all employees.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees;
struct Result { string name; string department; double salary; };
vector<Result> result;
for (auto& e : employees)
    result.push_back({e.name, e.department, e.salary});
for (auto& r : result)
    cout << r.name << " | " << r.department << " | " << r.salary << "\\n";`
      },
      {
        title: 'Column alias with AS',
        sql: `SELECT 
  name,
  salary * 12 AS annual_salary
FROM employees;`,
        explanation: 'Calculates annual salary (monthly salary × 12) and renames the computed column to "annual_salary" using AS.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, salary * 12 AS annual_salary FROM employees;
struct Result { string name; double annual_salary; };
vector<Result> result;
for (auto& e : employees)
    result.push_back({e.name, e.salary * 12});
for (auto& r : result)
    cout << r.name << " | $" << r.annual_salary << "\\n";`
      },
      {
        title: 'DISTINCT unique values',
        sql: `SELECT DISTINCT department
FROM employees;`,
        explanation: 'Returns each unique department name once, removing duplicates.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT DISTINCT department FROM employees;
unordered_set<string> seen;
for (auto& e : employees) {
    if (seen.find(e.department) == seen.end()) {
        seen.insert(e.department);
        cout << e.department << "\\n";
    }
}`
      },
      {
        title: 'LIMIT results',
        sql: `SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;`,
        explanation: 'Returns only the top 3 highest-paid employees.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;
sort(employees.begin(), employees.end(),
    [](auto& a, auto& b) { return a.salary > b.salary; });
int limit = 3;
for (int i = 0; i < min(limit, (int)employees.size()); i++)
    cout << employees[i].name << " | $" << employees[i].salary << "\\n";`
      },
      {
        title: 'Expression in SELECT',
        sql: `SELECT 
  name, department, salary,
  salary * 12 AS annual_salary
FROM employees
LIMIT 5;`,
        explanation: 'Projects employee details along with a computed annual salary column.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary, salary * 12 AS annual_salary FROM employees LIMIT 5;
struct Result { string name; string department; double salary; double annual_salary; };
vector<Result> result;
int limit = 5;
for (int i = 0; i < min(limit, (int)employees.size()); i++) {
    auto& e = employees[i];
    result.push_back({e.name, e.department, e.salary, e.salary * 12});
}
for (auto& r : result)
    cout << r.name << " | " << r.department << " | " << r.salary << " | " << r.annual_salary << "\\n";`
      },
      {
        title: 'Constants without FROM',
        sql: `SELECT
  'SQL' AS language,
  5 + 3 AS sum_result,
  'Hello' || ' ' || 'World' AS greeting;`,
        explanation: 'You can SELECT expressions and constants without a FROM clause. Useful for calculations, string concatenation, or quick checks.',
        cppRepresentation: `// Intuitive C++ representation of: SELECT 'SQL' AS language, 5 + 3 AS sum_result
struct Result { string language; int sum_result; string greeting; };
Result r = {"SQL", 5 + 3, "Hello World"};
cout << r.language << " | " << r.sum_result << " | " << r.greeting << "\\n";`
      },
      {
        title: 'DISTINCT on multiple columns',
        sql: `SELECT DISTINCT department, status
FROM employees
ORDER BY department;`,
        explanation: 'DISTINCT applies to ALL selected columns together. This returns every unique combination of department and status.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT DISTINCT department, status FROM employees ORDER BY department;
set<pair<string, string>> seen;
for (auto& e : employees)
    seen.insert({e.department, e.status});
for (auto& p : seen)
    cout << p.first << " | " << p.second << "\\n";`
      },
      {
        title: 'SELECT with WHERE filter',
        sql: `SELECT name, department, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;`,
        explanation: 'Combines SELECT with WHERE to filter results. Only Engineering department employees are returned, sorted by salary from highest to lowest.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;
vector<Employee> filtered;
for (auto& e : employees)
    if (e.department == "Engineering") filtered.push_back(e);
sort(filtered.begin(), filtered.end(),
    [](auto& a, auto& b) { return a.salary > b.salary; });
for (auto& e : filtered)
    cout << e.name << " | " << e.department << " | " << e.salary << "\\n";`
      },
      {
        title: 'SELECT with ORDER BY',
        sql: `SELECT name, department, salary
FROM employees
ORDER BY salary DESC;`,
        explanation: 'SELECT retrieves the columns, ORDER BY sorts the results. This query lists all employees from highest to lowest salary.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees ORDER BY salary DESC;
vector<Employee> sorted = employees;
sort(sorted.begin(), sorted.end(),
    [](auto& a, auto& b) { return a.salary > b.salary; });
for (auto& e : sorted)
    cout << e.name << " | " << e.department << " | " << e.salary << "\\n";`
      },
      {
        title: 'SELECT with CASE for labels',
        sql: `SELECT name, salary,
  CASE
    WHEN salary >= 100000 THEN 'High'
    WHEN salary >= 60000 THEN 'Medium'
    ELSE 'Entry'
  END AS salary_tier
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Uses CASE inside SELECT to transform salary values into readable tier labels — High, Medium, or Entry — without altering the underlying data.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, salary, CASE WHEN salary >= 100000 THEN 'High' ... END AS salary_tier FROM employees ORDER BY salary DESC;
auto salaryTier = [](double s) -> string {
    if (s >= 100000) return "High";
    if (s >= 60000) return "Medium";
    return "Entry";
};
struct Result { string name; double salary; string tier; };
vector<Result> result;
for (auto& e : employees)
    result.push_back({e.name, e.salary, salaryTier(e.salary)});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.salary > b.salary; });
for (auto& r : result)
    cout << r.name << " | " << r.salary << " | " << r.tier << "\\n";`
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
        question: 'Select distinct departments from the employees table, showing them as "department_name".',
        hint: 'Use DISTINCT with an AS alias.',
        solution: `SELECT DISTINCT department AS department_name
FROM employees;`
      },
      {
        question: 'Select product names and their prices, with the price displayed as "price_with_tax" (price * 1.1). Limit to 5 rows.',
        hint: 'Use arithmetic in the SELECT clause with an alias and LIMIT.',
        solution: `SELECT name, price * 1.1 AS price_with_tax
FROM products
LIMIT 5;`
      },
      {
        question: 'Write a query that shows each product\'s name, its price, the price with a 20% discount labeled as "discounted_price", and the total inventory value (price * stock) labeled as "inventory_value". Limit to 8 rows.',
        hint: 'Use arithmetic expressions in SELECT with AS aliases. Discounted price = price * 0.8, inventory value = price * stock.',
        solution: `SELECT name, price,
  price * 0.8 AS discounted_price,
  price * stock AS inventory_value
FROM products
LIMIT 8;`
      },
      {
        question: 'Challenge: Write a query that shows the first 5 distinct department-city combinations from the employees table. Alias the columns as "dept" and "location".',
        hint: 'Use DISTINCT on two columns, AS for aliases, and LIMIT.',
        solution: `SELECT DISTINCT department AS dept,
  city AS location
FROM employees
LIMIT 5;`
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
        title: 'Comparison operators',
        sql: `SELECT name, department, salary
FROM employees
WHERE salary >= 90000;`,
        explanation: 'Finds employees earning $90,000 or more.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (e.salary >= 90000)
        result.push_back({e.name, e.department, e.salary});`
      },
      {
        title: 'AND — multiple conditions',
        sql: `SELECT name, department, salary
FROM employees
WHERE department = 'Engineering'
  AND salary >= 80000
  AND status = 'active';`,
        explanation: 'Finds active Engineering employees earning at least $80,000.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (e.department == "Engineering" && e.salary >= 80000 && e.status == "active")
        result.push_back({e.name, e.department, e.salary});`
      },
      {
        title: 'IN — set membership',
        sql: `SELECT name, department, salary
FROM employees
WHERE department IN ('Engineering', 'Product')
  AND status = 'active'
ORDER BY salary DESC;`,
        explanation: 'Lists active employees in Engineering or Product departments, sorted by salary.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> target = {"Engineering", "Product"};
vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (target.contains(e.department) && e.status == "active")
        result.push_back({e.name, e.department, e.salary});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'BETWEEN — range filter',
        sql: `SELECT name, department, salary
FROM employees
WHERE salary BETWEEN 60000 AND 90000
  AND status = 'active';`,
        explanation: 'Finds active employees earning between $60,000 and $90,000 inclusive.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (e.salary >= 60000 && e.salary <= 90000 && e.status == "active")
        result.push_back({e.name, e.department, e.salary});`
      },
      {
        title: 'LIKE — pattern matching',
        sql: `SELECT name, category, price
FROM products
WHERE name LIKE '%e%'
ORDER BY price DESC;`,
        explanation: 'Finds products whose name contains the letter "e", sorted from most to least expensive.',
        sourceTables: ['products'],
        cppRepresentation: `vector<tuple<string,string,double>> result;
for (auto& p : products)
    if (p.name.find('e') != string::npos)
        result.push_back({p.name, p.category, p.price});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'Combining AND / OR with parentheses',
        sql: `SELECT name, department, salary, city
FROM employees
WHERE (department = 'Engineering' OR department = 'Product')
  AND city IN ('New York', 'San Francisco')
  AND status = 'active';`,
        explanation: 'Filters with OR inside parentheses to group alternatives, then AND with other conditions. Without parentheses, AND binds tighter than OR.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> cities = {"New York", "San Francisco"};
vector<tuple<string,string,double,string>> result;
for (auto& e : employees)
    if ((e.department == "Engineering" || e.department == "Product") && cities.contains(e.city) && e.status == "active")
        result.push_back({e.name, e.department, e.salary, e.city});`
      },
      {
        title: 'Not equal and NOT operator',
        sql: `SELECT name, department, salary
FROM employees
WHERE department <> 'Marketing'
  AND status = 'active'
  AND NOT city = 'Austin'
ORDER BY salary DESC;`,
        explanation: '<> means "not equal". NOT negates a condition. This finds all active non-Marketing employees outside of Austin.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (e.department != "Marketing" && e.status == "active" && e.city != "Austin")
        result.push_back({e.name, e.department, e.salary});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'IS NULL — finding missing data',
        sql: `SELECT name, email
FROM employees
WHERE email IS NOT NULL
ORDER BY name;`,
        explanation: 'IS NOT NULL filters out rows where email is null. To find missing data use IS NULL. NULL comparisons with = never work.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<pair<string,string>> result;
for (auto& e : employees)
    if (!e.email.empty())
        result.push_back({e.name, e.email});
sort(result.begin(), result.end());`
      },
      {
        title: 'NOT IN — excluding values',
        sql: `SELECT name, department, salary
FROM employees
WHERE department NOT IN ('Marketing', 'Product')
  AND salary BETWEEN 60000 AND 100000
ORDER BY salary;`,
        explanation: 'NOT IN excludes rows matching any value in the list. Combined with BETWEEN for a salary range filter.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> exclude = {"Marketing", "Product"};
vector<tuple<string,string,double>> result;
for (auto& e : employees)
    if (!exclude.contains(e.department) && e.salary >= 60000 && e.salary <= 100000)
        result.push_back({e.name, e.department, e.salary});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) < get<2>(b); });`
      },
      {
        title: 'Date range filtering',
        sql: `SELECT customer, total, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'
ORDER BY order_date;`,
        explanation: 'Filters orders to only those placed in Q1 2024 using BETWEEN, which is inclusive of both boundary dates.',
        sourceTables: ['orders'],
        cppRepresentation: `vector<tuple<string,double,string>> result;
for (auto& o : orders)
    if (o.order_date >= "2024-01-01" && o.order_date <= "2024-03-31")
        result.push_back({o.customer, o.total, o.order_date});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) < get<2>(b); });`
      },
      {
        title: 'Complex nested conditions',
        sql: `SELECT name, department, salary, city
FROM employees
WHERE (department = 'Engineering' OR department = 'Product')
  AND (salary > 80000 OR city = 'New York')
  AND status = 'active'
ORDER BY salary DESC;`,
        explanation: 'Uses nested parentheses to combine OR conditions: active employees in Engineering or Product who either earn over $80k or are based in New York.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,double,string>> result;
for (auto& e : employees)
    if ((e.department == "Engineering" || e.department == "Product") && (e.salary > 80000 || e.city == "New York") && e.status == "active")
        result.push_back({e.name, e.department, e.salary, e.city});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'LIKE with starts-with and ends-with',
        sql: `SELECT name, email, department
FROM employees
WHERE name LIKE 'A%'
   OR name LIKE '%e'
ORDER BY name;`,
        explanation: 'Finds employees whose name starts with "A" or ends with "e". The % wildcard matches any sequence of characters at the start or end.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,string,string>> result;
for (auto& e : employees)
    if (e.name.starts_with("A") || e.name.ends_with("e"))
        result.push_back({e.name, e.email, e.department});
sort(result.begin(), result.end());`
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
        question: 'Find all products that cost between $4 and $100, are in category "Electronics" or "Stationery", and have stock quantity greater than 50.',
        hint: 'Combine BETWEEN, IN, AND, and comparison operators.',
        solution: `SELECT *
FROM products
WHERE price BETWEEN 4 AND 100
  AND category IN ('Electronics', 'Stationery')
  AND stock > 50;`
      },
      {
        question: 'Find employees whose email ends with @company.com and who are not in the Engineering department.',
        hint: 'Use LIKE with a pattern and the <> or != operator.',
        solution: `SELECT name, email, department
FROM employees
WHERE email LIKE '%@company.com'
  AND department <> 'Engineering';`
      },
      {
        question: 'From the products table, find all products where the name contains the letter "e" (case-sensitive) AND the price is either under $30 or over $400. Show name, price, and category columns.',
        hint: 'Use LIKE with wildcards to match "e". Combine with OR for the price condition. Parentheses matter for mixing AND with OR.',
        solution: `SELECT name, price, category
FROM products
WHERE name LIKE '%e%'
  AND (price < 30 OR price > 400);`
      },
      {
        question: 'Challenge: Write a query that finds all employees whose name starts with a letter in the first half of the alphabet (A through M) and whose salary is between $60,000 and $100,000. Show name, salary, and department columns.',
        hint: 'Use multiple LIKE patterns OR\'d together for each starting letter: name LIKE \'A%\' OR name LIKE \'B%\' etc. Combine with salary BETWEEN.',
        solution: `SELECT name, salary, department
FROM employees
WHERE (name LIKE 'A%' OR name LIKE 'B%' OR name LIKE 'C%' OR name LIKE 'D%' OR name LIKE 'E%' OR name LIKE 'F%' ||    name LIKE 'G%' OR name LIKE 'H%' OR name LIKE 'I%' OR name LIKE 'J%' OR name LIKE 'K%' OR name LIKE 'L%' OR name LIKE 'M%')
  AND salary BETWEEN 60000 AND 100000;`
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
        title: 'Ascending sort (default)',
        sql: `SELECT name, salary
FROM employees
ORDER BY salary;`,
        explanation: 'Sorts employees by salary from lowest to highest. ASC is the default order.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<pair<string,double>> result;
for (auto& e : employees) result.push_back({e.name, e.salary});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.second < b.second; });
for (auto& r : result) cout << r.first << " | " << r.second << "\\n";`
      },
      {
        title: 'Descending sort',
        sql: `SELECT name, salary, department
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Sorts employees by salary from highest to lowest.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<tuple<string,double,string>> result;
for (auto& e : employees) result.push_back({e.name, e.salary, e.department});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<1>(a) > get<1>(b); });
for (auto& r : result)
    cout << get<0>(r) << " | " << get<1>(r) << " | " << get<2>(r) << "\\n";`
      },
      {
        title: 'Multiple sort columns',
        sql: `SELECT department, name, salary
FROM employees
ORDER BY department ASC, salary DESC;`,
        explanation: 'Sorts first by department alphabetically, then within each department by salary descending.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> sorted = employees;
sort(sorted.begin(), sorted.end(),
    [](auto& a, auto& b) {
        if (a.department != b.department) return a.department < b.department;
        return a.salary > b.salary;
    });
for (auto& e : sorted)
    cout << e.department << " | " << e.name << " | " << e.salary << "\\n";`
      },
      {
        title: 'Sort by column position',
        sql: `SELECT name, salary, department
FROM employees
ORDER BY 3, 2 DESC;`,
        explanation: 'Uses numeric positions instead of names. Column 3 (department) ASC, then column 2 (salary) DESC.',
        sourceTables: ['employees'],
        cppRepresentation: `// Uses numeric positions: column 3 (department) ASC, column 2 (salary) DESC
vector<Employee> sorted = employees;
sort(sorted.begin(), sorted.end(),
    [](auto& a, auto& b) {
        if (a.department != b.department) return a.department < b.department;
        return a.salary > b.salary;
    });
for (auto& e : sorted)
    cout << e.name << " | " << e.salary << " | " << e.department << "\\n";`
      },
      {
        title: 'Sort by expression',
        sql: `SELECT name, price, stock,
  price * stock AS inventory_value
FROM products
ORDER BY inventory_value DESC;`,
        explanation: 'Computes inventory value (price × stock) and sorts products by that computed value.',
        sourceTables: ['products'],
        cppRepresentation: `struct Result { string name; double price; int stock; double inventory_value; };
vector<Result> result;
for (auto& p : products)
    result.push_back({p.name, p.price, p.stock, p.price * p.stock});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.inventory_value > b.inventory_value; });
for (auto& r : result)
    cout << r.name << " | " << r.price << " | " << r.stock << " | " << r.inventory_value << "\\n";`
      },
      {
        title: 'ORDER BY with WHERE and LIMIT',
        sql: `SELECT name, department, salary
FROM employees
WHERE status = 'active' AND department IN ('Engineering', 'Product')
ORDER BY salary DESC
LIMIT 4;`,
        explanation: 'Combines WHERE filtering, ORDER BY sorting, and LIMIT truncation — the most common query pattern for "top N" reports.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> target = {"Engineering", "Product"};
vector<Employee> filtered;
for (auto& e : employees)
    if (e.status == "active" && target.contains(e.department))
        filtered.push_back(e);
sort(filtered.begin(), filtered.end(),
    [](auto& a, auto& b) { return a.salary > b.salary; });
int limit = 4;
for (int i = 0; i < min(limit, (int)filtered.size()); i++)
    cout << filtered[i].name << " | " << filtered[i].department << " | " << filtered[i].salary << "\\n";`
      },
      {
        title: 'Custom sort priority with ORDER BY',
        sql: `SELECT name, city, salary
FROM employees
WHERE status = 'active'
ORDER BY
  CASE city
    WHEN 'New York' THEN 1
    WHEN 'San Francisco' THEN 2
    WHEN 'Seattle' THEN 3
    ELSE 4
  END, name;`,
        explanation: 'Uses CASE inside ORDER BY to define a custom sort order. New York comes first, then SF, Seattle, then all other cities alphabetically.',
        sourceTables: ['employees'],
        cppRepresentation: `auto cityPriority = [](string c) {
    if (c == "New York") return 1;
    if (c == "San Francisco") return 2;
    if (c == "Seattle") return 3;
    return 4;
};
vector<Employee> active;
copy_if(employees.begin(), employees.end(), back_inserter(active),
    [](auto& e) { return e.status == "active"; });
sort(active.begin(), active.end(),
    [&](auto& a, auto& b) {
        int pa = cityPriority(a.city), pb = cityPriority(b.city);
        if (pa != pb) return pa < pb;
        return a.name < b.name;
    });
for (auto& e : active)
    cout << e.name << " | " << e.city << " | " << e.salary << "\\n";`
      },
      {
        title: 'ORDER BY with WHERE and computed column',
        sql: `SELECT name, department, salary,
  salary * 12 AS annual_salary
FROM employees
WHERE department IN ('Engineering', 'Product')
ORDER BY annual_salary DESC;`,
        explanation: 'Filters to Engineering and Product departments, computes annual salary in SELECT, then sorts by the computed alias. WHERE runs before ORDER BY.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> target = {"Engineering", "Product"};
struct Result { string name; string department; double salary; double annual_salary; };
vector<Result> result;
for (auto& e : employees)
    if (target.contains(e.department))
        result.push_back({e.name, e.department, e.salary, e.salary * 12});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.annual_salary > b.annual_salary; });
for (auto& r : result)
    cout << r.name << " | " << r.department << " | " << r.salary << " | " << r.annual_salary << "\\n";`
      },
      {
        title: 'Multi-directional sorting',
        sql: `SELECT name, department, salary
FROM employees
WHERE status = 'active'
ORDER BY department ASC, salary DESC;`,
        explanation: 'Sorts by department alphabetically (A to Z) and within each department by salary from highest to lowest — two columns with different directions.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> active;
copy_if(employees.begin(), employees.end(), back_inserter(active),
    [](auto& e) { return e.status == "active"; });
sort(active.begin(), active.end(),
    [](auto& a, auto& b) {
        if (a.department != b.department) return a.department < b.department;
        return a.salary > b.salary;
    });
for (auto& e : active)
    cout << e.name << " | " << e.department << " | " << e.salary << "\\n";`
      },
      {
        title: 'ORDER BY with text length',
        sql: `SELECT name, LENGTH(name) AS name_length, department
FROM employees
ORDER BY LENGTH(name) DESC, name ASC;`,
        explanation: 'Sorts employees by the length of their name (longest first), then alphabetically for names of the same length. Uses the LENGTH() function in ORDER BY.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> sorted = employees;
sort(sorted.begin(), sorted.end(),
    [](auto& a, auto& b) {
        if (a.name.length() != b.name.length()) return a.name.length() > b.name.length();
        return a.name < b.name;
    });
for (auto& e : sorted)
    cout << e.name << " | " << e.name.length() << " | " << e.department << "\\n";`
      },
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
        hint: 'Use WHERE to filter by category, ORDER BY price DESC to sort, and LIMIT 5.',
        solution: `SELECT name, price
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC
LIMIT 5;`
      },
      {
        question: 'Show all employees sorted by department alphabetically, then by salary from highest to lowest within each department.',
        hint: 'Use ORDER BY with two columns.',
        solution: `SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;`
      },
      {
        question: 'Challenge: From the products table, write a query that sorts products first by category in reverse alphabetical order (Z to A), then by price from lowest to highest within each category. Only show products with stock greater than 0. Show name, category, price, and stock columns.',
        hint: 'Use ORDER BY with category DESC (reverse alphabetical) and price ASC. Add WHERE to filter stock > 0.',
        solution: `SELECT name, category, price, stock
FROM products
WHERE stock > 0
ORDER BY category DESC, price ASC;`
      },
      {
        question: 'Challenge: From the employees table, write a query that sorts employees by salary divided by 1000 (as "salary_in_thousands") from highest to lowest, then by name alphabetically for ties. Only show employees with a non-null salary. Show name, salary, and the computed salary_in_thousands column. Limit to 10 rows.',
        hint: 'Use ORDER BY with an expression: salary / 1000.0 DESC. Add a computed column in SELECT with an alias.',
        solution: `SELECT name, salary,
  ROUND(salary / 1000.0, 1) AS salary_in_thousands
FROM employees
WHERE salary IS NOT NULL
ORDER BY salary / 1000.0 DESC, name ASC
LIMIT 10;`
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
        title: 'Count per group',
        sql: `SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
ORDER BY employee_count DESC;`,
        explanation: 'Counts employees in each department, sorted from largest to smallest team.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, int> group;
for (auto& e : employees) group[e.department]++;
vector<pair<string,int>> result(group.begin(), group.end());
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.second > b.second; });`
      },
      {
        title: 'Average per group',
        sql: `SELECT department,
  COUNT(*) AS headcount,
  ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`,
        explanation: 'For each department, shows the headcount and average salary.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& e : employees) {
    groups[e.department].first++;
    groups[e.department].second += e.salary;
}
vector<tuple<string,int,double>> result;
for (auto& [d, v] : groups)
    result.push_back({d, v.first, round(v.second / v.first)});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'Multiple aggregates',
        sql: `SELECT category,
  COUNT(*) AS num_products,
  ROUND(AVG(price), 2) AS avg_price,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive,
  SUM(stock) AS total_stock
FROM products
GROUP BY category;`,
        explanation: 'Shows statistics per product category: count, average price, price range, and total stock.',
        sourceTables: ['products'],
        cppRepresentation: `map<string, vector<Product>> byCat;
for (auto& p : products) byCat[p.category].push_back(p);
for (auto& [cat, items] : byCat) {
    double sum=0, lo=items[0].price, hi=items[0].price;
    int totalStock=0;
    for (auto& p : items) { sum+=p.price; lo=min(lo,p.price); hi=max(hi,p.price); totalStock+=p.stock; }
    cout << cat << " | " << items.size() << " | avg=" << round(sum/items.size()*100)/100
         << " | min=" << lo << " | max=" << hi << " | stock=" << totalStock << "\\n";
}`
      },
      {
        title: 'GROUP BY with WHERE',
        sql: `SELECT department,
  COUNT(*) AS active_count,
  ROUND(AVG(salary), 0) AS avg_active_salary
FROM employees
WHERE status = 'active'
GROUP BY department
ORDER BY avg_active_salary DESC;`,
        explanation: 'First filters to active employees, then groups by department to find average salaries.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& e : employees)
    if (e.status == "active") { groups[e.department].first++; groups[e.department].second += e.salary; }
vector<tuple<string,int,double>> result;
for (auto& [d, v] : groups) result.push_back({d, v.first, round(v.second / v.first)});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'GROUP BY multiple columns',
        sql: `SELECT department, status, COUNT(*) AS count
FROM employees
GROUP BY department, status
ORDER BY department, status;`,
        explanation: 'Groups by both department and status to see the breakdown of active vs inactive employees per department.',
        sourceTables: ['employees'],
        cppRepresentation: `map<pair<string,string>, int> group;
for (auto& e : employees) group[{e.department, e.status}]++;
vector<tuple<string,string,int>> result;
for (auto& [k, c] : group) result.push_back({k.first, k.second, c});
sort(result.begin(), result.end());`
      },
      {
        title: 'GROUP BY on calculated column',
        sql: `SELECT
  CASE
    WHEN salary < 70000 THEN 'Under 70k'
    WHEN salary < 100000 THEN '70k-100k'
    ELSE 'Over 100k'
  END AS salary_band,
  COUNT(*) AS employees,
  ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY salary_band
ORDER BY MIN(salary);`,
        explanation: 'Groups employees into custom salary bands using a CASE expression in GROUP BY. The ORDER BY uses MIN(salary) to keep bands in logical order.',
        sourceTables: ['employees'],
        cppRepresentation: `auto salaryBand = [](double s) -> string {
    if (s < 70000) return "Under 70k";
    if (s < 100000) return "70k-100k";
    return "Over 100k";
};
map<string, vector<double>> groups;
for (auto& e : employees) groups[salaryBand(e.salary)].push_back(e.salary);
for (auto& [band, sals] : groups) {
    double sum=0, lo=sals[0];
    for (double s : sals) { sum+=s; lo=min(lo,s); }
    cout << band << " | count=" << sals.size() << " | avg=" << round(sum/sals.size()) << "\\n";
}`
      },
      {
        title: 'MIN and MAX price per category',
        sql: `SELECT category,
  COUNT(*) AS products,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive,
  ROUND(MAX(price) - MIN(price), 2) AS price_range
FROM products
GROUP BY category
ORDER BY price_range DESC;`,
        explanation: 'Shows the price spread within each category — the difference between the cheapest and most expensive product.',
        sourceTables: ['products'],
        cppRepresentation: `map<string, pair<double,double>> range;
map<string, int> counts;
for (auto& p : products) {
    if (!range.count(p.category)) range[p.category] = {p.price, p.price};
    auto& [lo, hi] = range[p.category];
    lo = min(lo, p.price); hi = max(hi, p.price);
    counts[p.category]++;
}
for (auto& [cat, r] : range)
    cout << cat << " | " << counts[cat] << " | $" << r.first << " - $" << r.second
         << " | range=$" << round((r.second-r.first)*100)/100 << "\\n";`
      },
      {
        title: 'Total orders per customer with SUM',
        sql: `SELECT customer,
  COUNT(*) AS orders_count,
  ROUND(SUM(total), 2) AS total_spent,
  ROUND(AVG(total), 2) AS avg_order_value
FROM orders
GROUP BY customer
ORDER BY total_spent DESC;`,
        explanation: 'A classic customer summary: how many orders, total spent, and average order value per customer.',
        sourceTables: ['orders'],
        cppRepresentation: `map<string, vector<double>> custOrders;
for (auto& o : orders) custOrders[o.customer].push_back(o.total);
for (auto& [c, totals] : custOrders) {
    double sum = 0;
    for (double t : totals) sum += t;
    cout << c << " | orders=" << totals.size() << " | spent=$" << round(sum*100)/100
         << " | avg=$" << round(sum/totals.size()*100)/100 << "\\n";
}`
      },
      {
        title: 'Group by calculated column',
        sql: `SELECT
  CASE
    WHEN total < 50 THEN 'Small'
    WHEN total < 200 THEN 'Medium'
    ELSE 'Large'
  END AS order_size,
  COUNT(*) AS orders,
  ROUND(SUM(total), 2) AS total_revenue,
  ROUND(AVG(total), 2) AS avg_order_value
FROM orders
GROUP BY order_size
ORDER BY MIN(total);`,
        explanation: 'Groups orders into size bands using a CASE expression. The ORDER BY uses MIN(total) to keep bands in logical order from smallest to largest.',
        sourceTables: ['orders'],
        cppRepresentation: `auto sizeBand = [](double t) -> string {
    if (t < 50) return "Small";
    if (t < 200) return "Medium";
    return "Large";
};
map<string, vector<double>> bands;
for (auto& o : orders) bands[sizeBand(o.total)].push_back(o.total);
for (auto& [l, totals] : bands) {
    double sum=0, lo=totals[0];
    for (double t : totals) { sum+=t; lo=min(lo,t); }
    cout << l << " | " << totals.size() << " | $" << round(sum*100)/100
         << " | avg=$" << round(sum/totals.size()*100)/100 << "\\n";
}`
      },
      {
        title: 'Multiple aggregate functions',
        sql: `SELECT customer,
  COUNT(*) AS order_count,
  ROUND(SUM(total), 2) AS total_spent,
  ROUND(AVG(total), 2) AS avg_order,
  MIN(total) AS smallest_order,
  MAX(total) AS largest_order
FROM orders
GROUP BY customer
ORDER BY total_spent DESC;`,
        explanation: 'Demonstrates five aggregate functions in one query per customer: count of orders, total spent, average order value, smallest and largest order.',
        sourceTables: ['orders'],
        cppRepresentation: `map<string, vector<double>> custOrders;
for (auto& o : orders) custOrders[o.customer].push_back(o.total);
for (auto& [c, totals] : custOrders) {
    double sum=0, lo=totals[0], hi=totals[0];
    for (double t : totals) { sum+=t; lo=min(lo,t); hi=max(hi,t); }
    cout << c << " | orders=" << totals.size() << " | total=$" << sum
         << " | avg=$" << sum/totals.size() << " | min=$" << lo << " | max=$" << hi << "\\n";
}`
      },
      {
        title: 'Group by with HAVING preview',
        sql: `SELECT department,
  COUNT(*) AS headcount,
  ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) >= 2
ORDER BY headcount DESC;`,
        explanation: 'Groups employees by department then uses HAVING to keep only departments with 2 or more employees — a preview of filtering groups after aggregation.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, vector<double>> groups;
for (auto& e : employees) groups[e.department].push_back(e.salary);
for (auto& [d, sals] : groups) {
    if (sals.size() >= 2) {
        double sum = 0;
        for (double s : sals) sum += s;
        cout << d << " | " << sals.size() << " | $" << round(sum/sals.size()) << "\\n";
    }
}`
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
        question: 'For each product category, show the total stock (SUM of stock) and the number of products. Sort by total stock descending.',
        hint: 'Use GROUP BY with SUM() and COUNT(). Use ORDER BY for sorting.',
        solution: `SELECT 
  category,
  SUM(stock) AS total_stock,
  COUNT(*) AS product_count
FROM products
GROUP BY category
ORDER BY total_stock DESC;`
      },
      {
        question: 'Find the average salary per department. Show department and avg_salary columns, sorted by average salary descending.',
        hint: 'Use GROUP BY department with AVG(salary) and ROUND.',
        solution: `SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`
      },
      {
        question: 'Challenge: From the products table, find the category with the widest price range (difference between max and min price). Show category, min_price, max_price, and price_range columns. Sort by price_range descending and show only the top result.',
        hint: 'Use GROUP BY with MIN(price), MAX(price), and compute MAX(price) - MIN(price) as an expression. Use ORDER BY and LIMIT.',
        solution: `SELECT category,
  MIN(price) AS min_price,
  MAX(price) AS max_price,
  MAX(price) - MIN(price) AS price_range
FROM products
GROUP BY category
ORDER BY price_range DESC
LIMIT 1;`
      },
      {
        question: 'Challenge: Write a query that shows each category\'s statistics: number of products, average price, total stock, and total potential revenue (SUM of price * stock). Only include products with stock greater than 0 (filter before grouping). Sort by total_potential_revenue descending.',
        hint: 'Use WHERE to filter rows before GROUP BY. Use COUNT, AVG, SUM for aggregation. Only one table — no JOIN needed.',
        solution: `SELECT category,
  COUNT(*) AS product_count,
  ROUND(AVG(price), 2) AS avg_price,
  SUM(stock) AS total_stock,
  ROUND(SUM(price * stock), 2) AS total_potential_revenue
FROM products
WHERE stock > 0
GROUP BY category
ORDER BY total_potential_revenue DESC;`
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
        title: 'Filter groups by count',
        sql: `SELECT department, COUNT(*) AS headcount
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING COUNT(*) >= 2
ORDER BY headcount DESC;`,
        explanation: 'Shows departments with 2 or more active employees. WHERE filters rows first, GROUP BY creates groups, HAVING filters the groups.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, int> deptCount;
for (auto& e : employees)
    if (e.status == "active") deptCount[e.department]++;
vector<pair<string,int>> result;
for (auto& [dept, cnt] : deptCount)
    if (cnt >= 2) result.push_back({dept, cnt});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return a.second > b.second; });`
      },
      {
        title: 'Filter by aggregate value',
        sql: `SELECT category,
  ROUND(AVG(price), 2) AS avg_price,
  COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING AVG(price) > 50;`,
        explanation: 'Finds categories where the average product price exceeds $50.',
        sourceTables: ['products'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& p : products) { groups[p.category].first++; groups[p.category].second += p.price; }
for (auto& [cat, v] : groups)
    if (v.second / v.first > 50)
        cout << cat << " | avg=$" << round(v.second/v.first*100)/100 << " | count=" << v.first << "\\n";`
      },
      {
        title: 'Customer spending threshold',
        sql: `SELECT customer,
  COUNT(*) AS num_orders,
  ROUND(SUM(total), 2) AS total_spent
FROM orders
GROUP BY customer
HAVING SUM(total) > 200
ORDER BY total_spent DESC;`,
        explanation: 'Shows customers who have spent over $200 total, sorted by total spent.',
        sourceTables: ['orders'],
        cppRepresentation: `map<string, pair<int,double>> custGroups;
for (auto& o : orders) { custGroups[o.customer].first++; custGroups[o.customer].second += o.total; }
vector<tuple<string,int,double>> result;
for (auto& [c, v] : custGroups)
    if (v.second > 200) result.push_back({c, v.first, v.second});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'Multiple HAVING conditions',
        sql: `SELECT department,
  COUNT(*) AS employee_count,
  ROUND(AVG(salary), 0) AS avg_salary,
  SUM(salary) AS total_budget
FROM employees
GROUP BY department
HAVING COUNT(*) >= 2 AND AVG(salary) > 70000
ORDER BY total_budget DESC;`,
        explanation: 'Finds departments with at least 2 employees and an average salary above $70,000. Both conditions must be true for the group to appear.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& e : employees) { groups[e.department].first++; groups[e.department].second += e.salary; }
for (auto& [dept, v] : groups) {
    double avg = v.second / v.first;
    if (v.first >= 2 && avg > 70000)
        cout << dept << " | cnt=" << v.first << " | avg=$" << round(avg)
             << " | total=$" << v.second << "\\n";
}`
      },
      {
        title: 'HAVING with MIN and MAX conditions',
        sql: `SELECT category,
  COUNT(*) AS products,
  MIN(price) AS min_price,
  MAX(price) AS max_price
FROM products
GROUP BY category
HAVING MAX(price) > MIN(price) * 10
ORDER BY category;`,
        explanation: 'Finds categories where the most expensive product is at least 10× the cheapest — categories with extreme price variation.',
        sourceTables: ['products'],
        cppRepresentation: `map<string, pair<double,double>> range;
for (auto& p : products) {
    if (!range.count(p.category)) range[p.category] = {p.price, p.price};
    auto& [lo, hi] = range[p.category];
    lo = min(lo, p.price); hi = max(hi, p.price);
}
for (auto& [cat, r] : range)
    if (r.second > r.first * 10)
        cout << cat << " | min=$" << r.first << " | max=$" << r.second << "\\n";`
      },
      {
        title: 'HAVING with SUM comparison',
        sql: `SELECT customer,
  COUNT(*) AS orders,
  ROUND(SUM(total), 2) AS total,
  ROUND(AVG(total), 2) AS avg_order
FROM orders
GROUP BY customer
HAVING COUNT(*) >= 2 AND AVG(total) > 100
ORDER BY total DESC;`,
        explanation: 'Finds repeat customers (2+ orders) whose average order value exceeds $100. Combines two aggregate conditions in HAVING.',
        sourceTables: ['orders'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& o : orders) { groups[o.customer].first++; groups[o.customer].second += o.total; }
vector<tuple<string,int,double,double>> result;
for (auto& [c, v] : groups) {
    double avg = v.second / v.first;
    if (v.first >= 2 && avg > 100) result.push_back({c, v.first, v.second, avg});
}
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'Filter by total and count',
        sql: `SELECT customer,
  COUNT(*) AS order_count,
  ROUND(SUM(total), 2) AS total_spent
FROM orders
GROUP BY customer
HAVING SUM(total) > 100 AND COUNT(*) >= 2
ORDER BY total_spent DESC;`,
        explanation: 'Finds repeat customers who have spent over $100 total using two aggregate conditions in HAVING — both SUM and COUNT must pass for the group to appear.',
        sourceTables: ['orders'],
        cppRepresentation: `map<string, pair<int,double>> groups;
for (auto& o : orders) { groups[o.customer].first++; groups[o.customer].second += o.total; }
vector<tuple<string,int,double>> result;
for (auto& [c, v] : groups)
    if (v.second > 100 && v.first >= 2) result.push_back({c, v.first, v.second});
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });`
      },
      {
        title: 'HAVING with AVG comparison',
        sql: `SELECT department,
  COUNT(*) AS employees,
  ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees)
ORDER BY avg_salary DESC;`,
        explanation: 'Finds departments where the average salary exceeds the company-wide average. The subquery in HAVING computes the overall average for comparison against each group.',
        sourceTables: ['employees'],
        cppRepresentation: `double totalSalary = 0;
for (auto& e : employees) totalSalary += e.salary;
double companyAvg = totalSalary / employees.size();
map<string, pair<int,double>> groups;
for (auto& e : employees) { groups[e.department].first++; groups[e.department].second += e.salary; }
vector<tuple<string,int,double>> result;
for (auto& [dept, v] : groups) {
    double avg = v.second / v.first;
    if (avg > companyAvg)
        result.push_back({dept, v.first, round(avg)});
}
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<2>(a) > get<2>(b); });
for (auto& [dept, cnt, avg] : result)
    cout << dept << " | cnt=" << cnt << " | avg=$" << avg << "\\n";`
      },
      {
        title: 'HAVING with MAX-MIN range',
        sql: `SELECT category,
  COUNT(*) AS products,
  MIN(price) AS min_price,
  MAX(price) AS max_price,
  ROUND(MAX(price) - MIN(price), 2) AS price_range
FROM products
GROUP BY category
HAVING MAX(price) - MIN(price) > 100
ORDER BY price_range DESC;`,
        explanation: 'Filters categories where the price range (max minus min) exceeds $100, revealing categories with significant price spread.',
        sourceTables: ['products'],
        cppRepresentation: `map<string, pair<double,double>> range;
for (auto& p : products) {
    if (!range.count(p.category)) range[p.category] = {p.price, p.price};
    auto& [lo, hi] = range[p.category];
    lo = min(lo, p.price); hi = max(hi, p.price);
}
for (auto& [cat, r] : range) {
    double spread = r.second - r.first;
    if (spread > 100)
        cout << cat << " | $" << r.first << " - $" << r.second << " | spread=$" << round(spread*100)/100 << "\\n";
}`
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
        question: 'Find departments where the average salary is above $65,000 and there are at least 2 employees.',
        hint: 'GROUP BY department, use AVG(salary) and COUNT(*) in HAVING.',
        solution: `SELECT department, 
  COUNT(*) AS headcount,
  ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 65000 AND COUNT(*) >= 2
ORDER BY avg_salary DESC;`
      },
      {
        question: 'Show product categories where the total stock value (SUM of price * stock) exceeds $10,000. Show category and total_stock_value columns.',
        hint: 'Use GROUP BY with SUM in HAVING.',
        solution: `SELECT category, 
  SUM(price * stock) AS total_stock_value
FROM products
GROUP BY category
HAVING SUM(price * stock) > 10000
ORDER BY total_stock_value DESC;`
      },
      {
        question: 'Challenge: From the products table, find categories where the average price is at least double the minimum price in that category. Show category, avg_price, min_price, and the ratio (avg_price / min_price) rounded to 2 decimal places. Sort by the ratio descending.',
        hint: 'Use GROUP BY with AVG and MIN. Use HAVING AVG(price) >= MIN(price) * 2. Compute ratio as AVG(price) / MIN(price).',
        solution: `SELECT category,
  ROUND(AVG(price), 2) AS avg_price,
  MIN(price) AS min_price,
  ROUND(AVG(price) / MIN(price), 2) AS ratio
FROM products
GROUP BY category
HAVING AVG(price) >= MIN(price) * 2
ORDER BY ratio DESC;`
      },
      {
        question: 'Challenge: From the employees table, find departments where the total salary budget exceeds $150,000 and the average salary is above $55,000. Show department, total_salary, avg_salary, and employee_count columns. Sort by total_salary descending.',
        hint: 'Use GROUP BY department with SUM, AVG, and COUNT. Use HAVING with multiple conditions connected by AND.',
        solution: `SELECT department,
  SUM(salary) AS total_salary,
  ROUND(AVG(salary), 2) AS avg_salary,
  COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING SUM(salary) > 150000 AND AVG(salary) > 55000
ORDER BY total_salary DESC;`
      },
    ]
  },
  {
    id: 'beginner-practice',
    title: 'Beginner Practice',
    description: 'Review all beginner SQL concepts',
    icon: '📝',
    difficulty: 'beginner',
    prerequisites: ['select', 'where', 'order-by', 'group-by', 'having'],
    topics: ['Practice', 'Review'],
    explanation: `This practice set tests everything you've learned in the beginner section: SELECT, WHERE, ORDER BY, GROUP BY, and HAVING.

Each question combines multiple concepts to challenge your understanding. Try to solve them without looking at the hints first!`,
    examples: [],
    commonMistakes: [],
    practiceQuestions: [
      {
        question: 'Find the top 2 highest-paid active employees in the Engineering department. Show name, department, and salary.',
        hint: 'WHERE status = \'active\' AND department = \'Engineering\', ORDER BY salary DESC, LIMIT 2.',
        solution: `SELECT name, department, salary
FROM employees
WHERE status = 'active' AND department = 'Engineering'
ORDER BY salary DESC
LIMIT 2;`
      },
      {
        question: 'Show how many products each category has, the average price, and the total stock. Only include categories where the average price is over $50. Sort by total stock descending.',
        hint: 'Use GROUP BY with COUNT, AVG, SUM, then HAVING AVG(price) > 50. ORDER BY total_stock DESC.',
        solution: `SELECT category,
  COUNT(*) AS product_count,
  ROUND(AVG(price), 2) AS avg_price,
  SUM(stock) AS total_stock
FROM products
GROUP BY category
HAVING AVG(price) > 50
ORDER BY total_stock DESC;`
      },
      {
        question: 'Find employees whose salary is above the average salary of all employees, grouped by department. For each such department, show how many high earners there are and the average salary of those high earners.',
        hint: 'First use WHERE salary > (SELECT AVG(salary) FROM employees), then GROUP BY department.',
        solution: `SELECT department,
  COUNT(*) AS high_earners,
  ROUND(AVG(salary), 0) AS avg_high_salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
GROUP BY department
ORDER BY avg_high_salary DESC;`
      },
      {
        question: 'List products that cost more than $50, sorted by category alphabetically and then by price descending within each category. Show name, category, and price. Limit to the first 5 results.',
        hint: 'WHERE price > 50, ORDER BY category ASC, price DESC, LIMIT 5.',
        solution: `SELECT name, category, price
FROM products
WHERE price > 50
ORDER BY category ASC, price DESC
LIMIT 5;`
      },
      {
        question: 'Write a query that uses DISTINCT to find all unique department-city combinations from employees, aliasing them as "dept" and "location".',
        hint: 'Use DISTINCT on two columns with AS aliases.',
        solution: `SELECT DISTINCT department AS dept, city AS location
FROM employees;`
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

-- RIGHT JOIN
SELECT a.col, b.col
FROM table_a a
RIGHT JOIN table_b b ON a.id = b.a_id;

-- FULL JOIN
SELECT a.col, b.col
FROM table_a a
FULL JOIN table_b b ON a.id = b.a_id;

-- CROSS JOIN
SELECT a.col, b.col
FROM table_a a
CROSS JOIN table_b b;

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
        title: 'INNER JOIN — matching rows only',
        sql: `SELECT o.id AS order_id,
  o.customer,
  p.name AS product,
  o.quantity,
  o.total
FROM orders o
JOIN products p ON o.product_id = p.id
ORDER BY o.total DESC;`,
        explanation: 'Joins orders to their product details. Only orders with valid product_ids appear. The ON clause specifies how rows match.',
        sourceTables: ['orders', 'products'],
        cppRepresentation: `struct Order { int id; string customer; int product_id; int quantity; double total; };
struct Product { int id; string name; double price; };
vector<tuple<int,string,string,int,double>> result;
for (auto& o : orders)
    for (auto& p : products)
        if (o.product_id == p.id) {
            result.push_back({o.id, o.customer, p.name, o.quantity, o.total});
            break;
        }
sort(result.begin(), result.end(),
    [](auto& a, auto& b) { return get<4>(a) > get<4>(b); });`
      },
      {
        title: 'LEFT JOIN — include all from left',
        sql: `SELECT p.name,
  p.price,
  o.id AS order_id,
  o.customer
FROM products p
LEFT JOIN orders o ON p.id = o.product_id;`,
        explanation: 'Shows all products, even ones never ordered. Products without orders get NULL for order_id and customer. INNER JOIN would exclude them.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `vector<tuple<string,double,optional<int>,optional<string>>> result;
for (auto& p : products) {
    bool matched = false;
    for (auto& o : orders)
        if (p.id == o.product_id) { result.push_back({p.name, p.price, o.id, o.customer}); matched = true; }
    if (!matched) result.push_back({p.name, p.price, nullopt, nullopt});
}`
      },
      {
        title: 'LEFT JOIN — find missing matches',
        sql: `SELECT p.name, p.category
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
WHERE o.id IS NULL;`,
        explanation: 'Finds products that have never been ordered. The LEFT JOIN adds NULLs where no match exists; WHERE o.id IS NULL keeps only those.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `vector<pair<string,string>> result;
for (auto& p : products) {
    bool found = false;
    for (auto& o : orders) if (p.id == o.product_id) { found = true; break; }
    if (!found) result.push_back({p.name, p.category});
}`
      },
      {
        title: 'RIGHT JOIN — all from right table',
        sql: `SELECT o.id AS order_id,
  o.customer,
  p.name AS product,
  o.total
FROM orders o
RIGHT JOIN products p ON o.product_id = p.id
ORDER BY p.name;`,
        explanation: 'RIGHT JOIN keeps all rows from the RIGHT table (products), matching orders where they exist. Products without orders get NULL for order_id and customer. This is the mirror of LEFT JOIN — swap table order to convert between them.',
        sourceTables: ['orders', 'products'],
        cppRepresentation: `vector<tuple<optional<int>,optional<string>,string,optional<double>>> result;
for (auto& p : products) {
    bool matched = false;
    for (auto& o : orders)
        if (o.product_id == p.id) { result.push_back({o.id, o.customer, p.name, o.total}); matched = true; }
    if (!matched) result.push_back({nullopt, nullopt, p.name, nullopt});
}
sort(result.begin(), result.end(), [](auto& a, auto& b) { return get<2>(a) < get<2>(b); });`
      },
      {
        title: 'FULL JOIN — all rows from both tables',
        sql: `SELECT e.name AS employee,
  e.department,
  o.id AS order_id,
  o.total
FROM employees e
FULL JOIN orders o ON e.name = o.customer
ORDER BY e.name, o.id;`,
        explanation: 'FULL JOIN keeps all rows from BOTH tables. Employees without orders show NULL for order columns. Orders that don\'t match any employee (if any) would also appear. FULL JOIN = LEFT JOIN + RIGHT JOIN + INNER JOIN combined.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `struct Row { optional<string> name; optional<string> dept; optional<int> oid; optional<double> total; };
set<string> matchedCustomers;
vector<Row> result;
for (auto& e : employees) {
    bool matched = false;
    for (auto& o : orders)
        if (e.name == o.customer) { result.push_back({e.name, e.department, o.id, o.total}); matched=true; matchedCustomers.insert(e.name); }
    if (!matched) result.push_back({e.name, e.department, nullopt, nullopt});
}
for (auto& o : orders)
    if (!matchedCustomers.contains(o.customer))
        result.push_back({nullopt, nullopt, o.id, o.total});
sort(result.begin(), result.end(), [](auto& a, auto& b) { return tie(a.name, a.oid) < tie(b.name, b.oid); });`
      },
      {
        title: 'Joining a table to itself',
        sql: `SELECT e1.name AS employee,
  e1.salary,
  e2.name AS higher_earner,
  e2.salary AS higher_salary
FROM employees e1
JOIN employees e2 ON e1.salary < e2.salary
WHERE e1.department = 'Engineering'
ORDER BY e1.name, e2.salary;`,
        explanation: 'A self-join finds Engineering employees and all colleagues who earn more than them. The table appears twice with different aliases.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e1 : employees) {
    if (e1.department != "Engineering") continue;
    for (auto& e2 : employees)
        if (e1.salary < e2.salary)
            cout << e1.name << " ($" << e1.salary << ") | " << e2.name << " ($" << e2.salary << ")\\n";
}`
      },
      {
        title: 'CROSS JOIN — all combinations',
        sql: `SELECT e.name AS employee,
  e.department,
  p.name AS product
FROM employees e
CROSS JOIN products p
WHERE e.department = 'Engineering'
ORDER BY e.name, p.name
LIMIT 15;`,
        explanation: 'CROSS JOIN produces every combination of rows (cartesian product). Engineering employees matched with every product. Use cautiously — results grow exponentially.',
        sourceTables: ['employees', 'products'],
        cppRepresentation: `vector<tuple<string,string,string>> result;
for (auto& e : employees)
    if (e.department == "Engineering")
        for (auto& p : products)
            result.push_back({e.name, e.department, p.name});
sort(result.begin(), result.end());
if (result.size() > 15) result.resize(15);`
      },
      {
        title: 'JOIN with WHERE filtering',
        sql: `SELECT o.id AS order_id,
  o.customer,
  p.name AS product,
  o.quantity,
  o.total
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE p.category = 'Electronics'
  AND o.total > 100
ORDER BY o.total DESC;`,
        explanation: 'After joining orders to products, WHERE filters the combined results to only Electronics orders over $100.',
        sourceTables: ['orders', 'products'],
        cppRepresentation: `vector<tuple<int,string,string,int,double>> result;
for (auto& o : orders)
    for (auto& p : products)
        if (o.product_id == p.id && p.category == "Electronics" && o.total > 100) {
            result.push_back({o.id, o.customer, p.name, o.quantity, o.total}); break;
        }
sort(result.begin(), result.end(), [](auto& a, auto& b) { return get<4>(a) > get<4>(b); });`
      },
      {
        title: 'LEFT JOIN — all employees and any orders',
        sql: `SELECT e.name,
  e.department,
  o.id AS order_id,
  o.total
FROM employees e
LEFT JOIN orders o ON e.name = o.customer
ORDER BY e.name;`,
        explanation: 'Shows each employee alongside any orders they placed (matched by name). Employees without orders get NULL for order columns. This is using name matching since employees and orders share customer names.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `vector<tuple<string,string,optional<int>,optional<double>>> result;
for (auto& e : employees) {
    bool matched = false;
    for (auto& o : orders)
        if (e.name == o.customer) { result.push_back({e.name, e.department, o.id, o.total}); matched = true; }
    if (!matched) result.push_back({e.name, e.department, nullopt, nullopt});
}
sort(result.begin(), result.end());`
      },
      {
        title: 'Multiple JOINs',
        sql: `SELECT o.id AS order_id,
  o.customer,
  p.name AS product,
  p.category,
  o.quantity,
  o.total,
  e.department AS customer_department
FROM orders o
JOIN products p ON o.product_id = p.id
JOIN employees e ON o.customer = e.name
ORDER BY o.total DESC;`,
        explanation: 'Joins all three tables: orders to products by product_id, and orders to employees by customer name. Shows order details enriched with product info and the purchasing employee department.',
        sourceTables: ['orders', 'products', 'employees'],
        cppRepresentation: `vector<tuple<int,string,string,string,int,double,string>> result;
for (auto& o : orders) {
    Product* mp = nullptr; Employee* me = nullptr;
    for (auto& p : products) if (o.product_id == p.id) mp = &p;
    for (auto& e : employees) if (o.customer == e.name) me = &e;
    if (mp && me) result.push_back({o.id, o.customer, mp->name, mp->category, o.quantity, o.total, me->department});
}
sort(result.begin(), result.end(), [](auto& a, auto& b) { return get<5>(a) > get<5>(b); });`
      },
      {
        title: 'JOIN with GROUP BY',
        sql: `SELECT p.category,
  COUNT(DISTINCT o.id) AS orders_count,
  ROUND(SUM(o.total), 2) AS total_revenue,
  ROUND(AVG(o.total), 2) AS avg_order_value
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;`,
        explanation: 'Joins products to orders then groups by product category. LEFT JOIN ensures categories with no orders still appear with zero counts.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `set<string> allCats;
for (auto& p : products) allCats.insert(p.category);
map<string, vector<double>> rev;
map<string, set<int>> catOids;
for (auto& p : products)
    for (auto& o : orders)
        if (p.id == o.product_id) {
            rev[p.category].push_back(o.total);
            catOids[p.category].insert(o.id);
        }
for (auto& cat : allCats) {
    auto& totals = rev[cat];
    double sum = accumulate(totals.begin(), totals.end(), 0.0);
    int cnt = catOids[cat].size();
    cout << cat << " | orders=" << cnt << " | rev=$" << round(sum*100)/100
         << " | avg=$" << (totals.empty() ? 0.0 : round(sum/totals.size()*100)/100) << "\\n";
}`
      },
      {
        title: 'Self-Join for same-department peers',
        sql: `SELECT e1.name AS employee,
  e1.salary,
  e2.name AS peer,
  e2.salary AS peer_salary
FROM employees e1
JOIN employees e2 ON e1.department = e2.department
  AND e1.name < e2.name
  AND e1.salary <> e2.salary
ORDER BY e1.department, e1.name;`,
        explanation: 'A self-join finds same-department pairs with different salaries. The e1.name < e2.name condition prevents duplicate pairs and self-matches.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e1 : employees)
    for (auto& e2 : employees)
        if (e1.department == e2.department && e1.name < e2.name && e1.salary != e2.salary)
            cout << e1.name << " ($" << e1.salary << ") | " << e2.name << " ($" << e2.salary << ")\\n";`
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
        question: 'List all products and their total order quantity. Include products that have never been ordered (they should show NULL for quantity).',
        hint: 'Use LEFT JOIN from products to orders, GROUP BY product, and SUM(quantity).',
        solution: `SELECT 
  p.name,
  p.price,
  SUM(o.quantity) AS total_ordered
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
GROUP BY p.name, p.price
ORDER BY total_ordered DESC NULLS LAST;`
      },
      {
        question: 'Find pairs of employees in the same department where one earns more than the other. Show both names, their salaries, and department.',
        hint: 'Use a SELF JOIN on employees with e1.department = e2.department AND e1.salary > e2.salary.',
        solution: `SELECT 
  e1.name AS higher_earner,
  e1.salary,
  e2.name AS lower_earner,
  e2.salary,
  e1.department
FROM employees e1
JOIN employees e2 ON e1.department = e2.department AND e1.salary > e2.salary
ORDER BY e1.department, e1.salary DESC;`
      },
      {
        question: 'Challenge: Find products that have never been ordered. Use a LEFT JOIN between products and orders to identify products with no matching orders. Show product name, price, and category columns.',
        hint: 'LEFT JOIN products to orders, then filter WHERE orders.id IS NULL. This finds products with no matching order records.',
        solution: `SELECT p.name, p.price, p.category
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
WHERE o.id IS NULL;`
      },
      {
        question: 'Challenge: Find customers who have placed orders totaling more than $200. Use an INNER JOIN between orders and a subquery that aggregates per customer. Show customer name, order count, and total spent.',
        hint: 'First aggregate in a subquery or CTE: GROUP BY customer with SUM(total) and COUNT(*). Then JOIN or filter with WHERE.',
        solution: `SELECT o.customer,
  COUNT(*) AS order_count,
  ROUND(SUM(o.total), 2) AS total_spent
FROM orders o
GROUP BY o.customer
HAVING SUM(o.total) > 200
ORDER BY total_spent DESC;`
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
        title: 'Scalar subquery in SELECT',
        sql: `SELECT name, salary,
  (SELECT ROUND(AVG(salary), 0) FROM employees) AS company_avg,
  ROUND(100.0 * salary / (SELECT AVG(salary) FROM employees), 1) AS pct_of_avg
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`,
        explanation: 'The subquery in parentheses runs first to find the average salary. The outer query then uses that value to filter and compare.',
        sourceTables: ['employees'],
        cppRepresentation: `double total=0; for (auto& e:employees) total+=e.salary; double companyAvg=total/employees.size();
for (auto& e:employees)
    if (e.salary>companyAvg)
        cout<<e.name<<" | "<<e.salary<<" | "<<round(companyAvg)<<" | "<<round(100.0*e.salary/companyAvg*10)/10<<"%\\n";`
      },
      {
        title: 'Subquery with IN',
        sql: `SELECT name, department, salary
FROM employees
WHERE department IN (
  SELECT department
  FROM employees
  WHERE salary > 90000
);`,
        explanation: 'The inner query finds departments with high earners. The outer query returns all employees in those departments.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> highDepts;
for (auto& e:employees) if (e.salary>90000) highDepts.insert(e.department);
for (auto& e:employees) if (highDepts.count(e.department))
    cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'EXISTS — correlated subquery',
        sql: `SELECT p.name, p.price, p.category
FROM products p
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.product_id = p.id
    AND o.total > 500
);`,
        explanation: 'For each product, the EXISTS check runs the subquery. If that product has an order over $500, the product is included.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `vector<Product> products={/*...*/}; vector<Order> orders={/*...*/};
for (auto& p:products) {
    bool found=false;
    for (auto& o:orders) if (o.product_id==p.id && o.total>500) { found=true; break; }
    if (found) cout<<p.name<<" | "<<p.price<<" | "<<p.category<<"\\n";
}`
      },
      {
        title: 'Subquery in FROM (derived table)',
        sql: `SELECT department,
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
        explanation: 'First computes department statistics in a subquery, then filters and sorts the results.',
        cppRepresentation: `map<string,pair<double,int>> acc;
for (auto& e:employees) { acc[e.department].first+=e.salary; acc[e.department].second++; }
vector<tuple<string,double,int>> deptStats;
for (auto& [dept,a]:acc) {
    double avg=a.first/a.second;
    if (a.second>=5) deptStats.emplace_back(dept,avg,a.second);
}
sort(deptStats.begin(),deptStats.end(),[](auto& x,auto& y){return get<1>(x)>get<1>(y);});
for (auto& [dept,avg,cnt]:deptStats) cout<<dept<<" | "<<cnt<<"\\n";`
      },
      {
        title: 'NOT EXISTS — finding missing records',
        sql: `SELECT p.name, p.price, p.category
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.product_id = p.id
);`,
        explanation: 'NOT EXISTS finds products that have no matching orders. For each product, the subquery checks if any order references it.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `set<int> orderedIds;
for (auto& o:orders) orderedIds.insert(o.product_id);
for (auto& p:products) if (!orderedIds.count(p.id))
    cout<<p.name<<" | "<<p.price<<" | "<<p.category<<"\\n";`
      },
      {
        title: 'Subquery with comparison operator',
        sql: `SELECT name, salary, department
FROM employees
WHERE salary > (
  SELECT AVG(salary) FROM employees
)
ORDER BY salary DESC;`,
        explanation: 'The subquery computes the company-wide average salary once. The outer query finds all employees earning above that average.',
        sourceTables: ['employees'],
        cppRepresentation: `double total=0; for (auto& e:employees) total+=e.salary; double avgSal=total/employees.size();
vector<Employee> above;
for (auto& e:employees) if (e.salary>avgSal) above.push_back(e);
sort(above.begin(),above.end(),[](auto& a,auto& b){return a.salary>b.salary;});
for (auto& e:above) cout<<e.name<<" | "<<e.salary<<" | "<<e.department<<"\\n";`
      },
      {
        title: 'Nested subqueries',
        sql: `SELECT name, department, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department IN (
    SELECT department
    FROM employees
    GROUP BY department
    HAVING AVG(salary) > 70000
  )
)
ORDER BY salary DESC;`,
        explanation: 'The innermost subquery finds departments with avg salary > $70k. The middle subquery computes the average of those departments. The outer query finds employees above that average.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,pair<double,int>> acc;
for (auto& e:employees) { acc[e.department].first+=e.salary; acc[e.department].second++; }
set<string> highDepts; double subsetTotal=0, subsetCount=0;
for (auto& [dept,a]:acc) { double avg=a.first/a.second;
    if (avg>70000) { highDepts.insert(dept); subsetTotal+=a.first; subsetCount+=a.second; } }
double threshold=subsetTotal/subsetCount;
for (auto& e:employees) if (e.salary>threshold)
    cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'Subquery in SELECT for comparison',
        sql: `SELECT name, department, salary,
  (SELECT ROUND(AVG(salary), 0) FROM employees e2 WHERE e2.department = employees.department) AS dept_avg_salary,
  ROUND(salary - (SELECT AVG(salary) FROM employees e2 WHERE e2.department = employees.department), 0) AS diff_from_dept_avg
FROM employees
ORDER BY department, salary DESC;`,
        explanation: 'Shows each employee\'s salary versus their department\'s average using a correlated scalar subquery in SELECT. The dept_avg_salary and difference are computed per row.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,pair<double,int>> acc;
for (auto& e:employees) { acc[e.department].first+=e.salary; acc[e.department].second++; }
map<string,double> deptAvg;
for (auto& [dept,a]:acc) deptAvg[dept]=a.first/a.second;
auto sorted=employees;
sort(sorted.begin(),sorted.end(),[](auto& a,auto& b){
    if (a.department!=b.department) return a.department<b.department; return a.salary>b.salary;});
for (auto& e:sorted) cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<round(deptAvg[e.department])<<" | "<<round(e.salary-deptAvg[e.department])<<"\\n";`
      },
      {
        title: 'Multiple subqueries in one query',
        sql: `SELECT name,
  department,
  salary,
  (SELECT ROUND(AVG(salary), 0) FROM employees) AS company_avg,
  (SELECT MAX(salary) FROM employees WHERE department = employees.department) AS dept_max,
  ROUND(100.0 * salary / (SELECT AVG(salary) FROM employees), 1) AS pct_of_company_avg
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Two different scalar subqueries in SELECT compute the company-wide average and the department maximum salary side by side with each employee\'s data.',
        sourceTables: ['employees'],
        cppRepresentation: `double total=0; for (auto& e:employees) total+=e.salary; double companyAvg=total/employees.size();
map<string,double> deptMax;
for (auto& e:employees) if (e.salary>deptMax[e.department]) deptMax[e.department]=e.salary;
auto sorted=employees;
sort(sorted.begin(),sorted.end(),[](auto& a,auto& b){return a.salary>b.salary;});
for (auto& e:sorted) cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<round(companyAvg)<<" | "<<deptMax[e.department]<<" | "<<round(100.0*e.salary/companyAvg*10)/10<<"%\\n";`
      },
      {
        title: 'NOT IN with subquery',
        sql: `SELECT name, category, price
FROM products
WHERE id NOT IN (
  SELECT DISTINCT product_id
  FROM orders
  WHERE product_id IS NOT NULL
)
ORDER BY price DESC;`,
        explanation: 'Finds products that have never been ordered. The subquery returns all product_ids that appear in orders; NOT IN excludes them from the result.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `set<int> orderedIds;
for (auto& o:orders) orderedIds.insert(o.product_id);
vector<Product> neverOrdered;
for (auto& p:products) if (!orderedIds.count(p.id)) neverOrdered.push_back(p);
sort(neverOrdered.begin(),neverOrdered.end(),[](auto& a,auto& b){return a.price>b.price;});
for (auto& p:neverOrdered) cout<<p.name<<" | "<<p.category<<" | "<<p.price<<"\\n";`
      },
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
        question: 'Find departments that have no employees assigned. (Use a subquery with NOT IN on the employees table to check which departments have no staff.)',
        hint: 'List of actual departments: Engineering, Product, Marketing, Sales, HR.',
        solution: `SELECT d.department
FROM (
  SELECT 'Engineering' AS department
  UNION SELECT 'Product'
  UNION SELECT 'Marketing'
  UNION SELECT 'Sales'
  UNION SELECT 'HR'
) d
WHERE d.department NOT IN (
  SELECT DISTINCT department FROM employees
);`
      },
      {
        question: 'Challenge: Write a query that uses a scalar subquery in the SELECT clause to show each product\'s name, price, and what percentage its price represents of the total price of ALL products. Round the percentage to 2 decimal places. Sort by percentage descending.',
        hint: 'Use a scalar subquery: (SELECT SUM(price) FROM products) to get the total. Then compute price * 100.0 / total in the SELECT.',
        solution: `SELECT name, price,
  ROUND(price * 100.0 / (SELECT SUM(price) FROM products), 2) AS pct_of_total
FROM products
ORDER BY pct_of_total DESC;`
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
        title: 'Categorize values with searched CASE',
        sql: `SELECT name, salary,
  CASE
    WHEN salary < 70000 THEN 'Junior'
    WHEN salary < 90000 THEN 'Mid'
    WHEN salary < 110000 THEN 'Senior'
    ELSE 'Executive'
  END AS level
FROM employees
ORDER BY salary;`,
        explanation: 'Assigns each employee a level based on their salary. Conditions are checked top to bottom — first match wins.',
        sourceTables: ['employees'],
        cppRepresentation: `struct Employee{string name;int salary;};
auto level=[](int s)->string{
    if(s<70000)return"Junior";if(s<90000)return"Mid";if(s<110000)return"Senior";return"Executive";};
vector<Employee> sorted=employees;
sort(sorted.begin(),sorted.end(),[](auto& a,auto& b){return a.salary<b.salary;});
for(auto& e:sorted)cout<<e.name<<" | "<<e.salary<<" | "<<level(e.salary)<<"\\n";`
      },
      {
        title: 'Simple CASE expression',
        sql: `SELECT name, department,
  CASE department
    WHEN 'Engineering' THEN 'Tech'
    WHEN 'Product' THEN 'Tech'
    WHEN 'Marketing' THEN 'Business'
    ELSE 'Other'
  END AS team_type,
  salary
FROM employees;`,
        explanation: 'Maps department names to broader team categories using the simple CASE form (one expression compared to multiple values).',
        sourceTables: ['employees'],
        cppRepresentation: `auto teamType=[](string d)->string{
    if(d=="Engineering")return"Tech";if(d=="Product")return"Tech";if(d=="Marketing")return"Business";return"Other";};
for(auto& e:employees)cout<<e.name<<" | "<<e.department<<" | "<<teamType(e.department)<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'Custom sort order with CASE',
        sql: `SELECT name, city, salary
FROM employees
ORDER BY
  CASE city
    WHEN 'New York' THEN 1
    WHEN 'San Francisco' THEN 2
    WHEN 'Chicago' THEN 3
    ELSE 4
  END, name;`,
        explanation: 'Sorts employees by a custom city priority (New York first, then SF, then Chicago, then others). CASE in ORDER BY overrides alphabetical sorting.',
        sourceTables: ['employees'],
        cppRepresentation: `auto cityPri=[](string c){if(c=="New York")return 1;if(c=="San Francisco")return 2;if(c=="Chicago")return 3;return 4;};
sort(employees.begin(),employees.end(),[&](auto& a,auto& b){
    int pa=cityPri(a.city),pb=cityPri(b.city);if(pa!=pb)return pa<pb;return a.name<b.name;});
for(auto& e:employees)cout<<e.name<<" | "<<e.city<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'Conditional aggregation',
        sql: `SELECT department,
  COUNT(*) AS total,
  SUM(CASE WHEN salary >= 100000 THEN 1 ELSE 0 END) AS high_earners,
  ROUND(AVG(CASE WHEN status = 'active' THEN salary END), 0) AS avg_active_salary
FROM employees
GROUP BY department;`,
        explanation: 'Uses CASE inside aggregate functions to compute conditional counts and averages per department.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,vector<Employee>> byDept;
for(auto& e:employees)byDept[e.department].push_back(e);
for(auto& [dept,emps]:byDept) {
    int high=0,sumAct=0,cntAct=0;
    for(auto& e:emps){if(e.salary>=100000)high++;if(e.status=="active"){sumAct+=e.salary;cntAct++;}}
    cout<<dept<<" | total="<<emps.size()<<" | high="<<high<<" | avgAct="<<(cntAct?sumAct/cntAct:0)<<"\\n";
}`
      },
      {
        title: 'CASE in WHERE clause',
        sql: `SELECT name, department, salary,
  CASE
    WHEN city IN ('New York', 'San Francisco') THEN 'High COL'
    ELSE 'Standard COL'
  END AS cost_of_living
FROM employees
WHERE
  CASE
    WHEN department = 'Engineering' THEN salary >= 80000
    WHEN department = 'Marketing' THEN salary >= 60000
    ELSE salary >= 70000
  END;`,
        explanation: 'CASE in WHERE applies different salary thresholds per department. Engineers must earn $80k+, Marketing $60k+, others $70k+.',
        sourceTables: ['employees'],
        cppRepresentation: `auto passes=[](Employee& e){
    if(e.department=="Engineering")return e.salary>=80000;
    if(e.department=="Marketing")return e.salary>=60000;
    return e.salary>=70000;};
for(auto& e:employees) {
    if(!passes(e))continue;
    string col=(e.city=="New York"||e.city=="San Francisco")?"High COL":"Standard COL";
    cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<col<<"\\n";
}`
      },
      {
        title: 'CASE for boolean flag columns',
        sql: `SELECT name, department, salary,
  CASE WHEN salary >= 100000 THEN 1 ELSE 0 END AS is_high_earner,
  CASE WHEN status = 'inactive' THEN 1 ELSE 0 END AS is_inactive,
  CASE WHEN city = 'New York' THEN 1 ELSE 0 END AS in_nyc
FROM employees
ORDER BY is_high_earner DESC, salary DESC;`,
        explanation: 'CASE can create 0/1 boolean flags for each condition. These flags are useful for counting, filtering, or feeding into other systems.',
        sourceTables: ['employees'],
        cppRepresentation: `struct Result{string name,dept;int salary,isHigh,isInactive,inNyc;};
vector<Result> results;
for(auto& e:employees)results.push_back({e.name,e.department,e.salary,
    e.salary>=100000?1:0,e.status=="inactive"?1:0,e.city=="New York"?1:0});
sort(results.begin(),results.end(),[](auto& a,auto& b){
    if(a.isHigh!=b.isHigh)return a.isHigh>b.isHigh;return a.salary>b.salary;});`
      },
      {
        title: 'CASE with date-based logic',
        sql: `SELECT id, customer, total, order_date,
  CASE
    WHEN order_date >= '2024-10-01' AND order_date < '2025-01-01' THEN 'Q4 2024'
    WHEN order_date >= '2024-07-01' AND order_date < '2024-10-01' THEN 'Q3 2024'
    WHEN order_date >= '2024-04-01' AND order_date < '2024-07-01' THEN 'Q2 2024'
    WHEN order_date >= '2024-01-01' AND order_date < '2024-04-01' THEN 'Q1 2024'
    ELSE 'Earlier'
  END AS quarter,
  CASE
    WHEN order_date >= '2024-01-01' AND order_date < '2025-01-01' THEN 'This Year'
    ELSE 'Previous'
  END AS year_group
FROM orders
ORDER BY order_date;`,
        explanation: 'Categorizes orders into quarters and year groups based on order_date using CASE with date range conditions.',
        sourceTables: ['orders'],
        cppRepresentation: `struct Order{int id;string customer,order_date;double total;};
for(auto& o:orders) {
    string q;
    if(o.order_date>="2024-10-01"&&o.order_date<"2025-01-01")q="Q4 2024";
    else if(o.order_date>="2024-07-01"&&o.order_date<"2024-10-01")q="Q3 2024";
    else if(o.order_date>="2024-04-01"&&o.order_date<"2024-07-01")q="Q2 2024";
    else if(o.order_date>="2024-01-01"&&o.order_date<"2024-04-01")q="Q1 2024";
    else q="Earlier";
    string yg=(o.order_date>="2024-01-01"&&o.order_date<"2025-01-01")?"This Year":"Previous";
    cout<<o.id<<" | "<<o.customer<<" | "<<o.total<<" | "<<q<<" | "<<yg<<"\\n";
}`
      },
      {
        title: 'Nested CASE for complex rules',
        sql: `SELECT name, department, salary, city,
  CASE
    WHEN department = 'Engineering' THEN
      CASE
        WHEN salary >= 110000 THEN 'Senior Engineer'
        WHEN salary >= 80000 THEN 'Engineer'
        ELSE 'Junior Engineer'
      END
    WHEN department = 'Marketing' THEN
      CASE
        WHEN salary >= 90000 THEN 'Senior Marketer'
        ELSE 'Marketer'
      END
    ELSE
      CASE
        WHEN salary >= 100000 THEN 'Senior Staff'
        ELSE 'Staff'
      END
  END AS role_title
FROM employees
ORDER BY department, salary DESC;`,
        explanation: 'A CASE expression nested inside another CASE applies different salary bands per department, creating multi-level conditional logic.',
        sourceTables: ['employees'],
        cppRepresentation: `string roleTitle(Employee& e) {
    if(e.department=="Engineering"){if(e.salary>=110000)return"Senior Engineer";if(e.salary>=80000)return"Engineer";return"Junior Engineer";}
    if(e.department=="Marketing"){if(e.salary>=90000)return"Senior Marketer";return"Marketer";}
    if(e.salary>=100000)return"Senior Staff";return"Staff";
}
for(auto& e:employees)cout<<e.name<<" | "<<e.department<<" | "<<roleTitle(e)<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'CASE in ORDER BY for custom priority',
        sql: `SELECT name, department, salary, city, status
FROM employees
WHERE status = 'active'
ORDER BY
  CASE
    WHEN department = 'Engineering' AND salary >= 100000 THEN 1
    WHEN department = 'Engineering' THEN 2
    WHEN salary >= 90000 THEN 3
    WHEN city = 'New York' THEN 4
    ELSE 5
  END, name;`,
        explanation: 'CASE in ORDER BY defines a custom sort priority: high-paid Engineers first, then all Engineers, then high earners, then NYC employees, then everyone else.',
        sourceTables: ['employees'],
        cppRepresentation: `auto pri=[](Employee& e){
    if(e.department=="Engineering"&&e.salary>=100000)return 1;
    if(e.department=="Engineering")return 2;if(e.salary>=90000)return 3;
    if(e.city=="New York")return 4;return 5;};
vector<Employee> active;
copy_if(employees.begin(),employees.end(),back_inserter(active),[](auto& e){return e.status=="active";});
sort(active.begin(),active.end(),[&](auto& a,auto& b){int pa=pri(a),pb=pri(b);if(pa!=pb)return pa<pb;return a.name<b.name;});`
      },
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
        question: 'Show each employee with a bonus column: 20% of salary if they are in Engineering, 10% if in Sales, otherwise 5%. Show name, salary, department, and bonus columns.',
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
        question: 'Challenge: Write a query that assigns a salary band to each employee using CASE: "Junior" (< $40,000), "Mid" ($40,000-$80,000), "Senior" ($80,001-$120,000), or "Lead" (> $120,000). Show name, salary, salary_band, and also a tax_bracket column: "Low" (salary < $50,000), "Medium" ($50,000-$100,000), or "High" (> $100,000). Sort by salary descending.',
        hint: 'Use two CASE expressions in the SELECT clause with different thresholds. ORDER BY salary DESC.',
        solution: `SELECT name, salary,
  CASE
    WHEN salary < 40000 THEN 'Junior'
    WHEN salary <= 80000 THEN 'Mid'
    WHEN salary <= 120000 THEN 'Senior'
    ELSE 'Lead'
  END AS salary_band,
  CASE
    WHEN salary < 50000 THEN 'Low'
    WHEN salary <= 100000 THEN 'Medium'
    ELSE 'High'
  END AS tax_bracket
FROM employees
ORDER BY salary DESC;`
      },
      {
        question: 'Challenge: Use conditional aggregation with CASE inside SUM to show each customer\'s total orders, total of large orders (total > 200), total of small orders (total <= 200), and their grand total. Show customer, total_orders, large_order_total, small_order_total, and grand_total columns. Sort by grand_total descending.',
        hint: 'Use SUM(CASE WHEN total > 200 THEN total ELSE 0 END) for large orders, and SUM(CASE WHEN total <= 200 THEN total ELSE 0 END) for small orders.',
        solution: `SELECT customer,
  COUNT(*) AS total_orders,
  ROUND(SUM(CASE WHEN total > 200 THEN total ELSE 0 END), 2) AS large_order_total,
  ROUND(SUM(CASE WHEN total <= 200 THEN total ELSE 0 END), 2) AS small_order_total,
  ROUND(SUM(total), 2) AS grand_total
FROM orders
GROUP BY customer
ORDER BY grand_total DESC;`
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
        title: 'Single CTE for readability',
        sql: `WITH dept_stats AS (
  SELECT department,
    COUNT(*) AS headcount,
    ROUND(AVG(salary), 0) AS avg_salary
  FROM employees
  GROUP BY department
)
SELECT department, headcount, avg_salary
FROM dept_stats
WHERE headcount >= 2
ORDER BY avg_salary DESC;`,
        explanation: 'The CTE computes department statistics once. The main query then filters and sorts the pre-computed results, making the logic easy to follow.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,pair<int,double>> groups;
for(auto& e:employees){groups[e.department].first++;groups[e.department].second+=e.salary;}
vector<tuple<string,int,double>> deptStats;
for(auto& [d,v]:groups)deptStats.emplace_back(d,v.first,v.second/v.first);
vector<tuple<string,int,double>> filtered;
for(auto& [d,c,a]:deptStats)if(c>=2)filtered.emplace_back(d,c,round(a));
sort(filtered.begin(),filtered.end(),[](auto& x,auto& y){return get<2>(x)>get<2>(y);});`
      },
      {
        title: 'Multiple CTEs',
        sql: `WITH
electronics AS (
  SELECT id, name, price
  FROM products
  WHERE category = 'Electronics'
),
electronics_revenue AS (
  SELECT p.id, p.name, p.price,
    COALESCE(SUM(o.total), 0) AS total_revenue
  FROM electronics p
  LEFT JOIN orders o ON p.id = o.product_id
  GROUP BY p.id, p.name, p.price
)
SELECT name, price, total_revenue
FROM electronics_revenue
ORDER BY total_revenue DESC;`,
        explanation: 'Two CTEs work together: first filters to Electronics, then computes revenue per product. Each CTE builds on the previous one.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `vector<Product> electronics;
for(auto& p:products)if(p.category=="Electronics")electronics.push_back(p);
map<int,double> rev;
for(auto& e:electronics)rev[e.id]=0.0;
for(auto& o:orders)if(rev.count(o.product_id))rev[o.product_id]+=o.total;
vector<tuple<string,double,double>> result;
for(auto& e:electronics)result.emplace_back(e.name,e.price,rev[e.id]);
sort(result.begin(),result.end(),[](auto& a,auto& b){return get<2>(a)>get<2>(b);});`
      },
      {
        title: 'Recursive CTE — number series',
        sql: `WITH RECURSIVE numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT n FROM numbers;`,
        explanation: 'A recursive CTE starts with a base case (n=1) and repeatedly adds rows (n+1) until the condition fails (n < 10).',
        sourceTables: [],
        cppRepresentation: `vector<int> numbers;
for(int n=1;n<=10;++n)numbers.push_back(n);
for(int n:numbers)cout<<n<<"\\n";`
      },
      {
        title: 'CTE with JOIN',
        sql: `WITH order_stats AS (
  SELECT customer,
    COUNT(*) AS num_orders,
    ROUND(SUM(total), 2) AS total_spent
  FROM orders
  GROUP BY customer
)
SELECT e.name, e.department,
  COALESCE(os.num_orders, 0) AS orders_placed,
  COALESCE(os.total_spent, 0) AS total_spent
FROM employees e
LEFT JOIN order_stats os ON e.name = os.customer
ORDER BY os.total_spent DESC NULLS LAST;`,
        explanation: 'The CTE pre-computes customer order stats. Then a LEFT JOIN enriches employee data with their purchasing activity.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `map<string,pair<int,double>> orderStats;
for(auto& o:orders){orderStats[o.customer].first++;orderStats[o.customer].second+=o.total;}
for(auto& e:employees){
    auto it=orderStats.find(e.name);
    cout<<e.name<<" | "<<e.department<<" | "<<(it!=orderStats.end()?it->second.first:0)
        <<" orders | $"<<(it!=orderStats.end()?round(it->second.second*100)/100:0.0)<<"\\n";
}`
      },
      {
        title: 'Same CTE referenced twice',
        sql: `WITH dept_avg AS (
  SELECT department, ROUND(AVG(salary), 0) AS avg_sal
  FROM employees
  GROUP BY department
)
SELECT e.name, e.department, e.salary,
  da.avg_sal AS dept_avg,
  ROUND(e.salary - da.avg_sal, 0) AS diff
FROM employees e
JOIN dept_avg da ON e.department = da.department
WHERE e.salary > (
  SELECT AVG(salary) FROM employees
)
ORDER BY diff DESC;`,
        explanation: 'The same CTE (dept_avg) is referenced twice — once in the main JOIN and conceptualized as reusable. CTEs are defined once but can be used multiple times.',
        sourceTables: ['employees'],
        cppRepresentation: `double companyAvg=0;for(auto& e:employees)companyAvg+=e.salary;companyAvg/=employees.size();
map<string,pair<int,double>> groups;
for(auto& e:employees){groups[e.department].first++;groups[e.department].second+=e.salary;}
map<string,double> deptAvg;
for(auto& [d,v]:groups)deptAvg[d]=v.second/v.first;
for(auto& e:employees)
    if(e.salary>companyAvg)
        cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<round(deptAvg[e.department])<<" | "<<round(e.salary-deptAvg[e.department])<<"\\n";`
      },
      {
        title: 'Recursive CTE — factorial',
        sql: `WITH RECURSIVE factorial AS (
  SELECT 1 AS n, 1 AS fact
  UNION ALL
  SELECT n + 1, (n + 1) * fact
  FROM factorial
  WHERE n < 10
)
SELECT n, fact FROM factorial;`,
        explanation: 'A recursive CTE computing factorials 1! through 10!. The base case is 1! = 1. Each step multiplies (n+1) × n! to compute the next factorial.',
        cppRepresentation: `vector<pair<int,long long>> factorial;
long long fact=1;
for(int n=1;n<=10;++n){fact*=n;factorial.push_back({n,fact});}
for(auto& [n,f]:factorial)cout<<n<<"! = "<<f<<"\\n";`
      },
      {
        title: 'CTE with aggregation and JOIN',
        sql: `WITH dept_stats AS (
  SELECT department,
    COUNT(*) AS headcount,
    ROUND(AVG(salary), 0) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary
  FROM employees
  GROUP BY department
)
SELECT e.name, e.department, e.salary,
  ds.headcount,
  ds.avg_salary,
  ROUND(e.salary - ds.avg_salary, 0) AS diff_from_avg
FROM employees e
JOIN dept_stats ds ON e.department = ds.department
ORDER BY ds.avg_salary DESC, e.salary DESC;`,
        explanation: 'The CTE computes per-department statistics (headcount, avg/max/min salary). The main query JOINs employee data with those stats to compare each employee to their department.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,pair<int,double>> groups;
for(auto& e:employees){groups[e.department].first++;groups[e.department].second+=e.salary;}
for(auto& e:employees) {
    auto& d=groups[e.department];
    cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<d.first
        <<" emp | avg=$"<<round(d.second/d.first)<<" | diff=$"<<round(e.salary-d.second/d.first)<<"\\n";
}`
      },
      {
        title: 'CTE reused in multiple places',
        sql: `WITH dept_avg AS (
  SELECT department,
    ROUND(AVG(salary), 0) AS avg_salary
  FROM employees
  GROUP BY department
)
SELECT 'Above dept avg' AS category, e.name, e.department, e.salary
FROM employees e
JOIN dept_avg da ON e.department = da.department
WHERE e.salary > da.avg_salary
UNION ALL
SELECT 'Below dept avg' AS category, e.name, e.department, e.salary
FROM employees e
JOIN dept_avg da ON e.department = da.department
WHERE e.salary <= da.avg_salary
ORDER BY department, category, salary DESC;`,
        explanation: 'The same CTE `dept_avg` is referenced twice — once in each branch of a UNION ALL — to categorize employees as above or below their department average salary.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,pair<int,double>> groups;
for(auto& e:employees){groups[e.department].first++;groups[e.department].second+=e.salary;}
map<string,double> deptAvg;
for(auto& [d,v]:groups)deptAvg[d]=v.second/v.first;
vector<tuple<string,string,string,double>> result;
for(auto& e:employees){
    string cat=e.salary>deptAvg[e.department]?"Above dept avg":"Below dept avg";
    result.emplace_back(cat,e.name,e.department,e.salary);
}
sort(result.begin(),result.end(),[](auto& a,auto& b){
    if(get<2>(a)!=get<2>(b))return get<2>(a)<get<2>(b);
    if(get<0>(a)!=get<0>(b))return get<0>(a)<get<0>(b);return get<3>(a)>get<3>(b);});`
      },
      {
        title: 'CTE with window functions',
        sql: `WITH ranked_products AS (
  SELECT name, category, price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM products
)
SELECT name, category, price,
  CASE
    WHEN rn = 1 THEN 'Most Expensive'
    WHEN rn = 2 THEN '2nd Most Expensive'
    WHEN rn = 3 THEN '3rd Most Expensive'
    ELSE 'Other'
  END AS rank_label
FROM ranked_products
ORDER BY category, rn;`,
        explanation: 'The CTE uses ROW_NUMBER() to rank products by price within each category. The main query then labels the top 3 per category using a CASE expression.',
        sourceTables: ['products'],
        cppRepresentation: `map<string,vector<pair<string,double>>> byCat;
for(auto& p:products)byCat[p.category].push_back({p.name,p.price});
for(auto& [cat,items]:byCat)
    sort(items.begin(),items.end(),[](auto& a,auto& b){return a.second>b.second;});
for(auto& [cat,items]:byCat)
    for(int rn=0;rn<(int)items.size();++rn) {
        string lbl;
        if(rn==0)lbl="Most Expensive";else if(rn==1)lbl="2nd Most Expensive";
        else if(rn==2)lbl="3rd Most Expensive";else lbl="Other";
        cout<<items[rn].first<<" | "<<cat<<" | "<<items[rn].second<<" | "<<lbl<<"\\n";
    }`
      },
    ],
    commonMistakes: [
      'Forgetting the RECURSIVE keyword for recursive CTEs',
      'Creating cycles in recursive CTEs (infinite loop)',
      'Using CTE when a subquery or view would be simpler',
      'Assuming CTEs are always materialized (PostgreSQL inlines them by default)'
    ],
    practiceQuestions: [
      {
        question: 'Write a query using a CTE to compute the average salary per department. Then use the CTE to show only departments where the average salary exceeds $65,000. Show department and avg_salary columns. Sort by avg_salary descending.',
        hint: 'Use a CTE with GROUP BY department. Then SELECT from the CTE with a WHERE filter.',
        solution: `WITH dept_avg AS (
  SELECT department,
    ROUND(AVG(salary), 2) AS avg_salary
  FROM employees
  GROUP BY department
)
SELECT department, avg_salary
FROM dept_avg
WHERE avg_salary > 65000
ORDER BY avg_salary DESC;`
      },
      {
        question: 'Use a recursive CTE to generate a series of dates from 2024-01-01 to 2024-01-10.',
        hint: 'Start with the base date and UNION ALL adding 1 day.',
        solution: `WITH RECURSIVE dates AS (
  SELECT '2024-01-01' AS dt
  UNION ALL
  SELECT DATE(dt, '+1 day')
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
        question: 'Challenge: Write a query using multiple CTEs that computes the percentage contribution of each product category to total stock value (price * stock). The first CTE should compute total_value per category. The second CTE should compute the grand total. The main query computes each category\'s percentage. Show category, total_value, and percentage columns rounded to 2 decimal places.',
        hint: 'First CTE: GROUP BY category with SUM(price * stock). Second CTE: SELECT SUM(total_value) FROM first CTE. Final query: CROSS JOIN both and compute percentage.',
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
        explanation: 'Computes a running total of order amounts over time. Each row shows the cumulative sum up to that date.',
        sourceTables: ['orders'],
        cppRepresentation: `sort(orders.begin(), orders.end(), [](auto& a, auto& b) { return a.order_date < b.order_date; });
double running = 0;
for (auto& o : orders) { running += o.total; cout << o.order_date << " | " << o.total << " | running=" << running << "\n"; }`
      },
      {
        title: 'Rolling Average',
        sql: `SELECT 
  id,
  order_date,
  total,
  ROUND(AVG(total) OVER (
    ORDER BY order_date
    ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
  ), 2) AS rolling_avg_3
FROM orders
ORDER BY order_date;`,
        explanation: 'Calculates a 3-order rolling average. Each row\'s value is the average of its total, the previous order\'s total, and the next order\'s total.',
        sourceTables: ['orders'],
        cppRepresentation: `sort(orders.begin(), orders.end(), [](auto& a, auto& b) { return a.order_date < b.order_date; });
for (int i = 0; i < (int)orders.size(); i++) {
    double sum = orders[i].total; int cnt = 1;
    if (i > 0) { sum += orders[i-1].total; cnt++; }
    if (i+1 < (int)orders.size()) { sum += orders[i+1].total; cnt++; }
    cout << orders[i].id << " | " << orders[i].order_date << " | " << orders[i].total << " | rolling_avg=" << round(sum/cnt*100)/100 << "\n";
}`
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
        explanation: 'Shows how each employee\'s salary compares to their department average, with a label.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, pair<double, int>> deptAgg;
for (auto& e : employees) { deptAgg[e.department].first += e.salary; deptAgg[e.department].second++; }
map<string, double> deptAvg;
for (auto& [d, v] : deptAgg) deptAvg[d] = round(v.first / v.second);
for (auto& e : employees) {
    double diff = e.salary - deptAvg[e.department];
    cout << e.name << " | " << e.department << " | " << e.salary << " | dept_avg=" << deptAvg[e.department] << " | diff=" << round(diff) << " | " << (diff > 0 ? "Above Avg" : "Below Avg") << "\n";
}`
      },
      {
        title: 'LAG and LEAD — comparing to neighbors',
        sql: `SELECT 
  order_date,
  total,
  LAG(total) OVER (ORDER BY order_date) AS previous_order,
  LEAD(total) OVER (ORDER BY order_date) AS next_order,
  ROUND(total - LAG(total) OVER (ORDER BY order_date), 2) AS diff_from_previous
FROM orders
ORDER BY order_date;`,
        explanation: 'LAG accesses the previous row\'s value, LEAD accesses the next row\'s. The difference column shows how each order compares to the one before.',
        sourceTables: ['orders'],
        cppRepresentation: `sort(orders.begin(), orders.end(), [](auto& a, auto& b) { return a.order_date < b.order_date; });
for (int i = 0; i < (int)orders.size(); i++) {
    double prev = i > 0 ? orders[i-1].total : 0, next = i+1 < (int)orders.size() ? orders[i+1].total : 0;
    cout << orders[i].order_date << " | " << orders[i].total << " | prev=" << prev << " | next=" << next << " | diff=" << round((orders[i].total - prev)*100)/100 << "\n";
}`
      },
      {
        title: 'FIRST_VALUE and LAST_VALUE',
        sql: `SELECT 
  name,
  department,
  salary,
  FIRST_VALUE(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS dept_highest,
  LAST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS dept_lowest,
  ROUND(salary - FIRST_VALUE(salary) OVER (PARTITION BY department ORDER BY salary DESC), 0) AS gap_from_top
FROM employees
ORDER BY department, salary DESC;`,
        explanation: 'FIRST_VALUE gets the first row in the window (highest salary per dept). LAST_VALUE needs a frame clause to get the last row. Shows each employee\'s gap from the top earner.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, vector<Employee>> byDept;
for (auto& e : employees) byDept[e.department].push_back(e);
for (auto& [dept, emps] : byDept) {
    sort(emps.begin(), emps.end(), [](auto& a, auto& b) { return a.salary > b.salary; });
    double highest = emps[0].salary, lowest = emps.back().salary;
    for (auto& e : emps) cout << e.name << " | " << dept << " | " << e.salary << " | highest=" << highest << " | lowest=" << lowest << " | gap=" << highest - e.salary << "\n";
}`
      },
      {
        title: 'Running total per department',
        sql: `SELECT 
  name,
  department,
  salary,
  SUM(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS dept_running_total
FROM employees
ORDER BY department, salary DESC;`,
        explanation: 'SUM with PARTITION BY and ORDER BY computes a cumulative (running) total within each department. Each row shows the sum of salaries from the top earner down to that row.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, vector<Employee>> byDept;
for (auto& e : employees) byDept[e.department].push_back(e);
for (auto& [dept, emps] : byDept) {
    sort(emps.begin(), emps.end(), [](auto& a, auto& b) { return a.salary > b.salary; });
    double running = 0;
    for (auto& e : emps) { running += e.salary; cout << e.name << " | " << dept << " | " << e.salary << " | running=" << running << "\n"; }
}`
      },
      {
        title: 'Multiple window functions',
        sql: `SELECT name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  SUM(salary) OVER (PARTITION BY department) AS dept_total,
  ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS dept_avg
FROM employees
ORDER BY department, salary DESC`,
        explanation: 'Uses three different window functions in one query: ROW_NUMBER for per-department ranking, SUM for department total, and AVG for department average.',
        sourceTables: ['employees'],
        cppRepresentation: `map<string, vector<Employee>> byDept;
for (auto& e : employees) byDept[e.department].push_back(e);
for (auto& [dept, emps] : byDept) {
    sort(emps.begin(), emps.end(), [](auto& a, auto& b) { return a.salary > b.salary; });
    double total = 0; for (auto& e : emps) total += e.salary;
    double avg = total / emps.size();
    for (int i = 0; i < (int)emps.size(); i++) cout << emps[i].name << " | " << dept << " | " << emps[i].salary << " | rank=" << (i+1) << " | dept_total=" << total << " | dept_avg=" << round(avg) << "\n";
}`
      },
      {
        title: 'Window with CTE',
        sql: `WITH dept_data AS (
  SELECT department, name, salary
  FROM employees
  WHERE status = 'active'
)
SELECT department, name, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
FROM dept_data
ORDER BY department, rank`,
        explanation: 'Filters active employees in a CTE first, then applies a window function to the filtered result. CTEs cleanly separate filtering from window logic.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> active;
copy_if(employees.begin(), employees.end(), back_inserter(active), [](auto& e) { return e.status == "active"; });
map<string, vector<Employee>> byDept;
for (auto& e : active) byDept[e.department].push_back(e);
for (auto& [dept, emps] : byDept) {
    sort(emps.begin(), emps.end(), [](auto& a, auto& b) { return a.salary > b.salary; });
    for (int i = 0; i < (int)emps.size(); i++) cout << dept << " | " << emps[i].name << " | " << emps[i].salary << " | rank=" << (i+1) << "\n";
}`
      },
      {
        title: 'PARTITION BY with multiple columns',
        sql: `SELECT name, department, status, salary,
  ROUND(AVG(salary) OVER (PARTITION BY department, status), 0) AS group_avg,
  COUNT(*) OVER (PARTITION BY department, status) AS group_count
FROM employees
ORDER BY department, status, salary DESC`,
        explanation: 'PARTITION BY with two columns creates groups for each unique department-status combination, computing average salary and count per group.',
        sourceTables: ['employees'],
        cppRepresentation: `map<pair<string, string>, vector<Employee>> groups;
for (auto& e : employees) groups[{e.department, e.status}].push_back(e);
for (auto& [key, emps] : groups) {
    double total = 0; for (auto& e : emps) total += e.salary;
    double avg = total / emps.size();
    for (auto& e : emps) cout << e.name << " | " << key.first << " | " << key.second << " | " << e.salary << " | group_avg=" << round(avg) << " | group_count=" << emps.size() << "\n";
}`
      },
    ],
    commonMistakes: [
      'Forgetting the OVER clause (window functions require OVER)',
      'Confusing PARTITION BY with GROUP BY (window functions don\'t collapse rows)',
      'Not understanding frame clause defaults (RANGE vs ROWS)',
      'Using window functions without ORDER BY when order matters'
    ],
    practiceQuestions: [
      {
        question: 'For each employee, show their salary and the difference from the next higher-paid employee in the same department. Show name, department, salary, next_higher_salary, and gap columns.',
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
        question: 'Challenge: For each employee, show their name, salary, department, and what percentage their salary contributes to their department\'s total salary. Use a window function with PARTITION BY department. Show name, department, salary, dept_total, and pct_of_dept columns. Sort by department and salary descending.',
        hint: 'Use SUM(salary) OVER (PARTITION BY department) to compute dept_total. Then compute salary * 100.0 / dept_total.',
        solution: `SELECT name, department, salary,
  SUM(salary) OVER (PARTITION BY department) AS dept_total,
  ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) AS pct_of_dept
FROM employees
ORDER BY department, salary DESC;`
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
        explanation: 'Finds the top 3 highest-paid employees in each department. ROW_NUMBER ensures exactly 3 per department (no ties).',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,vector<Employee>> byDept;
for(auto& e:employees)byDept[e.department].push_back(e);
for(auto& [dept,emps]:byDept){
    sort(emps.begin(),emps.end(),[](auto& a,auto& b){return a.salary>b.salary;});
    for(int i=0;i<min(3,(int)emps.size());i++)
        cout<<emps[i].name<<" | "<<dept<<" | "<<emps[i].salary<<"\\n";
}`
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
        explanation: 'Shows the difference: RANK skips numbers after ties, DENSE_RANK does not, ROW_NUMBER is always unique and consecutive.',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int rowNum=0,rank=0,denseRank=0,prev=-1;
for(auto& e:employees){
    rowNum++;
    if(e.salary!=prev){rank=rowNum;denseRank++;prev=e.salary;}
    cout<<e.name<<" | "<<e.salary<<" | rn="<<rowNum<<" | rank="<<rank<<" | dense="<<denseRank<<"\\n";
}`
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
        explanation: 'Divides employees into 4 quartiles based on salary. Each quartile has an equal number of employees (or as close as possible).',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int n=employees.size(),qSize=(n+3)/4;
for(int i=0;i<n;i++){
    int q=(i/qSize)+1;if(q>4)q=4;
    string b=q==1?"Top 25%":q==2?"25-50%":q==3?"50-75%":"Bottom 25%";
    cout<<employees[i].name<<" | "<<employees[i].salary<<" | "<<b<<"\\n";
}`
      },
      {
        title: 'RANK with ties in practice',
        sql: `SELECT 
  department,
  name,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_dense
FROM employees
WHERE department IN ('Engineering', 'Marketing')
ORDER BY department, dept_rank;`,
        explanation: 'Shows ranking within departments. RANK skips numbers after ties, DENSE_RANK does not. Marketing has ties at the top (58k appears twice in Marketing — wait, Grace and Jack have different salaries).',
        sourceTables: ['employees'],
        cppRepresentation: `map<string,vector<Employee>> byDept;
for(auto& e:employees)if(e.department=="Engineering"||e.department=="Marketing")byDept[e.department].push_back(e);
for(auto& [dept,emps]:byDept){
    sort(emps.begin(),emps.end(),[](auto& a,auto& b){return a.salary>b.salary;});
    int rn=0,rank=0,dense=0,prev=-1;
    for(auto& e:emps){rn++;if(e.salary!=prev){rank=rn;dense++;prev=e.salary;}
    cout<<dept<<" | "<<e.name<<" | "<<e.salary<<" | rank="<<rank<<" | dense="<<dense<<"\\n";}
}`
      },
      {
        title: 'ROW_NUMBER for pagination',
        sql: `SELECT 
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  name, department, salary
FROM employees
ORDER BY salary DESC
LIMIT 5 OFFSET 5;`,
        explanation: 'ROW_NUMBER assigns a unique sequential number. OFFSET 5 combined with LIMIT 5 implements pagination — getting "page 2" of results (rows 6-10).',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int offset=5,limit=5;
for(int i=offset;i<offset+limit&&i<(int)employees.size();i++)
    cout<<(i+1)<<" | "<<employees[i].name<<" | "<<employees[i].department<<" | "<<employees[i].salary<<"\\n";`
      },
      {
        title: 'ROW_NUMBER with ties handling',
        sql: `SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees
ORDER BY salary DESC`,
        explanation: 'Shows how ROW_NUMBER and RANK differ when salaries are tied. ROW_NUMBER always increments, RANK assigns the same number to ties and skips the next.',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int rn=0,rank=0,prev=-1;
for(auto& e:employees){rn++;if(e.salary!=prev){rank=rn;prev=e.salary;}
    cout<<e.name<<" | "<<e.salary<<" | rn="<<rn<<" | rank="<<rank<<"\\n";}`
      },
      {
        title: 'NTILE for salary buckets',
        sql: `SELECT name, salary,
  NTILE(4) OVER (ORDER BY salary DESC) AS bucket,
  CASE NTILE(4) OVER (ORDER BY salary DESC)
    WHEN 1 THEN 'Top Tier'
    WHEN 2 THEN 'Upper Mid'
    WHEN 3 THEN 'Lower Mid'
    WHEN 4 THEN 'Bottom'
  END AS bucket_label
FROM employees
ORDER BY salary DESC`,
        explanation: 'Divides employees into 4 salary buckets using NTILE, with descriptive labels for each quartile.',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int n=employees.size(),bs=(n+3)/4;
for(int i=0;i<n;i++){
    int b=(i/bs)+1;if(b>4)b=4;
    string l=b==1?"Top Tier":b==2?"Upper Mid":b==3?"Lower Mid":"Bottom";
    cout<<employees[i].name<<" | "<<employees[i].salary<<" | "<<b<<" ("<<l<<")\\n";
}`
      },
      {
        title: 'DENSE_RANK for sequential groups',
        sql: `SELECT name, salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS group_number,
  CASE
    WHEN DENSE_RANK() OVER (ORDER BY salary DESC) = 1 THEN 'Top Earner'
    ELSE 'Level ' || DENSE_RANK() OVER (ORDER BY salary DESC)
  END AS group_label
FROM employees
ORDER BY salary DESC`,
        explanation: 'DENSE_RANK assigns sequential group numbers without gaps. Used here to create compact salary tiers — if there are ties at rank 1, the next distinct salary gets rank 2.',
        sourceTables: ['employees'],
        cppRepresentation: `sort(employees.begin(),employees.end(),[](auto& a,auto& b){return a.salary>b.salary;});
int dense=0,prev=-1;
for(auto& e:employees){
    if(e.salary!=prev){dense++;prev=e.salary;}
    string l=dense==1?"Top Earner":"Level "+to_string(dense);
    cout<<e.name<<" | "<<e.salary<<" | group="<<dense<<" ("<<l<<")\\n";
}`
      },
    ],
    commonMistakes: [
      'Confusing RANK, DENSE_RANK, and ROW_NUMBER (tie handling)',
      'Forgetting that ROW_NUMBER can produce non-deterministic results without ORDER BY',
      'Using RANK when DENSE_RANK would give better sequential numbering',
      'Not understanding NTILE behavior with uneven row counts'
    ],
    practiceQuestions: [
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
        hint: 'Use ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC). Then CASE WHEN rn = 1 THEN \'Platinum\' WHEN rn <= 3 THEN \'Gold\' ELSE \'Standard\' END.',
        solution: `WITH ranked AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (
      PARTITION BY department
      ORDER BY salary DESC
    ) AS rn
  FROM employees
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
      },
    ]
  },
  {
    id: 'advanced-practice',
    title: 'Advanced Practice',
    description: 'Review all advanced SQL concepts including window functions and ranking',
    icon: '📝',
    difficulty: 'advanced',
    prerequisites: ['window-functions', 'rank-functions'],
    topics: ['Practice', 'Review'],
    explanation: `This practice set tests everything you've learned in the advanced section: window functions and ranking functions (RANK, DENSE_RANK, ROW_NUMBER, NTILE, LAG).

These are the most powerful SQL features for analytical queries. Each question combines multiple concepts — try to solve them without hints first!`,
    examples: [],
    commonMistakes: [],
    practiceQuestions: [
      {
        question: 'For each customer, show their total spending, the company-wide average order total, and whether they are above or below the average. Use window functions to avoid subqueries.',
        hint: 'Use SUM(total) with a customer-level GROUP BY. Then use AVG(SUM(total)) OVER () to compute the overall average across all customers. Wrap in a CTE for readability.',
        solution: `WITH customer_totals AS (
  SELECT customer,
    ROUND(SUM(total), 2) AS total_spent,
    ROUND(AVG(SUM(total)) OVER (), 2) AS avg_spent
  FROM orders
  GROUP BY customer
)
SELECT customer, total_spent, avg_spent,
  CASE WHEN total_spent > avg_spent THEN 'Above Avg' ELSE 'Below Avg' END AS standing
FROM customer_totals
ORDER BY total_spent DESC;`
      },
      {
        question: 'Use ROW_NUMBER with products and orders to rank products by total sales (SUM of total) within each category. Show the top product in each category.',
        hint: 'JOIN products to orders, GROUP BY product, use ROW_NUMBER() OVER (PARTITION BY category ORDER BY SUM(total) DESC) inside a CTE, then filter rn = 1.',
        solution: `WITH product_sales AS (
  SELECT p.id, p.name, p.category,
    ROUND(SUM(o.total), 2) AS revenue,
    ROW_NUMBER() OVER (
      PARTITION BY p.category
      ORDER BY SUM(o.total) DESC
    ) AS rn
  FROM products p
  JOIN orders o ON p.id = o.product_id
  GROUP BY p.id, p.name, p.category
)
SELECT name, category, revenue
FROM product_sales
WHERE rn = 1
ORDER BY revenue DESC;`
      },
      {
        question: 'Divide all employees into 4 salary quartiles using NTILE and show the salary range (min to max) for each quartile. Use a CTE with NTILE, then GROUP BY the quartile bucket.',
        hint: 'NTILE(4) OVER (ORDER BY salary) to create buckets. Wrap in a CTE, then GROUP BY bucket with MIN and MAX salary.',
        solution: `WITH salary_quartiles AS (
  SELECT name, salary,
    NTILE(4) OVER (ORDER BY salary) AS quartile
  FROM employees
)
SELECT quartile,
  MIN(salary) AS min_salary,
  MAX(salary) AS max_salary,
  COUNT(*) AS employee_count
FROM salary_quartiles
GROUP BY quartile
ORDER BY quartile;`
      },
      {
        question: 'Use the LAG window function to show each order for each customer alongside the previous order\'s total and the difference between consecutive orders. Show customer, order_date, total, previous_total, and the difference.',
        hint: 'LAG(total) OVER (PARTITION BY customer ORDER BY order_date) to get the previous order\'s total. Use COALESCE to avoid NULL for the first order. Compute total - previous_total as the difference.',
        solution: `SELECT customer, order_date, total,
  COALESCE(LAG(total) OVER (
    PARTITION BY customer
    ORDER BY order_date
  ), 0) AS previous_total,
  total - COALESCE(LAG(total) OVER (
    PARTITION BY customer
    ORDER BY order_date
  ), 0) AS difference
FROM orders
ORDER BY customer, order_date;`
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
        title: 'Case conversion and length',
        sql: `SELECT name,
  UPPER(name) AS name_upper,
  LOWER(department) AS dept_lower,
  LENGTH(name) AS name_length,
  LENGTH(department) AS dept_length
FROM employees;`,
        explanation: 'Demonstrates UPPER, LOWER, and LENGTH on text columns.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees){
    string upper,lower;
    for(char c:e.name)upper+=toupper(c);
    for(char c:e.department)lower+=tolower(c);
    cout<<e.name<<" | upper="<<upper<<" | lower="<<lower<<" | name_len="<<e.name.length()<<" | dept_len="<<e.department.length()<<"\\n";
}`
      },
      {
        title: 'String concatenation',
        sql: `SELECT name,
  department || ' (' || city || ')' AS dept_and_location
FROM employees;`,
        explanation: 'Uses the || operator to concatenate strings, building a combined department and location column.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees)cout<<e.name<<" | "<<e.department+" ("+e.city+")"<<"\\n";`
      },
      {
        title: 'SUBSTRING extraction',
        sql: `SELECT name,
  SUBSTR(name, 1, INSTR(name, ' ') - 1) AS first_name,
  SUBSTR(name, INSTR(name, ' ') + 1) AS last_name
FROM employees;`,
        explanation: 'Splits the full name into first and last name using SUBSTR and INSTR to find the space position.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees){
    size_t p=e.name.find(' ');
    cout<<e.name<<" | first="<<e.name.substr(0,p)<<" | last="<<e.name.substr(p+1)<<"\\n";
}`
      },
      {
        title: 'REPLACE and TRIM',
        sql: `SELECT name,
  REPLACE(name, 'e', '3') AS leet_name,
  TRIM('  ' || name || '  ') AS trimmed_name,
  LENGTH('  ' || name || '  ') AS before_trim,
  LENGTH(TRIM('  ' || name || '  ')) AS after_trim
FROM employees
LIMIT 3;`,
        explanation: 'REPLACE swaps characters, TRIM removes leading/trailing whitespace. Shows length before and after trimming.',
        sourceTables: ['employees'],
        cppRepresentation: `string trim(string s){size_t f=s.find_first_not_of(' '),l=s.find_last_not_of(' ');return f==string::npos?"":s.substr(f,l-f+1);}
int c=0;
for(auto& e:employees){if(c++>=3)break;
    string p="  "+e.name+"  ";
    string r=e.name;for(char& c:r)if(c=='e')c='3';
    cout<<e.name<<" | leet="<<r<<" | before="<<p.length()<<" | after="<<trim(p).length()<<"\\n";
}`
      },
      {
        title: 'Padding with LPAD and RPAD',
        sql: `SELECT name,
  LPAD(CAST(salary AS TEXT), 10, '.') AS salary_padded,
  RPAD(department, 15, '-') AS dept_padded
FROM employees
LIMIT 5;`,
        explanation: 'LPAD pads the string on the left to reach the target length. RPAD pads on the right. Useful for formatting output or creating fixed-width text.',
        sourceTables: ['employees'],
        cppRepresentation: `string lpad(string s,size_t w,char p){return s.length()>=w?s:string(w-s.length(),p)+s;}
string rpad(string s,size_t w,char p){return s.length()>=w?s:s+string(w-s.length(),p);}
int c=0;
for(auto& e:employees){if(c++>=5)break;
    cout<<e.name<<" | "<<lpad(to_string(e.salary),10,'.')<<" | "<<rpad(e.department,15,'-')<<"\\n";
}`
      },
      {
        title: 'Formatting with PRINTF',
        sql: `SELECT name,
  PRINTF('$%.2f', salary) AS formatted_salary,
  PRINTF('Dept: %s (%s)', department, city) AS dept_location
FROM employees
LIMIT 5;`,
        explanation: 'PRINTF formats values using a template string. %s inserts text, %.2f formats a number with 2 decimal places.',
        sourceTables: ['employees'],
        cppRepresentation: `int c=0;
for(auto& e:employees){if(c++>=5)break;
    cout<<e.name<<" | $"<<fixed<<setprecision(2)<<e.salary<<" | Dept: "<<e.department<<" ("<<e.city<<")\\n";
}`
      },
      {
        title: 'Nested function calls',
        sql: `SELECT name,
  UPPER(TRIM(SUBSTR(name, INSTR(name, ' ') + 1))) AS last_name_upper
FROM employees`,
        explanation: 'Chains three functions: extracts the last name via SUBSTR/INSTR, trims whitespace, then uppercases it.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees){
    size_t p=e.name.find(' ');
    string last=e.name.substr(p+1);
    string upper;for(char c:last)upper+=toupper(c);
    cout<<e.name<<" | "<<upper<<"\\n";
}`
      },
      {
        title: 'String formatting for display',
        sql: `SELECT name,
  PRINTF('Name: %s | Dept: %s | Salary: $%.2f', name, department, salary) AS formatted
FROM employees
LIMIT 5`,
        explanation: 'Uses PRINTF to create a single readable formatted string from multiple columns with labels and proper formatting.',
        sourceTables: ['employees'],
        cppRepresentation: `int c=0;
for(auto& e:employees){if(c++>=5)break;
    cout<<"Name: "<<e.name<<" | Dept: "<<e.department<<" | Salary: $"<<fixed<<setprecision(2)<<e.salary<<"\\n";
}`
      },
      {
        title: 'Extract and transform',
        sql: `SELECT name,
  UPPER(SUBSTR(name, 1, 1)) AS first_initial,
  LOWER(SUBSTR(name, 2)) AS rest_of_name
FROM employees`,
        explanation: 'Combines INSTR positioning concept with SUBSTR, UPPER, and LOWER to split a name into its capitalized first letter and lowercased remainder.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees){
    string init={char(toupper(e.name[0]))};
    string rest;for(size_t i=1;i<e.name.length();i++)rest+=char(tolower(e.name[i]));
    cout<<e.name<<" | initial="<<init<<" | rest="<<rest<<"\\n";
}`
      },
    ],
    commonMistakes: [
      'Using string concatenation with || on NULL columns (NULL || anything = NULL)',
      'Forgetting that string functions are case-sensitive by default',
      'Not handling NULLs before applying string functions',
      'Using SUBSTRING with wrong length parameters'
    ],
    practiceQuestions: [
      {
        question: 'Show employee names in uppercase, their department in lowercase, and the length of their full name.',
        hint: 'Use UPPER(), LOWER(), and LENGTH() functions.',
        solution: `SELECT 
  UPPER(name) AS name_upper,
  LOWER(department) AS dept_lower,
  LENGTH(name) AS name_length
FROM employees;`
      },
      {
        question: 'Challenge: Write a query that extracts the first name and last initial from each employee name, and formats it as "First L." where L is the last initial capitalized. Then sort by the last initial descending.',
        hint: 'Use SUBSTR with INSTR to split at the space. Concatenate with ||. Use UPPER on the extracted initial.',
        solution: `SELECT name,
  SUBSTR(name, 1, INSTR(name, ' ') - 1)
    || ' '
    || UPPER(SUBSTR(name, INSTR(name, ' ') + 1, 1))
    || '.' AS short_name
FROM employees
ORDER BY SUBSTR(name, INSTR(name, ' ') + 1, 1) DESC;`
      },
      {
        question: 'Challenge: From the products table, create a "product_code" column by taking the first 3 letters of the category (uppercased), the first 2 letters of the product name (uppercased), and the ID zero-padded to 3 digits. Example: "ELELP001" for a Laptop Pro in Electronics with ID 1.',
        hint: 'Use UPPER(SUBSTR(category, 1, 3)) concatenated with UPPER(SUBSTR(name, 1, 2)) and PRINTF(\'%03d\', id).',
        solution: `SELECT name, category, id,
  UPPER(SUBSTR(category, 1, 3))
    || UPPER(SUBSTR(name, 1, 2))
    || PRINTF('%03d', id) AS product_code
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
- ~ : POSIX regex match (PostgreSQL)
- regexp_match() / regexp_replace(): Regex functions (PostgreSQL)

The examples below use LIKE and INSTR which work in all SQL databases. PostgreSQL also supports POSIX regex operators (~, ~*) and regexp_* functions for more advanced use cases.`,
    syntax: `-- LIKE wildcards
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE sku LIKE 'ABC_'; -- _ = single char

-- ILIKE (case-insensitive, PostgreSQL only)
SELECT * FROM users WHERE name ILIKE 'john%';

-- POSIX regex matches (PostgreSQL only)
SELECT * FROM users WHERE email ~ '^[a-z]+@[a-z]+\\.com$';

-- regexp_match (PostgreSQL only)
SELECT 
  email,
  regexp_match(email, '@(.+)$') AS domain
FROM users;

-- INSTR + SUBSTR (works everywhere)
SELECT 
  SUBSTR(email, 1, INSTR(email, '@') - 1) AS username,
  SUBSTR(email, INSTR(email, '@') + 1) AS domain
FROM users;

-- Common LIKE patterns
-- %    any sequence of characters
-- _    exactly one character
-- [%]  literal percent (escape)`,
    examples: [
      {
        title: 'LIKE — ends with pattern',
        sql: `SELECT name, email
FROM employees
WHERE email LIKE '%@company.com'
ORDER BY name;`,
        explanation: 'LIKE with % matches any sequence. This finds all employees with company.com email addresses.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees)
    if (e.email.size() >= 12 && e.email.substr(e.email.size() - 12) == "@company.com")
        cout << e.name << " | " << e.email << "\n";`
      },
      {
        title: 'LIKE — contains and starts with',
        sql: `SELECT name, department, email
FROM employees
WHERE name LIKE '%e%'
  AND email LIKE 'c%'
ORDER BY name;`,
        explanation: 'First condition finds names containing "e". Second finds emails starting with "c". Both must be true. Only Charlie matches.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees)
    if (e.name.find('e') != string::npos && !e.email.empty() && e.email[0] == 'c')
        cout << e.name << " | " << e.department << " | " << e.email << "\n";`
      },
      {
        title: 'LIKE with _ single-character wildcard',
        sql: `SELECT name, department
FROM employees
WHERE name LIKE '%a_e'
ORDER BY name;`,
        explanation: 'The _ matches exactly one character. This pattern finds names ending with "a" followed by any character then "e" — like "Charlie" and "Grace".',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees)
    if (e.name.size() >= 3 && e.name[e.name.size()-3] == 'a' && e.name[e.name.size()-1] == 'e')
        cout << e.name << " | " << e.department << "\n";`
      },
      {
        title: 'Extracting parts with INSTR and SUBSTR',
        sql: `SELECT name, email,
  SUBSTR(email, 1, INSTR(email, '@') - 1) AS username,
  SUBSTR(email, INSTR(email, '@') + 1) AS domain
FROM employees
WHERE email IS NOT NULL;`,
        explanation: 'INSTR finds the position of "@". SUBSTR then extracts the username (before @) and domain (after @). This works in any SQL database.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees) if (!e.email.empty()) {
    size_t p = e.email.find('@');
    cout << e.name << " | " << e.email << " | user=" << e.email.substr(0, p) << " | domain=" << e.email.substr(p+1) << "\n";
}`
      },
      {
        title: 'NOT LIKE to exclude patterns',
        sql: `SELECT name, department FROM employees
WHERE name NOT LIKE '%a%'
ORDER BY name`,
        explanation: 'Finds names that do NOT contain the letter "a" using NOT LIKE.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees)
    if (e.name.find('a') == string::npos)
        cout << e.name << " | " << e.department << "\n";`
      },
      {
        title: 'LIKE with _ single char',
        sql: `SELECT name, department FROM employees
WHERE name LIKE '_a%'
ORDER BY name`,
        explanation: 'The _ wildcard matches exactly one character. This finds names with "a" as the second letter.',
        sourceTables: ['employees'],
        cppRepresentation: `for (auto& e : employees)
    if (e.name.size() >= 2 && e.name[1] == 'a')
        cout << e.name << " | " << e.department << "\n";`
      },
      {
        title: 'Pattern matching on numbers',
        sql: `SELECT name, price, category FROM products
WHERE CAST(price AS TEXT) LIKE '1%'
ORDER BY price`,
        explanation: 'Casts the numeric price to text and uses LIKE to find products where the price text starts with "1".',
        sourceTables: ['products'],
        cppRepresentation: `for (auto& p : products) {
    string s = to_string(p.price);
    if (s[0] == '1')
        cout << p.name << " | " << p.price << " | " << p.category << "\n";
}`
      },
    ],
    commonMistakes: [
      'Using = instead of LIKE for pattern matching (= does exact match only)',
      'Forgetting that LIKE patterns are case-sensitive by default',
      'Not escaping wildcard characters (%) when they should be literal',
      'Using complex regex when simple LIKE would suffice'
    ],
    practiceQuestions: [
      {
        question: 'Find all products whose name starts with "D" or ends with "k". Show name, category, and price.',
        hint: 'Use name LIKE \'D%\' OR name LIKE \'%k\' with OR.',
        solution: `SELECT name, category, price
FROM products
WHERE name LIKE 'D%'
   OR name LIKE '%k'
ORDER BY name;`
      },
      {
        question: 'Challenge: Use LIKE and INSTR to find all employees whose email username (the part before @) has more than 4 characters. Show name, email, and username columns.',
        hint: 'Use INSTR(email, \'@\') to find the @ position, then SUBSTR to extract the username and LENGTH to check its length.',
        solution: `SELECT name, email,
  SUBSTR(email, 1, INSTR(email, '@') - 1) AS username
FROM employees
WHERE LENGTH(SUBSTR(email, 1, INSTR(email, '@') - 1)) > 4
ORDER BY name;`
      },
      {
        question: 'Challenge: Write a query that finds all products whose price is a whole number (no decimal cents — meaning it ends with .00 when cast to text). Show name, price, category. Sort by price descending.',
        hint: 'Use CAST(price AS TEXT) LIKE \'%.00\' or use price = CAST(price AS INTEGER).',
        solution: `SELECT name, price, category
FROM products
WHERE CAST(price AS TEXT) LIKE '%.00'
ORDER BY price DESC;`
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
        title: 'UNION — combining employee lists',
        sql: `SELECT name, department, salary, 'Active' AS status_label
FROM employees
WHERE status = 'active'
UNION ALL
SELECT name, department, salary, 'Inactive' AS status_label
FROM employees
WHERE status = 'inactive'
ORDER BY name;`,
        explanation: 'UNION ALL stacks results from two queries. Active employees get one label, inactive another. UNION (without ALL) would deduplicate, but here every row is unique.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> result;
for(auto& e:employees)if(e.status=="active")result.push_back(e);
for(auto& e:employees)if(e.status=="inactive")result.push_back(e);
sort(result.begin(),result.end(),[](auto& a,auto& b){return a.name<b.name;});
for(auto& e:result)cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<" | "<<e.status<<"\\n";`
      },
      {
        title: 'INTERSECT — common cities across departments',
        sql: `SELECT city FROM employees
WHERE department = 'Engineering'
INTERSECT
SELECT city FROM employees
WHERE department = 'Marketing'
ORDER BY city;`,
        explanation: 'INTERSECT finds cities that appear in BOTH result sets — cities that have both Engineering and Marketing employees. New York is returned because it has employees from both departments.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> engCities,mktCities;
for(auto& e:employees){if(e.department=="Engineering")engCities.insert(e.city);if(e.department=="Marketing")mktCities.insert(e.city);}
set_intersection(engCities.begin(),engCities.end(),mktCities.begin(),mktCities.end(),ostream_iterator<string>(cout,"\\n"));`
      },
      {
        title: 'EXCEPT — products never ordered',
        sql: `SELECT id, name, category, price
FROM products
EXCEPT
SELECT p.id, p.name, p.category, p.price
FROM products p
JOIN orders o ON p.id = o.product_id
ORDER BY id;`,
        explanation: 'EXCEPT returns products that exist in the first query but NOT in the second — products that have never been ordered. The second query finds ordered products, and EXCEPT removes them.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `set<int> orderedIds;
for(auto& o:orders)orderedIds.insert(o.product_id);
for(auto& p:products)if(!orderedIds.count(p.id))cout<<p.id<<" | "<<p.name<<" | "<<p.category<<" | "<<p.price<<"\\n";`
      },
      {
        title: 'UNION vs UNION ALL comparison',
        sql: `SELECT department FROM employees
WHERE salary > 80000
UNION
SELECT department FROM employees
WHERE salary <= 80000
ORDER BY department;`,
        explanation: 'UNION removes duplicates, so each department appears only once. UNION ALL would show every matching row — try replacing UNION with UNION ALL to see the difference.',
        sourceTables: ['employees'],
        cppRepresentation: `set<string> unionSet;
for(auto& e:employees){if(e.salary>80000)unionSet.insert(e.department);if(e.salary<=80000)unionSet.insert(e.department);}
for(auto& d:unionSet)cout<<d<<"\\n";`
      },
      {
        title: 'Mixing UNION and EXCEPT',
        sql: `SELECT name, department, salary
FROM employees
WHERE department = 'Engineering'
UNION
SELECT name, department, salary
FROM employees
WHERE department = 'Product'
EXCEPT
SELECT name, department, salary
FROM employees
WHERE salary < 75000
ORDER BY salary DESC;`,
        explanation: 'First combines Engineering and Product employees via UNION, then removes anyone earning under $75k via EXCEPT. The result: mid-to-high earners in tech departments.',
        sourceTables: ['employees'],
        cppRepresentation: `vector<Employee> combined;
for(auto& e:employees)if(e.department=="Engineering"||e.department=="Product")combined.push_back(e);
set<string> lowSal;
for(auto& e:employees)if(e.salary<75000)lowSal.insert(e.name);
for(auto& e:combined)if(!lowSal.count(e.name))cout<<e.name<<" | "<<e.department<<" | "<<e.salary<<"\\n";`
      },
      {
        title: 'UNION with different tables',
        sql: `SELECT name, 'Employee' AS source FROM employees
UNION
SELECT name, 'Product' AS source FROM products`,
        explanation: 'Combines employee names with product names into a single list, with a label column identifying the source table.',
        sourceTables: ['employees', 'products'],
        cppRepresentation: `set<string> seen;
for(auto& e:employees)if(seen.insert(e.name).second)cout<<e.name<<" | Employee\\n";
for(auto& p:products)if(seen.insert(p.name).second)cout<<p.name<<" | Product\\n";`
      },
      {
        title: 'UNION ALL with constants',
        sql: `SELECT '=== DEPARTMENT LIST ===' AS header
UNION ALL
SELECT name FROM employees WHERE department = 'Engineering'
UNION ALL
SELECT '=== END ===' AS footer`,
        explanation: 'Uses UNION ALL with constant values to add header and footer rows around query results for better readability.',
        sourceTables: ['employees'],
        cppRepresentation: `cout<<"=== DEPARTMENT LIST ===\\n";
for(auto& e:employees)if(e.department=="Engineering")cout<<e.name<<"\\n";
cout<<"=== END ===\\n";`
      },
      {
        title: 'EXCEPT with WHERE',
        sql: `SELECT name, department FROM employees WHERE status = 'active'
EXCEPT
SELECT name, department FROM employees WHERE salary < 60000
ORDER BY name`,
        explanation: 'Finds active employees who earn at least $60,000 by excluding lower-paid employees from the active employee list.',
        sourceTables: ['employees'],
        cppRepresentation: `for(auto& e:employees)
    if(e.status=="active"&&!(e.salary<60000))
        cout<<e.name<<" | "<<e.department<<"\\n";`
      },
    ],
    commonMistakes: [
      'Using UNION when UNION ALL would be faster (UNION deduplicates)',
      'Forgetting that set operations require same number and types of columns',
      'Confusing JOIN with set operations (JOIN is horizontal, set ops are vertical)',
      'Using EXCEPT without understanding NULL handling differences'
    ],
    practiceQuestions: [
      {
        question: 'Find products that have been ordered at least once — use INTERSECT between products list and product_ids appearing in orders.',
        hint: 'Select ids from products, INTERSECT with SELECT DISTINCT product_id FROM orders.',
        solution: `SELECT id, name
FROM products
WHERE id IN (
  SELECT id FROM products
  INTERSECT
  SELECT product_id FROM orders
);`
      },
      {
        question: 'Challenge: Use EXCEPT to find employees who have NOT placed any orders. The employees table has names, and the orders table has a customer column. Show employee name and department.',
        hint: 'SELECT name, department FROM employees EXCEPT SELECT customer, ... FROM orders. Both queries must have the same number of columns.',
        solution: `SELECT name, department
FROM employees
EXCEPT
SELECT o.customer, e.department
FROM orders o
JOIN employees e ON o.customer = e.name
ORDER BY name;`
      },
      {
        question: 'Challenge: Write a query using UNION ALL to create a combined product-employee catalog. For each entry show: the name, a type (either "Employee" or "Product"), and a price/salary column. Employees show their salary, products show their price. Sort by name.',
        hint: 'First SELECT: SELECT name, \'Employee\' AS type, salary FROM employees. Second SELECT: SELECT name, \'Product\' AS type, price FROM products. Use UNION ALL to combine.',
        solution: `SELECT name, 'Employee' AS type, salary AS value
FROM employees
UNION ALL
SELECT name, 'Product' AS type, price AS value
FROM products
ORDER BY name;`
      },
    ]
  },
  {
    id: 'intermediate-practice',
    title: 'Intermediate Practice',
    description: 'Review all intermediate SQL concepts',
    icon: '📝',
    difficulty: 'intermediate',
    prerequisites: ['joins', 'subqueries', 'case-when', 'cte', 'pattern-matching', 'string-functions', 'set-operations'],
    topics: ['Practice', 'Review'],
    explanation: `This practice set tests everything you've learned across all intermediate-level concepts: JOINs, Subqueries, CASE WHEN, CTEs, String Functions, Pattern Matching, and Set Operations.

Each question combines multiple concepts to challenge your understanding. Try to solve them without looking at the hints first!`,
    examples: [],
    commonMistakes: [],
    practiceQuestions: [
      {
        question: 'Show each employee\'s name, department, and salary, along with the average salary of their department (use a correlated subquery). Then show how their salary compares to their department average as a "Above Avg" or "Below Avg" label using CASE.',
        hint: 'Use a correlated subquery: (SELECT AVG(salary) FROM employees sub WHERE sub.department = e.department). Wrap in CASE for the label.',
        solution: `SELECT name, department, salary,
  ROUND((SELECT AVG(salary) FROM employees sub WHERE sub.department = e.department), 0) AS dept_avg,
  CASE
    WHEN salary > (SELECT AVG(salary) FROM employees sub WHERE sub.department = e.department)
    THEN 'Above Avg'
    ELSE 'Below Avg'
  END AS standing
FROM employees e
ORDER BY department, salary DESC;`
      },
      {
        question: 'Use a CTE to find the top 2 products by total sales in each category. The CTE should join products with orders, compute total revenue per product, then use ROW_NUMBER() with PARTITION BY category. Show product name, category, and total revenue.',
        hint: 'CTE: JOIN products to orders, GROUP BY product with SUM(total), use ROW_NUMBER() OVER (PARTITION BY category ORDER BY SUM(total) DESC). Then SELECT WHERE rn <= 2.',
        solution: `WITH product_sales AS (
  SELECT p.name, p.category,
    ROUND(SUM(o.total), 2) AS revenue,
    ROW_NUMBER() OVER (
      PARTITION BY p.category
      ORDER BY SUM(o.total) DESC
    ) AS rn
  FROM products p
  JOIN orders o ON p.id = o.product_id
  GROUP BY p.name, p.category
)
SELECT name, category, revenue
FROM product_sales
WHERE rn <= 2
ORDER BY category, revenue DESC;`
      },
      {
        question: 'Find employees who have placed orders totaling more than $100. Use a subquery in WHERE with EXISTS. Show employee name, department, and salary.',
        hint: 'WHERE EXISTS (SELECT 1 FROM orders WHERE customer = e.name AND total > 100).',
        solution: `SELECT name, department, salary
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer = e.name
    AND o.total > 100
)
ORDER BY salary DESC;`
      },
      {
        question: 'Write a query using string functions to extract the first letter of each employee\'s name and show how many employees have names starting with each letter. Use UPPER, SUBSTR, GROUP BY, and ORDER BY.',
        hint: 'Use SUBSTR(UPPER(name), 1, 1) AS first_letter. GROUP BY first_letter. ORDER BY count DESC.',
        solution: `SELECT SUBSTR(UPPER(name), 1, 1) AS first_letter,
  COUNT(*) AS employee_count
FROM employees
GROUP BY first_letter
ORDER BY employee_count DESC;`
      },
      {
        question: 'Use a self-JOIN on employees to find all pairs of employees from different departments who earn similar salaries (within $5,000 of each other). Show both names, their departments, and salaries. Exclude pairs where the first employee earns less than the second to avoid duplicates.',
        hint: 'JOIN employees e1 JOIN employees e2 ON e1.department <> e2.department AND ABS(e1.salary - e2.salary) <= 5000 AND e1.name < e2.name.',
        solution: `SELECT e1.name AS emp1, e1.department AS dept1, e1.salary AS salary1,
  e2.name AS emp2, e2.department AS dept2, e2.salary AS salary2
FROM employees e1
JOIN employees e2 ON e1.department <> e2.department
  AND ABS(e1.salary - e2.salary) <= 5000
  AND e1.name < e2.name
ORDER BY e1.salary;`
      }
    ]
  }
]
