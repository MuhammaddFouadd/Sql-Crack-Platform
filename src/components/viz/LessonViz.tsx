'use client'

import StepFlow from './StepFlow'
import JoinViz from './JoinViz'
import WindowViz from './WindowViz'
import ExecutionPipeline, { createWherePipeline, createJoinPipeline } from './ExecutionPipeline'
import InternalEngine, { createSelectInternal, createGroupByInternal, createWindowInternal, createSubqueryInternal } from './InternalEngine'
import JoinEngine from './JoinEngine'

const selectViz = {
  steps: [
    {
      title: 'Start with the full table',
      description: 'The employees table contains all columns and rows',
      detail: 'Before any query runs, PostgreSQL reads the table. All rows and columns are available.',
      tables: [{
        title: 'employees (full table)',
        columns: ['id', 'name', 'department', 'salary', 'hire_date'],
        data: [
          ['1', 'Alice', 'Engineering', '95000', '2022-03-15'],
          ['2', 'Bob', 'Engineering', '82000', '2023-01-10'],
          ['3', 'Carol', 'Sales', '75000', '2022-06-20'],
          ['4', 'Dave', 'Sales', '68000', '2024-02-01'],
          ['5', 'Eve', 'Marketing', '55000', '2023-09-15'],
        ],
      }],
    },
    {
      title: 'SELECT picks specific columns',
      description: 'Only the requested columns pass through',
      detail: 'The SELECT clause acts as a column filter. It projects only the named columns into the result.',
      tables: [
        {
          title: 'employees',
          columns: ['id', 'name', 'department', 'salary', 'hire_date'],
          data: [
            ['1', 'Alice', 'Engineering', '95000', '2022-03-15'],
            ['2', 'Bob', 'Engineering', '82000', '2023-01-10'],
            ['3', 'Carol', 'Sales', '75000', '2022-06-20'],
            ['4', 'Dave', 'Sales', '68000', '2024-02-01'],
            ['5', 'Eve', 'Marketing', '55000', '2023-09-15'],
          ],
          highlightCols: [1, 3],
          fadeCols: [0, 2, 4],
        },
        {
          title: 'result',
          columns: ['name', 'salary'],
          data: [
            ['Alice', '95000'], ['Bob', '82000'], ['Carol', '75000'],
            ['Dave', '68000'], ['Eve', '55000'],
          ],
        },
      ],
    },
  ],
}

const whereViz = {
  steps: [
    {
      title: 'All rows in the table',
      description: 'PostgreSQL scans every row',
      tables: [{
        title: 'employees (all rows)',
        columns: ['id', 'name', 'department', 'salary'],
        data: [
          ['1', 'Alice', 'Engineering', '95000'],
          ['2', 'Bob', 'Engineering', '82000'],
          ['3', 'Carol', 'Sales', '75000'],
          ['4', 'Dave', 'Sales', '68000'],
          ['5', 'Eve', 'Marketing', '55000'],
        ],
      }],
    },
    {
      title: 'WHERE filters rows',
      description: 'Only rows matching the condition pass through',
      detail: 'The WHERE clause checks each row against the condition. Rows that return TRUE are kept; FALSE or NULL rows are discarded.',
      tables: [
        {
          title: 'employees',
          columns: ['id', 'name', 'department', 'salary'],
          data: [
            ['1', 'Alice', 'Engineering', '95000'],
            ['2', 'Bob', 'Engineering', '82000'],
            ['3', 'Carol', 'Sales', '75000'],
            ['4', 'Dave', 'Sales', '68000'],
            ['5', 'Eve', 'Marketing', '55000'],
          ],
          highlightRows: [0, 1],
          fadeRows: [2, 3, 4],
        },
        {
          title: 'result',
          columns: ['id', 'name', 'department', 'salary'],
          data: [
            ['1', 'Alice', 'Engineering', '95000'],
            ['2', 'Bob', 'Engineering', '82000'],
          ],
        },
      ],
    },
  ],
}

