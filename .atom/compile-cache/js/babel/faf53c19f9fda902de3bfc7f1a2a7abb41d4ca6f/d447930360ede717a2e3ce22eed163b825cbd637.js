var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _libLinterAdapter = require('../lib/LinterAdapter');

var _nuclideTestHelpers = require('nuclide-test-helpers');

'use babel';

var grammar = 'testgrammar';

function makePromise(ret, timeout) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(ret);
    }, timeout);
  });
}

describe('LinterAdapter', function () {
  var eventCallback = undefined;
  var fakeLinter = undefined;
  var linterAdapter = undefined;
  var linterReturn = undefined;
  var fakeEditor = undefined;
  var subscribedToAny = undefined;
  var newUpdateSubscriber = undefined;
  var publishMessageUpdateSpy = undefined;
  var fakeDiagnosticsProviderBase = undefined;

  var FakeDiagnosticsProviderBase = (function () {
    function FakeDiagnosticsProviderBase(options) {
      _classCallCheck(this, FakeDiagnosticsProviderBase);

      eventCallback = options.onTextEditorEvent;
      subscribedToAny = options.enableForAllGrammars;
      newUpdateSubscriber = options.onNewUpdateSubscriber;
      this.publishMessageUpdate = jasmine.createSpy();
      publishMessageUpdateSpy = this.publishMessageUpdate;
      this.publishMessageInvalidation = jasmine.createSpy();
      this.dispose = jasmine.createSpy();
      fakeDiagnosticsProviderBase = this; // eslint-disable-line consistent-this
    }

    _createClass(FakeDiagnosticsProviderBase, [{
      key: 'onMessageUpdate',
      value: function onMessageUpdate(callback) {
        this.publishMessageUpdate.andCallFake(callback);
        return new _atom.Disposable(function () {});
      }
    }, {
      key: 'onMessageInvalidation',
      value: function onMessageInvalidation() {
        return new _atom.Disposable(function () {});
      }
    }]);

    return FakeDiagnosticsProviderBase;
  })();

  function newLinterAdapter(linter) {
    return new _libLinterAdapter.LinterAdapter(linter, FakeDiagnosticsProviderBase);
  }

  beforeEach(function () {
    fakeEditor = {
      getPath: function getPath() {
        return 'foo';
      },
      getGrammar: function getGrammar() {
        return { scopeName: grammar };
      }
    };
    spyOn(atom.workspace, 'getActiveTextEditor').andReturn(fakeEditor);
    linterReturn = Promise.resolve([]);
    fakeLinter = {
      grammarScopes: [grammar],
      scope: 'file',
      lintOnFly: true,
      lint: function lint() {
        return linterReturn;
      }
    };
    spyOn(fakeLinter, 'lint').andCallThrough();
    linterAdapter = newLinterAdapter(fakeLinter);
  });

  afterEach(function () {
    jasmine.unspy(atom.workspace, 'getActiveTextEditor');
  });

  it('should dispatch the linter on an event', function () {
    eventCallback(fakeEditor);
    expect(fakeLinter.lint).toHaveBeenCalled();
  });

  it("should subscribe to 'all' for linters for allGrammarScopes", function () {
    newLinterAdapter({
      grammarScopes: [],
      allGrammarScopes: true,
      scope: 'file',
      lintOnFly: true,
      lint: function lint() {
        return linterReturn;
      }
    });
    expect(subscribedToAny).toBe(true);
  });

  it('should dispatch an event on subscribe if no lint is in progress', function () {
    var callback = jasmine.createSpy();
    newUpdateSubscriber(callback);
    waitsFor(function () {
      return publishMessageUpdateSpy.callCount > 0;
    }, 'It should call the callback', 100);
  });

  it('should work when the linter is synchronous', function () {
    linterReturn = [{ type: 'Error', filePath: 'foo' }];
    var message = null;
    linterAdapter.onMessageUpdate(function (m) {
      message = m;
    });
    eventCallback(fakeEditor);
    waitsFor(function () {
      return message && message.filePathToMessages.has('foo');
    }, 'The adapter should publish a message');
  });

  it('should not reorder results', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var numMessages = 0;
      var lastMessage = null;
      linterAdapter.onMessageUpdate(function (message) {
        numMessages++;
        lastMessage = message;
      });
      // Dispatch two linter requests.
      linterReturn = makePromise([{ type: 'Error', filePath: 'bar' }], 50);
      eventCallback(fakeEditor);
      linterReturn = makePromise([{ type: 'Error', filePath: 'baz' }], 10);
      eventCallback(fakeEditor);
      // If we call it once with a larger value, the first promise will resolve
      // first, even though the timeout is larger
      window.advanceClock(30);
      window.advanceClock(30);
      waitsFor(function () {
        return numMessages === 1 && lastMessage && lastMessage.filePathToMessages.has('baz');
      }, 'There should be only the latest message', 100);
    }));
  });

  it('should delegate dispose', function () {
    expect(fakeDiagnosticsProviderBase.dispose).not.toHaveBeenCalled();
    linterAdapter.dispose();
    expect(fakeDiagnosticsProviderBase.dispose).toHaveBeenCalled();
  });
});

