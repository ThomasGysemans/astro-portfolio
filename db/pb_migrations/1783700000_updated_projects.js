/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field
  collection.fields.addAt(9, new Field({
    "help": "Per-picture localized captions, keyed by the stored filename: { \"<filename>\": { \"fr\": \"...\", \"en\": \"...\" } }. Managed by the back-office.",
    "hidden": false,
    "id": "json3168469766",
    "maxSize": 0,
    "name": "picture_captions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("json3168469766")

  return app.save(collection)
})
