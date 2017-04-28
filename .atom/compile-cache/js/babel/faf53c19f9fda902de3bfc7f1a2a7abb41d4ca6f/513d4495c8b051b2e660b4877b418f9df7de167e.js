'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _require = require('nuclide-test-helpers');

var uncachedRequire = _require.uncachedRequire;
var spyOnGetterValue = _require.spyOnGetterValue;

var _require2 = require('atom');

var Range = _require2.Range;

var TYPE_HINT_PROVIDER = '../lib/FlowTypeHintProvider';

describe('FlowTypeHintProvider', function () {
  var runWith = _asyncToGenerator(function* (enabled, result, word) {
    spyOn(atom.config, 'get').andCallFake(function (key) {
      if (key === 'nuclide-flow.enableTypeHints') {
        return enabled;
      } else {
        return false;
      }
    });
    spyOn(require('nuclide-client'), 'getServiceByNuclideUri').andReturn({
      flowGetType: function flowGetType() {
        return Promise.resolve(result);
      }
    });
    spyOnGetterValue(require('nuclide-atom-helpers'), 'extractWordAtPosition').andReturn(word);

    var _uncachedRequire = uncachedRequire(require, TYPE_HINT_PROVIDER);

    var FlowTypeHintProvider = _uncachedRequire.FlowTypeHintProvider;

    typeHintProvider = new FlowTypeHintProvider();
    return yield typeHintProvider.typeHint(editor, position);
  });

  var editor = {
    getPath: function getPath() {
      return '';
    },
    getText: function getText() {
      return '';
    }
  };
  var position = [1, 1];
  var range = new Range([1, 2], [3, 4]);

  var typeHintProvider = undefined;

  afterEach(function () {
    // we assume here that runWith is called in every spec -- otherwise these
    // will not be spies
    jasmine.unspy(require('nuclide-atom-helpers'), 'extractWordAtPosition');
    jasmine.unspy(atom.config, 'get');
    jasmine.unspy(require('nuclide-client'), 'getServiceByNuclideUri');
  });

  it('should return null when disabled', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect((yield runWith(false, { type: 'foo' }, { range: range }))).toBe(null);
    }));
  });

  it('should return the type', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect((yield runWith(true, { type: 'foo' }, { range: range })).hint).toBe('foo');
    }));
  });

  it('should return the range', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect((yield runWith(true, { type: 'foo' }, { range: range })).range).toBe(range);
    }));
  });

  it('should return null when the FlowService result is null', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect((yield runWith(true, null, { range: range }))).toBe(null);
    }));
  });

  it('should return a default range when the word is null', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect((yield runWith(true, { type: 'foo' }, null)).range).toEqual(new Range(position, position));
    }));
  });
});

