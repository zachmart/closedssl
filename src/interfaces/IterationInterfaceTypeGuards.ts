"use strict";

/**
 * Created by zacharymartin on July 14, 2016.
 */

export function isIterator<T>(object: any): object is Iterator<T> {
  // test that the type of object is "object"
  if (!object || typeof object !== "object"){
    return false;
  }

  // test if done property exists that it is a boolean, because by Iterator protocol,
  // the done property only need be defined if the iterator is finished
  if (object.done && typeof object.done !== "boolean"){
    return false;
  }

  // test if done property is not true, that the next property exists and is a function,
  // because by Iterator protocol, the next property does not need to be
  // specified if the iterator is finished
  if (object.done !== true){
    if (!object.next || typeof object.next !== "function"){
      return false;
    }
  }

  return true;
}  

export function isIterable<T>(object: any): object is Iterable<T> {
  // make sure object is not null or undefined, but an empty string is iterable
  if (!object && !(typeof object === "string")) {
    return false
  }

  // test that object has a [Symbol.iterator] prop
  if (!object[Symbol.iterator]) {
    return false;
  }

  // test that [Symbol.iterator] prop is a function that returns an Iterator

  try {
    let returnValue = object[Symbol.iterator]();
    if (!isIterator(returnValue)) {
      return false;
    }
  } catch (error) {
    // [Symbol.iterator] prop was not a callable function
    return false;
  }

  return true;
}