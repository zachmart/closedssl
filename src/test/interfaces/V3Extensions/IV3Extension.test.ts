"use strict";

import {isIV3Extension} from "../../../interfaces/V3Extensions/IV3Extension";
import {should} from "chai";
var casual = require("casual");

should();
/**
 * Created by zacharymartin on July 14, 2016.
 */

describe("IV3Extension -", function() {
  const PROP_NAMES = [
    "_name",
    "_ext",
    "equals"
  ];

  casual.define("correctlyFormattedIV3Extension", function() {
    return {
      _name: casual.word,
      _ext: {},
      equals: function(that){
        return casual.coin_flip;
      }
    };
  });

  function getCorrectlyFormattedIV3ExtensionObj(){
    return casual.correctlyFormattedIV3Extension;
  }

  describe("#isIV3Extension - V3Extension Interface type guard -", function(){

    describe("correctly formatted objects -", function(){
      for (let i = 0; i < 20; i++) {
        it("should return true", function(){
          let correctIV3Extension: any = getCorrectlyFormattedIV3ExtensionObj();
          isIV3Extension(correctIV3Extension).should.be.true;
        })
      }
    });

    // test missing property cases
    for (let propToDelete of PROP_NAMES){
      describe(`IV3Extension with no "${propToDelete}" prop`, function(){
        const testCase = getCorrectlyFormattedIV3ExtensionObj();

        delete testCase[propToDelete];

        it("should return false", function(){
          isIV3Extension(testCase).should.be.false;
        });
      });
    }

    // test wrongly typed property cases
    for (let propToChangeType of PROP_NAMES){
      describe(`IV3Extension with wrongly typed "${propToChangeType}" prop`, function(){
        const testCase = getCorrectlyFormattedIV3ExtensionObj();

        testCase[propToChangeType] = 5;

        it("should return false", function(){
          isIV3Extension(testCase).should.be.false;
        });
      });
    }

    // test null, undefined, NaN, empty string, incorrect object, num, boolean cases
    describe("null arg", function(){
      it("should return false", function(){
        isIV3Extension(null).should.be.false;
      })
    });

    describe("undefined arg", function(){
      it("should return false", function(){
        isIV3Extension(undefined).should.be.false;
      })
    });

    describe("NaN arg", function(){
      it("should return false", function(){
        isIV3Extension(NaN).should.be.false;
      })
    });

    describe("empty string arg", function(){
      it("should return false", function(){
        isIV3Extension("").should.be.false;
      })
    });

    describe("incorrect object arg", function(){
      it("should return false", function(){
        isIV3Extension({water: true}).should.be.false;
      })
    });

    describe("numeric arg", function(){
      it("should return false", function(){
        isIV3Extension(5).should.be.false;
      })
    });

    describe("boolean arg", function(){
      it("should return false", function(){
        isIV3Extension(true).should.be.false;
      })
    });
  });
});
