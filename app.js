$(document).ready(function() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax();

  var baseURL = "https://api.edamam.com/search"
  var appId = "79cadef9"
  var appKey = "0a17582107ea8f662ffaf8279e8731fa"
  var range = "&from=0&to=12" // 12 results for testing

  // "enter" key event listener
  $("#go-btn").click(function() {
    var query = "?" + "q=" + $(".main-search").val().replace(/ /g, ",").replace(/,,/g, ",")
    var requestURL = baseURL + query + range
    var settings = {
      "url": requestURL,
      "method": "GET",
      "headers": {
        "app_id": appId,
        "app_key": appKey,
      }
    }
    $.ajax(settings).then(appendRecipeCards);
    })
  })

function createNewCard(parent, recipe, index) {
  var card = $('<div class="card col s12 m3"></div>')
  var cardImage = $('<div id=' + index + ' class="card-image waves-effect waves-block waves-light"></div')
  var cardContent = $("<div id=" + index + " class='card-content'></div>")
  var cardReveal = $("<div id=" + index + " class='card-reveal'></div")

  $(card).append(cardImage) //img container
  $(card).append(cardContent) // contentContainer
  $(card).append(cardReveal) // reveal container
  $(cardImage).append($('<img class="activator" src="' + recipe.image + '">')) // card image
  $(cardContent).append($("<span class='card-title activator grey-text text-darken-4'>" + recipe.label + "</span>")) // card Title
  $(cardContent).append($("<p><a class='link' href=" + recipe.url + "target='_blank'></a></p>")) // card link
  $(cardReveal).append($("<span class='card-title grey-text text-darken-4'>" + recipe.label + "</span>")) // reveal Title
  $(cardReveal).append($("<p></p>"))

  return $(parent).append(card)
}

function appendRecipeCards(data) {
  for (var i = 0; i < data.hits.length; i++) {
    createNewCard($("#search-results"), data.hits[i].recipe, i) // creates new card
    // data.hits[i].recipe.image
    // data.hits[i].recipe.label // Title
    // data.hits[i].recipe.ingredientLines // array of ingredients
        // create a function that array to list
  }
}

// before appending cards, set display to none for default content
