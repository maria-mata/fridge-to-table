$(document).ready(function() {
  activateApp()
  smoothScroll()
  $("form.search-form").submit(findRecipes)
})

function activateApp() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax();
  $("#parenthesis").hide()
  $(".search-content").hide()
  $("#saved-recipes").hide()
}

function smoothScroll() {
  $('a[href^="#"]').on('click',function (e) {
    e.preventDefault()
    var target = this.hash
    var $target = $(target)
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target
    })
  })
}

function findRecipes(event) {
  event.preventDefault()
  if ($(".main-search").val() !== "") {
    initiateSearchBehavior()
    var query = $(".main-search").val().replace(/ /g, ",").replace(/,,/g, ",")
    var requestURL = `${baseURL}?q=${query}&from=0&to=48`
    var settings = {
      "url": requestURL,
      "method": "GET",
      "headers": {
        "app_id": appId,
        "app_key": appKey,
      }
    }
    $.ajax(settings).then(appendRecipeCards)
    $(".main-search").val("")
  }
}

function initiateSearchBehavior() {
  $(".search-content").show()
  $('html, body').animate( {
    scrollTop: $(".search-content").offset().top
  }, 3000);
  $("#loading").show()
  $("#search-results").empty()
  $("#query").text($(".main-search").val())
}

function appendRecipeCards(data) {
  $("#loading").hide()
  for (var i = 0; i < data.hits.length; i++) {
    createNewCard($("#search-results"), data.hits[i].recipe, "Save", i)
  }
}

function createNewCard(parent, recipe, buttonContent) {
  var card = $(`<div class="card col s12 m3">
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" src="${recipe.image}">
    </div>
  </div>`)
  var cardContent = $(`<div class='card-content'>
    <span class='card-title activator grey-text text-darken-4'>
      <i class='material-icons right'>more_vert</i>${recipe.label}
    </span>
  </div>`)
  var cardReveal = `<div class='card-reveal'>
    <span class='card-title grey-text text-darken-4'>
      <i class='material-icons right'>close</i>
      ${recipe.label}
    </span>
    ${ingredientList(recipe.ingredientLines)}
    <p>
      <a class='link' target='_blank' href=${recipe.url}>See Full Recipe
        <i class='material-icons'>open_in_new</i>
      </a>
    </p>
  </div>`
  var button = `<a class='btn waves-effect waves-light'>${buttonContent}</a>`
  $(cardContent).append($(button).click(function() {
      if ($(this).text() == "Save") {
        saveRecipe(this, recipe)
      } else if ($(this).text() == "Unsave") {
        unsaveRecipe(this, recipe)
      }
  }))
  $(card).append(cardContent)
  $(card).append(cardReveal)
  $(parent).delay(200).fadeIn(800, function() {
    $(this).append(card)
  })
}

function ingredientList(array) {
  var list = $("<ul></ul>")
  for (var i = 0; i < array.length; i++) {
    list.append("<li style='list-style-type: disc'>" + array[i])
  }
  return list
}

function saveRecipe(button, recipe) {
  increaseCounter(recipe)
  $("#saved-recipes").show()
  createNewCard($(".saved-recipes"), recipe, "Unsave")
  $(button).parent().parent().delay(1000).fadeOut(300, function() {
    $(this).remove();
  })
}

function unsaveRecipe(button, recipe) {
  createNewCard($("#search-results"), recipe, "Save")
  $(button).parent().parent().delay(500).fadeOut(400, function() {
    $(this).remove();
  })
  decreaseCounter(recipe)
}

function increaseCounter(recipe) {
  $("#parenthesis").show()
  var counter = Number($("#counter").text()) + 1
  $("#counter").text(counter)
}

function decreaseCounter(recipe) {
  var counter = Number($("#counter").text()) - 1
  $("#counter").text(counter)
  if (counter == 0) {
    $("#saved-recipes").delay(500).fadeOut(400, function() {
      $(this).hide()
    })
    $("#parenthesis").hide()
    $(document).scrollTop("#saved-recipes").offset()
  }
}
