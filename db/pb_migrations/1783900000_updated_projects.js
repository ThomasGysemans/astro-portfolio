/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // `category` becomes the multi-select `categories` (same field id, the
  // stored values are kept) and gains the new "software" value: a project
  // may now belong to several categories so the /projects filters never
  // hide it from a visitor browsing a sibling category.
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 7,
    "name": "categories",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "web",
      "games",
      "apps",
      "software",
      "languages",
      "challenges",
      "other"
    ]
  }))

  app.save(collection)

  // Projects typed "app-and-website" belong to both "web" and "apps":
  // merge before the `type` column disappears.
  const records = app.findRecordsByFilter("pbc_484305853", "type = 'app-and-website'")
  for (const record of records) {
    const merged = new Set(record.get("categories"))
    merged.add("web")
    merged.add("apps")
    record.set("categories", Array.from(merged))
    app.save(record)
  }

  // remove field: `type` is redundant now that a project can carry
  // every category it fits in.
  collection.fields.removeById("select2363381545")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // restore the single-select `category` (records keep only their first value)
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 0,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "web",
      "games",
      "apps",
      "languages",
      "challenges",
      "other"
    ]
  }))

  // add field (its values are lost)
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "website",
      "app-and-website",
      "video-game",
      "mobile-app",
      "programming-language",
      "coding-challenge",
      "database-project",
      "open-source-project"
    ]
  }))

  return app.save(collection)
})