const orderByViz = {
  steps: [
    {
      title: 'Unordered rows from table',
      description: 'Rows come in physical order (usually insertion order)',
      tables: [{
        title: 'employees (unordered)',
        columns: ['name', 'salary'],
        data: [
          ['Alice', '95000'], ['Bob', '82000'], ['Carol', '75000'],
          ['Dave', '68000'], ['Eve', '55000'],
        ],
      }],
    },
    {
      title: 'ORDER BY sorts the result',
      description: 'Rows are rearranged by the specified column(s)',
      detail: 'Sorting happens after WHERE filtering. PostgreSQL uses the column values to reorder rows.',
      tables: [
        {
          title: 'before sorting',
          columns: ['name', 'salary'],
          data: [
            ['Alice', '95000'], ['Bob', '82000'], ['Carol', '75000'],
            ['Dave', '68000'], ['Eve', '55000'],
          ],
        },
        {
          title: 'result (ORDER BY salary DESC)',
          columns: ['name', 'salary'],
          data: [
            ['Alice', '95000'], ['Bob', '82000'], ['Carol', '75000'],
            ['Dave', '68000'], ['Eve', '55000'],
          ],
          colorMap: {
            0: { bg: 'bg-yellow/10', label: 'highest', color: 'text-text' },
            4: { bg: 'bg-rose-light/50', label: 'lowest', color: 'text-text' },
          },
        },
      ],
    },
  ],
}

const groupByViz = {
  steps: [
    {
      title: 'Raw rows before grouping', description: 'Each row is an individual employee record',
      tables: [{
        title: 'employees (individual rows)',
        columns: ['name', 'department', 'salary'],
        data: [
          ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'],
          ['Carol', 'Engineering', '95000'], ['Dave', 'Sales', '75000'],
          ['Eve', 'Sales', '68000'], ['Frank', 'Marketing', '55000'],
        ],
      }],
    },
    {
      title: 'GROUP BY creates buckets', description: 'Rows are grouped by department',
      detail: 'GROUP BY collapses rows with the same department value into a single group.',
      tables: [{
        title: 'grouped by department',
        columns: ['department', 'employees', 'salary range'],
        data: [
          ['Engineering', 'Alice, Bob, Carol', '82K - 95K'],
          ['Sales', 'Dave, Eve', '68K - 75K'],
          ['Marketing', 'Frank', '55K'],
        ],
      }],
    },
    {
      title: 'Aggregation per group', description: 'AVG(salary) computes one value per department',
      tables: [
        {
          title: 'intermediate: groups',
          columns: ['department', 'salaries'],
          data: [
            ['Engineering', '[95000, 82000, 95000]'],
            ['Sales', '[75000, 68000]'],
            ['Marketing', '[55000]'],
          ],
        },
        {
          title: 'result',
          columns: ['department', 'avg_salary', 'employee_count'],
          data: [
            ['Engineering', '90666.67', '3'],
            ['Sales', '71500', '2'],
            ['Marketing', '55000', '1'],
          ],
        },
      ],
    },
  ],
}

const havingViz = {
  steps: [
    {
      title: 'Groups after GROUP BY', description: 'All groups exist before HAVING filters',
      tables: [{
        title: 'department groups',
        columns: ['department', 'employee_count', 'avg_salary'],
        data: [
          ['Engineering', '3', '90666.67'], ['Sales', '2', '71500'],
          ['Marketing', '1', '55000'], ['HR', '1', '62000'], ['Legal', '1', '110000'],
        ],
      }],
    },
    {
      title: 'HAVING filters groups', description: 'Groups that fail the condition are removed',
      detail: 'HAVING runs after GROUP BY and aggregation. Only groups with COUNT(*) >= 2 survive.',
      tables: [
        {
          title: 'all groups',
          columns: ['department', 'employee_count', 'avg_salary'],
          data: [
            ['Engineering', '3', '90666.67'], ['Sales', '2', '71500'],
            ['Marketing', '1', '55000'], ['HR', '1', '62000'], ['Legal', '1', '110000'],
          ],
          highlightRows: [0, 1],
          fadeRows: [2, 3, 4],
        },
        {
          title: 'result (HAVING COUNT(*) >= 2)',
          columns: ['department', 'employee_count', 'avg_salary'],
          data: [
            ['Engineering', '3', '90666.67'], ['Sales', '2', '71500'],
          ],
        },
      ],
    },
  ],
}

