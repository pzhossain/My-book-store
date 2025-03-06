{/* <div class="row col-12 " id="successMessage" style="display: none; padding: 10px; background: green; color: white;"></div> */}
//Show Success Massage function
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

//Get All Book Function
async function getAllBooks() {
    const url = "https://bs-api.sobuj.net/view/books/readBook.php";
    let table = document.getElementById("bookList");

    try {
        table.innerHTML = "<tr><td colspan='7'>Loading.....</td></tr>";

        let response = await axios.get(url);
        let books = response.data;

        table.innerHTML = "";

        if (!books.length) {
            table.innerHTML = "<tr><td colspan='7'>No books found</td></tr>";
            return;
        }

        books.forEach(async(book)=> {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${book['book_id']}</td>
                <td>${book['title']}</td>
                <td class="author-cell" data-author-id="${book['author_id']}">Loading...</td>                
                <td>${book['price']}</td>
                <td>${book['stock_quantity']}</td>                 
                <td><button class="btn btn-success update-btn" data-id="${book['book_id']}">Update</button></td>
                <td><button class="btn btn-danger delete-btn" data-id="${book['book_id']}">Delete</button></td>
            `;
            table.appendChild(row);
        
            // Fetch and fill in author name dynamically
            let authorName = await getAuthorName(book['author_id']);
            row.querySelector('.author-cell').innerText = authorName;
        })

        //Add event listener for update data fetch
        document.querySelectorAll('.update-btn').forEach(btn=>{
            btn.addEventListener('click',function(){
                goToUpdate(this.dataset.id);
            });
        });

        //Add event listener for delete data fetch
        document.querySelectorAll('.delete-btn').forEach(btn=>{
            btn.addEventListener('click',function(){
                openDeleteWindow(this.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error loading books:", error);
        table.innerHTML = "<tr><td colspan='7'>Failed to load books, try again</td></tr>";
    }
}

//Load name instead of author ID
async function getAuthorName(authorId) {    
    const authorUrl = `https://bs-api.sobuj.net/view/authors/getAuthorById.php?author_id=${authorId}`;
    try {
        let response = await axios.get(authorUrl);
        let author = response.data;
        return author.name || 'Unknown Author';  // Ensure fallback if no name
    } catch (error) {
        console.error(`Failed to load author ${authorId}:`, error);
        return 'Error Loading Author';
    }
}getAllBooks();

//Loading Author to Add new Book Modal
async function fetchAuthors() {
    let authorSelect = document.getElementById("author_select");
    const fetchAllAuthorURL = "https://bs-api.sobuj.net/view/authors/readAuthors.php";

    try {
        let response = await axios.get(fetchAllAuthorURL);
        let authorsData = response.data; // Assuming it's an array

        let options = `<option value="">Select an Author</option>`;
        authorsData.forEach(author => {            
            options += `<option value="${author.author_id}">${author.author_id} - ${author.name} - ${author.email}</option>`;
        });

        authorSelect.innerHTML = options;
    } catch (error) {
        console.log("Error in fetching authors", error);
    }
} fetchAuthors();

//Add or create book Function
async function addBooks(){
    const bookURL = "https://bs-api.sobuj.net/view/books/insertBook.php";
    let bookName = document.getElementById("book_title").value.trim();
    let bookPrice = document.getElementById("book_price").value.trim();
    let bookQty = document.getElementById("stock_qty").value.trim();
    let bookAuthor = document.getElementById("author_select").value;

    try {
        // Validation
        if (!bookName || !bookPrice || !bookQty || !bookAuthor) {
            alert("All data required");
            return;
        }

        // Append Data
        let formData = new FormData();
        formData.append("title", bookName);
        formData.append("price", bookPrice);
        formData.append("stock_qty", bookQty);
        formData.append("author_id", bookAuthor);

        // Send the request
        let response = await axios.post(bookURL, formData);

        // Check API response
        if (response.status === 200) {            
            document.getElementById("book_title").value = "";
            document.getElementById("book_price").value = "";
            document.getElementById("stock_qty").value = "";
            document.getElementById("author_select").value = "";

            // Close Modal
            let modalElement = document.getElementById("addBookModal");
            let modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();

            // Refresh the list
            showMessage();
            getAllBooks();
        } else {
            alert("Failed to add book");
        }
    } catch (error) {
        console.log("Error adding book", error);
        alert("Failed, try again");
    }
}

//Update Book Function
//Loading Author to Add new Book Modal
async function fetchAuthorUpdate() {
    let authorSelect = document.getElementById("update_author_select");
    const fetchAllAuthorURL = "https://bs-api.sobuj.net/view/authors/readAuthors.php";

    try {
        let response = await axios.get(fetchAllAuthorURL);
        let authorsData = response.data; // Assuming it's an array

        let options = `<option value="">Select an Author</option>`;
        authorsData.forEach(author => {            
            options += `<option value="${author.author_id}">${author.author_id} - ${author.name} - ${author.email}</option>`;
        });

        authorSelect.innerHTML = options;
    } catch (error) {
        console.log("Error in fetching authors", error);
    }
} fetchAuthorUpdate();

//Load Book to Update Book Modal
let editBookID = null;
//Get update data details
async function goToUpdate(bookId){
    let URL = `https://bs-api.sobuj.net/view/books/getBookById.php?book_id=${bookId}`;

    try{
        let response = await axios.get(URL);
        let bookData = response.data;

        if(bookData){
            //populate data
           document.getElementById("update_book_title").value= bookData.title;
           document.getElementById("update_book_price").value= bookData.price;
           document.getElementById("update_stock_qty").value= bookData.stock_quantity;
           document.getElementById("update_author_select").value= bookData.author_id;
           editBookID = bookId;

            //show modal
            let editModal = new bootstrap.Modal(document.getElementById("updateBookModal"));
            editModal.show();
        }else{
            alert("Author not found");
        }

    } catch(error){
        console.error("Text",error);
        alert("Author load failed");
    }
}

//Update Book function
async function updateBook() {
    const updateUrl= "https://bs-api.sobuj.net/view/books/updateBook.php";
    let bookName = document.getElementById("update_book_title").value.trim();
    let bookPrice = document.getElementById("update_book_price").value.trim();
    let bookQty = document.getElementById("update_stock_qty").value.trim();
    let bookAuthor = document.getElementById("update_author_select").value;

    try {
        // Validation
        if (!bookName || !bookPrice || !bookQty || !bookAuthor) {
            alert("All data required");
            return;
        }

        // Append Data
        let formData = new FormData();
        formData.append("book_id", editBookID);
        formData.append("title", bookName);
        formData.append("price", bookPrice);
        formData.append("stock_qty", bookQty);
        formData.append("author_id", bookAuthor);

        // Send the request
        let response = await axios.post(updateUrl, formData);

        // Check API response
        if (response.status === 200) {            
            document.getElementById("update_book_title").value = "";
            document.getElementById("update_book_price").value = "";
            document.getElementById("update_stock_qty").value = "";
            document.getElementById("update_author_select").value = "";

            // Close Modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("updateBookModal"));
            modal.hide();

            // Refresh the list
            showMessage();
            getAllBooks();
            
            
        } else {
            alert("Failed to Update book");
        }
    } catch (error) {
        console.log("Error Updating book", error);
        alert("Failed, try again");
    }
}

//Delete book function
let deleteBookId= null;
//Open Modal for delete option
function openDeleteWindow(bookId){ 
    deleteBookId = bookId;
    let deleteModal= new bootstrap.Modal(
        document.getElementById("deleteBookModal")
    );
    deleteModal.show();
}

//Final Delete Function
async function deleteBook() {
    const deleteUrl = "https://bs-api.sobuj.net/view/books/deleteBook.php";

    try{
        if (!deleteBookId) {
            alert("Invalid ID");
            let modal = bootstrap.Modal.getInstance(document.getElementById("deleteBookModal"));
            modal.hide();
            return;
        }        
        //append delete Id
        let formData = new FormData();
        formData.append("book_id",deleteBookId);
        
        //sending response
        let response= await axios.post(deleteUrl,formData);

        if(response.status === 200){
            let modal= bootstrap.Modal.getInstance(document.getElementById("deleteBookModal"));
            modal.hide();

            showMessage();
            getAllBooks();
            
        }else{
            console.log("failed to delete");
        }


    }catch(error){
        console.log("Delete failed",error);
        alert("Delete failed, try again");
    }

}