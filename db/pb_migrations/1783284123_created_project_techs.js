/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_484305853",
        "help": "",
        "hidden": false,
        "id": "relation800313582",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "project",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_458473246",
        "help": "",
        "hidden": false,
        "id": "relation4100149837",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "technology",
        "presentable": true,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select1466534506",
        "maxSelect": 0,
        "name": "role",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "frontend",
          "backend",
          "framework",
          "language",
          "styling",
          "app",
          "back-office",
          "3d",
          "engine",
          "database",
          "markup",
          "tooling"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "number1177347317",
        "max": null,
        "min": null,
        "name": "position",
        "onlyInt": true,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_307246748",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_sz9yjaek8u` ON `project_techs` (\n  `project`,\n  `technology`\n)"
    ],
    "listRule": null,
    "name": "project_techs",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_307246748");

  return app.delete(collection);
})
