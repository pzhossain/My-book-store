# 📖 **Online Book Store API Documentation**
> **Base URL:** `http://yourdomain.com/api/`

## 📌 **Table of Contents**
- [Authors API](#authors-api)
- [Books API](#books-api)
- [Customers API](#customers-api)
- [Orders API](#orders-api)
- [Summary Report](#reports-api)

---

## 📌 **Authors API**
### 🔹 **1. Create an Author**
- **Endpoint:** `/authors/insertAuthor.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `name`: "J.K. Rowling"
  - `email`: "jk.rowling@example.com"
- **Response:**
  ```json
  { "message": "Author inserted successfully" }
  ```

### 🔹 **2. Get All Authors**
- **Endpoint:** `/authors/readAuthors.php`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "author_id": 1,
      "name": "J.K. Rowling",
      "email": "jk.rowling@example.com",
      "created_at": "2024-12-31 10:00:00",
      "updated_at": "2024-12-31 10:00:00"
    }
  ]
  ```

### 🔹 **3. Get an Author by ID**
- **Endpoint:** `/authors/getAuthorById.php`
- **Method:** `GET`
- **Query Parameter:**
  - `author_id` (integer) - The ID of the author to retrieve.
- **Example Request:**
  ```
  GET /authors/getAuthorById.php?author_id=1
  ```
- **Example Response:**
  ```json
  {
    "author_id": 1,
    "name": "J.K. Rowling",
    "email": "jk.rowling@example.com"
  }
  ```
- **Error Responses:**
  ```json
  { "message": "Author not found" }
  ```
  ```json
  { "message": "Author ID is required" }
  ```

### 🔹 **4. Update an Author**
- **Endpoint:** `/authors/updateAuthor.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `author_id`: 1
  - `name`: "J.K. Rowling Updated"
  - `email`: "jk.new@example.com"
- **Response:**
  ```json
  { "message": "Author updated successfully" }
  ```

### 🔹 **5. Delete an Author**
- **Endpoint:** `/authors/deleteAuthor.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `author_id`: 1
- **Response:**
  ```json
  { "message": "Author deleted successfully" }
  ```

---

## 📌 **Books API**
### 🔹 **1. Create a Book**
- **Endpoint:** `/books/insertBook.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `title`: "Harry Potter"
  - `price`: 20.99
  - `stock_qty`: 10
  - `author_id`: 1
- **Response:**
  ```json
  { "message": "Book inserted successfully" }
  ```

### 🔹 **2. Get All Books**
- **Endpoint:** `/books/readBook.php`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "book_id": 1,
      "title": "Harry Potter",
      "price": 20.99,
      "stock_quantity": 10,
      "author_id": 1
    }
  ]
  ```

### 🔹 **3. Get a Book by ID**
- **Endpoint:** `/books/getBookById.php`
- **Method:** `GET`
- **Query Parameter:**
  - `book_id` (integer) - The ID of the book to retrieve.
- **Example Request:**
  ```
  GET /books/getBookById.php?book_id=1
  ```
- **Example Response:**
  ```json
  {
    "book_id": 1,
    "title": "Harry Potter",
    "price": 20.99,
    "stock_quantity": 10,
    "author_id": 1
  }
  ```
- **Error Responses:**
  ```json
  { "message": "Book not found" }
  ```
  ```json
  { "message": "Book ID is required" }
  ```

### 🔹 **4. Update a Book**
- **Endpoint:** `/books/updateBook.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `book_id`: 1
  - `title`: "Harry Potter Updated"
  - `price`: 22.99
  - `stock_qty`: 15
  - `author_id`: 1
- **Response:**
  ```json
  { "message": "Book updated successfully" }
  ```

### 🔹 **5. Delete a Book**
- **Endpoint:** `/books/deleteBook.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `book_id`: 1
- **Response:**
  ```json
  { "message": "Book deleted successfully" }
  ```

---

# 📌 **Orders API**
### 🔹 **1. Create an Order**
- **Endpoint:** `/orders/insertOrder.php`
- **Method:** `POST`
- **Request Body (JSON):**
  ```json
  {
    "customer_id": 1,
    "order_details": [
      {
        "book_id": 5,
        "quantity": 2,
        "line_total": 40.00
      },
      {
        "book_id": 7,
        "quantity": 1,
        "line_total": 25.00
      }
    ]
  }
  ```
- **Response:**
  ```json
  { "message": "Order created successfully", "order_id": 12 }
  ```
- **Error Responses:**
  ```json
  { "message": "Customer ID and order details are required" }
  ```
  ```json
  { "message": "Invalid JSON format" }
  ```

---

### 🔹 **2. Get All Orders**
- **Endpoint:** `/orders/readOrders.php`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "order_id": 1,
      "customer_id": 3,
      "order_date": "2024-12-31 10:03:00",
      "total_amount": "55.00",
      "customer_name": "John Doe",
      "customer_email": "john.doe@example.com",
      "order_details": [
        {
          "order_details_id": 5,
          "book_id": 2,
          "quantity": 1,
          "line_total": "25.00",
          "book_title": "The Great Gatsby",
          "price": "25.00"
        },
        {
          "order_details_id": 6,
          "book_id": 3,
          "quantity": 2,
          "line_total": "30.00",
          "book_title": "1984",
          "price": "15.00"
        }
      ]
    }
  ]
  ```

---

### 🔹 **3. Get an Order by ID**
- **Endpoint:** `/orders/getOrderById.php`
- **Method:** `GET`
- **Query Parameter:**
  - `order_id` (integer) - The ID of the order to retrieve.
- **Example Request:**
  ```
  GET /orders/getOrderById.php?order_id=1
  ```
- **Example Response:**
  ```json
  {
    "order_id": 1,
    "customer_id": 3,
    "order_date": "2024-12-31 10:03:00",
    "total_amount": "55.00",
    "customer_name": "John Doe",
    "customer_email": "john.doe@example.com",
    "order_details": [
      {
        "order_details_id": 5,
        "book_id": 2,
        "quantity": 1,
        "line_total": "25.00",
        "book_title": "The Great Gatsby",
        "price": "25.00"
      },
      {
        "order_details_id": 6,
        "book_id": 3,
        "quantity": 2,
        "line_total": "30.00",
        "book_title": "1984",
        "price": "15.00"
      }
    ]
  }
  ```
- **Error Responses:**
  ```json
  { "message": "Order not found" }
  ```
  ```json
  { "message": "Order ID is required" }
  ```

---

### 🔹 **4. Delete an Order**
- **Endpoint:** `/orders/deleteOrder.php`
- **Method:** `POST`
- **Request Body (form-data):**
  - `order_id`: 1
- **Response:**
  ```json
  { "message": "Order deleted successfully" }
  ```

---

# 📌 **Reports API**

### 🔹 **Get Summary Report**
- **Endpoint:** `/reports/summaryReport.php`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "total_books": 120,
    "total_customers": 45,
    "total_orders": 350,
    "total_order_value": "15000.00",
    "todays_orders": 5,
    "todays_order_value": "700.00",
    "monthly_orders": 30,
    "monthly_order_value": "4500.00"
  }
  ```
- **Error Responses:**
  ```json
  { "message": "No data available" }
  ```

---
