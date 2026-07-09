/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // add field
  collection.fields.addAt(8, new Field({
    "help": "Star rating shown on the freelance page (1 to 5).",
    "hidden": false,
    "id": "number1092379046",
    "max": 5,
    "min": 1,
    "name": "rating",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // remove field
  collection.fields.removeById("number1092379046")

  return app.save(collection)
})
