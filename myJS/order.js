function showMessage() {
  let msgDiv = document.getElementById("successMessage");
  msgDiv.innerHTML = "Successful!";
  msgDiv.style.display = "block";

  // Hide the message after 3 seconds
  setTimeout(() => {
      msgDiv.style.opacity = "0";
      setTimeout(() => {
          msgDiv.style.display = "none";
      }, 500);
  }, 3000);    
}     
      
      
      
      //  Get Order List
      async function getOrders() {
        const URL = "https://bs-api.sobuj.net/view/orders/readOrders.php";
        let tableData = document.getElementById("orderList");

        try {
          // Show initial Loader
          tableData.innerHTML = "<tr><td colspan='7'>Loading.....</td></tr>";

          // Fetch orders from API
          let response = await axios.get(URL);
          let orders = response.data;

          // Clear loading message
          tableData.innerHTML = "";

          // If no data exists .. show a text
          if (!orders.length) {
            tableData.innerHTML =
              "<tr><td colspan='7'>No Order found</td></tr>";
            return;
          }

          // Append orders to the table
          orders.forEach((order) => {
            let row = document.createElement("tr");
            row.innerHTML = `
              <td>${order["order_id"]}</td>
              <td>${order["customer_name"]}</td>
              <td>${order["customer_email"]}</td>
              <td>${order["order_date"]}</td>
              <td>${order["total_amount"]}</td>
              <td><button class="btn btn-success edit-btn" data-id="${order["order_id"]}">View</button></td>
              <td><button class="btn btn-danger delete-btn" data-id="${order["order_id"]}">Delete</button></td>
            `;
            tableData.appendChild(row);
          });

          // Add Event Listeners to view buttons
          document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
              // get data id from data attribute and pass to view order function
              viewOrderDetails(this.dataset.id);
            });
          });

          // Add Event Listeners to view buttons
          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
              // get data id from data attribute and pass to delete order function
              deleteOrder(this.dataset.id);
            });
          });
        } catch (e) {
            console.log("error getting data",e)
        };
      }
      getOrders();

      // View Order Details
      async function viewOrderDetails(orderId) {
        try {
          const URL = `https://bs-api.sobuj.net/view/orders/getOrderById.php?order_id=${orderId}`;

          // Getting Single Order Details
          let orderResponse = await axios.get(URL);
          let orderData = orderResponse.data;

          // Populate the informations
          document.getElementById("customerName").innerHTML =
            orderData.customer_name;

          document.getElementById("customerEmail").innerHTML =
            orderData.customer_email;
          document.getElementById("orderDate").innerHTML = orderData.order_date;
          document.getElementById("totalAmount").innerHTML =
            orderData.total_amount;

          // Clear the table body before appending new rows
          let orderItemsTableBody = document.getElementById(
            "orderItemsTableBody"
          );
          orderItemsTableBody.innerHTML = "";

          for (let item of orderData.order_details) {
            let bookResponse = await axios.get(
              `https://bs-api.sobuj.net/view/books/getBookById.php?book_id=${item.book_id}`
            );

            let book = bookResponse.data;

            // Inserting book to the table row
            let row = document.createElement("tr");
            row.innerHTML = `
              <td>${book.title}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>
              <td>${item.line_total}</td>
            `;
            orderItemsTableBody.appendChild(row);
          }

          // Show the modal
          let modal = new bootstrap.Modal(
            document.getElementById("orderDetailsModal")
          );
          modal.show();
        } catch (e) {
          console.log("Error in fetching order details:", e);
        } finally {
          console.log("Order Details Fetched");
        }
      }

      // View Order Details

      // Delete order
      let deleteOrderID = null;

      // Function to open delete order modal
      function deleteOrder(orderID) {
        deleteOrderID = orderID;
        // show the modal
        let deleteModal = new bootstrap.Modal(
          document.getElementById("deleteOrderModal")
        );
        deleteModal.show();
      }

      // Final order delete
      async function deleteOrderFinally() {
        const URL = "https://bs-api.sobuj.net/view/orders/deleteOrder.php";

        try {
          // Check if the deleteOrder is valid
          if (!deleteOrderID) {
            alter("Invalid Order ID");
            return;
          }

          // Prepare data to send the API
          let formData = new FormData();
          formData.append("order_id", deleteOrderID);

          // send the delete request
          let response = await axios.post(URL, formData);

          // check api response
          if (response.status === 200) {
            alert("Order deleted successfully");

            // hide the modal
            let modal = bootstrap.Modal.getInstance(
              document.getElementById("deleteOrderModal")
            );
            modal.hide();

            //show success massage
            showMessage();

            // refresh the order list
            getOrders();

          } else {
            console.log("failed to delete");
          }
        } catch (e) {
          console.log("Error in deleting order", e);
        } finally {
          console.log("Order deleted");
        }
      }
      // Delete order
    
      // Create Orders
      let booksData = [];
      let customersData = [];

      // Fetch Customers
      async function fetchCustomers() {
        let customerSelect = document.getElementById("customerSelect");
        const customerURL =
          "https://bs-api.sobuj.net/view/customers/readCustomers.php";
        try {
          let response = await axios.get(customerURL);
          customersData = response.data;

          customerSelect.innerHTML = `<option value="">Select a customer</option>`;
          customersData.forEach((customer) => {
            customerSelect.innerHTML += `<option value="${customer.customer_id}">${customer.name} - ${customer.email} </option>`;
          });
        } catch (e) {
          console.log("Error in fetching customers", e);
          customerSelect.innerHTML = `<option value="">Failed to load customer</option>`;
        } finally {
          console.log("Customers Fetched");
        }
      }

      // Fetch Books
      async function fetchBooks() {
        try {
          const booksURL = "https://bs-api.sobuj.net/view/books/readBook.php";
          let response = await axios.get(booksURL);
          booksData = response.data;
        } catch (e) {
          console.log("Error in fetching books", e);
        }
      }

      // Add book's row
      function addBookRow() {
        let container = document.getElementById("booksContainer");

        let rowIndex = container.children.length;

        // Creating row
        let row = document.createElement("div");
        row.className = "row mb-2";

        row.innerHTML = `
          <div class="col-md-5">
            <select class="form-select book-select" onchange="updatePrice(${rowIndex})">
              <option value="">Select a book</option>
              ${booksData
                .map((book) => {
                  return `<option value="${book.book_id}" data-price="${book.price}" data-author="${book.author}">${book.title} - $${book.price} by ${book.author}</option>`;
                })
                .join("")}
            </select>
          </div>
          <div class="col-md-3">
              <input type="number" class="form-control quantity-input" min="1" value="1" onchange="updatePrice(${rowIndex})">
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control line-total" value="0.00" readonly>
          </div>
          <div class="col-md-1">
            <button type="button" class="btn btn-danger" onClick="removeBookRow(this)">X</button>
          </div>
        `;
        container.appendChild(row);
      }

      // updatePrice(1);
      // Update Price based on the selected books
      function updatePrice(index) {
        let row = document.getElementById("booksContainer").children[index];
        let bookSelect = row.querySelector(".book-select");
        let quantityInput = row.querySelector(".quantity-input");
        let lineTotalInput = row.querySelector(".line-total");

        let selectedBook = bookSelect.options[bookSelect.selectedIndex];
        let price = parseFloat(selectedBook.getAttribute("data-price") || 0);
        let quantity = parseInt(quantityInput.value || 1);

        lineTotalInput.value = (price * quantity).toFixed(2);
      }

      // Remove book row from the modal
      function removeBookRow(button) {
        button.parentElement.parentElement.remove();
      }

      async function createOrder() {
        let customerId = document.getElementById("customerSelect").value;
        if (!customerId) {
          alert("Please select a customer");
          return;
        }

        let orderDetails = [];
        document.querySelectorAll("#booksContainer .row").forEach((row) => {
          let bookSelect = row.querySelector(".book-select");
          let quantityInput = row.querySelector(".quantity-input");
          let lineTotalInput = row.querySelector(".line-total");

          if (bookSelect.value) {
            orderDetails.push({
              book_id: bookSelect.value,
              quantity: quantityInput.value,
              line_total: lineTotalInput.value,
            });
          }
        });

        // Check if order has a value
        if (orderDetails.length === 0) {
          alert("Please add at least one book to the order");
          return;
        }

        // Prepare Order Data
        let orderData = {
          customer_id: customerId,
          order_details: orderDetails,
        };

        console.log("Sending order data");

        // Sending Create API Request
        try {
          const createOrderURL =
            "https://bs-api.sobuj.net/view/orders/insertOrder.php";

          let response = await axios.post(createOrderURL, orderData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
          document.getElementById("booksContainer").innerHTML = "";
          let modal = bootstrap.Modal.getInstance(
            document.getElementById("createOrderModal")
          );
          modal.hide();
          
          showMessage();
          getOrders();
          }
        } catch (e) {
          console.log("Error in creating order", e);
        }
      }

      // fetch customers and books
      window.onload = () => {
        fetchCustomers();
        fetchBooks();
      };

      // Create Orders