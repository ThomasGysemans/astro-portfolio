/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "bool1007901140",
    "name": "featured",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "help": "The project whose pictures fill the homepage carousel (only one project should have it).",
    "hidden": false,
    "id": "bool2571037632",
    "name": "carousel",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "bool1007901140",
    "name": "featured",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "help": "The project whose pictures fill the homepage carousel (only one project should have it).",
    "hidden": false,
    "id": "bool2571037632",
    "name": "carousel",
    "presentable": true,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
