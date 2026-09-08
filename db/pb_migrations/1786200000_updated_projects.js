/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field: the YouTube links of the project's media list.
  //
  // `pictures` is a *file* field: it can only hold uploaded files, never a
  // URL. The embeds therefore need their own column — but they must still
  // interleave with the files in a single display order, hence the recorded
  // `position` (the index the link occupies in the merged list). At read time
  // each embed claims its index and the uploaded files fill the rest, in the
  // order of `pictures`. Both storages are rewritten together by the
  // back-office media editor, so they cannot drift apart.
  collection.fields.add(new Field({
    "help": "YouTube links shown among the pictures: [{ \"url\": \"https://youtu.be/<id>\", \"position\": 0 }]. `position` is the index in the merged media list (the uploaded `pictures` fill the remaining slots). Managed by the back-office.",
    "hidden": false,
    "id": "json1097546712",
    "maxSize": 0,
    "name": "picture_embeds",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("json1097546712")

  return app.save(collection)
})
