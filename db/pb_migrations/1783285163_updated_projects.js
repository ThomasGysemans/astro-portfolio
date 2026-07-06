/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field
  collection.fields.addAt(15, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url1669114857",
    "name": "github",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url917281265",
    "name": "link",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select3797779838",
    "maxSelect": 0,
    "name": "context",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "personal",
      "school",
      "professional"
    ]
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select2698072953",
    "maxSelect": 2,
    "name": "languages",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "fr",
      "en"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("url1669114857")

  // remove field
  collection.fields.removeById("url917281265")

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select3797779838",
    "maxSelect": 0,
    "name": "context",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "personal",
      "school",
      "professionnal"
    ]
  }))

  // update field
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

  return app.save(collection)
})
