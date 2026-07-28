/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field: a hidden project stays in the back-office but is filtered out
  // of every public query (see getAllProjects()), so it disappears from the
  // whole site — cards, showcase, sitemap and its own detail page (404).
  // Defaults to false: the existing projects stay visible.
  collection.fields.add(new Field({
    "help": "Hide the project from the public site entirely (still editable in the back-office).",
    "hidden": false,
    "id": "bool1547319508",
    "name": "hidden",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("bool1547319508")

  return app.save(collection)
})
