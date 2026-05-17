export interface LeetCodeProblem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  problemStatement: string
  keyConcept: string
  hint: string
  solution: string
  optimizedSolution?: string
  explanation: string
  tables: { name: string; columns: string[]; data: string[][] }[]
}

export const leetcodeProblems: LeetCodeProblem[] = [
  {
    id: 'combine-two-tables',
    title: 'Combine Two Tables',
    difficulty: 'easy',
    problemStatement: `Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a person is not present in the Address table, report null instead.

Table: Person
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| personId    | int     |
| firstName   | varchar |
| lastName    | varchar |
+-------------+---------+
personId is the primary key.

Table: Address
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| addressId   | int     |
| personId    | int     |
| city        | varchar |
| state       | varchar |
+-------------+---------+
addressId is the primary key.`,
    keyConcept: 'LEFT JOIN',
    hint: 'Use a LEFT JOIN from Person to Address on personId. This ensures all persons appear even if they have no address record.',
    solution: `SELECT 
  p.firstName, 
  p.lastName, 
  a.city, 
  a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;`,
    optimizedSolution: 'The query is already optimal. An index on Address.personId would make the join faster.',
    explanation: 'LEFT JOIN preserves all rows from the left table (Person). When no matching address exists, the Address columns become NULL.',
    tables: [
      { name: 'Person', columns: ['personId', 'firstName', 'lastName'], data: [['1', 'John', 'Doe'], ['2', 'Jane', 'Smith']] },
      { name: 'Address', columns: ['addressId', 'personId', 'city', 'state'], data: [['1', '2', 'New York', 'NY']] }
    ]
  },
  {
    id: 'second-highest-salary',
    title: 'Second Highest Salary',
    difficulty: 'medium',
    problemStatement: `Find the second highest salary from the Employee table. If there is no second highest salary, return null.

Table: Employee
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| salary      | int  |
+-------------+------+
id is the primary key.`,
    keyConcept: 'DISTINCT, LIMIT/OFFSET, or window functions',
    hint: 'Use a subquery with DISTINCT, ORDER BY salary DESC, LIMIT 1 OFFSET 1. Wrap in another SELECT to get NULL when no result.',
    solution: `SELECT (
  SELECT DISTINCT salary
  FROM Employee
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
    optimizedSolution: `SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
    explanation: 'The subquery approach gets the distinct salaries in descending order, skips the highest, and takes the next. The outer SELECT ensures NULL is returned if there is no second highest. The optimized version uses MAX with a WHERE clause, which can leverage an index on salary.',
    tables: [
      { name: 'Employee', columns: ['id', 'salary'], data: [['1', '100'], ['2', '200'], ['3', '300']] }
    ]
  },
  {
    id: 'duplicate-emails',
    title: 'Duplicate Emails',
    difficulty: 'easy',
    problemStatement: `Write a solution to report all the duplicate emails from the Person table.

Table: Person
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| email       | varchar |
+-------------+---------+
id is the primary key.`,
    keyConcept: 'GROUP BY with HAVING',
    hint: 'Group by email and use HAVING COUNT(*) > 1 to find duplicates.',
    solution: `SELECT email AS Email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;`,
    explanation: 'Group rows by email, count how many times each appears, and keep only those appearing more than once.',
    tables: [
      { name: 'Person', columns: ['id', 'email'], data: [['1', 'a@b.com'], ['2', 'c@d.com'], ['3', 'a@b.com']] }
    ]
  },
  {
    id: 'customers-who-never-order',
    title: 'Customers Who Never Order',
    difficulty: 'easy',
    problemStatement: `Find all customers who never order anything.

Table: Customers
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+

Table: Orders
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| customerId  | int  |
+-------------+------+`,
    keyConcept: 'LEFT JOIN or NOT EXISTS',
    hint: 'Use LEFT JOIN and check for NULL in Orders, or use NOT EXISTS with a correlated subquery.',
    solution: `SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;`,
    optimizedSolution: `SELECT name AS Customers
FROM Customers c
WHERE NOT EXISTS (
  SELECT 1 FROM Orders o WHERE o.customerId = c.id
);`,
    explanation: 'LEFT JOIN from Customers to Orders: customers without orders will have NULL in the Orders columns. NOT EXISTS is often more efficient as it stops scanning once a match is found.',
    tables: [
      { name: 'Customers', columns: ['id', 'name'], data: [['1', 'Alice'], ['2', 'Bob'], ['3', 'Charlie']] },
      { name: 'Orders', columns: ['id', 'customerId'], data: [['1', '1'], ['2', '1']] }
    ]
  },
  {
    id: 'department-top-three',
    title: 'Department Top Three Salaries',
    difficulty: 'hard',
    problemStatement: `Find the top three unique salaries for each department. If there are fewer than three employees in a department, return all employees.

Table: Employee
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| salary      | int     |
| departmentId| int     |
+-------------+---------+

Table: Department
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+`,
    keyConcept: 'DENSE_RANK with window functions',
    hint: 'Use DENSE_RANK() PARTITION BY departmentId ORDER BY salary DESC. DENSE_RANK handles ties correctly.',
    solution: `SELECT 
  d.name AS Department,
  e.name AS Employee,
  e.salary AS Salary
FROM (
  SELECT 
    *,
    DENSE_RANK() OVER (
      PARTITION BY departmentId 
      ORDER BY salary DESC
    ) AS rank
  FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rank <= 3;`,
    explanation: 'DENSE_RANK assigns the same rank to equal salaries without skipping numbers. Filtering rank <= 3 gives the top three unique salary tiers per department.',
    tables: [
      { name: 'Employee', columns: ['id', 'name', 'salary', 'departmentId'], data: [['1', 'Alice', '1000', '1'], ['2', 'Bob', '900', '1'], ['3', 'Carol', '900', '1'], ['4', 'Dave', '800', '1'], ['5', 'Eve', '700', '2']] },
      { name: 'Department', columns: ['id', 'name'], data: [['1', 'Engineering'], ['2', 'Sales']] }
    ]
  },
  {
    id: 'rank-scores',
    title: 'Rank Scores',
    difficulty: 'medium',
    problemStatement: `Write a solution to rank the scores. The ranking should be calculated as follows:
- The scores should be ranked from highest to lowest.
- If there is a tie, both should have the same rank.
- After a tie, the next ranking number should be the next consecutive integer (DENSE_RANK).
- Return the result ordered by score descending.

Table: Scores
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| score       | int  |
+-------------+------+`,
    keyConcept: 'DENSE_RANK',
    hint: 'DENSE_RANK with ORDER BY score DESC gives consecutive ranks for tied scores.',
    solution: `SELECT 
  score,
  DENSE_RANK() OVER (ORDER BY score DESC) AS rank
FROM Scores
ORDER BY score DESC;`,
    explanation: 'DENSE_RANK numbers rows consecutively within partitions. Tied scores get the same rank, and no ranks are skipped.',
    tables: [
      { name: 'Scores', columns: ['id', 'score'], data: [['1', '90'], ['2', '85'], ['3', '90'], ['4', '80'], ['5', '75']] }
    ]
  },
  {
    id: 'consecutive-numbers',
    title: 'Consecutive Numbers',
    difficulty: 'medium',
    problemStatement: `Find all numbers that appear at least three times consecutively.

Table: Logs
+-------------+------+
| Column Name | Type |
+-------------+------+
| id          | int  |
| num         | int  |
+-------------+------+
id is the primary key and is an auto-incrementing integer.`,
    keyConcept: 'Self-join or LEAD/LAG window functions',
    hint: 'Use LAG(num, 1) and LAG(num, 2) to look back at previous rows, then check if all three are equal.',
    solution: `SELECT DISTINCT num AS ConsecutiveNums
FROM (
  SELECT 
    num,
    LAG(num, 1) OVER (ORDER BY id) AS prev1,
    LAG(num, 2) OVER (ORDER BY id) AS prev2
  FROM Logs
) t
WHERE num = prev1 AND num = prev2;`,
    explanation: 'LAG retrieves the value from the previous row. If num equals both the immediate previous and the one before that, it appears three times consecutively.',
    tables: [
      { name: 'Logs', columns: ['id', 'num'], data: [['1', '1'], ['2', '1'], ['3', '1'], ['4', '2'], ['5', '1']] }
    ]
  },
  {
    id: 'exchange-seats',
    title: 'Exchange Seats',
    difficulty: 'medium',
    problemStatement: `Swap the seat id of every two consecutive students. If the number of students is odd, the last student's id remains unchanged.

Table: Seat
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| student     | varchar |
+-------------+---------+
id is the primary key and is a continuous integer.`,
    keyConcept: 'CASE WHEN with LEAD/LAG',
    hint: 'Use a CASE statement: if id is odd and not the last, swap with id+1; if id is even, swap with id-1.',
    solution: `SELECT 
  CASE 
    WHEN id % 2 = 1 AND LEAD(student) OVER (ORDER BY id) IS NOT NULL 
      THEN id + 1
    WHEN id % 2 = 0 
      THEN id - 1
    ELSE id
  END AS id,
  CASE 
    WHEN id % 2 = 1 AND LEAD(student) OVER (ORDER BY id) IS NOT NULL 
      THEN LEAD(student) OVER (ORDER BY id)
    WHEN id % 2 = 0 
      THEN LAG(student) OVER (ORDER BY id)
    ELSE student
  END AS student
FROM Seat
ORDER BY id;`,
    explanation: 'For odd ids (except the last), take the next student. For even ids, take the previous student. The last odd id (if total count is odd) keeps its student.',
    tables: [
      { name: 'Seat', columns: ['id', 'student'], data: [['1', 'Alice'], ['2', 'Bob'], ['3', 'Carol'], ['4', 'Dave'], ['5', 'Eve']] }
    ]
  },
  {
    id: 'department-highest-salary',
    title: 'Department Highest Salary',
    difficulty: 'medium',
    problemStatement: `Find employees who have the highest salary in each department.

Table: Employee
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
| salary      | int     |
| departmentId| int     |
+-------------+---------+

Table: Department
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+`,
    keyConcept: 'RANK or MAX with window function',
    hint: 'Use RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) and filter rank = 1.',
    solution: `SELECT 
  d.name AS Department,
  e.name AS Employee,
  e.salary AS Salary
FROM (
  SELECT 
    *,
    RANK() OVER (
      PARTITION BY departmentId 
      ORDER BY salary DESC
    ) AS rank
  FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rank = 1;`,
    explanation: 'RANK assigns 1 to the highest salary(s). If multiple employees tie for the highest salary, they all rank 1. JOIN with Department to get the department name.',
    tables: [
      { name: 'Employee', columns: ['id', 'name', 'salary', 'departmentId'], data: [['1', 'Alice', '1000', '1'], ['2', 'Bob', '900', '1'], ['3', 'Carol', '1000', '1']] },
      { name: 'Department', columns: ['id', 'name'], data: [['1', 'Engineering']] }
    ]
  },
  {
    id: 'human-traffic',
    title: 'Human Traffic of Stadium',
    difficulty: 'hard',
    problemStatement: `Find records where the number of people is at least 100 for three or more consecutive rows. Return results ordered by visit_date.

Table: Stadium
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| id            | int     |
| visit_date    | date    |
| people        | int     |
+---------------+---------+
visit_date is the primary key.`,
    keyConcept: 'Gaps and islands with ROW_NUMBER',
    hint: 'Use ROW_NUMBER() to create a group identifier: subtract ROW_NUMBER() from id after filtering for people >= 100. Consecutive rows will share the same difference.',
    solution: `WITH filtered AS (
  SELECT *,
    id - ROW_NUMBER() OVER (ORDER BY id) AS grp
  FROM Stadium
  WHERE people >= 100
)
SELECT id, visit_date, people
FROM filtered
WHERE grp IN (
  SELECT grp FROM filtered
  GROUP BY grp
  HAVING COUNT(*) >= 3
)
ORDER BY visit_date;`,
    explanation: 'This is the classic gaps-and-islands pattern. After filtering rows with >= 100 people, consecutive rows get the same grp value (since id increments by 1 and ROW_NUMBER also increments by 1). Group by grp to find islands of 3 or more consecutive rows.',
    tables: [
      { name: 'Stadium', columns: ['id', 'visit_date', 'people'], data: [['1', '2024-01-01', '150'], ['2', '2024-01-02', '120'], ['3', '2024-01-03', '200'], ['4', '2024-01-04', '50'], ['5', '2024-01-05', '180'], ['6', '2024-01-06', '190'], ['7', '2024-01-07', '210']] }
    ]
  }
]
