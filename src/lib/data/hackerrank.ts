export interface HackerRankExercise {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  problemStatement: string
  solution: string
  explanation: string
}

export const hackerrankExercises: HackerRankExercise[] = [
  {
    id: 'revising-select',
    title: 'Revising the Select Query I',
    difficulty: 'easy',
    category: 'Basic Select',
    problemStatement: `Query all columns for all American cities in the CITY table with a population larger than 100,000. The CountryCode for America is 'USA'.

The CITY table is described as follows:
+-------------+-------------+
| Field       | Type        |
+-------------+-------------+
| ID          | NUMBER      |
| NAME        | VARCHAR2(17)|
| COUNTRYCODE | VARCHAR2(3) |
| DISTRICT    | VARCHAR2(20)|
| POPULATION  | NUMBER      |
+-------------+-------------+`,
    solution: `SELECT *
FROM CITY
WHERE COUNTRYCODE = 'USA'
  AND POPULATION > 100000;`,
    explanation: 'Simple WHERE clause with two conditions joined by AND.'
  },
  {
    id: 'revising-select-2',
    title: 'Revising the Select Query II',
    difficulty: 'easy',
    category: 'Basic Select',
    problemStatement: `Query the NAME field for all American cities in the CITY table with populations larger than 120,000. The CountryCode for America is 'USA'.`,
    solution: `SELECT NAME
FROM CITY
WHERE COUNTRYCODE = 'USA'
  AND POPULATION > 120000;`,
    explanation: 'Similar to the previous query, but only select the NAME column.'
  },
  {
    id: 'average-population',
    title: 'Average Population',
    difficulty: 'easy',
    category: 'Aggregation',
    problemStatement: `Query the average population for all cities in the CITY table, rounded down to the nearest integer.`,
    solution: `SELECT FLOOR(AVG(POPULATION))
FROM CITY;`,
    explanation: 'AVG calculates the average, FLOOR rounds down to the nearest integer.'
  },
  {
    id: 'population-density',
    title: 'Population Density Difference',
    difficulty: 'easy',
    category: 'Aggregation',
    problemStatement: `Query the difference between the maximum and minimum populations in the CITY table.`,
    solution: `SELECT MAX(POPULATION) - MIN(POPULATION)
FROM CITY;`,
    explanation: 'Simple arithmetic between two aggregate functions.'
  },
  {
    id: 'the-blunder',
    title: 'The Blunder',
    difficulty: 'easy',
    category: 'Aggregation',
    problemStatement: `Samantha calculated the average salary incorrectly by removing zeros from the salaries. Write a query to calculate the error (the difference between the actual average and the miscalculated average).

The EMPLOYEES table:
+-------------+-------------+
| Column      | Type        |
+-------------+-------------+
| ID          | INTEGER     |
| NAME        | STRING      |
| SALARY      | INTEGER     |
+-------------+-------------+`,
    solution: `SELECT CEIL(
  AVG(SALARY) - AVG(REPLACE(SALARY, '0', ''))
)
FROM EMPLOYEES;`,
    explanation: 'REPLACE removes all zeros from the salary string. AVG the original and modified salaries, subtract, and round up with CEIL.'
  },
  {
    id: 'earnings-of-employees',
    title: 'Top Earners',
    difficulty: 'easy',
    category: 'Aggregation',
    problemStatement: `Find the maximum total earnings (salary * months) and the number of employees who have that maximum total earnings.

The EMPLOYEE table:
+-------------+-------------+
| Column      | Type        |
+-------------+-------------+
| employee_id | INTEGER     |
| name        | STRING      |
| months      | INTEGER     |
| salary      | INTEGER     |
+-------------+-------------+`,
    solution: `SELECT 
  months * salary AS earnings,
  COUNT(*)
FROM EMPLOYEE
GROUP BY months * salary
ORDER BY earnings DESC
LIMIT 1;`,
    explanation: 'Group by total earnings, order descending, and take the top result with its count.'
  },
  {
    id: 'weather-observation-5',
    title: 'Weather Observation Station 5',
    difficulty: 'easy',
    category: 'Basic Select',
    problemStatement: `Query the two cities in the STATION table with the shortest and longest city names, as well as their respective lengths. If there is more than one smallest or largest city, choose the one that comes first alphabetically.

The STATION table:
+-------------+-------------+
| Field       | Type        |
+-------------+-------------+
| ID          | NUMBER      |
| CITY        | VARCHAR2(21)|
| STATE       | VARCHAR2(2) |
| LAT_N       | NUMBER      |
| LONG_W      | NUMBER      |
+-------------+-------------+`,
    solution: `(SELECT CITY, LENGTH(CITY) AS len
FROM STATION
ORDER BY LENGTH(CITY), CITY
LIMIT 1)
UNION ALL
(SELECT CITY, LENGTH(CITY) AS len
FROM STATION
ORDER BY LENGTH(CITY) DESC, CITY
LIMIT 1);`,
    explanation: 'Two ordered queries: one ascending by length (and alphabetically for ties) with LIMIT 1, one descending. UNION ALL combines the results.'
  },
  {
    id: 'japan-population',
    title: 'Japan Population',
    difficulty: 'easy',
    category: 'Aggregation',
    problemStatement: `Query the sum of the populations for all Japanese cities in the CITY table. The COUNTRYCODE for Japan is 'JPN'.`,
    solution: `SELECT SUM(POPULATION)
FROM CITY
WHERE COUNTRYCODE = 'JPN';`,
    explanation: 'Filter by COUNTRYCODE and sum the populations.'
  },
  {
    id: 'african-cities',
    title: 'African Cities',
    difficulty: 'easy',
    category: 'Basic Join',
    problemStatement: `Given the CITY and COUNTRY tables, query the names of all cities where the continent is 'Africa'.

Note: CITY.CountryCode and COUNTRY.Code are matching key columns.`,
    solution: `SELECT c.NAME
FROM CITY c
JOIN COUNTRY co ON c.COUNTRYCODE = co.CODE
WHERE co.CONTINENT = 'Africa';`,
    explanation: 'Simple INNER JOIN between CITY and COUNTRY, filtering by continent.'
  },
  {
    id: 'average-population-continent',
    title: 'Average Population of Each Continent',
    difficulty: 'easy',
    category: 'Basic Join',
    problemStatement: `Given the CITY and COUNTRY tables, query the names of all the continents and their respective average city populations, rounded down to the nearest integer.`,
    solution: `SELECT 
  co.CONTINENT,
  FLOOR(AVG(c.POPULATION))
FROM CITY c
JOIN COUNTRY co ON c.COUNTRYCODE = co.CODE
GROUP BY co.CONTINENT;`,
    explanation: 'Join CITY with COUNTRY, group by continent, and calculate the floored average population.'
  },
  {
    id: 'the-report',
    title: 'The Report',
    difficulty: 'medium',
    category: 'Basic Join',
    problemStatement: `Generate a report containing three columns: Name, Grade, and Marks. Students who have a grade less than 8 receive NULL as their name (show "NULL" or omit the name). The grades are:

Grade 1: 0-9, Grade 2: 10-19, ..., Grade 10: 90-100

Tables:
+-------------+-------------+     +-------------+----------+
| Students    |             |     | Grades      |          |
+-------------+-------------+     +-------------+----------+
| ID          | INTEGER     |     | GRADE       | INTEGER  |
| NAME        | STRING      |     | MIN_MARK    | INTEGER  |
| MARKS       | INTEGER     |     | MAX_MARK    | INTEGER  |
+-------------+-------------+     +-------------+----------+`,
    solution: `SELECT 
  CASE WHEN g.GRADE >= 8 THEN s.NAME ELSE NULL END,
  g.GRADE,
  s.MARKS
FROM STUDENTS s
JOIN GRADES g ON s.MARKS BETWEEN g.MIN_MARK AND g.MAX_MARK
ORDER BY g.GRADE DESC, s.NAME;`,
    explanation: 'Join Students to Grades using BETWEEN. Use CASE to hide names for grades below 8. Order by grade descending then name.'
  },
  {
    id: 'ollivander-inventory',
    title: 'Ollivander\'s Inventory',
    difficulty: 'medium',
    category: 'Basic Join',
    problemStatement: `Harry Potter's wands require both age and power to determine their value. Find the minimum number of gold galleons needed to buy each non-evil wand of high power and age.

Write a query to print the id, age, coins_needed, and power of the wands that Ron's interested in, sorted by power descending, and age descending.

Tables:
+----------------+----------+  +------------------+----------+
| WANDS          |          |  | WANDS_PROPERTY    |          |
+----------------+----------+  +------------------+----------+
| ID             | INTEGER  |  | CODE             | INTEGER  |
| CODE           | INTEGER  |  | AGE              | INTEGER  |
| COINS_NEEDED   | INTEGER  |  | IS_EVIL          | INTEGER  |
| POWER          | INTEGER  |  +------------------+----------+
+----------------+----------+`,
    solution: `SELECT 
  w.ID,
  wp.AGE,
  w.COINS_NEEDED,
  w.POWER
FROM WANDS w
JOIN WANDS_PROPERTY wp ON w.CODE = wp.CODE
WHERE wp.IS_EVIL = 0
  AND w.COINS_NEEDED = (
    SELECT MIN(coins_needed)
    FROM WANDS
    WHERE CODE = w.CODE AND POWER = w.POWER
  )
ORDER BY w.POWER DESC, wp.AGE DESC;`,
    explanation: 'A correlated subquery finds the minimum coins_needed for each code/power combination. The outer query filters to only those wands.'
  },
  {
    id: 'occupations',
    title: 'Occupations',
    difficulty: 'medium',
    category: 'Advanced Select',
    problemStatement: `Pivot the Occupation column in OCCUPATIONS so that each Name is sorted alphabetically and displayed underneath its corresponding Occupation. The output column headers should be Doctor, Professor, Singer, and Actor, respectively.

Note: Print NULL when there are no more names corresponding to an occupation.

Table: OCCUPATIONS
+-------------+----------+
| Column      | Type     |
+-------------+----------+
| NAME        | STRING   |
| OCCUPATION  | STRING   |
+-------------+----------+`,
    solution: `WITH numbered AS (
  SELECT 
    NAME,
    OCCUPATION,
    ROW_NUMBER() OVER (
      PARTITION BY OCCUPATION 
      ORDER BY NAME
    ) AS rn
  FROM OCCUPATIONS
)
SELECT 
  MAX(CASE WHEN OCCUPATION = 'Doctor' THEN NAME END) AS Doctor,
  MAX(CASE WHEN OCCUPATION = 'Professor' THEN NAME END) AS Professor,
  MAX(CASE WHEN OCCUPATION = 'Singer' THEN NAME END) AS Singer,
  MAX(CASE WHEN OCCUPATION = 'Actor' THEN NAME END) AS Actor
FROM numbered
GROUP BY rn
ORDER BY rn;`,
    explanation: 'ROW_NUMBER assigns a row number within each occupation. The GROUP BY rn with conditional aggregation pivots the data into columns.'
  },
  {
    id: 'binary-tree-nodes',
    title: 'Binary Tree Nodes',
    difficulty: 'medium',
    category: 'Advanced Select',
    problemStatement: `You are given a table BST containing two columns: N and P, where N represents a node in a binary tree, and P is the parent of N. Write a query to find the type of each node:
- Root: if P is NULL
- Leaf: if N is not in any other row's P column
- Inner: otherwise

Order by N.`,
    solution: `SELECT 
  N,
  CASE 
    WHEN P IS NULL THEN 'Root'
    WHEN N IN (SELECT DISTINCT P FROM BST WHERE P IS NOT NULL) THEN 'Inner'
    ELSE 'Leaf'
  END AS NodeType
FROM BST
ORDER BY N;`,
    explanation: 'Root nodes have NULL parent. Inner nodes appear as a parent for at least one other node. Everything else is a Leaf.'
  },
  {
    id: 'placements',
    title: 'Placements',
    difficulty: 'medium',
    category: 'Advanced Join',
    problemStatement: `Find the names of all students who are friends with someone who has a different salary offer than them.

Tables:
+----------------+----------+   +-------------+----------+
| STUDENTS       |          |   | FRIENDS     |          |
+----------------+----------+   +-------------+----------+
| ID             | INTEGER  |   | ID          | INTEGER  |
| NAME           | STRING   |   | FRIEND_ID   | INTEGER  |
+----------------+----------+   +-------------+----------+

+-------------+----------+
| PACKAGES    |          |
+-------------+----------+
| ID          | INTEGER  |
| SALARY      | FLOAT    |
+-------------+----------+`,
    solution: `SELECT s.NAME
FROM STUDENTS s
JOIN FRIENDS f ON s.ID = f.ID
JOIN PACKAGES p1 ON s.ID = p1.ID
JOIN PACKAGES p2 ON f.FRIEND_ID = p2.ID
WHERE p1.SALARY > p2.SALARY
ORDER BY p1.SALARY DESC;`,
    explanation: 'The question asks for students whose salary is greater than their friend\'s. Join Students → Friends → Packages (own salary) → Packages (friend\'s salary). Filter where own salary > friend\'s salary.'
  },
  {
    id: 'symmetric-pairs',
    title: 'Symmetric Pairs',
    difficulty: 'hard',
    category: 'Advanced Join',
    problemStatement: `Given a table FUNCTIONS with columns X and Y, find all symmetric pairs (X, Y) and (Y, X). Each pair should be listed once with X <= Y. Order by X.`,
    solution: `SELECT f1.X, f1.Y
FROM FUNCTIONS f1
JOIN FUNCTIONS f2 ON f1.X = f2.Y AND f1.Y = f2.X
WHERE f1.X < f1.Y
UNION
SELECT X, Y
FROM FUNCTIONS
WHERE X = Y
GROUP BY X, Y
HAVING COUNT(*) > 1
ORDER BY X;`,
    explanation: 'For non-equal pairs (X != Y), join the table with itself matching X to Y and Y to X. For equal pairs (X = Y), they need to appear at least twice to form a symmetric pair.'
  },
  {
    id: 'interviews',
    title: 'Interviews',
    difficulty: 'hard',
    category: 'Advanced Join',
    problemStatement: `Samantha interviews candidates for different colleges. Write a query to output the contest_id, hacker_id, name, and the sums of total_submissions, total_accepted_submissions, total_views, and total_unique_views for each contest.

Tables:
+-----------------+----------+  +------------------+----------+
| CONTESTS        |          |  | COLLEGES         |          |
+-----------------+----------+  +------------------+----------+
| contest_id      | INTEGER  |  | college_id       | INTEGER  |
| hacker_id       | INTEGER  |  | contest_id       | INTEGER  |
| name            | STRING   |  +------------------+----------+
+-----------------+----------+

+------------------+----------+  +---------------------+----------+
| CHALLENGES       |          |  | VIEW_STATS          |          |
+------------------+----------+  +---------------------+----------+
| challenge_id     | INTEGER  |  | challenge_id        | INTEGER  |
| college_id       | INTEGER  |  | total_views         | INTEGER  |
+------------------+----------+  | total_unique_views  | INTEGER  |
                                 +---------------------+----------+

+---------------------+----------+
| SUBMISSION_STATS    |          |
+---------------------+----------+
| challenge_id        | INTEGER  |
| total_submissions   | INTEGER  |
| total_accepted      | INTEGER  |
+---------------------+----------+`,
    solution: `WITH challenge_stats AS (
  SELECT 
    c.contest_id,
    SUM(ss.total_submissions) AS total_submissions,
    SUM(ss.total_accepted) AS total_accepted,
    SUM(vs.total_views) AS total_views,
    SUM(vs.total_unique_views) AS total_unique_views
  FROM CONTESTS c
  JOIN COLLEGES col ON c.contest_id = col.contest_id
  JOIN CHALLENGES ch ON col.college_id = ch.college_id
  LEFT JOIN SUBMISSION_STATS ss ON ch.challenge_id = ss.challenge_id
  LEFT JOIN VIEW_STATS vs ON ch.challenge_id = vs.challenge_id
  GROUP BY c.contest_id
)
SELECT 
  c.contest_id,
  c.hacker_id,
  c.name,
  COALESCE(cs.total_submissions, 0),
  COALESCE(cs.total_accepted, 0),
  COALESCE(cs.total_views, 0),
  COALESCE(cs.total_unique_views, 0)
FROM CONTESTS c
LEFT JOIN challenge_stats cs ON c.contest_id = cs.contest_id
WHERE COALESCE(cs.total_submissions, 0) + COALESCE(cs.total_accepted, 0) + 
      COALESCE(cs.total_views, 0) + COALESCE(cs.total_unique_views, 0) > 0
ORDER BY c.contest_id;`,
    explanation: 'Sum all statistics per challenge, group by contest. Use LEFT JOIN to handle contests with missing stats. Filter out contests with all-zero totals.'
  }
]
