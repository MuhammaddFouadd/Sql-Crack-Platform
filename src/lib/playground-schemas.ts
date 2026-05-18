/** A named SQL schema available in the playground. */
export interface PlaygroundSchema {
  id: string
  name: string
  description: string
  sql: string
}

/** Pre-built schemas for the SQL playground (e-commerce and library). */
export const SCHEMAS: PlaygroundSchema[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'departments, employees, products, orders',
    sql: `
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL
);
INSERT INTO departments VALUES (1, 'Engineering', 500000);
INSERT INTO departments VALUES (2, 'Sales', 300000);
INSERT INTO departments VALUES (3, 'Marketing', 200000);
INSERT INTO departments VALUES (4, 'HR', 150000);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  salary REAL,
  department_id INTEGER REFERENCES departments(id),
  hire_date TEXT
);
INSERT INTO employees VALUES (1, 'Alice Johnson', 'alice@company.com', 95000, 1, '2022-03-15');
INSERT INTO employees VALUES (2, 'Bob Smith', 'bob@company.com', 82000, 1, '2023-01-10');
INSERT INTO employees VALUES (3, 'Carol Williams', 'carol@company.com', 75000, 2, '2022-06-20');
INSERT INTO employees VALUES (4, 'Dave Brown', 'dave@company.com', 68000, 2, '2024-02-01');
INSERT INTO employees VALUES (5, 'Eve Davis', 'eve@company.com', 90000, 1, '2021-11-01');
INSERT INTO employees VALUES (6, 'Frank Miller', 'frank@company.com', 55000, 3, '2023-09-15');
INSERT INTO employees VALUES (7, 'Grace Wilson', 'grace@company.com', 62000, 3, '2024-01-20');
INSERT INTO employees VALUES (8, 'Henry Taylor', 'henry@company.com', 48000, 4, '2023-04-10');
INSERT INTO employees VALUES (9, 'Ivy Anderson', 'ivy@company.com', 72000, 4, '2022-08-05');
INSERT INTO employees VALUES (10, 'Jack Thomas', 'jack@company.com', 88000, 1, '2023-06-12');

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER
);
INSERT INTO products VALUES (1, 'Laptop Pro', 'Electronics', 1299.99, 50);
INSERT INTO products VALUES (2, 'Wireless Mouse', 'Electronics', 29.99, 200);
INSERT INTO products VALUES (3, 'Desk Chair', 'Furniture', 349.99, 30);
INSERT INTO products VALUES (4, 'Notebook Set', 'Stationery', 12.99, 500);
INSERT INTO products VALUES (5, 'Monitor 27"', 'Electronics', 449.99, 75);
INSERT INTO products VALUES (6, 'Standing Desk', 'Furniture', 899.99, 15);
INSERT INTO products VALUES (7, 'USB-C Hub', 'Electronics', 49.99, 150);
INSERT INTO products VALUES (8, 'Coffee Mug', 'Kitchen', 14.99, 300);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  order_date TEXT
);
INSERT INTO orders VALUES (1, 'Alice', 1, 1, '2024-01-15');
INSERT INTO orders VALUES (2, 'Bob', 2, 3, '2024-01-16');
INSERT INTO orders VALUES (3, 'Alice', 3, 1, '2024-02-01');
INSERT INTO orders VALUES (4, 'Charlie', 4, 10, '2024-02-10');
INSERT INTO orders VALUES (5, 'Bob', 5, 2, '2024-02-15');
INSERT INTO orders VALUES (6, 'Alice', 2, 1, '2024-03-01');
INSERT INTO orders VALUES (7, 'Diana', 6, 1, '2024-03-05');
INSERT INTO orders VALUES (8, 'Charlie', 7, 5, '2024-03-10');
`,
  },
  {
    id: 'library',
    name: 'Library',
    description: 'authors, books, members, loans',
    sql: `
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT
);
INSERT INTO authors VALUES (1, 'J.K. Rowling', 'UK');
INSERT INTO authors VALUES (2, 'George Orwell', 'UK');
INSERT INTO authors VALUES (3, 'Harper Lee', 'USA');
INSERT INTO authors VALUES (4, 'F. Scott Fitzgerald', 'USA');

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id),
  genre TEXT,
  year INTEGER,
  copies INTEGER
);
INSERT INTO books VALUES (1, 'Harry Potter and the Sorcerer\'s Stone', 1, 'Fantasy', 1997, 5);
INSERT INTO books VALUES (2, '1984', 2, 'Dystopian', 1949, 3);
INSERT INTO books VALUES (3, 'To Kill a Mockingbird', 3, 'Fiction', 1960, 4);
INSERT INTO books VALUES (4, 'The Great Gatsby', 4, 'Fiction', 1925, 2);
INSERT INTO books VALUES (5, 'Harry Potter and the Chamber of Secrets', 1, 'Fantasy', 1998, 4);
INSERT INTO books VALUES (6, 'Animal Farm', 2, 'Satire', 1945, 3);

CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  join_date TEXT
);
INSERT INTO members VALUES (1, 'Liam Smith', 'liam@email.com', '2023-01-10');
INSERT INTO members VALUES (2, 'Emma Jones', 'emma@email.com', '2023-03-15');
INSERT INTO members VALUES (3, 'Noah Williams', 'noah@email.com', '2023-06-20');

CREATE TABLE loans (
  id INTEGER PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  member_id INTEGER REFERENCES members(id),
  loan_date TEXT,
  return_date TEXT
);
INSERT INTO loans VALUES (1, 1, 1, '2024-01-10', '2024-01-24');
INSERT INTO loans VALUES (2, 2, 2, '2024-02-01', NULL);
INSERT INTO loans VALUES (3, 3, 1, '2024-02-15', '2024-03-01');
INSERT INTO loans VALUES (4, 5, 3, '2024-03-01', NULL);
INSERT INTO loans VALUES (5, 4, 2, '2024-03-10', NULL);
`,
  },
]
