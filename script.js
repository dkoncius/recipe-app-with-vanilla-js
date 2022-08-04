"use strict";

// Meals variables
var API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
var SEARCH_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
var meals = document.getElementById("meals");
var form = document.querySelector("form");
var searchTerm = document.getElementById("search-term");
var searchBtn = document.getElementById("search");

// For localmemory
var memoryList = [];

// Initial load
getRandomMeal();

// Gets random meals data from database
async function getRandomMeal(){
    var resp = await fetch(API_URL);
    var respData = await resp.json();
    var randomMeal =  respData.meals[0];

    loadMeals(randomMeal, true);
    loadMealsLS();
}

// Gets searched meals data from database
async function getMealsBySearch(term) {
    var resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
    );

    var respData = await resp.json();
    var meals = respData.meals;

    return meals;
}

// Appends meals to websites
function loadMeals(mealData, random = false){
    var meal = document.createElement("div");
    meal.classList.add("meal");
    meal.innerHTML =
    `
     <div class="meal-header">
                 ${random ? "<span class='random'> Random Recipe </span>" : ""}
                    <img src="${mealData.strMealThumb}" alt="Leblebi Soup">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class="fav-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
    `
    // Favorite meal variable
    var favBtn = meal.querySelector(".fav-btn");
    favBtn.addEventListener("click", function(){
        checkForFavMeal(mealData);
        this.classList.toggle("active");
    })

    // Show meal data
    meal.addEventListener("click", function(){
        showMealInfo(mealData);
    });
    meals.append(meal);
}

// Loads meals
form.addEventListener("submit", async function(e){
    e.preventDefault();

    // Clean container
     meals.innerHTML = "";

     var search = searchTerm.value;
     var searchedMeals = await getMealsBySearch(search);
     if(searchedMeals) {
         searchedMeals.map(x => {
             loadMeals(x);
         })
     }
})
 
function showMealInfo(mealData){
    // Popup variables
        var mealPopup = document.getElementById("meal-popup");

        // Clean popout
        mealPopup.innerHTML = "";
       
        // Load data to popout
        var popup = document.createElement("div");
        popup.classList.add("popup");

        var ingredients = [];
        for(var i = 1; i <= 20; i++){
            if(mealData["strIngredient" + i]){
                ingredients.push(`${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`);
            } else {
                break;
            }
        }
        var join = ingredients.map(x => x).join("");
        mealPopup.innerHTML =
        `
           <div class="popup">
                <button id="close-popup" class="close-popup">
                    <i class="fas fa-times"></i>
                </button>
                <div class="meal-info" id="meal-info">
                    <div>
                        <h1>${mealData.strMeal}</h1>
                        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        <p>${mealData.strInstructions}</p>
                        <h3>Ingredients:</h3>
                        <ul>
                            ${ingredients
                                .map((x) => `<li>${x}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>
        `
         //  Show popup
        mealPopup.append(popup);
        mealPopup.classList.remove("hidden");


        // Hide popup
        var popupCloseBtn = document.getElementById("close-popup");
        popupCloseBtn.addEventListener("click", function(){
            mealPopup.classList.add("hidden");
        });
}

function addFavoriteMeal(mealData){
    var favMeals = document.getElementById("fav-meals");    
    var newFav = document.createElement("li");

    newFav.innerHTML =
    `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span class="title">${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
         
    `
    var clearBtn = newFav.querySelector(".clear");
    clearBtn.addEventListener("click", function(){
        this.parentNode.remove();
    });

    newFav.addEventListener("click", function(){
        showMealInfo(mealData);
    });

    favMeals.append(newFav);

    // Add to memory
    memoryList.push(mealData);
    console.log(memoryList)
    localStorage.setItem("fav-meals", JSON.stringify(mealData));
    console.log(JSON.parse(localStorage.getItem("fav-meals")));
}

function checkForFavMeal(mealData){
    console.log(mealData);
    var titles = document.querySelectorAll(".title");
    var titlesList = [];

    titles.forEach(x => {
        titlesList.push(x.innerText);
    });

    // Removes by index from favorite meals
    if(titlesList.includes(mealData.strMeal)) {
        var index = titlesList.indexOf(mealData.strMeal);
        var favMeals = document.querySelectorAll("#fav-meals li");
        favMeals[index].remove();
    }
    else {
        addFavoriteMeal(mealData); 
    } 
}

// Get meals from memory
function getMealsLS(){
    var parse = JSON.parse(localStorage.getItem("fav-meals"));

    return parse === null ? [] : parse;
}


// Load from memory favorite meals
async function loadMealsLS(){
    var parse = await JSON.parse(localStorage.getItem("fav-meals"));
    if(parse != null){
       checkForFavMeal(parse);
    }
}
