$(document).ready(function () {
  const getCard = (recipe) => {
    return `<div class="col-lg-4 p-2">
    <div class="card">
      <img src="${
        recipe.image ?? 'images/header_cover.jpg'
      }" class="card-img-top" alt="${recipe.title ?? 'Food recipe'}" />
      <div class="card-body">
        <h5 class="card-title">${recipe.title ?? 'Food recipe'}</h5>
        <p class="card-text fw-light">
          ${recipe.description ?? 'Description'}
        </p>
        <a href="./recipe_detail.html?recipe=${
          recipe.id
        }" class="btn btn-primary">Detail</a>
      </div>
    </div>
  </div>`;
  };

  $.getJSON('recipe_data.json', (data) => {
    let recipe = '';

    data.map((item) => (recipe += getCard(item)));
    $('#latest_recipe').append(recipe);
  });
});

const getRecipeDetail = () => {
  const url = new URL(window.location.href);
  const recipeDetail = url.searchParams.get('recipe');

  if (recipeDetail) {
    $.getJSON('recipe_data.json', (data) => {
      const recipe = data.filter((item) => item.id == recipeDetail);
      if (recipe.length > 0) {
        $('#title_recipe').text(recipe[0].title);
        $('#main_found').show();
        $('#main_not_found').hide();
      } else {
        $('#main_found').hide();
        $('#main_not_found').show();
      }
    });
  } else {
    window.location.href = './index.html';
  }
};
