var recipeService = require('../services/recipeService')
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/recipe/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var recipes = await recipeService.getAll()
    DI.rh.succeed(res, recipes)
  }))
  // DI.router.post('/crud/recipe/u/', DI.rh.asyncRoute(async (req, res, next) => {
  //   if (req.body.editedRecipe){
  //     var data = await recipeService.saveEditedRecipe(req.body.editedRecipe, DI.data)
  //   }
  //   DI.rh.succeed(res, data)
  // }))
  // DI.router.post('/crud/UoM/r/', DI.rh.asyncRoute(async (req, res, next) => {
  //   if (req.body.name){
  //     var data = await DI.data.rootQuery(`SELECT * FROM UoM WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
  //   }
  //   else {
  //     var data = await DI.data.rootQuery(`SELECT * FROM UoM`)
  //   }
  //   DI.rh.succeed(res, data)
  // }))
  // DI.router.post('/crud/foodType/r/', DI.rh.asyncRoute(async (req, res, next) => {
  //   if (req.body.name){
  //     var data = await DI.data.rootQuery(`SELECT * FROM foodType WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
  //   }
  //   else {
  //     var data = await DI.data.rootQuery("SELECT * FROM foodType")
  //   }
  //   DI.rh.succeed(res, data)
  // }))
}