describe('message transformation functions', function () {
  var fileMessage = {
    type: 'Error',
    text: 'Uh oh',
    filePath: '/fu/bar'
  };

  var projectMessage = {
    type: 'Warning',
    text: 'Oh no!'
  };

  var providerName = undefined;
  var currentPath = undefined;

  beforeEach(function () {
    providerName = 'provider';
    currentPath = 'foo/bar';
  });

  describe('linterMessageToDiagnosticMessage', function () {
    function checkMessage(linterMessage, expected) {
      (0, _assert2['default'])(providerName);
      var actual = (0, _libLinterAdapter.linterMessageToDiagnosticMessage)(linterMessage, providerName);
      var areEqual = (0, _nuclideTestHelpers.arePropertiesEqual)(actual, expected);
      expect(areEqual).toBe(true);
    }

    it('should turn a message with a filePath into a file scope diagnostic', function () {
      checkMessage(fileMessage, {
        scope: 'file',
        providerName: providerName,
        type: fileMessage.type,
        filePath: fileMessage.filePath,
        text: fileMessage.text
      });
    });

    it('should turn a message without a filePath into a project scope diagnostic', function () {
      checkMessage(projectMessage, {
        scope: 'project',
        providerName: providerName,
        type: projectMessage.type,
        text: projectMessage.text
      });
    });
  });

  describe('linterMessagesToDiagnosticUpdate', function () {
    function runWith(linterMessages) {
      return (0, _libLinterAdapter.linterMessagesToDiagnosticUpdate)(currentPath, linterMessages, providerName);
    }

    it('should invalidate diagnostics in the current file', function () {
      var result = runWith([]);
      (0, _assert2['default'])(result.filePathToMessages);
      expect(result.filePathToMessages.get(currentPath)).toEqual([]);
    });

    it('should name linters that do not provide a name', function () {
      providerName = undefined;
      var result = runWith([fileMessage]);
      (0, _assert2['default'])(result.filePathToMessages);
      var resultMessage = result.filePathToMessages.get(fileMessage.filePath)[0];
      expect(resultMessage.providerName).toEqual('Unnamed Linter');
    });

    it('should provide both project messages and file messages', function () {
      var result = runWith([fileMessage, projectMessage]);
      (0, _assert2['default'])(result.filePathToMessages);
      // The actual message transformations are tested in the tests from
      // linterMessageToDiagnosticMessage -- no need to duplicate them here.
      expect(result.filePathToMessages.get(fileMessage.filePath).length).toEqual(1);
      (0, _assert2['default'])(result.projectMessages);
      expect(result.projectMessages.length).toEqual(1);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlhZ25vc3RpY3Mtc3RvcmUvc3BlYy9MaW50ZXJBZGFwdGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFXeUIsTUFBTTs7c0JBRVQsUUFBUTs7OztnQ0FNdkIsc0JBQXNCOztrQ0FJSSxzQkFBc0I7O0FBdkJ2RCxXQUFXLENBQUM7O0FBcUJaLElBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQzs7QUFJOUIsU0FBUyxXQUFXLENBQUksR0FBTSxFQUFFLE9BQWUsRUFBYztBQUMzRCxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzVCLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2QsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNiLENBQUMsQ0FBQztDQUNKOztBQUVELFFBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFJLGFBQWtCLFlBQUEsQ0FBQztBQUN2QixNQUFJLFVBQWUsWUFBQSxDQUFDO0FBQ3BCLE1BQUksYUFBa0IsWUFBQSxDQUFDO0FBQ3ZCLE1BQUksWUFBaUIsWUFBQSxDQUFDO0FBQ3RCLE1BQUksVUFBZSxZQUFBLENBQUM7QUFDcEIsTUFBSSxlQUFvQixZQUFBLENBQUM7QUFDekIsTUFBSSxtQkFBd0IsWUFBQSxDQUFDO0FBQzdCLE1BQUksdUJBQTRCLFlBQUEsQ0FBQztBQUNqQyxNQUFJLDJCQUFnQyxZQUFBLENBQUM7O01BRS9CLDJCQUEyQjtBQUlwQixhQUpQLDJCQUEyQixDQUluQixPQUFPLEVBQUU7NEJBSmpCLDJCQUEyQjs7QUFLN0IsbUJBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7QUFDMUMscUJBQWUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUM7QUFDL0MseUJBQW1CLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0FBQ3BE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QyxFQUFFLENBQUMsQ0FBQztLQUNoRSxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLGdEQUFnRCxFQUFFLFlBQU07QUFDekQsa0JBQVksR0FBRyxTQUFTLENBQUM7QUFDekIsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN0QywrQkFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNyQyxVQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RSxZQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzlELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsd0RBQXdELEVBQUUsWUFBTTtBQUNqRSxVQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN0RCwrQkFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7O0FBR3JDLFlBQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsK0JBQVUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xDLFlBQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1kaWFnbm9zdGljcy1zdG9yZS9zcGVjL0xpbnRlckFkYXB0ZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcblxuaW1wb3J0IHtcbiAgTGludGVyQWRhcHRlcixcbiAgbGludGVyTWVzc2FnZVRvRGlhZ25vc3RpY01lc3NhZ2UsXG4gIGxpbnRlck1lc3NhZ2VzVG9EaWFnbm9zdGljVXBkYXRlLFxufSBmcm9tICcuLi9saWIvTGludGVyQWRhcHRlcic7XG5cbmNvbnN0IGdyYW1tYXIgPSAndGVzdGdyYW1tYXInO1xuXG5pbXBvcnQge2FyZVByb3BlcnRpZXNFcXVhbH0gZnJvbSAnbnVjbGlkZS10ZXN0LWhlbHBlcnMnO1xuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZTxUPihyZXQ6IFQsIHRpbWVvdXQ6IG51bWJlcik6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZXNvbHZlKHJldCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH0pO1xufVxuXG5kZXNjcmliZSgnTGludGVyQWRhcHRlcicsICgpID0+IHtcbiAgbGV0IGV2ZW50Q2FsbGJhY2s6IGFueTtcbiAgbGV0IGZha2VMaW50ZXI6IGFueTtcbiAgbGV0IGxpbnRlckFkYXB0ZXI6IGFueTtcbiAgbGV0IGxpbnRlclJldHVybjogYW55O1xuICBsZXQgZmFrZUVkaXRvcjogYW55O1xuICBsZXQgc3Vic2NyaWJlZFRvQW55OiBhbnk7XG4gIGxldCBuZXdVcGRhdGVTdWJzY3JpYmVyOiBhbnk7XG4gIGxldCBwdWJsaXNoTWVzc2FnZVVwZGF0ZVNweTogYW55O1xuICBsZXQgZmFrZURpYWdub3N0aWNzUHJvdmlkZXJCYXNlOiBhbnk7XG5cbiAgY2xhc3MgRmFrZURpYWdub3N0aWNzUHJvdmlkZXJCYXNlIHtcbiAgICBwdWJsaXNoTWVzc2FnZVVwZGF0ZTogSmFzbWluZVNweTtcbiAgICBwdWJsaXNoTWVzc2FnZUludmFsaWRhdGlvbjogSmFzbWluZVNweTtcbiAgICBkaXNwb3NlOiBKYXNtaW5lU3B5O1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgIGV2ZW50Q2FsbGJhY2sgPSBvcHRpb25zLm9uVGV4dEVkaXRvckV2ZW50O1xuICAgICAgc3Vic2NyaWJlZFRvQW55ID0gb3B0aW9ucy5lbmFibGVGb3JBbGxHcmFtbWFycztcbiAgICAgIG5ld1VwZGF0ZVN1YnNjcmliZXIgPSBvcHRpb25zLm9uTmV3VXBkYXRlU3Vic2NyaWJlcjtcbiAgICAgIHRoaXMucHVibGlzaE1lc3NhZ2VVcGRhdGUgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgcHVibGlzaE1lc3NhZ2VVcGRhdGVTcHkgPSB0aGlzLnB1Ymxpc2hNZXNzYWdlVXBkYXRlO1xuICAgICAgdGhpcy5wdWJsaXNoTWVzc2FnZUludmFsaWRhdGlvbiA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICB0aGlzLmRpc3Bvc2UgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgZmFrZURpYWdub3N0aWNzUHJvdmlkZXJCYXNlID0gdGhpczsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC10aGlzXG4gICAgfVxuICAgIG9uTWVzc2FnZVVwZGF0ZShjYWxsYmFjaykge1xuICAgICAgdGhpcy5wdWJsaXNoTWVzc2FnZVVwZGF0ZS5hbmRDYWxsRmFrZShjYWxsYmFjayk7XG4gICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge30pO1xuICAgIH1cbiAgICBvbk1lc3NhZ2VJbnZhbGlkYXRpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld0xpbnRlckFkYXB0ZXIobGludGVyKSB7XG4gICAgcmV0dXJuIG5ldyBMaW50ZXJBZGFwdGVyKGxpbnRlciwgKEZha2VEaWFnbm9zdGljc1Byb3ZpZGVyQmFzZTogYW55KSk7XG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBmYWtlRWRpdG9yID0ge1xuICAgICAgZ2V0UGF0aCgpIHsgcmV0dXJuICdmb28nOyB9LFxuICAgICAgZ2V0R3JhbW1hcigpIHsgcmV0dXJuIHsgc2NvcGVOYW1lOiBncmFtbWFyIH07IH0sXG4gICAgfTtcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVRleHRFZGl0b3InKS5hbmRSZXR1cm4oZmFrZUVkaXRvcik7XG4gICAgbGludGVyUmV0dXJuID0gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICBmYWtlTGludGVyID0ge1xuICAgICAgZ3JhbW1hclNjb3BlczogW2dyYW1tYXJdLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6ICgpID0+IGxpbnRlclJldHVybixcbiAgICB9O1xuICAgIHNweU9uKGZha2VMaW50ZXIsICdsaW50JykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICBsaW50ZXJBZGFwdGVyID0gbmV3TGludGVyQWRhcHRlcihmYWtlTGludGVyKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBqYXNtaW5lLnVuc3B5KGF0b20ud29ya3NwYWNlLCAnZ2V0QWN0aXZlVGV4dEVkaXRvcicpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGRpc3BhdGNoIHRoZSBsaW50ZXIgb24gYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgZXZlbnRDYWxsYmFjayhmYWtlRWRpdG9yKTtcbiAgICBleHBlY3QoZmFrZUxpbnRlci5saW50KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHN1YnNjcmliZSB0byAnYWxsJyBmb3IgbGludGVycyBmb3IgYWxsR3JhbW1hclNjb3Blc1wiLCAoKSA9PiB7XG4gICAgbmV3TGludGVyQWRhcHRlcih7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbXSxcbiAgICAgIGFsbEdyYW1tYXJTY29wZXM6IHRydWUsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKCkgPT4gbGludGVyUmV0dXJuLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdWJzY3JpYmVkVG9BbnkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZGlzcGF0Y2ggYW4gZXZlbnQgb24gc3Vic2NyaWJlIGlmIG5vIGxpbnQgaXMgaW4gcHJvZ3Jlc3MnLCAoKSA9PiB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgIG5ld1VwZGF0ZVN1YnNjcmliZXIoY2FsbGJhY2spO1xuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiBwdWJsaXNoTWVzc2FnZVVwZGF0ZVNweS5jYWxsQ291bnQgPiAwO1xuICAgIH0sICdJdCBzaG91bGQgY2FsbCB0aGUgY2FsbGJhY2snLCAxMDApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHdvcmsgd2hlbiB0aGUgbGludGVyIGlzIHN5bmNocm9ub3VzJywgKCkgPT4ge1xuICAgIGxpbnRlclJldHVybiA9IFt7dHlwZTogJ0Vycm9yJywgZmlsZVBhdGg6ICdmb28nfV07XG4gICAgbGV0IG1lc3NhZ2UgPSBudWxsO1xuICAgIGxpbnRlckFkYXB0ZXIub25NZXNzYWdlVXBkYXRlKG0gPT4ge1xuICAgICAgbWVzc2FnZSA9IG07XG4gICAgfSk7XG4gICAgZXZlbnRDYWxsYmFjayhmYWtlRWRpdG9yKTtcbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gbWVzc2FnZSAmJiBtZXNzYWdlLmZpbGVQYXRoVG9NZXNzYWdlcy5oYXMoJ2ZvbycpO1xuICAgIH0sICdUaGUgYWRhcHRlciBzaG91bGQgcHVibGlzaCBhIG1lc3NhZ2UnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBub3QgcmVvcmRlciByZXN1bHRzJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgbnVtTWVzc2FnZXMgPSAwO1xuICAgICAgbGV0IGxhc3RNZXNzYWdlID0gbnVsbDtcbiAgICAgIGxpbnRlckFkYXB0ZXIub25NZXNzYWdlVXBkYXRlKG1lc3NhZ2UgPT4ge1xuICAgICAgICBudW1NZXNzYWdlcysrO1xuICAgICAgICBsYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICB9KTtcbiAgICAgIC8vIERpc3BhdGNoIHR3byBsaW50ZXIgcmVxdWVzdHMuXG4gICAgICBsaW50ZXJSZXR1cm4gPSBtYWtlUHJvbWlzZShbe3R5cGU6ICdFcnJvcicsIGZpbGVQYXRoOiAnYmFyJ31dLCA1MCk7XG4gICAgICBldmVudENhbGxiYWNrKGZha2VFZGl0b3IpO1xuICAgICAgbGludGVyUmV0dXJuID0gbWFrZVByb21pc2UoW3t0eXBlOiAnRXJyb3InLCBmaWxlUGF0aDogJ2Jheid9XSwgMTApO1xuICAgICAgZXZlbnRDYWxsYmFjayhmYWtlRWRpdG9yKTtcbiAgICAgIC8vIElmIHdlIGNhbGwgaXQgb25jZSB3aXRoIGEgbGFyZ2VyIHZhbHVlLCB0aGUgZmlyc3QgcHJvbWlzZSB3aWxsIHJlc29sdmVcbiAgICAgIC8vIGZpcnN0LCBldmVuIHRob3VnaCB0aGUgdGltZW91dCBpcyBsYXJnZXJcbiAgICAgIHdpbmRvdy5hZHZhbmNlQ2xvY2soMzApO1xuICAgICAgd2luZG93LmFkdmFuY2VDbG9jaygzMCk7XG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiBudW1NZXNzYWdlcyA9PT0gMSAmJiBsYXN0TWVzc2FnZSAmJiBsYXN0TWVzc2FnZS5maWxlUGF0aFRvTWVzc2FnZXMuaGFzKCdiYXonKTtcbiAgICAgIH0sICdUaGVyZSBzaG91bGQgYmUgb25seSB0aGUgbGF0ZXN0IG1lc3NhZ2UnLCAxMDApO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGRlbGVnYXRlIGRpc3Bvc2UnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGZha2VEaWFnbm9zdGljc1Byb3ZpZGVyQmFzZS5kaXNwb3NlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIGxpbnRlckFkYXB0ZXIuZGlzcG9zZSgpO1xuICAgIGV4cGVjdChmYWtlRGlhZ25vc3RpY3NQcm92aWRlckJhc2UuZGlzcG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnbWVzc2FnZSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGNvbnN0IGZpbGVNZXNzYWdlID0ge1xuICAgIHR5cGU6ICdFcnJvcicsXG4gICAgdGV4dDogJ1VoIG9oJyxcbiAgICBmaWxlUGF0aDogJy9mdS9iYXInLFxuICB9O1xuXG4gIGNvbnN0IHByb2plY3RNZXNzYWdlID0ge1xuICAgIHR5cGU6ICdXYXJuaW5nJyxcbiAgICB0ZXh0OiAnT2ggbm8hJyxcbiAgfTtcblxuICBsZXQgcHJvdmlkZXJOYW1lO1xuICBsZXQgY3VycmVudFBhdGg7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgcHJvdmlkZXJOYW1lID0gJ3Byb3ZpZGVyJztcbiAgICBjdXJyZW50UGF0aCA9ICdmb28vYmFyJztcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xpbnRlck1lc3NhZ2VUb0RpYWdub3N0aWNNZXNzYWdlJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIGNoZWNrTWVzc2FnZShsaW50ZXJNZXNzYWdlLCBleHBlY3RlZCkge1xuICAgICAgaW52YXJpYW50KHByb3ZpZGVyTmFtZSk7XG4gICAgICBjb25zdCBhY3R1YWwgPSBsaW50ZXJNZXNzYWdlVG9EaWFnbm9zdGljTWVzc2FnZShsaW50ZXJNZXNzYWdlLCBwcm92aWRlck5hbWUpO1xuICAgICAgY29uc3QgYXJlRXF1YWwgPSBhcmVQcm9wZXJ0aWVzRXF1YWwoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgICBleHBlY3QoYXJlRXF1YWwpLnRvQmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCB0dXJuIGEgbWVzc2FnZSB3aXRoIGEgZmlsZVBhdGggaW50byBhIGZpbGUgc2NvcGUgZGlhZ25vc3RpYycsICgpID0+IHtcbiAgICAgIGNoZWNrTWVzc2FnZShmaWxlTWVzc2FnZSwge1xuICAgICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgICBwcm92aWRlck5hbWUsXG4gICAgICAgIHR5cGU6IGZpbGVNZXNzYWdlLnR5cGUsXG4gICAgICAgIGZpbGVQYXRoOiBmaWxlTWVzc2FnZS5maWxlUGF0aCxcbiAgICAgICAgdGV4dDogZmlsZU1lc3NhZ2UudGV4dCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB0dXJuIGEgbWVzc2FnZSB3aXRob3V0IGEgZmlsZVBhdGggaW50byBhIHByb2plY3Qgc2NvcGUgZGlhZ25vc3RpYycsICgpID0+IHtcbiAgICAgIGNoZWNrTWVzc2FnZShwcm9qZWN0TWVzc2FnZSwge1xuICAgICAgICBzY29wZTogJ3Byb2plY3QnLFxuICAgICAgICBwcm92aWRlck5hbWUsXG4gICAgICAgIHR5cGU6IHByb2plY3RNZXNzYWdlLnR5cGUsXG4gICAgICAgIHRleHQ6IHByb2plY3RNZXNzYWdlLnRleHQsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xpbnRlck1lc3NhZ2VzVG9EaWFnbm9zdGljVXBkYXRlJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIHJ1bldpdGgobGludGVyTWVzc2FnZXMpIHtcbiAgICAgIHJldHVybiBsaW50ZXJNZXNzYWdlc1RvRGlhZ25vc3RpY1VwZGF0ZShjdXJyZW50UGF0aCwgbGludGVyTWVzc2FnZXMsIHByb3ZpZGVyTmFtZSk7XG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCBpbnZhbGlkYXRlIGRpYWdub3N0aWNzIGluIHRoZSBjdXJyZW50IGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBydW5XaXRoKFtdKTtcbiAgICAgIGludmFyaWFudChyZXN1bHQuZmlsZVBhdGhUb01lc3NhZ2VzKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuZmlsZVBhdGhUb01lc3NhZ2VzLmdldChjdXJyZW50UGF0aCkpLnRvRXF1YWwoW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBuYW1lIGxpbnRlcnMgdGhhdCBkbyBub3QgcHJvdmlkZSBhIG5hbWUnLCAoKSA9PiB7XG4gICAgICBwcm92aWRlck5hbWUgPSB1bmRlZmluZWQ7XG4gICAgICBjb25zdCByZXN1bHQgPSBydW5XaXRoKFtmaWxlTWVzc2FnZV0pO1xuICAgICAgaW52YXJpYW50KHJlc3VsdC5maWxlUGF0aFRvTWVzc2FnZXMpO1xuICAgICAgY29uc3QgcmVzdWx0TWVzc2FnZSA9IHJlc3VsdC5maWxlUGF0aFRvTWVzc2FnZXMuZ2V0KGZpbGVNZXNzYWdlLmZpbGVQYXRoKVswXTtcbiAgICAgIGV4cGVjdChyZXN1bHRNZXNzYWdlLnByb3ZpZGVyTmFtZSkudG9FcXVhbCgnVW5uYW1lZCBMaW50ZXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBib3RoIHByb2plY3QgbWVzc2FnZXMgYW5kIGZpbGUgbWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBydW5XaXRoKFtmaWxlTWVzc2FnZSwgcHJvamVjdE1lc3NhZ2VdKTtcbiAgICAgIGludmFyaWFudChyZXN1bHQuZmlsZVBhdGhUb01lc3NhZ2VzKTtcbiAgICAgIC8vIFRoZSBhY3R1YWwgbWVzc2FnZSB0cmFuc2Zvcm1hdGlvbnMgYXJlIHRlc3RlZCBpbiB0aGUgdGVzdHMgZnJvbVxuICAgICAgLy8gbGludGVyTWVzc2FnZVRvRGlhZ25vc3RpY01lc3NhZ2UgLS0gbm8gbmVlZCB0byBkdXBsaWNhdGUgdGhlbSBoZXJlLlxuICAgICAgZXhwZWN0KHJlc3VsdC5maWxlUGF0aFRvTWVzc2FnZXMuZ2V0KGZpbGVNZXNzYWdlLmZpbGVQYXRoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBpbnZhcmlhbnQocmVzdWx0LnByb2plY3RNZXNzYWdlcyk7XG4gICAgICBleHBlY3QocmVzdWx0LnByb2plY3RNZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-diagnostics-store/spec/LinterAdapter-spec.js
