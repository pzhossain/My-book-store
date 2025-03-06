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

//Get all customers
async function getAllCustomer() {
    const getUrl= "https://bs-api.sobuj.net/view/customers/readCustomers.php"
    let tableData= document.getElementById("customerList");

    try{
        //loading Massage
        tableData.innerHTML = "<tr><td colspan='6'>Loading.....</td></tr>";

        //send request
        let response= await axios.get(getUrl);
        let customers= response.data;        

        if(!customers.length){
            tableData.innerHTML = "<tr><td colspan='6'>No Customer Found. Create One First.</td></tr>";
        } else{
            //Clear Loading massage
            tableData.innerHTML = "";
        }
        customers.forEach((customer)=>{
            let row= document.createElement("tr");
            row.innerHTML=`
            <td>${customer["customer_id"]}</td>
            <td>${customer["name"]}</td>
            <td>${customer["phone"]}</td>
            <td>${customer["email"]}</td>
            <td><button class="btn btn-success update-btn" data-id="${customer['customer_id']}">Update</button></td>
            <td><button class="btn btn-danger delete-btn" data-id="${customer['customer_id']}">Delete</button></td>
            `;

            //append table
            tableData.appendChild(row);
        });

        //add event listener to Update btn
        document.querySelectorAll('.update-btn').forEach((btn)=>{
            btn.addEventListener('click',function(){
                openUpdateModal(this.dataset.id);
            });
        });

        //add event lister to delete btn
        document.querySelectorAll('.delete-btn').forEach((btn)=>{
            btn.addEventListener('click',function(){
                openDeleteModal(this.dataset.id);
            });
        });
    }catch(error){
        console.log("error loading customer", error);
        alert("failed to load customer.");
    }
}
getAllCustomer();

//Add new customer
async function addCustomer() {
    const addUrl= "https://bs-api.sobuj.net/view/customers/insertCustomer.php"
    let addName= document.getElementById("customer_name").value.trim();
    let addEmail= document.getElementById("customer_email").value.trim();
    let addPhone= document.getElementById("customer_phone").value.trim();

    try{
        //form validation
        if(!addName || !addEmail || !addPhone){
            alert("All data required");
            return;
        }
        //append form data
        let formData= new FormData();
        formData.append("name",addName);
        formData.append("email",addEmail);
        formData.append("phone",addPhone);

        //send requests
        let response= await axios.post(addUrl,formData);

        //response validation
        if(response.status === 200){
            //reset Form value
            document.getElementById("customer_name").value= "";
            document.getElementById("customer_email").value= "";
            document.getElementById("customer_phone").value= "";

            //close add customer Modal
            let modalId= document.getElementById("addcustomerModal")
            let modal= bootstrap.Modal.getInstance(modalId) || new bootstrap.Modal(modalId);
            modal.hide();

            showMessage();
            getAllCustomer();
        }

    }catch(error){
        console.log("error adding customer", error);
    }
}

//update customer
let customerId= null;

//open update customer modal function
async function openUpdateModal(id) {
    const url= `https://bs-api.sobuj.net/view/customers/getCustomerById.php?customer_id=${id}`;

    try{
        let response= await axios.get(url);
        let data = response.data;

        if (!data){
            alert ("Customer Not Found")
        }else{
            document.getElementById("update_customer_name").value= data.name;
            document.getElementById("update_customer_email").value= data.email;
            document.getElementById("update_customer_phone").value= data.phone;
            customerId= id;

            //Show update customer Modal
            let modalId= document.getElementById("updateCustomerModal")
            let modal= bootstrap.Modal.getInstance(modalId) || new bootstrap.Modal(modalId);
            modal.show();
        }

    }catch(error){
        console.log ("Error loading customer", error);
        alert("Loading failed");
    }
}

//Update Customer
async function updateCustomer(){
    const updateUrl= "https://bs-api.sobuj.net/view/customers/updateCustomer.php";
    let name= document.getElementById("update_customer_name").value.trim();
    let email= document.getElementById ("update_customer_email").value.trim();
    let phone= document.getElementById ("update_customer_phone").value.trim();

    try{
        //Form validation
        if(!name || !email || !phone){
            alert("all field required");
            return;
        }
        //append data
        let formData= new FormData();
        formData.append("customer_id",customerId);
        formData.append("name",name);
        formData.append("email",email);
        formData.append("phone",phone);

        //sending requests
        let request= await axios.post(updateUrl,formData);

        //check response
        if(request.status === 200){
            //close Modal
            let modalId= document.getElementById("updateCustomerModal");
            let modal= bootstrap.Modal.getInstance(modalId) || new bootstrap.Modal(modalId);
            modal.hide();

            showMessage();
            getAllCustomer();
            return;
        }

    }catch(error){
        console.log("error updating",error);
    }

}

//Delete customer modal
let deleteId= null;

async function openDeleteModal(id) {
   deleteId= id;

   //Modal opening
   let modalId= document.getElementById("deleteCustomerModal");
   let modal= bootstrap.Modal.getInstance(modalId) || new bootstrap.Modal(modalId);
   modal.show();
}

//Delete customer
async function deleteCustomer(){
    const deleteUrl= "https://bs-api.sobuj.net/view/customers/deleteCustomer.php";

    try{
        //check Id
        if(!deleteId){
            alert("No customer found");
            return;
        }
        //append id
        let formData = new FormData();
        formData.append("customer_id",deleteId);

        //send request
        let response = await axios.post(deleteUrl,formData);

        //checking response
        if(response.status === 200){
            let modalId= document.getElementById("deleteCustomerModal");
            let modal= bootstrap.Modal.getInstance(modalId) || new bootstrap.Modal(modalId);
            modal.hide();
            showMessage();          
            
        }else{
            alert(response.data.message || "delete Unsuccessful");
        }
        getAllCustomer();
        showMessage();

    }catch(err){
        console.log ("failed to delete customer", err);
    }   
}