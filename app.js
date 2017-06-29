localStorage.setItem("recipes", JSON.stringify([]))

$(document).ready(function() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax();
  $("#parenthesis").hide()
  $(".search-heading").hide()
  $(".saved-heading").hide()

  var baseURL = "https://api.edamam.com/search"
  var appId = "79cadef9"
  var appKey = "0a17582107ea8f662ffaf8279e8731fa"
  var from = 0
  var to = 24 // 24 results for testing
  var range = "&from=" + from + "&to=" + to

  $("form.search-form").submit(function(event) {
    event.preventDefault()
    $(document).scrollTop($(".search-content").offset().top)
    $("#search-results").empty()
    $("#query").text($(".main-search").val())
    $(".search-heading").show()
    var query = "?q=" + $(".main-search").val().replace(/ /g, ",").replace(/,,/g, ",")
    var requestURL = baseURL + query + range
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
  })

}) // end of $(document).ready

function ingredientList(array) {
  var list = $("<ul></ul>")
  for (var i = 0; i < array.length; i++) {
    list.append("<li style='list-style-type: disc'>" + array[i])
  }
  return list
}

function createNewCard(parent, recipe) {
  var card = $('<div class="card col s12 m3"></div>')
  var cardImage = $('<div class="card-image waves-effect waves-block waves-light"></div>')
  var cardContent = $("<div class='card-content'></div>")
  var cardReveal = $("<div class='card-reveal'></div>")
  $(card).append(cardImage)
  $(card).append(cardContent)
  $(card).append(cardReveal)
  $(cardImage).append($('<img class="activator" src="' + recipe.image + '">'))
  $(cardContent).append($("<span class='card-title activator grey-text text-darken-4'><i class='material-icons right'>more_vert</i>"
    + recipe.label + "</span>"))
  $(cardContent).append($("<p><a class='link' target='_blank' href="
    + recipe.shareAs + ">See Full Details</a></p>"))
  // Adds a Save Recipe Button with click listener
  $(cardContent).append($("<a class='btn'>Save Recipe</a>").click(function() {
    saveRecipes(recipe)
    $("#parenthesis").show()
    var counter = Number($("#counter").text()) + 1
    $("#counter").text(counter)
    appendSaved(recipe)
  }))
  $(cardReveal).append($("<span class='card-title grey-text text-darken-4'><i class='material-icons right'>close</i>"
    + recipe.label + "</span>"))
  $(cardReveal).append(ingredientList(recipe.ingredientLines))
  return $(parent).append(card)
}

function appendRecipeCards(data) {
  for (var i = 0; i < data.hits.length; i++) {
    createNewCard($("#search-results"), data.hits[i].recipe)
  }
}

function saveRecipes(recipe) {
  var recipes = JSON.parse(localStorage.getItem("recipes"))
  recipes.push(recipe)
  localStorage.setItem("recipes", JSON.stringify(recipes))
}

function appendSaved(recipe) {
  $(".saved-heading").show()
  createNewCard($(".saved-recipes"), recipe)
}