describe('getTypeHintTree', function () {
  var _require3 = require(TYPE_HINT_PROVIDER);

  var getTypeHintTree = _require3.getTypeHintTree;

  function runWith(obj) {
    return getTypeHintTree(JSON.stringify(obj));
  }

  function makeObjectType(props) {
    var propTypes = [];
    for (var _ref3 of props) {
      var _ref2 = _slicedToArray(_ref3, 2);

      var _name = _ref2[0];
      var prop = _ref2[1];

      propTypes.push({
        name: _name,
        type: prop
      });
    }
    return {
      kind: 'ObjT',
      type: {
        propTypes: propTypes
      }
    };
  }

  function makeMaybeType(type) {
    return {
      kind: 'MaybeT',
      type: type
    };
  }

  function makeFunType(paramToType, returnType) {
    return {
      kind: 'FunT',
      funType: {
        // Somehow this works but Array.from is still not implemented.
        paramNames: (function () {
          var _paramNames = [];

          for (var x of paramToType.keys()) {
            _paramNames.push(x);
          }

          return _paramNames;
        })(),
        paramTypes: (function () {
          var _paramTypes = [];

          for (var x of paramToType.values()) {
            _paramTypes.push(x);
          }

          return _paramTypes;
        })(),
        returnType: returnType
      }
    };
  }

  function makeArrayType(elemType) {
    return {
      kind: 'ArrT',
      elemType: elemType
    };
  }

  var num = { kind: 'NumT' };
  var str = { kind: 'StrT' };
  var bool = { kind: 'BoolT' };
  var anyObj = { kind: 'AnyObjT' };

  var emptyObject = makeObjectType(new Map());
  var simpleObject = makeObjectType(new Map([['numProp', num]]));
  var nestedObject = makeObjectType(new Map([['otherObj', simpleObject]]));

  var maybeString = makeMaybeType(str);
  var maybeObject = makeMaybeType(simpleObject);

  var simpleFunction = makeFunType(new Map(), num);
  var complexFunction = makeFunType(new Map([['param1', simpleObject], ['param2', maybeString]]), simpleObject);

  var numArray = makeArrayType(num);
  var objArray = makeArrayType(simpleObject);

  it('should work for number', function () {
    expect(runWith(num)).toEqual({ value: 'number' });
  });

  it('should work for string', function () {
    expect(runWith(str)).toEqual({ value: 'string' });
  });

  it('should work for boolean', function () {
    expect(runWith(bool)).toEqual({ value: 'boolean' });
  });

  it('should work for a raw Object', function () {
    expect(runWith(anyObj)).toEqual({ value: 'Object' });
  });

  it('should work for an empty object', function () {
    expect(runWith(emptyObject)).toEqual({ value: 'Object', children: [] });
  });

  it('should work for a nonempty object', function () {
    expect(runWith(simpleObject)).toEqual({
      value: 'Object',
      children: [{
        value: 'numProp: number',
        children: undefined
      }]
    });
  });

  it('should work for a nested object', function () {
    expect(runWith(nestedObject)).toEqual({
      value: 'Object',
      children: [{
        value: 'otherObj: Object',
        children: [{
          value: 'numProp: number',
          children: undefined
        }]
      }]
    });
  });

  it('should work with Arrays of primitives', function () {
    expect(runWith(numArray)).toEqual({
      value: 'Array<number>',
      children: undefined
    });
  });

  it('should work with Arrays of Objects', function () {
    expect(runWith(objArray)).toEqual({
      value: 'Array<Object>',
      children: [{
        value: 'numProp: number',
        children: undefined
      }]
    });
  });

  it('should work with a simple maybe type', function () {
    expect(runWith(maybeString)).toEqual({
      value: '?string',
      children: undefined
    });
  });

  it('should work with a a maybe object type', function () {
    expect(runWith(maybeObject)).toEqual({
      value: '?Object',
      children: [{
        value: 'numProp: number',
        children: undefined
      }]
    });
  });

  it('should work with a simple function', function () {
    expect(runWith(simpleFunction)).toEqual({
      value: 'Function',
      children: [{
        value: 'Parameters',
        children: []
      }, {
        value: 'Return Type: number',
        children: undefined
      }]
    });
  });

  it('should work with a more complicated function', function () {
    expect(runWith(complexFunction)).toEqual({
      value: 'Function',
      children: [{
        value: 'Parameters',
        children: [{
          value: 'param1: Object',
          children: [{
            value: 'numProp: number',
            children: undefined
          }]
        }, {
          value: 'param2: ?string',
          children: undefined
        }]
      }, {
        value: 'Return Type: Object',
        children: [{
          value: 'numProp: number',
          children: undefined
        }]
      }]
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmxvdy9zcGVjL0Zsb3dUeXBlSGludFByb3ZpZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztlQVdnQyxPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQXBFLGVBQWUsWUFBZixlQUFlO0lBQUUsZ0JBQWdCLFlBQWhCLGdCQUFnQjs7Z0JBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhCLEtBQUssYUFBTCxLQUFLOztBQUVaLElBQU0sa0JBQWtCLEdBQUcsNkJBQTZCLENBQUM7O0FBRXpELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxZQUFNO01Ba0J0QixPQUFPLHFCQUF0QixXQUF1QixPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtBQUM1QyxTQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDM0MsVUFBSSxHQUFHLEtBQUssOEJBQThCLEVBQUU7QUFDMUMsZUFBTyxPQUFPLENBQUM7T0FDaEIsTUFBTTtBQUNMLGVBQU8sS0FBSyxDQUFDO09BQ2Q7S0FDRixDQUFDLENBQUM7QUFDSCxTQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDbkUsaUJBQVcsRUFBQSx1QkFBRztBQUFFLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUFFO0tBQ2xELENBQUMsQ0FBQztBQUNILG9CQUFnQixDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLHVCQUF1QixDQUFDLENBQ3ZFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7MkJBRVksZUFBZSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQzs7UUFBcEUsb0JBQW9CLG9CQUFwQixvQkFB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QUNGLENBQ0Y7S0FDRixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1mbG93L3NwZWMvRmxvd1R5cGVIaW50UHJvdmlkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IHt1bmNhY2hlZFJlcXVpcmUsIHNweU9uR2V0dGVyVmFsdWV9ID0gcmVxdWlyZSgnbnVjbGlkZS10ZXN0LWhlbHBlcnMnKTtcbmNvbnN0IHtSYW5nZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5cbmNvbnN0IFRZUEVfSElOVF9QUk9WSURFUiA9ICcuLi9saWIvRmxvd1R5cGVIaW50UHJvdmlkZXInO1xuXG5kZXNjcmliZSgnRmxvd1R5cGVIaW50UHJvdmlkZXInLCAoKSA9PiB7XG4gIGNvbnN0IGVkaXRvciA9IHtcbiAgICBnZXRQYXRoKCkgeyByZXR1cm4gJyc7IH0sXG4gICAgZ2V0VGV4dCgpIHsgcmV0dXJuICcnOyB9LFxuICB9O1xuICBjb25zdCBwb3NpdGlvbiA9IFsxLCAxXTtcbiAgY29uc3QgcmFuZ2UgPSBuZXcgUmFuZ2UoWzEsIDJdLCBbMywgNF0pO1xuXG4gIGxldCB0eXBlSGludFByb3ZpZGVyO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgLy8gd2UgYXNzdW1lIGhlcmUgdGhhdCBydW5XaXRoIGlzIGNhbGxlZCBpbiBldmVyeSBzcGVjIC0tIG90aGVyd2lzZSB0aGVzZVxuICAgIC8vIHdpbGwgbm90IGJlIHNwaWVzXG4gICAgamFzbWluZS51bnNweShyZXF1aXJlKCdudWNsaWRlLWF0b20taGVscGVycycpLCAnZXh0cmFjdFdvcmRBdFBvc2l0aW9uJyk7XG4gICAgamFzbWluZS51bnNweShhdG9tLmNvbmZpZywgJ2dldCcpO1xuICAgIGphc21pbmUudW5zcHkocmVxdWlyZSgnbnVjbGlkZS1jbGllbnQnKSwgJ2dldFNlcnZpY2VCeU51Y2xpZGVVcmknKTtcbiAgfSk7XG5cbiAgYXN5bmMgZnVuY3Rpb24gcnVuV2l0aChlbmFibGVkLCByZXN1bHQsIHdvcmQpIHtcbiAgICBzcHlPbihhdG9tLmNvbmZpZywgJ2dldCcpLmFuZENhbGxGYWtlKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnbnVjbGlkZS1mbG93LmVuYWJsZVR5cGVIaW50cycpIHtcbiAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3B5T24ocmVxdWlyZSgnbnVjbGlkZS1jbGllbnQnKSwgJ2dldFNlcnZpY2VCeU51Y2xpZGVVcmknKS5hbmRSZXR1cm4oe1xuICAgICAgZmxvd0dldFR5cGUoKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTsgfSxcbiAgICB9KTtcbiAgICBzcHlPbkdldHRlclZhbHVlKHJlcXVpcmUoJ251Y2xpZGUtYXRvbS1oZWxwZXJzJyksICdleHRyYWN0V29yZEF0UG9zaXRpb24nKVxuICAgICAgLmFuZFJldHVybih3b3JkKTtcblxuICAgIGNvbnN0IHtGbG93VHlwZUhpbnRQcm92aWRlcn0gPSB1bmNhY2hlZFJlcXVpcmUocmVxdWlyZSwgVFlQRV9ISU5UX1BST1ZJREVSKTtcbiAgICB0eXBlSGludFByb3ZpZGVyID0gbmV3IEZsb3dUeXBlSGludFByb3ZpZGVyKCk7XG4gICAgcmV0dXJuIGF3YWl0IHR5cGVIaW50UHJvdmlkZXIudHlwZUhpbnQoZWRpdG9yLCBwb3NpdGlvbik7XG4gIH1cblxuICBpdCgnc2hvdWxkIHJldHVybiBudWxsIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdChhd2FpdCBydW5XaXRoKGZhbHNlLCB7dHlwZTogJ2Zvbyd9LCB7cmFuZ2V9KSkudG9CZShudWxsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHR5cGUnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdCgoYXdhaXQgcnVuV2l0aCh0cnVlLCB7dHlwZTogJ2Zvbyd9LCB7cmFuZ2V9KSkuaGludCkudG9CZSgnZm9vJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByYW5nZScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgZXhwZWN0KChhd2FpdCBydW5XaXRoKHRydWUsIHt0eXBlOiAnZm9vJ30sIHtyYW5nZX0pKS5yYW5nZSkudG9CZShyYW5nZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgd2hlbiB0aGUgRmxvd1NlcnZpY2UgcmVzdWx0IGlzIG51bGwnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdChhd2FpdCBydW5XaXRoKHRydWUsIG51bGwsIHtyYW5nZX0pKS50b0JlKG51bGwpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIGRlZmF1bHQgcmFuZ2Ugd2hlbiB0aGUgd29yZCBpcyBudWxsJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBleHBlY3QoKGF3YWl0IHJ1bldpdGgodHJ1ZSwge3R5cGU6ICdmb28nfSwgbnVsbCkpLnJhbmdlKVxuICAgICAgICAudG9FcXVhbChuZXcgUmFuZ2UocG9zaXRpb24sIHBvc2l0aW9uKSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdnZXRUeXBlSGludFRyZWUnLCAoKSA9PiB7XG4gIGNvbnN0IHtnZXRUeXBlSGludFRyZWV9ID0gcmVxdWlyZShUWVBFX0hJTlRfUFJPVklERVIpO1xuXG4gIGZ1bmN0aW9uIHJ1bldpdGgob2JqOiBPYmplY3QpOiBPYmplY3Qge1xuICAgIHJldHVybiBnZXRUeXBlSGludFRyZWUoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlT2JqZWN0VHlwZShwcm9wczogTWFwPHN0cmluZywgT2JqZWN0Pik6IE9iamVjdCB7XG4gICAgY29uc3QgcHJvcFR5cGVzID0gW107XG4gICAgZm9yIChjb25zdCBbbmFtZSwgcHJvcF0gb2YgcHJvcHMpIHtcbiAgICAgIHByb3BUeXBlcy5wdXNoKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZTogcHJvcCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAga2luZDogJ09ialQnLFxuICAgICAgdHlwZToge1xuICAgICAgICBwcm9wVHlwZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWF5YmVUeXBlKHR5cGU6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtpbmQ6ICdNYXliZVQnLFxuICAgICAgdHlwZSxcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUZ1blR5cGUocGFyYW1Ub1R5cGU6IE1hcDxTdHJpbmcsIE9iamVjdD4sIHJldHVyblR5cGU6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtpbmQ6ICdGdW5UJyxcbiAgICAgIGZ1blR5cGU6IHtcbiAgICAgICAgLy8gU29tZWhvdyB0aGlzIHdvcmtzIGJ1dCBBcnJheS5mcm9tIGlzIHN0aWxsIG5vdCBpbXBsZW1lbnRlZC5cbiAgICAgICAgcGFyYW1OYW1lczogW2ZvciAoeCBvZiBwYXJhbVRvVHlwZS5rZXlzKCkpIHhdLFxuICAgICAgICBwYXJhbVR5cGVzOiBbZm9yICh4IG9mIHBhcmFtVG9UeXBlLnZhbHVlcygpKSB4XSxcbiAgICAgICAgcmV0dXJuVHlwZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VBcnJheVR5cGUoZWxlbVR5cGU6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtpbmQ6ICdBcnJUJyxcbiAgICAgIGVsZW1UeXBlLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBudW0gPSB7IGtpbmQ6ICdOdW1UJyB9O1xuICBjb25zdCBzdHIgPSB7IGtpbmQ6ICdTdHJUJyB9O1xuICBjb25zdCBib29sID0geyBraW5kOiAnQm9vbFQnIH07XG4gIGNvbnN0IGFueU9iaiA9IHsga2luZDogJ0FueU9ialQnIH07XG5cbiAgY29uc3QgZW1wdHlPYmplY3QgPSBtYWtlT2JqZWN0VHlwZShuZXcgTWFwKCkpO1xuICBjb25zdCBzaW1wbGVPYmplY3QgPSBtYWtlT2JqZWN0VHlwZShuZXcgTWFwKFtbJ251bVByb3AnLCBudW1dXSkpO1xuICBjb25zdCBuZXN0ZWRPYmplY3QgPSBtYWtlT2JqZWN0VHlwZShuZXcgTWFwKFtbJ290aGVyT2JqJywgc2ltcGxlT2JqZWN0XV0pKTtcblxuICBjb25zdCBtYXliZVN0cmluZyA9IG1ha2VNYXliZVR5cGUoc3RyKTtcbiAgY29uc3QgbWF5YmVPYmplY3QgPSBtYWtlTWF5YmVUeXBlKHNpbXBsZU9iamVjdCk7XG5cbiAgY29uc3Qgc2ltcGxlRnVuY3Rpb24gPSBtYWtlRnVuVHlwZShuZXcgTWFwKCksIG51bSk7XG4gIGNvbnN0IGNvbXBsZXhGdW5jdGlvbiA9IG1ha2VGdW5UeXBlKFxuICAgIG5ldyBNYXAoW1xuICAgICAgWydwYXJhbTEnLCBzaW1wbGVPYmplY3RdLFxuICAgICAgWydwYXJhbTInLCBtYXliZVN0cmluZ10sXG4gICAgXSksXG4gICAgc2ltcGxlT2JqZWN0LFxuICApO1xuXG4gIGNvbnN0IG51bUFycmF5ID0gbWFrZUFycmF5VHlwZShudW0pO1xuICBjb25zdCBvYmpBcnJheSA9IG1ha2VBcnJheVR5cGUoc2ltcGxlT2JqZWN0KTtcblxuICBpdCgnc2hvdWxkIHdvcmsgZm9yIG51bWJlcicsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChudW0pKS50b0VxdWFsKHt2YWx1ZTogJ251bWJlcid9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB3b3JrIGZvciBzdHJpbmcnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJ1bldpdGgoc3RyKSkudG9FcXVhbCh7dmFsdWU6ICdzdHJpbmcnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayBmb3IgYm9vbGVhbicsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChib29sKSkudG9FcXVhbCh7dmFsdWU6ICdib29sZWFuJ30pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHdvcmsgZm9yIGEgcmF3IE9iamVjdCcsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChhbnlPYmopKS50b0VxdWFsKHt2YWx1ZTogJ09iamVjdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB3b3JrIGZvciBhbiBlbXB0eSBvYmplY3QnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJ1bldpdGgoZW1wdHlPYmplY3QpKS50b0VxdWFsKHt2YWx1ZTogJ09iamVjdCcsIGNoaWxkcmVuOiBbXX0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHdvcmsgZm9yIGEgbm9uZW1wdHkgb2JqZWN0JywgKCkgPT4ge1xuICAgIGV4cGVjdChydW5XaXRoKHNpbXBsZU9iamVjdCkpLnRvRXF1YWwoe1xuICAgICAgdmFsdWU6ICdPYmplY3QnLFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiAnbnVtUHJvcDogbnVtYmVyJyxcbiAgICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB3b3JrIGZvciBhIG5lc3RlZCBvYmplY3QnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJ1bldpdGgobmVzdGVkT2JqZWN0KSkudG9FcXVhbCh7XG4gICAgICB2YWx1ZTogJ09iamVjdCcsXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdmFsdWU6ICdvdGhlck9iajogT2JqZWN0JyxcbiAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZTogJ251bVByb3A6IG51bWJlcicsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBBcnJheXMgb2YgcHJpbWl0aXZlcycsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChudW1BcnJheSkpLnRvRXF1YWwoe1xuICAgICAgdmFsdWU6ICdBcnJheTxudW1iZXI+JyxcbiAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayB3aXRoIEFycmF5cyBvZiBPYmplY3RzJywgKCkgPT4ge1xuICAgIGV4cGVjdChydW5XaXRoKG9iakFycmF5KSkudG9FcXVhbCh7XG4gICAgICB2YWx1ZTogJ0FycmF5PE9iamVjdD4nLFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiAnbnVtUHJvcDogbnVtYmVyJyxcbiAgICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggYSBzaW1wbGUgbWF5YmUgdHlwZScsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChtYXliZVN0cmluZykpLnRvRXF1YWwoe1xuICAgICAgdmFsdWU6ICc/c3RyaW5nJyxcbiAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayB3aXRoIGEgYSBtYXliZSBvYmplY3QgdHlwZScsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChtYXliZU9iamVjdCkpLnRvRXF1YWwoe1xuICAgICAgdmFsdWU6ICc/T2JqZWN0JyxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZTogJ251bVByb3A6IG51bWJlcicsXG4gICAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayB3aXRoIGEgc2ltcGxlIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGV4cGVjdChydW5XaXRoKHNpbXBsZUZ1bmN0aW9uKSkudG9FcXVhbCh7XG4gICAgICB2YWx1ZTogJ0Z1bmN0aW9uJyxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZTogJ1BhcmFtZXRlcnMnLFxuICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiAnUmV0dXJuIFR5cGU6IG51bWJlcicsXG4gICAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd29yayB3aXRoIGEgbW9yZSBjb21wbGljYXRlZCBmdW5jdGlvbicsICgpID0+IHtcbiAgICBleHBlY3QocnVuV2l0aChjb21wbGV4RnVuY3Rpb24pKS50b0VxdWFsKHtcbiAgICAgIHZhbHVlOiAnRnVuY3Rpb24nLFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiAnUGFyYW1ldGVycycsXG4gICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFsdWU6ICdwYXJhbTE6IE9iamVjdCcsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6ICdudW1Qcm9wOiBudW1iZXInLFxuICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFsdWU6ICdwYXJhbTI6ID9zdHJpbmcnLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdmFsdWU6ICdSZXR1cm4gVHlwZTogT2JqZWN0JyxcbiAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YWx1ZTogJ251bVByb3A6IG51bWJlcicsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-flow/spec/FlowTypeHintProvider-spec.js
