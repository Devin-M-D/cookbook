async function strapPageHome(){
  var recipes = await getAllRecipes()
  var favorites = await buildRecipeCardList(recipes)
  $("#counterTop").append(favorites)

  $.get("/components/genericWidgets/search.html", val => { $("#siteSearch").html(val) })
  var imgs = []
  imgs.push("img/shoot/tiny1jpg.jpg")
  imgs.push("img/shoot/tiny2jpg.jpg")
  imgs.push("img/shoot/tiny3jpg.jpg")
  imgs.push("img/shoot/tiny4jpg.jpg")
  imgs.push("img/shoot/tiny5jpg.jpg")
  imgs.push("img/shoot/tiny6jpg.jpg")
  imgs.push("img/shoot/tiny7jpg.jpg")
  imgs.push("img/shoot/tiny8jpg.jpg")
  imgs.push("img/shoot/tiny9jpg.jpg")
  imgs.push("img/shoot/tiny10jpg.jpg")
  buildCarousel({ target: $(".carousel"), imagePaths: imgs })
}