const subqueryViz = {
  steps: [
    {
      title: 'Step 1: Inner subquery executes first',
      description: 'The subquery runs independently',
      detail: 'Subqueries in WHERE execute first. The inner query runs in isolation.',
      tables: [{
        title: 'inner query: SELECT id FROM departments WHERE budget > 200000',
        columns: ['id'],
        data: [['1'], ['2']],
      }],
    },
    {
      title: 'Step 2: Outer query uses subquery result',
      description: 'Main query filters using the subquery output',
      tables: [
        {
          title: 'employees (all rows)',
          columns: ['id', 'name', 'department_id', 'salary'],
          data: [
            ['1', 'Alice', '1', '95000'], ['2', 'Bob', '1', '82000'],
            ['3', 'Carol', '2', '75000'], ['4', 'Dave', '3', '68000'],
            ['5', 'Eve', '3', '55000'],
          ],
          highlightRows: [0, 1, 2],
          fadeRows: [3, 4],
        },
        {
          title: 'final result',
          columns: ['name', 'salary'],
          data: [['Alice', '95000'], ['Bob', '82000'], ['Carol', '75000']],
        },
      ],
    },
  ],
}

const caseViz = {
  steps: [
    {
      title: 'Original data', description: 'Raw data before CASE transformation',
      tables: [{
        title: 'students',
        columns: ['name', 'score'],
        data: [['Alice', '95'], ['Bob', '82'], ['Carol', '67'], ['Dave', '45'], ['Eve', '88']],
      }],
    },
    {
      title: 'CASE evaluates each row', description: 'Each row gets a new computed column',
      detail: 'CASE checks conditions in order. The first matching WHEN clause wins.',
      tables: [{
        title: 'result with grade column',
        columns: ['name', 'score', 'grade'],
        data: [['Alice', '95', 'A'], ['Bob', '82', 'B'], ['Carol', '67', 'D'], ['Dave', '45', 'F'], ['Eve', '88', 'B']],
        highlightCols: [2],
      }],
    },
  ],
}

const cteViz = {
  steps: [
    {
      title: 'Step 1: CTE definition (WITH)',
      description: 'The CTE runs first and creates a named temporary result',
      detail: 'A CTE is a named subquery you can reference multiple times.',
      tables: [{
        title: 'CTE: high_earners',
        columns: ['name', 'department', 'salary'],
        data: [['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'], ['Carol', 'Sales', '75000']],
      }],
    },
    {
      title: 'Step 2: Main query references CTE',
      description: 'The outer query treats the CTE like a regular table',
      tables: [{
        title: 'final result',
        columns: ['name', 'department', 'salary', 'status'],
        data: [
          ['Alice', 'Engineering', '95000', 'Top Performer'],
          ['Bob', 'Engineering', '82000', 'Top Performer'],
          ['Carol', 'Sales', '75000', 'Top Performer'],
        ],
      }],
    },
  ],
}

interface VizStepTable {
  title: string;
  columns: string[];
  data: string[][];
  highlightRows?: number[];
  fadeRows?: number[];
  highlightCols?: number[];
  fadeCols?: number[];
  colorMap?: Record<number, { bg: string; label: string; color: string }>;
}

interface VizStep {
  title: string;
  description: string;
  detail?: string;
  tables: VizStepTable[];
}

const patternViz = {
  steps: [
    {
      title: 'Start with raw text data',
      description: 'Every column value is just a string of characters',
      detail: 'SQL pattern matching scans each row and checks if the text matches the pattern.',
      tables: [{
        title: 'employees',
        columns: ['name', 'email'],
        data: [
          ['Alice', 'alice@company.com'],
          ['Bob', 'bob@company.com'],
          ['Charlie', 'charlie@company.com'],
          ['Diana', 'diana@company.com'],
          ['Eve', 'eve@work.com'],
        ],
      }],
    },
    {
      title: 'LIKE applies wildcards',
      description: '% matches any sequence, _ matches exactly one character',
      detail: 'LIKE \'%@company.com\' checks if the email ends with "@company.com". The % is a wildcard matching everything before it.',
      tables: [
        {
          title: 'all emails checked',
          columns: ['name', 'email', 'matches pattern?'],
          data: [
            ['Alice', 'alice@company.com', 'Yes ✓'],
            ['Bob', 'bob@company.com', 'Yes ✓'],
            ['Charlie', 'charlie@company.com', 'Yes ✓'],
            ['Diana', 'diana@company.com', 'Yes ✓'],
            ['Eve', 'eve@work.com', 'No ✗'],
          ],
          highlightRows: [0, 1, 2, 3],
          fadeRows: [4],
        },
        {
          title: 'filtered result',
          columns: ['name', 'email'],
          data: [
            ['Alice', 'alice@company.com'],
            ['Bob', 'bob@company.com'],
            ['Charlie', 'charlie@company.com'],
            ['Diana', 'diana@company.com'],
          ],
        },
      ],
    },
  ],
}

