cDI.components.recipeCard = {
//#region main loop
  buildRecipeCardList: async (recipes) => {
    var cardList = []
    console.log(recipes)
    recipes.forEach(async recipe => {
      // for (var x = 0; x < 11; x++){
        cardList.push(await cDI.components.recipeCard.buildRecipeCard(recipe))
      // }
    })
    return cardList
  },
  buildRecipeCard: async (recipe) => {
    var card = $("#cargoHold").find(".recipeCard").clone()
    card.find(".recipeName").html(recipe.name)
    card.data("recipe", recipe)
    card.attr("recipeId", recipe["id"])

    cDI.components.recipeCard.createStepPane(card, recipe.steps, recipe.ingredients, recipe.tools)

    cDI.components.recipeCard.setEditMode(card, false)
    return card
  },
//#endregion

//#region ing pane
  createIngPane: (card, editable = false) => {
    var recipe = null

    if (editable) recipe = card.data("editedrecipe")
    else recipe = card.data("recipe")

    card.find(".cardIngs").empty()
    recipe.ingredients.forEach((ingredient, x) => {
      var ingLine = cDI.components.recipeCard.createIngLine(ingredient, editable)
      card.find(".cardIngs").append(ingLine)
      if (editable){
        var line = card.find(`.cardIngs > .cardIngredient.Ing${ingredient.idx}`)

        var txtIngUoM = line.find(`.txtIngUoM.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngUoM, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane($(e.target), '/crud/UoM/r', 'name')
        })

        var txtIngFood = line.find(`.txtIngFood.Ing${ingredient.idx}`)
        cDI.addAwaitableInput("click", txtIngFood, async (e, s) => {
          return await cDI.components.searchSelect.buildSearchPane(
            $(e.target), '/crud/foodType/r', 'name',
            cDI.components.recipeCard.acceptIngChange,
            true, "crud/foodType/c"
          )
        })
      }
    })
  },
  createIngLine: (ingredient, editable = false) => {
    var ingNum = ingredient.idx
    var ingName = ingredient.name
    if (ingredient.quantity != 1 && cDI.utils.isDef(ingredient.plural)) {
      ingName = ingredient.plural
    }

    var ing = `<span class="cardIngredient algnSS leftCopy fitW unwrap Ing${ingNum}">`
    if (editable){
      ing += `<input class="txtIngQuant Ing${ingNum}" type="text" value="${ingredient.quantity}" />`
      ing += `<input class="txtIngUoM Ing${ingNum}" type="text" value="${ingredient.UoMName}" />`
      ing += `<input class="txtIngFood Ing${ingNum}" type="text" value="${ingName}" />`
    }
    else {
      ing += `
        <span class="noGrow">${ingNum})&nbsp;</span>
        <span class="displayBlock leftCopy">${ingredient.quantity} ${ingredient.UoMAbbreviation} ${ingName}</span>
        `
    }
    ing += `</span>`
    return ing
  },
  acceptIngChange: (input) => {
    var card = input.closest(".recipeCard")
    var recipe
    if (card.data("editedrecipe")){ recipe = card.data("editedrecipe") }
    else { recipe = card.data("recipe") }
    var inputClasses = input.attr('class').split(" ")
    var ingNum = inputClasses.filter(x => x.indexOf("Ing") == 0)[0].replace("Ing", "")
    var origIng = recipe.ingredients.filter(x => x.idx == ingNum)[0].name
    var newIng = input.data("searchselectrecord")

    if (origIng.id != newIng.id){
      var editedRecipe = card.data("editedrecipe")
      editedRecipe.ingredients.find(x => x.idx == ingNum).name = newIng.name
      card.data("editedrecipe", editedRecipe)
      cDI.components.recipeCard.createStepPane(card, editedRecipe.steps, editedRecipe.ingredients, editedRecipe.tools, true)
    }
  },
  //#endregion

//#region step pane
  createStepPane: async (card, steps, ingredients, tools, useEdited = false) => {
    var stepsPane = card.find(".cardSteps")
    var build = () => {
      var filledStepText = cDI.components.recipeCard.getFilledSteps(steps, ingredients, tools)
      stepsPane.html(filledStepText)
    }

    if (useEdited) {
      stepsPane.fadeOut(500, () => {
        build();
        stepsPane.fadeIn(500);
      })
    }
    else { build() }
  },
  getFilledSteps: (steps, ingredients, tools) => {
    var stepList = ``
    steps.forEach((step, x) => {
      var stepText = step.text
      if (step.text.indexOf("{i") != -1) { stepText = cDI.components.recipeCard.addIngredientsToStep(ingredients, stepText) }
      if (step.text.indexOf("{t") != -1) { stepText = cDI.components.recipeCard.addToolsToSteps(tools, stepText) }

      stepList += `
      <span class="cardStep rows unwrap">
        <span class="rowNumber">${x + 1})&nbsp;</span>
        <span class="displayBlock leftCopy">${stepText}</span>
      </span>`
    })
    return stepList
  },
  addIngredientsToStep: (ingredients, stepText) => {
    ingredients.forEach((ingredient, x) => {
      stepText = stepText.replace(`{i${x}}`, `<span class="stepIngredient">${ingredient.name}</span>`)
    })
    return stepText
  },
  addToolsToSteps: (tools, stepText) => {
    tools.forEach((tool, x) => {
      stepText = stepText.replace(`{t${x}}`, `<span class="stepTool">${tool.name.toLowerCase()}</span>`)
    })
    return stepText
  },
//#endregion

//#region editMode and save
  setEditMode: (card, mode = 0) => {
    cDI.components.recipeCard.buildEditBox(card, mode)
    if (mode == 0){
      cDI.components.recipeCard.createIngPane(card, false)
    }
    else {
      card.data("editedrecipe", cDI.utils.clone(card.data("recipe")))
      cDI.components.recipeCard.createIngPane(card, true)
    }
  },
  buildEditBox: (card, mode = 0) => {
    var editBox = card.find(".recipeEdit")
    if (mode == 0){
      editBox.html(`<span class="shpPencil absCen"></span>`)
      cDI.addAwaitableInput("click", editBox, async (e) => {
        cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 1)
      })
    }
    else {
      editBox.html(`
        <span class="absCen fillH">
          <span class="shpCheck"></span>
        </span>
        <span class="absCen fillH">
          <span class="btnCancel">X</span>
        </span>
      `)
      cDI.addAwaitableInput("click", card.find(".recipeEdit").find(".shpCheck"), async (e) => {
        cDI.components.recipeCard.saveChanges($(e.target).closest(".recipeCard"), 0)
      })
      cDI.addAwaitableInput("click", card.find(".recipeEdit").find(".btnCancel"), async (e) => {
        cDI.components.recipeCard.setEditMode($(e.target).closest(".recipeCard"), 0)
      })
    }
  },
//#endregion

  saveChanges: async (card) => {
    console.log("saving", card.data("editedrecipe"))
    cDI.services.recipe.save(card.data("editedrecipe"))
  }
}
