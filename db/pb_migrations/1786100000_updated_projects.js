/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // add field: an optional looping video played in place of the presentation
  // picture on the cards, the explorer and the showcase.
  //
  // It sits *beside* `thumb` instead of replacing it, because the image still
  // has three jobs a video cannot do: it is the `poster` of the video (instant
  // paint, and the only thing shown while it downloads), the fallback for
  // visitors who asked for reduced motion, and the OpenGraph/Twitter card of
  // the project page. No thumb sizes: PocketBase only resizes images.
  collection.fields.add(new Field({
    "help": "Optional looping muted video shown instead of the thumbnail (the thumbnail stays its poster and its social-share image).",
    "hidden": false,
    "id": "file1284770951",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "video/mp4",
      "video/webm",
      "video/quicktime"
    ],
    "name": "thumb_video",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_484305853")

  // remove field
  collection.fields.removeById("file1284770951")

  return app.save(collection)
})
