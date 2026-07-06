/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select1841317061",
    "maxSelect": 0,
    "name": "group",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "frontend-frameworks",
      "languages",
      "styling-markup",
      "backend-databases",
      "mobile-3d-games"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select1841317061",
    "maxSelect": 0,
    "name": "group",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ty",
      "dazdza"
    ]
  }))

  return app.save(collection)
})
