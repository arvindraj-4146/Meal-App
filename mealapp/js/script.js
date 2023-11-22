// it makes a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// it fetches meals from api and return it
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}



// it show's all meals card in main acording to search input value
function showMealList(){
    // Fetching user input from an HTML input element with the ID "my-search"
    let inputValue = document.getElementById("my-search").value;
    // Retrieving the 'favouritesList' from localStorage and parsing it into an array
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    
    // The API endpoint URL for meal search
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
     // HTML variable to store the generated HTML content for displaying meals
    let html = "";
    // Fetching meals from the API based on the input value
    let meals=fetchMealsFromApi(url,inputValue);
    // Handling the promise from fetching meals from the API
    meals.then(data=>{
        if (data.meals) {
            // If meals are found, iterate through each meal in the data
            data.meals.forEach((element) => {
                let isFav=false;
                // Checking if the meal ID exists in the 'favouritesList'
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                // Creating HTML content for each meal card based on whether it's a favorite or not
                if (isFav) {
                    // If the meal is a favorite, construct HTML accordingly
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                // If the meal is not a favorite, construct HTML accordingly
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            // If no meals are found, display a 404 error message
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
         // Displaying the generated HTML content on the 'main' element in the DOM
        document.getElementById("main").innerHTML = html;
    });
}



//it  shows full meal details in main
async function showMealDetails(id) {
    // API endpoint URL for fetching meal details by ID
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    // Initializing an empty HTML string
    let html="";
    // Fetching meal details from the API based on the provided ID
    await fetchMealsFromApi(url,id).then(data=>{
        // Constructing HTML content based on the retrieved meal details
        html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
    });
     // Displaying the constructed HTML content in the 'main' element of the document
    document.getElementById("main").innerHTML=html;
}




// it shows all favourites meals in favourites body
async function showFavMealList() {
    // Retrieving the 'favouritesList' from localStorage and parsing it into an array
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    // API endpoint URL for fetching meal details by ID
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    // Initializing an empty HTML string
    let html="";
    // Checking if the 'favouritesList' is empty
    if (arr.length==0) {
        // If 'favouritesList' is empty, display a message indicating no meals added to favorites
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        // If 'favouritesList' is empty, display a message indicating no meals added to favorites
        for (let index = 0; index < arr.length; index++) {
            // Fetching meal details from the API based on the meal ID
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                // Constructing HTML content for each favorite meal
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    // Displaying the constructed HTML content in the element with the ID "favourites-body"
    document.getElementById("favourites-body").innerHTML=html;
}






//it adds and remove meals to favourites list
function addRemoveToFavList(id) {
    // Retrieve the 'favouritesList' from localStorage and parse it into an array
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    // Initialize a variable to track if the meal ID is already in the favorites list
    let contain=false;
    // Check if the meal ID already exists in the favorites list
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    // If the meal ID is in the favorites list
    if (contain) {
        // Remove the meal from the favorites list by finding its index and splicing it out
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        // If the meal ID is not in the favorites list, add it to the list
        arr.push(id);
        alert("your meal add your favourites list");
    }
    // Update the 'favouritesList' in localStorage with the updated array
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    // Call functions to update the displayed meal lists after the modification
    showMealList(); //Function to update the main meal list display
    showFavMealList(); // Function to update the favorites meal list display
}
