"use strict";

const cuid = require("cuid");

const { Record, List } = require("immutable");

class ShoppingListFactory {

  constructor() {
    this._ShoppingList = Record({
      _id: undefined,
      _rev: undefined,
      _deleted: false,
      type: "list",
      version: 1,
      title: undefined,
      checked: false,
      place: undefined,
      createdAt: undefined,
      updatedAt: undefined
    });
    this._ShoppingListItem = Record({
      _id: undefined,
      _rev: undefined,
      _deleted: false,
      type: "item",
      version: 1,
      list: undefined,
      title: undefined,
      checked: false,
      createdAt: undefined,
      updatedAt: undefined
    });
  }

  _guardShoppingList(shoppingList) {
    if (!Record.isRecord(shoppingList)) {
      throw new Error("Shopping List must be a Record");
    }
    if (shoppingList.type != "list") {
      throw new Error("Shopping List type must be list");
    }
  }

  _guardListOfShoppingLists(listOfShoppingLists) {
    listOfShoppingLists.forEach(shoppingList => this._guardShoppingList(shoppingList));
  }

  _guardShoppingListItem(shoppingListItem) {
    if (!Record.isRecord(shoppingListItem)) {
      throw new Error("Shopping List Item must be a Record");
    }
    if (shoppingListItem.type != "item") {
      throw new Error("Shopping List Item type must be item");
    }
  }

  _guardListOfShoppingListItems(listOfShoppingListItems) {
    listOfShoppingListItems.forEach(shoppingListItem => this._guardShoppingListItem(shoppingListItem));
  }

  newShoppingList(values) {
    let shoppingList = new this._ShoppingList(values);
    if (shoppingList._id === undefined) {
      shoppingList = shoppingList.set("_id", "list:" + cuid());
    }
    return shoppingList;
  }

  newListOfShoppingLists(shoppingLists) {
    let listOfShoppingLists = new List(shoppingLists);
    this._guardListOfShoppingLists(listOfShoppingLists);
    return listOfShoppingLists;
  }

  newShoppingListItem(values, shoppingList) {
    let shoppingListItem = new this._ShoppingListItem(values);
    if (shoppingListItem._id === undefined) {
      shoppingListItem = shoppingListItem.set("_id", "item:" + cuid());
    }
    if (shoppingListItem.list === undefined && shoppingList) {
      shoppingListItem = shoppingListItem.set("list", shoppingList._id);
    }
    return shoppingListItem;
  }

  newListOfShoppingListItems(shoppingListItems) {
    let listOfShoppingListItems = new List(shoppingListItems);
    this._guardListOfShoppingListItems(listOfShoppingListItems);
    return listOfShoppingListItems;
  }

}

exports.ShoppingListFactory = ShoppingListFactory;
