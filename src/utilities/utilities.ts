"use strict";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export function contains<T>(array: T[], element: T): boolean {
  return array.findIndex(x => Object.is(x, element)) !== -1;
}

export function isArray(value: any): boolean {
  return Object.prototype.toString.call(value) === Object.prototype.toString.call([]);
}

export function copy<T>(array: T[]): T[] {
  return array.slice();
}

export function isPosiviteInteger(value: any): boolean {
  return Number.isInteger(value) && value > 0;
}

export function checkRadix(radix: number) {
  if (!isPosiviteInteger(radix) ||
    radix > 36 ||
    radix < 2 ||
    (radix !== Math.floor(radix))) {
    throw new Error(`Radix must be an integer between 2 and 36 inclusive, given: ${
      radix}`);
  }
}