const stringViz = {
  steps: [
    {
      title: 'Raw text stored in table',
      description: 'Strings are stored as-is in the database',
      tables: [{
        title: 'employees',
        columns: ['name', 'department', 'city'],
        data: [
          ['Alice', 'Engineering', 'New York'],
          ['Bob', 'Engineering', 'San Francisco'],
          ['Charlie', 'Product', 'New York'],
        ],
      }],
    },
    {
      title: 'Functions transform the text',
      description: 'UPPER, LOWER, SUBSTR, CONCAT change string values',
      detail: 'String functions do NOT modify the original data — they create new computed values in the result.',
      tables: [
        {
          title: 'UPPER(name)',
          columns: ['original', 'result'],
          data: [
            ['Alice', 'ALICE'],
            ['Bob', 'BOB'],
            ['Charlie', 'CHARLIE'],
          ],
          highlightCols: [1],
        },
        {
          title: 'LENGTH(name)',
          columns: ['original', 'result'],
          data: [
            ['Alice', '5'],
            ['Bob', '3'],
            ['Charlie', '7'],
          ],
          highlightCols: [1],
        },
        {
          title: 'CONCAT(department, city)',
          columns: ['original1', 'original2', 'result'],
          data: [
            ['Engineering', 'New York', 'EngineeringNew York'],
            ['Engineering', 'San Francisco', 'EngineeringSan Francisco'],
          ],
          highlightCols: [2],
        },
      ],
    },
  ],
}

const setViz = {
  steps: [
    {
      title: 'Two separate result sets',
      description: 'Each SELECT query returns its own result',
      detail: 'Set operations work on complete SELECT queries. Each SELECT must have the same number of columns.',
      tables: [
        {
          title: 'Query A: high earners',
          columns: ['name', 'salary'],
          data: [
            ['Alice', '95000'],
            ['Eve', '120000'],
            ['Ivy', '90000'],
          ],
        },
        {
          title: 'Query B: active employees',
          columns: ['name', 'salary'],
          data: [
            ['Alice', '95000'],
            ['Bob', '82000'],
            ['Eve', '120000'],
            ['Frank', '71000'],
            ['Ivy', '90000'],
          ],
        },
      ],
    },
    {
      title: 'UNION combines, removes duplicates',
      description: 'Rows appearing in both sets appear only once',
      detail: 'UNION stacks the results vertically and removes any duplicate rows. UNION ALL keeps duplicates.',
      tables: [{
        title: 'A UNION B (high earners OR active)',
        columns: ['name', 'salary'],
        data: [
          ['Alice', '95000'],
          ['Bob', '82000'],
          ['Eve', '120000'],
          ['Frank', '71000'],
          ['Ivy', '90000'],
        ],
      }],
    },
    {
      title: 'INTERSECT keeps only matches',
      description: 'Rows must exist in BOTH sets',
      tables: [{
        title: 'A INTERSECT B (high earners AND active)',
        columns: ['name', 'salary'],
        data: [
          ['Alice', '95000'],
          ['Eve', '120000'],
          ['Ivy', '90000'],
        ],
      }],
    },
    {
      title: 'EXCEPT removes second set',
      description: 'Rows from A that do NOT exist in B',
      tables: [{
        title: 'A EXCEPT B (high earners NOT active)',
        columns: ['name', 'salary'],
        data: [
          ['---', '---'],
        ],
      }],
    },
  ],
}

