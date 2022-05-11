const getCard = (recipe) => {
  return `<div class="col-lg-4 p-2">
  <div class="card">
    <img src="images/${
      recipe.image ?? 'images/header_cover.jpg'
    }" class="card-img-top" alt="${recipe.title ?? 'Food recipe'}" />
    <div class="card-body">
      <h5 class="card-title d-flex align-items-center">
        ${recipe.title ?? 'Food recipe'}
        <small>
          <span class="badge rounded-pill bg-info text-white mx-1">
            ${recipe.category ?? 'Food'}
          </span>
        </small>
      </h5>
      
      <p class="card-text fw-light">
        ${recipe.description.slice(0, 100).concat(' ...') ?? 'Description'}
      </p>
      <a href="./recipe_detail.html?recipe=${
        recipe.id
      }" class="btn btn-primary">Detail</a>
    </div>
  </div>
</div>`;
};

const latestRecipe = () => {
  let timeStamp = Math.floor(Date.now() / 1000);
  $.getJSON(`recipe_data.json?t=${timeStamp}`, (data) => {
    let recipe = '';

    const latest = data.sort((a, b) => b.id - a.id).slice(0, 3);
    latest.map((item) => (recipe += getCard(item)));
    $('#latest_recipe').append(recipe);
  });
};
latestRecipe();

const getRecipeDetail = () => {
  const url = new URL(window.location.href);
  const recipeDetail = url.searchParams.get('recipe');

  if (recipeDetail) {
    let timeStamp = Math.floor(Date.now() / 1000);
    $.getJSON(`recipe_data.json?t=${timeStamp}`, (data) => {
      const recipeFilter = data.filter((item) => item.id == recipeDetail);

      if (recipeFilter.length > 0) {
        const recipe = recipeFilter[0];

        document.title = recipe.title;
        $('#title_recipe').text(recipe.title);
        $('#category_recipe').text(recipe.category);
        $('#current_recipe').text(recipe.title);
        $('#description_recipe').text(recipe.description);
        $('#image_recipe').attr('src', `images/${recipe.image}`);

        let ingredients = '';
        recipe.ingredients.map((item) => (ingredients += `<li>${item}</li>`));
        $('#ingredients_recipe').append(ingredients);

        let steps = '';
        recipe.steps.map((item) => (steps += `<li>${item}</li>`));
        $('#steps_recipe').append(steps);

        if (recipe.id > 1) {
          $('.previous__recipe').prop('disabled', false);
          $('.previous__recipe').on('click', (prev) => {
            window.location.href = `./recipe_detail.html?recipe=${
              recipe.id - 1
            }`;
          });
        } else {
          $('.previous__recipe').prop('disabled', true);
        }

        if (recipe.id < data.length) {
          $('.next__recipe').prop('disabled', false);
          $('.next__recipe').on('click', (next) => {
            window.location.href = `./recipe_detail.html?recipe=${
              recipe.id + 1
            }`;
          });
        } else {
          $('.next__recipe').prop('disabled', true);
        }
      } else {
        window.location.href = './404.html';
      }
    });
  } else {
    window.location.href = './';
  }
};

const getRecipe = (search) => {
  $('#recipe_result').empty();
  let timeStamp = Math.floor(Date.now() / 1000);

  $.getJSON(`recipe_data.json?t=${timeStamp}`, (data) => {
    let result;
    let recipe = '';
    const category = $('#category').val();

    if (category !== 'All' && search.length > 0) {
      result = data.filter(
        (item) =>
          item.category == category &&
          item.title.toLowerCase().includes(search.toLowerCase())
      );
    } else if (category !== 'All' && search.length == 0) {
      result = data.filter((item) => item.category == category);
    } else if (category === 'All' && search.length > 0) {
      result = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      result = data.slice(0, 6);
    }

    result.map((item) => (recipe += getCard(item)));
    $('#recipe_result').append(recipe);
  });
};
getRecipe('');

$('#search_recipe').on('keyup', (e) => {
  const search = e.target.value;
  if (search.length > 0) {
    getRecipe(search);
  } else {
    getRecipe('');
  }
});

$('#category').on('change', (e) => getRecipe($('#search_recipe').val()));
