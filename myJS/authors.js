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

async function getAuthors(){

    let URL = "https://bs-api.sobuj.net/view/authors/readAuthors.php";
    let tableData = document.getElementById("authorList");

    try{
        //show loading message
        tableData.innerHTML = "<tr><td colspan='5'>Loading.....</td></tr>";

        //Fetch API from authors
        let response = await axios.get(URL);
        let authors = response.data;
        // console.log(authors);

        //Clear loading message
        tableData.innerHTML = "";

        //If no data exists .. show a text

        if(!authors.length){
            tableData.innerHTML = "<tr><td colspan='5'>No Author found</td></tr>";
            return;
        }

        //Append data to table

        authors.forEach((author)=>{
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${author['author_id']}</td>
                <td>${author['name']}</td>
                <td>${author['email']}</td>
                <td><button class="btn btn-success update-btn" data-id="${author['author_id']}">Update</button></td>
                <td><button class="btn btn-danger delete-btn" data-id="${author['author_id']}">Delete</button></td>
            `;
            tableData.appendChild(row);
        });

        //Add event listener for update data fetch
        document.querySelectorAll('.update-btn').forEach(btn=>{
            btn.addEventListener('click',function(){
                goToUpdate(this.dataset.id);
            });
        });

        //Add event listener for delete data fetch
        document.querySelectorAll('.delete-btn').forEach(btn=>{
            btn.addEventListener('click',function(){
                deleteAuthor(this.dataset.id);
            });
        });


    } catch(error){
        console.error("Error for authors:",error);
        tableData.innerHTML = "<tr><td colspan='5'>Failed to load author, try again</td></tr>";

    } finally{
        console.log("Author fetch attempt completed");
    }
}getAuthors();

async function addAuthor(){
    let URL = "https://bs-api.sobuj.net/view/authors/insertAuthor.php";
    let authorName = document.getElementById("nameID").value.trim();
    let authorEmail = document.getElementById("emailID").value.trim();

    try{
        //Validate
        if(!authorName || !authorEmail){
            alert("All data required");
            return;
        }

        //Append Data
        let formData = new FormData();
        formData.append("name",authorName);
        formData.append("email",authorEmail);

        //send the request
        let response = await axios.post(URL,formData);

        //Check API response
        if(response.status === 200){
            // alert("Author successfully inserted");
            document.getElementById("nameID").value = "";
            document.getElementById("emailID").value = "";

            //Close Modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("addAuthorModal"));
            modal.hide();

            //Refresh the list
            showMessage();
            getAuthors();
            
        }else{
            alert("Failed to add author");
        }


    } catch(error){
        console.error("Erors for adding author",error);
        alert("Failed, try again");
    } finally{
        console.log("Author add att completed");
    };

}

let editAuthorID = null;
//Get update data details
async function goToUpdate(authorID){
    let URL = `https://bs-api.sobuj.net/view/authors/getAuthorById.php?author_id=${authorID}`;

    try{
        let response = await axios.get(URL);
        let authorData = response.data;

        if(authorData){
            //populate data
            document.getElementById("nameIDE").value = authorData.name;
            document.getElementById("emailIDE").value = authorData.email;
            editAuthorID = authorID;

            //show modal
            let editModal = new bootstrap.Modal(document.getElementById("editAuthorModal"));
            editModal.show();
        }else{
            alert("Author not found");
        }

    } catch(error){
        console.error("Text",error);
        alert("Author load failed");
    }
}


async function updateAuthor(){
    let URL = "https://bs-api.sobuj.net/view/authors/updateAuthor.php";
    let authorName = document.getElementById("nameIDE").value.trim();
    let authorEmail = document.getElementById("emailIDE").value.trim();

    try{
        //Validate
        if(!authorName || !authorEmail){
            alert("All data required");
            return;
        }

        //Append Data
        let formData = new FormData();
        formData.append("author_id",editAuthorID);
        formData.append("name",authorName);
        formData.append("email",authorEmail);

        //send the request
        let response = await axios.post(URL,formData);

        //Check API response
        if(response.status === 200){           
            document.getElementById("nameIDE").value = "";
            document.getElementById("emailIDE").value = "";

            //Close Modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("editAuthorModal"));
            modal.hide();
            // alert("Author successfully Updated");
            
            //Refresh the list
            showMessage();
            getAuthors();
           
        }else{
            alert("Failed to Update author");
        }


    } catch(error){
        console.error("Errors for update author",error);
        alert("Failed, try again");
    } finally{
        console.log("Author update att completed");
    };

}


//Delete modal show
let deleteAuthorID = null;

function deleteAuthor(authorID){
    deleteAuthorID = authorID;
    //show delete modal
    let deleteModal = new bootstrap.Modal(document.getElementById("deleteAuthorModal"));
    deleteModal.show();
}

//Delete finally

async function deleteAuthorFinally(){
    let URL = "https://bs-api.sobuj.net/view/authors/deleteAuthor.php";

    try{
        if(!deleteAuthorID){
            alert("Invalid ID");
            return;
        }

        //Append data
        let formData = new FormData();
        formData.append("author_id",deleteAuthorID);

        //send the req
        let response = await axios.post(URL,formData);

        //check API response
        if(response.status===200){
            // alert("Success");

            //close the modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("deleteAuthorModal"));
            modal.hide();

            //refresh
            showMessage();
            getAuthors();            
        }else{
            alert("Failed to delete author");
        }
    } catch(error){
        console.error("Test ",error);
        alert("Delete failed, try again");
    }

};