const lessonsVizMap: Record<string, {
  label: string; type: 'stepflow' | 'join' | 'window';
  steps?: VizStep[]
}> = {
  select: { label: 'How SELECT works', type: 'stepflow', steps: selectViz.steps },
  where: { label: 'How WHERE filters rows', type: 'stepflow', steps: whereViz.steps },
  'order-by': { label: 'How ORDER BY sorts data', type: 'stepflow', steps: orderByViz.steps },
  'group-by': { label: 'How GROUP BY aggregates', type: 'stepflow', steps: groupByViz.steps },
  having: { label: 'How HAVING filters groups', type: 'stepflow', steps: havingViz.steps },
  joins: { label: 'Interactive JOIN visualizer', type: 'join' },
  subqueries: { label: 'How subqueries execute', type: 'stepflow', steps: subqueryViz.steps },
  'case-when': { label: 'How CASE transforms data', type: 'stepflow', steps: caseViz.steps },
  cte: { label: 'How CTEs work step by step', type: 'stepflow', steps: cteViz.steps },
  'window-functions': { label: 'Interactive window function visualizer', type: 'window' },
  'rank-functions': { label: 'Interactive ranking visualizer', type: 'window' },
  'pattern-matching': { label: 'How pattern matching works', type: 'stepflow', steps: patternViz.steps },
  'string-functions': { label: 'How string transformations work', type: 'stepflow', steps: stringViz.steps },
  'set-operations': { label: 'How set operations combine data', type: 'stepflow', steps: setViz.steps },
}

const lessonsInternalEngineMap: Record<string, React.ReactNode> = {
  select: <ExecutionPipeline
    title="Inside the Database Engine"
    sql="SELECT name, salary FROM employees WHERE department = 'Engineering';"
    stages={createWherePipeline()}
  />,
  where: <InternalEngine
    title="Inside the Database Engine"
    query="SELECT name FROM employees WHERE department = 'Engineering';"
    steps={createSelectInternal("SELECT name FROM employees WHERE department = 'Engineering'").steps}
  />,
  'order-by': <ExecutionPipeline
    title="Inside the Database Engine"
    sql="SELECT name, salary FROM employees ORDER BY salary DESC;"
    stages={createWherePipeline()}
  />,
  'group-by': <InternalEngine
    title="Inside the Database Engine — Hash Aggregation"
    query="SELECT department, AVG(salary) FROM employees GROUP BY department;"
    steps={createGroupByInternal().steps}
  />,
  having: <InternalEngine
    title="Inside the Database Engine — Aggregation + Filter"
    query="SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) >= 2;"
    steps={createGroupByInternal().steps}
  />,
  joins: <div className="space-y-6">
    <JoinEngine />
    <ExecutionPipeline
      title="Inside the Database Engine — Hash Join Pipeline"
      sql="SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id;"
      stages={createJoinPipeline('Hash')}
    />
  </div>,
  subqueries: <InternalEngine
    title="Inside the Database Engine — Subquery Execution"
    query="SELECT name FROM employees WHERE department_id IN (SELECT id FROM departments WHERE budget > 200000);"
    steps={createSubqueryInternal().steps}
  />,
  'case-when': <ExecutionPipeline
    title="Inside the Database Engine"
    sql="SELECT name, CASE WHEN score >= 90 THEN 'A' ELSE 'B' END FROM students;"
    stages={createWherePipeline()}
  />,
  cte: <InternalEngine
    title="Inside the Database Engine — CTE Materialization"
    query="WITH high AS (SELECT * FROM employees WHERE salary > 80000) SELECT * FROM high;"
    steps={createSubqueryInternal().steps}
  />,
  'window-functions': <InternalEngine
    title="Inside the Database Engine — Window Function Processing"
    query="SELECT name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees;"
    steps={createWindowInternal().steps}
  />,
  'rank-functions': <InternalEngine
    title="Inside the Database Engine — Ranking Evaluation"
    query="SELECT name, salary, RANK() OVER (ORDER BY salary DESC) FROM employees;"
    steps={createWindowInternal().steps}
  />,
}

export function getLessonViz(lessonId: string) {
  return lessonsVizMap[lessonId]
}

export function getLessonInternalEngine(lessonId: string) {
  return lessonsInternalEngineMap[lessonId] || null
}

export function renderLessonViz(lessonId: string) {
  const viz = getLessonViz(lessonId)
  if (!viz) return null
  switch (viz.type) {
    case 'stepflow': return viz.steps ? <StepFlow steps={viz.steps} /> : null
    case 'join': return <JoinViz />
    case 'window': return <WindowViz />
    default: return null
  }
}
