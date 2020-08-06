const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');




//Search for meals
function searchMeal(e) {

    //Clear single meal
    single_mealEl.innerHTML = '';

    //Get search term
    const term = search.value;

    //Check for empty 
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                //Use this to read the data 
                console.log(data)
                resultHeading.innerHTML = `<h2>Search Results for ${term}:</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>The food you're looking for ain't here! 😕</h2>`
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class='meal'>
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                        .join('');
                }
            });

        //Clear search text 
        search.value = '';
    } else {
        alert('Please enter a search term')
    }

    console.log(term)


    e.preventDefault()
}


//Fetch meal by ID
function getMealById(mealID) {
    fetch(` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
            scrollDown();
        })
}



//Fetch random meal
function getRandomMeal() {

    //Clear everything
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''

    fetch(` https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]

            addMealToDOM(meal)
        })
}

// Add Meal to DOM
function addMealToDOM(meal) {
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal [`strIngredient${i}`]} - ${meal [`strMeasure${i}`]} `);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>

            <div class="main">
                
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <p>${meal.strInstructions.split(';').map(item => `<p>${item}.</p>`).join('')}</p>
            </div>
    </div>
    
    `
}


function scrollDown() {
    single_mealEl.scrollIntoView({
        behavior: 'smooth',
        block: "start"
    })
    single_mealEl.scrollBottom += 10;
}

//Event Listeners
submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {

    const path = e.path || (e.composedPath && e.composedPath());
    const mealInfo = path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false
        }
    })

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid')
        getMealById(mealID)
    }


})