import type { ReviewCard } from './store'

export const flashcards: ReviewCard[] = [
  // SELECT
  { id: 'sr-select-1', topic: 'SELECT', question: 'What does SELECT DISTINCT do?', answer: 'Removes duplicate rows from the result set. Only unique values are returned.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-select-2', topic: 'SELECT', question: 'What is the execution order of SQL clauses?', answer: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. The written order (SELECT → FROM → WHERE) is different from execution order.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-select-3', topic: 'SELECT', question: 'What does SELECT * do and why is it sometimes discouraged?', answer: 'SELECT * returns all columns from a table. It is discouraged in production because it may return unnecessary data, break if schema changes, and can affect performance.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // WHERE
  { id: 'sr-where-1', topic: 'WHERE', question: 'What operators can you use in a WHERE clause?', answer: 'Comparison: =, <>, <, >, <=, >=. Logical: AND, OR, NOT. Pattern: LIKE, IN, BETWEEN, IS NULL.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-where-2', topic: 'WHERE', question: 'When does WHERE clause execute in the SQL pipeline?', answer: 'WHERE executes after FROM but before GROUP BY. It filters individual rows before any grouping or aggregation happens.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // ORDER BY
  { id: 'sr-ob-1', topic: 'ORDER BY', question: 'What is the default sort order in ORDER BY?', answer: 'ASC (ascending). NULLs typically sort last in ASC order and first in DESC order (database-dependent).', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-ob-2', topic: 'ORDER BY', question: 'Can you ORDER BY a column alias defined in SELECT?', answer: 'Yes! Since ORDER BY executes AFTER SELECT, you can use aliases from SELECT in ORDER BY (e.g., SELECT salary * 12 AS annual FROM employees ORDER BY annual DESC).', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // GROUP BY
  { id: 'sr-gb-1', topic: 'GROUP BY', question: 'What is the rule about SELECT columns when using GROUP BY?', answer: 'Every column in SELECT must either appear in GROUP BY or be wrapped in an aggregate function (COUNT, SUM, AVG, MAX, MIN). Otherwise the query is invalid.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-gb-2', topic: 'GROUP BY', question: 'What does GROUP BY do in the execution pipeline?', answer: 'It takes the filtered rows (after WHERE) and collapses them into groups based on the column(s) specified. Each unique value becomes one row in the output.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // HAVING
  { id: 'sr-having-1', topic: 'HAVING', question: 'What is the difference between WHERE and HAVING?', answer: 'WHERE filters ROWS before grouping. HAVING filters GROUPS after grouping. HAVING can use aggregate functions (COUNT, AVG, etc.), WHERE cannot.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // JOINs
  { id: 'sr-join-1', topic: 'JOINs', question: 'What is the difference between INNER JOIN and LEFT JOIN?', answer: 'INNER JOIN returns only matching rows from both tables. LEFT JOIN returns ALL rows from the left table, with NULLs where no match exists in the right table.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-join-2', topic: 'JOINs', question: 'What does a CROSS JOIN produce?', answer: 'A Cartesian product — every row from table A paired with every row from table B. If A has 10 rows and B has 5, the result has 50 rows.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-join-3', topic: 'JOINs', question: 'What is a self-join and how do you write one?', answer: 'A self-join joins a table with itself using aliases. Example: SELECT a.name, b.name FROM employees a JOIN employees b ON a.manager_id = b.id', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Subqueries
  { id: 'sr-sub-1', topic: 'Subqueries', question: 'What are the three places a subquery can appear?', answer: 'In SELECT (scalar subquery), in FROM (derived table/subquery), and in WHERE (with IN, EXISTS, comparison operators).', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-sub-2', topic: 'Subqueries', question: 'What is a correlated subquery?', answer: 'A subquery that references columns from the outer query. It executes once for each row of the outer query, which can be slow on large datasets.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // CASE WHEN
  { id: 'sr-case-1', topic: 'CASE WHEN', question: 'What are the two syntax forms of CASE?', answer: 'Simple CASE: CASE column WHEN value1 THEN ... WHEN value2 THEN ... ELSE ... END. Searched CASE: CASE WHEN condition1 THEN ... WHEN condition2 THEN ... ELSE ... END.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-case-2', topic: 'CASE WHEN', question: 'How is CASE evaluated (short-circuit)?', answer: 'CASE evaluates conditions left-to-right and returns the first matching THEN. Once a condition is true, remaining conditions are NOT evaluated (short-circuit).', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // CTEs
  { id: 'sr-cte-1', topic: 'CTEs', question: 'What does CTE stand for and what is its syntax?', answer: 'Common Table Expression. Syntax: WITH cte_name AS (SELECT ...) SELECT * FROM cte_name. It creates a temporary named result set for a single query.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-cte-2', topic: 'CTEs', question: 'Can you have multiple CTEs in one query?', answer: 'Yes, separate them with commas: WITH cte1 AS (...), cte2 AS (...) SELECT ... FROM cte1 JOIN cte2. Each CTE can reference previous ones.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-cte-3', topic: 'CTEs', question: 'What is a recursive CTE and what are its required parts?', answer: 'A recursive CTE calls itself to process hierarchical data. Required parts: (1) Anchor member — initial result set, (2) UNION ALL, (3) Recursive member — references the CTE itself, (4) Termination condition (usually in WHERE).', difficulty: 'advanced', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Window Functions
  { id: 'sr-win-1', topic: 'Window Functions', question: 'How is a window function different from GROUP BY?', answer: 'GROUP BY collapses rows into groups (fewer output rows). Window functions compute values across a set of rows but return the original number of rows — each row keeps its identity.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-win-2', topic: 'Window Functions', question: 'What are the three parts of a window function?', answer: '1. Function (ROW_NUMBER, RANK, SUM, AVG, etc.) 2. OVER clause 3. Optional PARTITION BY, ORDER BY, and frame specification (ROWS BETWEEN).', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-win-3', topic: 'Window Functions', question: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?', answer: 'ROW_NUMBER() gives unique sequential numbers (ties get different numbers). RANK() gives same rank to ties but skips numbers. DENSE_RANK() gives same rank to ties without skipping numbers.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Set Operations
  { id: 'sr-set-1', topic: 'Set Operations', question: 'What is the difference between UNION and UNION ALL?', answer: 'UNION removes duplicate rows from the combined result. UNION ALL keeps all rows (including duplicates). UNION ALL is faster since it does not sort/deduplicate.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-set-2', topic: 'Set Operations', question: 'What does INTERSECT do?', answer: 'INTERSECT returns only rows that appear in BOTH result sets. It is the SQL equivalent of logical AND for sets.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-set-3', topic: 'Set Operations', question: 'What constraint applies to all set operations?', answer: 'Each SELECT must have the same number of columns with compatible data types. The column names come from the first query.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // String Functions
  { id: 'sr-str-1', topic: 'String Functions', question: 'What does CONCAT do and how is it different from ||?', answer: 'CONCAT(string1, string2, ...) joins strings together and automatically handles NULLs (treats them as empty string). || is the standard SQL concatenation operator, but NULL + anything = NULL.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // DDL
  { id: 'sr-ddl-1', topic: 'DDL (CREATE, ALTER, DROP)', question: 'What are the three main DDL commands?', answer: 'CREATE — creates new database objects (tables, indexes, views). ALTER — modifies existing objects. DROP — deletes objects entirely.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-ddl-2', topic: 'DDL (CREATE, ALTER, DROP)', question: 'What is the difference between DROP TABLE and DELETE FROM?', answer: 'DROP TABLE removes the entire table structure and data — it is DDL and cannot be rolled back in most databases. DELETE FROM removes rows but keeps the table structure — it is DML and can be rolled back.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // DML
  { id: 'sr-dml-1', topic: 'DML (INSERT, UPDATE, DELETE)', question: 'What does INSERT ... ON CONFLICT DO UPDATE/NOTHING do?', answer: 'It is PostgreSQL\'s "upsert" feature. If the inserted row violates a unique constraint, instead of failing, it either updates the existing row (DO UPDATE) or does nothing (DO NOTHING).', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Pattern Matching
  { id: 'sr-pat-1', topic: 'Pattern Matching', question: 'What do % and _ mean in SQL LIKE patterns?', answer: '% matches ANY sequence of characters (including zero). _ matches exactly ONE character. Example: LIKE \'J%n\' matches John, Jan, Jean. LIKE \'J_n\' matches Jan, Jen but not John.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Keys
  { id: 'sr-keys-1', topic: 'Keys in SQL', question: 'What is the difference between a primary key and a foreign key?', answer: 'PRIMARY KEY uniquely identifies each row in a table (unique + not null, one per table). FOREIGN KEY references a primary key in another table and maintains referential integrity.', difficulty: 'beginner', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-keys-2', topic: 'Keys in SQL', question: 'What are the referential actions for foreign keys?', answer: 'CASCADE (delete/update child rows), SET NULL (set child FK to NULL), SET DEFAULT (set child FK to default), RESTRICT/NO ACTION (prevent parent deletion if children exist).', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // EXISTS / NOT EXISTS
  { id: 'sr-exists-1', topic: 'EXISTS / NOT EXISTS', question: 'How does EXISTS differ from IN?', answer: 'EXISTS is a boolean check that returns true if the subquery returns ANY rows. IN compares a value against a list. EXISTS can be faster for large datasets because it short-circuits on the first match.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-exists-2', topic: 'EXISTS / NOT EXISTS', question: 'What is a classic use case for NOT EXISTS?', answer: 'Finding rows in one table that have no related rows in another table (e.g., employees who have never placed an order). It is often faster than LEFT JOIN ... WHERE NULL.', difficulty: 'intermediate', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Division
  { id: 'sr-div-1', topic: 'Division Queries', question: 'What problem does the relational division operation solve?', answer: 'It finds rows in table A that are related to ALL rows in table B. Classic example: "Find students who have taken ALL required courses."', difficulty: 'advanced', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
  { id: 'sr-div-2', topic: 'Division Queries', question: 'What are the two common SQL patterns for division?', answer: '1. Double NOT EXISTS: Find entities with no missing relationships. 2. GROUP BY with COUNT: Group by entity, count distinct items, compare to total required count.', difficulty: 'advanced', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },

  // Relational Algebra
  { id: 'sr-ra-1', topic: 'Relational Algebra', question: 'What are the five fundamental operations of relational algebra?', answer: 'SELECT (σ — filter rows), PROJECT (π — pick columns), RENAME (ρ — rename), UNION (∪), SET DIFFERENCE (−), CARTESIAN PRODUCT (×). These form the theoretical foundation of SQL.', difficulty: 'advanced', lastReviewed: null, nextReview: null, interval: 0, easeFactor: 2.5, repetitions: 0 },
]
