"use strict";

import {isIterable, isIterator} from "../../interfaces/IterationInterfaceTypeGuards";
import {should} from "chai";
var casual = require("casual");

should();

/**
 * Created by zacharymartin on July 14, 2016.
 */

describe("IterationInterfaceTypeGuards -", function(){
  type testCaseType = {arg: any, expected: boolean, description: string};

  describe("isIterable", function(){
    const testCases: testCaseType[] = [
      {arg: [], expected: true, description: "empty arrays"},
      {arg: [1], expected: true, description: "single element arrays"},
      {arg: ["hi", "bye"], expected: true, description: "multi-element arrays"},
      {arg: NaN, expected: false, description: "the number NaN"},
      {arg: -3428.00342, expected: false, description: "the number -3428.00342"},
      {arg: 5, expected: false, description: "the number 5"},
      {arg: null, expected: false, description: "null"},
      {arg: undefined, expected: false, description: "undefined"},
      {arg: "", expected: true, description: "the empty string"},
      {arg: "a", expected: true, description: "a one character string"},
      {arg: "test", expected: true, description: "a multi-character string"},
      {arg: new Map(), expected: true, description: "an empty map"},
      {arg: new Map<any,any>([[1, "a"]]), expected: true, description: "a one element map"},
      {
        arg: new Map<any,any>([["hi", 3], [{water: true}, "summer"]]),
        expected: true,
        description: "a multi-element map"
      },
      {arg: true, expected: false, description: "true"},
      {arg: false, expected: false, description: "false"},
      {
        arg: {
          [Symbol.iterator]: function() {
            return {
              next: function() {
                return casual.coin_flip;
              },
              done: false
            }
          }
        },
        expected: true,
        description: "an object with the [Symbol.iterator] prop correctly defined"
      },
      {
        arg: {
          [Symbol.iterator]: function() {
            return {
              next: false,
              done: false
            }
          }
        },
        expected: false,
        description: "an object with the [Symbol.iterator] prop incorrectly defined"
      },
      {
        arg: {[Symbol.iterator]: undefined, otherProp: {water: "fire"}},
        expected: false,
        description: "an object with the [Symbol.iterator] prop undefined"
      },
      {
        arg: function*(){
          yield 1;
          yield 2;
          yield 3;
        }(),
        expected: true,
        description: "a generator object"
      }
    ];

    for (let testCase of testCases) {
      describe(testCase.description, function(){
        if (testCase.expected){
          it("should be iterable", function(){
            isIterable(testCase.arg).should.be.true;
          });
        } else {
          it("should not be iterable", function(){
            isIterable(testCase.arg).should.not.be.true;
          });
        }
      });
    }
  });


  describe("isIterator", function(){
    const testCases: testCaseType[] = [
      {arg: [], expected: false, description: "empty arrays"},
      {arg: [1], expected: false, description: "single element arrays"},
      {arg: ["hi", "bye"], expected: false, description: "multi-element arrays"},
      {
        arg: [][Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on empty arrays"
      },
      {
        arg: [1][Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on single element arrays"
      },
      {
        arg: ["hi", "bye"][Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on multi-element arrays"
      },
      {arg: NaN, expected: false, description: "the number NaN"},
      {arg: -3428.00342, expected: false, description: "the number -3428.00342"},
      {arg: 5, expected: false, description: "the number 5"},
      {arg: null, expected: false, description: "null"},
      {arg: undefined, expected: false, description: "undefined"},
      {arg: "", expected: false, description: "the empty string"},
      {arg: "a", expected: false, description: "a one character string"},
      {arg: "test", expected: false, description: "a multi-character string"},
      {
        arg: ""[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on the empty string"},
      {
        arg: "a"[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on a one character string"
      },
      {
        arg: "test"[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on a multi-character string"
      },
      {arg: new Map(), expected: false, description: "an empty map"},
      {arg: new Map<any,any>([[1, "a"]]), expected: false, description: "a one element map"},
      {
        arg: new Map<any,any>([["hi", 3], [{water: false}, "summer"]]),
        expected: false,
        description: "a multi-element map"
      },
      {
        arg: (new Map())[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on an empty map"},
      {
        arg: (new Map<any,any>([[1, "a"]]))[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on a one element map"},
      {
        arg: (new Map<any,any>([["hi", 3], [{water: true}, "summer"]]))[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on a multi-element map"
      },
      {arg: true, expected: false, description: "true"},
      {arg: false, expected: false, description: "false"},
      {
        arg: {
              next: function() {
                return casual.coin_flip;
              },
              done: false
        },
        expected: true,
        description: "an object with the done and next props correctly defined where next returns booleans"
      },
      {
        arg: {
          next: function() {
            return casual.integer(-1000, 1000);
          },
          done: false
        },
        expected: true,
        description: "a object with done and next correctly defined where next returns numbers"
      },
      {
        arg: {
              next: false,
              done: false
        },
        expected: false,
        description: "an object with the done and next prop both false "
      },
      {
        arg: {
          done: false,
          next: undefined,
          otherProp: {water: "fire"}},
        expected: false,
        description: "an object with the next prop undefined when done is false"
      },
      {
        arg: {
          done: undefined,
          next: undefined,
          otherProp: {water: "fire"}},
        expected: false,
        description: "an object with the done and next prop undefined"
      },
      {
        arg: {
          done: false,
          next: undefined,
          otherProp: {water: "fire"}},
        expected: false,
        description: "an object with the next prop undefined when done is false"
      },
      {
        arg: {
          done: true,
          next: undefined,
          otherProp: {water: "fire"}},
        expected: true,
        description: "an object with the next prop undefined when done is true"
      },
      {
        arg: {
          done: 5,
          next: undefined,
          otherProp: {water: "fire"}},
        expected: false,
        description: "an object with the done property defined but set to a number"
      },
      {
        arg: function*(){
          yield 1;
          yield 2;
          yield 3;
        }(),
        expected: true,
        description: "a generator object"
      },
      {
        arg: (function*(){
          yield 1;
          yield 2;
          yield 3;
        }())[Symbol.iterator](),
        expected: true,
        description: "the result of calling [Symbol.iterator]() on a generator object"
      }
    ];

    for (let testCase of testCases) {
      describe(testCase.description, function(){
        if (testCase.expected){
          it("should be an iterator", function(){
            isIterator(testCase.arg).should.be.true;
          });
        } else {
          it("should not be an iterator", function(){
            isIterator(testCase.arg).should.not.be.true;
          });
        }
      });
    }
  });


});

