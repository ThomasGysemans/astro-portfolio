/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // add field: the project a review is about, linked from the homepage
  collection.fields.add(new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_484305853",
    "help": "Project the review is about (optional): the homepage links to it.",
    "hidden": false,
    "id": "relation1793906776",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "project",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4163081445")

  // remove field
  collection.fields.removeById("relation1793906776")

  return app.save(collection)
})
