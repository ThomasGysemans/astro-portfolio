/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // remove field
  collection.fields.removeById("select1841317061")

  return app.save(collection)
})
