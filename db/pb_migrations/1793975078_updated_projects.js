/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field: "carousel" becomes "headline". The homepage carousel it was
  // named after is gone; the flag now picks the wide headline card of the Work
  // section ("À la une" in the back-office). Same field id, so PocketBase
  // renames the column and every project keeps its value.
  collection.fields.addAt(3, new Field({
    "help": "The project shown as the wide headline card of the homepage's Work section (\"À la une\" in the back-office; only one project should have it).",
    "hidden": false,
    "id": "bool2571037632",
    "name": "headline",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

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
})
