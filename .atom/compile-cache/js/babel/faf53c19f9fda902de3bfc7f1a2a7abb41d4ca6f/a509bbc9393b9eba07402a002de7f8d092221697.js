'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _require = require('atom');

var Point = _require.Point;

var _require2 = require('nuclide-hack-common');

var HACK_GRAMMARS = _require2.HACK_GRAMMARS;

var hack = require('../lib/hack');

describe('FindReferencesProvider', function () {
  // Create a fake editor
  var mockEditor = {
    getGrammar: function getGrammar() {
      return { scopeName: HACK_GRAMMARS[0] };
    },
    getPath: function getPath() {
      return '/test/test.php';
    }
  };

  var FindReferencesProvider = undefined;
  beforeEach(function () {
    spyOn(hack, 'findReferences').andReturn({
      baseUri: '/test/',
      symbolName: 'TestClass::testFunction',
      references: [{
        name: 'TestClass::testFunction',
        filename: '/test/file1.php',
        line: 13,
        char_start: 5,
        char_end: 7
      }, {
        name: 'TestClass::testFunction',
        filename: '/test/file2.php',
        line: 11,
        char_start: 1,
        char_end: 3
      }]
    });

    // Can't load this until `hack` is mocked
    FindReferencesProvider = require('../lib/FindReferencesProvider');
  });

  it('should be able to return references', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var refs = yield FindReferencesProvider.findReferences(mockEditor, new Point(1, 1));
      expect(refs).toEqual({
        type: 'data',
        baseUri: '/test/',
        referencedSymbolName: 'TestClass::testFunction',
        references: [{
          uri: '/test/file1.php',
          name: null,
          start: { line: 13, column: 5 },
          end: { line: 13, column: 7 }
        }, {
          uri: '/test/file2.php',
          name: null,
          start: { line: 11, column: 1 },
          end: { line: 11, column: 3 }
        }]
      });
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtaGFjay9zcGVjL0ZpbmRSZWZlcmVuY2VzUHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztlQVdJLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhCLEtBQUssWUFBTCxLQUFLOztnQkFDWSxPQUFPLENBQUMscUJBQXFCLENBQUM7O0lBQS9DLGFBQWEsYUFBYixhQUFhOztBQUNwQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxZQUFNOztBQUV2QyxNQUFNLFVBQVUsR0FBRztBQUNqQixjQUFVLEVBQUEsc0JBQUc7QUFDWCxhQUFPLEVBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0tBQ3RDO0FBQ0QsV0FBTyxFQUFBLG1CQUFHO0FBQ1IsYUFBTyxnQkFBZ0IsQ0FBQztLQUN6QjtHQUNGLENBQUM7O0FBRUYsTUFBSSxzQkFBc0IsWUFBQSxDQUFDO0FBQzNCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsU0FBSyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN0QyxhQUFPLEVBQUUsUUFBUTtBQUNqQixnQkFBVSxFQUFFLHlCQUF5QjtBQUNyQyxnQkFBVSxFQUFFLENBQ1Y7QUFDRSxZQUFJLEVBQUUseUJBQXlCO0FBQy9CLGdCQUFRLEVBQUUsaUJBQWlCO0FBQzNCLFlBQUksRUFBRSxFQUFFO0FBQ1Isa0JBQVUsRUFBRSxDQUFDO0FBQ2IsZ0JBQVEsRUFBRSxDQUFDO09BQ1osRUFDRDtBQUNFLFlBQUksRUFBRSx5QkFBeUI7QUFDL0IsZ0JBQVEsRUFBRSxpQkFBaUI7QUFDM0IsWUFBSSxFQUFFLEVBQUU7QUFDUixrQkFBVSxFQUFFLENBQUM7QUFDYixnQkFBUSxFQUFFLENBQUM7T0FDWixDQUNGO0tBQ0YsQ0FBQyxDQUFDOzs7QUFHSCwwQkFBc0IsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztHQUNuRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLHFDQUFxQyxFQUFFLFlBQU07QUFDOUMsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixVQUFNLElBQUksR0FBRyxNQUFNLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEYsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNuQixZQUFJLEVBQUUsTUFBTTtBQUNaLGVBQU8sRUFBRSxRQUFRO0FBQ2pCLDRCQUFvQixFQUFFLHlCQUF5QjtBQUMvQyxrQkFBVSxFQUFFLENBQ1Y7QUFDRSxhQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLGNBQUksRUFBRSxJQUFJO0FBQ1YsZUFBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO0FBQzVCLGFBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztTQUMzQixFQUNEO0FBQ0UsYUFBRyxFQUFFLGlCQUFpQjtBQUN0QixjQUFJLEVBQUUsSUFBSTtBQUNWLGVBQUssRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztBQUM1QixhQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7U0FDM0IsQ0FDRjtPQUNGLENBQUMsQ0FBQztLQUNKLEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWhhY2svc3BlYy9GaW5kUmVmZXJlbmNlc1Byb3ZpZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5jb25zdCB7UG9pbnR9ID0gcmVxdWlyZSgnYXRvbScpO1xuY29uc3Qge0hBQ0tfR1JBTU1BUlN9ID0gcmVxdWlyZSgnbnVjbGlkZS1oYWNrLWNvbW1vbicpO1xuY29uc3QgaGFjayA9IHJlcXVpcmUoJy4uL2xpYi9oYWNrJyk7XG5cbmRlc2NyaWJlKCdGaW5kUmVmZXJlbmNlc1Byb3ZpZGVyJywgKCkgPT4ge1xuICAvLyBDcmVhdGUgYSBmYWtlIGVkaXRvclxuICBjb25zdCBtb2NrRWRpdG9yID0ge1xuICAgIGdldEdyYW1tYXIoKSB7XG4gICAgICByZXR1cm4ge3Njb3BlTmFtZTogSEFDS19HUkFNTUFSU1swXX07XG4gICAgfSxcbiAgICBnZXRQYXRoKCkge1xuICAgICAgcmV0dXJuICcvdGVzdC90ZXN0LnBocCc7XG4gICAgfSxcbiAgfTtcblxuICBsZXQgRmluZFJlZmVyZW5jZXNQcm92aWRlcjtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3B5T24oaGFjaywgJ2ZpbmRSZWZlcmVuY2VzJykuYW5kUmV0dXJuKHtcbiAgICAgIGJhc2VVcmk6ICcvdGVzdC8nLFxuICAgICAgc3ltYm9sTmFtZTogJ1Rlc3RDbGFzczo6dGVzdEZ1bmN0aW9uJyxcbiAgICAgIHJlZmVyZW5jZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdUZXN0Q2xhc3M6OnRlc3RGdW5jdGlvbicsXG4gICAgICAgICAgZmlsZW5hbWU6ICcvdGVzdC9maWxlMS5waHAnLFxuICAgICAgICAgIGxpbmU6IDEzLFxuICAgICAgICAgIGNoYXJfc3RhcnQ6IDUsXG4gICAgICAgICAgY2hhcl9lbmQ6IDcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnVGVzdENsYXNzOjp0ZXN0RnVuY3Rpb24nLFxuICAgICAgICAgIGZpbGVuYW1lOiAnL3Rlc3QvZmlsZTIucGhwJyxcbiAgICAgICAgICBsaW5lOiAxMSxcbiAgICAgICAgICBjaGFyX3N0YXJ0OiAxLFxuICAgICAgICAgIGNoYXJfZW5kOiAzLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIENhbid0IGxvYWQgdGhpcyB1bnRpbCBgaGFja2AgaXMgbW9ja2VkXG4gICAgRmluZFJlZmVyZW5jZXNQcm92aWRlciA9IHJlcXVpcmUoJy4uL2xpYi9GaW5kUmVmZXJlbmNlc1Byb3ZpZGVyJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgYWJsZSB0byByZXR1cm4gcmVmZXJlbmNlcycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVmcyA9IGF3YWl0IEZpbmRSZWZlcmVuY2VzUHJvdmlkZXIuZmluZFJlZmVyZW5jZXMobW9ja0VkaXRvciwgbmV3IFBvaW50KDEsIDEpKTtcbiAgICAgIGV4cGVjdChyZWZzKS50b0VxdWFsKHtcbiAgICAgICAgdHlwZTogJ2RhdGEnLFxuICAgICAgICBiYXNlVXJpOiAnL3Rlc3QvJyxcbiAgICAgICAgcmVmZXJlbmNlZFN5bWJvbE5hbWU6ICdUZXN0Q2xhc3M6OnRlc3RGdW5jdGlvbicsXG4gICAgICAgIHJlZmVyZW5jZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmk6ICcvdGVzdC9maWxlMS5waHAnLFxuICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0OiB7bGluZTogMTMsIGNvbHVtbjogNX0sXG4gICAgICAgICAgICBlbmQ6IHtsaW5lOiAxMywgY29sdW1uOiA3fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVyaTogJy90ZXN0L2ZpbGUyLnBocCcsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgc3RhcnQ6IHtsaW5lOiAxMSwgY29sdW1uOiAxfSxcbiAgICAgICAgICAgIGVuZDoge2xpbmU6IDExLCBjb2x1bW46IDN9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-hack/spec/FindReferencesProvider-spec.js
