"use strict";

import {isIEquitable} from "../../interfaces/IEquitable";
import {should} from "chai";
var casual = require("casual");

should();
/**
 * Created by zacharymartin on July 14, 2016.
 */

describe("IEquitable -", function() {
  const PROP_NAMES = [
    "equals"
  ];

  casual.define("correctlyFormattedIEquitable", function() {
    return {
      equals: function(that){
        return casual.coin_flip;
      }
    };
  });

  function getCorrectlyFormattedIEquitableObj(){
    return casual.correctlyFormattedIEquitable;
  }

  describe("#isIEquitable - Equitable Interface type guard -", function(){

    describe("correctly formatted objects -", function(){
      for (let i = 0; i < 20; i++) {
        it("should return true", function(){
          let correctIEquitable: any = getCorrectlyFormattedIEquitableObj();
          isIEquitable(correctIEquitable).should.be.true;
        })
      }
    });

    // test missing property cases
    for (let propToDelete of PROP_NAMES){
      describe(`IEquitable with no "${propToDelete}" prop`, function(){
        const testCase = getCorrectlyFormattedIEquitableObj();

        delete testCase[propToDelete];

        it("should return false", function(){
          isIEquitable(testCase).should.be.false;
        });
      });
    }

    // test wrongly typed property cases
    for (let propToChangeType of PROP_NAMES){
      describe(`IEquitable with wrongly typed "${propToChangeType}" prop`, function(){
        const testCase = getCorrectlyFormattedIEquitableObj();

        testCase[propToChangeType] = 5;

        it("should return false", function(){
          isIEquitable(testCase).should.be.false;
        });
      });
    }

    // test null, undefined, NaN, empty string, incorrect object, num, boolean cases
    describe("null arg", function(){
      it("should return false", function(){
        isIEquitable(null).should.be.false;
      })
    });

    describe("undefined arg", function(){
      it("should return false", function(){
        isIEquitable(undefined).should.be.false;
      })
    });

    describe("NaN arg", function(){
      it("should return false", function(){
        isIEquitable(NaN).should.be.false;
      })
    });

    describe("empty string arg", function(){
      it("should return false", function(){
        isIEquitable("").should.be.false;
      })
    });

    describe("incorrect object arg", function(){
      it("should return false", function(){
        isIEquitable({water: true}).should.be.false;
      })
    });

    describe("numeric arg", function(){
      it("should return false", function(){
        isIEquitable(5).should.be.false;
      })
    });

    describe("boolean arg", function(){
      it("should return false", function(){
        isIEquitable(true).should.be.false;
      })
    });
  });
});
