/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field: the projects shown as cards of the homepage's Work section,
  // under the wide headline card. Separate from `featured`, which now only
  // drives the "À la une" filter of /projects and the showcase. With no
  // project flagged here nor as the headline, the homepage drops the section.
  collection.fields.addAt(4, new Field({
    "help": "Shown as a card of the homepage's Work section, under the headline card (\"Sur l'accueil\" in the back-office). With neither these nor a headline, the homepage has no Work section.",
    "hidden": false,
    "id": "bool1793981215",
    "name": "on_homepage",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("bool1793981215")

  return app.save(collection)
})
