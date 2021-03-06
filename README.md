[![Build Status](https://travis-ci.org/ibm-watson-data-lab/shopping-list-model-js.svg?branch=master)](https://travis-ci.org/ibm-watson-data-lab/shopping-list-model-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/ibm-watson-data-lab/shopping-list-model-js.svg)](https://greenkeeper.io/)

# Shopping List Domain Model

**Note:** This is a work in progress. Use exact versions when installing (e.g. `--save-exact`) as backwards-incompatible changes may be introduced.

[Shopping List](https://github.com/ibm-watson-data-lab/shopping-list) is a series of Offline First demo apps, each built using a different stack. This is a JavaScript implementation of the domain model for the Shopping List app. This package may be used in Vanilla JS, Polymer, React, Preact, Vue.js, Ember.js, React Native, Ionic, Cordova, Electron, and any other JavaScript implementation of the Shopping List demo app.

## Installation

This package can be installed via npm:

```
npm install ibm-shopping-list-model
```

To use the Shopping List Factory and the Shopping List Repository PouchDB implementation:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
```

## Usage

### Shopping Lists

#### Making a New Shopping List

Use a Shopping List Factory to make a new Shopping List:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

console.log(shoppingList._id);                      // list:…
console.log(shoppingList._rev);                     // undefined
console.log(shoppingList.title);                    // Groceries
```

#### Creating a Shopping List in a Database

Use a Shopping List Repository to create a Shopping List in a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.put(shoppingList).then(shoppingList => {
  console.log(shoppingList._id);                    // list:…
  console.log(shoppingList._rev);                   // 1-…
  console.log(shoppingList.title);                  // Groceries
});
```

#### Reading a Shopping List from a Database

Use a Shopping List Repository to read a Shopping List from a database when you know the `_id` value:

```javascript
const { ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

// Replace "list:cj6mj1zfj000001n1ugjfkj33" with the _id value for your Shopping List
shoppingListRepository.get("list:cj6mj1zfj000001n1ugjfkj33").then(shoppingList => {
  console.log(shoppingList._id);                    // list:cj6mj1zfj000001n1ugjfkj33
  console.log(shoppingList._rev);                   // 1-…
});
```

#### Finding a List of Shopping Lists from a Database

Use a Shopping List Repository to find a List of Shopping Lists from a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList01 = shoppingListFactory.newShoppingList({
  title: "Groceries"
});
let shoppingList02 = shoppingListFactory.newShoppingList({
  title: "Camping Supplies"
});

let listOfShoppingLists = shoppingListFactory.newListOfShoppingLists([
  shoppingList01,
  shoppingList02
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.putBulk(listOfShoppingLists);
}).then(listOfShoppingLists => {
  return shoppingListRepository.find();
}).then(listOfShoppingLists => {
  console.log(listOfShoppingLists.get(0).title);    // Groceries
  console.log(listOfShoppingLists.get(1).title);    // Camping Supplies
});
```

#### Modifying a Shopping List

Shopping Lists are [Immutable.js Record](https://facebook.github.io/immutable-js/docs/#/Record) objects. Use the `set` method or the `mergeDeep` method to make a modified copy of a Shopping List:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

// Shopping List objects are immutable, so we assign the new object to our local shoppingList variable
shoppingList = shoppingList.set("checked", true);

console.log(shoppingList.checked);                  // true

shoppingList = shoppingList.mergeDeep({
  title: "Groceries for Dinner Party",
  checked: false
});

console.log(shoppingList.title);                    // Groceries for Dinner Party
console.log(shoppingList.checked);                  // false
```

#### Updating a Shopping List in a Database

Use a Shopping List Repository to update a Shopping List in a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.put(shoppingList).then(shoppingList => {
  shoppingList = shoppingList.set("checked", true);
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  console.log(shoppingList._rev);                   // 2-…
  console.log(shoppingList.checked);                // true
});
```

#### Deleting a Shopping List from a Database

Use a Shopping List Repository to delete a Shopping List (and all of its Shopping List Items) from a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  console.log(shoppingList._id);                    // list:…
  console.log(shoppingList._rev);                   // 1-…
  console.log(shoppingList.title);                  // Groceries
  return shoppingListRepository.delete(shoppingList);
}).then(shoppingList => {
  console.log(shoppingList._rev);                   // 2-…
  console.log(shoppingList._deleted);               // true
});
```

### Shopping List Items

#### Making a New Shopping List Item

Use a Shopping List Factory to make a new Shopping List Item attached to a Shopping List:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);

console.log(shoppingListItem._id);                  // item:…
console.log(shoppingListItem._rev);                 // undefined
console.log(shoppingListItem.title);                // Mangos
```

#### Creating a Shopping List Item in a Database

Use a Shopping List Repository to create a Shopping List Item in a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);

shoppingListRepository.put(shoppingList).then(shoppingList => {
  return shoppingListRepository.putItem(shoppingListItem);
}).then(shoppingListItem => {
  console.log(shoppingListItem._id);                // item:…
  console.log(shoppingListItem._rev);               // 1-…
  console.log(shoppingListItem.title);              // Mangos
});
```

#### Reading a Shopping List Item from a Database

Use a Shopping List Repository to read a Shopping List Item from a database when you know the `_id` value:

```javascript
const { ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

// Replace "item:cj6mn7e36000001p9n14fgk6s" with the _id value for your Shopping List
shoppingListRepository.getItem("item:cj6mn7e36000001p9n14fgk6s").then(shoppingListItem => {
  console.log(shoppingListItem._id);                // item:cj6mn7e36000001p9n14fgk6s
  console.log(shoppingListItem._rev);               // 1-…
});
```
#### Finding a List of Shopping List Items for a Shopping List from a Database

Use a Shopping List Repository to find a List of Shopping List Items from a database when you know the `_id` value of the parent Shopping List:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges"
}, shoppingList);
let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList);

let listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02,
  shoppingListItem03
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  return shoppingListRepository.putItemsBulk(listOfGroceriesItems);
}).then(listOfGroceriesItems => {
  return shoppingListRepository.findItems({
    selector: {
      type: "item",
      list: shoppingList._id
    }
  });
}).then(listOfGroceriesItems => {
  console.log(listOfGroceriesItems.get(0).title);   // Mangos
  console.log(listOfGroceriesItems.get(1).title);   // Oranges
  console.log(listOfGroceriesItems.get(2).title);   // Pears
});
```

#### Finding a Count of Shopping List Items for a Shopping List from a Database

Use a Shopping List Repository to find a count of Shopping List Items from a database when you know the `_id` value of the parent Shopping List:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges"
}, shoppingList);
let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList);

let listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02,
  shoppingListItem03
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  return shoppingListRepository.putItemsBulk(listOfGroceriesItems);
}).then(listOfGroceriesItems => {
  return shoppingListRepository.findItemsCountByList({
    selector: {
      type: "item",
      list: shoppingList._id
    },
    fields: [ "list" ]
  });
}).then(itemsCount => {
  console.log(itemsCount.get(shoppingList._id));    // 3
});
```

#### Finding a Count of Checked Shopping List Items for a Shopping List from a Database

Use a Shopping List Repository to find a count of checked Shopping List Items from a database when you know the `_id` value of the parent Shopping List:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos",
  checked: true
}, shoppingList);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges",
  checked: true
}, shoppingList);
let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList);

let listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02,
  shoppingListItem03
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  return shoppingListRepository.putItemsBulk(listOfGroceriesItems);
}).then(listOfGroceriesItems => {
  return shoppingListRepository.findItemsCountByList({
    selector: {
      type: "item",
      list: shoppingList._id,
      checked: true
    },
    fields: [ "list" ]
  });
}).then(itemsCount => {
  console.log(itemsCount.get(shoppingList._id));    // 2
});
```

#### Finding a Count of Shopping List Items by Shopping List from a Database

Use a Shopping List Repository to find a count of Shopping List Items by Shopping List from a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList01 = shoppingListFactory.newShoppingList({
  title: "Groceries"
});
let shoppingList02 = shoppingListFactory.newShoppingList({
  title: "Camping Supplies"
});

let listOfShoppingLists = shoppingListFactory.newListOfShoppingLists([
  shoppingList01,
  shoppingList02
]);

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList01);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges"
}, shoppingList01);
let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList01);
let shoppingListItem04 = shoppingListFactory.newShoppingListItem({
  title: "Carabiners"
}, shoppingList02);
let shoppingListItem05 = shoppingListFactory.newShoppingListItem({
  title: "Socks"
}, shoppingList02);

let listOfShoppingListItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02,
  shoppingListItem03,
  shoppingListItem04,
  shoppingListItem05
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.putBulk(listOfShoppingLists);
}).then(listOfShoppingLists => {
  return shoppingListRepository.putItemsBulk(listOfShoppingListItems);
}).then(listOfShoppingListItems => {
  return shoppingListRepository.findItemsCountByList();
}).then(itemsCount => {
  console.log(itemsCount.get(shoppingList01._id));  // 3
  console.log(itemsCount.get(shoppingList02._id));  // 2
});
```

#### Finding a Count of Checked Shopping List Items by Shopping List from a Database

Use a Shopping List Repository to find a count of checked Shopping List Items by Shopping List from a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList01 = shoppingListFactory.newShoppingList({
  title: "Groceries"
});
let shoppingList02 = shoppingListFactory.newShoppingList({
  title: "Camping Supplies"
});

let listOfShoppingLists = shoppingListFactory.newListOfShoppingLists([
  shoppingList01,
  shoppingList02
]);

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos",
  checked: true
}, shoppingList01);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges",
  checked: true
}, shoppingList01);
let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList01);
let shoppingListItem04 = shoppingListFactory.newShoppingListItem({
  title: "Carabiners",
  checked: true
}, shoppingList02);
let shoppingListItem05 = shoppingListFactory.newShoppingListItem({
  title: "Socks"
}, shoppingList02);

let listOfShoppingListItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02,
  shoppingListItem03,
  shoppingListItem04,
  shoppingListItem05
]);

shoppingListRepository.ensureIndexes().then(result => {
  return shoppingListRepository.putBulk(listOfShoppingLists);
}).then(listOfShoppingLists => {
  return shoppingListRepository.putItemsBulk(listOfShoppingListItems);
}).then(listOfShoppingListItems => {
  return shoppingListRepository.findItemsCountByList({
    selector: {
      type: "item",
      checked: true
    },
    fields: [ "list" ]
  });
}).then(itemsCount => {
  console.log(itemsCount.get(shoppingList01._id));  // 2
  console.log(itemsCount.get(shoppingList02._id));  // 1
});
```

#### Modifying a Shopping List Item

Shopping List Items are [Immutable.js Record](https://facebook.github.io/immutable-js/docs/#/Record) objects. Use the `set` method or the `mergeDeep` method to make a modified copy of a Shopping List Item:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingListItem = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
});

// Shopping List Item objects are immutable, so we assign the new object to our local shoppingListItem variable
shoppingListItem = shoppingListItem.set("checked", true);

console.log(shoppingListItem.checked);              // true

shoppingListItem = shoppingListItem.mergeDeep({
  title: "Organic Mangos",
  checked: false
});

console.log(shoppingListItem.title);                // Organic Mangos
console.log(shoppingListItem.checked);              // false
```

#### Updating a Shopping List Item in a Database

Use a Shopping List Repository to update a Shopping List Item in a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);

shoppingListRepository.put(shoppingList).then(shoppingList => {
  return shoppingListRepository.putItem(shoppingListItem);
}).then(shoppingListItem => {
  shoppingListItem = shoppingListItem.set("checked", true);
  return shoppingListRepository.putItem(shoppingListItem);
}).then(shoppingListItem => {
  console.log(shoppingListItem._rev);               // 2-…
  console.log(shoppingListItem.checked);            // true
});
```

#### Deleting a Shopping List Item from a Database

Use a Shopping List Repository to delete a Shopping List Item from a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("ibm-shopping-list-model");
const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);

shoppingListRepository.put(shoppingList).then(shoppingList => {
  return shoppingListRepository.putItem(shoppingListItem);
}).then(shoppingListItem => {
  console.log(shoppingListItem._id);                // item:…
  console.log(shoppingListItem._rev);               // 1-…
  console.log(shoppingListItem.title);              // Mangos
  return shoppingListRepository.deleteItem(shoppingListItem);
}).then(shoppingListItem => {
  console.log(shoppingListItem._rev);               // 2-…
  console.log(shoppingListItem._deleted);           // true
});
```

### Shopping List Item Lists

#### Making a New Shopping List Item List

Use a Shopping List Factory to make a new Shopping List Item List:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges"
}, shoppingList);

let listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02
]);

console.log(listOfGroceriesItems.get(0).title);     // Mangos
console.log(listOfGroceriesItems.get(1).title);     // Oranges
```

#### Modifying Lists of Shopping Lists or Shopping List Items

Lists of Shopping Lists and Shopping List Items are [Immutable.js Lists](https://facebook.github.io/immutable-js/docs/#/List) objects. Use the `push` method, the `delete` method, or other persistent change List methods to make a modified copy of a List:

```javascript
const { ShoppingListFactory } = require("ibm-shopping-list-model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

let shoppingListItem01 = shoppingListFactory.newShoppingListItem({
  title: "Mangos"
}, shoppingList);
let shoppingListItem02 = shoppingListFactory.newShoppingListItem({
  title: "Oranges"
}, shoppingList);

let listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([
  shoppingListItem01,
  shoppingListItem02
]);

console.log(listOfGroceriesItems.get(0).title);     // Mangos
console.log(listOfGroceriesItems.get(1).title);     // Oranges

let shoppingListItem03 = shoppingListFactory.newShoppingListItem({
  title: "Pears"
}, shoppingList);

listOfGroceriesItems = listOfGroceriesItems.push(shoppingListItem03);

console.log(listOfGroceriesItems.get(0).title);     // Mangos
console.log(listOfGroceriesItems.get(1).title);     // Oranges
console.log(listOfGroceriesItems.get(2).title);     // Pears

listOfGroceriesItems = listOfGroceriesItems.delete(0);

console.log(listOfGroceriesItems.get(0).title);     // Oranges
console.log(listOfGroceriesItems.get(1).title);     // Pears
```

