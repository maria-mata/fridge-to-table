$(document).ready(function() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax();

  var baseURL = "https://api.edamam.com/search"
  var appId = "79cadef9"
  var appKey = "0a17582107ea8f662ffaf8279e8731fa"
  var range = "&from=0&to=12" // 12 results for testing

  // Need to fix to allow multiple searches
  $("form.search-form").submit(function(event) {
    event.preventDefault()
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

}) // end of $(document).ready

function ingredientList(array) {
  var list = $("<ul></ul>")
  for (var i = 0; i < array.length; i++) {
    // need to add li bullets
    list.append("<li style='list-style-type: disc'>" + array[i])
  }
  return list
}

function createNewCard(parent, recipe, index) {
  var card = $('<div class="card col s12 m3"></div>')
  var cardImage = $('<div id=' + index +
    ' class="card-image waves-effect waves-block waves-light"></div')
  var cardContent = $("<div id=" + index + " class='card-content'></div>")
  var cardReveal = $("<div id=" + index + " class='card-reveal'></div")
  $(card).append(cardImage)
  $(card).append(cardContent)
  $(card).append(cardReveal)
  $(cardImage).append($('<img class="activator" src="' + recipe.image + '">'))
  // Need to fix title spacing
  $(cardContent).append($("<span class='card-title activator grey-text text-darken-4'>"
    + recipe.label + "<i class='material-icons right'>more_vert</i></span>"))
  $(cardContent).append($("<p><a class='link' target='_blank' href="
    + recipe.url + ">See Full Details</a></p>"))
  // Need to fix title spacing
  $(cardReveal).append($("<span class='card-title grey-text text-darken-4'>"
    + recipe.label + "<i class='material-icons right'>close</i></span>"))
  $(cardReveal).append(ingredientList(recipe.ingredientLines))
  return $(parent).append(card)
}

function appendRecipeCards(data) {
  for (var i = 0; i < data.hits.length; i++) {
    createNewCard($("#search-results"), data.hits[i].recipe, i)
  }
}
