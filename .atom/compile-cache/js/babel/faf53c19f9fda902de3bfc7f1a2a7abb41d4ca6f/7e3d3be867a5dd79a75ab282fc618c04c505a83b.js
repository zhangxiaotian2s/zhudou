var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _libLinterAdapterFactory = require('../lib/LinterAdapterFactory');

'use babel';

var grammar = 'testgrammar';

describe('createAdapters', function () {
  var FakeDiagnosticsProviderBase = (function () {
    function FakeDiagnosticsProviderBase() {
      _classCallCheck(this, FakeDiagnosticsProviderBase);
    }

    _createClass(FakeDiagnosticsProviderBase, [{
      key: 'onMessageUpdate',
      value: function onMessageUpdate(callback) {
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

  function createAdaptersWithMock(linterProviders) {
    return (0, _libLinterAdapterFactory.createAdapters)(linterProviders, FakeDiagnosticsProviderBase);
  }

  var fakeLinter = undefined;

  beforeEach(function () {
    var fakeEditor = {
      getPath: function getPath() {
        return 'foo';
      },
      getGrammar: function getGrammar() {
        return { scopeName: grammar };
      }
    };
    spyOn(atom.workspace, 'getActiveTextEditor').andReturn(fakeEditor);
    fakeLinter = {
      grammarScopes: [grammar],
      scope: 'file',
      lintOnFly: true,
      lint: function lint() {
        return Promise.resolve([]);
      }
    };
  });

  afterEach(function () {
    jasmine.unspy(atom.workspace, 'getActiveTextEditor');
  });

  it('should return a linter adapter', function () {
    expect(createAdaptersWithMock(fakeLinter).size).toBe(1);
  });

  it('should not return an adapter if it is disabled for Nuclide', function () {
    fakeLinter.disabledForNuclide = true;
    expect(createAdaptersWithMock(fakeLinter).size).toBe(0);
  });

  it('should return multiple adapters if it is passed an array', function () {
    expect(createAdaptersWithMock([fakeLinter, fakeLinter]).size).toBe(2);
  });
});

describe('validateLinter', function () {
  var linter = undefined;

  beforeEach(function () {
    linter = {
      grammarScopes: [grammar],
      scope: 'file',
      lintOnFly: true,
      lint: function lint() {
        return Promise.resolve([]);
      }
    };
  });

  it('should not return errors for a valid linter', function () {
    expect((0, _libLinterAdapterFactory.validateLinter)(linter).length).toEqual(0);
  });

  it('should return errors for a linter with no lint function', function () {
    linter.lint = undefined;
    expect((0, _libLinterAdapterFactory.validateLinter)(linter)).toEqual(['lint function must be specified', 'lint must be a function']);
  });

  it('should return errors for a linter where lint is not a function', function () {
    linter.lint = [];
    expect((0, _libLinterAdapterFactory.validateLinter)(linter)).toEqual(['lint must be a function']);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlhZ25vc3RpY3Mtc3RvcmUvc3BlYy9MaW50ZXJBZGFwdGVyRmFjdG9yeS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFXeUIsTUFBTTs7dUNBRWMsNkJBQTZCOztBQWIxRSxXQUFXLENBQUM7O0FBZVosSUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDOztBQUU5QixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBTTtNQUN6QiwyQkFBMkI7YUFBM0IsMkJBQTJCOzRCQUEzQiwyQkFBMkI7OztpQkFBM0IsMkJBQTJCOzthQUNoQix5QkFBQyxRQUFRLEVBQUU7QUFDeEIsZUFBTyxxQkFBZSxZQUFNLEVBQUUsQ0FBQyxDQUFDO09BQ2pDOzs7YUFDb0IsaUNBQUc7QUFDdEIsZUFBTyxxQkFBZSxZQUFNLEVBQUUsQ0FBQyxDQUFDO09BQ2pDOzs7V0FORywyQkFBMkI7OztBQVNqQyxXQUFTLHNCQUFzQixDQUFDLGVBQWUsRUFBRTtBQUMvQyxXQUFPLDZDQUFlLGVBQWUsRUFBRywyQkFBMkIsQ0FBTyxDQUFDO0dBQzVFOztBQUVELE1BQUksVUFBZSxZQUFBLENBQUM7O0FBRXBCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBTSxVQUFVLEdBQUc7QUFDakIsYUFBTyxFQUFBLG1CQUFHO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRTtBQUMzQixnQkFBVSxFQUFBLHNCQUFHO0FBQUUsZUFBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztPQUFFO0tBQ2hELENBQUM7QUFDRixTQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuRSxjQUFVLEdBQUc7QUFDWCxtQkFBYSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ3hCLFdBQUssRUFBRSxNQUFNO0FBQ2IsZUFBUyxFQUFFLElBQUk7QUFDZixVQUFJLEVBQUU7ZUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztPQUFBO0tBQ2hDLENBQUM7R0FDSCxDQUFDLENBQUM7O0FBRUgsV0FBUyxDQUFDLFlBQU07QUFDZCxXQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQztHQUN0RCxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07QUFDekMsVUFBTSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6RCxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLDREQUE0RCxFQUFFLFlBQU07QUFDckUsY0FBVSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUNyQyxVQUFNLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3pELENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsMERBQTBELEVBQUUsWUFBTTtBQUNuRSxVQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDdkUsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDOztBQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUksTUFBVyxZQUFBLENBQUM7O0FBRWhCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBTSxHQUFHO0FBQ1AsbUJBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUN4QixXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxFQUFFO2VBQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7T0FBQTtLQUNoQyxDQUFDO0dBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFNO0FBQ3RELFVBQU0sQ0FBQyw2Q0FBZSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDbEQsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyx5REFBeUQsRUFBRSxZQUFNO0FBQ2xFLFVBQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFVBQU0sQ0FBQyw2Q0FBZSxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNyQyxpQ0FBaUMsRUFDakMseUJBQXlCLENBQzFCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0VBQWdFLEVBQUUsWUFBTTtBQUN6RSxVQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqQixVQUFNLENBQUMsNkNBQWUsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDckMseUJBQXlCLENBQzFCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWRpYWdub3N0aWNzLXN0b3JlL3NwZWMvTGludGVyQWRhcHRlckZhY3Rvcnktc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCB7Y3JlYXRlQWRhcHRlcnMsIHZhbGlkYXRlTGludGVyfSBmcm9tICcuLi9saWIvTGludGVyQWRhcHRlckZhY3RvcnknO1xuXG5jb25zdCBncmFtbWFyID0gJ3Rlc3RncmFtbWFyJztcblxuZGVzY3JpYmUoJ2NyZWF0ZUFkYXB0ZXJzJywgKCkgPT4ge1xuICBjbGFzcyBGYWtlRGlhZ25vc3RpY3NQcm92aWRlckJhc2Uge1xuICAgIG9uTWVzc2FnZVVwZGF0ZShjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHt9KTtcbiAgICB9XG4gICAgb25NZXNzYWdlSW52YWxpZGF0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBZGFwdGVyc1dpdGhNb2NrKGxpbnRlclByb3ZpZGVycykge1xuICAgIHJldHVybiBjcmVhdGVBZGFwdGVycyhsaW50ZXJQcm92aWRlcnMsIChGYWtlRGlhZ25vc3RpY3NQcm92aWRlckJhc2U6IGFueSkpO1xuICB9XG5cbiAgbGV0IGZha2VMaW50ZXI6IGFueTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjb25zdCBmYWtlRWRpdG9yID0ge1xuICAgICAgZ2V0UGF0aCgpIHsgcmV0dXJuICdmb28nOyB9LFxuICAgICAgZ2V0R3JhbW1hcigpIHsgcmV0dXJuIHsgc2NvcGVOYW1lOiBncmFtbWFyIH07IH0sXG4gICAgfTtcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVRleHRFZGl0b3InKS5hbmRSZXR1cm4oZmFrZUVkaXRvcik7XG4gICAgZmFrZUxpbnRlciA9IHtcbiAgICAgIGdyYW1tYXJTY29wZXM6IFtncmFtbWFyXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoKSA9PiBQcm9taXNlLnJlc29sdmUoW10pLFxuICAgIH07XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgamFzbWluZS51bnNweShhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVRleHRFZGl0b3InKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBsaW50ZXIgYWRhcHRlcicsICgpID0+IHtcbiAgICBleHBlY3QoY3JlYXRlQWRhcHRlcnNXaXRoTW9jayhmYWtlTGludGVyKS5zaXplKS50b0JlKDEpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gYW4gYWRhcHRlciBpZiBpdCBpcyBkaXNhYmxlZCBmb3IgTnVjbGlkZScsICgpID0+IHtcbiAgICBmYWtlTGludGVyLmRpc2FibGVkRm9yTnVjbGlkZSA9IHRydWU7XG4gICAgZXhwZWN0KGNyZWF0ZUFkYXB0ZXJzV2l0aE1vY2soZmFrZUxpbnRlcikuc2l6ZSkudG9CZSgwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gbXVsdGlwbGUgYWRhcHRlcnMgaWYgaXQgaXMgcGFzc2VkIGFuIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdChjcmVhdGVBZGFwdGVyc1dpdGhNb2NrKFtmYWtlTGludGVyLCBmYWtlTGludGVyXSkuc2l6ZSkudG9CZSgyKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3ZhbGlkYXRlTGludGVyJywgKCkgPT4ge1xuICBsZXQgbGludGVyOiBhbnk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgbGludGVyID0ge1xuICAgICAgZ3JhbW1hclNjb3BlczogW2dyYW1tYXJdLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6ICgpID0+IFByb21pc2UucmVzb2x2ZShbXSksXG4gICAgfTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIGVycm9ycyBmb3IgYSB2YWxpZCBsaW50ZXInLCAoKSA9PiB7XG4gICAgZXhwZWN0KHZhbGlkYXRlTGludGVyKGxpbnRlcikubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBlcnJvcnMgZm9yIGEgbGludGVyIHdpdGggbm8gbGludCBmdW5jdGlvbicsICgpID0+IHtcbiAgICBsaW50ZXIubGludCA9IHVuZGVmaW5lZDtcbiAgICBleHBlY3QodmFsaWRhdGVMaW50ZXIobGludGVyKSkudG9FcXVhbChbXG4gICAgICAnbGludCBmdW5jdGlvbiBtdXN0IGJlIHNwZWNpZmllZCcsXG4gICAgICAnbGludCBtdXN0IGJlIGEgZnVuY3Rpb24nLFxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBlcnJvcnMgZm9yIGEgbGludGVyIHdoZXJlIGxpbnQgaXMgbm90IGEgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgbGludGVyLmxpbnQgPSBbXTtcbiAgICBleHBlY3QodmFsaWRhdGVMaW50ZXIobGludGVyKSkudG9FcXVhbChbXG4gICAgICAnbGludCBtdXN0IGJlIGEgZnVuY3Rpb24nLFxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-diagnostics-store/spec/LinterAdapterFactory-spec.js
