/** SQL schema and seed data for practice exercises (customers, departments, employees, products, orders, order_items). */
export const PRACTICE_SCHEMA_SQL = `
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  signup_date TEXT
);

INSERT INTO customers VALUES (1, 'Alice Johnson', 'alice@email.com', '555-0101', 'New York', '2023-01-15');
INSERT INTO customers VALUES (2, 'Bob Smith', 'bob@company.com', '555-0102', 'Los Angeles', '2023-03-20');
INSERT INTO customers VALUES (3, 'Charlie Brown', 'charlie@company.com', NULL, 'Chicago', '2023-06-10');
INSERT INTO customers VALUES (4, 'Diana Prince', 'diana@email.com', '555-0104', 'Houston', '2023-08-05');
INSERT INTO customers VALUES (5, 'Eve Davis', 'eve@company.com', '555-0105', 'Phoenix', '2023-09-01');
INSERT INTO customers VALUES (6, 'Frank Miller', 'frank@email.com', NULL, 'Philadelphia', '2023-10-15');
INSERT INTO customers VALUES (7, 'Grace Wilson', 'grace@company.com', '555-0107', 'San Antonio', '2024-01-20');
INSERT INTO customers VALUES (8, 'Henry Taylor', 'henry@email.com', '555-0108', 'San Diego', '2024-02-10');
INSERT INTO customers VALUES (9, 'Ivy Anderson', 'ivy@email.com', NULL, 'Dallas', '2024-03-05');
INSERT INTO customers VALUES (10, 'Jack Thomas', 'jack@company.com', '555-0110', 'San Jose', '2024-04-01');

CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL,
  city TEXT
);

INSERT INTO departments VALUES (1, 'Engineering', 500000, 'New York');
INSERT INTO departments VALUES (2, 'Sales', 300000, 'Chicago');
INSERT INTO departments VALUES (3, 'Marketing', 200000, 'Boston');
INSERT INTO departments VALUES (4, 'HR', 150000, 'Seattle');

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  salary REAL,
  department TEXT,
  department_id INTEGER REFERENCES departments(id),
  manager_id INTEGER,
  hire_date TEXT,
  city TEXT
);

INSERT INTO employees VALUES (1, 'Alice Johnson', 'alice@company.com', '555-1001', 95000, 'Engineering', 1, NULL, '2022-03-15', 'New York');
INSERT INTO employees VALUES (2, 'Bob Smith', 'bob@company.com', '555-1002', 82000, 'Engineering', 1, 1, '2023-01-10', 'Chicago');
INSERT INTO employees VALUES (3, 'Carol Williams', 'carol@company.com', '555-1003', 75000, 'Sales', 2, 1, '2022-06-20', 'New York');
INSERT INTO employees VALUES (4, 'Dave Brown', 'dave@company.com', '555-1004', 68000, 'Sales', 2, 3, '2024-02-01', 'Seattle');
INSERT INTO employees VALUES (5, 'Eve Davis', 'eve@company.com', '555-1005', 90000, 'Engineering', 1, 1, '2021-11-01', 'New York');
INSERT INTO employees VALUES (6, 'Frank Miller', 'frank@company.com', NULL, 55000, 'Marketing', 3, 3, '2023-09-15', 'Chicago');
INSERT INTO employees VALUES (7, 'Grace Wilson', 'grace@company.com', '555-1007', 62000, 'Marketing', 3, 3, '2024-01-20', 'New York');
INSERT INTO employees VALUES (8, 'Henry Taylor', 'henry@company.com', NULL, 48000, 'HR', 4, 1, '2023-04-10', 'Seattle');
INSERT INTO employees VALUES (9, 'Ivy Anderson', 'ivy@company.com', '555-1009', 72000, 'HR', 4, 1, '2022-08-05', 'Chicago');
INSERT INTO employees VALUES (10, 'Jack Thomas', 'jack@company.com', '555-1010', 88000, 'Engineering', 1, 5, '2023-06-12', 'New York');

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER,
  units_sold INTEGER
);

INSERT INTO products VALUES (1, 'Laptop Pro', 'Electronics', 1299.99, 50, 150);
INSERT INTO products VALUES (2, 'Wireless Mouse', 'Electronics', 29.99, 200, 500);
INSERT INTO products VALUES (3, 'Desk Chair', 'Furniture', 349.99, 30, 80);
INSERT INTO products VALUES (4, 'Notebook Set', 'Stationery', 12.99, 500, 1000);
INSERT INTO products VALUES (5, 'Monitor 27 Inch', 'Electronics', 449.99, 75, 200);
INSERT INTO products VALUES (6, 'Standing Desk', 'Furniture', 899.99, 15, 45);
INSERT INTO products VALUES (7, 'USB-C Hub', 'Electronics', 49.99, 150, 350);
INSERT INTO products VALUES (8, 'Premium Ceramic Coffee Mug', 'Kitchen', 14.99, 300, 400);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  customer_name TEXT,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  total REAL,
  order_date TEXT
);

INSERT INTO orders VALUES (1, 1, 'Alice', 1, 1, 1299.99, '2024-01-15');
INSERT INTO orders VALUES (2, 2, 'Bob', 2, 3, 89.97, '2024-01-16');
INSERT INTO orders VALUES (3, 1, 'Alice', 3, 1, 349.99, '2024-02-01');
INSERT INTO orders VALUES (4, 3, 'Charlie', 4, 10, 129.90, '2024-02-10');
INSERT INTO orders VALUES (5, 2, 'Bob', 5, 2, 899.98, '2024-02-15');
INSERT INTO orders VALUES (6, 1, 'Alice', 2, 1, 29.99, '2024-03-01');
INSERT INTO orders VALUES (7, 4, 'Diana', 6, 1, 899.99, '2024-03-05');
INSERT INTO orders VALUES (8, 3, 'Charlie', 7, 5, 249.95, '2024-03-10');

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER
);

INSERT INTO order_items VALUES (1, 1, 1, 1);
INSERT INTO order_items VALUES (2, 2, 2, 3);
INSERT INTO order_items VALUES (3, 3, 3, 1);
INSERT INTO order_items VALUES (4, 4, 4, 10);
INSERT INTO order_items VALUES (5, 5, 5, 2);
INSERT INTO order_items VALUES (6, 6, 2, 1);
INSERT INTO order_items VALUES (7, 7, 6, 1);
INSERT INTO order_items VALUES (8, 8, 7, 5);
`;
