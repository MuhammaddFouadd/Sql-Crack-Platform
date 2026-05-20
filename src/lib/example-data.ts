export const EXAMPLE_SCHEMA_SQL = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  salary REAL,
  status TEXT DEFAULT 'active',
  city TEXT
);
INSERT INTO employees VALUES (1, 'Alice', 'alice@company.com', 'Engineering', 95000, 'active', 'New York');
INSERT INTO employees VALUES (2, 'Bob', 'bob@company.com', 'Engineering', 82000, 'active', 'San Francisco');
INSERT INTO employees VALUES (3, 'Charlie', 'charlie@company.com', 'Product', 78000, 'active', 'New York');
INSERT INTO employees VALUES (4, 'Diana', 'diana@company.com', 'Marketing', 65000, 'inactive', 'Chicago');
INSERT INTO employees VALUES (5, 'Eve', 'eve@company.com', 'Engineering', 120000, 'active', 'San Francisco');
INSERT INTO employees VALUES (6, 'Frank', 'frank@company.com', 'Product', 71000, 'active', 'Chicago');
INSERT INTO employees VALUES (7, 'Grace', 'grace@company.com', 'Marketing', 58000, 'active', 'New York');
INSERT INTO employees VALUES (8, 'Henry', 'henry@company.com', 'Engineering', 65000, 'inactive', 'Austin');
INSERT INTO employees VALUES (9, 'Ivy', 'ivy@company.com', 'Product', 90000, 'active', 'Seattle');
INSERT INTO employees VALUES (10, 'Jack', 'jack@company.com', 'Marketing', 72000, 'active', 'Austin');

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER
);
INSERT INTO products VALUES (1, 'Laptop', 'Electronics', 1200, 50);
INSERT INTO products VALUES (2, 'Mouse', 'Electronics', 25, 200);
INSERT INTO products VALUES (3, 'Desk Chair', 'Furniture', 350, 30);
INSERT INTO products VALUES (4, 'Notebook', 'Stationery', 4, 500);
INSERT INTO products VALUES (5, 'Headphones', 'Electronics', 80, 150);
INSERT INTO products VALUES (6, 'Desk Lamp', 'Furniture', 45, 100);
INSERT INTO products VALUES (7, 'Monitor', 'Electronics', 450, 40);
INSERT INTO products VALUES (8, 'Pen Set', 'Stationery', 12, 300);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer TEXT,
  product_id INTEGER,
  quantity INTEGER,
  total REAL,
  order_date TEXT,
  status TEXT DEFAULT 'pending'
);
INSERT INTO orders VALUES (1, 'Alice', 1, 1, 1200, '2024-01-15', 'shipped');
INSERT INTO orders VALUES (2, 'Bob', 3, 2, 700, '2024-02-01', 'shipped');
INSERT INTO orders VALUES (3, 'Charlie', 2, 3, 75, '2024-02-15', 'delivered');
INSERT INTO orders VALUES (4, 'Diana', 5, 1, 80, '2024-03-01', 'pending');
INSERT INTO orders VALUES (5, 'Alice', 4, 10, 40, '2024-03-10', 'shipped');
INSERT INTO orders VALUES (6, 'Frank', 6, 2, 90, '2024-03-20', 'pending');
INSERT INTO orders VALUES (7, 'Grace', 1, 1, 1200, '2024-04-01', 'delivered');
INSERT INTO orders VALUES (8, 'Bob', 5, 3, 240, '2024-04-15', 'shipped');
`;
