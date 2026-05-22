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
  tablesUsed?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
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
    explanation: `── Real-World Analogy ──
Imagine a library catalog. The table is the catalog, each row is a book, each column is a property (title, author, year).
SELECT is you saying: "Show me only the titles and authors, not the ISBN or shelf number."

── How SQL Executes Your Query (Pipeline) ──
Every SQL query follows this exact execution order. Memorize this — it's the most important concept in SQL:

  FROM / JOIN     →  WHERE       →  GROUP BY    →  HAVING      →  SELECT      →  ORDER BY    →  LIMIT
  (which tables)    (filter rows)   (group rows)   (filter grps)  (pick columns)  (sort)        (slice pages)

  ── Step-by-step example ──
  Query: SELECT department, AVG(salary) AS avg_sal FROM employees WHERE salary > 0 GROUP BY department HAVING COUNT(*) > 1 ORDER BY avg_sal DESC LIMIT 3;

  1. FROM employees        →  Start with ALL rows in the employees table
  2. WHERE salary > 0      →  Remove rows with salary ≤ 0
  3. GROUP BY department   →  Group remaining rows by department
  4. HAVING COUNT(*) > 1   →  Keep only groups with more than 1 employee
  5. SELECT dept, AVG(...) →  For each group, compute the average salary
  6. ORDER BY avg_sal DESC →  Sort from highest to lowest average
  7. LIMIT 3              →  Show only the top 3

  ⚠ You MUST write clauses in this order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
  But the DATABASE executes them in the pipeline order above. These are DIFFERENT orders!

── What SELECT Does ──
SELECT picks which COLUMNS to show and lets you:
- Choose specific columns: SELECT name, salary
- Show ALL columns: SELECT *
- Rename with alias: SELECT salary * 12 AS annual_salary
- Remove duplicates: SELECT DISTINCT department
- Limit rows shown: SELECT ... LIMIT 10

── Full SELECT Syntax Order ──
| Clause       | Purpose                  | Example                           |
|--------------|--------------------------|-----------------------------------|
| SELECT       | What to show             | SELECT name, salary * 12 AS annual|
| FROM         | Where data comes from    | FROM employees                    |
| WHERE        | Filter ROWS (before grp) | WHERE status = 'active'           |
| GROUP BY     | Group rows               | GROUP BY department               |
| HAVING       | Filter GROUPS (after grp)| HAVING COUNT(*) > 3               |
| ORDER BY     | Sort result              | ORDER BY salary DESC              |
| LIMIT/OFFSET | Limit rows / Pagination  | LIMIT 10 OFFSET 5                 |

You CANNOT change this order — the database will throw a syntax error!`,
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
// employees[] is the input table, passed through directly
for (int i = 0; i < employeeCount; i++)
    cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << "\\n";`
      },
      {
        title: 'Select specific columns',
        sql: `SELECT name, department, salary
FROM employees;`,
        explanation: 'Returns only the name, department, and salary columns for all employees.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees;
for (int i = 0; i < employeeCount; i++)
    cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << "\\n";`
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
for (int i = 0; i < employeeCount; i++)
    cout << employees[i].name << " | $" << employees[i].salary * 12 << "\\n";`
      },
      {
        title: 'DISTINCT unique values',
        sql: `SELECT DISTINCT department
FROM employees;`,
        explanation: 'Returns each unique department name once, removing duplicates.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT DISTINCT department FROM employees;
string seen[100];
int seenCount = 0;
for (int i = 0; i < employeeCount; i++) {
    bool found = false;
    for (int j = 0; j < seenCount; j++)
        if (seen[j] == employees[i].department) { found = true; break; }
    if (!found) {
        seen[seenCount++] = employees[i].department;
        cout << employees[i].department << "\\n";
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
        for (int i = 0; i < employeeCount; i++)
            for (int j = i + 1; j < employeeCount; j++)
                if (employees[i].salary < employees[j].salary)
                    { Employee t = employees[i]; employees[i] = employees[j]; employees[j] = t; }
        int limit = 3;
        int n = limit < employeeCount ? limit : employeeCount;
        for (int i = 0; i < n; i++)
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
        Result result[100];
        int resultCount = 0;
        int limit = 5;
        int n = limit < employeeCount ? limit : employeeCount;
        for (int i = 0; i < n; i++) {
            result[resultCount].name = employees[i].name;
            result[resultCount].department = employees[i].department;
            result[resultCount].salary = employees[i].salary;
            result[resultCount].annual_salary = employees[i].salary * 12;
            resultCount++;
        }
        for (int i = 0; i < resultCount; i++)
            cout << result[i].name << " | " << result[i].department << " | " << result[i].salary << " | " << result[i].annual_salary << "\\n";`
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
        struct Pair { string first; string second; };
        Pair seen[100];
        int seenCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            bool found = false;
            for (int j = 0; j < seenCount; j++)
                if (seen[j].first == employees[i].department && seen[j].second == employees[i].status)
                    { found = true; break; }
            if (!found) {
                seen[seenCount].first = employees[i].department;
                seen[seenCount].second = employees[i].status;
                seenCount++;
            }
        }
        for (int i = 0; i < seenCount; i++)
            for (int j = i + 1; j < seenCount; j++)
                if (seen[i].first > seen[j].first || (seen[i].first == seen[j].first && seen[i].second > seen[j].second))
                    { Pair t = seen[i]; seen[i] = seen[j]; seen[j] = t; }
        for (int i = 0; i < seenCount; i++)
            cout << seen[i].first << " | " << seen[i].second << "\\n";`
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
        Employee filtered[100];
        int filteredCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (employees[i].department == "Engineering")
                { filtered[filteredCount] = employees[i]; filteredCount++; }
        for (int i = 0; i < filteredCount; i++)
            for (int j = i + 1; j < filteredCount; j++)
                if (filtered[i].salary < filtered[j].salary)
                    { Employee t = filtered[i]; filtered[i] = filtered[j]; filtered[j] = t; }
        for (int i = 0; i < filteredCount; i++)
            cout << filtered[i].name << " | " << filtered[i].department << " | " << filtered[i].salary << "\\n";`
      },
      {
        title: 'SELECT with ORDER BY',
        sql: `SELECT name, department, salary
FROM employees
ORDER BY salary DESC;`,
        explanation: 'SELECT retrieves the columns, ORDER BY sorts the results. This query lists all employees from highest to lowest salary.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees ORDER BY salary DESC;
        Employee sorted[100];
        int sortedCount = employeeCount;
        for (int i = 0; i < sortedCount; i++)
            sorted[i] = employees[i];
        for (int i = 0; i < sortedCount; i++)
            for (int j = i + 1; j < sortedCount; j++)
                if (sorted[i].salary < sorted[j].salary)
                    { Employee t = sorted[i]; sorted[i] = sorted[j]; sorted[j] = t; }
        for (int i = 0; i < sortedCount; i++)
            cout << sorted[i].name << " | " << sorted[i].department << " | " << sorted[i].salary << "\\n";`
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
        string salaryTier(double s) {
            if (s >= 100000) return "High";
            if (s >= 60000) return "Medium";
            return "Entry";
        }
        struct Result { string name; double salary; string tier; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            result[resultCount].name = employees[i].name;
            result[resultCount].salary = employees[i].salary;
            result[resultCount].tier = salaryTier(employees[i].salary);
            resultCount++;
        }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].salary < result[j].salary)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }
        for (int i = 0; i < resultCount; i++)
            cout << result[i].name << " | " << result[i].salary << " | " << result[i].tier << "\\n";`
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
        question: `Table: employees

Select distinct departments from the employees table, showing them as "department_name".

Return columns: department_name (unique values)
Order by: any order.`,
        hint: 'Use DISTINCT with an AS alias.',
        solution: `SELECT DISTINCT department AS department_name
FROM employees;`
      },
      {
        question: `Table: products

Select product names and their prices, with the price displayed as "price_with_tax" (price * 1.1).

Return columns: name, price_with_tax
Order by: any order.
Limit: 5 rows.`,
        hint: 'Use arithmetic in the SELECT clause with an alias and LIMIT.',
        solution: `SELECT name, price * 1.1 AS price_with_tax
FROM products
LIMIT 5;`
      },
      {
        question: `Table: products

Show each product's name, price, the price with a 20% discount labeled as "discounted_price", and the total inventory value (price * stock) labeled as "inventory_value".

Return columns: name, price, discounted_price, inventory_value
Order by: any order.
Limit: 8 rows.`,
        hint: 'Use arithmetic expressions in SELECT with AS aliases. Discounted price = price * 0.8, inventory value = price * stock.',
        solution: `SELECT name, price,
  price * 0.8 AS discounted_price,
  price * stock AS inventory_value
FROM products
LIMIT 8;`
      },
      {
        question: `Table: employees

Write a query that shows the first 5 distinct department-city combinations from the employees table.

Return columns: dept, location (aliased from department, city)
Order by: any order.
Limit: 5 rows.`,
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
    explanation: `── Real-World Analogy ──
WHERE is like a sieve/strainer. You pour all rows in, and only the ones that pass the test come out the other side.
  Raw rows → [ SIEVE: WHERE condition ] → Only matching rows

── Visual: How WHERE Filters ──
  employees table (ALL rows):           After WHERE department = 'IT':
  ┌──────────┬──────────┬────────┐      ┌──────────┬──────────┬────────┐
  │ name     │ dept     │ salary │      │ name     │ dept     │ salary │
  ├──────────┼──────────┼────────┤      ├──────────┼──────────┼────────┤
  │ Alice    │ IT       │ 100K   │      │ Alice    │ IT       │ 100K   │  ✅
  │ Bob      │ Sales    │ 80K    │  ──►  │ Charlie  │ IT       │ 90K    │  ✅
  │ Charlie  │ IT       │ 90K    │      └──────────┴──────────┴────────┘
  │ David    │ HR       │ 70K    │      Bob, David removed (not in IT)
  └──────────┴──────────┴────────┘

── All WHERE Operators ──
| Operator           | Meaning                  | Example                           |
|--------------------|--------------------------|-----------------------------------|
| =                  | Equal to                 | WHERE City = 'Cairo'              |
| <> or !=           | Not equal to             | WHERE JobTitle <> 'Manager'       |
| <, >, <=, >=       | Comparison               | WHERE Age >= 18                   |
| BETWEEN a AND b    | Inclusive range (a≤x≤b)  | WHERE Year BETWEEN 2009 AND 2011  |
| IN (list)          | Matches any in list      | WHERE City IN ('Cairo','Giza')    |
| NOT IN (list)      | Matches none in list     | WHERE City NOT IN ('Cairo')       |
| LIKE 'pattern'     | Pattern matching         | WHERE Name LIKE 'A%'              |
| IS NULL            | Value is missing         | WHERE City IS NULL                |
| IS NOT NULL        | Value exists             | WHERE City IS NOT NULL            |
| AND                | Both must be true        | WHERE City='Cairo' AND Age>18     |
| OR                 | Either must be true      | WHERE City='Cairo' OR City='Giza' |
| NOT                | Negate condition         | WHERE NOT City = 'Cairo'          |

── Logic Truth Table (AND / OR / NOT) ──
| Condition A | Condition B | A AND B  | A OR B   | NOT A    |
|:-----------:|:-----------:|:--------:|:--------:|:--------:|
| TRUE        | TRUE        | ✅ TRUE  | ✅ TRUE  | ❌ FALSE |
| TRUE        | FALSE       | ❌ FALSE | ✅ TRUE  | ❌ FALSE |
| FALSE       | TRUE        | ❌ FALSE | ✅ TRUE  | ✅ TRUE  |
| FALSE       | FALSE       | ❌ FALSE | ❌ FALSE | ✅ TRUE  |

── LIKE Patterns Quick Reference ──
| Pattern    | Meaning             | Matches                        |
|------------|---------------------|--------------------------------|
| '%son'     | Ends with "son"     | Johnson, Stevenson              |
| 'Data%'    | Starts with "Data"  | Database, Data Mining           |
| '%Data%'   | Contains "Data"     | Intro to Databases              |
| '_r%'      | 2nd char is 'r'     | Oracle, Arabic                  |
| 'IS%'      | Starts with IS      | IS221, IS312                    |

── Operator Precedence (Order of Evaluation) ──
1. Parentheses ()     → highest priority
2. Comparison ops     → =, <>, <, >, <=, >=
3. NOT               → negates the next condition
4. AND               → both sides must be true
5. OR                → at least one side must be true

Use parentheses to make precedence explicit: WHERE (City = 'Cairo' OR City = 'Giza') AND Age > 18`,
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
        cppRepresentation: `struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (employees[i].salary >= 90000) {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }`
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
        cppRepresentation: `struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (employees[i].department == "Engineering" && employees[i].salary >= 80000 && employees[i].status == "active") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }`
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
        cppRepresentation: `string target[2] = {"Engineering", "Product"};
        int targetCount = 2;
        struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            bool inTarget = false;
            for (int j = 0; j < targetCount; j++)
                if (employees[i].department == target[j]) { inTarget = true; break; }
            if (inTarget && employees[i].status == "active") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }
        }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].salary < result[j].salary)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
      },
      {
        title: 'BETWEEN — range filter',
        sql: `SELECT name, department, salary
FROM employees
WHERE salary BETWEEN 60000 AND 90000
  AND status = 'active';`,
        explanation: 'Finds active employees earning between $60,000 and $90,000 inclusive.',
        sourceTables: ['employees'],
        cppRepresentation: `struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (employees[i].salary >= 60000 && employees[i].salary <= 90000 && employees[i].status == "active") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }`
      },
      {
        title: 'LIKE — pattern matching',
        sql: `SELECT name, category, price
FROM products
WHERE name LIKE '%e%'
ORDER BY price DESC;`,
        explanation: 'Finds products whose name contains the letter "e", sorted from most to least expensive.',
        sourceTables: ['products'],
        cppRepresentation: `struct Result { string name; string category; double price; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < productCount; i++)
            if (products[i].name.find('e') != -1) {
                result[resultCount].name = products[i].name;
                result[resultCount].category = products[i].category;
                result[resultCount].price = products[i].price;
                resultCount++;
            }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].price < result[j].price)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
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
        cppRepresentation: `string cities[2] = {"New York", "San Francisco"};
        int cityCount = 2;
        struct Result { string name; string department; double salary; string city; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            bool inCity = false;
            for (int j = 0; j < cityCount; j++)
                if (employees[i].city == cities[j]) { inCity = true; break; }
            if ((employees[i].department == "Engineering" || employees[i].department == "Product") && inCity && employees[i].status == "active") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                result[resultCount].city = employees[i].city;
                resultCount++;
            }
        }`
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
        cppRepresentation: `struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (employees[i].department != "Marketing" && employees[i].status == "active" && employees[i].city != "Austin") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].salary < result[j].salary)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
      },
      {
        title: 'IS NULL — finding missing data',
        sql: `SELECT name, email
FROM employees
WHERE email IS NOT NULL
ORDER BY name;`,
        explanation: 'IS NOT NULL filters out rows where email is null. To find missing data use IS NULL. NULL comparisons with = never work.',
        sourceTables: ['employees'],
        cppRepresentation: `struct Result { string name; string email; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if (!employees[i].email.empty()) {
                result[resultCount].name = employees[i].name;
                result[resultCount].email = employees[i].email;
                resultCount++;
            }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].name > result[j].name)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
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
        cppRepresentation: `string exclude[2] = {"Marketing", "Product"};
        int excludeCount = 2;
        struct Result { string name; string department; double salary; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            bool excluded = false;
            for (int j = 0; j < excludeCount; j++)
                if (employees[i].department == exclude[j]) { excluded = true; break; }
            if (!excluded && employees[i].salary >= 60000 && employees[i].salary <= 100000) {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                resultCount++;
            }
        }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].salary > result[j].salary)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
      },
      {
        title: 'Date range filtering',
        sql: `SELECT customer, total, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'
ORDER BY order_date;`,
        explanation: 'Filters orders to only those placed in Q1 2024 using BETWEEN, which is inclusive of both boundary dates.',
        sourceTables: ['orders'],
        cppRepresentation: `struct Result { string customer; double total; string order_date; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < orderCount; i++)
            if (orders[i].order_date >= "2024-01-01" && orders[i].order_date <= "2024-03-31") {
                result[resultCount].customer = orders[i].customer;
                result[resultCount].total = orders[i].total;
                result[resultCount].order_date = orders[i].order_date;
                resultCount++;
            }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].order_date > result[j].order_date)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
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
        cppRepresentation: `struct Result { string name; string department; double salary; string city; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++)
            if ((employees[i].department == "Engineering" || employees[i].department == "Product") && (employees[i].salary > 80000 || employees[i].city == "New York") && employees[i].status == "active") {
                result[resultCount].name = employees[i].name;
                result[resultCount].department = employees[i].department;
                result[resultCount].salary = employees[i].salary;
                result[resultCount].city = employees[i].city;
                resultCount++;
            }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].salary < result[j].salary)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
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
        cppRepresentation: `struct Result { string name; string email; string department; };
        Result result[100];
        int resultCount = 0;
        for (int i = 0; i < employeeCount; i++) {
            bool startsA = (employees[i].name.length() >= 1 && employees[i].name[0] == 'A');
            bool endsE = (employees[i].name.length() >= 1 && employees[i].name[employees[i].name.length() - 1] == 'e');
            if (startsA || endsE) {
                result[resultCount].name = employees[i].name;
                result[resultCount].email = employees[i].email;
                result[resultCount].department = employees[i].department;
                resultCount++;
            }
        }
        for (int i = 0; i < resultCount; i++)
            for (int j = i + 1; j < resultCount; j++)
                if (result[i].name > result[j].name)
                    { Result t = result[i]; result[i] = result[j]; result[j] = t; }`
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
        question: `Table: products

Find all products that cost between $4 and $100, are in category "Electronics" or "Stationery", and have stock quantity greater than 50.

Return columns: * (all columns)
Order by: any order.`,
        hint: 'Combine BETWEEN, IN, AND, and comparison operators.',
        solution: `SELECT *
FROM products
WHERE price BETWEEN 4 AND 100
  AND category IN ('Electronics', 'Stationery')
  AND stock > 50;`
      },
      {
        question: `Table: employees

Find employees whose email ends with @company.com and who are not in the Engineering department.

Return columns: name, email, department
Order by: any order.`,
        hint: 'Use LIKE with a pattern and the <> or != operator.',
        solution: `SELECT name, email, department
FROM employees
WHERE email LIKE '%@company.com'
  AND department <> 'Engineering';`
      },
      {
        question: `Table: products

Find all products where the name contains the letter "e" (case-sensitive) AND the price is either under $30 or over $400.

Return columns: name, price, category
Order by: any order.`,
        hint: 'Use LIKE with wildcards to match "e". Combine with OR for the price condition. Parentheses matter for mixing AND with OR.',
        solution: `SELECT name, price, category
FROM products
WHERE name LIKE '%e%'
  AND (price < 30 OR price > 400);`
      },
      {
        question: `Table: employees

Challenge: Find all employees whose name starts with a letter in the first half of the alphabet (A through M) and whose salary is between $60,000 and $100,000.

Return columns: name, salary, department
Order by: any order.`,
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
    explanation: `── Real-World Analogy ──
ORDER BY is like sorting a deck of cards. You can sort by suit first, then by rank within each suit (multi-key sort).

── Visual: Before and After Sorting ──
  Without ORDER BY (insertion order):     ORDER BY salary DESC (highest first):
  ┌──────┬────────┐                       ┌──────┬────────┐
  │ name │ salary │                       │ name │ salary │
  ├──────┼────────┤                       ├──────┼────────┤
  │ Bob  │ 90K    │  ──►                  │ Alice│ 100K   │  ← highest
  │ Alice│ 100K   │                       │ Bob  │ 90K    │
  │ Carol│ 80K    │                       │ Carol│ 80K    │  ← lowest
  └──────┴────────┘                       └──────┴────────┘

── Visual: Multi-Key Sort ──
  ORDER BY department ASC, salary DESC:
  ┌──────────┬──────┬────────┐
  │ dept     │ name │ salary │  ← Sorted by dept A-Z, then by salary high-low within each dept
  ├──────────┼──────┼────────┤
  │ HR       │ Bob  │ 75K    │
  │ HR       │ Ann  │ 70K    │
  │ IT       │ Alice│ 100K   │
  │ IT       │ Chad │ 85K    │
  │ Sales    │ Dave │ 90K    │
  └──────────┴──────┴────────┘

── ORDER BY Rules ──
- Default order: ASC (ascending). Use DESC for descending: ORDER BY salary DESC
- Can sort by column NAME, ALIAS, or numeric POSITION: ORDER BY 3, 2 DESC (col3 primary, col2 secondary)
- Multiple keys: ORDER BY col1 ASC, col2 DESC (col1 = primary sort, col2 = tiebreaker)
- In UNION: only ONE ORDER BY at the very END (applies to whole result)
- Can use expressions: ORDER BY LENGTH(name) DESC, CASE WHEN status='active' THEN 1 ELSE 2 END
- Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → **ORDER BY** → LIMIT

── NULLs Sorting ──
| Database     | NULLs First? | Override              |
|--------------|:------------:|-----------------------|
| PostgreSQL   | Last (ASC)   | NULLS FIRST / NULLS LAST |
| MySQL        | First (ASC)  | No override           |
| SQL Server   | First (ASC)  | No override           |
| Oracle       | Last (ASC)   | NULLS FIRST / NULLS LAST |`,
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, salary FROM employees ORDER BY salary;
struct Result { string name; double salary; };
Result result[100];
int resultCount = 0;
for (int i = 0; i < employeeCount; i++) {
    result[resultCount].name = employees[i].name;
    result[resultCount].salary = employees[i].salary;
    resultCount++;
}
for (int i = 0; i < resultCount; i++) {
    for (int j = i + 1; j < resultCount; j++) {
        if (result[j].salary < result[i].salary) {
            Result temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
    }
}
for (int i = 0; i < resultCount; i++)
    cout << result[i].name << " | " << result[i].salary << "\\n";`
      },
      {
        title: 'Descending sort',
        sql: `SELECT name, salary, department
FROM employees
ORDER BY salary DESC;`,
        explanation: 'Sorts employees by salary from highest to lowest.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, salary, department FROM employees ORDER BY salary DESC;
struct Result { string name; double salary; string department; };
Result result[100];
int resultCount = 0;
for (int i = 0; i < employeeCount; i++) {
    result[resultCount].name = employees[i].name;
    result[resultCount].salary = employees[i].salary;
    result[resultCount].department = employees[i].department;
    resultCount++;
}
for (int i = 0; i < resultCount; i++) {
    for (int j = i + 1; j < resultCount; j++) {
        if (result[j].salary > result[i].salary) {
            Result temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
    }
}
for (int i = 0; i < resultCount; i++)
    cout << result[i].name << " | " << result[i].salary << " | " << result[i].department << "\\n";`
      },
      {
        title: 'Multiple sort columns',
        sql: `SELECT department, name, salary
FROM employees
ORDER BY department ASC, salary DESC;`,
        explanation: 'Sorts first by department alphabetically, then within each department by salary descending.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, name, salary FROM employees ORDER BY department ASC, salary DESC;
Employee sorted[100];
int sortedCount = employeeCount;
for (int i = 0; i < employeeCount; i++)
    sorted[i] = employees[i];
for (int i = 0; i < sortedCount; i++) {
    for (int j = i + 1; j < sortedCount; j++) {
        bool doSwap = false;
        if (sorted[j].department != sorted[i].department) {
            if (sorted[j].department < sorted[i].department) doSwap = true;
        } else {
            if (sorted[j].salary > sorted[i].salary) doSwap = true;
        }
        if (doSwap) {
            Employee temp = sorted[i];
            sorted[i] = sorted[j];
            sorted[j] = temp;
        }
    }
}
for (int i = 0; i < sortedCount; i++)
    cout << sorted[i].department << " | " << sorted[i].name << " | " << sorted[i].salary << "\\n";`
      },
      {
        title: 'Sort by column position',
        sql: `SELECT name, salary, department
FROM employees
ORDER BY 3, 2 DESC;`,
        explanation: 'Uses numeric positions instead of names. Column 3 (department) ASC, then column 2 (salary) DESC.',
        sourceTables: ['employees'],
        cppRepresentation: `// Uses numeric positions: column 3 (department) ASC, column 2 (salary) DESC
Employee sorted[100];
int sortedCount = employeeCount;
for (int i = 0; i < employeeCount; i++)
    sorted[i] = employees[i];
for (int i = 0; i < sortedCount; i++) {
    for (int j = i + 1; j < sortedCount; j++) {
        bool doSwap = false;
        if (sorted[j].department != sorted[i].department) {
            if (sorted[j].department < sorted[i].department) doSwap = true;
        } else {
            if (sorted[j].salary > sorted[i].salary) doSwap = true;
        }
        if (doSwap) {
            Employee temp = sorted[i];
            sorted[i] = sorted[j];
            sorted[j] = temp;
        }
    }
}
for (int i = 0; i < sortedCount; i++)
    cout << sorted[i].name << " | " << sorted[i].salary << " | " << sorted[i].department << "\\n";`
      },
      {
        title: 'Sort by expression',
        sql: `SELECT name, price, stock,
  price * stock AS inventory_value
FROM products
ORDER BY inventory_value DESC;`,
        explanation: 'Computes inventory value (price × stock) and sorts products by that computed value.',
        sourceTables: ['products'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, price, stock, price * stock AS inventory_value FROM products ORDER BY inventory_value DESC;
struct Result { string name; double price; int stock; double inventory_value; };
Result result[100];
int resultCount = 0;
for (int i = 0; i < productCount; i++) {
    result[resultCount].name = products[i].name;
    result[resultCount].price = products[i].price;
    result[resultCount].stock = products[i].stock;
    result[resultCount].inventory_value = products[i].price * products[i].stock;
    resultCount++;
}
for (int i = 0; i < resultCount; i++) {
    for (int j = i + 1; j < resultCount; j++) {
        if (result[j].inventory_value > result[i].inventory_value) {
            Result temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
    }
}
for (int i = 0; i < resultCount; i++)
    cout << result[i].name << " | " << result[i].price << " | " << result[i].stock << " | " << result[i].inventory_value << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees WHERE status = 'active' AND department IN ('Engineering', 'Product') ORDER BY salary DESC LIMIT 4;
string target[2] = {"Engineering", "Product"};
Employee filtered[100];
int filteredCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].status != "active") continue;
    bool inTarget = false;
    for (int t = 0; t < 2; t++)
        if (employees[i].department == target[t]) { inTarget = true; break; }
    if (inTarget) {
        filtered[filteredCount] = employees[i];
        filteredCount++;
    }
}
for (int i = 0; i < filteredCount; i++) {
    for (int j = i + 1; j < filteredCount; j++) {
        if (filtered[j].salary > filtered[i].salary) {
            Employee temp = filtered[i];
            filtered[i] = filtered[j];
            filtered[j] = temp;
        }
    }
}
int limit = 4;
int printCount = limit < filteredCount ? limit : filteredCount;
for (int i = 0; i < printCount; i++)
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, city, salary FROM employees WHERE status = 'active' ORDER BY CASE city ... END, name;
int cityPriority(string c) {
    if (c == "New York") return 1;
    if (c == "San Francisco") return 2;
    if (c == "Seattle") return 3;
    return 4;
}
Employee active[100];
int activeCount = 0;
for (int i = 0; i < employeeCount; i++)
    if (employees[i].status == "active") {
        active[activeCount] = employees[i];
        activeCount++;
    }
for (int i = 0; i < activeCount; i++) {
    for (int j = i + 1; j < activeCount; j++) {
        bool doSwap = false;
        int pa = cityPriority(active[j].city);
        int pb = cityPriority(active[i].city);
        if (pa != pb) {
            if (pa < pb) doSwap = true;
        } else {
            if (active[j].name < active[i].name) doSwap = true;
        }
        if (doSwap) {
            Employee temp = active[i];
            active[i] = active[j];
            active[j] = temp;
        }
    }
}
for (int i = 0; i < activeCount; i++)
    cout << active[i].name << " | " << active[i].city << " | " << active[i].salary << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary, salary * 12 AS annual_salary FROM employees WHERE department IN ('Engineering', 'Product') ORDER BY annual_salary DESC;
string target[2] = {"Engineering", "Product"};
struct Result { string name; string department; double salary; double annual_salary; };
Result result[100];
int resultCount = 0;
for (int i = 0; i < employeeCount; i++) {
    bool inTarget = false;
    for (int t = 0; t < 2; t++)
        if (employees[i].department == target[t]) { inTarget = true; break; }
    if (inTarget) {
        result[resultCount].name = employees[i].name;
        result[resultCount].department = employees[i].department;
        result[resultCount].salary = employees[i].salary;
        result[resultCount].annual_salary = employees[i].salary * 12;
        resultCount++;
    }
}
for (int i = 0; i < resultCount; i++) {
    for (int j = i + 1; j < resultCount; j++) {
        if (result[j].annual_salary > result[i].annual_salary) {
            Result temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
    }
}
for (int i = 0; i < resultCount; i++)
    cout << result[i].name << " | " << result[i].department << " | " << result[i].salary << " | " << result[i].annual_salary << "\\n";`
      },
      {
        title: 'Multi-directional sorting',
        sql: `SELECT name, department, salary
FROM employees
WHERE status = 'active'
ORDER BY department ASC, salary DESC;`,
        explanation: 'Sorts by department alphabetically (A to Z) and within each department by salary from highest to lowest — two columns with different directions.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, department, salary FROM employees WHERE status = 'active' ORDER BY department ASC, salary DESC;
Employee active[100];
int activeCount = 0;
for (int i = 0; i < employeeCount; i++)
    if (employees[i].status == "active") {
        active[activeCount] = employees[i];
        activeCount++;
    }
for (int i = 0; i < activeCount; i++) {
    for (int j = i + 1; j < activeCount; j++) {
        bool doSwap = false;
        if (active[j].department != active[i].department) {
            if (active[j].department < active[i].department) doSwap = true;
        } else {
            if (active[j].salary > active[i].salary) doSwap = true;
        }
        if (doSwap) {
            Employee temp = active[i];
            active[i] = active[j];
            active[j] = temp;
        }
    }
}
for (int i = 0; i < activeCount; i++)
    cout << active[i].name << " | " << active[i].department << " | " << active[i].salary << "\\n";`
      },
      {
        title: 'ORDER BY with text length',
        sql: `SELECT name, LENGTH(name) AS name_length, department
FROM employees
ORDER BY LENGTH(name) DESC, name ASC;`,
        explanation: 'Sorts employees by the length of their name (longest first), then alphabetically for names of the same length. Uses the LENGTH() function in ORDER BY.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT name, LENGTH(name) AS name_length, department FROM employees ORDER BY LENGTH(name) DESC, name ASC;
Employee sorted[100];
int sortedCount = employeeCount;
for (int i = 0; i < employeeCount; i++)
    sorted[i] = employees[i];
for (int i = 0; i < sortedCount; i++) {
    for (int j = i + 1; j < sortedCount; j++) {
        bool doSwap = false;
        if (sorted[j].name.length() != sorted[i].name.length()) {
            if (sorted[j].name.length() > sorted[i].name.length()) doSwap = true;
        } else {
            if (sorted[j].name < sorted[i].name) doSwap = true;
        }
        if (doSwap) {
            Employee temp = sorted[i];
            sorted[i] = sorted[j];
            sorted[j] = temp;
        }
    }
}
for (int i = 0; i < sortedCount; i++)
    cout << sorted[i].name << " | " << sorted[i].name.length() << " | " << sorted[i].department << "\\n";`
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
        question: `Table: products

List the top 5 most expensive products in the "Electronics" category, from highest to lowest price.

Return columns: name, price
Order by: price DESC
Limit: 5 rows.`,
        hint: 'Use WHERE to filter by category, ORDER BY price DESC to sort, and LIMIT 5.',
        solution: `SELECT name, price
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC
LIMIT 5;`
      },
      {
        question: `Table: employees

Show all employees sorted by department alphabetically, then by salary from highest to lowest within each department.

Return columns: name, department, salary
Order by: department ASC, salary DESC.`,
        hint: 'Use ORDER BY with two columns.',
        solution: `SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;`
      },
      {
        question: `Table: products

Challenge: Write a query that sorts products first by category in reverse alphabetical order (Z to A), then by price from lowest to highest within each category. Only show products with stock greater than 0.

Return columns: name, category, price, stock
Order by: category DESC, price ASC.`,
        hint: 'Use ORDER BY with category DESC (reverse alphabetical) and price ASC. Add WHERE to filter stock > 0.',
        solution: `SELECT name, category, price, stock
FROM products
WHERE stock > 0
ORDER BY category DESC, price ASC;`
      },
      {
        question: `Table: employees

Challenge: Write a query that sorts employees by salary divided by 1000 (as "salary_in_thousands") from highest to lowest, then by name alphabetically for ties. Only show employees with a non-null salary.

Return columns: name, salary, salary_in_thousands
Order by: salary_in_thousands DESC, name ASC
Limit: 10 rows.`,
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
    explanation: `── Real-World Analogy ──
You have a pile of sticky notes with names and departments. GROUP BY is like sorting them into separate piles by department.
Then you can COUNT how many are in each pile, or SUM their salaries per pile.

── Visual: How GROUP BY Works ──
  employees table (ALL rows):           After GROUP BY department:
  ┌──────────┬────────┐                 ┌──────────┬──────────┐
  │ name     │ dept   │  salary         │ dept     │ COUNT(*) │  ← one row per group
  ├──────────┼────────┤                 ├──────────┼──────────┤
  │ Alice    │ IT     │  100K           │ IT       │    2     │  ← 2 people in IT
  │ Bob      │ IT     │   80K           │ HR       │    1     │  ← 1 person in HR
  │ Carol    │ HR     │   70K           └──────────┴──────────┘
  │ Dave     │ IT     │   90K
  └──────────┴────────┘

  Visual pipeline:
  Raw rows → GROUP BY department → [{IT: [Alice, Bob, Dave]}, {HR: [Carol]}] → COUNT/SUM/AVG per group

── The Golden Rule (MOST IMPORTANT!) ──
Every column in SELECT must either be in GROUP BY OR inside an aggregate function.
  ✅ CORRECT:  SELECT department, COUNT(*) FROM employees GROUP BY department
  ❌ WRONG:    SELECT department, name FROM employees GROUP BY department
               → Error: "name" must appear in GROUP BY or be used in an aggregate function

── Execution Pipeline ──
WHERE (filter rows) → **GROUP BY** (create groups) → HAVING (filter groups) → SELECT (compute aggregates) → ORDER BY

── Aggregate Functions Reference ──
| Function               | Purpose                  | Numeric? | NULLs count? | Example output          |
|------------------------|--------------------------|:--------:|:------------:|-------------------------|
| COUNT(*)               | Count ALL rows           | No       | ✅ Yes       | COUNT(*) → 4 (total rows) |
| COUNT(col)             | Count non-NULL values    | No       | ❌ No        | COUNT(City) → 3 (if one NULL) |
| COUNT(DISTINCT col)    | Count unique non-NULL    | No       | ❌ No        | COUNT(DISTINCT dept) → 2 |
| SUM(col)               | Total of column values   | **YES**  | ❌ No        | SUM(Salary) → 340K      |
| AVG(col)               | Average of values        | **YES**  | ❌ No        | AVG(Salary) → 85K       |
| MIN(col)               | Smallest value           | No       | ❌ No        | MIN(Salary) → 70K       |
| MAX(col)               | Largest value            | No       | ❌ No        | MAX(Salary) → 100K      |`,
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, COUNT(*) AS employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;
string deptKeys[100];
int deptCounts[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        deptKeys[groupCount] = employees[i].department;
        deptCounts[groupCount] = 0;
        groupCount++;
    }
    deptCounts[idx]++;
}
for (int i = 0; i < groupCount; i++) {
    for (int j = i + 1; j < groupCount; j++) {
        if (deptCounts[j] > deptCounts[i]) {
            string tempK = deptKeys[i]; deptKeys[i] = deptKeys[j]; deptKeys[j] = tempK;
            int tempC = deptCounts[i]; deptCounts[i] = deptCounts[j]; deptCounts[j] = tempC;
        }
    }
}
for (int i = 0; i < groupCount; i++)
    cout << deptKeys[i] << " | " << deptCounts[i] << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, COUNT(*) AS headcount, ROUND(AVG(salary), 0) AS avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC;
string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        deptKeys[groupCount] = employees[i].department;
        deptCounts[groupCount] = 0;
        deptSums[groupCount] = 0.0;
        groupCount++;
    }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
for (int i = 0; i < groupCount; i++) {
    for (int j = i + 1; j < groupCount; j++) {
        double avgA = deptSums[i] / deptCounts[i];
        double avgB = deptSums[j] / deptCounts[j];
        if (avgB > avgA) {
            string tempK = deptKeys[i]; deptKeys[i] = deptKeys[j]; deptKeys[j] = tempK;
            int tempC = deptCounts[i]; deptCounts[i] = deptCounts[j]; deptCounts[j] = tempC;
            double tempS = deptSums[i]; deptSums[i] = deptSums[j]; deptSums[j] = tempS;
        }
    }
}
for (int i = 0; i < groupCount; i++)
    cout << deptKeys[i] << " | " << deptCounts[i] << " | " << round(deptSums[i] / deptCounts[i]) << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT category, COUNT(*) AS num_products, ROUND(AVG(price), 2) AS avg_price, MIN(price) AS cheapest, MAX(price) AS most_expensive, SUM(stock) AS total_stock FROM products GROUP BY category;
string catKeys[100];
int catCounts[100];
double catSums[100];
double catMins[100];
double catMaxs[100];
int catStocks[100];
int groupCount = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (catKeys[j] == products[i].category) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        catKeys[groupCount] = products[i].category;
        catCounts[groupCount] = 0;
        catSums[groupCount] = 0.0;
        catMins[groupCount] = products[i].price;
        catMaxs[groupCount] = products[i].price;
        catStocks[groupCount] = 0;
        groupCount++;
    }
    catCounts[idx]++;
    catSums[idx] += products[i].price;
    catStocks[idx] += products[i].stock;
    if (products[i].price < catMins[idx]) catMins[idx] = products[i].price;
    if (products[i].price > catMaxs[idx]) catMaxs[idx] = products[i].price;
}
for (int i = 0; i < groupCount; i++) {
    cout << catKeys[i] << " | " << catCounts[i] << " | avg=" << round(catSums[i] / catCounts[i] * 100) / 100
         << " | min=" << catMins[i] << " | max=" << catMaxs[i] << " | stock=" << catStocks[i] << "\\n";
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, COUNT(*) AS active_count, ROUND(AVG(salary), 0) AS avg_active_salary FROM employees WHERE status = 'active' GROUP BY department ORDER BY avg_active_salary DESC;
string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].status != "active") continue;
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        deptKeys[groupCount] = employees[i].department;
        deptCounts[groupCount] = 0;
        deptSums[groupCount] = 0.0;
        groupCount++;
    }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
for (int i = 0; i < groupCount; i++) {
    for (int j = i + 1; j < groupCount; j++) {
        double avgA = deptSums[i] / deptCounts[i];
        double avgB = deptSums[j] / deptCounts[j];
        if (avgB > avgA) {
            string tempK = deptKeys[i]; deptKeys[i] = deptKeys[j]; deptKeys[j] = tempK;
            int tempC = deptCounts[i]; deptCounts[i] = deptCounts[j]; deptCounts[j] = tempC;
            double tempS = deptSums[i]; deptSums[i] = deptSums[j]; deptSums[j] = tempS;
        }
    }
}
for (int i = 0; i < groupCount; i++)
    cout << deptKeys[i] << " | " << deptCounts[i] << " | " << round(deptSums[i] / deptCounts[i]) << "\\n";`
      },
      {
        title: 'GROUP BY multiple columns',
        sql: `SELECT department, status, COUNT(*) AS count
FROM employees
GROUP BY department, status
ORDER BY department, status;`,
        explanation: 'Groups by both department and status to see the breakdown of active vs inactive employees per department.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, status, COUNT(*) AS count FROM employees GROUP BY department, status ORDER BY department, status;
string groupDepts[100];
string groupStatuses[100];
int groupCounts[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (groupDepts[j] == employees[i].department && groupStatuses[j] == employees[i].status) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        groupDepts[groupCount] = employees[i].department;
        groupStatuses[groupCount] = employees[i].status;
        groupCounts[groupCount] = 0;
        groupCount++;
    }
    groupCounts[idx]++;
}
for (int i = 0; i < groupCount; i++) {
    for (int j = i + 1; j < groupCount; j++) {
        bool doSwap = false;
        if (groupDepts[j] != groupDepts[i]) {
            if (groupDepts[j] < groupDepts[i]) doSwap = true;
        } else {
            if (groupStatuses[j] < groupStatuses[i]) doSwap = true;
        }
        if (doSwap) {
            string tempD = groupDepts[i]; groupDepts[i] = groupDepts[j]; groupDepts[j] = tempD;
            string tempS = groupStatuses[i]; groupStatuses[i] = groupStatuses[j]; groupStatuses[j] = tempS;
            int tempC = groupCounts[i]; groupCounts[i] = groupCounts[j]; groupCounts[j] = tempC;
        }
    }
}
for (int i = 0; i < groupCount; i++)
    cout << groupDepts[i] << " | " << groupStatuses[i] << " | " << groupCounts[i] << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT CASE ... END AS salary_band, COUNT(*) AS employees, ROUND(AVG(salary), 0) AS avg_salary FROM employees GROUP BY salary_band ORDER BY MIN(salary);
string salaryBand(double s) {
    if (s < 70000) return "Under 70k";
    if (s < 100000) return "70k-100k";
    return "Over 100k";
}
string bandKeys[100];
int bandCounts[100];
double bandSums[100];
double bandMins[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    string band = salaryBand(employees[i].salary);
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (bandKeys[j] == band) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        bandKeys[groupCount] = band;
        bandCounts[groupCount] = 0;
        bandSums[groupCount] = 0.0;
        bandMins[groupCount] = employees[i].salary;
        groupCount++;
    }
    bandCounts[idx]++;
    bandSums[idx] += employees[i].salary;
    if (employees[i].salary < bandMins[idx]) bandMins[idx] = employees[i].salary;
}
for (int i = 0; i < groupCount; i++)
    cout << bandKeys[i] << " | count=" << bandCounts[i] << " | avg=" << round(bandSums[i] / bandCounts[i]) << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT category, COUNT(*) AS products, MIN(price) AS cheapest, MAX(price) AS most_expensive, ROUND(MAX(price) - MIN(price), 2) AS price_range FROM products GROUP BY category ORDER BY price_range DESC;
string catKeys[100];
int catCounts[100];
double catMins[100];
double catMaxs[100];
int groupCount = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (catKeys[j] == products[i].category) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        catKeys[groupCount] = products[i].category;
        catCounts[groupCount] = 0;
        catMins[groupCount] = products[i].price;
        catMaxs[groupCount] = products[i].price;
        groupCount++;
    }
    catCounts[idx]++;
    if (products[i].price < catMins[idx]) catMins[idx] = products[i].price;
    if (products[i].price > catMaxs[idx]) catMaxs[idx] = products[i].price;
}
for (int i = 0; i < groupCount; i++) {
    double range = catMaxs[i] - catMins[i];
    cout << catKeys[i] << " | " << catCounts[i] << " | $" << catMins[i] << " - $" << catMaxs[i]
         << " | range=$" << round(range * 100) / 100 << "\\n";
}`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT customer, COUNT(*) AS orders_count, ROUND(SUM(total), 2) AS total_spent, ROUND(AVG(total), 2) AS avg_order_value FROM orders GROUP BY customer ORDER BY total_spent DESC;
string custKeys[100];
int custCounts[100];
double custSums[100];
int groupCount = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (custKeys[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        custKeys[groupCount] = orders[i].customer;
        custCounts[groupCount] = 0;
        custSums[groupCount] = 0.0;
        groupCount++;
    }
    custCounts[idx]++;
    custSums[idx] += orders[i].total;
}
for (int i = 0; i < groupCount; i++)
    cout << custKeys[i] << " | orders=" << custCounts[i] << " | spent=$" << round(custSums[i] * 100) / 100
         << " | avg=$" << round(custSums[i] / custCounts[i] * 100) / 100 << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT CASE ... END AS order_size, COUNT(*) AS orders, ROUND(SUM(total), 2) AS total_revenue, ROUND(AVG(total), 2) AS avg_order_value FROM orders GROUP BY order_size ORDER BY MIN(total);
string sizeBand(double t) {
    if (t < 50) return "Small";
    if (t < 200) return "Medium";
    return "Large";
}
string bandKeys[100];
int bandCounts[100];
double bandSums[100];
double bandMins[100];
int groupCount = 0;
for (int i = 0; i < orderCount; i++) {
    string band = sizeBand(orders[i].total);
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (bandKeys[j] == band) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        bandKeys[groupCount] = band;
        bandCounts[groupCount] = 0;
        bandSums[groupCount] = 0.0;
        bandMins[groupCount] = orders[i].total;
        groupCount++;
    }
    bandCounts[idx]++;
    bandSums[idx] += orders[i].total;
    if (orders[i].total < bandMins[idx]) bandMins[idx] = orders[i].total;
}
for (int i = 0; i < groupCount; i++)
    cout << bandKeys[i] << " | " << bandCounts[i] << " | $" << round(bandSums[i] * 100) / 100
         << " | avg=$" << round(bandSums[i] / bandCounts[i] * 100) / 100 << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT customer, COUNT(*) AS order_count, ROUND(SUM(total), 2) AS total_spent, ROUND(AVG(total), 2) AS avg_order, MIN(total) AS smallest_order, MAX(total) AS largest_order FROM orders GROUP BY customer ORDER BY total_spent DESC;
string custKeys[100];
int custCounts[100];
double custSums[100];
double custMins[100];
double custMaxs[100];
int groupCount = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (custKeys[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        custKeys[groupCount] = orders[i].customer;
        custCounts[groupCount] = 0;
        custSums[groupCount] = 0.0;
        custMins[groupCount] = orders[i].total;
        custMaxs[groupCount] = orders[i].total;
        groupCount++;
    }
    custCounts[idx]++;
    custSums[idx] += orders[i].total;
    if (orders[i].total < custMins[idx]) custMins[idx] = orders[i].total;
    if (orders[i].total > custMaxs[idx]) custMaxs[idx] = orders[i].total;
}
for (int i = 0; i < groupCount; i++)
    cout << custKeys[i] << " | orders=" << custCounts[i] << " | total=$" << custSums[i]
         << " | avg=$" << custSums[i] / custCounts[i] << " | min=$" << custMins[i] << " | max=$" << custMaxs[i] << "\\n";`
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
        cppRepresentation: `// Intuitive C++ representation of: SELECT department, COUNT(*) AS headcount, ROUND(AVG(salary), 0) AS avg_salary FROM employees GROUP BY department HAVING COUNT(*) >= 2 ORDER BY headcount DESC;
string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int groupCount = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupCount; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) {
        idx = groupCount;
        deptKeys[groupCount] = employees[i].department;
        deptCounts[groupCount] = 0;
        deptSums[groupCount] = 0.0;
        groupCount++;
    }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
for (int i = 0; i < groupCount; i++) {
    if (deptCounts[i] >= 2) {
        cout << deptKeys[i] << " | " << deptCounts[i] << " | $" << round(deptSums[i] / deptCounts[i]) << "\\n";
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
        question: `Table: products

For each product category, show the total stock (SUM of stock) and the number of products.

Return columns: category, total_stock, product_count
Order by: total_stock DESC.`,
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
        question: `Table: employees

Find the average salary per department.

Return columns: department, avg_salary
Order by: avg_salary DESC.`,
        hint: 'Use GROUP BY department with AVG(salary) and ROUND.',
        solution: `SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`
      },
      {
        question: `Table: products

Challenge: Find the category with the widest price range (difference between max and min price).

Return columns: category, min_price, max_price, price_range
Order by: price_range DESC
Limit: 1 row.`,
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
        question: `Table: products

Challenge: Show each category's statistics: number of products, average price, total stock, and total potential revenue (SUM of price * stock). Only include products with stock greater than 0.

Return columns: category, product_count, avg_price, total_stock, total_potential_revenue
Order by: total_potential_revenue DESC.`,
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
    explanation: `── Real-World Analogy ──
WHERE is like checking IDs at the door BEFORE people enter the stadium (filter individuals).
HAVING is like checking section capacity AFTER everyone is seated (filter groups).

── Visual: WHERE vs HAVING Pipeline ──
  ┌────────┐    ┌────────────────┐    ┌─────────┐    ┌────────────────┐    ┌──────────┐
  │  ALL   │    │ WHERE: filter  │    │ GROUP   │    │ HAVING: filter │    │ FINAL    │
  │  ROWS  │──► │ individual     │──► │ BY      │──► │ groups by      │──► │ RESULT   │
  │        │    │ rows           │    │ (create │    │ aggregate      │    │ (groups) │
  │ 100    │    │ → 80 rows pass │    │ groups) │    │ → 2 depts pass │    │          │
  └────────┘    └────────────────┘    │ IT:40   │    └────────────────┘    └──────────┘
                                       │ HR:20   │
                                       │ Sales:40│
                                       └─────────┘

── Visual: WHERE vs HAVING with Real Data ──
  SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
  FROM employees
  WHERE salary > 50000          ← remove low earners FIRST
  GROUP BY department
  HAVING COUNT(*) >= 3;         ← then keep only depts with 3+ employees

  Step 1 - WHERE: remove rows where salary ≤ 50000
  Step 2 - GROUP BY: group remaining rows by department
  Step 3 - HAVING: keep only departments with ≥3 employees
  Step 4 - SELECT: for those groups, show dept, count, and avg salary

── WHERE vs HAVING Comparison ──
| Aspect           | WHERE                          | HAVING                          |
|------------------|--------------------------------|---------------------------------|
| When it runs     | BEFORE GROUP BY (filters rows) | AFTER GROUP BY (filters groups) |
| Aggregate fns    | ❌ Cannot use                  | ✅ Can use COUNT, SUM, AVG etc  |
| Column aliases   | ✅ Can use                     | ❌ Cannot use (standard SQL)    |
| Without GROUP BY | ✅ Works fine                  | ⚠ Rarely correct               |

── Quick Rule ──
"Can I check this BEFORE grouping?"  →  WHERE (row-level filter)
"Does this need the GROUP to exist?"  →  HAVING (group-level filter)

  WHERE salary > 50000  ✅  (each row has its own salary)
  HAVING AVG(salary) > 70000  ✅  (needs the group to compute average)`,
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
        cppRepresentation: `string depts[100];
int deptCounts[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].status == "active") {
        int idx = -1;
        for (int j = 0; j < deptSize; j++)
            if (depts[j] == employees[i].department) { idx = j; break; }
        if (idx == -1) { idx = deptSize++; depts[idx] = employees[i].department; deptCounts[idx] = 0; }
        deptCounts[idx]++;
    }
}
string resultDepts[100];
int resultCounts[100];
int resultSize = 0;
for (int i = 0; i < deptSize; i++)
    if (deptCounts[i] >= 2) { resultDepts[resultSize] = depts[i]; resultCounts[resultSize] = deptCounts[i]; resultSize++; }
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++)
        if (resultCounts[j] < resultCounts[j + 1]) {
            int tmpC = resultCounts[j]; resultCounts[j] = resultCounts[j + 1]; resultCounts[j + 1] = tmpC;
            string tmpD = resultDepts[j]; resultDepts[j] = resultDepts[j + 1]; resultDepts[j + 1] = tmpD;
        }`
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
        cppRepresentation: `string cats[100];
int counts[100];
double sums[100];
int groupSize = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (cats[j] == products[i].category) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; cats[idx] = products[i].category; counts[idx] = 0; sums[idx] = 0; }
    counts[idx]++;
    sums[idx] += products[i].price;
}
for (int i = 0; i < groupSize; i++) {
    double avg = sums[i] / counts[i];
    if (avg > 50)
        cout << cats[i] << " | avg=$" << round(avg * 100) / 100 << " | count=" << counts[i] << "\\n";
}`
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
        cppRepresentation: `string custs[100];
int orderCounts[100];
double totals[100];
int groupSize = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (custs[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; custs[idx] = orders[i].customer; orderCounts[idx] = 0; totals[idx] = 0; }
    orderCounts[idx]++;
    totals[idx] += orders[i].total;
}
string resCusts[100];
int resCounts[100];
double resTotals[100];
int resSize = 0;
for (int i = 0; i < groupSize; i++)
    if (totals[i] > 200) { resCusts[resSize] = custs[i]; resCounts[resSize] = orderCounts[i]; resTotals[resSize] = totals[i]; resSize++; }
for (int i = 0; i < resSize - 1; i++)
    for (int j = 0; j < resSize - 1 - i; j++)
        if (resTotals[j] < resTotals[j + 1]) {
            double tmpT = resTotals[j]; resTotals[j] = resTotals[j + 1]; resTotals[j + 1] = tmpT;
            int tmpC = resCounts[j]; resCounts[j] = resCounts[j + 1]; resCounts[j + 1] = tmpC;
            string tmpN = resCusts[j]; resCusts[j] = resCusts[j + 1]; resCusts[j + 1] = tmpN;
        }`
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
        cppRepresentation: `string depts[100];
int counts[100];
double sums[100];
int groupSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (depts[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; depts[idx] = employees[i].department; counts[idx] = 0; sums[idx] = 0; }
    counts[idx]++;
    sums[idx] += employees[i].salary;
}
for (int i = 0; i < groupSize; i++) {
    double avg = sums[i] / counts[i];
    if (counts[i] >= 2 && avg > 70000)
        cout << depts[i] << " | cnt=" << counts[i] << " | avg=$" << round(avg)
             << " | total=$" << sums[i] << "\\n";
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
        cppRepresentation: `string cats[100];
double lo[100];
double hi[100];
int groupSize = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (cats[j] == products[i].category) { idx = j; break; }
    if (idx == -1) {
        idx = groupSize++;
        cats[idx] = products[i].category;
        lo[idx] = products[i].price;
        hi[idx] = products[i].price;
    } else {
        if (products[i].price < lo[idx]) lo[idx] = products[i].price;
        if (products[i].price > hi[idx]) hi[idx] = products[i].price;
    }
}
for (int i = 0; i < groupSize; i++)
    if (hi[i] > lo[i] * 10)
        cout << cats[i] << " | min=$" << lo[i] << " | max=$" << hi[i] << "\\n";`
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
        cppRepresentation: `string custs[100];
int counts[100];
double sums[100];
int groupSize = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (custs[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; custs[idx] = orders[i].customer; counts[idx] = 0; sums[idx] = 0; }
    counts[idx]++;
    sums[idx] += orders[i].total;
}
string resCusts[100];
int resCounts[100];
double resSums[100];
double resAvgs[100];
int resSize = 0;
for (int i = 0; i < groupSize; i++) {
    double avg = sums[i] / counts[i];
    if (counts[i] >= 2 && avg > 100) {
        resCusts[resSize] = custs[i];
        resCounts[resSize] = counts[i];
        resSums[resSize] = sums[i];
        resAvgs[resSize] = avg;
        resSize++;
    }
}
for (int i = 0; i < resSize - 1; i++)
    for (int j = 0; j < resSize - 1 - i; j++)
        if (resSums[j] < resSums[j + 1]) {
            double tmpS = resSums[j]; resSums[j] = resSums[j + 1]; resSums[j + 1] = tmpS;
            int tmpC = resCounts[j]; resCounts[j] = resCounts[j + 1]; resCounts[j + 1] = tmpC;
            string tmpN = resCusts[j]; resCusts[j] = resCusts[j + 1]; resCusts[j + 1] = tmpN;
            double tmpA = resAvgs[j]; resAvgs[j] = resAvgs[j + 1]; resAvgs[j + 1] = tmpA;
        }`
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
        cppRepresentation: `string custs[100];
int counts[100];
double sums[100];
int groupSize = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (custs[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; custs[idx] = orders[i].customer; counts[idx] = 0; sums[idx] = 0; }
    counts[idx]++;
    sums[idx] += orders[i].total;
}
string resCusts[100];
int resCounts[100];
double resSums[100];
int resSize = 0;
for (int i = 0; i < groupSize; i++)
    if (sums[i] > 100 && counts[i] >= 2) {
        resCusts[resSize] = custs[i];
        resCounts[resSize] = counts[i];
        resSums[resSize] = sums[i];
        resSize++;
    }
for (int i = 0; i < resSize - 1; i++)
    for (int j = 0; j < resSize - 1 - i; j++)
        if (resSums[j] < resSums[j + 1]) {
            double tmpS = resSums[j]; resSums[j] = resSums[j + 1]; resSums[j + 1] = tmpS;
            int tmpC = resCounts[j]; resCounts[j] = resCounts[j + 1]; resCounts[j + 1] = tmpC;
            string tmpN = resCusts[j]; resCusts[j] = resCusts[j + 1]; resCusts[j + 1] = tmpN;
        }`
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
for (int i = 0; i < employeeCount; i++) totalSalary += employees[i].salary;
double companyAvg = totalSalary / employeeCount;
string depts[100];
int counts[100];
double sums[100];
int groupSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (depts[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = groupSize++; depts[idx] = employees[i].department; counts[idx] = 0; sums[idx] = 0; }
    counts[idx]++;
    sums[idx] += employees[i].salary;
}
string resDepts[100];
int resCounts[100];
double resAvgs[100];
int resSize = 0;
for (int i = 0; i < groupSize; i++) {
    double avg = sums[i] / counts[i];
    if (avg > companyAvg) {
        resDepts[resSize] = depts[i];
        resCounts[resSize] = counts[i];
        resAvgs[resSize] = round(avg);
        resSize++;
    }
}
for (int i = 0; i < resSize - 1; i++)
    for (int j = 0; j < resSize - 1 - i; j++)
        if (resAvgs[j] < resAvgs[j + 1]) {
            double tmpA = resAvgs[j]; resAvgs[j] = resAvgs[j + 1]; resAvgs[j + 1] = tmpA;
            int tmpC = resCounts[j]; resCounts[j] = resCounts[j + 1]; resCounts[j + 1] = tmpC;
            string tmpD = resDepts[j]; resDepts[j] = resDepts[j + 1]; resDepts[j + 1] = tmpD;
        }
for (int i = 0; i < resSize; i++)
    cout << resDepts[i] << " | cnt=" << resCounts[i] << " | avg=$" << resAvgs[i] << "\\n";`
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
        cppRepresentation: `string cats[100];
double lo[100];
double hi[100];
int groupSize = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < groupSize; j++)
        if (cats[j] == products[i].category) { idx = j; break; }
    if (idx == -1) {
        idx = groupSize++;
        cats[idx] = products[i].category;
        lo[idx] = products[i].price;
        hi[idx] = products[i].price;
    } else {
        if (products[i].price < lo[idx]) lo[idx] = products[i].price;
        if (products[i].price > hi[idx]) hi[idx] = products[i].price;
    }
}
for (int i = 0; i < groupSize; i++) {
    double spread = hi[i] - lo[i];
    if (spread > 100)
        cout << cats[i] << " | $" << lo[i] << " - $" << hi[i] << " | spread=$" << round(spread * 100) / 100 << "\\n";
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
        question: `Table: employees

Find departments where the average salary is above $65,000 and there are at least 2 employees.

Return columns: department, headcount, avg_salary
Order by: avg_salary DESC.`,
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
        question: `Table: products

Show product categories where the total stock value (SUM of price * stock) exceeds $10,000.

Return columns: category, total_stock_value
Order by: total_stock_value DESC.`,
        hint: 'Use GROUP BY with SUM in HAVING.',
        solution: `SELECT category, 
  SUM(price * stock) AS total_stock_value
FROM products
GROUP BY category
HAVING SUM(price * stock) > 10000
ORDER BY total_stock_value DESC;`
      },
      {
        question: `Table: products

Challenge: Find categories where the average price is at least double the minimum price in that category.

Return columns: category, avg_price, min_price, ratio
Order by: ratio DESC.`,
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
        question: `Table: employees

Challenge: Find departments where the total salary budget exceeds $150,000 and the average salary is above $55,000.

Return columns: department, total_salary, avg_salary, employee_count
Order by: total_salary DESC.`,
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
        question: `Table: employees

Find the top 2 highest-paid active employees in the Engineering department.

Return columns: name, department, salary
Order by: salary DESC
Limit: 2 rows.`,
        hint: 'WHERE status = \'active\' AND department = \'Engineering\', ORDER BY salary DESC, LIMIT 2.',
        solution: `SELECT name, department, salary
FROM employees
WHERE status = 'active' AND department = 'Engineering'
ORDER BY salary DESC
LIMIT 2;`
      },
      {
        question: `Table: products

Show how many products each category has, the average price, and the total stock. Only include categories where the average price is over $50.

Return columns: category, product_count, avg_price, total_stock
Order by: total_stock DESC.`,
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
        question: `Table: employees

Find employees whose salary is above the average salary of all employees, grouped by department. For each such department, show how many high earners there are and the average salary of those high earners.

Return columns: department, high_earners, avg_high_salary
Order by: avg_high_salary DESC.`,
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
        question: `Table: products

List products that cost more than $50, sorted by category alphabetically and then by price descending within each category.

Return columns: name, category, price
Order by: category ASC, price DESC
Limit: 5 rows.`,
        hint: 'WHERE price > 50, ORDER BY category ASC, price DESC, LIMIT 5.',
        solution: `SELECT name, category, price
FROM products
WHERE price > 50
ORDER BY category ASC, price DESC
LIMIT 5;`
      },
      {
        question: `Table: employees

Write a query that uses DISTINCT to find all unique department-city combinations from employees, aliasing them as "dept" and "location".

Return columns: dept, location (aliased from department, city)
Order by: any order.`,
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
    topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'SELF JOIN', 'USING clause', 'ON vs WHERE', 'join predicate', 'filter predicate'],
    explanation: `── Real-World Analogy ──
Two tables are like two separate lists. INNER JOIN = "show me items that appear in BOTH lists."
LEFT JOIN = "show me everything from list A, and add info from list B if available."

Think of two puzzle pieces — the key column is the interlocking tab that connects them.

── Visual: JOINs with Real Data ──
  students table (LEFT):            registrations table (RIGHT):
  ┌────┬────────┐                   ┌────┬────────────┐
  │ id │ name   │                   │ id │ student_id │
  ├────┼────────┤                   ├────┼────────────┤
  │ 1  │ Alice  │                   │ 1  │ 1          │  ← Alice registered
  │ 2  │ Bob    │                   │ 2  │ 3          │  ← Charlie registered
  │ 3  │ Charlie│                   │ 3  │ 1          │  ← Alice registered again
  │ 4  │ Diana  │                   └────┴────────────┘  Diana never registered
  └────┴────────┘

  INNER JOIN ON students.id = registrations.student_id:
  ┌────┬─────────┬───────┐
  │ id │ name    │ reg_id│  → Only students WITH registrations: Alice (2 regs), Charlie (1)
  ├────┼─────────┼───────┤    Bob and Diana excluded (no match on the RIGHT)
  │ 1  │ Alice   │ 1     │  ← registration id=1 links student 1 to course
  │ 1  │ Alice   │ 3     │  ← registration id=3 links student 1 again
  │ 3  │ Charlie │ 2     │  ← registration id=2 links student 3
  └────┴─────────┴───────┘

  LEFT JOIN ON students.id = registrations.student_id:
  ┌────┬─────────┬───────┐
  │ id │ name    │ reg_id│  → ALL students, even without registrations
  ├────┼─────────┼───────┤    Bob and Diana show with NULL on the right-side columns
  │ 1  │ Alice   │ 1     │
  │ 1  │ Alice   │ 3     │
  │ 2  │ Bob     │ NULL  │  ← Bob never registered → NULL for right-side columns
  │ 3  │ Charlie │ 2     │
  │ 4  │ Diana   │ NULL  │  ← Diana never registered → NULL for right-side columns
  └────┴─────────┴───────┘

── JOIN Types Quick Comparison ──
| Join Type      | Returns                                | Use When                         |
|----------------|----------------------------------------|----------------------------------|
| INNER JOIN     | Only matching rows in BOTH tables      | "Get all students with courses"  |
| LEFT JOIN      | ALL rows from LEFT + matches from RIGHT| "Get all students even if no reg"|
| RIGHT JOIN     | ALL rows from RIGHT + matches from LEFT| "Get all courses even if empty"  |
| FULL OUTER JOIN| ALL rows from BOTH tables              | "Get everything from both sides" |
| CROSS JOIN     | Cartesion product (|A| × |B| rows)     | "Get all combinations"           |
| SELF JOIN      | Table joined to itself (with aliases)  | "Find employees earning more"    |

── Set Visual: What Each JOIN Returns ──
  Think of two overlapping circles:
  - Circle A = all rows from the LEFT table  (students)
  - Circle B = all rows from the RIGHT table (registrations)
  - Overlap  = rows that MATCH (students who have registrations)

                      ┌─────┐
          ┌─────┐     │  2  │     ┌─────┐
          │     │     │ reg │     │     │
          │  1  │     │  ids│     │  3  │
          │ stu │     │  1  │     │ reg │
          │ 2,4 │ ──► │  3  │ ◄── │ ids │
          │ (no │     │     │     │ (no │
          │ reg) │     │ stu │     │ stu)│
          └─────┘     │ 1,3 │     └─────┘
                      └─────┘
        LEFT side            OVERLAP           RIGHT side
      (only from A)     (A ∩ B = matched)   (only from B)

  INNER = overlap only:       │Alice×2, Charlie│  (3 rows)
  LEFT  = left + overlap:     │Alice×2, Bob, Charlie, Diana│  (5 rows)
  RIGHT = overlap + right:    │Alice×2, Charlie│  (3 rows — no orphan regs)
  FULL  = everything:         │Alice×2, Bob, Charlie, Diana│  (5 rows)
  CROSS = A × B:              │4 students × 3 registrations = 12 rows│

── ON vs USING vs WHERE in JOINs ──

  ON     → specifies the JOIN condition (how rows MATCH between tables)
  USING  → shorthand when the FK column has the SAME name in both tables
  WHERE  → filters the result AFTER the JOIN is complete

  -- ON: explicit, works with any column names
  SELECT * FROM orders o
  JOIN products p ON o.product_id = p.id;

  -- USING: concise, columns must have identical names in both tables
  SELECT * FROM orders
  JOIN products USING (product_id);        -- only if both have "product_id"

  -- WHERE (old implicit syntax, easy to forget condition → CROSS JOIN)
  SELECT * FROM orders o, products p
  WHERE o.product_id = p.id;               -- same as INNER JOIN

── Critical: ON vs WHERE in OUTER JOINs ──
  In LEFT/RIGHT/FULL JOINs, putting a right-table condition in WHERE
  instead of ON can silently convert your outer join to an inner join:

    LEFT JOIN products p ON o.product_id = p.id
      AND p.category = 'Electronics'     ← ON: filters BEFORE join, keeps all orders
      
    LEFT JOIN products p ON o.product_id = p.id
      WHERE p.category = 'Electronics'  ← WHERE: filters AFTER join, DROPS orders
                                           with NULL products → acts like INNER JOIN

    Rule of thumb:
    - ON   → "which rows from the RIGHT table should I attempt to match?"
    - WHERE → "which rows from the COMBINED result should I KEEP?"

── Named Patterns: Semi-Join & Anti-Join ──
  These aren't separate SQL keywords — they're patterns built from other JOINs:

  Anti-join  = rows in A with NO match in B:
    SELECT A.* FROM A LEFT JOIN B ON ... WHERE B.id IS NULL;
    → "Products never ordered" (Example 3 above)

  Semi-join  = rows in A that HAVE at least one match in B
    (usually written with EXISTS or IN subquery, not with JOIN)
    → "Customers who have placed orders"
    ──
    Note: INNER JOIN with DISTINCT on A's columns achieves the same
    result, but EXISTS/IN is often clearer and avoids the DISTINCT.

── Key Rules ──
- LEFT JOIN = RIGHT JOIN with tables swapped (reverse table order to convert)
- RIGHT JOIN mirrors LEFT JOIN; always rewritable as LEFT JOIN by swapping tables
- RIGHT JOIN is not natively supported in SQLite before v3.39.0 — simulate with swapped LEFT JOIN
- A meaningful N-table JOIN typically needs N-1 join conditions; fewer conditions → Cartesian product between unconnected tables
- Always qualify column names with table aliases when joining (table.column) to avoid ambiguity
- INNER JOIN can be written as: FROM A, B WHERE A.id = B.id (old implicit syntax) — but this is error-prone; use explicit JOIN
- In LEFT JOIN, putting a right-table filter in WHERE instead of ON turns it into INNER JOIN (NULLs from failed matches are filtered out)
- Anti-join pattern (LEFT JOIN + WHERE IS NULL) finds rows with NO match — essential for data quality checks`,
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

-- USING (shorthand when column name is identical)
SELECT a.col, b.col
FROM table_a a
JOIN table_b b USING (shared_column);

-- CROSS JOIN
SELECT a.col, b.col
FROM table_a a
CROSS JOIN table_b b;

-- SELF JOIN
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Multiple JOINs
SELECT o.id, c.name AS customer, p.name AS product
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;`,
    examples: [
      {
        title: 'INNER JOIN — matching rows only',
        sql: `SELECT o.id AS order_id,
  o.customer_name,
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
int resIds[100];
string resCusts[100];
string resProds[100];
int resQtys[100];
double resTotals[100];
int resultSize = 0;
for (int i = 0; i < orderCount; i++)
    for (int j = 0; j < productCount; j++)
        if (orders[i].product_id == products[j].id) {
            resIds[resultSize] = orders[i].id;
            resCusts[resultSize] = orders[i].customer;
            resProds[resultSize] = products[j].name;
            resQtys[resultSize] = orders[i].quantity;
            resTotals[resultSize] = orders[i].total;
            resultSize++;
            break;
        }
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++)
        if (resTotals[j] < resTotals[j + 1]) {
            double tmpT = resTotals[j]; resTotals[j] = resTotals[j + 1]; resTotals[j + 1] = tmpT;
            int tmpId = resIds[j]; resIds[j] = resIds[j + 1]; resIds[j + 1] = tmpId;
            string tmpC = resCusts[j]; resCusts[j] = resCusts[j + 1]; resCusts[j + 1] = tmpC;
            string tmpP = resProds[j]; resProds[j] = resProds[j + 1]; resProds[j + 1] = tmpP;
            int tmpQ = resQtys[j]; resQtys[j] = resQtys[j + 1]; resQtys[j + 1] = tmpQ;
        }`
      },
      {
        title: 'LEFT JOIN — include all from left',
        sql: `SELECT p.name,
  p.price,
  o.id AS order_id,
  o.customer_name
FROM products p
LEFT JOIN orders o ON p.id = o.product_id;`,
        explanation: 'Shows all products, even ones never ordered. Products without orders get NULL for order_id and customer_name. INNER JOIN would exclude them.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `string names[100];
double prices[100];
int orderIds[100];
string custs[100];
bool hasOrder[100];
int resultSize = 0;
for (int i = 0; i < productCount; i++) {
    bool matched = false;
    for (int j = 0; j < orderCount; j++)
        if (products[i].id == orders[j].product_id) {
            names[resultSize] = products[i].name;
            prices[resultSize] = products[i].price;
            orderIds[resultSize] = orders[j].id;
            custs[resultSize] = orders[j].customer;
            hasOrder[resultSize] = true;
            resultSize++;
            matched = true;
        }
    if (!matched) {
        names[resultSize] = products[i].name;
        prices[resultSize] = products[i].price;
        orderIds[resultSize] = -1;
        custs[resultSize] = "";
        hasOrder[resultSize] = false;
        resultSize++;
    }
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
        cppRepresentation: `string resultNames[100];
string resultCats[100];
int resultSize = 0;
for (int i = 0; i < productCount; i++) {
    bool found = false;
    for (int j = 0; j < orderCount; j++)
        if (products[i].id == orders[j].product_id) { found = true; break; }
    if (!found) { resultNames[resultSize] = products[i].name; resultCats[resultSize] = products[i].category; resultSize++; }
}`
      },
      {
        title: 'RIGHT JOIN — all from right table',
        sql: `SELECT o.id AS order_id,
  o.customer_name,
  p.name AS product,
  o.total
FROM orders o
RIGHT JOIN products p ON o.product_id = p.id
ORDER BY p.name;`,
        explanation: 'RIGHT JOIN keeps all rows from the RIGHT table (products), matching orders where they exist. Products without orders get NULL for order_id and customer. This is the mirror of LEFT JOIN — swap table order to convert between them.',
        sourceTables: ['orders', 'products'],
        cppRepresentation: `int orderIds[100];
string custs[100];
string prods[100];
double totals[100];
bool hasOrder[100];
int resultSize = 0;
for (int i = 0; i < productCount; i++) {
    bool matched = false;
    for (int j = 0; j < orderCount; j++)
        if (orders[j].product_id == products[i].id) {
            orderIds[resultSize] = orders[j].id;
            custs[resultSize] = orders[j].customer;
            prods[resultSize] = products[i].name;
            totals[resultSize] = orders[j].total;
            hasOrder[resultSize] = true;
            resultSize++;
            matched = true;
        }
    if (!matched) {
        orderIds[resultSize] = -1;
        custs[resultSize] = "";
        prods[resultSize] = products[i].name;
        totals[resultSize] = 0.0;
        hasOrder[resultSize] = false;
        resultSize++;
    }
}
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++)
        if (prods[j] > prods[j + 1]) {
            string tmpP = prods[j]; prods[j] = prods[j + 1]; prods[j + 1] = tmpP;
            int tmpId = orderIds[j]; orderIds[j] = orderIds[j + 1]; orderIds[j + 1] = tmpId;
            string tmpC = custs[j]; custs[j] = custs[j + 1]; custs[j + 1] = tmpC;
            double tmpT = totals[j]; totals[j] = totals[j + 1]; totals[j + 1] = tmpT;
            bool tmpH = hasOrder[j]; hasOrder[j] = hasOrder[j + 1]; hasOrder[j + 1] = tmpH;
        }`
      },
      {
        title: 'FULL JOIN — all rows from both tables',
        sql: `SELECT e.name AS employee,
  e.department,
  o.id AS order_id,
  o.total
FROM employees e
FULL JOIN orders o ON e.name = o.customer_name
ORDER BY e.name, o.id;`,
        explanation: 'FULL JOIN keeps all rows from BOTH tables. Employees without orders show NULL for order columns. Orders that don\'t match any employee (if any) would also appear. FULL JOIN = LEFT JOIN + RIGHT JOIN + INNER JOIN combined.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `string names[100];
string depts[100];
int orderIds[100];
double totals[100];
bool hasName[100];
bool hasOrder[100];
int resultSize = 0;
string matchedNames[100];
int matchedSize = 0;
for (int i = 0; i < employeeCount; i++) {
    bool matched = false;
    for (int j = 0; j < orderCount; j++)
        if (employees[i].name == orders[j].customer) {
            names[resultSize] = employees[i].name;
            depts[resultSize] = employees[i].department;
            orderIds[resultSize] = orders[j].id;
            totals[resultSize] = orders[j].total;
            hasName[resultSize] = true;
            hasOrder[resultSize] = true;
            resultSize++;
            matched = true;
            matchedNames[matchedSize++] = employees[i].name;
        }
    if (!matched) {
        names[resultSize] = employees[i].name;
        depts[resultSize] = employees[i].department;
        orderIds[resultSize] = -1;
        totals[resultSize] = 0.0;
        hasName[resultSize] = true;
        hasOrder[resultSize] = false;
        resultSize++;
    }
}
for (int i = 0; i < orderCount; i++) {
    bool found = false;
    for (int j = 0; j < matchedSize; j++)
        if (matchedNames[j] == orders[i].customer) { found = true; break; }
    if (!found) {
        names[resultSize] = "";
        depts[resultSize] = "";
        orderIds[resultSize] = orders[i].id;
        totals[resultSize] = orders[i].total;
        hasName[resultSize] = false;
        hasOrder[resultSize] = true;
        resultSize++;
    }
}
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++) {
        string na = hasName[j] ? names[j] : "";
        string nb = hasName[j + 1] ? names[j + 1] : "";
        int oa = hasOrder[j] ? orderIds[j] : -1;
        int ob = hasOrder[j + 1] ? orderIds[j + 1] : -1;
        bool doSwap = false;
        if (na > nb) doSwap = true;
        else if (na == nb && oa > ob) doSwap = true;
        if (doSwap) {
            string tmpNa = names[j]; names[j] = names[j + 1]; names[j + 1] = tmpNa;
            string tmpD = depts[j]; depts[j] = depts[j + 1]; depts[j + 1] = tmpD;
            int tmpId = orderIds[j]; orderIds[j] = orderIds[j + 1]; orderIds[j + 1] = tmpId;
            double tmpT = totals[j]; totals[j] = totals[j + 1]; totals[j + 1] = tmpT;
            bool tmpHN = hasName[j]; hasName[j] = hasName[j + 1]; hasName[j + 1] = tmpHN;
            bool tmpHO = hasOrder[j]; hasOrder[j] = hasOrder[j + 1]; hasOrder[j + 1] = tmpHO;
        }
    }`
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
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department != "Engineering") continue;
    for (int j = 0; j < employeeCount; j++)
        if (employees[i].salary < employees[j].salary)
            cout << employees[i].name << " ($" << employees[i].salary << ") | " << employees[j].name << " ($" << employees[j].salary << ")\\n";
}`
      },
      {
        title: 'CROSS JOIN — all combinations',
        sql: `-- Every employee paired with every product (cartesian product)
SELECT e.name AS employee, e.department, p.name AS product
FROM employees e
CROSS JOIN products p
ORDER BY e.name, p.name
LIMIT 15;

-- CROSS JOIN with a filter = restricting one table BEFORE crossing
-- This is NOT a join condition — it filters rows before the cross
SELECT e.name, p.name
FROM employees e
CROSS JOIN products p
WHERE e.department = 'Engineering'
LIMIT 10;`,
        explanation: 'CROSS JOIN produces every combination of rows (|A| × |B|). The first query pairs ALL 10 employees with ALL 8 products = 80 rows (limited to 15). The second filters Engineering employees FIRST (3 employees), THEN crosses with 8 products = 24 rows. Use cautiously — results grow exponentially.',
        sourceTables: ['employees', 'products'],
        cppRepresentation: `string resNames[100];
string resDepts[100];
string resProds[100];
int resultSize = 0;
for (int i = 0; i < employeeCount; i++)
    if (employees[i].department == "Engineering")
        for (int j = 0; j < productCount; j++) {
            resNames[resultSize] = employees[i].name;
            resDepts[resultSize] = employees[i].department;
            resProds[resultSize] = products[j].name;
            resultSize++;
        }
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++) {
        bool doSwap = false;
        if (resNames[j] > resNames[j + 1]) doSwap = true;
        else if (resNames[j] == resNames[j + 1] && resProds[j] > resProds[j + 1]) doSwap = true;
        if (doSwap) {
            string tmpN = resNames[j]; resNames[j] = resNames[j + 1]; resNames[j + 1] = tmpN;
            string tmpD = resDepts[j]; resDepts[j] = resDepts[j + 1]; resDepts[j + 1] = tmpD;
            string tmpP = resProds[j]; resProds[j] = resProds[j + 1]; resProds[j + 1] = tmpP;
        }
    }
if (resultSize > 15) resultSize = 15;`
      },
      {
        title: 'ON vs WHERE in LEFT JOIN (critical concept)',
        sql: `-- LEFT JOIN with filter in ON: keeps ALL employees
-- right-table filter is evaluated BEFORE the join
SELECT e.name, e.department, o.total
FROM employees e
LEFT JOIN orders o
  ON e.name = o.customer_name
  AND o.total > 200
ORDER BY e.name;

-- Same LEFT JOIN with filter in WHERE: DROPS employees with no matching order
-- right-table filter is evaluated AFTER the join → NULLs get filtered out
SELECT e.name, e.department, o.total
FROM employees e
LEFT JOIN orders o ON e.name = o.customer_name
WHERE o.total > 200
ORDER BY e.name;`,
        explanation: 'The first query keeps ALL employees (LEFT JOIN), only matching orders over $200. Employees without orders >$200 still appear with NULL total. The second query behaves like INNER JOIN: WHERE filters out rows where o.total IS NULL, so employees without matching orders disappear entirely.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `// ON filter (keeps all employees):
for (int i = 0; i < employeeCount; i++) {
    bool matched = false;
    for (int j = 0; j < orderCount; j++)
        if (employees[i].name == orders[j].customer_name && orders[j].total > 200) {
            cout << employees[i].name << " | " << orders[j].total << "\\n";
            matched = true;
        }
    if (!matched) cout << employees[i].name << " | NULL\\n";
}
// WHERE filter (drops employees without qualifying orders):
for (int i = 0; i < employeeCount; i++)
    for (int j = 0; j < orderCount; j++)
        if (employees[i].name == orders[j].customer_name && orders[j].total > 200)
            cout << employees[i].name << " | " << orders[j].total << "\\n";`
      },
      {
        title: 'USING clause — shorter syntax for equi-joins',
        sql: `-- USING requires identical column names in both tables
-- Here: products.id = order_items.product_id
SELECT p.name, oi.quantity
FROM products p
JOIN order_items oi USING (product_id)
ORDER BY p.name;

-- Equivalent ON version (more flexible)
SELECT p.name, oi.quantity
FROM products p
JOIN order_items oi ON p.id = oi.product_id
ORDER BY p.name;

-- Multi-table USING: joins on shared "id" columns
-- Only works when ALL joined tables have "id" as the FK name
SELECT c.name, o.total, p.name AS product
FROM customers c
JOIN orders o USING (id)            -- error: orders.id ≠ customers.id
JOIN products p ON o.product_id = p.id;`,
        explanation: 'USING is syntactic sugar for equi-joins where the FK column has the same name in both tables. It avoids the redundant ON condition. Limitation: both columns must have identical names and you cannot qualify the join column with a table alias in the SELECT list.',
        sourceTables: ['products', 'order_items', 'customers', 'orders'],
        cppRepresentation: `// USING is just syntax sugar — same result as ON
for (int i = 0; i < productCount; i++)
    for (int j = 0; j < orderItemCount; j++)
        if (products[i].id == orderItems[j].product_id)
            cout << products[i].name << " | " << orderItems[j].quantity << "\\n";`
      },
      {
        title: 'Multiple JOINs',
        sql: `SELECT o.id AS order_id,
  o.customer_name,
  p.name AS product,
  p.category,
  o.quantity,
  o.total,
  e.department AS customer_department
FROM orders o
JOIN products p ON o.product_id = p.id
JOIN employees e ON o.customer_name = e.name
ORDER BY o.total DESC;`,
        explanation: 'Joins all three tables: orders to products by product_id, and orders to employees by customer name. Shows order details enriched with product info and the purchasing employee department.',
        sourceTables: ['orders', 'products', 'employees'],
        cppRepresentation: `struct Product { int id; string name; string category; double price; int stock; };
struct Employee { int id; string name; string department; double salary; string status; };
int resIds[100];
string resCusts[100];
string resProds[100];
string resCats[100];
int resQtys[100];
double resTotals[100];
string resDepts[100];
int resultSize = 0;
for (int i = 0; i < orderCount; i++) {
    int mpIdx = -1;
    int meIdx = -1;
    for (int j = 0; j < productCount; j++)
        if (orders[i].product_id == products[j].id) { mpIdx = j; break; }
    for (int k = 0; k < employeeCount; k++)
        if (orders[i].customer == employees[k].name) { meIdx = k; break; }
    if (mpIdx != -1 && meIdx != -1) {
        resIds[resultSize] = orders[i].id;
        resCusts[resultSize] = orders[i].customer;
        resProds[resultSize] = products[mpIdx].name;
        resCats[resultSize] = products[mpIdx].category;
        resQtys[resultSize] = orders[i].quantity;
        resTotals[resultSize] = orders[i].total;
        resDepts[resultSize] = employees[meIdx].department;
        resultSize++;
    }
}
for (int i = 0; i < resultSize - 1; i++)
    for (int j = 0; j < resultSize - 1 - i; j++)
        if (resTotals[j] < resTotals[j + 1]) {
            double tmpT = resTotals[j]; resTotals[j] = resTotals[j + 1]; resTotals[j + 1] = tmpT;
            int tmpId = resIds[j]; resIds[j] = resIds[j + 1]; resIds[j + 1] = tmpId;
            string tmpC = resCusts[j]; resCusts[j] = resCusts[j + 1]; resCusts[j + 1] = tmpC;
            string tmpP = resProds[j]; resProds[j] = resProds[j + 1]; resProds[j + 1] = tmpP;
            string tmpCa = resCats[j]; resCats[j] = resCats[j + 1]; resCats[j + 1] = tmpCa;
            int tmpQ = resQtys[j]; resQtys[j] = resQtys[j + 1]; resQtys[j + 1] = tmpQ;
            string tmpD = resDepts[j]; resDepts[j] = resDepts[j + 1]; resDepts[j + 1] = tmpD;
        }`
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
        cppRepresentation: `string cats[100];
double revSums[100];
int revCounts[100];
int distinctCounts[100];
int catSize = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < catSize; j++)
        if (cats[j] == products[i].category) { idx = j; break; }
    if (idx == -1) { idx = catSize++; cats[idx] = products[i].category; revSums[idx] = 0; revCounts[idx] = 0; distinctCounts[idx] = 0; }
}
int seenIds[100];
int seenSize;
for (int i = 0; i < catSize; i++) {
    seenSize = 0;
    for (int j = 0; j < productCount; j++)
        if (products[j].category == cats[i])
            for (int k = 0; k < orderCount; k++)
                if (products[j].id == orders[k].product_id) {
                    revSums[i] += orders[k].total;
                    revCounts[i]++;
                    bool dup = false;
                    for (int l = 0; l < seenSize; l++)
                        if (seenIds[l] == orders[k].id) { dup = true; break; }
                    if (!dup) { seenIds[seenSize++] = orders[k].id; distinctCounts[i]++; }
                }
}
for (int i = 0; i < catSize; i++) {
    double sum = revSums[i];
    int cnt = distinctCounts[i];
    cout << cats[i] << " | orders=" << cnt << " | rev=$" << round(sum * 100) / 100
         << " | avg=$" << (revCounts[i] == 0 ? 0.0 : round(sum / revCounts[i] * 100) / 100) << "\\n";
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
        cppRepresentation: `for (int i = 0; i < employeeCount; i++)
    for (int j = 0; j < employeeCount; j++)
        if (employees[i].department == employees[j].department && employees[i].name < employees[j].name && employees[i].salary != employees[j].salary)
            cout << employees[i].name << " ($" << employees[i].salary << ") | " << employees[j].name << " ($" << employees[j].salary << ")\\n";`
      }
    ],
    commonMistakes: [
      'Forgetting the JOIN condition (creates a Cartesian product — CROSS JOIN)',
      'Using LEFT JOIN when INNER JOIN is sufficient (worse performance, unexpected NULLs)',
      'Not qualifying column names when both tables have the same column name',
      'Putting a right-table filter in WHERE instead of ON for LEFT JOIN — silently converts to INNER JOIN',
      'Using USING but the column names differ between tables (USING requires identical names)',
      'Forgetting table aliases in self-joins (must use different aliases for each instance)'
    ],
    practiceQuestions: [
      {
        question: `Table: products, orders

List all products and their total order quantity. Include products that have never been ordered (they should show NULL for quantity).

Return columns: name, price, total_ordered
Order by: total_ordered DESC NULLS LAST.`,
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
        question: `Table: employees

Find pairs of employees in the same department where one earns more than the other.

Return columns: higher_earner, salary (of higher earner), lower_earner, salary (of lower earner), department
Order by: department, higher_earner salary DESC.`,
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
        question: `Table: products, orders

Challenge: Find products that have never been ordered. Use a LEFT JOIN between products and orders to identify products with no matching orders.

Return columns: name, price, category
Order by: any order.`,
        hint: 'LEFT JOIN products to orders, then filter WHERE orders.id IS NULL. This finds products with no matching order records.',
        solution: `SELECT p.name, p.price, p.category
FROM products p
LEFT JOIN orders o ON p.id = o.product_id
WHERE o.id IS NULL;`
      },
      {
        question: `Table: employees, orders, products

Use INNER JOIN across three tables to show each employee's name, the products they ordered, quantities, and order dates.

Return columns: employee_name, product_name, quantity, order_date
Order by: order_date ASC, employee_name ASC.`,
        hint: 'Chain two JOINs: FROM employees e JOIN orders o ON e.name = o.customer_name JOIN products p ON o.product_id = p.id. Select the relevant columns.',
        solution: `SELECT e.name AS employee_name,
  p.name AS product_name,
  o.quantity,
  o.order_date
FROM employees e
JOIN orders o ON e.name = o.customer_name
JOIN products p ON o.product_id = p.id
ORDER BY o.order_date, e.name;`
      },
      {
        question: `Table: products, departments

Use CROSS JOIN to pair every product with every department, showing all possible combinations.

Return columns: product_name, category, department_name
Order by: product_name ASC, department_name ASC.`,
        hint: 'Use SELECT p.name, p.category, d.name FROM products p CROSS JOIN departments d. No ON clause needed — CROSS JOIN produces a Cartesian product.',
        solution: `SELECT p.name AS product_name,
  p.category,
  d.name AS department_name
FROM products p
CROSS JOIN departments d
ORDER BY p.name, d.name;`
      },
      {
        question: `Table: customers, orders

Use FULL OUTER JOIN to show all customers and all orders, including customers with no orders and orders with no matching customer.

Return columns: customer_name, order_id, total, order_date
Order by: customer_name ASC NULLS LAST, order_date ASC.`,
        hint: 'Use FULL JOIN ... ON customers.name = orders.customer_name. SQLite supports FULL JOIN since version 3.39.0.',
        solution: `SELECT c.name AS customer_name,
  o.id AS order_id,
  o.total,
  o.order_date
FROM customers c
FULL JOIN orders o ON c.name = o.customer_name
ORDER BY c.name NULLS LAST, o.order_date;`
      },
      {
        question: `Table: products, orders

Simulate RIGHT JOIN using LEFT JOIN. Show all orders and their product info, including orders whose product_id has no match in products.

Return columns: order_id, product_name, quantity, total
Order by: order_id ASC.`,
        hint: 'SQLite does not support RIGHT JOIN. Simulate it by swapping table order: SELECT ... FROM orders o LEFT JOIN products p ON o.product_id = p.id.',
        solution: `SELECT o.id AS order_id,
  p.name AS product_name,
  o.quantity,
  o.total
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
ORDER BY o.id;`
      },
      {
        question: `Table: employees, products, orders

Medium: Find departments where the total value of products ordered by employees in that department exceeds $500. Use JOINs across all three tables.

Return columns: department, total_order_value, employee_count
Order by: total_order_value DESC.`,
        hint: 'JOIN employees e JOIN orders o ON e.name = o.customer_name JOIN products p ON o.product_id = p.id. GROUP BY department. Use SUM(o.total) and COUNT(DISTINCT e.name). Add HAVING SUM(o.total) > 500.',
        solution: `SELECT e.department,
  ROUND(SUM(o.total), 2) AS total_order_value,
  COUNT(DISTINCT e.name) AS employee_count
FROM employees e
JOIN orders o ON e.name = o.customer_name
JOIN products p ON o.product_id = p.id
GROUP BY e.department
HAVING SUM(o.total) > 500
ORDER BY total_order_value DESC;`
      },
      {
        question: `Table: employees, orders

Medium: Show each employee with their total order value. Use a LEFT JOIN so employees with zero orders also appear (show 0 instead of NULL). Label them "Active" if they have > 0 total.

Return columns: name, department, total_spent, status
Order by: total_spent DESC, name ASC.`,
        hint: 'LEFT JOIN employees e LEFT JOIN orders o ON e.name = o.customer_name. GROUP BY e.name. Use COALESCE(SUM(o.total), 0). Use CASE for the status label.',
        solution: `SELECT e.name, e.department,
  COALESCE(ROUND(SUM(o.total), 2), 0) AS total_spent,
  CASE WHEN SUM(o.total) > 0 THEN 'Active' ELSE 'Inactive' END AS status
FROM employees e
LEFT JOIN orders o ON e.name = o.customer_name
GROUP BY e.name, e.department
ORDER BY total_spent DESC, e.name;`
      },
      {
        question: `Table: employees

Advanced: Use a SELF JOIN on manager_id to find managers who earn less than at least one of their direct reports. Show manager name, manager salary, report name, and report salary.

Return columns: manager, manager_salary, report, report_salary
Order by: manager ASC, report_salary DESC.`,
        hint: 'JOIN employees m (manager) JOIN employees r (report) ON m.id = r.manager_id. Filter WHERE m.salary < r.salary. Manager is the one whose id matches the report\'s manager_id.',
        solution: `SELECT m.name AS manager,
  m.salary AS manager_salary,
  r.name AS report,
  r.salary AS report_salary
FROM employees m
JOIN employees r ON m.id = r.manager_id
WHERE m.salary < r.salary
ORDER BY m.name, r.salary DESC;`
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
    explanation: `── Real-World Analogy ──
A subquery is like a Russian nesting doll (matryoshka): a query inside another query.
The inner doll (subquery) is solved FIRST, then its answer is used by the outer doll.

  "Show me employees who earn MORE than the company average"
  → Step 1 (inner):  WHAT is the company average?  → 85K
  → Step 2 (outer):  WHICH employees earn > 85K?

── Visual: Non-Correlated Subquery (runs ONCE) ──
  Outer: SELECT * FROM employees WHERE salary > (INNER)
                                                   │
                                                   ▼
  Inner: SELECT AVG(salary) FROM employees  ──►  Returns: 85K
                                                   │
                                                   ▼
  Outer continues: WHERE salary > 85K  ──►  Returns high earners

  Flow: Inner runs ONCE → result cached → outer uses it for every row

── Visual: Correlated Subquery (runs PER ROW) ──
  Outer: SELECT * FROM employees e WHERE salary > (INNER that depends on e.department)
                                                   │
  For EACH employee row in the outer query:        ▼
  Inner runs AGAIN with THAT employee's department:
    Alice (IT)      → SELECT AVG(salary) WHERE dept = 'IT'      → 90K → 100K > 90K? ✅
    Bob (Sales)     → SELECT AVG(salary) WHERE dept = 'Sales'   → 80K → 70K > 80K? ❌
    Charlie (IT)    → SELECT AVG(salary) WHERE dept = 'IT'      → 90K → 92K > 90K? ✅

── Subquery Types Comparison ──
| Type               | Returns            | Used In              | Example                                |
|--------------------|--------------------|-----------------------|----------------------------------------|
| Scalar subquery    | Single value       | SELECT, WHERE, HAVING | (SELECT AVG(salary) FROM employees)    |
| Row subquery       | Single row         | WHERE                 | WHERE (col1, col2) = (SELECT ...)      |
| Table subquery     | Multiple rows/cols | FROM (derived table)  | FROM (SELECT ...) AS sub               |
| Correlated subquery| Varies             | WHERE, SELECT, EXISTS | WHERE col > (SELECT ... FROM outer)    |

── Golden Rules ──
- Subqueries in parentheses: (SELECT ...)
- Subqueries in FROM MUST have an alias: FROM (SELECT ...) AS t
- Scalar subquery must return EXACTLY one value (or NULL)
- EXISTS checks for row EXISTENCE, not data — use SELECT 1 inside
- Non-correlated runs ONCE (fast). Correlated runs PER ROW (potentially slow)
- If a JOIN can do the job, prefer JOIN for efficiency`,
    syntax: `-- Scalar subquery in SELECT
SELECT 
  name,
  salary,
  (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;

-- Subquery in WHERE with IN
SELECT name, department
FROM employees
WHERE department IN (
  SELECT DISTINCT department
  FROM employees
  WHERE salary > 90000
);

-- Correlated subquery with EXISTS
SELECT name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer = e.name
    AND o.total > 100
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
        cppRepresentation: `double total=0; for (int i=0;i<employeeCount;i++) total+=employees[i].salary; double companyAvg=total/employeeCount;
for (int i=0;i<employeeCount;i++)
    if (employees[i].salary>companyAvg)
        cout<<employees[i].name<<" | "<<employees[i].salary<<" | "<<round(companyAvg)<<" | "<<round(100.0*employees[i].salary/companyAvg*10)/10<<"%\\n";`
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
        cppRepresentation: `string highDepts[100]; int highCnt=0;
for (int i=0;i<employeeCount;i++) if (employees[i].salary>90000) {
    bool dup=false; for (int j=0;j<highCnt;j++) if (highDepts[j]==employees[i].department) dup=true;
    if (!dup) highDepts[highCnt++]=employees[i].department;
}
for (int i=0;i<employeeCount;i++) {
    bool found=false; for (int j=0;j<highCnt;j++) if (highDepts[j]==employees[i].department) found=true;
    if (found) cout<<employees[i].name<<" | "<<employees[i].department<<" | "<<employees[i].salary<<"\\n";
}`
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
        cppRepresentation: `for (int i=0;i<productCount;i++) {
    bool found=false;
    for (int j=0;j<orderCount;j++) if (orders[j].product_id==products[i].id && orders[j].total>500) { found=true; break; }
    if (found) cout<<products[i].name<<" | "<<products[i].price<<" | "<<products[i].category<<"\\n";
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
        sourceTables: ['employees'],
        cppRepresentation: `string depts[100]; double sums[100]; int counts[100]; int deptCount=0;
for (int i=0;i<employeeCount;i++) {
    string d=employees[i].department; int idx=-1;
    for (int j=0;j<deptCount;j++) if (depts[j]==d) { idx=j; break; }
    if (idx==-1) { idx=deptCount; depts[deptCount]=d; sums[deptCount]=0; counts[deptCount]=0; deptCount++; }
    sums[idx]+=employees[i].salary; counts[idx]++;
}
string outDepts[100]; double outAvgs[100]; int outCnts[100]; int outCount=0;
for (int i=0;i<deptCount;i++) {
    double avg=sums[i]/counts[i];
    if (counts[i]>=5) { outDepts[outCount]=depts[i]; outAvgs[outCount]=avg; outCnts[outCount]=counts[i]; outCount++; }
}
for (int i=0;i<outCount;i++) for (int j=i+1;j<outCount;j++) if (outAvgs[j]>outAvgs[i]) {
    string td=outDepts[i]; outDepts[i]=outDepts[j]; outDepts[j]=td;
    double ta=outAvgs[i]; outAvgs[i]=outAvgs[j]; outAvgs[j]=ta;
    int tc=outCnts[i]; outCnts[i]=outCnts[j]; outCnts[j]=tc;
}
for (int i=0;i<outCount;i++) cout<<outDepts[i]<<" | "<<outCnts[i]<<"\\n";`
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
        cppRepresentation: `int orderedIds[1000]; int orderedCount=0;
for (int i=0;i<orderCount;i++) {
    bool dup=false; for (int j=0;j<orderedCount;j++) if (orderedIds[j]==orders[i].product_id) dup=true;
    if (!dup) orderedIds[orderedCount++]=orders[i].product_id;
}
for (int i=0;i<productCount;i++) {
    bool found=false; for (int j=0;j<orderedCount;j++) if (orderedIds[j]==products[i].id) found=true;
    if (!found) cout<<products[i].name<<" | "<<products[i].price<<" | "<<products[i].category<<"\\n";
}`
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
        cppRepresentation: `double total=0; for (int i=0;i<employeeCount;i++) total+=employees[i].salary; double avgSal=total/employeeCount;
Employee above[1000]; int aboveCount=0;
for (int i=0;i<employeeCount;i++) if (employees[i].salary>avgSal) above[aboveCount++]=employees[i];
for (int i=0;i<aboveCount;i++) for (int j=i+1;j<aboveCount;j++) if (above[j].salary>above[i].salary) {
    Employee t=above[i]; above[i]=above[j]; above[j]=t;
}
for (int i=0;i<aboveCount;i++) cout<<above[i].name<<" | "<<above[i].salary<<" | "<<above[i].department<<"\\n";`
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
        cppRepresentation: `string depts[100]; double sums[100]; int cnts[100]; int deptCount=0;
for (int i=0;i<employeeCount;i++) {
    string d=employees[i].department; int idx=-1;
    for (int j=0;j<deptCount;j++) if (depts[j]==d) { idx=j; break; }
    if (idx==-1) { idx=deptCount; depts[deptCount]=d; sums[deptCount]=0; cnts[deptCount]=0; deptCount++; }
    sums[idx]+=employees[i].salary; cnts[idx]++;
}
double subsetTotal=0; int subsetCount=0;
for (int i=0;i<deptCount;i++) {
    double avg=sums[i]/cnts[i];
    if (avg>70000) { subsetTotal+=sums[i]; subsetCount+=cnts[i]; }
}
double threshold=subsetTotal/subsetCount;
for (int i=0;i<employeeCount;i++) if (employees[i].salary>threshold)
    cout<<employees[i].name<<" | "<<employees[i].department<<" | "<<employees[i].salary<<"\\n";`
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
        cppRepresentation: `string depts[100]; double sums[100]; int cnts[100]; int deptCount=0;
for (int i=0;i<employeeCount;i++) {
    string d=employees[i].department; int idx=-1;
    for (int j=0;j<deptCount;j++) if (depts[j]==d) { idx=j; break; }
    if (idx==-1) { idx=deptCount; depts[deptCount]=d; sums[deptCount]=0; cnts[deptCount]=0; deptCount++; }
    sums[idx]+=employees[i].salary; cnts[idx]++;
}
double deptAvg[100];
for (int i=0;i<deptCount;i++) deptAvg[i]=sums[i]/cnts[i];
Employee sorted[1000]; int sortedCount=employeeCount;
for (int i=0;i<employeeCount;i++) sorted[i]=employees[i];
for (int i=0;i<sortedCount;i++) for (int j=i+1;j<sortedCount;j++) {
    bool swp=false;
    if (sorted[j].department!=sorted[i].department) { if (sorted[j].department<sorted[i].department) swp=true; }
    else if (sorted[j].salary>sorted[i].salary) swp=true;
    if (swp) { Employee t=sorted[i]; sorted[i]=sorted[j]; sorted[j]=t; }
}
for (int i=0;i<sortedCount;i++) {
    int di=-1; for (int j=0;j<deptCount;j++) if (depts[j]==sorted[i].department) { di=j; break; }
    cout<<sorted[i].name<<" | "<<sorted[i].department<<" | "<<sorted[i].salary<<" | "<<round(deptAvg[di])<<" | "<<round(sorted[i].salary-deptAvg[di])<<"\\n";
}`
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
        cppRepresentation: `double total=0; for (int i=0;i<employeeCount;i++) total+=employees[i].salary; double companyAvg=total/employeeCount;
string deptMaxDepts[100]; double deptMaxVals[100]; int deptMaxCount=0;
for (int i=0;i<employeeCount;i++) {
    string d=employees[i].department; int idx=-1;
    for (int j=0;j<deptMaxCount;j++) if (deptMaxDepts[j]==d) { idx=j; break; }
    if (idx==-1) { idx=deptMaxCount; deptMaxDepts[deptMaxCount]=d; deptMaxVals[deptMaxCount]=0; deptMaxCount++; }
    if (employees[i].salary>deptMaxVals[idx]) deptMaxVals[idx]=employees[i].salary;
}
Employee sorted[1000]; int sortedCount=employeeCount;
for (int i=0;i<employeeCount;i++) sorted[i]=employees[i];
for (int i=0;i<sortedCount;i++) for (int j=i+1;j<sortedCount;j++) if (sorted[j].salary>sorted[i].salary) {
    Employee t=sorted[i]; sorted[i]=sorted[j]; sorted[j]=t;
}
for (int i=0;i<sortedCount;i++) {
    int di=-1; for (int j=0;j<deptMaxCount;j++) if (deptMaxDepts[j]==sorted[i].department) { di=j; break; }
    cout<<sorted[i].name<<" | "<<sorted[i].department<<" | "<<sorted[i].salary<<" | "<<round(companyAvg)<<" | "<<deptMaxVals[di]<<" | "<<round(100.0*sorted[i].salary/companyAvg*10)/10<<"%\\n";
}`
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
        cppRepresentation: `int orderedIds[1000]; int orderedCount=0;
for (int i=0;i<orderCount;i++) {
    bool dup=false; for (int j=0;j<orderedCount;j++) if (orderedIds[j]==orders[i].product_id) dup=true;
    if (!dup) orderedIds[orderedCount++]=orders[i].product_id;
}
Product neverOrdered[1000]; int neverCount=0;
for (int i=0;i<productCount;i++) {
    bool found=false; for (int j=0;j<orderedCount;j++) if (orderedIds[j]==products[i].id) found=true;
    if (!found) neverOrdered[neverCount++]=products[i];
}
for (int i=0;i<neverCount;i++) for (int j=i+1;j<neverCount;j++) if (neverOrdered[j].price>neverOrdered[i].price) {
    Product t=neverOrdered[i]; neverOrdered[i]=neverOrdered[j]; neverOrdered[j]=t;
}
for (int i=0;i<neverCount;i++) cout<<neverOrdered[i].name<<" | "<<neverOrdered[i].category<<" | "<<neverOrdered[i].price<<"\\n";`
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
        question: `Table: employees

Find employees whose salary is above the average salary of their own department.

Return columns: name, salary, department
Order by: department, salary DESC.`,
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
        question: `Table: employees

Find departments that have no employees assigned. (Use a subquery with NOT IN on the employees table.)

Return columns: department
Order by: any order.`,
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
        question: `Table: products

Challenge: Use a scalar subquery in the SELECT clause to show each product's name, price, and what percentage its price represents of the total price of ALL products. Round the percentage to 2 decimal places.

Return columns: name, price, pct_of_total
Order by: pct_of_total DESC.`,
        hint: 'Use a scalar subquery: (SELECT SUM(price) FROM products) to get the total. Then compute price * 100.0 / total in the SELECT.',
        solution: `SELECT name, price,
  ROUND(price * 100.0 / (SELECT SUM(price) FROM products), 2) AS pct_of_total
FROM products
ORDER BY pct_of_total DESC;`
      },
      {
        question: `Table: employees

Challenge: Find the employee who earns the closest to the company average salary (absolute difference).

Return columns: name, salary, company_avg, diff_from_avg
Order by: diff_from_avg ASC
Limit: 1 row.`,
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
    explanation: `── Real-World Analogy ──
CASE is like a teacher grading: "IF score ≥ 90 THEN 'A', ELSE IF score ≥ 80 THEN 'B', ELSE 'F'."
It's SQL's version of if/else if/else — or a switch/case statement in programming.

── Visual: CASE as a Decision Flowchart ──
  For each row, SQL walks through the WHEN conditions TOP TO BOTTOM:

       ┌──────────────────┐
       │  Start: check    │
       │  this row's data │
       └────────┬─────────┘
                │
       ┌────────▼─────────┐   YES   ┌──────────────────┐
       │ WHEN score >= 90? │────────►│ Return 'A' (DONE)│
       └────────┬─────────┘         └──────────────────┘
                │ NO
       ┌────────▼─────────┐   YES   ┌──────────────────┐
       │ WHEN score >= 80? │────────►│ Return 'B' (DONE)│
       └────────┬─────────┘         └──────────────────┘
                │ NO
       ┌────────▼─────────┐   YES   ┌──────────────────┐
       │ WHEN score >= 70? │────────►│ Return 'C' (DONE)│
       └────────┬─────────┘         └──────────────────┘
                │ NO
       ┌────────▼─────────┐
       │ ELSE (default)   │────────► Return 'F' (DONE)
       └──────────────────┘

── Visual: CASE with Real Data ──
  Input rows:                        After SELECT with CASE:
  ┌──────┬───────┐                   ┌──────┬───────┬───────┐
  │ name │ score │                   │ name │ score │ grade │
  ├──────┼───────┤                   ├──────┼───────┼───────┤
  │ Alice│  95   │  ──► CASE ──►     │ Alice│  95   │ A     │
  │ Bob  │  82   │                   │ Bob  │  82   │ B     │
  │ Carol│  67   │                   │ Carol│  67   │ F     │
  └──────┴───────┘                   └──────┴───────┴───────┘

── Two Forms of CASE ──
| Form          | Syntax                                          | Use When                                |
|---------------|-------------------------------------------------|-----------------------------------------|
| Simple CASE   | CASE expr WHEN val1 THEN ... WHEN val2 THEN ... | Switch-like: compare ONE column to many values |
| Searched CASE | CASE WHEN condition1 THEN ... WHEN condition2   | If/else if: evaluate different boolean conditions |

  Simple:   CASE status WHEN 'a' THEN 1 WHEN 'b' THEN 2 ELSE 3 END
  Searched: CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' ELSE 'F' END

── How CASE Evaluates ──
- Conditions evaluated TOP TO BOTTOM
- Returns the FIRST matching WHEN (short-circuit)
- If no WHEN matches and no ELSE → returns NULL
- ELSE is optional but recommended

── Where CASE Can Be Used ──
| Clause    | Example                                        |
|-----------|------------------------------------------------|
| SELECT    | SELECT name, CASE WHEN ... END AS grade        |
| WHERE     | WHERE CASE WHEN role='admin' THEN 1 ELSE 0 END = 1 |
| ORDER BY  | ORDER BY CASE status WHEN 'active' THEN 1 ELSE 2 END |
| GROUP BY  | GROUP BY CASE WHEN age < 18 THEN 'minor' ELSE 'adult' END |

── CASE with Aggregate Functions (Pivot Pattern) ──
Count values conditionally inside a single query:
  SELECT
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_count,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_count
  FROM users;

This avoids multiple queries — one scan, multiple conditional counts.`,
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
        cppRepresentation: `string level(int s){
    if(s<70000)return"Junior";if(s<90000)return"Mid";if(s<110000)return"Senior";return"Executive";}
Employee sorted[1000]; int sortedCount=employeeCount;
for (int i=0;i<employeeCount;i++) sorted[i]=employees[i];
for (int i=0;i<sortedCount;i++) for (int j=i+1;j<sortedCount;j++) if (sorted[j].salary<sorted[i].salary) {
    Employee t=sorted[i]; sorted[i]=sorted[j]; sorted[j]=t;
}
for (int i=0;i<sortedCount;i++) cout<<sorted[i].name<<" | "<<sorted[i].salary<<" | "<<level(sorted[i].salary)<<"\\n";`
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
        cppRepresentation: `string teamType(string d){
    if(d=="Engineering")return"Tech";if(d=="Product")return"Tech";if(d=="Marketing")return"Business";return"Other";}
for (int i=0;i<employeeCount;i++) cout<<employees[i].name<<" | "<<employees[i].department<<" | "<<teamType(employees[i].department)<<" | "<<employees[i].salary<<"\\n";`
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
        cppRepresentation: `int cityPri(string c){if(c=="New York")return 1;if(c=="San Francisco")return 2;if(c=="Chicago")return 3;return 4;}
Employee sorted[1000]; int sortedCount=employeeCount;
for (int i=0;i<employeeCount;i++) sorted[i]=employees[i];
for (int i=0;i<sortedCount;i++) for (int j=i+1;j<sortedCount;j++) {
    int pa=cityPri(sorted[i].city),pb=cityPri(sorted[j].city);
    bool swp=false;
    if (pa!=pb) { if (pb<pa) swp=true; } else if (sorted[j].name<sorted[i].name) swp=true;
    if (swp) { Employee t=sorted[i]; sorted[i]=sorted[j]; sorted[j]=t; }
}
for (int i=0;i<sortedCount;i++) cout<<sorted[i].name<<" | "<<sorted[i].city<<" | "<<sorted[i].salary<<"\\n";`
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
        cppRepresentation: `string depts[100]; double sums[100]; int totalCnt[100]; int actSum[100]; int actCnt[100]; int deptCount=0;
for (int i=0;i<employeeCount;i++) {
    string d=employees[i].department; int idx=-1;
    for (int j=0;j<deptCount;j++) if (depts[j]==d) { idx=j; break; }
    if (idx==-1) { idx=deptCount; depts[deptCount]=d; sums[deptCount]=0; totalCnt[deptCount]=0; actSum[deptCount]=0; actCnt[deptCount]=0; deptCount++; }
    sums[idx]+=employees[i].salary; totalCnt[idx]++;
    if (employees[i].status=="active") { actSum[idx]+=employees[i].salary; actCnt[idx]++; }
}
for (int i=0;i<deptCount;i++) {
    int high=0;
    for (int j=0;j<employeeCount;j++) if (employees[j].department==depts[i] && employees[j].salary>=100000) high++;
    cout<<depts[i]<<" | total="<<totalCnt[i]<<" | high="<<high<<" | avgAct="<<(actCnt[i]?actSum[i]/actCnt[i]:0)<<"\\n";
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
        cppRepresentation: `bool passes(Employee& e){
    if(e.department=="Engineering")return e.salary>=80000;
    if(e.department=="Marketing")return e.salary>=60000;
    return e.salary>=70000;}
for (int i=0;i<employeeCount;i++) {
    if(!passes(employees[i]))continue;
    string col=(employees[i].city=="New York"||employees[i].city=="San Francisco")?"High COL":"Standard COL";
    cout<<employees[i].name<<" | "<<employees[i].department<<" | "<<employees[i].salary<<" | "<<col<<"\\n";
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
        cppRepresentation: `int idxs[1000]; for (int i=0;i<employeeCount;i++) idxs[i]=i;
for (int i=0;i<employeeCount;i++) for (int j=i+1;j<employeeCount;j++) {
    int isHighA=employees[idxs[i]].salary>=100000?1:0;
    int isHighB=employees[idxs[j]].salary>=100000?1:0;
    bool swp=false;
    if (isHighA!=isHighB) { if (isHighB>isHighA) swp=true; } else if (employees[idxs[j]].salary>employees[idxs[i]].salary) swp=true;
    if (swp) { int t=idxs[i]; idxs[i]=idxs[j]; idxs[j]=t; }
}
for (int i=0;i<employeeCount;i++) {
    int idx=idxs[i];
    cout<<employees[idx].name<<" | "<<employees[idx].department<<" | "<<employees[idx].salary<<" | "
        <<(employees[idx].salary>=100000?1:0)<<" | "<<(employees[idx].status=="inactive"?1:0)<<" | "<<(employees[idx].city=="New York"?1:0)<<"\\n";
}`
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
for (int i=0;i<orderCount;i++) {
    Order& o=orders[i];
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
for (int i=0;i<employeeCount;i++) cout<<employees[i].name<<" | "<<employees[i].department<<" | "<<roleTitle(employees[i])<<" | "<<employees[i].salary<<"\\n";`
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
        cppRepresentation: `int pri(Employee& e){
    if(e.department=="Engineering"&&e.salary>=100000)return 1;
    if(e.department=="Engineering")return 2;if(e.salary>=90000)return 3;
    if(e.city=="New York")return 4;return 5;}
Employee active[1000]; int activeCount=0;
for (int i=0;i<employeeCount;i++) if (employees[i].status=="active") active[activeCount++]=employees[i];
for (int i=0;i<activeCount;i++) for (int j=i+1;j<activeCount;j++) {
    int pa=pri(active[i]),pb=pri(active[j]);
    bool swp=false;
    if (pa!=pb) { if (pb<pa) swp=true; } else if (active[j].name<active[i].name) swp=true;
    if (swp) { Employee t=active[i]; active[i]=active[j]; active[j]=t; }
}
for (int i=0;i<activeCount;i++) cout<<active[i].name<<" | "<<active[i].department<<" | "<<active[i].salary<<" | "<<active[i].city<<" | "<<active[i].status<<"\\n";`
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
        question: `Table: orders

Categorize orders into "Small" (< $50), "Medium" ($50-$200), or "Large" (> $200). Show the count in each category.

Return columns: order_size, order_count
Order by: order_count DESC.`,
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
        question: `Table: employees

Show each employee with a bonus column: 20% of salary if they are in Engineering, 10% if in Sales, otherwise 5%.

Return columns: name, salary, department, bonus
Order by: any order.`,
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
        question: `Table: employees

Challenge: Assign a salary band to each employee: "Junior" (< $40,000), "Mid" ($40,000-$80,000), "Senior" ($80,001-$120,000), or "Lead" (> $120,000). Also add a tax_bracket: "Low" (salary < $50,000), "Medium" ($50,000-$100,000), or "High" (> $100,000).

Return columns: name, salary, salary_band, tax_bracket
Order by: salary DESC.`,
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
        question: `Table: orders

Challenge: Use conditional aggregation with CASE inside SUM to show each customer's total orders, total of large orders (total > 200), total of small orders (total <= 200), and their grand total.

Return columns: customer, total_orders, large_order_total, small_order_total, grand_total
Order by: grand_total DESC.`,
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
    explanation: `── Real-World Analogy ──
A CTE is like a SCRATCHPAD or temporary sticky note.
You compute an intermediate result, write it on the sticky note, then use it in your final query.
Unlike a subquery (which is hidden inside parentheses), a CTE sits visibly at the TOP.

── Visual: CTE Step-by-Step ──
  WITHOUT CTE (nested, hard to read):           WITH CTE (linear, easy to read):
  SELECT *                                       WITH high_earners AS (
  FROM employees                                 │ SELECT *
  WHERE salary > (                               │ FROM employees
    SELECT AVG(salary) * 1.5                     │ WHERE salary > 80000
    FROM employees                               │ )
    WHERE department = 'IT'                      │
  );                                             │ SELECT * FROM high_earners
                                                 │ WHERE ...  (reuse the CTE!)
  Problem: inner query is buried inside
  the WHERE clause — hard to understand

── Visual: Multiple CTEs as a Pipeline ──
  WITH
    step1 AS (           ───┐
      SELECT ...            │ Step 1: get raw data
    ),                      │
    step2 AS (           ───┤
      SELECT ...            │ Step 2: filter/aggregate
      FROM step1 ...        │ (references step1)
    ),                      │
    step3 AS (           ───┤
      SELECT ...            │ Step 3: further process
      FROM step2 ...        │ (references step2)
    )                       │
  SELECT * FROM step3;   ───┘ Step 4: final result

  Each step builds on the previous one — like an assembly line.

── CTE vs Subquery ──
| Aspect             | CTE                                      | Subquery                                |
|--------------------|------------------------------------------|-----------------------------------------|
| Syntax             | WITH name AS (...) SELECT ...            | SELECT ... FROM (SELECT ...)            |
| Reusable           | ✅ Can reference the CTE MULTIPLE times  | ❌ Must rewrite or nest again           |
| Readability        | ✅ Top-to-bottom (linear flow)           | ❌ Inside-out (must read from inside out) |
| Recursive          | ✅ WITH RECURSIVE                        | ❌ Cannot be recursive                  |
| Scope              | Defined once, used in subsequent query   | Exists only inside the enclosing query  |

── CTE Rules ──
- CTEs must come BEFORE the main query
- Separate multiple CTEs with commas (NO comma before the main SELECT)
- A CTE can reference previously defined CTEs (chaining)
- CTEs are NOT materialized by default (PostgreSQL) — they re-execute each time referenced
- Use CTEs for READABILITY; use temp tables for PERFORMANCE if referenced multiple times

── WITH RECURSIVE (Hierarchical Data) ──
Recursive CTEs reference themselves to process tree structures (org charts, categories, folder trees):
  WITH RECURSIVE org_tree AS (
    SELECT id, name, manager_id, 1 AS level     -- anchor: top-level managers
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, t.level + 1  -- recursive: their reports
    FROM employees e JOIN org_tree t ON e.manager_id = t.id
  )
  SELECT * FROM org_tree ORDER BY level;`,
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
        cppRepresentation: `string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptCounts[idx] = 0; deptSums[idx] = 0; }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
string outDepts[100];
int outCounts[100];
double outAvgs[100];
int outSize = 0;
for (int i = 0; i < deptSize; i++)
    if (deptCounts[i] >= 2) {
        outDepts[outSize] = deptKeys[i];
        outCounts[outSize] = deptCounts[i];
        outAvgs[outSize] = deptSums[i] / deptCounts[i];
        outSize++;
    }
for (int i = 0; i < outSize; i++)
    for (int j = i + 1; j < outSize; j++)
        if (outAvgs[i] < outAvgs[j]) {
            string td = outDepts[i]; outDepts[i] = outDepts[j]; outDepts[j] = td;
            int tc = outCounts[i]; outCounts[i] = outCounts[j]; outCounts[j] = tc;
            double ta = outAvgs[i]; outAvgs[i] = outAvgs[j]; outAvgs[j] = ta;
        }
for (int i = 0; i < outSize; i++)
    cout << outDepts[i] << " | headcount=" << outCounts[i] << " | avg_salary=" << round(outAvgs[i]) << "\\n";`
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
        cppRepresentation: `int elecIds[100];
string elecNames[100];
double elecPrices[100];
int elecCount = 0;
for (int i = 0; i < productCount; i++)
    if (products[i].category == "Electronics") {
        elecIds[elecCount] = products[i].id;
        elecNames[elecCount] = products[i].name;
        elecPrices[elecCount] = products[i].price;
        elecCount++;
    }
double revenues[100];
for (int i = 0; i < elecCount; i++) revenues[i] = 0.0;
for (int i = 0; i < orderCount; i++)
    for (int j = 0; j < elecCount; j++)
        if (orders[i].product_id == elecIds[j]) {
            revenues[j] += orders[i].total;
            break;
        }
string resNames[100];
double resPrices[100];
double resRevs[100];
int resSize = 0;
for (int i = 0; i < elecCount; i++) {
    resNames[resSize] = elecNames[i];
    resPrices[resSize] = elecPrices[i];
    resRevs[resSize] = revenues[i];
    resSize++;
}
for (int i = 0; i < resSize; i++)
    for (int j = i + 1; j < resSize; j++)
        if (resRevs[i] < resRevs[j]) {
            string tn = resNames[i]; resNames[i] = resNames[j]; resNames[j] = tn;
            double tp = resPrices[i]; resPrices[i] = resPrices[j]; resPrices[j] = tp;
            double tr = resRevs[i]; resRevs[i] = resRevs[j]; resRevs[j] = tr;
        }
for (int i = 0; i < resSize; i++)
    cout << resNames[i] << " | $" << resPrices[i] << " | total_revenue=$" << resRevs[i] << "\\n";`
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
        cppRepresentation: `for (int n = 1; n <= 10; n++)
    cout << n << "\\n";`
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
        cppRepresentation: `string custKeys[100];
int custCounts[100];
double custSums[100];
int custSize = 0;
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < custSize; j++)
        if (custKeys[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) { idx = custSize++; custKeys[idx] = orders[i].customer; custCounts[idx] = 0; custSums[idx] = 0; }
    custCounts[idx]++;
    custSums[idx] += orders[i].total;
}
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < custSize; j++)
        if (custKeys[j] == employees[i].name) { idx = j; break; }
    int numOrders = (idx == -1) ? 0 : custCounts[idx];
    double totalSpent = (idx == -1) ? 0.0 : round(custSums[idx] * 100) / 100;
    cout << employees[i].name << " | " << employees[i].department << " | " << numOrders << " orders | $" << totalSpent << "\\n";
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
        cppRepresentation: `double companyAvg = 0;
for (int i = 0; i < employeeCount; i++) companyAvg += employees[i].salary;
companyAvg /= employeeCount;
string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptCounts[idx] = 0; deptSums[idx] = 0; }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
double deptAvgs[100];
for (int i = 0; i < deptSize; i++)
    deptAvgs[i] = deptSums[i] / deptCounts[i];
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (employees[i].salary > companyAvg)
        cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << " | " << round(deptAvgs[idx]) << " | " << round(employees[i].salary - deptAvgs[idx]) << "\\n";
}`
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
        cppRepresentation: `long long fact = 1;
for (int n = 1; n <= 10; n++) {
    fact *= n;
    cout << n << "! = " << fact << "\\n";
}`
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
        cppRepresentation: `string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptCounts[idx] = 0; deptSums[idx] = 0; }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << " | " << deptCounts[idx] << " emp | avg=$" << round(deptSums[idx] / deptCounts[idx]) << " | diff=$" << round(employees[i].salary - deptSums[idx] / deptCounts[idx]) << "\\n";
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
        cppRepresentation: `string deptKeys[100];
int deptCounts[100];
double deptSums[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptCounts[idx] = 0; deptSums[idx] = 0; }
    deptCounts[idx]++;
    deptSums[idx] += employees[i].salary;
}
double deptAvgs[100];
for (int i = 0; i < deptSize; i++)
    deptAvgs[i] = deptSums[i] / deptCounts[i];
string resCats[100];
string resNames[100];
string resDepts[100];
double resSalaries[100];
int resSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    string cat = (employees[i].salary > deptAvgs[idx]) ? "Above dept avg" : "Below dept avg";
    resCats[resSize] = cat;
    resNames[resSize] = employees[i].name;
    resDepts[resSize] = employees[i].department;
    resSalaries[resSize] = employees[i].salary;
    resSize++;
}
for (int i = 0; i < resSize; i++)
    for (int j = i + 1; j < resSize; j++) {
        bool doSwap = false;
        if (resDepts[i] != resDepts[j]) {
            if (resDepts[i] > resDepts[j]) doSwap = true;
        } else if (resCats[i] != resCats[j]) {
            if (resCats[i] > resCats[j]) doSwap = true;
        } else if (resSalaries[i] < resSalaries[j]) {
            doSwap = true;
        }
        if (doSwap) {
            string tc = resCats[i]; resCats[i] = resCats[j]; resCats[j] = tc;
            string tn = resNames[i]; resNames[i] = resNames[j]; resNames[j] = tn;
            string td = resDepts[i]; resDepts[i] = resDepts[j]; resDepts[j] = td;
            double ts = resSalaries[i]; resSalaries[i] = resSalaries[j]; resSalaries[j] = ts;
        }
    }
for (int i = 0; i < resSize; i++)
    cout << resCats[i] << " | " << resNames[i] << " | " << resDepts[i] << " | " << resSalaries[i] << "\\n";`
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
        cppRepresentation: `string catKeys[100];
string catNames[100][100];
double catPrices[100][100];
int catSizes[100];
int catCount = 0;
for (int i = 0; i < productCount; i++) {
    int idx = -1;
    for (int j = 0; j < catCount; j++)
        if (catKeys[j] == products[i].category) { idx = j; break; }
    if (idx == -1) { idx = catCount++; catKeys[idx] = products[i].category; catSizes[idx] = 0; }
    catNames[idx][catSizes[idx]] = products[i].name;
    catPrices[idx][catSizes[idx]] = products[i].price;
    catSizes[idx]++;
}
for (int c = 0; c < catCount; c++) {
    int n = catSizes[c];
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (catPrices[c][i] < catPrices[c][j]) {
                string tn = catNames[c][i]; catNames[c][i] = catNames[c][j]; catNames[c][j] = tn;
                double tp = catPrices[c][i]; catPrices[c][i] = catPrices[c][j]; catPrices[c][j] = tp;
            }
}
for (int c = 0; c < catCount; c++)
    for (int rn = 0; rn < catSizes[c]; rn++) {
        string lbl;
        if (rn == 0) lbl = "Most Expensive";
        else if (rn == 1) lbl = "2nd Most Expensive";
        else if (rn == 2) lbl = "3rd Most Expensive";
        else lbl = "Other";
        cout << catNames[c][rn] << " | " << catKeys[c] << " | " << catPrices[c][rn] << " | " << lbl << "\\n";
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
        question: `Table: employees

Write a query using a CTE to compute the average salary per department. Then use the CTE to show only departments where the average salary exceeds $65,000.

Return columns: department, avg_salary
Order by: avg_salary DESC.`,
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
        question: `Table: (no table — recursive CTE)

Use a recursive CTE to generate a series of dates from 2024-01-01 to 2024-01-10.

Return columns: dt
Order by: dt ASC.`,
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
        question: `Table: products

Challenge: Generate a numbers table from 1 to 20 using a recursive CTE, then LEFT JOIN it with products to show product name and price for matching IDs.

Return columns: number, product_name, price
Order by: number ASC.`,
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
        question: `Table: products

Challenge: Use multiple CTEs to compute the percentage contribution of each product category to total stock value (price * stock).

Return columns: category, total_value, percentage
Order by: percentage DESC.`,
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
    explanation: `── Real-World Analogy ──
GROUP BY is like saying "Give me the average salary per department" — you only see the department, not the individual people.
A Window Function is like "Show me EACH employee AND their department's average salary in the same row."

Window = a "sliding frame" of rows that moves as you go through the data.

── Visual: GROUP BY vs Window Function ──
  Raw data:                          GROUP BY department:       Window AVG OVER(PARTITION BY dept):
  ┌──────┬────────┬────────┐         ┌────────┬────────┐       ┌──────┬────────┬────────┬──────────┐
  │ name │ dept   │ salary │         │ dept   │ AVG    │       │ name │ dept   │ salary │ dept_avg │
  ├──────┼────────┼────────┤         ├────────┼────────┤       ├──────┼────────┼────────┼──────────┤
  │ Alice│ IT     │ 100K   │         │ IT     │  90K   │       │ Alice│ IT     │ 100K   │  90K     │  ← preserved!
  │ Bob  │ IT     │  80K   │  ──►    │ HR     │  70K   │       │ Bob  │ IT     │  80K   │  90K     │  ← preserved!
  │ Carol│ HR     │  70K   │         └────────┴────────┘       │ Carol│ HR     │  70K   │  70K     │  ← preserved!
  └──────┴────────┴────────┘         GROUP BY COLLAPSED         └──────┴────────┴────────┴──────────┘
                                    rows (lost details)         Window PRESERVES every row + adds the average

── Visual: Sliding Window (Running Total) ──
  OVER (ORDER BY date) with default frame:
  ┌──────────┬────────┬───────────────────────────────────────────────┐
  │ date     │ amount │ Window Frame (rows included in SUM)           │
  ├──────────┼────────┤                                               │
  │ Jan 1    │ 100    │ [Jan 1] → running total = 100                 │
  │ Jan 2    │ 150    │ [Jan 1, Jan 2] → running total = 250          │
  │ Jan 3    │ 200    │ [Jan 1, Jan 2, Jan 3] → running total = 450   │
  │ Jan 4    │ 50     │ [Jan 1..4] → running total = 500              │
  └──────────┴────────┴───────────────────────────────────────────────┘
  The window GROWS as we move forward — "all rows from start to current"

── Visual: Moving Average (ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) ──
  ┌──────────┬────────┬─────────────────────────────────────────┐
  │ date     │ amount │ Frame                                   │
  ├──────────┼────────┤                                         │
  │ Jan 1    │ 100    │ [Jan 1] → avg = 100                     │
  │ Jan 2    │ 150    │ [Jan 1, Jan 2] → avg = 125              │
  │ Jan 3    │ 200    │ [Jan 2, Jan 3] → avg = 175              │
  │ Jan 4    │ 50     │ [Jan 3, Jan 4] → avg = 125              │
  └──────────┴────────┴─────────────────────────────────────────┘
  Each row sees only itself and the previous row — the window SLIDES.

── Window Function Parts ──
function_name() OVER (
  PARTITION BY col    -- groups (optional) — like GROUP BY for the window
  ORDER BY col        -- ordering within each partition
  frame_clause        — defines the sliding window
)

── The Frame Clause ──
ROWS BETWEEN start AND end (RANGE for logical offset)
| Frame Boundary       | Meaning                              |
|----------------------|--------------------------------------|
| UNBOUNDED PRECEDING  | From the first row of the partition  |
| n PRECEDING          | n rows before the current row        |
| CURRENT ROW          | The current row                      |
| n FOLLOWING          | n rows after the current row         |
| UNBOUNDED FOLLOWING  | To the last row of the partition     |

Default frame (with ORDER BY): RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
Default frame (without ORDER BY): entire partition

── Window Function vs GROUP BY ──
| Aspect         | GROUP BY                          | Window Function                          |
|----------------|-----------------------------------|------------------------------------------|
| Row count      | Collapses groups → fewer rows     | Preserves all rows                       |
| Per-row detail | Lost (only group-level remains)   | Retained (individual + aggregate)        |
| Use case       | "Total sales per department"      | "Each employee + their dept average"     |

── Execution Order ──
FROM → WHERE → GROUP BY → HAVING → **WINDOW FUNCTIONS** → SELECT → ORDER BY

Window functions run AFTER WHERE/GROUP BY but BEFORE ORDER BY.
That's why you CANNOT use window results in WHERE — they don't exist yet.

── Common Window Functions ──
| Function      | Purpose                               |
|---------------|---------------------------------------|
| SUM/AVG/COUNT | Running totals, moving averages       |
| ROW_NUMBER    | Unique row number within partition    |
| RANK          | Rank with gaps for ties               |
| DENSE_RANK    | Rank without gaps                     |
| LAG/LEAD      | Access previous/next row values       |
| FIRST_VALUE   | First value in the window frame       |
| NTILE         | Divide rows into N buckets            |`,
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
        cppRepresentation: `string sortedDates[100];
double sortedTotals[100];
int sortedCount = orderCount;
for (int i = 0; i < sortedCount; i++) { sortedDates[i] = orders[i].order_date; sortedTotals[i] = orders[i].total; }
for (int i = 0; i < sortedCount; i++)
    for (int j = i + 1; j < sortedCount; j++)
        if (sortedDates[i] > sortedDates[j]) {
            string td = sortedDates[i]; sortedDates[i] = sortedDates[j]; sortedDates[j] = td;
            double tt = sortedTotals[i]; sortedTotals[i] = sortedTotals[j]; sortedTotals[j] = tt;
        }
double running = 0;
for (int i = 0; i < sortedCount; i++) {
    running += sortedTotals[i];
    cout << sortedDates[i] << " | " << sortedTotals[i] << " | running=" << running << "\\n";
}`
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
        cppRepresentation: `string sd[100];
int si[100];
double st[100];
int sc = orderCount;
for (int i = 0; i < sc; i++) { sd[i] = orders[i].order_date; si[i] = orders[i].id; st[i] = orders[i].total; }
for (int i = 0; i < sc; i++)
    for (int j = i + 1; j < sc; j++)
        if (sd[i] > sd[j]) {
            string t = sd[i]; sd[i] = sd[j]; sd[j] = t;
            int ti = si[i]; si[i] = si[j]; si[j] = ti;
            double td = st[i]; st[i] = st[j]; st[j] = td;
        }
for (int i = 0; i < sc; i++) {
    double sum = st[i]; int cnt = 1;
    if (i > 0) { sum += st[i - 1]; cnt++; }
    if (i + 1 < sc) { sum += st[i + 1]; cnt++; }
    cout << si[i] << " | " << sd[i] << " | " << st[i] << " | rolling_avg=" << round(sum / cnt * 100) / 100 << "\\n";
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
        cppRepresentation: `string deptKeys[100];
double deptSums[100];
int deptCounts[100];
int deptSize = 0;
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptSums[idx] = 0; deptCounts[idx] = 0; }
    deptSums[idx] += employees[i].salary;
    deptCounts[idx]++;
}
double deptAvgs[100];
for (int i = 0; i < deptSize; i++)
    deptAvgs[i] = round(deptSums[i] / deptCounts[i]);
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    double diff = employees[i].salary - deptAvgs[idx];
    cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << " | dept_avg=" << deptAvgs[idx] << " | diff=" << round(diff) << " | " << (diff > 0 ? "Above Avg" : "Below Avg") << "\\n";
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
        cppRepresentation: `string sd[100];
double st[100];
int sc = orderCount;
for (int i = 0; i < sc; i++) { sd[i] = orders[i].order_date; st[i] = orders[i].total; }
for (int i = 0; i < sc; i++)
    for (int j = i + 1; j < sc; j++)
        if (sd[i] > sd[j]) {
            string t = sd[i]; sd[i] = sd[j]; sd[j] = t;
            double td = st[i]; st[i] = st[j]; st[j] = td;
        }
for (int i = 0; i < sc; i++) {
    double prev = (i > 0) ? st[i - 1] : 0;
    double next = (i + 1 < sc) ? st[i + 1] : 0;
    cout << sd[i] << " | " << st[i] << " | prev=" << prev << " | next=" << next << " | diff=" << round((st[i] - prev) * 100) / 100 << "\\n";
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
        cppRepresentation: `string deptKeys[100];
int deptEmpCounts[100];
int deptSize = 0;
int empDeptIdxs[100];
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptEmpCounts[idx] = 0; }
    empDeptIdxs[i] = idx;
    deptEmpCounts[idx]++;
}
string deptEmpNames[100][100];
double deptEmpSalaries[100][100];
int deptPos[100];
for (int i = 0; i < deptSize; i++) deptPos[i] = 0;
for (int i = 0; i < employeeCount; i++) {
    int d = empDeptIdxs[i];
    deptEmpNames[d][deptPos[d]] = employees[i].name;
    deptEmpSalaries[d][deptPos[d]] = employees[i].salary;
    deptPos[d]++;
}
for (int d = 0; d < deptSize; d++) {
    int n = deptEmpCounts[d];
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (deptEmpSalaries[d][i] < deptEmpSalaries[d][j]) {
                string tn = deptEmpNames[d][i]; deptEmpNames[d][i] = deptEmpNames[d][j]; deptEmpNames[d][j] = tn;
                double ts = deptEmpSalaries[d][i]; deptEmpSalaries[d][i] = deptEmpSalaries[d][j]; deptEmpSalaries[d][j] = ts;
            }
    double highest = deptEmpSalaries[d][0];
    double lowest = deptEmpSalaries[d][n - 1];
    for (int i = 0; i < n; i++)
        cout << deptEmpNames[d][i] << " | " << deptKeys[d] << " | " << deptEmpSalaries[d][i] << " | highest=" << highest << " | lowest=" << lowest << " | gap=" << highest - deptEmpSalaries[d][i] << "\\n";
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
        cppRepresentation: `string deptKeys[100];
int deptEmpCounts[100];
int deptSize = 0;
int empDeptIdxs[100];
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptEmpCounts[idx] = 0; }
    empDeptIdxs[i] = idx;
    deptEmpCounts[idx]++;
}
string deptEmpNames[100][100];
double deptEmpSalaries[100][100];
int deptPos[100];
for (int i = 0; i < deptSize; i++) deptPos[i] = 0;
for (int i = 0; i < employeeCount; i++) {
    int d = empDeptIdxs[i];
    deptEmpNames[d][deptPos[d]] = employees[i].name;
    deptEmpSalaries[d][deptPos[d]] = employees[i].salary;
    deptPos[d]++;
}
for (int d = 0; d < deptSize; d++) {
    int n = deptEmpCounts[d];
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (deptEmpSalaries[d][i] < deptEmpSalaries[d][j]) {
                string tn = deptEmpNames[d][i]; deptEmpNames[d][i] = deptEmpNames[d][j]; deptEmpNames[d][j] = tn;
                double ts = deptEmpSalaries[d][i]; deptEmpSalaries[d][i] = deptEmpSalaries[d][j]; deptEmpSalaries[d][j] = ts;
            }
    double running = 0;
    for (int i = 0; i < n; i++) {
        running += deptEmpSalaries[d][i];
        cout << deptEmpNames[d][i] << " | " << deptKeys[d] << " | " << deptEmpSalaries[d][i] << " | running=" << running << "\\n";
    }
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
        cppRepresentation: `string deptKeys[100];
int deptEmpCounts[100];
int deptSize = 0;
int empDeptIdxs[100];
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == employees[i].department) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = employees[i].department; deptEmpCounts[idx] = 0; }
    empDeptIdxs[i] = idx;
    deptEmpCounts[idx]++;
}
string deptEmpNames[100][100];
double deptEmpSalaries[100][100];
int deptPos[100];
for (int i = 0; i < deptSize; i++) deptPos[i] = 0;
for (int i = 0; i < employeeCount; i++) {
    int d = empDeptIdxs[i];
    deptEmpNames[d][deptPos[d]] = employees[i].name;
    deptEmpSalaries[d][deptPos[d]] = employees[i].salary;
    deptPos[d]++;
}
for (int d = 0; d < deptSize; d++) {
    int n = deptEmpCounts[d];
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (deptEmpSalaries[d][i] < deptEmpSalaries[d][j]) {
                string tn = deptEmpNames[d][i]; deptEmpNames[d][i] = deptEmpNames[d][j]; deptEmpNames[d][j] = tn;
                double ts = deptEmpSalaries[d][i]; deptEmpSalaries[d][i] = deptEmpSalaries[d][j]; deptEmpSalaries[d][j] = ts;
            }
    double total = 0;
    for (int i = 0; i < n; i++) total += deptEmpSalaries[d][i];
    double avg = total / n;
    for (int i = 0; i < n; i++)
        cout << deptEmpNames[d][i] << " | " << deptKeys[d] << " | " << deptEmpSalaries[d][i] << " | rank=" << (i + 1) << " | dept_total=" << total << " | dept_avg=" << round(avg) << "\\n";
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
        cppRepresentation: `string actNames[100];
string actDepts[100];
double actSalaries[100];
int actCount = 0;
for (int i = 0; i < employeeCount; i++)
    if (employees[i].status == "active") {
        actNames[actCount] = employees[i].name;
        actDepts[actCount] = employees[i].department;
        actSalaries[actCount] = employees[i].salary;
        actCount++;
    }
string deptKeys[100];
int deptEmpCounts[100];
int deptSize = 0;
int empDeptIdxs[100];
for (int i = 0; i < actCount; i++) {
    int idx = -1;
    for (int j = 0; j < deptSize; j++)
        if (deptKeys[j] == actDepts[i]) { idx = j; break; }
    if (idx == -1) { idx = deptSize++; deptKeys[idx] = actDepts[i]; deptEmpCounts[idx] = 0; }
    empDeptIdxs[i] = idx;
    deptEmpCounts[idx]++;
}
string deptEmpNames[100][100];
double deptEmpSalaries[100][100];
int deptPos[100];
for (int i = 0; i < deptSize; i++) deptPos[i] = 0;
for (int i = 0; i < actCount; i++) {
    int d = empDeptIdxs[i];
    deptEmpNames[d][deptPos[d]] = actNames[i];
    deptEmpSalaries[d][deptPos[d]] = actSalaries[i];
    deptPos[d]++;
}
for (int d = 0; d < deptSize; d++) {
    int n = deptEmpCounts[d];
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (deptEmpSalaries[d][i] < deptEmpSalaries[d][j]) {
                string tn = deptEmpNames[d][i]; deptEmpNames[d][i] = deptEmpNames[d][j]; deptEmpNames[d][j] = tn;
                double ts = deptEmpSalaries[d][i]; deptEmpSalaries[d][i] = deptEmpSalaries[d][j]; deptEmpSalaries[d][j] = ts;
            }
    for (int i = 0; i < n; i++)
        cout << deptKeys[d] << " | " << deptEmpNames[d][i] << " | " << deptEmpSalaries[d][i] << " | rank=" << (i + 1) << "\\n";
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
        cppRepresentation: `string gpDepts[100];
string gpStatuses[100];
int gpCounts[100];
double gpSums[100];
int gpSize = 0;
int empGroupIdxs[100];
for (int i = 0; i < employeeCount; i++) {
    int idx = -1;
    for (int j = 0; j < gpSize; j++)
        if (gpDepts[j] == employees[i].department && gpStatuses[j] == employees[i].status) { idx = j; break; }
    if (idx == -1) { idx = gpSize++; gpDepts[idx] = employees[i].department; gpStatuses[idx] = employees[i].status; gpCounts[idx] = 0; gpSums[idx] = 0; }
    empGroupIdxs[i] = idx;
    gpCounts[idx]++;
    gpSums[idx] += employees[i].salary;
}
double gpAvgs[100];
for (int i = 0; i < gpSize; i++)
    gpAvgs[i] = round(gpSums[i] / gpCounts[i]);
for (int i = 0; i < employeeCount; i++) {
    int g = empGroupIdxs[i];
    cout << employees[i].name << " | " << gpDepts[g] << " | " << gpStatuses[g] << " | " << employees[i].salary << " | group_avg=" << gpAvgs[g] << " | group_count=" << gpCounts[g] << "\\n";
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
        question: `Table: employees

For each employee, show their salary and the difference from the next higher-paid employee in the same department.

Return columns: name, department, salary, next_higher_salary, gap
Order by: department, salary DESC.`,
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
        question: `Table: orders

Challenge: Show for each month in 2024 the total quantity ordered, and a 3-month rolling average of quantity ordered.

Return columns: month, total_qty, rolling_3mo_avg
Order by: month ASC.`,
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
        question: `Table: employees

Challenge: For each employee, show their name, salary, department, and what percentage their salary contributes to their department's total salary.

Return columns: name, department, salary, dept_total, pct_of_dept
Order by: department, salary DESC.`,
        hint: 'Use SUM(salary) OVER (PARTITION BY department) to compute dept_total. Then compute salary * 100.0 / dept_total.',
        solution: `SELECT name, department, salary,
  SUM(salary) OVER (PARTITION BY department) AS dept_total,
  ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department), 2) AS pct_of_dept
FROM employees
ORDER BY department, salary DESC;`
      },
      {
        question: `Table: orders

Advanced: Show each order for each customer alongside a running total of their spending over time using a window frame clause.

Return columns: customer, order_date, total, running_total
Order by: customer ASC, order_date ASC.`,
        hint: 'Use SUM(total) OVER (PARTITION BY customer ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). The frame clause accumulates the running total.',
        solution: `SELECT customer, order_date, total,
  ROUND(SUM(total) OVER (
    PARTITION BY customer
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ), 2) AS running_total
FROM orders
ORDER BY customer, order_date;`
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
    explanation: `── Real-World Analogy ──
Think of a race where two runners tie for 1st place:
- ROW_NUMBER = the judges arbitrarily say "you're #1, you're #2" (everyone gets a unique position)
- RANK = both get 1st, but the next person is 3rd (gap after ties)
- DENSE_RANK = both get 1st, and the next person is 2nd (no gap)
- NTILE = splitting runners into equal groups (top half, bottom half)

── Visual: The Tie Difference ──
  Athletes sorted by score (DESC):      ROW_NUMBER   RANK   DENSE_RANK   NTILE(2)
  ┌──────────┬───────┐
  │ Athlete  │ Score │                  Each gets    Ties    Ties get    Split into
  ├──────────┼───────┤                  a UNIQUE     get     same rank   2 equal
  │ Alice    │ 100   │  🥇              1            1       1           groups:
  │ Bob      │ 100   │  🥇              2            1       1           Top half
  │ Carol    │ 90    │  🥈              3            3       2           ──────
  │ Dave     │ 80    │  🥉              4            4       3           Bottom
  │ Eve      │ 70    │                 5            5       4           half
  │ Frank    │ 60    │                 6            6       5
  └──────────┴───────┘

  Notice the GAP: RANK goes 1, 1, 3 (skips 2), DENSE_RANK goes 1, 1, 2 (no skip).

── When to Use Each ──
| Function    | Behavior with Ties         | Skip gaps? | Best For                              |
|-------------|----------------------------|:----------:|---------------------------------------|
| ROW_NUMBER  | Unique for EVERY row       | N/A        | Pagination, dedup, top-N-per-group    |
| RANK        | Same rank for ties         | ✅ Skips   | "Top 3" that includes ties (result may have >3 rows) |
| DENSE_RANK  | Same rank for ties         | ❌ No skip | "Top 3" that stops at exactly 3       |
| NTILE(n)    | Divides into n buckets     | N/A        | Quartiles, deciles, equal groups      |

── Quick Decision Guide ──
  "I need each row to have a UNIQUE number"                         → ROW_NUMBER
  "Ties get same rank, and I'm OK with gaps"                       → RANK
  "Ties get same rank, but DON'T skip numbers"                     → DENSE_RANK
  "I need to divide rows into N equal groups"                      → NTILE
  "I need the previous/next row's value for comparison"            → LAG / LEAD`,
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
        cppRepresentation: `string depts[100];int deptCount=0;
int deptIdxs[100][1000];int deptSizes[100]={0};
for(int i=0;i<employeeCount;i++){
    string d=employees[i].department;int idx=-1;
    for(int j=0;j<deptCount;j++)if(depts[j]==d){idx=j;break;}
    if(idx==-1){idx=deptCount;depts[deptCount]=d;deptCount++;}
    deptIdxs[idx][deptSizes[idx]++]=i;
}
for(int i=0;i<deptCount;i++){
    int n=deptSizes[i];
    for(int a=0;a<n;a++)for(int b=a+1;b<n;b++)
        if(employees[deptIdxs[i][b]].salary>employees[deptIdxs[i][a]].salary){
            int t=deptIdxs[i][a];deptIdxs[i][a]=deptIdxs[i][b];deptIdxs[i][b]=t;
        }
    int lim=n<3?n:3;
    for(int j=0;j<lim;j++)cout<<employees[deptIdxs[i][j]].name<<" | "<<depts[i]<<" | "<<employees[deptIdxs[i][j]].salary<<"\\n";
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int rn=0,rank=0,denseRank=0,prev=-1;
for(int i=0;i<employeeCount;i++){
    rn++;int s=employees[idxs[i]].salary;
    if(s!=prev){rank=rn;denseRank++;prev=s;}
    cout<<employees[idxs[i]].name<<" | "<<s<<" | rn="<<rn<<" | rank="<<rank<<" | dense="<<denseRank<<"\\n";
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int n=employeeCount,qSize=(n+3)/4;
for(int i=0;i<n;i++){
    int q=(i/qSize)+1;if(q>4)q=4;
    string b=q==1?"Top 25%":q==2?"25-50%":q==3?"50-75%":"Bottom 25%";
    cout<<employees[idxs[i]].name<<" | "<<employees[idxs[i]].salary<<" | "<<b<<"\\n";
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
        cppRepresentation: `string depts[100];int deptCount=0;
int deptIdxs[100][1000];int deptSizes[100]={0};
for(int i=0;i<employeeCount;i++){
    string d=employees[i].department;
    if(d=="Engineering"||d=="Marketing"){
        int idx=-1;
        for(int j=0;j<deptCount;j++)if(depts[j]==d){idx=j;break;}
        if(idx==-1){idx=deptCount;depts[deptCount]=d;deptCount++;}
        deptIdxs[idx][deptSizes[idx]++]=i;
    }
}
for(int i=0;i<deptCount;i++){
    int n=deptSizes[i];
    for(int a=0;a<n;a++)for(int b=a+1;b<n;b++)
        if(employees[deptIdxs[i][b]].salary>employees[deptIdxs[i][a]].salary){
            int t=deptIdxs[i][a];deptIdxs[i][a]=deptIdxs[i][b];deptIdxs[i][b]=t;
        }
    int rn=0,rank=0,dense=0,prev=-1;
    for(int j=0;j<n;j++){
        rn++;int s=employees[deptIdxs[i][j]].salary;
        if(s!=prev){rank=rn;dense++;prev=s;}
        cout<<depts[i]<<" | "<<employees[deptIdxs[i][j]].name<<" | "<<s<<" | rank="<<rank<<" | dense="<<dense<<"\\n";
    }
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int offset=5,limit=5;
for(int i=offset;i<offset+limit&&i<employeeCount;i++)
    cout<<(i+1)<<" | "<<employees[idxs[i]].name<<" | "<<employees[idxs[i]].department<<" | "<<employees[idxs[i]].salary<<"\\n";`
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int rn=0,rank=0,prev=-1;
for(int i=0;i<employeeCount;i++){
    rn++;int s=employees[idxs[i]].salary;
    if(s!=prev){rank=rn;prev=s;}
    cout<<employees[idxs[i]].name<<" | "<<s<<" | rn="<<rn<<" | rank="<<rank<<"\\n";
}`
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int n=employeeCount,bs=(n+3)/4;
for(int i=0;i<n;i++){
    int b=(i/bs)+1;if(b>4)b=4;
    string l=b==1?"Top Tier":b==2?"Upper Mid":b==3?"Lower Mid":"Bottom";
    cout<<employees[idxs[i]].name<<" | "<<employees[idxs[i]].salary<<" | "<<b<<" ("<<l<<")\\n";
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
        cppRepresentation: `int idxs[1000];for(int i=0;i<employeeCount;i++)idxs[i]=i;
for(int i=0;i<employeeCount;i++)for(int j=i+1;j<employeeCount;j++)
    if(employees[idxs[j]].salary>employees[idxs[i]].salary){int t=idxs[i];idxs[i]=idxs[j];idxs[j]=t;}
int dense=0,prev=-1;
for(int i=0;i<employeeCount;i++){
    int s=employees[idxs[i]].salary;
    if(s!=prev){dense++;prev=s;}
    string l=dense==1?"Top Earner":"Level "+to_string(dense);
    cout<<employees[idxs[i]].name<<" | "<<s<<" | group="<<dense<<" ("<<l<<")\\n";
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
        question: `Table: employees

Show each employee's salary with their department-wide rank (using DENSE_RANK) and indicate if they are in the top 3 of their department.

Return columns: name, department, salary, dept_rank, badge
Order by: department, dept_rank ASC.`,
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
        question: `Table: employees

Challenge: Assign a "tier" to each employee within their department based on salary: Top 1 employee by salary = "Platinum", Next 2 = "Gold", Rest = "Standard". Use ROW_NUMBER.

Return columns: name, department, salary, tier
Order by: department, rn ASC.`,
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
        question: `Table: employees

Challenge: Use RANK, DENSE_RANK, and ROW_NUMBER together to show the difference between these functions on the same salary data (company-wide, no partition).

Return columns: name, salary, rank, dense_rank, row_num
Order by: salary DESC.`,
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
        question: `Table: orders

For each customer, show their total spending, the company-wide average order total, and whether they are above or below the average. Use window functions.

Return columns: customer, total_spent, avg_spent, standing
Order by: total_spent DESC.`,
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
        question: `Table: products, orders

Use ROW_NUMBER to rank products by total sales within each category. Show the top product in each category.

Return columns: name, category, revenue
Order by: revenue DESC.`,
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
        question: `Table: employees

Divide all employees into 4 salary quartiles using NTILE and show the salary range (min to max) for each quartile.

Return columns: quartile, min_salary, max_salary, employee_count
Order by: quartile ASC.`,
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
        question: `Table: orders

Use the LAG window function to show each order for each customer alongside the previous order's total and the difference between consecutive orders.

Return columns: customer, order_date, total, previous_total, difference
Order by: customer, order_date ASC.`,
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
    explanation: `── Real-World Analogy ──
String functions are like a text editor's tools: find & replace, trim spaces, change case, pad numbers.
They let you CLEAN and TRANSFORM messy text data into a consistent format.

── Visual: How String Functions Transform Data ──
  Raw messy data:                     After cleaning with string functions:
  ┌──────────────────┐                ┌──────────────────┬───────────┬───────────┐
  │  "  JOHN DOE  "  │                │  "John Doe"      │ john.doe  │ JOHN DOE │
  │  "  jane smith " │   ──► CLEAN ──►│  "Jane Smith"    │ jane.smith│ JANE SMITH│
  │  "  BOB   "      │                │  "Bob"            │ bob       │ BOB       │
  └──────────────────┘                └──────────────────┴───────────┴───────────┘
                                      ↑ TRIM + proper case  ↑ LOWER +   ↑ UPPER
                                                            REPLACE spaces

── Visual: Function Chaining (Pipe) ──
  Input: "  Hello World  "

  Step 1: TRIM → "Hello World"      (remove outer spaces)
  Step 2: UPPER → "HELLO WORLD"     (convert to uppercase)
  Step 3: REPLACE ' ' WITH '_' → "HELLO_WORLD"

  In SQL: SELECT REPLACE(UPPER(TRIM('  Hello World  ')), ' ', '_');
  → Reads INSIDE OUT: TRIM first → then UPPER → then REPLACE

── String Function Reference ──
| Function              | What It Does                  | Input Example               | Output                    |
|-----------------------|-------------------------------|-----------------------------|---------------------------|
| CONCAT(a, b) / a \|\| b | Join strings                | CONCAT('Hello', ' World')   | 'Hello World'             |
| SUBSTRING(str FROM p FOR n) | Extract part             | SUBSTRING('Hello' FROM 2 FOR 3) | 'ell'               |
| REPLACE(str, old, new)| Replace substring            | REPLACE('Hi', 'Hi', 'Bye')  | 'Bye'                     |
| TRIM(str)             | Remove leading/trailing spaces| TRIM('  hi  ')              | 'hi'                      |
| UPPER(str)            | Convert to uppercase         | UPPER('hello')              | 'HELLO'                   |
| LOWER(str)            | Convert to lowercase         | LOWER('HELLO')              | 'hello'                   |
| LENGTH(str)           | Count characters             | LENGTH('Hello')             | 5                         |
| POSITION(sub IN str)  | Find substring position      | POSITION('ll' IN 'Hello')   | 3                         |
| LPAD(str, n, pad)     | Pad on the left              | LPAD('7', 3, '0')           | '007'                     |
| RPAD(str, n, pad)     | Pad on the right             | RPAD('7', 3, '0')           | '700'                     |
| LEFT(str, n)          | First n characters           | LEFT('Hello', 2)            | 'He'                      |
| RIGHT(str, n)         | Last n characters            | RIGHT('Hello', 2)           | 'lo'                      |

── Golden Rules ──
- Functions CAN be nested (chain them): UPPER(TRIM(column)) — reads from innermost outward
- LENGTH counts CHARACTERS (not bytes) in PostgreSQL
- POSITION is case-sensitive; use LOWER() for case-insensitive: POSITION('john' IN LOWER(name))
- || is SQL standard for concatenation; CONCAT() also standard
- TRIM removes spaces by default; use TRIM(LEADING/TRAILING char FROM str) for custom chars`,
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
        cppRepresentation: `for(int i=0;i<employeeCount;i++){
    string upper;for(int j=0;j<(int)employees[i].name.length();j++)upper+=char(toupper(employees[i].name[j]));
    string lower;for(int j=0;j<(int)employees[i].department.length();j++)lower+=char(tolower(employees[i].department[j]));
    cout<<employees[i].name<<" | upper="<<upper<<" | lower="<<lower<<" | name_len="<<employees[i].name.length()<<" | dept_len="<<employees[i].department.length()<<"\\n";
}`
      },
      {
        title: 'String concatenation',
        sql: `SELECT name,
  department || ' (' || city || ')' AS dept_and_location
FROM employees;`,
        explanation: 'Uses the || operator to concatenate strings, building a combined department and location column.',
        sourceTables: ['employees'],
        cppRepresentation: `for(int i=0;i<employeeCount;i++)cout<<employees[i].name<<" | "<<employees[i].department+" ("+employees[i].city+")"<<"\\n";`
      },
      {
        title: 'SUBSTRING extraction',
        sql: `SELECT name,
  SUBSTR(name, 1, INSTR(name, ' ') - 1) AS first_name,
  SUBSTR(name, INSTR(name, ' ') + 1) AS last_name
FROM employees;`,
        explanation: 'Splits the full name into first and last name using SUBSTR and INSTR to find the space position.',
        sourceTables: ['employees'],
        cppRepresentation: `for(int i=0;i<employeeCount;i++){
    int p=employees[i].name.find(' ');
    cout<<employees[i].name<<" | first="<<employees[i].name.substr(0,p)<<" | last="<<employees[i].name.substr(p+1)<<"\\n";
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
        cppRepresentation: `string trim(string s){int f=-1,l=-1;for(int i=0;i<(int)s.length();i++)if(s[i]!=' '){f=i;break;}if(f==-1)return"";for(int i=(int)s.length()-1;i>=0;i--)if(s[i]!=' '){l=i;break;}return s.substr(f,l-f+1);}
int c=0;
for(int i=0;i<employeeCount;i++){if(c++>=3)break;
    string p="  "+employees[i].name+"  ";
    string r=employees[i].name;for(int j=0;j<(int)r.length();j++)if(r[j]=='e')r[j]='3';
    cout<<employees[i].name<<" | leet="<<r<<" | before="<<p.length()<<" | after="<<trim(p).length()<<"\\n";
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
        cppRepresentation: `string lpad(string s,int w,char p){return (int)s.length()>=w?s:string(w-s.length(),p)+s;}
string rpad(string s,int w,char p){return (int)s.length()>=w?s:s+string(w-s.length(),p);}
int c=0;
for(int i=0;i<employeeCount;i++){if(c++>=5)break;
    string sal=to_string(employees[i].salary);
    cout<<employees[i].name<<" | "<<lpad(sal,10,'.')<<" | "<<rpad(employees[i].department,15,'-')<<"\\n";
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
for(int i=0;i<employeeCount;i++){if(c++>=5)break;
    cout<<employees[i].name<<" | $"<<fixed<<setprecision(2)<<employees[i].salary<<" | Dept: "<<employees[i].department<<" ("<<employees[i].city<<")\\n";
}`
      },
      {
        title: 'Nested function calls',
        sql: `SELECT name,
  UPPER(TRIM(SUBSTR(name, INSTR(name, ' ') + 1))) AS last_name_upper
FROM employees`,
        explanation: 'Chains three functions: extracts the last name via SUBSTR/INSTR, trims whitespace, then uppercases it.',
        sourceTables: ['employees'],
        cppRepresentation: `for(int i=0;i<employeeCount;i++){
    int p=employees[i].name.find(' ');
    string last=employees[i].name.substr(p+1);
    string upper;for(int j=0;j<(int)last.length();j++)upper+=char(toupper(last[j]));
    cout<<employees[i].name<<" | "<<upper<<"\\n";
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
for(int i=0;i<employeeCount;i++){if(c++>=5)break;
    cout<<"Name: "<<employees[i].name<<" | Dept: "<<employees[i].department<<" | Salary: $"<<fixed<<setprecision(2)<<employees[i].salary<<"\\n";
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
        cppRepresentation: `for(int i=0;i<employeeCount;i++){
    string init="";init+=char(toupper(employees[i].name[0]));
    string rest;for(int j=1;j<(int)employees[i].name.length();j++)rest+=char(tolower(employees[i].name[j]));
    cout<<employees[i].name<<" | initial="<<init<<" | rest="<<rest<<"\\n";
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
        question: `Table: employees

Show employee names in uppercase, their department in lowercase, and the length of their full name.

Return columns: name_upper, dept_lower, name_length
Order by: any order.`,
        hint: 'Use UPPER(), LOWER(), and LENGTH() functions.',
        solution: `SELECT 
  UPPER(name) AS name_upper,
  LOWER(department) AS dept_lower,
  LENGTH(name) AS name_length
FROM employees;`
      },
      {
        question: `Table: employees

Challenge: Extract the first name and last initial from each employee name, formatted as "First L." where L is the last initial capitalized. Sort by the last initial descending.

Return columns: name, short_name
Order by: last initial DESC.`,
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
        question: `Table: products

Challenge: Create a "product_code" column by taking the first 3 letters of the category (uppercased), the first 2 letters of the product name (uppercased), and the ID zero-padded to 3 digits.

Return columns: name, category, id, product_code
Order by: id ASC.`,
        hint: 'Use UPPER(SUBSTR(category, 1, 3)) concatenated with UPPER(SUBSTR(name, 1, 2)) and PRINTF(\'%03d\', id).',
        solution: `SELECT name, category, id,
  UPPER(SUBSTR(category, 1, 3))
    || UPPER(SUBSTR(name, 1, 2))
    || PRINTF('%03d', id) AS product_code
FROM products
ORDER BY id;`
      },
      {
        question: `Table: employees

Medium: Create a display_name by concatenating each employee's name with their department in parentheses. Also create a sanitized_email by replacing '@company.com' with '@example.com'. Use CONCAT (||) and REPLACE.

Return columns: name, display_name, sanitized_email
Order by: name ASC.`,
        hint: 'Use name || \' (\' || department || \')\' for display_name. Use REPLACE(email, \'@company.com\', \'@example.com\') for sanitized_email.',
        solution: `SELECT name,
  name || ' (' || department || ')' AS display_name,
  REPLACE(email, '@company.com', '@example.com') AS sanitized_email
FROM employees
ORDER BY name;`
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
    explanation: `── Real-World Analogy ──
LIKE is like using wildcards in a file search: "find all files starting with 'report_' (*.pdf)".
In SQL: "find all customers whose name starts with 'A' or contains 'son'."

── Visual: How LIKE Wildcards Match Data ──
  Pattern: 'A%'  (starts with A)
  ┌────────────┬───────┐
  │ name       │ Match │
  ├────────────┼───────┤
  │ Alice      │ ✅    │  ← starts with A
  │ Andrew     │ ✅    │  ← starts with A
  │ Bob        │ ❌    │  ← starts with B
  │ Barbara    │ ✅    │  ← starts with B... wait, no - she'd also match but LOWER() affects
  └────────────┴───────┘

  ── Visual Wildcard Guide ──
  Pattern: '%son'     → Ends with "son"     → Johnson ✅, Stevenson ✅, Alice ❌
  Pattern: 'A%'       → Starts with "A"     → Alice ✅, Bob ❌
  Pattern: '%Data%'   → Contains "Data"     → Database ✅, Data Mining ✅, SQL ❌
  Pattern: '_r%'      → 2nd char is "r"     → Oracle ✅ (O-r), Arabic ✅ (A-r), SQL ❌
  Pattern: '___'      → Exactly 3 chars     → ABC ✅, Bob ✅, Alice ❌ (5 chars)

  Key: % = "any sequence of characters (including zero)"
       _ = "exactly ONE character"

── Pattern Matching Methods ──
| Method            | What It Does                     | Example                         | Standard?  |
|-------------------|----------------------------------|---------------------------------|------------|
| LIKE              | % (any seq) and _ (one char)     | WHERE name LIKE 'A%'            | ✅ SQL std |
| ILIKE             | LIKE but case-insensitive        | WHERE name ILIKE 'alice'        | ❌ PG only |
| ~ (tilde)         | POSIX regular expression match   | WHERE email ~ '^a.*\\.com$'     | ❌ PG only |
| ~*                | Case-insensitive regex match     | WHERE name ~* '^john'           | ❌ PG only |
| !~ / !~*          | Negated regex match              | WHERE email !~ '^test'          | ❌ PG only |
| regexp_match()    | Extract first regex match        | regexp_match(email, '@(.+)$')   | ❌ PG only |
| regexp_replace()  | Replace using regex              | regexp_replace(text, '\d+', '#')| ❌ PG only |

── LIKE vs Regex: When to Use ──
- LIKE: Simple wildcards, starts-with/ends-with/contains — fast, portable (works in ALL databases)
- Regex: Complex patterns, alternation (cat|dog), quantifiers {2,5}, character classes [A-Z0-9] — PostgreSQL only
- Default: use LIKE unless you NEED regex power (regex is 10x slower than LIKE for simple cases)`,
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
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    string email = employees[i].email;
    int len = email.length();
    if (len >= 12 && email.substr(len - 12) == "@company.com")
        cout << employees[i].name << " | " << email << "\n";}`
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
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    if (employees[i].name.find('e') != -1 && employees[i].email.length() > 0 && employees[i].email[0] == 'c')
        cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].email << "\n";}`
      },
      {
        title: 'LIKE with _ single-character wildcard',
        sql: `SELECT name, department
FROM employees
WHERE name LIKE '%a_e'
ORDER BY name;`,
        explanation: 'The _ matches exactly one character. This pattern finds names ending with "a" followed by any character then "e" — like "Charlie" and "Grace".',
        sourceTables: ['employees'],
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    string name = employees[i].name;
    int len = name.length();
    if (len >= 3 && name[len-3] == 'a' && name[len-1] == 'e')
        cout << name << " | " << employees[i].department << "\n";}`
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
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    string email = employees[i].email;
    if (email.length() > 0) {
        int p = email.find('@');
        cout << employees[i].name << " | " << email << " | user=" << email.substr(0, p) << " | domain=" << email.substr(p+1) << "\n";
    }}`
      },
      {
        title: 'NOT LIKE to exclude patterns',
        sql: `SELECT name, department FROM employees
WHERE name NOT LIKE '%a%'
ORDER BY name`,
        explanation: 'Finds names that do NOT contain the letter "a" using NOT LIKE.',
        sourceTables: ['employees'],
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    if (employees[i].name.find('a') == -1)
        cout << employees[i].name << " | " << employees[i].department << "\n";}`
      },
      {
        title: 'LIKE with _ single char',
        sql: `SELECT name, department FROM employees
WHERE name LIKE '_a%'
ORDER BY name`,
        explanation: 'The _ wildcard matches exactly one character. This finds names with "a" as the second letter.',
        sourceTables: ['employees'],
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    if (employees[i].name.length() >= 2 && employees[i].name[1] == 'a')
        cout << employees[i].name << " | " << employees[i].department << "\n";}`
      },
      {
        title: 'Pattern matching on numbers',
        sql: `SELECT name, price, category FROM products
WHERE CAST(price AS TEXT) LIKE '1%'
ORDER BY price`,
        explanation: 'Casts the numeric price to text and uses LIKE to find products where the price text starts with "1".',
        sourceTables: ['products'],
        cppRepresentation: `for (int i = 0; i < productCount; i++) {
    string s = to_string(products[i].price);
    if (s[0] == '1')
        cout << products[i].name << " | " << products[i].price << " | " << products[i].category << "\n";}`
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
        question: `Table: products

Find all products whose name starts with "D" or ends with "k".

Return columns: name, category, price
Order by: name ASC.`,
        hint: 'Use name LIKE \'D%\' OR name LIKE \'%k\' with OR.',
        solution: `SELECT name, category, price
FROM products
WHERE name LIKE 'D%'
   OR name LIKE '%k'
ORDER BY name;`
      },
      {
        question: `Table: employees

Challenge: Find all employees whose email username (the part before @) has more than 4 characters.

Return columns: name, email, username
Order by: name ASC.`,
        hint: 'Use INSTR(email, \'@\') to find the @ position, then SUBSTR to extract the username and LENGTH to check its length.',
        solution: `SELECT name, email,
  SUBSTR(email, 1, INSTR(email, '@') - 1) AS username
FROM employees
WHERE LENGTH(SUBSTR(email, 1, INSTR(email, '@') - 1)) > 4
ORDER BY name;`
      },
      {
        question: `Table: products

Challenge: Find all products whose price is a whole number (no decimal cents — ends with .00 when cast to text).

Return columns: name, price, category
Order by: price DESC.`,
        hint: 'Use CAST(price AS TEXT) LIKE \'%.00\' or use price = CAST(price AS INTEGER).',
        solution: `SELECT name, price, category
FROM products
WHERE CAST(price AS TEXT) LIKE '%.00'
ORDER BY price DESC;`
      },
      {
        question: `Table: employees

Medium: Find employees whose email follows a valid pattern: starts with a lowercase letter, contains only lowercase letters, numbers, dots, or hyphens before the @, and ends with '@company.com'.

Return columns: name, email
Order by: name ASC.`,
        hint: 'Use email LIKE \'[a-z]%\' OR email GLOB \'[a-z]*@company.com\' - since LIKE doesn\'t support character classes in SQLite, use multiple conditions: email LIKE \'%@company.com\' AND email GLOB \'[a-z]*\' and ensure no uppercase via email = LOWER(email).',
        solution: `SELECT name, email
FROM employees
WHERE email = LOWER(email)
  AND email LIKE '%@company.com'
  AND SUBSTR(email, 1, 1) BETWEEN 'a' AND 'z'
ORDER BY name;`
      }
    ]

  },
  {
    id: 'date-functions',
    title: 'Date & Time Functions',
    description: 'Add, subtract, compare, and format dates across SQL dialects',
    icon: '📅',
    difficulty: 'intermediate',
    prerequisites: ['select', 'where', 'joins'],
    topics: ['DATE_ADD', 'DATE_SUB', 'DATEDIFF', 'INTERVAL', 'CURRENT_DATE', 'EXTRACT', 'STRFTIME', 'JULIANDAY', 'DATE_FORMAT', 'NOW', 'date arithmetic', 'cross-dialect', 'self-join date comparison'],
    explanation: `── Real-World Analogy ──
Dates in SQL are like numbers on a timeline. You can add/subtract intervals ("3 days from now"),
calculate the gap between two dates ("how long since last order"), and extract parts ("orders in March").

The challenge: every database has its OWN syntax for the same operation.

── The Query You Asked About ──
  SELECT w1.id
  FROM Weather w1
  JOIN Weather w2
    ON w1.temperature > w2.temperature
    AND w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY);
This is LeetCode 197 (Rising Temperature). It finds days where the temperature is warmer
than the PREVIOUS day. The self-join pairs each row with the row from 1 day earlier.
DATE_ADD(w2.recordDate, INTERVAL 1 DAY) means "the day after w2.recordDate".

── DATE_ADD Across SQL Dialects ──
| Operation         | MySQL / MariaDB              | SQLite (our platform)        | PostgreSQL                   | SQL Server                   |
|-------------------|------------------------------|------------------------------|------------------------------|------------------------------|
| Add N days        | DATE_ADD(d, INTERVAL N DAY)  | DATE(d, '+N days')           | d + INTERVAL 'N days'        | DATEADD(day, N, d)           |
| Add N months      | DATE_ADD(d, INTERVAL N MONTH)| DATE(d, '+N months')         | d + INTERVAL 'N months'      | DATEADD(month, N, d)         |
| Add N years       | DATE_ADD(d, INTERVAL N YEAR) | DATE(d, '+N years')          | d + INTERVAL 'N years'       | DATEADD(year, N, d)          |
| Subtract N days   | DATE_SUB(d, INTERVAL N DAY)  | DATE(d, '-N days')           | d - INTERVAL 'N days'        | DATEADD(day, -N, d)          |
| Days between      | DATEDIFF(d1, d2)             | JULIANDAY(d1) - JULIANDAY(d2)| d1 - d2 (date subtraction)   | DATEDIFF(day, d2, d1)        |
| Current date      | CURDATE()                    | DATE('now')                  | CURRENT_DATE                 | GETDATE()                    |
| Current timestamp | NOW()                        | DATETIME('now')              | CURRENT_TIMESTAMP            | GETDATE()                    |
| Extract year      | YEAR(d)                      | CAST(STRFTIME('%Y',d) AS INT)| EXTRACT(YEAR FROM d)         | YEAR(d)                      |
| Extract month     | MONTH(d)                     | CAST(STRFTIME('%m',d) AS INT)| EXTRACT(MONTH FROM d)        | MONTH(d)                     |
| Format date       | DATE_FORMAT(d, '%Y-%m-%d')   | STRFTIME('%Y-%m-%d', d)      | TO_CHAR(d, 'YYYY-MM-DD')     | FORMAT(d, 'yyyy-MM-dd')      |

── Key: The LeetCode 197 Pattern in Each Dialect ──
  -- MySQL (the original):
  SELECT w1.id FROM Weather w1
  JOIN Weather w2 ON w1.temperature > w2.temperature
    AND w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY);

  -- SQLite (our platform — use DATE() with '+N days'):
  SELECT w1.id FROM Weather w1
  JOIN Weather w2 ON w1.temperature > w2.temperature
    AND w1.recordDate = DATE(w2.recordDate, '+1 days');

  -- PostgreSQL:
  SELECT w1.id FROM Weather w1
  JOIN Weather w2 ON w1.temperature > w2.temperature
    AND w1.recordDate = w2.recordDate + INTERVAL '1 day';

  -- SQL Server:
  SELECT w1.id FROM Weather w1
  JOIN Weather w2 ON w1.temperature > w2.temperature
    AND w1.recordDate = DATEADD(day, 1, w2.recordDate);

── Core Functions in SQLite (Our Platform) ──
  DATE(timestring, modifier, ...)    → returns date as 'YYYY-MM-DD'
  TIME(timestring, modifier, ...)    → returns time as 'HH:MM:SS'
  DATETIME(timestring, modifier, ...)→ returns datetime 'YYYY-MM-DD HH:MM:SS'
  STRFTIME(format, timestring, ...)  → custom format (like DATE_FORMAT in MySQL)
  JULIANDAY(timestring)              → days since 4714 BC (for date arithmetic)

  Modifiers: '+N days', '-N months', 'start of month', 'start of year', 'localtime'

  -- Examples:
  SELECT DATE('now');                          -- today: 2026-05-22
  SELECT DATE('now', '+7 days');               -- 7 days from now
  SELECT DATE('now', 'start of month');        -- first day of current month
  SELECT DATE('2024-01-15', '+1 month');       -- 2024-02-15
  SELECT JULIANDAY('2024-01-20') - JULIANDAY('2024-01-15');  -- 5 days

── EXTRACT / STRFTIME ──
  Extract year, month, day from a date:

  -- SQLite using STRFTIME:
  SELECT
    STRFTIME('%Y', hire_date) AS year,
    STRFTIME('%m', hire_date) AS month,
    STRFTIME('%d', hire_date) AS day,
    STRFTIME('%w', hire_date) AS weekday  -- 0=Sunday, 6=Saturday
  FROM employees;

  -- Equivalent in MySQL:  YEAR(hire_date), MONTH(hire_date), DAY(hire_date)
  -- Equivalent in PostgreSQL: EXTRACT(YEAR FROM hire_date), etc.

── Common Date Patterns ──
  -- Filter by date range:
  SELECT * FROM orders
  WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';

  -- Find orders in the last 30 days:
  SELECT * FROM orders
  WHERE order_date >= DATE('now', '-30 days');

  -- Group by month:
  SELECT
    STRFTIME('%Y-%m', order_date) AS month,
    COUNT(*) AS order_count,
    ROUND(SUM(total), 2) AS revenue
  FROM orders
  GROUP BY month
  ORDER BY month;

  -- Self-join: compare each row with previous day (LeetCode 197):
  SELECT w1.id
  FROM Weather w1
  JOIN Weather w2
    ON w1.temperature > w2.temperature
    AND w1.recordDate = DATE(w2.recordDate, '+1 days');`,

    syntax: `-- SQLite date functions syntax:

-- Current date/time
SELECT DATE('now');                    -- '2026-05-22'
SELECT TIME('now');                    -- '14:30:00'
SELECT DATETIME('now');                -- '2026-05-22 14:30:00'
SELECT DATETIME('now', 'localtime');   -- local timezone

-- Add/subtract intervals
DATE(date_string, '+N days');
DATE(date_string, '-N days');
DATE(date_string, '+N months');
DATE(date_string, '+N years');

-- Days between two dates
JULIANDAY(d1) - JULIANDAY(d2)

-- Extract parts
STRFTIME('%Y', date_string)  -- year (4 digits)
STRFTIME('%m', date_string)  -- month (01-12)
STRFTIME('%d', date_string)  -- day (01-31)
STRFTIME('%w', date_string)  -- weekday (0=Sun, 6=Sat)
STRFTIME('%H', time_string)  -- hour (00-23)
STRFTIME('%M', time_string)  -- minute (00-59)

-- LeetCode 197 pattern in SQLite
SELECT w1.id
FROM weather w1
JOIN weather w2
  ON w1.temperature > w2.temperature
  AND w1.recordDate = DATE(w2.recordDate, '+1 days');`,
    examples: [
      {
        title: 'CURRENT_DATE and basic arithmetic',
        sql: `-- Today's date and future dates
SELECT
  DATE('now') AS today,
  DATE('now', '+1 day') AS tomorrow,
  DATE('now', '+7 days') AS next_week,
  DATE('now', 'start of month') AS month_start,
  DATE('now', 'start of month', '+1 month', '-1 day') AS month_end;`,
        explanation: 'Shows today, tomorrow, next week, first day of month, and last day of month. Note that modifiers chain: start of month → add 1 month → subtract 1 day = last day of month.',
        cppRepresentation: `// Intuitive C++ representation of: date arithmetic
// DATE('now', '+1 day') = today + 1 day
time_t now = time(0);
tm* tmNow = localtime(&now);
tm tmTomorrow = *tmNow; tmTomorrow.tm_mday += 1; mktime(&tmTomorrow);
cout << "today: " << asctime(tmNow);
cout << "tomorrow: " << asctime(&tmTomorrow);`
      },
      {
        title: 'DATE_ADD alternatives (LeetCode 197)',
        sql: `-- SQLite: DATE(date, '+N days')
SELECT
  DATE('2024-01-15') AS original,
  DATE('2024-01-15', '+1 day') AS plus_1_day_sqlite;

-- Equivalent in other dialects (conceptual):
-- MySQL:  DATE_ADD('2024-01-15', INTERVAL 1 DAY)
-- PG:    '2024-01-15'::date + INTERVAL '1 day'
-- SQL Server: DATEADD(day, 1, '2024-01-15')

-- Rising temperature pattern (SQLite):
-- SELECT w1.id FROM Weather w1
-- JOIN Weather w2 ON w1.temperature > w2.temperature
--   AND w1.recordDate = DATE(w2.recordDate, '+1 days');`,
        explanation: 'DATE(date, \'+N days\') is the SQLite equivalent of MySQL\'s DATE_ADD(). The LeetCode 197 pattern uses this to find consecutive-day temperature increases.',
        cppRepresentation: `// C++ representation of: DATE_ADD / date + 1 day
struct Weather { int id; double temp; string date; };
bool isNextDay(const string& d1, const string& d2) {
    // parse YYYY-MM-DD, compare day delta == 1
    int y1,m1,d1d, y2,m2,d2d;
    sscanf(d1.c_str(),"%d-%d-%d",&y1,&m1,&d1d);
    sscanf(d2.c_str(),"%d-%d-%d",&y2,&m2,&d2d);
    tm t1 = {0,0,0,d1d,m1-1,y1-1900};
    tm t2 = {0,0,0,d2d,m2-1,y2-1900};
    time_t tt1 = mktime(&t1), tt2 = mktime(&t2);
    return difftime(tt1, tt2) == 86400; // 1 day in seconds
}`
      },
      {
        title: 'DATEDIFF / JULIANDAY',
        sql: `-- Days between two dates (SQLite)
SELECT
  JULIANDAY('2024-12-31') - JULIANDAY('2024-01-01') AS days_in_year;

-- How long since each employee was hired?
SELECT
  name,
  hire_date,
  CAST(JULIANDAY('now') - JULIANDAY(hire_date) AS INTEGER) AS days_employed
FROM employees
ORDER BY hire_date;`,
        explanation: 'JULIANDAY converts a date to a continuous day count. Subtracting two JULIANDAY values gives the exact number of days between them. JULIANDAY(\'now\') gives today.',
        sourceTables: ['employees'],
        cppRepresentation: `// C++ representation of: JULIANDAY
int julianDay(int y, int m, int d) {
    return (1461 * (y + 4800 + (m - 14) / 12)) / 4
         + (367 * (m - 2 - 12 * ((m - 14) / 12))) / 12
         - (3 * ((y + 4900 + (m - 14) / 12) / 100)) / 4 + d - 32075;
}
int daysBetween(string d1, string d2) {
    // Parse dates, compute JD difference
    int y1,m1,d1d, y2,m2,d2d;
    sscanf(d1.c_str(),"%d-%d-%d",&y1,&m1,&d1d);
    sscanf(d2.c_str(),"%d-%d-%d",&y2,&m2,&d2d);
    return julianDay(y1,m1,d1d) - julianDay(y2,m2,d2d);
}`
      },
      {
        title: 'EXTRACT / STRFTIME',
        sql: `-- Extract year, month, day from dates
SELECT
  name,
  hire_date,
  CAST(STRFTIME('%Y', hire_date) AS INTEGER) AS hire_year,
  CAST(STRFTIME('%m', hire_date) AS INTEGER) AS hire_month,
  STRFTIME('%Y-%m', hire_date) AS hire_ym
FROM employees
ORDER BY hire_date;

-- Find employees hired in 2023
SELECT name, hire_date
FROM employees
WHERE STRFTIME('%Y', hire_date) = '2023'
ORDER BY hire_date;`,
        explanation: 'STRFTIME formats dates using strftime-style format strings. %Y = 4-digit year, %m = 2-digit month, %d = 2-digit day. CAST(... AS INTEGER) converts text to number for comparison.',
        sourceTables: ['employees'],
        cppRepresentation: `// C++ representation of: EXTRACT(YEAR FROM hire_date)
struct Employee { string name; string hire_date; };
for (int i = 0; i < empCount; i++) {
    int year = stoi(employees[i].hire_date.substr(0, 4));
    int month = stoi(employees[i].hire_date.substr(5, 2));
    if (year == 2023)
        cout << employees[i].name << "\\n";
}`
      },
      {
        title: 'Self-join with date comparison (LeetCode 197)',
        sql: `-- Fake weather data for the example
CREATE TABLE weather (
  id INTEGER PRIMARY KEY,
  recordDate DATE NOT NULL,
  temperature INTEGER NOT NULL
);
INSERT INTO weather VALUES (1, '2024-01-01', 10);
INSERT INTO weather VALUES (2, '2024-01-02', 25);
INSERT INTO weather VALUES (3, '2024-01-03', 20);
INSERT INTO weather VALUES (4, '2024-01-04', 30);

-- Find days warmer than the previous day
SELECT w1.id
FROM weather w1
JOIN weather w2
  ON w1.temperature > w2.temperature
  AND w1.recordDate = DATE(w2.recordDate, '+1 days')
ORDER BY w1.id;`,
        explanation: 'This is LeetCode 197. The self-join pairs each day (w1) with the previous day (w2). DATE(w2.recordDate, \'+1 days\') = w1.recordDate ensures they\'re consecutive. The temperature comparison filters to warmer days. Result: id=2 (25>10) and id=4 (30>20).',
        cppRepresentation: `// C++ representation of: LeetCode 197
struct Weather { int id; string date; int temp; };
for (int i = 0; i < weatherCount; i++) {
    for (int j = 0; j < weatherCount; j++) {
        if (weather[i].temp > weather[j].temp
            && isNextDay(weather[i].date, weather[j].date))
            cout << weather[i].id << "\\n";
    }
}`
      },
      {
        title: 'Filtering and grouping by date',
        sql: `-- Total sales per month in 2024
SELECT
  STRFTIME('%Y-%m', o.order_date) AS month,
  COUNT(*) AS orders,
  ROUND(SUM(o.total), 2) AS revenue
FROM orders o
WHERE o.order_date >= '2024-01-01'
  AND o.order_date < '2025-01-01'
GROUP BY month
ORDER BY month;

-- Products ordered in the last 2 months (from sample data)
SELECT p.name, o.order_date
FROM products p
JOIN orders o ON p.id = o.product_id
WHERE o.order_date >= DATE('2024-02-01')
ORDER BY o.order_date;`,
        explanation: 'STRFTIME(\'%Y-%m\', date) extracts year-month for grouping. Date range filtering uses BETWEEN or >= / <. The second query shows JOIN + date filter + ORDER BY in one query.',
        sourceTables: ['orders', 'products'],
        cppRepresentation: `// C++ representation of: GROUP BY month
struct Order { double total; string date; };
map<string, int> monthCount;
map<string, double> monthRevenue;
for (int i = 0; i < orderCount; i++) {
    string m = orders[i].date.substr(0, 7); // "2024-01"
    monthCount[m]++;
    monthRevenue[m] += orders[i].total;
}
for (auto& [m, cnt] : monthCount)
    cout << m << " | " << cnt << " | $" << monthRevenue[m] << "\\n";`
      }
    ],
    commonMistakes: [
      'Using MySQL DATE_ADD() syntax in SQLite — use DATE(date, \'+N days\') instead',
      'Forgetting that STRFTIME returns TEXT, not integers — CAST to INTEGER for numeric comparison',
      'Assuming all databases use the same date functions — always check the dialect',
      'Using = instead of BETWEEN for date ranges (watch out for time components in timestamps)',
      'Confusing DATEADD (SQL Server) with DATE_ADD (MySQL) — the argument order is different',
      'Forgetting JULIANDAY for date difference in SQLite — subtracting dates directly does NOT work'
    ],
    practiceQuestions: [
      {
        question: `Table: employees

List all employees who were hired in the 3 months before March 15, 2024.

Return columns: name, hire_date, days_before_ref
Order by: days_before_ref ASC.`,
        hint: 'Use a fixed reference date: JULIANDAY(\'2024-03-15\') - JULIANDAY(hire_date) to calculate days. Filter with WHERE hire_date >= DATE(\'2024-03-15\', \'-3 months\').',
        solution: `SELECT name, hire_date,
  CAST(JULIANDAY('2024-03-15') - JULIANDAY(hire_date) AS INTEGER) AS days_before_ref
FROM employees
WHERE hire_date >= DATE('2024-03-15', '-3 months')
ORDER BY days_before_ref;`
      },
      {
        question: `Table: orders

Find the number of orders per month and their total revenue for the year 2024.

Return columns: month (YYYY-MM format), order_count, revenue
Order by: month ASC.`,
        hint: 'Use STRFTIME(\'%Y-%m\', order_date) AS month, COUNT(*), and ROUND(SUM(total), 2). Filter WHERE order_date >= \'2024-01-01\' AND order_date < \'2025-01-01\'.',
        solution: `SELECT
  STRFTIME('%Y-%m', order_date) AS month,
  COUNT(*) AS order_count,
  ROUND(SUM(total), 2) AS revenue
FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01'
GROUP BY month
ORDER BY month;`
      },
      {
        question: `Table: employees

Medium: Find pairs of employees where the second was hired within 30 days after the first. Use a self-join with date arithmetic.

Return columns: employee_1, hire_date_1, employee_2, hire_date_2, days_apart
Order by: days_apart ASC, employee_1 ASC.`,
        hint: 'Self-join employees e1 JOIN employees e2 ON e1.name < e2.name. Use JULIANDAY(e2.hire_date) - JULIANDAY(e1.hire_date) BETWEEN 1 AND 30.',
        solution: `SELECT
  e1.name AS employee_1,
  e1.hire_date AS hire_date_1,
  e2.name AS employee_2,
  e2.hire_date AS hire_date_2,
  CAST(JULIANDAY(e2.hire_date) - JULIANDAY(e1.hire_date) AS INTEGER) AS days_apart
FROM employees e1
JOIN employees e2
  ON e1.name < e2.name
  AND JULIANDAY(e2.hire_date) - JULIANDAY(e1.hire_date) BETWEEN 1 AND 30
ORDER BY days_apart, employee_1;`
      },
      {
        question: `Table: weather

Challenge (LeetCode 197): Given a weather table with id, recordDate, and temperature, find all dates where the temperature is higher than the previous day (consecutive date comparison).

Return columns: id
Order by: id ASC.`,
        hint: 'Self-join weather w1 JOIN weather w2. The ON clause has two conditions: w1.temperature > w2.temperature AND w1.recordDate = DATE(w2.recordDate, \'+1 days\').',
        solution: `SELECT w1.id
FROM weather w1
JOIN weather w2
  ON w1.temperature > w2.temperature
  AND w1.recordDate = DATE(w2.recordDate, '+1 days')
ORDER BY w1.id;`
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
    explanation: `── Real-World Analogy ──
Set operations work like Venn diagrams from math class:
- UNION = everything in EITHER circle (combined)
- INTERSECT = only the OVERLAP (in both)
- EXCEPT = left circle MINUS the overlap (in one but not the other)

Key difference from JOIN: JOIN combines columns HORIZONTALLY (adds columns).
Set operations combine rows VERTICALLY (adds rows). They STACK results.

── Visual: Set Operations with Real Data ──
  Query A: cities with customers       Query B: cities with suppliers
  ┌──────────┐                         ┌──────────┐
  │ city     │                         │ city     │
  ├──────────┤                         ├──────────┤
  │ Cairo    │                         │ Cairo    │
  │ Giza     │                         │ Alex     │
  │ Luxor    │                         │ Luxor    │
  └──────────┘                         └──────────┘

  UNION:                          INTERSECT:                    EXCEPT (A - B):
  ┌──────────┐                    ┌──────────┐                  ┌──────────┐
  │ Cairo    │  ← in both (once)  │ Cairo    │  ← in A AND B   │ Giza     │  ← in A but NOT B
  │ Giza     │  ← only in A       │ Luxor    │                  └──────────┘
  │ Luxor    │  ← in both (once)  └──────────┘
  │ Alex     │  ← only in B
  └──────────┘

── Set Operation Comparison ──
| Operation   | Result                          | Duplicates? | SQL Keyword    | Venn Diagram             |
|-------------|---------------------------------|:-----------:|----------------|--------------------------|
| UNION       | Rows from query1 OR query2      | ❌ Removed  | UNION          | Both circles combined    |
| UNION ALL   | Rows from query1 OR query2      | ✅ Kept     | UNION ALL      | Both circles + overlaps  |
| INTERSECT   | Rows in BOTH query1 AND query2  | ❌ Removed  | INTERSECT      | Only the overlap          |
| EXCEPT      | Rows in query1 BUT NOT query2   | ❌ Removed  | EXCEPT         | Left minus the overlap    |

── Set Operation Rules ──
- Each SELECT must have the SAME NUMBER of columns
- Corresponding columns must have COMPATIBLE data types (you can't UNION text with numbers)
- Column names in the result come from the FIRST SELECT
- Only ONE ORDER BY at the very END of the entire UNION/INTERSECT/EXCEPT
- ORDER BY must use column names from the first SELECT (or numeric position)

── UNION vs JOIN Visual ──
  UNION (adds ROWS):                           JOIN (adds COLUMNS):
  ┌─────────────┐                              ┌──────────┬──────────┐
  │ customers   │                              │ city     │ has_supp │
  ├─────────────┤                              ├──────────┼──────────┤
  │ Cairo       │  ← from customers            │ Cairo    │ YES      │  ← combined row
  │ Giza        │  ← from customers            │ Giza     │ NO       │
  │ Alex        │  ← from suppliers            │ Luxor    │ YES      │
  │ Luxor       │  ← from suppliers            └──────────┴──────────┘
  └─────────────┘                              JOIN: more columns, same rows
  UNION: more rows, same columns

── INTERSECT vs INNER JOIN ──
INTERSECT: "Which cities have BOTH customers AND suppliers?"
  SELECT city FROM customers INTERSECT SELECT city FROM suppliers
  → JUST the city names (single column)

INNER JOIN: "Show me customers AND their supplier info for matching cities"
  SELECT c.city, s.name FROM customers c JOIN suppliers s ON c.city = s.city
  → Combined rows with columns from BOTH tables`,
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
        cppRepresentation: `Employee result[1000];
int resultCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].status == "active" || employees[i].status == "inactive") {
        result[resultCount] = employees[i];
        resultCount++;
    }
}
for (int i = 0; i < resultCount; i++) {
    for (int j = i + 1; j < resultCount; j++) {
        if (result[j].name < result[i].name) {
            Employee temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
    }
}
for (int i = 0; i < resultCount; i++) {
    cout << result[i].name << " | " << result[i].department << " | " << result[i].salary << " | " << result[i].status << "\\n";}`
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
        cppRepresentation: `string engCities[100];
int engCount = 0;
string mktCities[100];
int mktCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering") {
        bool dup = false;
        for (int j = 0; j < engCount; j++) {
            if (engCities[j] == employees[i].city) { dup = true; break; }
        }
        if (!dup) { engCities[engCount] = employees[i].city; engCount++; }
    }
    if (employees[i].department == "Marketing") {
        bool dup = false;
        for (int j = 0; j < mktCount; j++) {
            if (mktCities[j] == employees[i].city) { dup = true; break; }
        }
        if (!dup) { mktCities[mktCount] = employees[i].city; mktCount++; }
    }
}
for (int i = 0; i < engCount; i++) {
    for (int j = 0; j < mktCount; j++) {
        if (engCities[i] == mktCities[j]) {
            cout << engCities[i] << "\\n";
            break;
        }
    }
}`
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
        cppRepresentation: `int orderedIds[1000];
int orderedCount = 0;
for (int i = 0; i < orderCount; i++) {
    bool dup = false;
    for (int j = 0; j < orderedCount; j++) {
        if (orderedIds[j] == orders[i].product_id) { dup = true; break; }
    }
    if (!dup) { orderedIds[orderedCount] = orders[i].product_id; orderedCount++; }
}
for (int i = 0; i < productCount; i++) {
    bool found = false;
    for (int j = 0; j < orderedCount; j++) {
        if (orderedIds[j] == products[i].id) { found = true; break; }
    }
    if (!found) {
        cout << products[i].id << " | " << products[i].name << " | " << products[i].category << " | " << products[i].price << "\\n";
    }
}`
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
        cppRepresentation: `string depts[100];
int deptCount = 0;
for (int i = 0; i < employeeCount; i++) {
    string d = employees[i].department;
    bool dup = false;
    for (int j = 0; j < deptCount; j++) {
        if (depts[j] == d) { dup = true; break; }
    }
    if (!dup) { depts[deptCount] = d; deptCount++; }
}
for (int i = 0; i < deptCount; i++) {
    cout << depts[i] << "\\n";
}`
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
        cppRepresentation: `Employee combined[1000];
int combinedCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering" || employees[i].department == "Product") {
        combined[combinedCount] = employees[i];
        combinedCount++;
    }
}
string lowSal[1000];
int lowCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].salary < 75000) {
        bool dup = false;
        for (int j = 0; j < lowCount; j++) {
            if (lowSal[j] == employees[i].name) { dup = true; break; }
        }
        if (!dup) { lowSal[lowCount] = employees[i].name; lowCount++; }
    }
}
for (int i = 0; i < combinedCount; i++) {
    bool excluded = false;
    for (int j = 0; j < lowCount; j++) {
        if (lowSal[j] == combined[i].name) { excluded = true; break; }
    }
    if (!excluded) {
        cout << combined[i].name << " | " << combined[i].department << " | " << combined[i].salary << "\\n";
    }
}`
      },
      {
        title: 'UNION with different tables',
        sql: `SELECT name, 'Employee' AS source FROM employees
UNION
SELECT name, 'Product' AS source FROM products`,
        explanation: 'Combines employee names with product names into a single list, with a label column identifying the source table.',
        sourceTables: ['employees', 'products'],
        cppRepresentation: `string seen[1000];
int seenCount = 0;
for (int i = 0; i < employeeCount; i++) {
    bool dup = false;
    for (int j = 0; j < seenCount; j++) {
        if (seen[j] == employees[i].name) { dup = true; break; }
    }
    if (!dup) {
        seen[seenCount] = employees[i].name;
        seenCount++;
        cout << employees[i].name << " | Employee\\n";
    }
}
for (int i = 0; i < productCount; i++) {
    bool dup = false;
    for (int j = 0; j < seenCount; j++) {
        if (seen[j] == products[i].name) { dup = true; break; }
    }
    if (!dup) {
        seen[seenCount] = products[i].name;
        seenCount++;
        cout << products[i].name << " | Product\\n";
    }
}`
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
        cppRepresentation: `cout << "=== DEPARTMENT LIST ===\\n";
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering")
        cout << employees[i].name << "\\n";
}
cout << "=== END ===\\n";`
      },
      {
        title: 'EXCEPT with WHERE',
        sql: `SELECT name, department FROM employees WHERE status = 'active'
EXCEPT
SELECT name, department FROM employees WHERE salary < 60000
ORDER BY name`,
        explanation: 'Finds active employees who earn at least $60,000 by excluding lower-paid employees from the active employee list.',
        sourceTables: ['employees'],
        cppRepresentation: `for (int i = 0; i < employeeCount; i++) {
    if (employees[i].status == "active" && !(employees[i].salary < 60000))
        cout << employees[i].name << " | " << employees[i].department << "\\n";}`
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
        question: `Table: products, orders

Find products that have been ordered at least once using INTERSECT.

Return columns: id, name
Order by: any order.`,
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
        question: `Table: employees, orders

Challenge: Use EXCEPT to find employees who have NOT placed any orders.

Return columns: name, department
Order by: name ASC.`,
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
        question: `Table: employees, products

Challenge: Use UNION ALL to create a combined product-employee catalog showing name, type ("Employee" or "Product"), and value (salary or price).

Return columns: name, type, value
Order by: name ASC.`,
        hint: 'First SELECT: SELECT name, \'Employee\' AS type, salary FROM employees. Second SELECT: SELECT name, \'Product\' AS type, price FROM products. Use UNION ALL to combine.',
        solution: `SELECT name, 'Employee' AS type, salary AS value
FROM employees
UNION ALL
SELECT name, 'Product' AS type, price AS value
FROM products
ORDER BY name;`
      },
      {
        question: `Table: employees, departments

Medium: Use UNION to list all unique cities from both the employees table and the departments table. Label the source of each city.

Return columns: city, source
Order by: city ASC.`,
        hint: 'First SELECT: SELECT DISTINCT city, \'Employee\' FROM employees. Second: SELECT DISTINCT city, \'Department\' FROM departments. Use UNION (not UNION ALL) to remove duplicate cities.',
        solution: `SELECT DISTINCT city, 'Employee' AS source
FROM employees
UNION
SELECT DISTINCT city, 'Department' AS source
FROM departments
ORDER BY city;`
      }
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
        question: `Table: employees

Show each employee's name, department, and salary, along with the average salary of their department (use a correlated subquery), and whether they are above or below their department average.

Return columns: name, department, salary, dept_avg, standing
Order by: department, salary DESC.`,
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
        question: `Table: products, orders

Use a CTE to find the top 2 products by total sales in each category.

Return columns: name, category, revenue
Order by: category, revenue DESC.`,
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
        question: `Table: employees, orders

Find employees who have placed orders totaling more than $100. Use EXISTS.

Return columns: name, department, salary
Order by: salary DESC.`,
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
        question: `Table: employees

Use string functions to extract the first letter of each employee's name and show how many employees have names starting with each letter.

Return columns: first_letter, employee_count
Order by: employee_count DESC.`,
        hint: 'Use SUBSTR(UPPER(name), 1, 1) AS first_letter. GROUP BY first_letter. ORDER BY count DESC.',
        solution: `SELECT SUBSTR(UPPER(name), 1, 1) AS first_letter,
  COUNT(*) AS employee_count
FROM employees
GROUP BY first_letter
ORDER BY employee_count DESC;`
      },
      {
        question: `Table: employees

Use a self-JOIN to find all pairs of employees from different departments who earn similar salaries (within $5,000 of each other). Exclude mirror pairs (e1.name < e2.name).

Return columns: emp1, dept1, salary1, emp2, dept2, salary2
Order by: salary1 ASC.`,
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
  },
  {
    id: 'ddl-create',
    title: 'DDL — CREATE TABLE & Constraints',
    description: 'Define database tables with columns, data types, and constraints',
    icon: '🏗️',
    difficulty: 'beginner',
    prerequisites: [],
    topics: ['CREATE TABLE', 'data types', 'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK', 'AUTOINCREMENT', 'IF NOT EXISTS', 'TEMPORARY TABLE', 'composite key', 'ON DELETE', 'ON UPDATE'],
    explanation: `── Real-World Analogy ──
CREATE TABLE is like designing a spreadsheet template BEFORE entering any data.
You decide: what columns do I need? What TYPE of data goes in each column? What RULES should the data follow?

  Before CREATE TABLE (nothing):      After CREATE TABLE (empty structure):
  ┌──────────────────────────┐        ┌──────┬──────────┬────────────┬────────┐
  │   No table exists yet    │        │ id   │ name     │ email      │ salary │
  │                          │  ──►   ├──────┼──────────┼────────────┼────────┤
  │   CREATE TABLE builds    │        │ INT  │ VARCHAR  │ VARCHAR    │ DECIMAL│
  │   the empty skeleton     │        │ PK   │ NOT NULL │ UNIQUE     │ CHECK>0│
  └──────────────────────────┘        └──────┴──────────┴────────────┴────────┘
                                      ↑ column names       ↑ constraints
                                      ↑ data types

── Visual: Anatomy of a CREATE TABLE Statement ──
  CREATE TABLE employees (                         ← table name
    id        INT             PRIMARY KEY,          │
    name      VARCHAR(100)    NOT NULL,               ├── column definitions
    email     VARCHAR(255)    UNIQUE NOT NULL,       │   (name + type + constraints)
    salary    DECIMAL(10,2)   CHECK (salary > 0),   │
    dept_id   INT             REFERENCES departments(id),  ← FK reference
    hired     DATE            DEFAULT CURRENT_DATE   │
  );

── Data Types (Common) ──
| Type              | What It Stores              | Example                     | Use For                |
|-------------------|-----------------------------|-----------------------------|------------------------|
| INT / INTEGER     | Whole numbers               | id INT                      | IDs, counters, ages     |
| VARCHAR(n)        | Variable text (up to n)     | name VARCHAR(100)           | Names, descriptions     |
| CHAR(n)           | Fixed-length text           | code CHAR(3)                | Country codes, initials |
| DECIMAL(p,s)      | Exact decimal (p digits, s) | price DECIMAL(10,2)         | Money, precise values   |
| DATE              | Calendar date               | birth_date DATE             | Birthdays, events       |
| BOOLEAN           | True/false                  | is_active BOOLEAN           | Yes/no flags            |
| TEXT              | Unlimited text              | description TEXT            | Long paragraphs         |

── Constraint Reference ──
| Constraint     | Purpose                              | Column-level | Table-level  |
|----------------|--------------------------------------|:------------:|:------------:|
| NOT NULL       | Column CANNOT be empty               | ✅           | ❌           |
| UNIQUE         | All values must be DIFFERENT         | ✅           | ✅ (composite) |
| PRIMARY KEY    | Row identifier (NOT NULL + UNIQUE)   | ✅           | ✅ (composite) |
| FOREIGN KEY    | References a PK in another table     | ✅           | ✅           |
| CHECK          | Validates a boolean expression       | ✅           | ✅           |
| DEFAULT        | Fallback value if none provided      | ✅           | ❌           |

── Quick Tips for Beginners ──
- Every table should have a PRIMARY KEY (a way to uniquely identify each row)
- Use INT for IDs, VARCHAR for text, DECIMAL for money, DATE for dates
- NOT NULL means "this column CANNOT be left empty"
- DEFAULT means "if user doesn't provide a value, use this instead"
- FOREIGN KEY means "this value MUST exist in the parent table"
- You can write constraints on the SAME LINE as the column (column-level) or AFTER all columns (table-level for composite/combining multiple columns)
- FK with delete: FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
- Multiple FKs: a table can reference MANY different parent tables

── IF NOT EXISTS ──
Add IF NOT EXISTS to prevent errors when creating a table that already exists:
  CREATE TABLE IF NOT EXISTS employees (id INT PRIMARY KEY, name VARCHAR(100));
If employees already exists, the statement is silently ignored (no error).

── TEMPORARY TABLE ──
TEMPORARY (or TEMP) tables exist only for the current database session:
  CREATE TEMP TABLE temp_results (id INT, score INT);
Useful for intermediate results, caching, or staging data. They are automatically dropped when the session ends. Multiple sessions can have TEMP tables with the same name without conflict.

── DEFAULT with Functions ──
DEFAULT can use function calls, not just literal values:
  hired DATE DEFAULT CURRENT_DATE,           -- today's date
  created_at TEXT DEFAULT (datetime('now')),  -- current timestamp
  updated_at TEXT DEFAULT CURRENT_TIME       -- current time
Each new row gets the function's result at insertion time.

── Multi-Column Table-Level CHECK ──
Table-level CHECK can reference MULTIPLE columns:
  CREATE TABLE tasks (
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK (end_date > start_date)             -- compares two columns
  );
This ensures end_date is always after start_date — impossible with a column-level CHECK.

── ON UPDATE Behavior ──
Like ON DELETE, ON UPDATE controls what happens when a parent PK is updated:
  FOREIGN KEY (dept_id) REFERENCES departments(id) ON UPDATE CASCADE
- CASCADE: update child FKs to match the new parent PK value
- SET NULL: set child FK to NULL
- SET DEFAULT: set child FK to its default value
- NO ACTION: prevent the parent update if child rows exist`,
    syntax: `CREATE TABLE table_name (
  column1 data_type constraint,
  column2 data_type constraint,
  ...
  table_level_constraint
);

-- Column-level
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) DEFAULT 0
);

-- Table-level constraints
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- IF NOT EXISTS (no error if table already exists)
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- TEMPORARY TABLE (exists only for current session)
CREATE TEMP TABLE temp_log (
  event TEXT,
  logged_at DATE DEFAULT CURRENT_DATE
);

-- Table-level multi-column CHECK
CREATE TABLE tasks (
  id INT PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  CHECK (end_date > start_date)
);`,
    examples: [
      {
        title: 'Basic CREATE TABLE',
        sql: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  salary DECIMAL(10,2) DEFAULT 50000,
  status VARCHAR(20) DEFAULT 'active',
  city VARCHAR(50),
  email VARCHAR(100) UNIQUE
);`,
        explanation: 'Creates the employees table with an integer primary key, a required name, a default salary of 50k, and a unique email constraint.',
        cppRepresentation: `// Intuitive C++ representation of: CREATE TABLE employees (...)
struct Employee {
    int id;
    string name;
    string department;
    double salary;
    string status;
    string city;
    string email;
};
// The struct defines the shape — each row is an Employee object.
// Constraints would be enforced at insertion time via validation.`
      },
      {
        title: 'CREATE with composite PRIMARY KEY',
        sql: `CREATE TABLE enrollments (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  grade VARCHAR(2),
  PRIMARY KEY (student_id, course_id)
);`,
        explanation: 'The composite PRIMARY KEY on (student_id, course_id) ensures a student cannot enroll in the same course twice.',
        cppRepresentation: `// Intuitive C++ representation of: CREATE TABLE enrollments (...) with composite PK
struct Enrollment {
    int student_id;
    int course_id;
    string enrolled_date;
    string grade;
};
// Primary key constraint: no two rows with same (student_id, course_id)
// Enforced at insert time by checking for duplicates:
// for (int i = 0; i < enrollmentCount; i++)
//     if (enrollments[i].student_id == newRow.student_id
//         && enrollments[i].course_id == newRow.course_id)
//         reject("Duplicate primary key");`
      },
      {
        title: 'FOREIGN KEY with ON DELETE CASCADE',
        sql: `CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer VARCHAR(100) NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total DECIMAL(10,2),
  order_date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);`,
        explanation: 'The FOREIGN KEY links orders.product_id to products.id. ON DELETE CASCADE means deleting a product automatically deletes its orders.',
        sourceTables: ['products'],
        cppRepresentation: `// Intuitive C++ representation of: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
struct Order { int id; string customer; int product_id; int quantity; double total; string order_date; };
// When a product is deleted, cascade removes related orders:
void deleteProduct(int productId) {
    for (int i = 0; i < orderCount; i++)
        if (orders[i].product_id == productId)
            removeOrder(i--); // cascade delete
    removeProduct(productId);
}`
      },
      {
        title: 'CHECK constraint',
        sql: `CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) CHECK (price >= 0),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  CHECK (category IN ('Electronics', 'Clothing', 'Books', 'Stationery'))
);`,
        explanation: 'CHECK constraints validate data at insert/update time. Price and stock cannot be negative; category must be one of the four listed values.',
        cppRepresentation: `// Intuitive C++ representation of: CHECK constraints
struct Product { int id; string name; string category; double price; int stock; };
void insertProduct(Product p) {
    if (p.price < 0) throw "CHECK constraint: price must be >= 0";
    if (p.stock < 0) throw "CHECK constraint: stock must be >= 0";
    if (p.category != "Electronics" && p.category != "Clothing"
        && p.category != "Books" && p.category != "Stationery")
        throw "CHECK constraint: invalid category";
    products[productCount++] = p;
}`
      },
      {
        title: 'AUTOINCREMENT / auto-increment column',
        sql: `CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) CHECK (price >= 0),
  stock INT DEFAULT 0
);`,
        explanation: 'INTEGER PRIMARY KEY AUTOINCREMENT auto-increments the id column. In SQLite, INTEGER PRIMARY KEY creates a rowid alias that auto-increments; AUTOINCREMENT guarantees IDs never reuse values from deleted rows.',
        cppRepresentation: `// Intuitive C++ representation of: INTEGER PRIMARY KEY AUTOINCREMENT
struct Product { int id; string name; string category; double price; int stock; };
int nextId = 1;
Product createProduct(string name, string cat, double price, int stock) {
    Product p = {nextId++, name, cat, price, stock};
    return p;
}`
      },
      {
        title: 'All constraints combined',
        sql: `CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL DEFAULT 'General',
  salary DECIMAL(10,2) CHECK (salary >= 0),
  status VARCHAR(20) DEFAULT 'active',
  city VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  manager_id INT,
  CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) REFERENCES employees(id)
    ON DELETE SET NULL
);`,
        explanation: 'Combines AUTOINCREMENT, PRIMARY KEY, NOT NULL, DEFAULT, CHECK, UNIQUE, and a self-referencing FOREIGN KEY with ON DELETE SET NULL.',
        cppRepresentation: `// Intuitive C++ representation of: CREATE TABLE employees with all constraints
struct Employee {
    int id; string name; string department; double salary;
    string status; string city; string email; int manager_id;
};
// Each insert runs through validations:
void insertEmployee(Employee e) {
    if (e.name.empty()) throw "NOT NULL: name";
    if (e.salary < 0) throw "CHECK: salary >= 0";
    for (int i = 0; i < empCount; i++)
        if (employees[i].email == e.email) throw "UNIQUE: email";
    // FK: manager_id must reference existing employee or be NULL
    if (e.manager_id != 0 && !employeeExists(e.manager_id))
        throw "FK: manager does not exist";
    e.id = nextId++; employees[empCount++] = e;
}`
      },
      {
        title: 'IF NOT EXISTS and TEMPORARY TABLE',
        sql: `-- Create only if table doesn't exist yet
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2)
);

-- Temporary table for session-scoped data
CREATE TEMP TABLE sales_summary AS
SELECT category, COUNT(*) AS cnt, SUM(price) AS total
FROM products
GROUP BY category;`,
        explanation: 'IF NOT EXISTS silently skips creation if the table already exists (no error). TEMPORARY TABLE creates a session-scoped table that auto-drops when the connection closes — useful for intermediate results.',
        cppRepresentation: `// Intuitive C++ representation of: IF NOT EXISTS and TEMP TABLE
// IF NOT EXISTS: check before creating
if (!tableExists("products"))
    createProductsTable();

// TEMP TABLE: like a local variable scoped to a function
// Normal table = global variable (persists)
// Temp table  = local variable (gone after session)`
      },
      {
        title: 'DEFAULT with functions and multi-column CHECK',
        sql: `CREATE TABLE project_milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_name VARCHAR(200) NOT NULL,
  planned_start DATE NOT NULL DEFAULT CURRENT_DATE,
  planned_end DATE NOT NULL,
  actual_start DATE,
  actual_end DATE,
  status VARCHAR(20) DEFAULT 'planning',
  CHECK (planned_end > planned_start),
  CHECK (actual_end IS NULL OR actual_end >= actual_start),
  CHECK (status IN ('planning', 'active', 'completed', 'delayed'))
);`,
        explanation: 'DEFAULT CURRENT_DATE sets today\'s date automatically. The table-level CHECK constraints compare multiple columns: planned_end must be after planned_start, and if actual_end is provided it must be >= actual_start.',
        cppRepresentation: `// Intuitive C++ representation of: DEFAULT with functions + multi-column CHECK
struct Milestone {
    int id; string project; string planned_start; string planned_end;
    string actual_start; string actual_end; string status;
};
void insertMilestone(Milestone m) {
    if (m.planned_start.empty()) m.planned_start = today(); // DEFAULT
    if (m.planned_end <= m.planned_start) throw "CHECK: end > start";
    if (!m.actual_end.empty() && m.actual_end < m.actual_start)
        throw "CHECK: actual end >= actual start";
    if (m.status != "planning" && m.status != "active" /*...*/)
        throw "CHECK: invalid status";
    milestones[count++] = m;
}`
      }
    ],
    commonMistakes: [
      'Forgetting that VARCHAR needs a length: VARCHAR(255) not just VARCHAR',
      'Using TEXT for short strings (VARCHAR is more efficient for bounded lengths)',
      'Adding a FOREIGN KEY without an index on the referencing column (performance killer)',
      'Using ON DELETE CASCADE without understanding the ripple effect on child tables',
      'Forgetting NOT NULL on columns that are part of a PRIMARY KEY (PK already implies it)',
      'Using PostgreSQL IDENTITY syntax (GENERATED ALWAYS AS IDENTITY) in SQLite — use INTEGER PRIMARY KEY AUTOINCREMENT instead',
      'Forgetting IF NOT EXISTS when running scripts that may be re-run, causing errors on duplicate tables'
    ],
    practiceQuestions: [
      {
        question: `Table: products (new table)

Write a CREATE TABLE statement for the "products" table with: id (auto-increment PK), name (required, max 200 chars), category (optional), price (required, >= 0), stock (default 0, >= 0).

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use INTEGER PRIMARY KEY AUTOINCREMENT for id, VARCHAR(200) NOT NULL for name, CHECK constraints for price and stock.',
        solution: `CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INT DEFAULT 0 CHECK (stock >= 0)
);`
      },
      {
        question: `Write a CREATE TABLE statement for "order_items" with a composite primary key (order_id, product_id), quantity (NOT NULL, > 0), and FKs referencing orders(id) and products(id) with ON DELETE CASCADE.

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use PRIMARY KEY (order_id, product_id) as a table-level constraint. Add two FOREIGN KEY clauses referencing orders and products.',
        solution: `CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);`
      },
      {
        question: `Challenge: Create a "projects" table with: id (auto-increment PK), name (required, unique), budget (required, >= 1000), start_date (defaults to current date), name must be >= 3 chars.

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use INTEGER PRIMARY KEY AUTOINCREMENT, UNIQUE on name, DEFAULT CURRENT_DATE, and CHECK (LENGTH(name) >= 3).',
        solution: `CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL UNIQUE,
  budget DECIMAL(12,2) NOT NULL CHECK (budget >= 1000),
  start_date DATE DEFAULT CURRENT_DATE,
  CHECK (LENGTH(name) >= 3)
);`
      },
      {
        question: `Medium: Create a "course_enrollments" table with columns: enrollment_id (auto-increment PK), student_id (required), course_id (required), enrollment_date (defaults to current date), grade (optional, must be A/B/C/D/F). Add a composite UNIQUE constraint on (student_id, course_id) and FKs referencing students(id) and courses(id).

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use INTEGER PRIMARY KEY AUTOINCREMENT for enrollment_id. Use VARCHAR(1) CHECK (grade IN (\'A\',\'B\',\'C\',\'D\',\'F\')) for grade. Add FOREIGN KEY constraints and UNIQUE(student_id, course_id).',
        solution: `CREATE TABLE course_enrollments (
  enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  grade VARCHAR(1) CHECK (grade IN ('A','B','C','D','F')),
  UNIQUE (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);`
      }
    ]

  },
  {
    id: 'sql-keys',
    title: 'Keys in SQL — PK, FK, Unique, Composite & More',
    description: 'Understand all key types: super, candidate, primary, foreign, composite, surrogate, and natural keys',
    icon: '🔑',
    difficulty: 'intermediate',
    prerequisites: ['ddl-create', 'select'],
    topics: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'COMPOSITE KEY', 'SUPER KEY', 'CANDIDATE KEY', 'SURROGATE KEY', 'NATURAL KEY', 'ALTERNATE KEY'],
    explanation: `── What Is a Key? ──
A key is a column (or set of columns) that uniquely identifies a row in a table.
Keys enforce integrity and define relationships between tables.

── Key Types Hierarchy ──
Super Key → Candidate Key → Primary Key (chosen) + Alternate Keys (not chosen)
                    ↓
              Composite Key (if multiple columns)
                    ↓
           Foreign Key (references another table's PK)

── Key Types Reference ──
| Key Type       | Definition                                  | Unique? | NULL? | Count per Table |
|----------------|---------------------------------------------|:-------:|:-----:|:---------------:|
| Super Key      | Any set of columns that uniquely IDs a row  | ✅      | ✅    | Many            |
| Candidate Key  | Minimal super key (no unnecessary columns)  | ✅      | ❌    | Many            |
| Primary Key    | Chosen candidate key (row identifier)       | ✅      | ❌    | ONE             |
| Alternate Key  | Candidate key NOT chosen as PK              | ✅      | ❌    | Many            |
| Foreign Key    | References PK in another table              | ❌      | ✅    | Many            |
| Composite Key  | Key made of MULTIPLE columns                | ✅      | ❌    | Depends         |
| Surrogate Key  | Artificial key (auto-increment, UUID)       | ✅      | ❌    | Usually PK      |
| Natural Key    | Key from real-world data (SSN, email)       | ✅      | ❌    | Varies          |

── Primary Key Rules ──
- ONLY ONE per table
- Cannot be NULL (enforced automatically)
- Can be SINGLE column or COMPOSITE (multiple columns)
- A composite PK means the COMBINATION of values must be unique
- Every table SHOULD have a PK (best practice)

CREATE TABLE students (
  id INT PRIMARY KEY,                        -- single-column PK
  name VARCHAR(100) NOT NULL
);

CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id)        -- composite PK
);

── Foreign Key Rules ──
- References a PK (or UNIQUE) column in another table
- Can be NULL (if not declared NOT NULL)
- A table can have MULTIPLE FKs referencing different tables
- FK value MUST exist in the parent table's PK (or be NULL)
- ON DELETE / ON UPDATE: define what happens when parent row is deleted/updated

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id),   -- column-level FK
  product_id INT,
  FOREIGN KEY (product_id) REFERENCES products(id)  -- table-level FK
);

── Foreign Key Actions ──
| Action         | On Parent DELETE / UPDATE              |
|----------------|----------------------------------------|
| NO ACTION      | Prevent delete if child rows exist (default) |
| RESTRICT       | Same as NO ACTION (check immediate)    |
| CASCADE        | Delete/update child rows automatically |
| SET NULL       | Set FK to NULL in child rows           |
| SET DEFAULT    | Set FK to default value in child rows  |

── Surrogate vs Natural Keys ──
| Aspect         | Surrogate Key                        | Natural Key                         |
|----------------|--------------------------------------|-------------------------------------|
| Source         | System-generated (id, UUID)          | Real-world data (SSN, email, ISBN)  |
| Stability      | ✅ Never changes                     | ❌ Can change (person changes name) |
| Simplicity     | Single column, always INT or UUID    | May be composite, variable length   |
| Meaning        | Meaningless outside the DB           | Has real-world meaning              |
| Best for       | Primary Key (stable, simple)         | Alternate Key / Unique constraint   |

-- Surrogate PK (recommended)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE     -- natural key as alternate
);

── UNIQUE Constraint vs PRIMARY KEY ──
| Aspect        | PRIMARY KEY                  | UNIQUE                        |
|---------------|------------------------------|-------------------------------|
| NULLs allowed | ❌ No                        | ✅ Yes (one NULL in most DBs) |
| Count per table | ONE                       | Many                          |
| Purpose       | Row identifier               | Enforce data uniqueness       |
| FK target     | ✅ Can be referenced by FK   | ✅ Can be referenced by FK    |`,
    syntax: `-- Single-column Primary Key
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Composite Primary Key
CREATE TABLE course_enrollments (
  student_id INT,
  course_id INT,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Surrogate PK + Natural Key as UNIQUE
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku VARCHAR(50) NOT NULL UNIQUE,       -- natural key
  name VARCHAR(200) NOT NULL,
  category_id INT REFERENCES categories(id)
);

-- FK with CASCADE
CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity > 0)
);

-- Multiple FKs referencing different tables
CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  user_id INT REFERENCES users(id),
  rating INT CHECK (rating BETWEEN 1 AND 5)
);`,
    examples: [
      {
        title: 'Primary Key + Foreign Key relationship',
        sql: `CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id),
  total DECIMAL(10,2) NOT NULL,
  order_date DATE DEFAULT CURRENT_DATE
);

-- Insert customers
INSERT INTO customers VALUES (1, 'Alice', 'alice@email.com');
INSERT INTO customers VALUES (2, 'Bob', 'bob@email.com');

-- Insert orders (FK links to customers)
INSERT INTO orders VALUES (101, 1, 250.00, '2024-01-15');
INSERT INTO orders VALUES (102, 1, 100.00, '2024-02-01');
INSERT INTO orders VALUES (103, 2, 75.50, '2024-01-20');

-- This fails: no customer with id=99
-- INSERT INTO orders VALUES (104, 99, 50.00, '2024-03-01');
-- ERROR: insert or update violates foreign key constraint`,
        explanation: 'customers.id is the PRIMARY KEY. orders.customer_id is a FOREIGN KEY referencing customers.id. Every order must belong to an existing customer — referential integrity enforced.',
        sourceTables: [],
        cppRepresentation: `// Intuitive C++ representation of: PK + FK relationship
struct Customer { int id; string name; string email; };
struct Order { int id; int customer_id; double total; string date; };

Customer customers[] = {{1, "Alice", "alice@email.com"}, {2, "Bob", "bob@email.com"}};
Order orders[] = {{101, 1, 250.00, "2024-01-15"}, {102, 1, 100.00, "2024-02-01"}, {103, 2, 75.50, "2024-01-20"}};

// FK constraint check: every order must reference a valid customer
for (int i = 0; i < 3; i++) {
    bool found = false;
    for (int j = 0; j < 2; j++) {
        if (orders[i].customer_id == customers[j].id) { found = true; break; }
    }
    if (!found) cout << "FK violation! Order " << orders[i].id << " has no customer.\\n";
}

// Join: orders with customer info
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 2; j++) {
        if (orders[i].customer_id == customers[j].id)
            cout << orders[i].id << " | " << customers[j].name << " | $" << orders[i].total << "\\n";
    }
}`
      },
      {
        title: 'Composite Primary Key',
        sql: `-- Each student can enroll in many courses
-- Each course can have many students
-- A student can only enroll ONCE in a given course
CREATE TABLE enrollments (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  grade CHAR(2),
  semester VARCHAR(20),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Valid inserts
INSERT INTO enrollments VALUES (1, 101, 'A', '2024 Fall');
INSERT INTO enrollments VALUES (1, 102, 'B+', '2024 Fall');
INSERT INTO enrollments VALUES (2, 101, 'A-', '2024 Fall');

-- This fails: student 1 already enrolled in course 101
-- INSERT INTO enrollments VALUES (1, 101, 'C', '2024 Fall');
-- ERROR: duplicate key violates primary key constraint`,
        explanation: 'The composite PK (student_id, course_id) ensures a student cannot enroll in the same course twice. Each pair must be unique. Both columns together form the row identifier.',
        sourceTables: [],
        cppRepresentation: `// Intuitive C++ representation of: composite PK constraint
struct Enrollment { int student_id; int course_id; string grade; string semester; };
Enrollment enrollments[] = {{1, 101, "A", "2024 Fall"}, {1, 102, "B+", "2024 Fall"}, {2, 101, "A-", "2024 Fall"}};

// Composite PK uniqueness check: no duplicate (student_id, course_id) pairs
for (int i = 0; i < 3; i++) {
    for (int j = i + 1; j < 3; j++) {
        if (enrollments[i].student_id == enrollments[j].student_id
            && enrollments[i].course_id == enrollments[j].course_id)
            cout << "Duplicate key violation! (" << enrollments[i].student_id
                 << ", " << enrollments[i].course_id << ")\\n";
    }
}`
      },
      {
        title: 'ON DELETE CASCADE — automatic cleanup',
        sql: `-- When a customer is deleted, their orders are deleted too
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total DECIMAL(10,2)
);

INSERT INTO customers VALUES (1, 'Alice');
INSERT INTO orders VALUES (1, 1, 100.00);
INSERT INTO orders VALUES (2, 1, 50.00);

-- Delete Alice → both orders are automatically deleted
DELETE FROM customers WHERE id = 1;

-- orders table is now empty
SELECT * FROM orders;  -- 0 rows`,
        explanation: 'ON DELETE CASCADE propagates the DELETE from parent to child. When customer 1 is deleted, both orders referencing customer_id = 1 are automatically removed. No manual cleanup needed.',
        sourceTables: [],
        cppRepresentation: `// Intuitive C++ representation of: ON DELETE CASCADE
struct Customer { int id; string name; };
struct Order { int id; int customer_id; double total; };

Customer customers[] = {{1, "Alice"}};
Order orders[] = {{1, 1, 100.00}, {2, 1, 50.00}};

// Delete customer with id=1 AND cascade to orders
int deleteId = 1;

// Remove customer
customerCount = 0;  // or remove specific element

// Cascade: remove all orders referencing customer_id = deleteId
int newOrderCount = 0;
for (int i = 0; i < 2; i++) {
    if (orders[i].customer_id != deleteId)
        orders[newOrderCount++] = orders[i];
}
// newOrderCount == 0 → all orders deleted with the customer`
      },
      {
        title: 'Surrogate vs Natural Key in practice',
        sql: `-- Design A: Natural key as PK (fragile)
CREATE TABLE books_natural (
  isbn VARCHAR(13) PRIMARY KEY,         -- ISBN can change? Rare, but possible
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100)
);
-- Problem: ISBN is long, joins are slower, and ISBN format can vary

-- Design B: Surrogate key + Natural key as UNIQUE (robust)
CREATE TABLE books_surrogate (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn VARCHAR(13) NOT NULL UNIQUE,      -- natural key as alternate
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100)
);
-- Benefit: short INT PK for joins, ISBN stays unique but can be changed

-- Joining on INT is faster than VARCHAR
SELECT b.title, o.quantity
FROM books_surrogate b
JOIN order_items o ON b.id = o.book_id;  -- INT join = fast`,
        explanation: 'Surrogate keys (auto-increment INT) are better for PK because they are small, stable, and meaningless. Natural keys (ISBN, SSN, email) should be enforced as UNIQUE but used as alternate keys, not PK.',
        sourceTables: [],
        cppRepresentation: `// Intuitive C++ representation of: surrogate vs natural key comparison
// Natural key as PK: string comparison (slow)
struct BookNatural { string isbn; string title; string author; };
for (int i = 0; i < orderCount; i++)
    for (int j = 0; j < bookCount; j++)
        if (orders[i].isbn == booksNatural[j].isbn)  // string compare = slow
            // ...

// Surrogate key as PK: int comparison (fast)
struct BookSurrogate { int id; string isbn; string title; string author; };
for (int i = 0; i < orderCount; i++)
    for (int j = 0; j < bookCount; j++)
        if (orders[i].book_id == booksSurrogate[j].id)  // int compare = fast
            // ...`
      }
    ],
    commonMistakes: [
      'Using a natural key (email, SSN, username) as PK — these can change or be reused. Always use a surrogate INT/UUID PK.',
      'Forgetting that a composite PK means the COMBINATION must be unique, not each individual column.',
      'Omitting ON DELETE CASCADE and then manually deleting related rows (use CASCADE or handle in application code).',
      'Declaring a FK column as nullable when it should be NOT NULL (e.g., every order MUST have a customer).',
      'Creating multiple PRIMARY KEYs on one table (only one PK allowed — use UNIQUE for additional unique columns).',
      'Using VARCHAR columns as PKs — joins on INT are significantly faster than joins on strings.',
      'Not naming FK constraints — makes ALTER TABLE and troubleshooting much harder.'
    ],
    practiceQuestions: [
      {
        question: `Design a "library" schema with two tables: "members" (id, name, email) and "loans" (id, member_id, book_id, loan_date, return_date). Define PKs, FKs, and UNIQUE on email.

Return columns: (DDL statements — no columns returned)
Order by: N/A (DDL).`,
        hint: 'members: id INT PK, email VARCHAR UNIQUE NOT NULL. loans: id INT PK, member_id INT FK → members(id), book_id INT NOT NULL FK → books(id).',
        solution: `CREATE TABLE members (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE loans (
  id INT PRIMARY KEY,
  member_id INT NOT NULL REFERENCES members(id),
  book_id INT NOT NULL REFERENCES books(id),
  loan_date DATE DEFAULT CURRENT_DATE,
  return_date DATE
);`
      },
      {
        question: `Explain the difference in behavior when deleting a parent row with ON DELETE CASCADE vs ON DELETE SET NULL vs default (NO ACTION). Which one deletes child rows automatically?

Return columns: (explanatory — no columns returned)
Order by: N/A.`,
        hint: 'CASCADE deletes children, SET NULL sets FK to NULL, NO ACTION prevents the delete if children exist.',
        solution: `-- CASCADE: Deleting a customer also deletes ALL their orders
DELETE FROM customers WHERE id = 1;
-- Child rows in orders with customer_id = 1 are AUTOMATICALLY deleted

-- SET NULL: Deleting a customer sets the FK to NULL in their orders
DELETE FROM customers WHERE id = 1;
-- orders.customer_id becomes NULL for all orders referencing customer 1

-- NO ACTION (default): Deleting a customer FAILS if they have orders
DELETE FROM customers WHERE id = 1;
-- ERROR: update or delete on "customers" violates foreign key constraint

-- CASCADE is the only one that DELETES child rows automatically.`
      },
      {
        question: `Design a table for "product_tags" where each product can have many tags and each tag can belong to many products (many-to-many). Use a composite PK to prevent duplicate tag assignments.

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'product_tags(product_id, tag_id) as composite PK, plus two FKs referencing products(id) and tags(id).',
        solution: `CREATE TABLE product_tags (
  product_id INT NOT NULL REFERENCES products(id),
  tag_id INT NOT NULL REFERENCES tags(id),
  PRIMARY KEY (product_id, tag_id)
);

-- This works: different tags for same product
INSERT INTO product_tags VALUES (1, 1);  -- product 1, tag 'sale'
INSERT INTO product_tags VALUES (1, 2);  -- product 1, tag 'new'

-- This fails: same product + same tag again
-- INSERT INTO product_tags VALUES (1, 1);
-- ERROR: duplicate key violates primary key constraint`
      },
      {
        question: `Medium: Design a "suppliers" table with a surrogate PK (supplier_id, auto-increment) and a natural key (supplier_code, unique). Include name, contact_email, phone, and a FK to a "countries" table (country_id). Explain which key type is the PK.

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use INTEGER PRIMARY KEY AUTOINCREMENT for the surrogate PK. Add UNIQUE(supplier_code) for the natural key. The surrogate key (supplier_id) is the PK since it\'s artificial and stable.',
        solution: `CREATE TABLE suppliers (
  supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(255),
  phone VARCHAR(20),
  country_id INT NOT NULL REFERENCES countries(id)
);`
      }
    ]
  },
  {
    id: 'dml-crud',
    title: 'DML — INSERT, UPDATE, DELETE',
    description: 'Modify table data with INSERT, UPDATE, and DELETE statements',
    icon: '✏️',
    difficulty: 'beginner',
    prerequisites: ['select', 'ddl-create', 'sql-keys'],
    topics: ['INSERT', 'multi-row INSERT', 'INSERT with DEFAULT', 'INSERT INTO SELECT', 'INSERT OR REPLACE', 'UPDATE', 'UPDATE with CASE', 'DELETE', 'DELETE with subquery', 'TRUNCATE vs DELETE vs DROP'],
    explanation: `── Real-World Analogy ──
DML is how you CHANGE the data in your tables. Think of a table like a whiteboard:
- INSERT = writing NEW entries on the board
- UPDATE = ERASING and rewriting existing entries
- DELETE = ERASING entries entirely
- SELECT = READING what's on the board (the "R" in CRUD)

── Visual: How DML Changes Table State ──
  Initial table "employees":        After INSERT ... VALUES ('Diana', 60K):
  ┌──────┬────────┐                 ┌──────┬────────┐
  │ name │ salary │                 │ name │ salary │
  ├──────┼────────┤                 ├──────┼────────┤
  │ Alice│ 100K   │                 │ Alice│ 100K   │
  │ Bob  │ 80K    │  ──► INSERT ──► │ Bob  │ 80K    │
  │ Carol│ 70K    │                 │ Carol│ 70K    │
  └──────┴────────┘                 │ Diana│ 60K    │  ← NEW row added
                                    └──────┴────────┘

  After UPDATE SET salary = salary * 1.1    After DELETE WHERE name = 'Bob':
       WHERE name = 'Bob':                  ┌──────┬────────┐
  ┌──────┬────────┐                        │ name │ salary │
  │ name │ salary │                        ├──────┼────────┤
  ├──────┼────────┤                        │ Alice│ 100K   │
  │ Alice│ 100K   │  ← unchanged           │ Carol│ 77K    │  ← 70K * 1.1
  │ Bob  │ 88K    │  ← 80K → 88K (MODIFIED)│ Diana│ 60K    │
  │ Carol│ 77K    │  ← 70K → 77K           └──────┴────────┘
  │ Diana│ 60K    │  ← unchanged                      Bob REMOVED
  └──────┴────────┘

── DML Operations ──
| Operation | SQL Keyword | What It Does                     | WHERE Clause? |
|-----------|-------------|----------------------------------|:-------------:|
| Create    | INSERT      | Adds new rows (list or subquery) | ❌ N/A        |
| Read      | SELECT      | Retrieves rows (technically DQL) | ✅ Optional   |
| Update    | UPDATE      | Modifies existing rows           | ⚠ REQUIRED!  |
| Delete    | DELETE      | Removes existing rows            | ⚠ REQUIRED!  |

── INSERT Variants ──
INSERT INTO table VALUES (val1, val2);              -- ALL columns (by position)
INSERT INTO table (col1, col2) VALUES (val1, val2); -- named columns (SAFER)
INSERT INTO table (col1) SELECT col1 FROM other;    -- copy from another table

── Multi-Row INSERT ──
Insert MULTIPLE rows in a single statement (faster than separate INSERTs):
  INSERT INTO employees (id, name, dept)
  VALUES (1, 'Alice', 'Engineering'),
         (2, 'Bob', 'Marketing'),
         (3, 'Carol', 'Sales');
Each row is enclosed in (...) and separated by commas.

── INSERT with DEFAULT ──
Use the DEFAULT keyword to explicitly use a column's default value:
  INSERT INTO employees (id, name, status)
  VALUES (4, 'Dave', DEFAULT);   -- status gets its DEFAULT value (e.g., 'active')
You can also omit the column entirely (same effect if a DEFAULT exists).

── INSERT OR REPLACE / INSERT OR IGNORE (SQLite) ──
SQLite-specific upsert behavior:
  INSERT OR REPLACE INTO products (id, name, price)
  VALUES (1, 'Laptop Pro', 1199.99);
  -- If id=1 exists, REPLACE it (DELETE + INSERT). If not, INSERT.
  INSERT OR IGNORE INTO products (id, name, price)
  VALUES (99, 'Old Product', 9.99);
  -- If id=99 exists, silently skip. If not, INSERT.
- OR REPLACE = upsert (insert or update)
- OR IGNORE = skip on conflict (no error)

── UPDATE with CASE ──
Use CASE inside SET for conditional updates:
  UPDATE employees
  SET salary = CASE
    WHEN department = 'Engineering' THEN salary * 1.15
    WHEN department = 'Sales' THEN salary * 1.10
    ELSE salary * 1.05
  END;
Different departments get different raise percentages in ONE statement.

── DELETE with Subquery ──
DELETE can use a subquery in WHERE to target rows based on another table:
  DELETE FROM products
  WHERE id IN (
    SELECT product_id
    FROM order_items
    GROUP BY product_id
    HAVING SUM(quantity) < 5
  );
Deletes products that have sold fewer than 5 total units.

── UPDATE Rules ──
- WITHOUT WHERE → updates EVERY row (DANGEROUS! Always double-check)
- SET can include math: SET salary = salary * 1.1 (10% raise for everyone)
- Can combine columns: SET full_name = first_name || ' ' || last_name

── DELETE Rules ──
- WITHOUT WHERE → deletes EVERY row (DANGEROUS! The table becomes empty)
- DELETE does NOT reset auto-increment counters
- DELETE fires triggers, TRUNCATE does not

── DELETE vs TRUNCATE vs DROP ──
| Operation | Removes   | Structure? | Can WHERE? | Triggers? | Rollback?  | Resets ID? |
|-----------|-----------|:----------:|:----------:|:---------:|:----------:|:----------:|
| DELETE    | Rows only | ✅ Kept   | ✅ Yes    | ✅ Fires | ✅ Yes    | ❌ No      |
| TRUNCATE  | Rows only | ✅ Kept   | ❌ No     | ❌ No    | ⚠ Depends | ✅ Yes     |
| DROP      | Everything| ❌ Gone   | ❌ No     | ❌ No    | ⚠ Depends | N/A        |

── Golden Rules ──
- ALWAYS test UPDATE/DELETE with SELECT first: SELECT * FROM employees WHERE ... (see what matches)
- Use transactions for safety: BEGIN; UPDATE ... ; ROLLBACK; (undo if mistake)
- INSERT INTO SELECT is the fastest way to copy rows between tables`,
    syntax: `-- INSERT all columns (values in column order)
INSERT INTO table_name
VALUES (val1, val2, val3);

-- INSERT named columns
INSERT INTO table_name (col1, col2)
VALUES (val1, val2);

-- INSERT from SELECT
INSERT INTO table_name (col1, col2)
SELECT col1, col2 FROM other_table;

-- Multi-row INSERT
INSERT INTO table_name (col1, col2)
VALUES (val1, val2),
       (val3, val4),
       (val5, val6);

-- INSERT with DEFAULT keyword
INSERT INTO table_name (col1, col2, col3)
VALUES (val1, DEFAULT, val3);

-- INSERT OR REPLACE (SQLite upsert)
INSERT OR REPLACE INTO table_name (id, col1)
VALUES (1, 'value');

-- UPDATE
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- UPDATE with CASE
UPDATE table_name
SET column1 = CASE
  WHEN condition1 THEN value1
  WHEN condition2 THEN value2
  ELSE default_value
  END;

-- DELETE
DELETE FROM table_name
WHERE condition;

-- DELETE with subquery
DELETE FROM table_name
WHERE id IN (SELECT id FROM other_table WHERE condition);`,
    examples: [
      {
        title: 'INSERT — all columns (positional)',
        sql: `INSERT INTO employees
VALUES (1, 'Alice', 'Engineering', 95000, 'active', 'New York', 'alice@company.com');`,
        explanation: 'Inserts a row by providing values for ALL columns in the exact order they were defined. Fragile — if the table structure changes, this breaks.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: INSERT INTO employees VALUES (...)
struct Employee { int id; string name; string department; double salary; string status; string city; string email; };
Employee alice = {1, "Alice", "Engineering", 95000, "active", "New York", "alice@company.com"};
employees[employeeCount++] = alice;`
      },
      {
        title: 'INSERT — named columns',
        sql: `INSERT INTO employees (id, name, department, salary, city)
VALUES (2, 'Bob', 'Marketing', 72000, 'San Francisco');`,
        explanation: 'Inserts a row by specifying only the columns you want. Missing columns use their DEFAULT values (or NULL if no default). More robust than positional INSERT.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: INSERT INTO employees (id, name, department, salary, city) VALUES (...)
Employee bob = {2, "Bob", "Marketing", 72000, "active", "San Francisco", ""};
// status defaults to 'active', email defaults to empty string
employees[employeeCount++] = bob;`
      },
      {
        title: 'INSERT INTO SELECT',
        sql: `INSERT INTO employees (id, name, department, salary, city, status)
SELECT id + 100, name, 'Engineering', 65000, city, 'inactive'
FROM employees
WHERE department = 'Marketing';`,
        explanation: 'Copies Marketing employees into new Engineering rows with adjusted data. INSERT INTO SELECT is powerful for bulk data duplication and transformation.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: INSERT INTO employees SELECT ... FROM employees WHERE department = 'Marketing'
Employee newRows[100];
int newCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Marketing") {
        Employee e = {employees[i].id + 100, employees[i].name, "Engineering", 65000, "inactive", employees[i].city, ""};
        newRows[newCount++] = e;
    }
}
for (int i = 0; i < newCount; i++)
    employees[employeeCount++] = newRows[i];`
      },
      {
        title: 'UPDATE with WHERE',
        sql: `UPDATE employees
SET salary = salary * 1.10,
    status = 'active'
WHERE department = 'Engineering';`,
        explanation: 'Gives a 10% raise to all Engineering employees and sets their status to active. The WHERE clause restricts which rows are affected.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: UPDATE employees SET salary = salary * 1.10, status = 'active' WHERE department = 'Engineering'
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering") {
        employees[i].salary *= 1.10;
        employees[i].status = "active";
    }
}`
      },
      {
        title: 'UPDATE without WHERE (all rows)',
        sql: `UPDATE employees
SET status = 'active';`,
        explanation: 'Updates EVERY row in the table. Without a WHERE clause, the SET clause applies to all rows. Use with extreme caution — there is no undo in production.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: UPDATE employees SET status = 'active' (no WHERE)
for (int i = 0; i < employeeCount; i++)
    employees[i].status = "active";`
      },
      {
        title: 'DELETE with and without WHERE',
        sql: `-- Delete specific rows
DELETE FROM employees
WHERE status = 'inactive' AND salary < 50000;

-- Delete all rows
DELETE FROM employees;`,
        explanation: 'The first statement deletes only inactive employees earning under $50k. The second deletes EVERY row but keeps the table structure (DDL is preserved). TRUNCATE is faster for deleting all rows.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: DELETE FROM employees WHERE status = 'inactive' AND salary < 50000
int writePos = 0;
for (int i = 0; i < employeeCount; i++) {
    if (!(employees[i].status == "inactive" && employees[i].salary < 50000))
        employees[writePos++] = employees[i];
}
employeeCount = writePos;

// DELETE FROM employees (no WHERE):
// employeeCount = 0;`
      },
      {
        title: 'Multi-row INSERT',
        sql: `INSERT INTO employees (id, name, department, salary, status, city, email)
VALUES (11, 'Iris Chen', 'Engineering', 87000, 'active', 'Austin', 'iris@company.com'),
       (12, 'Jake Rivera', 'Sales', 63000, 'active', 'Denver', 'jake@company.com'),
       (13, 'Kara Singh', 'Marketing', 71000, 'active', 'Portland', 'kara@company.com');`,
        explanation: 'Inserts three employees in a single atomic statement. Multi-row INSERT is faster than separate INSERTs and guarantees all rows are added or none (transactional).',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: multi-row INSERT
Employee newEmps[] = {
    {11, "Iris Chen", "Engineering", 87000, "active", "Austin", "iris@company.com"},
    {12, "Jake Rivera", "Sales", 63000, "active", "Denver", "jake@company.com"},
    {13, "Kara Singh", "Marketing", 71000, "active", "Portland", "kara@company.com"}
};
for (int i = 0; i < 3; i++)
    employees[employeeCount++] = newEmps[i];`
      },
      {
        title: 'UPDATE with CASE and DELETE with subquery',
        sql: `-- Give raises based on department (CASE)
UPDATE employees
SET salary = CASE
  WHEN department = 'Engineering' THEN salary * 1.15
  WHEN department = 'Sales' THEN salary * 1.10
  ELSE salary * 1.05
END;

-- Delete products with low sales (subquery)
DELETE FROM products
WHERE id IN (
  SELECT product_id
  FROM order_items
  GROUP BY product_id
  HAVING SUM(quantity) < 3
);`,
        explanation: 'The CASE expression gives different raise percentages per department in a single UPDATE. Then, a subquery finds products with fewer than 3 total units sold and deletes them from products.',
        sourceTables: ['employees', 'products', 'order_items'],
        cppRepresentation: `// Intuitive C++ representation of: UPDATE with CASE
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering")
        employees[i].salary *= 1.15;
    else if (employees[i].department == "Sales")
        employees[i].salary *= 1.10;
    else
        employees[i].salary *= 1.05;
}
// DELETE with subquery:
int soldLow[100], lowCount = 0;
// First subquery: find products with low sales
for (int i = 0; i < orderItemCount; i++)
    soldLow[orderItems[i].product_id] += orderItems[i].quantity;
for (int i = 0; i < productCount; i++)
    if (soldLow[products[i].id] < 3)
        markForDeletion(i);
// Delete marked products...`
      }
    ],
    commonMistakes: [
      'Forgetting the WHERE clause in UPDATE/DELETE (modifies/removes ALL rows)',
      'Using INSERT with positional VALUES that don\'t match the column order',
      'Assuming INSERT INTO SELECT preserves source data order (no ORDER BY needed)',
      'Confusing TRUNCATE with DELETE: TRUNCATE cannot use WHERE, resets identity, is DDL not DML',
      'Using separate INSERT statements instead of multi-row INSERT (slower, more verbose)',
      'Forgetting commas between rows in multi-row INSERT (easy syntax error)'
    ],
    practiceQuestions: [
      {
        question: `Table: products

Insert a new product with: id=10, name="Wireless Mouse", category="Electronics", price=29.99, stock=150.

Return columns: (DML statement — no columns returned)
Order by: N/A (DML).`,
        hint: 'Use INSERT INTO products (columns) VALUES (values). All columns are id, name, category, price, stock.',
        solution: `INSERT INTO products (id, name, category, price, stock)
VALUES (10, 'Wireless Mouse', 'Electronics', 29.99, 150);`
      },
      {
        question: `Table: employees

Give all Marketing employees a 5% raise and update their city to "Chicago".

Return columns: (DML statement — no columns returned)
Order by: N/A (DML).`,
        hint: 'Use UPDATE with SET salary = salary * 1.05, city = \'Chicago\' and a WHERE department = \'Marketing\' filter.',
        solution: `UPDATE employees
SET salary = salary * 1.05,
    city = 'Chicago'
WHERE department = 'Marketing';`
      },
      {
        question: `Table: employees

Medium: Insert three new employees in a single statement, then delete all employees in the 'HR' department.

New employees (in order):
  (11, 'Nancy Adams', 'nancy@company.com', NULL, 58000, 'Engineering', 1, 1, '2024-06-01', 'Boston'),
  (12, 'Oscar Lee', 'oscar@company.com', '555-1012', 74000, 'Marketing', 3, 3, '2024-06-15', 'Chicago'),
  (13, 'Patricia Wu', 'patricia@company.com', NULL, 92000, 'Engineering', 1, 1, '2024-07-01', 'New York')

Return columns: (DML statements — no columns returned)
Order by: N/A (DML).`,
        hint: 'Use multi-row INSERT: INSERT INTO employees (columns) VALUES (...), (...), (...). Then DELETE FROM employees WHERE department = \'HR\'.',
        solution: `INSERT INTO employees (id, name, email, phone, salary, department, department_id, manager_id, hire_date, city)
VALUES (11, 'Nancy Adams', 'nancy@company.com', NULL, 58000, 'Engineering', 1, 1, '2024-06-01', 'Boston'),
       (12, 'Oscar Lee', 'oscar@company.com', '555-1012', 74000, 'Marketing', 3, 3, '2024-06-15', 'Chicago'),
       (13, 'Patricia Wu', 'patricia@company.com', NULL, 92000, 'Engineering', 1, 1, '2024-07-01', 'New York');

DELETE FROM employees
WHERE department = 'HR';`
      },
      {
        question: `Table: products

Medium: Create a "product_backup" table using CREATE TABLE ... AS to copy all products that cost more than $50, including all their columns.

Return columns: (DML statements — no columns returned)
Order by: N/A (DML).`,
        hint: 'Use CREATE TABLE product_backup AS SELECT * FROM products WHERE price > 50. This creates and populates the table in one statement.',
        solution: `CREATE TABLE product_backup AS
SELECT * FROM products
WHERE price > 50;`
      }
    ]
  },
  {
    id: 'alter-drop',
    title: 'ALTER TABLE & DROP Operations',
    description: 'Modify table structure with ALTER TABLE and remove objects with DROP',
    icon: '🔧',
    difficulty: 'intermediate',
    prerequisites: ['ddl-create', 'dml-crud'],
    topics: ['ALTER TABLE', 'ADD COLUMN', 'DROP COLUMN', 'ALTER COLUMN', 'ADD CONSTRAINT', 'DROP CONSTRAINT', 'DROP TABLE', 'TRUNCATE TABLE'],
    explanation: `── Real-World Analogy ──
ALTER TABLE is like renovating a house AFTER it's already built:
- ADD COLUMN = adding a new room (the old rooms still exist)
- DROP COLUMN = demolishing a room (everything inside is lost)
- ALTER TYPE = changing a room's purpose (bedroom → office)
- ADD CONSTRAINT = installing rules (door must be locked)

CREATE builds the house from scratch. ALTER modifies the existing house. DROP destroys the house.

── Visual: How ALTER Changes a Table ──
  Original table "employees":           After ADD COLUMN phone:
  ┌──────┬────────┬────────┐           ┌──────┬────────┬────────┬─────────────┐
  │ id   │ name   │ salary │           │ id   │ name   │ salary │ phone       │
  ├──────┼────────┼────────┤           ├──────┼────────┼────────┼─────────────┤
  │ 1    │ Alice  │ 100K   │  ──►      │ 1    │ Alice  │ 100K   │ NULL        │  ← new column
  │ 2    │ Bob    │ 80K    │           │ 2    │ Bob    │ 80K    │ NULL        │  (NULL by default)
  └──────┴────────┴────────┘           └──────┴────────┴────────┴─────────────┘

  Original: 3 columns                    New: 4 columns (old data preserved!)
  
  After ALTER COLUMN salary TYPE INT:    After DROP COLUMN phone:
  ┌──────┬────────┬────────┐            ┌──────┬────────┬────────┐
  │ id   │ name   │ salary │            │ id   │ name   │ salary │
  ├──────┼────────┼────────┤            ├──────┼────────┼────────┤
  │ 1    │ Alice  │ 100000 │  ← was 100K│ 1    │ Alice  │ 100000 │  ← phone column GONE
  │ 2    │ Bob    │ 80000  │  ← was 80K │ 2    │ Bob    │ 80000  │
  └──────┴────────┴────────┘            └──────┴────────┴────────┘

── ALTER TABLE Operations ──
| Operation         | SQL Syntax                                          | What It Does                         |
|-------------------|-----------------------------------------------------|--------------------------------------|
| ADD COLUMN        | ALTER TABLE t ADD COLUMN c type constraint          | Adds a new column (NULL in existing rows) |
| DROP COLUMN       | ALTER TABLE t DROP COLUMN c                         | Removes an existing column (data lost!) |
| ALTER TYPE        | ALTER TABLE t ALTER COLUMN c TYPE new_type          | Changes column data type             |
| SET DEFAULT       | ALTER TABLE t ALTER COLUMN c SET DEFAULT value      | Sets a default for NEW rows          |
| DROP DEFAULT      | ALTER TABLE t ALTER COLUMN c DROP DEFAULT           | Removes the default                  |
| SET NOT NULL      | ALTER TABLE t ALTER COLUMN c SET NOT NULL           | Makes column required (fails if NULLs exist) |
| DROP NOT NULL     | ALTER TABLE t ALTER COLUMN c DROP NOT NULL          | Makes column optional                |
| RENAME COLUMN     | ALTER TABLE t RENAME COLUMN old TO new              | Renames a column                     |
| ADD CONSTRAINT    | ALTER TABLE t ADD CONSTRAINT name PRIMARY KEY (c)   | Adds a constraint                    |
| DROP CONSTRAINT   | ALTER TABLE t DROP CONSTRAINT name                  | Removes a constraint by name         |

── ALTER TABLE Caveats ──
- Adding NOT NULL: fails if existing rows already have NULLs in that column
- Changing type: fails if existing data can't be converted (e.g., 'abc' → INT)
- Dropping column: also removes any indexes, FKs, or views referencing it
- Adding FK: fails if existing rows violate the reference
- CONSTRAINT names must be UNIQUE within the schema (name your constraints!)

── ALTER vs CREATE vs DROP vs TRUNCATE ──
| Command       | What Changes                       | Data Preserved? | Can Undo?     |
|---------------|------------------------------------|:---------------:|:-------------:|
| CREATE TABLE  | Creates structure from scratch     | N/A (new)       | N/A           |
| ALTER TABLE   | Modifies existing structure        | ✅ Yes          | ⚠ Usually not |
| TRUNCATE      | Removes all rows (keeps structure) | ❌ No           | ⚠ Rarely      |
| DROP TABLE    | Removes structure + all data       | ❌ No           | ❌ No         |

── Pro Tip: Name Your Constraints ──
Without a name, the DB generates something ugly like "employees_salary_check_123abc".
With a name, you can easily DROP or modify it later:
  CREATE TABLE t (id INT CONSTRAINT pk_t_id PRIMARY KEY);
  -- Later: ALTER TABLE t DROP CONSTRAINT pk_t_id;  -- easy!`,
    syntax: `-- Add a column
ALTER TABLE table_name
ADD COLUMN column_name data_type constraint;

-- Drop a column
ALTER TABLE table_name
DROP COLUMN column_name;

-- Alter column type
ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_data_type;

-- Add a constraint
ALTER TABLE table_name
ADD CONSTRAINT constraint_name constraint_type (column);

-- Drop a constraint
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;

-- Drop table
DROP TABLE table_name;

-- Truncate table
TRUNCATE TABLE table_name;`,
    examples: [
      {
        title: 'ADD and DROP columns',
        sql: `-- Add a new column
ALTER TABLE employees
ADD COLUMN phone VARCHAR(20);

-- Add a column with a default
ALTER TABLE employees
ADD COLUMN bonus DECIMAL(10,2) DEFAULT 0;

-- Drop a column
ALTER TABLE employees
DROP COLUMN phone;`,
        explanation: 'ADD COLUMN adds a new column (NULL allowed unless NOT NULL specified). The bonus column gets a default of 0. DROP COLUMN removes the phone column permanently.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: ALTER TABLE employees ADD/DROP COLUMN
// Before: struct Employee { int id; string name; ... };
// ADD COLUMN phone: add a field to the struct
struct EmployeeV2 {
    int id; string name; string department; double salary;
    string status; string city; string email; string phone;
};
// DROP COLUMN phone: revert to original struct (lossy — data is gone)
// Existing rows must be migrated to the new struct shape.`
      },
      {
        title: 'ALTER COLUMN type',
        sql: `-- Change column data type
ALTER TABLE employees
ALTER COLUMN salary TYPE DECIMAL(12,2);

-- Add a NOT NULL constraint to an existing column
ALTER TABLE employees
ALTER COLUMN department SET NOT NULL;

-- Drop the NOT NULL constraint
ALTER TABLE employees
ALTER COLUMN department DROP NOT NULL;`,
        explanation: 'ALTER COLUMN TYPE changes the data type (may fail if existing data is incompatible). SET/DROP NOT NULL adds or removes the NOT NULL constraint on an existing column.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: ALTER COLUMN salary TYPE DECIMAL(12,2)
// Widening the type: all existing values fit automatically
struct EmployeeV2 {
    int id; string name; string department;
    double salary; // was DECIMAL(10,2), now DECIMAL(12,2) — no change in C++
};
// SET NOT NULL on department: existing NULL values would cause failure
for (int i = 0; i < employeeCount; i++)
    if (employees[i].department.empty())
        throw "Cannot add NOT NULL: existing rows have NULL";`
      },
      {
        title: 'ADD and DROP constraints',
        sql: `-- Add a PRIMARY KEY
ALTER TABLE employees
ADD PRIMARY KEY (id);

-- Add a FOREIGN KEY
ALTER TABLE orders
ADD CONSTRAINT fk_product
FOREIGN KEY (product_id) REFERENCES products(id);

-- Add a UNIQUE constraint
ALTER TABLE employees
ADD CONSTRAINT uq_email UNIQUE (email);

-- Add a CHECK constraint
ALTER TABLE employees
ADD CONSTRAINT chk_salary CHECK (salary >= 0);

-- Drop a constraint
ALTER TABLE employees
DROP CONSTRAINT chk_salary;`,
        explanation: 'ADD CONSTRAINT adds a constraint by name. PRIMARY KEY, UNIQUE, and CHECK are validated against existing data. FOREIGN KEY requires the referenced table and columns to exist.',
        sourceTables: ['employees', 'orders', 'products'],
        cppRepresentation: `// Intuitive C++ representation of: ADD CONSTRAINT
// Adding PRIMARY KEY on id:
bool addPrimaryKey() {
    bool seen[1000] = {false};
    for (int i = 0; i < employeeCount; i++) {
        if (seen[employees[i].id]) return false; // duplicate
        if (employees[i].id == 0) return false; // NULL
        seen[employees[i].id] = true;
    }
    return true;
}
// Adding CHECK (salary >= 0):
bool addCheckSalary() {
    for (int i = 0; i < employeeCount; i++)
        if (employees[i].salary < 0) return false;
    return true;
}`
      },
      {
        title: 'DROP TABLE vs TRUNCATE TABLE',
        sql: `-- Remove all rows (keep structure)
TRUNCATE TABLE employees;

-- Remove entire table (structure + data)
DROP TABLE employees;

-- Remove table only if it exists (no error if missing)
DROP TABLE IF EXISTS employees;`,
        explanation: 'TRUNCATE is faster than DELETE without WHERE — it deallocates data pages, resets identity counters, and logs minimally. DROP TABLE removes the table definition entirely. IF EXISTS prevents errors on non-existent tables.',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of TRUNCATE vs DROP
// TRUNCATE TABLE employees: remove all rows but keep the struct
employeeCount = 0;
nextId = 1; // identity reset

// DROP TABLE employees: remove everything
// struct Employee is deleted; employee array is gone
// Employee employees[1000]; // this line is removed
// int employeeCount;        // this line is removed`
      },
      {
        title: 'Multiple ALTER operations',
        sql: `ALTER TABLE employees
  ADD COLUMN middle_name VARCHAR(50),
  ALTER COLUMN salary TYPE DECIMAL(14,2),
  ALTER COLUMN city SET DEFAULT 'Unknown',
  ADD CONSTRAINT chk_city CHECK (city IS NOT NULL AND city <> ''),
  ADD CONSTRAINT uq_name_dept UNIQUE (name, department);`,
        explanation: 'Chains multiple ALTER operations: adds a column, widens salary precision, sets a default for city, adds a CHECK constraint, and adds a composite UNIQUE on (name, department).',
        sourceTables: ['employees'],
        cppRepresentation: `// Intuitive C++ representation of: multiple ALTER operations on employees
struct Employee {
    int id; string name; string middle_name; string department;
    double salary; string status; string city; string email;
};
// ALTER COLUMN salary TYPE DECIMAL(14,2): existing values fit
// ALTER COLUMN city SET DEFAULT 'Unknown': new rows default to "Unknown"
// CHECK (city NOT NULL AND city <> ''):
for (int i = 0; i < employeeCount; i++)
    if (employees[i].city.empty()) throw "CHECK city failed";
// UNIQUE (name, department):
for (int i = 0; i < employeeCount; i++)
    for (int j = i + 1; j < employeeCount; j++)
        if (employees[i].name == employees[j].name
            && employees[i].department == employees[j].department)
            throw "UNIQUE (name, department) violated";`
      }
    ],
    commonMistakes: [
      'Running ALTER COLUMN TYPE without checking if existing data is compatible (causes conversion errors)',
      'Trying to DROP COLUMN that is referenced by a FOREIGN KEY',
      'Forgetting that TRUNCATE cannot be used on tables with FOREIGN KEY references',
      'Not using IF EXISTS with DROP TABLE in migration scripts (causes errors on re-runs)',
      'Adding UNIQUE constraints on columns that already have duplicate values (will fail)'
    ],
    practiceQuestions: [
      {
        question: `Table: employees

Add a "salary" column to employees (DECIMAL(10,2), default 0), and add a CHECK constraint ensuring salary >= 0.

Return columns: (DDL statement — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use ADD COLUMN with DEFAULT, then ADD CONSTRAINT with CHECK.',
        solution: `ALTER TABLE employees
ADD COLUMN salary DECIMAL(10,2) DEFAULT 0;

ALTER TABLE employees
ADD CONSTRAINT chk_salary_nonneg CHECK (salary >= 0);`
      },
      {
        question: `Table: employees

Remove the "email" column from employees, then drop the employees table entirely if it exists.

Return columns: (DDL statements — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use DROP COLUMN for the first, DROP TABLE IF EXISTS for the second.',
        solution: `ALTER TABLE employees
DROP COLUMN email;

DROP TABLE IF EXISTS employees;`
      },
      {
        question: `Table: products, orders

Challenge: Change the price column in products from DECIMAL(8,2) to DECIMAL(12,2) with NOT NULL. Then add a FK on orders.product_id referencing products(id) ON DELETE CASCADE.

Return columns: (DDL statements — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use ALTER COLUMN ... TYPE for the type change, ALTER COLUMN ... SET NOT NULL for the constraint, and ADD CONSTRAINT ... FOREIGN KEY for the FK.',
        solution: `ALTER TABLE products
ALTER COLUMN price TYPE DECIMAL(12,2),
ALTER COLUMN price SET NOT NULL;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_products
FOREIGN KEY (product_id) REFERENCES products(id)
ON DELETE CASCADE;`
      },
      {
        question: `Table: employees

Medium: Add a UNIQUE constraint named "uq_employee_email" on the email column of employees. Then RENAME the "city" column to "location".

Return columns: (DDL statements — no columns returned)
Order by: N/A (DDL).`,
        hint: 'Use ALTER TABLE employees ADD CONSTRAINT uq_employee_email UNIQUE (email). Then ALTER TABLE employees RENAME COLUMN city TO location.',
        solution: `ALTER TABLE employees
ADD CONSTRAINT uq_employee_email UNIQUE (email);

ALTER TABLE employees
RENAME COLUMN city TO location;`
      }
    ]
  },
  {
    id: 'exists-not-exists',
    title: 'EXISTS & NOT EXISTS — Correlated Subqueries',
    description: 'Use EXISTS and NOT EXISTS to test for the presence or absence of related rows',
    icon: '🔍',
    difficulty: 'intermediate',
    prerequisites: ['subqueries', 'select', 'where'],
    topics: ['EXISTS', 'NOT EXISTS', 'correlated subquery', 'IN vs EXISTS', 'NULL safety', 'division pattern'],
    explanation: `── Real-World Analogy ──
EXISTS = "Does this employee have ANY orders?" (check YES/NO, don't need details)
NOT EXISTS = "Does this employee have ZERO orders?" (find people who never ordered)

Think of a bouncer checking IDs at a club:
- EXISTS = "Is this person on the list?" → scan until found, then stop (short-circuit)
- NOT EXISTS = "Is this person NOT on the list?" → scan entire list, confirm absence

── Visual: How EXISTS Executes (Short-Circuit) ──
  Outer query: employees e           Inner: SELECT 1 FROM orders o WHERE o.customer = e.name

  ┌──────────┬──────────┐    ┌────────────────────────────────────────────┐
  │ checking │ name     │    │ For THIS employee, scan orders:            │
  ├──────────┼──────────┤    │                                            │
  │ Row 1    │ Alice    │───►│ Order #101 (Alice) → MATCH! → STOP ✅     │  ← short-circuit
  │ Row 2    │ Bob      │───►│ Order #102 (Carol) ❌ Order #104 (Carol) ❌│
  │          │          │    │ Order #105 (Bob) → MATCH! → STOP ✅        │  ← found on 3rd try
  │ Row 3    │ Carol    │───►│ Order #102 (Carol) → MATCH! → STOP ✅     │  ← found on 1st try
  │ Row 4    │ Diana    │───►│ No orders for Diana → scanned ALL → ❌    │
  └──────────┴──────────┘    └────────────────────────────────────────────┘
  EXISTS keeps 3 rows (Alice, Bob, Carol). Diana excluded.

── Visual: NOT EXISTS (Check for Zero Matches) ──
  NOT EXISTS finds employees with NO orders:
  ┌──────────┬──────────┐    ┌────────────────────────────────────────────┐
  │ keeping  │ name     │    │ For THIS employee, scan orders:            │
  ├──────────┼──────────┤    │                                            │
  │ ❌       │ Alice    │───►│ Found order → NOT EXISTS is FALSE → skip   │
  │ ❌       │ Bob      │───►│ Found order → NOT EXISTS is FALSE → skip   │
  │ ❌       │ Carol    │───►│ Found order → NOT EXISTS is FALSE → skip   │
  │ ✅       │ Diana    │───►│ NO orders found → NOT EXISTS is TRUE ✅    │
  └──────────┴──────────┘    └────────────────────────────────────────────┘
  Only Diana kept (she has zero orders).

── EXISTS vs IN vs JOIN ──
| Use Case                          | Best Tool        | Why                                  |
|-----------------------------------|------------------|--------------------------------------|
| "Has at least one" (boolean)      | EXISTS           | Short-circuits, can be correlated    |
| "Value in a fixed list"           | IN               | Cleaner for uncorrelated checks      |
| "Value in subquery (no NULLs)"    | IN               | Simple, readable                     |
| "Value in subquery (has NULLs)"   | EXISTS           | NULL-safe, NOT IN breaks with NULLs  |
| "Need data from both tables"      | JOIN             | Access columns from both sides       |

── NULL Safety Trap ──
NOT EXISTS is NULL-safe; NOT IN is NOT.
Reason: x NOT IN (1, 2, NULL) → x <> 1 AND x <> 2 AND x <> NULL → UNKNOWN (zero rows).
NOT EXISTS only checks if the subquery returns rows — NULLs inside don't affect the boolean.

── When EXISTS Runs Faster ──
EXISTS short-circuits: stops scanning the inner table as soon as it finds one match.
IN must evaluate all rows in the subquery first, then compare.
For large correlated checks, EXISTS is typically faster.

── Mental Model (C++ Style) ──
for each outer_row in table_a:
    bool found = false
    for each inner_row in table_b:
        if inner_row.foreign_key == outer_row.id:
            found = true
            break              // short-circuit
    if (found)  → EXISTS matches
    if (!found) → NOT EXISTS matches`,
    syntax: `-- EXISTS — find rows that have matches
SELECT column1, column2
FROM table_a a
WHERE EXISTS (
  SELECT 1 FROM table_b b
  WHERE b.foreign_key = a.id
);

-- NOT EXISTS — find rows without matches
SELECT column1, column2
FROM table_a a
WHERE NOT EXISTS (
  SELECT 1 FROM table_b b
  WHERE b.foreign_key = a.id
);

-- Common convention: SELECT 1 or SELECT *
-- Inside EXISTS, SELECT list doesn't matter — only row existence is checked`,
    examples: [
      {
        title: 'EXISTS — find products that have been ordered',
        sql: `SELECT p.name, p.price, p.category
FROM products p
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.product_id = p.id
)
ORDER BY p.name;`,
        explanation: 'For each product, the EXISTS subquery checks if any order references it. If yes, the product is included. The subquery short-circuits on the first match.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `// Intuitive C++ representation of: EXISTS (SELECT 1 FROM orders o WHERE o.product_id = p.id)
for (int i = 0; i < productCount; i++) {
    bool hasOrders = false;
    for (int j = 0; j < orderCount; j++) {
        if (orders[j].product_id == products[i].id) {
            hasOrders = true;
            break; // short-circuit — EXISTS stops at first match
        }
    }
    if (hasOrders)
        cout << products[i].name << " | " << products[i].price << " | " << products[i].category << "\\n";
}`
      },
      {
        title: 'NOT EXISTS — find products never ordered',
        sql: `SELECT p.name, p.price, p.category
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.product_id = p.id
)
ORDER BY p.price DESC;`,
        explanation: 'NOT EXISTS finds products with zero matching orders. Unlike NOT IN, NOT EXISTS correctly handles NULLs in the subquery — it never produces UNKNOWN.',
        sourceTables: ['products', 'orders'],
        cppRepresentation: `// Intuitive C++ representation of: NOT EXISTS (SELECT 1 FROM orders o WHERE o.product_id = p.id)
for (int i = 0; i < productCount; i++) {
    bool hasOrders = false;
    for (int j = 0; j < orderCount; j++) {
        if (orders[j].product_id == products[i].id) {
            hasOrders = true;
            break;
        }
    }
    if (!hasOrders)
        cout << products[i].name << " | " << products[i].price << " | " << products[i].category << "\\n";
}`
      },
      {
        title: 'NOT EXISTS vs NOT IN — NULL safety',
        sql: `-- NULL-safe: NOT EXISTS handles NULLs correctly
SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer = e.name
);

-- DANGEROUS: NOT IN returns empty results if subquery contains NULL
SELECT e.name, e.department
FROM employees e
WHERE e.name NOT IN (
  SELECT o.customer FROM orders o
);`,
        explanation: 'NOT IN returns zero rows if ANY value in the subquery is NULL (because NULL comparisons yield UNKNOWN, which is NOT TRUE). NOT EXISTS handles NULLs correctly and is the safe choice.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `// Intuitive C++ representation of: NOT EXISTS vs NOT IN NULL behavior
// NOT EXISTS (safe):
for (int i = 0; i < employeeCount; i++) {
    bool found = false;
    for (int j = 0; j < orderCount; j++)
        if (orders[j].customer == employees[i].name) { found = true; break; }
    if (!found) cout << employees[i].name << "\\n";
}
// NOT IN (breaks with NULL):
// SQL semantics: if any orders.customer is NULL,
// the entire NOT IN evaluates to UNKNOWN (zero rows).
// C++ doesn't model this directly — it's a tri-valued logic issue.`
      },
      {
        title: 'Correlated EXISTS — "has a" pattern',
        sql: `SELECT e.name, e.department, e.salary
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer = e.name
    AND o.total > 200
)
ORDER BY e.salary DESC;`,
        explanation: 'A correlated EXISTS: for each employee, checks if they have placed any order over $200. The correlation is o.customer = e.name, linking inner to outer query.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `// Intuitive C++ representation of: correlated EXISTS — employees with large orders
for (int i = 0; i < employeeCount; i++) {
    bool hasBigOrder = false;
    for (int j = 0; j < orderCount; j++) {
        if (orders[j].customer == employees[i].name && orders[j].total > 200) {
            hasBigOrder = true;
            break;
        }
    }
    if (hasBigOrder)
        cout << employees[i].name << " | " << employees[i].department << " | " << employees[i].salary << "\\n";
}`
      },
      {
        title: 'Division pattern with NOT EXISTS',
        sql: `-- Find employees who have ordered ALL products in the 'Electronics' category
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.category = 'Electronics'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);`,
        explanation: 'The "division" or "relational division" pattern: double NOT EXISTS finds entities related to ALL items in a set. The inner NOT EXISTS finds Electronics products the employee has NOT ordered. The outer NOT EXISTS finds employees where no such product exists — meaning they ordered all of them.',
        sourceTables: ['employees', 'products', 'orders'],
        cppRepresentation: `// Intuitive C++ representation of: division pattern (employees who ordered ALL Electronics)
for (int i = 0; i < employeeCount; i++) {
    bool orderedAllElectronics = true;
    for (int p = 0; p < productCount; p++) {
        if (products[p].category != "Electronics") continue;
        bool orderedThis = false;
        for (int o = 0; o < orderCount; o++) {
            if (orders[o].customer == employees[i].name
                && orders[o].product_id == products[p].id) {
                orderedThis = true;
                break;
            }
        }
        if (!orderedThis) { orderedAllElectronics = false; break; }
    }
    if (orderedAllElectronics)
        cout << employees[i].name << "\\n";
}`
      }
    ],
    commonMistakes: [
      'NOT IN with NULLs: if subquery returns ANY NULL, NOT IN returns zero rows silently. Always use NOT EXISTS for NULL-safe exclusion.',
      'ORDER BY inside EXISTS: pointless — EXISTS only checks row count, ordering changes nothing.',
      'Missing correlation: without linking inner to outer (e.g., WHERE o.customer = e.name), EXISTS checks the same thing for every row.',
      'Using EXISTS when you need JOIN data: EXISTS is a boolean check — you cannot access columns from the subquery. Use JOIN if you need inner table columns.',
      'SELECT * inside EXISTS: misleading. Only row existence matters — use SELECT 1 for clarity.'
    ],
    practiceQuestions: [
      {
        question: `Table: employees

Use EXISTS to find all departments that have at least one employee with a salary above $90,000.

Return columns: department
Order by: any order.`,
        hint: 'SELECT DISTINCT department FROM employees e WHERE EXISTS (SELECT 1 FROM employees e2 WHERE e2.department = e.department AND e2.salary > 90000).',
        solution: `SELECT DISTINCT e.department
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM employees e2
  WHERE e2.department = e.department
    AND e2.salary > 90000
);`
      },
      {
        question: `Table: employees, orders

Find all employees who have never placed an order, using NOT EXISTS.

Return columns: name, department
Order by: any order.`,
        hint: 'Use NOT EXISTS (SELECT 1 FROM orders WHERE customer = e.name) correlated to the outer employee.',
        solution: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer = e.name
);`
      },
      {
        question: `Table: employees, products, orders

Challenge: Use double NOT EXISTS (relational division) to find employees who have ordered ALL products that cost more than $100.

Return columns: name, department
Order by: any order.`,
        hint: 'Outer NOT EXISTS on products: WHERE price > 100 AND NOT EXISTS (orders linking employee to that product).',
        solution: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.price > 100
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);`
      },
      {
        question: `Table: products, orders

Rewrite this IN query using EXISTS instead: SELECT name FROM products WHERE id IN (SELECT product_id FROM orders WHERE quantity > 5); Explain which is better and why.

Return columns: name
Order by: any order.`,
        hint: 'For EXISTS, correlate: WHERE EXISTS (SELECT 1 FROM orders WHERE product_id = p.id AND quantity > 5). Both work here since no NULLs, but EXISTS short-circuits.',
        solution: `SELECT p.name
FROM products p
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.product_id = p.id
    AND o.quantity > 5
);

-- EXISTS is better here because:
-- 1. Short-circuits on first match per product (faster with large data)
-- 2. Can be correlated (re-evaluated per outer row)
-- 3. Same NULL-safety (no NULLs in this case)
-- IN would evaluate the full subquery first, then compare.`
      }
    ]
  },
  {
    id: 'division-queries',
    title: 'Division Queries \u2014 "Assigned to ALL" Pattern',
    description: 'Use the relational division pattern to find entities related to ALL items in a set',
    icon: '\uD83D\uDCCA',
    difficulty: 'advanced',
    prerequisites: ['exists-not-exists', 'subqueries', 'set-operations', 'select', 'where'],
    topics: ['DIVISION', 'double negation', 'NOT EXISTS', 'EXCEPT', 'for all', 'relational division'],
    explanation: `── Real-World Analogy ──
Division answers: "Which employees have ordered ALL products in the Electronics category?"

Think of a teacher checking homework: "Did EVERY student submit EVERY assignment?"
The question is NOT "which students submitted something?" (that's EXISTS).
The question is "which students submitted EVERYTHING?" (that's DIVISION).

── Visual: Division with Real Data ──
  Products in Electronics:     Orders placed:
  ┌──────┬──────────────┐     ┌──────────┬────────────┐
  │ id   │ name         │     │ customer │ product_id │
  ├──────┼──────────────┤     ├──────────┼────────────┤
  │ 1    │ Laptop       │     │ Alice    │ 1          │  ← Alice ordered Laptop
  │ 2    │ Mouse        │     │ Alice    │ 2          │  ← Alice ordered Mouse
  │ 3    │ Keyboard     │     │ Alice    │ 3          │  ← Alice ordered Keyboard
  └──────┴──────────────┘     │ Bob      │ 1          │  ← Bob ordered Laptop
                              │ Bob      │ 2          │  ← Bob ordered Mouse
  Goal: find employees who   │ Carol    │ 1          │  ← Carol ordered Laptop
  ordered ALL 3 Electronics   └──────────┴────────────┘

  ── Step-by-step visual check ──
  Alice: ordered 1✅, 2✅, 3✅ → ALL three! ✅  ← RESULT
  Bob:   ordered 1✅, 2✅, 3❌ → Missing Keyboard ❌
  Carol: ordered 1✅, 2❌, 3❌ → Missing 2 items ❌

── Core Insight: Double Negation ──
"Employee ordered ALL Electronics products"
= "There is NO Electronics product that the employee did NOT order"

  For each employee:
    For each Electronics product:
      Did the employee NOT order this product?  → If YES → exclude this employee
  Keep employees where NO counterexample exists.

── Three Approaches ──
| Approach                     | How It Works                              | Pros                     | Cons                     |
|------------------------------|-------------------------------------------|--------------------------|--------------------------|
| Double NOT EXISTS            | Nested NOT EXISTS (standard)              | NULL-safe, portable      | Harder to read           |
| EXCEPT inside NOT EXISTS     | NOT EXISTS (SELECT ... EXCEPT SELECT ...) | More readable            | Not in MySQL             |
| HAVING COUNT = total         | GROUP BY + HAVING COUNT = subquery COUNT  | Simple query structure   | Requires JOIN, COUNT mismatch risk |

── When to Use Which ──
- Double NOT EXISTS: default choice, works everywhere, NULL-safe
- EXCEPT approach: more intuitive if you know set operations
- HAVING COUNT: simpler for single-table relationships`,
    syntax: `-- Division: double NOT EXISTS (standard form)
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.category = 'Electronics'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);

-- Division: EXCEPT pattern
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  (
    SELECT p.id FROM products p WHERE p.category = 'Electronics'
    EXCEPT
    SELECT o.product_id FROM orders o WHERE o.customer = e.name
  )
);

-- Division: HAVING COUNT
SELECT o.customer
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE p.category = 'Electronics'
GROUP BY o.customer
HAVING COUNT(DISTINCT o.product_id) = (
  SELECT COUNT(*) FROM products WHERE category = 'Electronics'
);`,
    examples: [
      {
        title: 'Basic division \u2014 double NOT EXISTS pattern',
        sql: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.category = 'Electronics'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);`,
        explanation: 'For each employee, the inner NOT EXISTS checks if there is an Electronics product they have NOT ordered. If no such product exists (outer NOT EXISTS), the employee has ordered ALL Electronics products.',
        sourceTables: ['employees', 'products', 'orders'],
        cppRepresentation: `// C++: employees who ordered ALL Electronics products
for (int i = 0; i < employeeCount; i++) {
    bool allOrdered = true;
    for (int p = 0; p < productCount; p++) {
        if (products[p].category != "Electronics") continue;
        bool found = false;
        for (int o = 0; o < orderCount; o++) {
            if (orders[o].customer == employees[i].name
                && orders[o].product_id == products[p].id)
                { found = true; break; }
        }
        if (!found) { allOrdered = false; break; }
    }
    if (allOrdered)
        cout << employees[i].name << " | " << employees[i].department << "\\n";
}`
      },
      {
        title: 'Division with EXCEPT',
        sql: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  (
    SELECT p.id FROM products p WHERE p.price > 100
    EXCEPT
    SELECT o.product_id FROM orders o WHERE o.customer = e.name
  )
);`,
        explanation: 'The EXCEPT pattern is more readable: "Take all expensive product IDs, remove the ones this employee ordered. If nothing remains, they ordered all of them."',
        sourceTables: ['employees', 'products', 'orders'],
        cppRepresentation: `// C++: EXCEPT-based division
for (int i = 0; i < employeeCount; i++) {
    bool allOrdered = true;
    for (int p = 0; p < productCount; p++) {
        if (!(products[p].price > 100)) continue;
        bool found = false;
        for (int o = 0; o < orderCount; o++) {
            if (orders[o].customer == employees[i].name
                && orders[o].product_id == products[p].id)
                { found = true; break; }
        }
        if (!found) { allOrdered = false; break; }
    }
    if (allOrdered)
        cout << employees[i].name << " | " << employees[i].department << "\\n";
}`
      },
      {
        title: 'Division with HAVING COUNT',
        sql: `SELECT o.customer, COUNT(DISTINCT o.product_id) AS products_ordered
FROM orders o
GROUP BY o.customer
HAVING COUNT(DISTINCT o.product_id) = (
  SELECT COUNT(*) FROM products
)
ORDER BY o.customer;`,
        explanation: 'The HAVING COUNT approach counts distinct products each customer ordered. If it equals the total number of products, they ordered all of them. Requires a subquery for the total count.',
        sourceTables: ['employees', 'products', 'orders'],
        cppRepresentation: `// C++: HAVING COUNT division
int totalProducts = productCount;
string customers[100];
int custCount = 0;
int custCounts[100] = {0};
int seenProducts[100][100] = {{0}};
for (int i = 0; i < orderCount; i++) {
    int idx = -1;
    for (int j = 0; j < custCount; j++)
        if (customers[j] == orders[i].customer) { idx = j; break; }
    if (idx == -1) { idx = custCount++; customers[idx] = orders[i].customer; }
    bool dup = false;
    for (int k = 0; k < seenProducts[idx][0]; k++)
        if (seenProducts[idx][k + 1] == orders[i].product_id) { dup = true; break; }
    if (!dup) { seenProducts[idx][++seenProducts[idx][0]] = orders[i].product_id; custCounts[idx]++; }
}
for (int i = 0; i < custCount; i++)
    if (custCounts[i] == totalProducts)
        cout << customers[i] << " | " << custCounts[i] << "\\n";`
      }
    ],
    commonMistakes: [
      'Using NOT IN for division (fails if the subquery contains NULL values)',
      'Forgetting DISTINCT in the HAVING COUNT approach (duplicates inflate the count)',
      'Confusing the double NOT EXISTS logic: outer checks for counterexamples, inner checks for a specific missing item',
      'Writing the division query without correlating the inner subquery to the outer table',
      'Using EXCEPT without matching column count and data types between the two queries'
    ],
    practiceQuestions: [
      {
        question: `Table: employees, products, orders

Write a query using double NOT EXISTS to find employees who have placed orders for ALL products in the "Clothing" category.

Return columns: name, department
Order by: any order.`,
        hint: 'Outer NOT EXISTS on products WHERE category = \'Clothing\' AND inner NOT EXISTS on orders linking employee to product WHERE o.customer = e.name AND o.product_id = p.id.',
        solution: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.category = 'Clothing'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);`
      },
      {
        question: `Table: employees, products, orders

Rewrite the division query from question 1 using the EXCEPT pattern instead of double NOT EXISTS.

Return columns: name, department
Order by: any order.`,
        hint: 'Use NOT EXISTS ( (SELECT p.id FROM products p WHERE p.category = \'Clothing\') EXCEPT (SELECT o.product_id FROM orders o WHERE o.customer = e.name) ).',
        solution: `SELECT e.name, e.department
FROM employees e
WHERE NOT EXISTS (
  (
    SELECT p.id FROM products p
    WHERE p.category = 'Clothing'
    EXCEPT
    SELECT o.product_id FROM orders o
    WHERE o.customer = e.name
  )
);`
      },
      {
        question: `Table: products, orders

Challenge: Using the HAVING COUNT approach, find customers who have ordered ALL products costing more than $50.

Return columns: customer, expensive_ordered
Order by: customer ASC.`,
        hint: 'GROUP BY o.customer, HAVING COUNT(DISTINCT o.product_id) = (SELECT COUNT(*) FROM products WHERE price > 50). JOIN products to filter by price.',
        solution: `SELECT o.customer, COUNT(DISTINCT o.product_id) AS expensive_ordered
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE p.price > 50
GROUP BY o.customer
HAVING COUNT(DISTINCT o.product_id) = (
  SELECT COUNT(*) FROM products WHERE price > 50
)
ORDER BY o.customer;`
      },
      {
        question: `Table: products, orders

Advanced: Using the HAVING COUNT approach, find employees who have ordered at least one product from EVERY category that exists in products.

Return columns: name, categories_ordered
Order by: name ASC.`,
        hint: 'First compute total categories: (SELECT COUNT(DISTINCT category) FROM products). Then JOIN employees → orders → products, GROUP BY employee, and HAVING COUNT(DISTINCT p.category) = total categories.',
        solution: `SELECT e.name, COUNT(DISTINCT p.category) AS categories_ordered
FROM employees e
JOIN orders o ON e.name = o.customer_name
JOIN products p ON o.product_id = p.id
GROUP BY e.name
HAVING COUNT(DISTINCT p.category) = (
  SELECT COUNT(DISTINCT category) FROM products
)
ORDER BY e.name;`
      }
    ]
  },
  {
    id: 'relational-algebra',
    title: 'Relational Algebra \u2014 \u03C3, \u03C0, \u22C8, \u222A, \u2212, \u2229',
    description: 'Express queries as RA expressions then translate to SQL',
    icon: '\u22A2',
    difficulty: 'advanced',
    prerequisites: ['select', 'where', 'joins', 'set-operations'],
    topics: ['SELECT \u03C3', 'PROJECT \u03C0', 'RENAME \u03C1', 'EQUIJOIN', 'NATURAL JOIN', 'THETA JOIN', 'UNION', 'DIFFERENCE', 'INTERSECTION', 'DIVISION'],
    explanation: `── What is Relational Algebra? ──
Relational Algebra (RA) is the mathematical FOUNDATION of SQL.
Think of it as the "assembly language" of databases — SQL is compiled into RA operations internally.

Understanding RA helps you: think clearly about queries, optimize them, and ace your database exam.

── Visual: RA → SQL Translation Pipeline ──
  English: "Names of Engineering employees earning over 80k"

      ↓

  RA expression (written inside-out):
  π_{name}( σ_{department='Engineering' AND salary>80000}( employees ) )
  ↑         ↑                                                  ↑
  Step 2    Step 1                                             Start here

      ↓ Read from innermost to outermost ↓

  Step 1: σ (SELECT/WHERE) → get Engineering employees earning > 80K
  Step 2: π (PROJECT)      → keep only the 'name' column

      ↓

  SQL (translated step by step):
  SELECT name                          ← π (projection)
  FROM employees
  WHERE department = 'Engineering'     ← σ (selection)
    AND salary > 80000;

── Visual: RA Operators as Data Flow ──
  employees table (raw data):
  ┌──────┬──────────────┬────────┬────────┐
  │ name │ department   │ salary │ city   │
  ├──────┼──────────────┼────────┼────────┤
  │ Alice│ Engineering  │ 100K   │ Cairo  │
  │ Bob  │ Engineering  │ 70K    │ Giza   │  ← These rows are REMOVED by σ (salary ≤ 80K)
  │ Carol│ Marketing    │ 90K    │ Cairo  │  ← Removed by σ (not Engineering)
  │ Dave │ Engineering  │ 95K    │ Luxor  │
  └──────┴──────────────┴────────┴────────┘

  Step 1 — σ (SELECT rows): σ_{dept='Eng' AND salary>80000}
  ┌──────┬──────────────┬────────┬────────┐
  │ Alice│ Engineering  │ 100K   │ Cairo  │
  │ Dave │ Engineering  │ 95K    │ Luxor  │  ← 2 rows pass the filter
  └──────┴──────────────┴────────┴────────┘

  Step 2 — π (PROJECT columns): π_{name}
  ┌──────┐
  │ name │
  ├──────┤
  │ Alice│  ← Only the name column remains
  │ Dave │
  └──────┘

── Core Operations ──
| Symbol | Name         | What It Does                    | SQL Equivalent                    |
|:------:|--------------|----------------------------------|-----------------------------------|
| σ      | SELECT       | Filter ROWS by condition         | SELECT * FROM t WHERE condition   |
| π      | PROJECT      | Pick specific COLUMNS            | SELECT col1, col2 FROM t          |
| ⋈      | JOIN         | Combine tables on condition      | t1 JOIN t2 ON condition           |
| ρ      | RENAME       | Rename table or columns          | table AS alias                    |
| ∪      | UNION        | Rows in either table             | SELECT ... UNION SELECT ...       |
| −      | DIFFERENCE   | Rows in first but NOT second     | SELECT ... EXCEPT SELECT ...      |
| ∩      | INTERSECTION | Rows in BOTH tables              | SELECT ... INTERSECT SELECT ...   |
| ×      | PRODUCT      | All combinations (Cartesian)     | CROSS JOIN or FROM a, b           |

── Translation Strategy ──
Write RA from inside-out, translate to SQL from inside-out:
  π_{name}(σ_{dept='Eng'}(employees))
     ↓ inner first
  σ → WHERE:  SELECT * FROM employees WHERE dept = 'Eng'
     ↓ then outer
  π → SELECT columns: SELECT name FROM employees WHERE dept = 'Eng'

Composition = nesting. The innermost operation is the FIRST to execute.`,
    syntax: `-- RA to SQL Translation Reference:
-- \u03C3_{condition}(Table)              \u2192 SELECT * FROM Table WHERE condition
-- \u03C0_{cols}(Table)                   \u2192 SELECT cols FROM Table
-- \u03C1_{alias}(Table)                  \u2192 Table AS alias
-- Table1 \u22C8_{cond} Table2            \u2192 Table1 JOIN Table2 ON cond
-- Table1 \u22C8 Table2                   \u2192 Table1 NATURAL JOIN Table2
-- Table1 \u222A Table2                   \u2192 Table1 UNION Table2
-- Table1 \u2212 Table2                   \u2192 Table1 EXCEPT Table2
-- Table1 \u2229 Table2                   \u2192 Table1 INTERSECT Table2
-- Table1 \u00D7 Table2                   \u2192 Table1 CROSS JOIN Table2

-- Composition: Apply innermost first
-- \u03C0_{name}(\u03C3_{dept='Eng'}(employees))
-- Step 1: \u03C3 \u2192 WHERE
-- Step 2: \u03C0 \u2192 SELECT`,
    examples: [
      {
        title: '\u03C3 and \u03C0 \u2014 basic selection and projection',
        sql: `-- RA: \u03C0_{name, salary}(\u03C3_{department='Engineering'}(employees))
SELECT name, salary
FROM employees
WHERE department = 'Engineering';`,
        explanation: '\u03C3 filters rows (WHERE), \u03C0 selects columns (SELECT). In RA, \u03C3 is applied first, then \u03C0. The SQL optimizer may reorder, but the logical meaning is the same.',
        sourceTables: ['employees'],
        cppRepresentation: `// C++: \u03C3_{dept='Eng'} then \u03C0_{name, salary}
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].department == "Engineering")
        cout << employees[i].name << " | " << employees[i].salary << "\\n";
}`
      },
      {
        title: 'Join in RA \u2014 \u03B8-join and equijoin',
        sql: `-- RA: \u03C0_{name, product}(\u03C3_{total>200}(employees \u22C8_{name=customer} orders \u22C8_{product_id=id} products))
SELECT e.name, p.name AS product, o.total
FROM employees e
JOIN orders o ON e.name = o.customer
JOIN products p ON o.product_id = p.id
WHERE o.total > 200;`,
        explanation: 'The \u03B8-join (\u22C8_{condition}) combines rows where the condition holds. Multiple joins chain together. In RA: ((employees \u22C8 orders) \u22C8 products).',
        sourceTables: ['employees', 'orders', 'products'],
        cppRepresentation: `// C++: employees \u22C8_{name=customer} orders \u22C8_{product_id=id} products
for (int i = 0; i < employeeCount; i++) {
    for (int j = 0; j < orderCount; j++) {
        if (orders[j].customer != employees[i].name) continue;
        for (int k = 0; k < productCount; k++) {
            if (products[k].id != orders[j].product_id) continue;
            if (orders[j].total > 200)
                cout << employees[i].name << " | " << products[k].name << " | " << orders[j].total << "\\n";
        }
    }
}`
      },
      {
        title: 'RA to SQL translation',
        sql: `-- RA: \u03C0_{name, salary}(\u03C3_{city='NYC'}(employees)) \u2229 \u03C0_{name, salary}(employees \u22C8 orders)
-- NYC employees who have placed orders

SELECT e.name, e.salary
FROM employees e
WHERE e.city = 'New York'
INTERSECT
SELECT e.name, e.salary
FROM employees e
JOIN orders o ON e.name = o.customer;`,
        explanation: 'Start from the innermost operation. \u03C3_{city=\'NYC\'}(employees) filters rows, then \u03C0 projects columns. The join produces employee-order pairs, and INTERSECT finds NYC employees who also appear in the join result.',
        sourceTables: ['employees', 'orders'],
        cppRepresentation: `// C++: \u03C0 \u2229 \u03C0 (INTERSECT)
string nycNames[100]; double nycSalaries[100]; int nycCount = 0;
for (int i = 0; i < employeeCount; i++) {
    if (employees[i].city == "New York") {
        nycNames[nycCount] = employees[i].name;
        nycSalaries[nycCount] = employees[i].salary;
        nycCount++;
    }
}
string ordNames[100]; double ordSalaries[100]; int ordCount = 0;
for (int i = 0; i < orderCount; i++) {
    bool dup = false;
    for (int j = 0; j < ordCount; j++)
        if (ordNames[j] == orders[i].customer) { dup = true; break; }
    if (!dup) {
        ordNames[ordCount] = orders[i].customer;
        for (int e = 0; e < employeeCount; e++)
            if (employees[e].name == orders[i].customer)
                { ordSalaries[ordCount] = employees[e].salary; break; }
        ordCount++;
    }
}
for (int i = 0; i < nycCount; i++)
    for (int j = 0; j < ordCount; j++)
        if (nycNames[i] == ordNames[j])
            cout << nycNames[i] << " | " << nycSalaries[i] << "\\n";`
      },
      {
        title: 'Division expressed in RA',
        sql: `-- RA division: A \u00F7 B = \u03C0_{cols}(A) \u2212 \u03C0_{cols}((\u03C0_{cols}(A) \u00D7 B) \u2212 R)
-- Employees who ordered ALL Electronics:
-- \u03C0_{name}(employees) \u2212 \u03C0_{name}(
--   (\u03C0_{name}(employees) \u00D7 \u03C0_{id}(\u03C3_{category='Electronics'}(products)))
--   \u2212
--   \u03C0_{name, product_id}(employees \u22C8_{name=customer} orders)
-- )

SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE p.category = 'Electronics'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
);`,
        explanation: 'Division in RA: A \u00F7 B finds all tuples in A that are related to ALL tuples in B. The formula uses Cartesian product (\u00D7) to generate all possible combinations, then removes actual relationships to find missing ones.',
        sourceTables: ['employees', 'products', 'orders'],
        cppRepresentation: `// C++: Division - employees who ordered ALL Electronics
for (int i = 0; i < employeeCount; i++) {
    bool allOrdered = true;
    for (int p = 0; p < productCount; p++) {
        if (products[p].category != "Electronics") continue;
        bool found = false;
        for (int o = 0; o < orderCount; o++) {
            if (orders[o].customer == employees[i].name
                && orders[o].product_id == products[p].id)
                { found = true; break; }
        }
        if (!found) { allOrdered = false; break; }
    }
    if (allOrdered) cout << employees[i].name << "\\n";
}`
      }
    ],
    commonMistakes: [
      'Confusing \u03C3 (row filter) with \u03C0 (column filter) \u2014 \u03C3 affects rows, \u03C0 affects columns',
      'Forgetting that natural join \u22C8 automatically matches on ALL common column names (use \u03B8-join for explicit control)',
      'Writing RA expressions that produce different column names or counts than what the SQL needs',
      'Forgetting that RA set operations (\u222A, \u2212, \u2229) require union-compatible schemas (same column count and types)',
      'Using \u00D7 (Cartesian product) without a join condition \u2014 produces every pair, usually unintended'
    ],
    practiceQuestions: [
      {
        question: `Table: employees

Write an RA expression and its SQL translation: "Names and salaries of employees in Marketing who earn more than $70,000."

Return columns: name, salary
Order by: any order.`,
        hint: 'RA: \u03C0_{name, salary}(\u03C3_{department=\'Marketing\' \u2227 salary>70000}(employees)). SQL: SELECT name, salary FROM employees WHERE department = \'Marketing\' AND salary > 70000.',
        solution: `-- RA: \u03C0_{name, salary}(\u03C3_{department='Marketing' \u2227 salary>70000}(employees))
SELECT name, salary
FROM employees
WHERE department = 'Marketing' AND salary > 70000;`
      },
      {
        question: `Table: employees, orders

Translate this RA expression to SQL: \u03C0_{name, city}(employees \u22C8_{name=customer} orders). What does it return?

Return columns: name, city
Order by: any order.`,
        hint: 'The \u03B8-join combines employees with orders where employee name = order customer. Then \u03C0 projects name and city. Use DISTINCT to avoid duplicates.',
        solution: `SELECT DISTINCT e.name, e.city
FROM employees e
JOIN orders o ON e.name = o.customer;`
      },
      {
        question: `Table: employees

Challenge: Write an RA expression and SQL for: "Find departments where every employee earns more than $50,000." Use the difference pattern.

Return columns: department
Order by: any order.`,
        hint: 'RA: \u03C0_{department}(employees) \u2212 \u03C0_{department}(\u03C3_{salary \u2264 50000}(employees)). SQL: SELECT DISTINCT department FROM employees EXCEPT SELECT department FROM employees WHERE salary <= 50000.',
        solution: `-- RA: \u03C0_{department}(employees) \u2212 \u03C0_{department}(\u03C3_{salary \u2264 50000}(employees))
SELECT DISTINCT department
FROM employees
EXCEPT
SELECT department
FROM employees
WHERE salary <= 50000;`
      },
      {
        question: `Table: employees, products, orders

Advanced: Write an RA expression and SQL for: "Find employees who have ordered products in EVERY category." Use relational division (double NOT EXISTS or EXCEPT pattern).

Return columns: name
Order by: any order.`,
        hint: 'RA uses division: \u03C0_{name}(employees) \u00F7 \u03C0_{category}(products). SQL: Use double NOT EXISTS: find employees where no category exists that they haven\'t ordered from.',
        solution: `SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT p.category FROM products p
  EXCEPT
  SELECT DISTINCT p2.category
  FROM orders o
  JOIN products p2 ON o.product_id = p2.id
  WHERE o.customer_name = e.name
)
ORDER BY e.name;`
      }
    ]
  },
  {
    id: 'exam-prep',
    title: 'Exam Prep \u2014 Midterm & Final Solutions',
    description: 'Comprehensive exam preparation with Entity Integrity, Referential Integrity, query writing playbook, and full solutions',
    icon: '\uD83D\uDCDD',
    difficulty: 'advanced',
    prerequisites: ['ddl-create', 'dml-crud', 'select', 'where', 'joins', 'subqueries', 'set-operations', 'exists-not-exists', 'division-queries', 'relational-algebra'],
    topics: ['Exam', 'Midterm', 'Final', 'Practice', 'DDL', 'DML', 'SQL', 'RA'],
    explanation: `Comprehensive exam preparation for your midterm and final — everything in one place.

═══ Entity Integrity vs Referential Integrity ═══

  Every row MUST be uniquely identifiable          Every FK MUST reference an existing PK
  ┌──────────────────────────────┐                ┌──────────────────────────────┐
  │ ENTITY INTEGRITY (PK rules)  │                │ REFERENTIAL INTEGRITY (FK)   │
  ├──────────────────────────────┤                ├──────────────────────────────┤
  │ PRIMARY KEY ≠ NULL           │                │ FK must EXIST in parent PK   │
  │ Only ONE PK per table        │                │ FK can be NULL (unless NOT   │
  │ Can be COMPOSITE (multi-col) │                │   NULL)                      │
  │ Every table SHOULD have PK   │                │ Table can have MULTIPLE FKs  │
  └──────────────────────────────┘                └──────────────────────────────┘
  Violation: INSERT INTO t (id) VALUES (NULL)     Violation: INSERT INTO orders
              → ERROR! PK cannot be NULL           (product_id) VALUES (999)
                                                   → ERROR! No product with id=999

═══ Common T/F Question Patterns ═══

  ┌────────────────────────────────────────────────┬──────────┐
  │ Statement                                      │ Answer   │
  ├────────────────────────────────────────────────┼──────────┤
  │ "A PRIMARY KEY can be NULL"                    │ FALSE ❌ │
  │ "A FOREIGN KEY can be NULL"                    │ TRUE  ✅ │
  │ "A table can have multiple FOREIGN KEYs"       │ TRUE  ✅ │
  │ "A table can have multiple PRIMARY KEYs"       │ FALSE ❌ │
  │ "UNIQUE allows one NULL"                       │ TRUE  ✅ │
  │ "DELETE removes the table structure"           │ FALSE ❌ │
  │ "TRUNCATE can use a WHERE clause"              │ FALSE ❌ │
  │ "ORDER BY inside a UNION applies to one SELECT"│ FALSE ❌ │
  │ "Correlated subquery runs once per outer row"  │ TRUE  ✅ │
  │ "NOT IN is NULL-safe"                          │ FALSE ❌ │
  └────────────────────────────────────────────────┴──────────┘

═══ The Complete Query Writing Playbook (6 Steps) ═══

  ┌─ Step 1 ────────────────────────────────────────┐
  │  WHAT to display?  (SELECT columns)              │
  │  • Names? Expressions? Aliases? Aggregates?      │
  └──────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 2 ────────────────────────────────────────┐
  │  WHICH tables?  (FROM + JOIN)                    │
  │  • Every column must come from one of these       │
  └──────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 3 ────────────────────────────────────────┐
  │  HOW to connect?  (JOIN conditions)              │
  │  • FK = PK (usually) — N tables → N-1 conditions │
  └──────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 4 ────────────────────────────────────────┐
  │  FILTERING?  (WHERE — row-level, BEFORE group)   │
  └──────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 5 ────────────────────────────────────────┐
  │  GROUPING?  (GROUP BY + HAVING — AFTER group)    │
  │  • Non-aggregate in SELECT → MUST be in GROUP BY │
  └──────────────────────────────────────────────────┘
                        ↓
  ┌─ Step 6 ────────────────────────────────────────┐
  │  SORTING?  (ORDER BY + LIMIT)                    │
  │  • ASC/DESC? LIMIT to restrict rows?             │
  └──────────────────────────────────────────────────┘

═══ Pattern Recognition Table ═══

  English Phrase                    → SQL Pattern
  ───────────────────────────────────────────────────
  "who have ordered"                → EXISTS or JOIN
  "who have NOT ordered"            → NOT EXISTS
  "who ordered ALL"                 → Division (double NOT EXISTS)
  "average per department"          → GROUP BY + AVG
  "top 3"                           → ORDER BY + LIMIT
  "in both tables"                  → INTERSECT or JOIN
  "in neither table"                → NOT EXISTS or EXCEPT
  "find duplicates"                 → GROUP BY + HAVING COUNT(*) > 1
  "running total"                   → Window SUM() OVER (ORDER BY)
  "compare to department average"   → Window AVG() OVER (PARTITION BY)

=== Final Exam Checklist ===

Before submitting, check:
\u2610 Every column in SELECT is valid for the tables used
\u2610 JOINs have ON conditions (no accidental Cartesian products)
\u2610 Non-aggregated columns are in GROUP BY
\u2610 WHERE is for row filtering, HAVING is for group filtering
\u2610 NOT EXISTS used instead of NOT IN (NULL-safe)
\u2610 ORDER BY is at the end of UNION queries, not inside individual SELECTs
\u2610 Subqueries in FROM have aliases
\u2610 LIKE uses % wildcards, not = with %
\u2610 NULL comparisons use IS NULL, not = NULL
\u2610 Constraint names are unique within the schema`,
    syntax: `-- Query Writing Playbook (6 steps):
-- Step 1: SELECT columns (what to display?)
-- Step 2: FROM/JOIN tables (which tables?)
-- Step 3: ON conditions (how to connect?)
-- Step 4: WHERE filters (row-level filtering?)
-- Step 5: GROUP BY + HAVING (grouping?)
-- Step 6: ORDER BY + LIMIT (sorting?)

-- Pattern Recognition Quick Reference:
-- "has/contains"          \u2192 EXISTS
-- "does not have"         \u2192 NOT EXISTS
-- "all / every"           \u2192 Division (double NOT EXISTS)
-- "per department/city"   \u2192 GROUP BY
-- "most / top / highest"  \u2192 ORDER BY DESC + LIMIT
-- "in common"             \u2192 INTERSECT
-- "except / but not"      \u2192 EXCEPT or NOT EXISTS`,
    examples: [
      {
        title: 'Entity Integrity vs Referential Integrity',
        sql: `-- ENTITY INTEGRITY: PRIMARY KEY cannot be NULL
CREATE TABLE employees (
  id INT PRIMARY KEY,   -- id cannot be NULL
  name VARCHAR(100) NOT NULL
);

-- Violation: INSERT INTO employees VALUES (NULL, 'Alice');
-- ERROR: null value in column "id" violates not-null constraint

-- REFERENTIAL INTEGRITY: FOREIGN KEY references existing PK
CREATE TABLE orders (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id)
);

-- Violation: INSERT INTO orders VALUES (1, 999);
-- ERROR: insert or update violates foreign key constraint`,
        explanation: 'Entity Integrity prevents NULL in PK columns \u2014 every row must be uniquely identifiable. Referential Integrity ensures FK values reference existing PK values. The first protects row identity, the second protects relationship validity.',
      },
      {
        title: 'Common T/F Question Traps',
        sql: `-- TRUE or FALSE?
-- 1. "A table can have multiple FOREIGN KEYs" \u2192 TRUE
--    A table can reference multiple parent tables.

-- 2. "PRIMARY KEY automatically enforces UNIQUE and NOT NULL" \u2192 TRUE
--    PK implies both constraints.

-- 3. "DELETE FROM employees removes the table structure" \u2192 FALSE
--    DELETE removes rows, not structure. DROP TABLE removes the table.

-- 4. "A FOREIGN KEY column can contain NULLs" \u2192 TRUE
--    Unless declared NOT NULL, FK columns accept NULL.

-- 5. "ORDER BY can be used inside a UNION subquery" \u2192 FALSE
--    ORDER BY applies to the entire UNION result, not individual SELECTs.

-- 6. "NOT IN returns correct results even with NULLs in the subquery" \u2192 FALSE
--    NOT IN returns empty results if the subquery contains ANY NULL.

-- 7. "A composite PRIMARY KEY allows individual columns to be NULL" \u2192 FALSE
--    No component of a PK can be NULL (Entity Integrity).`,
        explanation: 'Exam questions test conceptual understanding of edge cases, not just syntax. Key facts to memorize: PK never allows NULL (even composite), FK allows NULL unless NOT NULL, NOT IN fails with NULLs, DELETE is DML not DDL, ORDER BY goes at the end of UNION.',
      },
      {
        title: 'Query Writing Playbook in Action',
        sql: `-- Question: "Find the names and salaries of Engineering employees
-- who have placed orders totaling more than $500. Show highest paid first."

-- Step 1: What to display?   \u2192 SELECT e.name, e.salary, SUM(o.total)
-- Step 2: Which tables?      \u2192 FROM employees e
-- Step 3: How to connect?    \u2192 JOIN orders o ON e.name = o.customer
-- Step 4: Filtering?         \u2192 WHERE e.department = 'Engineering'
-- Step 5: Grouping?          \u2192 GROUP BY e.name, e.salary
--                              HAVING SUM(o.total) > 500
-- Step 6: Sorting?           \u2192 ORDER BY e.salary DESC

SELECT e.name, e.salary, SUM(o.total) AS total_ordered
FROM employees e
JOIN orders o ON e.name = o.customer
WHERE e.department = 'Engineering'
GROUP BY e.name, e.salary
HAVING SUM(o.total) > 500
ORDER BY e.salary DESC;`,
        explanation: 'Walk through all 6 steps systematically. Step 5 (GROUP BY) is needed because the question asks for total per employee. If the question was "who placed at least one order over $500", you could skip GROUP BY and just use WHERE o.total > 500.',
      },
      {
        title: 'Full Exam-Style Solution',
        sql: `-- Question: "List all products that have been ordered by EVERY employee
-- in the Marketing department. Show the product name and category."

-- Step 1: Display:      \u2192 p.name, p.category
-- Step 2: Tables:       \u2192 products p, orders o, employees e
-- Step 3: Connect:      \u2192 p.id = o.product_id, o.customer = e.name
-- Step 4: Filter:       \u2192 e.department = 'Marketing'
-- Step 5: Grouping:     \u2192 Division pattern (for ALL)
-- Step 6: Sort:         \u2192 ORDER BY p.name

-- This is a division query in reverse: products ordered by ALL Marketing employees.

SELECT p.name, p.category
FROM products p
WHERE NOT EXISTS (
  SELECT e.name FROM employees e
  WHERE e.department = 'Marketing'
    AND NOT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.customer = e.name
        AND o.product_id = p.id
    )
)
ORDER BY p.name;

-- Alternative: COUNT approach
SELECT p.name, p.category
FROM products p
WHERE (
  SELECT COUNT(DISTINCT e.name)
  FROM employees e
  JOIN orders o ON e.name = o.customer
  WHERE e.department = 'Marketing'
    AND o.product_id = p.id
) = (
  SELECT COUNT(*) FROM employees WHERE department = 'Marketing'
)
ORDER BY p.name;`,
        explanation: 'A division query in reverse: instead of "employees who ordered ALL products", it asks for "products ordered by ALL employees" of a department. The double NOT EXISTS pattern adapts naturally to either direction by swapping which entity is the outer loop.',
      }
    ],
    commonMistakes: [
      'Aggregate in WHERE: Using aggregate functions like COUNT() directly in WHERE. Wrong: SELECT department FROM employees WHERE COUNT(*) > 5; Correct: Use HAVING: SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 5;',
      'LIKE with =: Using = instead of LIKE for pattern matching. Wrong: WHERE name = \'%son%\'; Correct: WHERE name LIKE \'%son%\';',
      'Missing join condition: Writing a JOIN without an ON clause (accidental Cartesian product). Wrong: SELECT * FROM employees JOIN orders; Correct: SELECT * FROM employees JOIN orders ON employees.name = orders.customer;',
      'Incompatible UNION: UNION queries with mismatched column counts or types. Wrong: SELECT name, salary FROM employees UNION SELECT id FROM products; Correct: Both SELECTs must have the same number and compatible types of columns.',
      'ORDER BY inside UNION: Using ORDER BY in individual SELECTs within a UNION. Wrong: SELECT name FROM employees ORDER BY name UNION SELECT name FROM products; Correct: ORDER BY goes at the very end of the entire UNION statement.',
      'NULL check with =: Using = NULL instead of IS NULL. Wrong: WHERE name = NULL; Correct: WHERE name IS NULL; (NULL is not a value, it is the absence of a value.)',
      'Forgetting GROUP BY: Selecting non-aggregated columns with aggregates. Wrong: SELECT department, COUNT(*) FROM employees; Correct: SELECT department, COUNT(*) FROM employees GROUP BY department;',
      'Column not in GROUP BY: Selecting a column that is neither in GROUP BY nor an aggregate. Wrong: SELECT name, department, COUNT(*) FROM employees GROUP BY department; Correct: Remove name from SELECT or add it to GROUP BY.',
      'No alias for subquery in FROM: Every derived table must have an alias. Wrong: SELECT * FROM (SELECT name FROM employees); Correct: SELECT * FROM (SELECT name FROM employees) AS e;',
      'NOT IN with NULLs: NOT IN returns empty results if the subquery contains any NULL. Wrong: WHERE id NOT IN (SELECT manager_id FROM employees); Correct: Use NOT EXISTS instead to avoid NULL issues.',
      'Wrong FK placement: Foreign key on the wrong table. Wrong: Adding FK to the parent table referencing the child. Correct: FK goes on the child (referencing) table pointing to the parent (referenced) table.',
      'Duplicate constraint name: Reusing the same constraint name within the same schema. Wrong: Two tables both using CONSTRAINT pk_id PRIMARY KEY (id); Correct: Use unique names like pk_employees and pk_products.'
    ],
    practiceQuestions: [
      {
        question: `Table: employees

Step-by-step: Use the 6-step playbook. "Find departments where the average salary is above $80,000. Show department name and average salary, sorted by highest average first."

Return columns: department, avg_salary
Order by: avg_salary DESC.`,
        hint: 'Step 1: SELECT department, AVG(salary). Step 2: FROM employees. Step 3: No JOIN. Step 4: No WHERE. Step 5: GROUP BY department HAVING AVG(salary) > 80000. Step 6: ORDER BY AVG(salary) DESC.',
        solution: `-- Step 1: What to display? → department, AVG(salary)
-- Step 2: Which tables? → employees
-- Step 3: How to connect? → No join (single table)
-- Step 4: Filtering? → No row-level filter
-- Step 5: Grouping? → GROUP BY department
--         HAVING AVG(salary) > 80000
-- Step 6: Sorting? → ORDER BY avg_salary DESC

SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 80000
ORDER BY avg_salary DESC;`
      },
      {
        question: `Debugging: The following query has TWO errors. Identify and fix them.
Query: SELECT name, department, COUNT(*) FROM employees WHERE COUNT(*) > 2 ORDER BY department;

Return columns: department, COUNT(*)
Order by: department ASC.`,
        hint: 'Error 1: COUNT(*) in WHERE (use HAVING instead). Error 2: name and department are not in GROUP BY. Fix: Remove name, add GROUP BY department, and move the COUNT filter to HAVING.',
        solution: `-- Error 1: Aggregate COUNT(*) used in WHERE clause
-- Error 2: Column 'name' selected but not in GROUP BY
-- Fixed query:
SELECT department, COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) > 2
ORDER BY department;`
      },
      {
        question: `True or False: Explain why each statement is T or F.
(a) NOT IN (SELECT ...) is always equivalent to NOT EXISTS (SELECT ...).
(b) A FOREIGN KEY column can contain duplicate values.
(c) TRUNCATE TABLE removes all rows and resets the identity counter.
(d) You can use ORDER BY inside an individual SELECT of a UNION.

Return columns: (explanatory — no columns returned)
Order by: N/A.`,
        hint: '(a) FALSE — NOT IN fails with NULLs in subquery. (b) TRUE — FK allows duplicates unless UNIQUE. (c) TRUE — TRUNCATE resets identity counters. (d) FALSE — ORDER BY goes at the end of the entire UNION.',
        solution: `-- (a) FALSE: NOT IN returns empty if subquery contains ANY NULL.
-- NOT EXISTS handles NULLs correctly. Prefer NOT EXISTS.

-- (b) TRUE: A FOREIGN KEY column can have duplicates
-- unless it also has a UNIQUE constraint. FK only ensures
-- values exist in the parent table.

-- (c) TRUE: TRUNCATE TABLE removes all rows and resets
-- auto-increment/identity counters. It is DDL, not DML.

-- (d) FALSE: ORDER BY cannot be used inside individual
-- SELECT statements of a UNION. It must be at the very end,
-- applying to the entire UNION result.`
      },
      {
        question: `Table: employees, orders

Challenge (exam-style): Find the name of the employee who has spent the most money across all their orders. If there is a tie, show all tied employees.

Return columns: name, total_spent
Order by: name ASC.`,
        hint: 'Use a window function: RANK() OVER (ORDER BY SUM(o.total) DESC). Wrap in a subquery and filter WHERE rnk = 1 to handle ties.',
        solution: `SELECT name, total_spent
FROM (
  SELECT e.name, SUM(o.total) AS total_spent,
         RANK() OVER (ORDER BY SUM(o.total) DESC) AS rnk
  FROM employees e
  JOIN orders o ON e.name = o.customer
  GROUP BY e.name
) ranked
WHERE rnk = 1
ORDER BY name;`
      }
    ]
  }
]
