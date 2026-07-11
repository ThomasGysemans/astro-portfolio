/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "file2407280576",
    "maxSelect": 10,
    "maxSize": 15728640,
    "mimeTypes": [
      "video/mp4",
      "video/quicktime",
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif"
    ],
    "name": "pictures",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // update field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "file2407280576",
    "maxSelect": 10,
    "maxSize": 0,
    "mimeTypes": [
      "video/mp4",
      "video/quicktime",
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/avif"
    ],
    "name": "pictures",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
})
