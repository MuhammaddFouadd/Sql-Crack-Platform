export interface PracticeProblem {
  id: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  hint: string
  solution: string
}

export const practiceProblems: PracticeProblem[] = [
  {
    id: 'pp-1', topic: 'SELECT', difficulty: 'easy',
    question: `Table: employees

Write a solution to show the name and salary of every employee.

Return columns: name, salary
Order by: any order.`,
    hint: 'Use SELECT column1, column2 FROM table',
    solution: 'SELECT name, salary FROM employees;'
  },
  {
    id: 'pp-2', topic: 'WHERE', difficulty: 'easy',
    question: `Table: products

Find all products with a price greater than 100.

Return columns: all columns (*)
Order by: any order.`,
    hint: 'Use WHERE price > 100',
    solution: 'SELECT * FROM products WHERE price > 100;'
  },
  {
    id: 'pp-3', topic: 'ORDER BY', difficulty: 'easy',
    question: `Table: departments

List all departments sorted by name in reverse alphabetical order.

Return columns: all columns (*)
Order by: name DESC.`,
    hint: 'Use ORDER BY name DESC',
    solution: 'SELECT * FROM departments ORDER BY name DESC;'
  },
  {
    id: 'pp-4', topic: 'JOINs', difficulty: 'medium',
    question: `Table: employees, departments

Find the names of employees along with their department names.

Return columns: employee name, department name
Order by: any order.`,
    hint: 'JOIN employees and departments on department_id = id',
    solution: 'SELECT e.name, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id;'
  },
  {
    id: 'pp-5', topic: 'GROUP BY', difficulty: 'medium',
    question: `Table: employees

Count how many employees work in each department.

Return columns: department_id, emp_count
Order by: any order.`,
    hint: 'Use GROUP BY department_id with COUNT(*)',
    solution: 'SELECT department_id, COUNT(*) AS emp_count FROM employees GROUP BY department_id;'
  },
  {
    id: 'pp-6', topic: 'HAVING', difficulty: 'medium',
    question: `Table: employees

Find departments that have more than 3 employees.

Return columns: department_id, emp_count
Order by: any order.`,
    hint: 'Use GROUP BY then HAVING COUNT(*) > 3',
    solution: 'SELECT department_id, COUNT(*) AS emp_count FROM employees GROUP BY department_id HAVING COUNT(*) > 3;'
  },
  {
    id: 'pp-7', topic: 'Subqueries', difficulty: 'medium',
    question: `Table: employees

Find employees who earn more than the average company salary.

Return columns: all columns (*)
Order by: any order.`,
    hint: 'Use WHERE salary > (SELECT AVG(salary) FROM employees)',
    solution: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);'
  },
  {
    id: 'pp-8', topic: 'CASE WHEN', difficulty: 'medium',
    question: `Table: employees

Categorize each employee by salary:
- "High" if salary > 70000
- "Medium" if salary > 40000
- "Low" otherwise

Return columns: name, salary, category
Order by: any order.`,
    hint: "Use CASE WHEN salary > 70000 THEN 'High' ... END",
    solution: "SELECT name, salary, CASE WHEN salary > 70000 THEN 'High' WHEN salary > 40000 THEN 'Medium' ELSE 'Low' END AS category FROM employees;"
  },
  {
    id: 'pp-9', topic: 'CTEs', difficulty: 'hard',
    question: `Table: employees, departments

Use a CTE to find the department with the highest average salary.
Return: department name, average salary
Order by: any order (only 1 row).`,
    hint: 'WITH dept_avg AS (... ) SELECT ... JOIN ... ORDER BY ... LIMIT 1',
    solution: "WITH dept_avg AS (SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id) SELECT d.name, da.avg_sal FROM dept_avg da JOIN departments d ON da.department_id = d.id ORDER BY da.avg_sal DESC LIMIT 1;"
  },
  {
    id: 'pp-10', topic: 'Window Functions', difficulty: 'hard',
    question: `Table: employees

Rank employees by salary within each department (highest salary = rank 1).
Use RANK() and allow gaps for ties.

Return columns: name, department_id, salary, salary_rank
Order by: department_id ASC, salary DESC.`,
    hint: 'Use RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)',
    solution: 'SELECT name, department_id, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees;'
  },
  {
    id: 'pp-11', topic: 'Set Operations', difficulty: 'medium',
    question: `Table: departments, employees

Find all unique cities that appear in either departments or employees.

Return columns: city
Order by: any order.`,
    hint: 'Use UNION between two SELECT queries on cities',
    solution: 'SELECT city FROM departments UNION SELECT city FROM employees;'
  },
  {
    id: 'pp-12', topic: 'EXISTS / NOT EXISTS', difficulty: 'hard',
    question: `Table: departments, employees

Find departments that have no employees assigned.
Use a correlated subquery with NOT EXISTS.

Return columns: all department columns (*)
Order by: any order.`,
    hint: 'Use NOT EXISTS with a correlated subquery',
    solution: 'SELECT * FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.id);'
  },
  {
    id: 'pp-13', topic: 'String Functions', difficulty: 'easy',
    question: `Table: employees

Display employee names in uppercase.

Return columns: name_upper
Order by: any order.`,
    hint: 'Use UPPER() function',
    solution: 'SELECT UPPER(name) AS name_upper FROM employees;'
  },
  {
    id: 'pp-14', topic: 'Pattern Matching', difficulty: 'easy',
    question: `Table: employees

Find all employees whose name starts with "J".

Return columns: all columns (*)
Order by: any order.`,
    hint: "Use WHERE name LIKE 'J%'",
    solution: "SELECT * FROM employees WHERE name LIKE 'J%';"
  },
  {
    id: 'pp-15', topic: 'DML', difficulty: 'medium',
    question: `Table: employees

Give a 10% raise to all employees in department_id = 3.
This is a DML operation, not a SELECT.

Return: no result set (UPDATE statement).`,
    hint: 'Use UPDATE ... SET salary = salary * 1.1 WHERE department_id = 3',
    solution: 'UPDATE employees SET salary = salary * 1.1 WHERE department_id = 3;'
  },
  {
    id: 'pp-16', topic: 'DDL', difficulty: 'medium',
    question: `Table: N/A (DDL)

Create a table called "projects" with the following schema:
- id: INTEGER PRIMARY KEY
- name: TEXT NOT NULL
- budget: REAL

Return: no result set (CREATE TABLE statement).`,
    hint: 'Use CREATE TABLE with column definitions and PRIMARY KEY',
    solution: 'CREATE TABLE projects (id INTEGER PRIMARY KEY, name TEXT NOT NULL, budget REAL);'
  },
  {
    id: 'pp-17', topic: 'Division', difficulty: 'hard',
    question: `Table: employees, projects, employee_projects (assumed)

Find employees who work on ALL projects.
Use double NOT EXISTS (relational division).

Return columns: all employee columns (*)
Order by: any order.`,
    hint: 'Use double NOT EXISTS or GROUP BY with COUNT and HAVING',
    solution: "SELECT * FROM employees e WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE NOT EXISTS (SELECT 1 FROM employee_projects ep WHERE ep.employee_id = e.id AND ep.project_id = p.id));"
  },
  {
    id: 'pp-18', topic: 'Keys', difficulty: 'medium',
    question: `Table: N/A (theory)

What SQL constraint ensures a column cannot store NULL values?

Return: a single sentence describing the constraint and its syntax.`,
    hint: 'It is part of the column definition in CREATE TABLE',
    solution: 'NOT NULL constraint. Add it after the column type: column_name TYPE NOT NULL'
  },
  {
    id: 'pp-19', topic: 'Relational Algebra', difficulty: 'hard',
    question: `Table: N/A (theory)

Which relational algebra operation corresponds to SQL's WHERE clause?
Name the operation and its symbol.

Return: a short answer describing the operation.`,
    hint: 'Think about the Greek letter used.',
    solution: 'SELECT (σ / sigma). It filters tuples (rows) based on a predicate.'
  },
  {
    id: 'pp-20', topic: 'JOINs', difficulty: 'medium',
    question: `Table: employees, departments

Find employees who are not assigned to any department (their department_id has no match in departments).

Return columns: all employee columns (*)
Order by: any order.`,
    hint: 'Use LEFT JOIN and check for NULL on the department side',
    solution: 'SELECT e.* FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE d.id IS NULL;'
  },
]
