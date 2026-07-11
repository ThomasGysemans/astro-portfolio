/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select2698072953",
    "maxSelect": 0,
    "name": "languages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "fr",
      "en"
    ]
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "file355979739",
    "maxSelect": 0,
    "maxSize": 0,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/avif",
      "image/webp"
    ],
    "name": "thumb",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [
      "800x0",
      "1200x0"
    ],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
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

  // update field
  collection.fields.addAt(7, new Field({
    "help": "",
    "hidden": false,
    "id": "number3145888567",
    "max": null,
    "min": null,
    "name": "year",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2862495610",
    "max": 50,
    "min": 0,
    "name": "date",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number639750161",
    "max": null,
    "min": null,
    "name": "team_size",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("select2698072953")

  // remove field
  collection.fields.removeById("file355979739")

  // remove field
  collection.fields.removeById("file2407280576")

  // update field
  collection.fields.addAt(7, new Field({
    "help": "",
    "hidden": false,
    "id": "number3145888567",
    "max": null,
    "min": null,
    "name": "year",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2862495610",
    "max": 0,
    "min": 0,
    "name": "date",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number639750161",
    "max": null,
    "min": null,
    "name": "team_size",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
