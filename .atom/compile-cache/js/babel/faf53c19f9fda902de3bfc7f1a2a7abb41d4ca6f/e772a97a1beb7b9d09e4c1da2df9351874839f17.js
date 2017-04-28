var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _libSearchResultManager = require('../lib/SearchResultManager');

var _libSearchResultManager2 = _interopRequireDefault(_libSearchResultManager);

'use babel';
var _getOmniSearchProviderSpec = _libSearchResultManager.__test__._getOmniSearchProviderSpec;

var FakeProvider = {
  getProviderType: function getProviderType() {
    return 'GLOBAL';
  },
  getName: function getName() {
    return 'FakeProvider';
  },
  isRenderable: function isRenderable() {
    return true;
  },
  getTabTitle: function getTabTitle() {
    return 'Nothing to see here';
  },
  executeQuery: function executeQuery(query) {
    return Promise.resolve([]);
  }
};

var FakeProviderSpec = {
  action: '',
  debounceDelay: 200,
  name: 'FakeProvider',
  prompt: 'Search FakeProvider',
  title: 'Nothing to see here'
};

var TEST_STRINGS = ['yolo', 'foo', 'bar'];
var ExactStringMatchProvider = {
  getProviderType: function getProviderType() {
    return 'GLOBAL';
  },
  getName: function getName() {
    return 'ExactStringMatchProvider';
  },
  isRenderable: function isRenderable() {
    return true;
  },
  getTabTitle: function getTabTitle() {
    return 'Nothing to see here';
  },
  executeQuery: function executeQuery(query) {
    return Promise.resolve(TEST_STRINGS.filter(function (s) {
      return s === query;
    }).map(function (s) {
      return { path: s };
    }));
  }
};

// Promise-ify the flux cycle around SearchResultManager::executeQuery.
function querySingleProvider(searchResultManager, query, providerName) {
  return new Promise(function (resolve, reject) {
    searchResultManager.on(searchResultManager.RESULTS_CHANGED, function () {
      resolve(searchResultManager.getResults(query, providerName));
    });
    searchResultManager.executeQuery(query);
  });
}

// Helper to construct expected result objects for a global provider.
function constructSingleProviderResult(provider, result) {
  var wrappedResult = {};
  wrappedResult[provider.getName()] = {
    title: provider.getTabTitle(),
    results: {
      global: _extends({}, result)
    }
  };
  return wrappedResult;
}

var searchResultManager = null;
describe('SearchResultManager', function () {
  beforeEach(function () {
    searchResultManager = new _libSearchResultManager2['default']();
  });

  describe('getRenderableProviders', function () {
    it('Should return OmniSearchProvider even if no actual providers are available.', function () {
      var renderableProviders = searchResultManager.getRenderableProviders();
      expect(renderableProviders).toEqual([_getOmniSearchProviderSpec()]);
    });
  });

  describe('provider/directory cache', function () {
    it('updates the cache when providers become (un)available', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var fakeProviderDisposable = searchResultManager.registerProvider(_extends({}, FakeProvider));
        var providersChangedCallCount = 0;
        searchResultManager.on(searchResultManager.PROVIDERS_CHANGED, function () {
          providersChangedCallCount++;
        });
        yield searchResultManager._updateDirectories();
        var renderableProviders = searchResultManager.getRenderableProviders();
        expect(renderableProviders.length).toEqual(2);
        expect(renderableProviders[1]).toEqual(FakeProviderSpec);
        expect(providersChangedCallCount).toEqual(1);

        // Simulate deactivation of FakeProvider
        fakeProviderDisposable.dispose();
        renderableProviders = searchResultManager.getRenderableProviders();
        expect(renderableProviders.length).toEqual(1);
        expect(providersChangedCallCount).toEqual(2);
      }));
    });
  });

  describe('querying providers', function () {
    it('queries providers asynchronously, emits change events and returns filtered results', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        searchResultManager.registerProvider(_extends({}, ExactStringMatchProvider));
        expect((yield querySingleProvider(searchResultManager, 'yolo', 'ExactStringMatchProvider'))).toEqual(constructSingleProviderResult(ExactStringMatchProvider, {
          results: [{
            path: 'yolo',
            sourceProvider: 'ExactStringMatchProvider'
          }],
          loading: false,
          error: null
        }));
      }));
    });

    it('ignores trailing whitespace in querystring.', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        searchResultManager.registerProvider(_extends({}, ExactStringMatchProvider));
        yield Promise.all(['   yolo', 'yolo   ', '   yolo   \n '].map(_asyncToGenerator(function* (query) {
          expect((yield querySingleProvider(searchResultManager, query, 'ExactStringMatchProvider'))).toEqual(constructSingleProviderResult(ExactStringMatchProvider, {
            results: [{
              path: query.trim(),
              sourceProvider: 'ExactStringMatchProvider'
            }],
            loading: false,
            error: null
          }));
        })));
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcXVpY2stb3Blbi9zcGVjL1NlYXJjaFJlc3VsdE1hbmFnZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQ0FXZ0MsNEJBQTRCOzs7O0FBWDVELFdBQVcsQ0FBQztJQWFMLDBCQUEwQixvQ0FBMUIsMEJBQTBCOztBQUVqQyxJQUFNLFlBQVksR0FBRztBQUNuQixpQkFBZSxFQUFFO1dBQU0sUUFBUTtHQUFBO0FBQy9CLFNBQU8sRUFBRTtXQUFNLGNBQWM7R0FBQTtBQUM3QixjQUFZLEVBQUU7V0FBTSxJQUFJO0dBQUE7QUFDeEIsYUFBVyxFQUFFO1dBQU0scUJBQXFCO0dBQUE7QUFDeEMsY0FBWSxFQUFFLHNCQUFBLEtBQUs7V0FBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztHQUFBO0NBQzNDLENBQUM7O0FBRUYsSUFBTSxnQkFBZ0IsR0FBRztBQUN2QixRQUFNLEVBQUUsRUFBRTtBQUNWLGVBQWEsRUFBRSxHQUFHO0FBQ2xCLE1BQUksRUFBRSxjQUFjO0FBQ3BCLFFBQU0sRUFBRSxxQkFBcUI7QUFDN0IsT0FBSyxFQUFFLHFCQUFxQjtDQUM3QixDQUFDOztBQUVGLElBQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxJQUFNLHdCQUF3QixHQUFHO0FBQy9CLGlCQUFlLEVBQUU7V0FBTSxRQUFRO0dBQUE7QUFDL0IsU0FBTyxFQUFFO1dBQU0sMEJBQTBCO0dBQUE7QUFDekMsY0FBWSxFQUFFO1dBQU0sSUFBSTtHQUFBO0FBQ3hCLGFBQVcsRUFBRTtXQUFNLHFCQUFxQjtHQUFBO0FBQ3hDLGNBQVksRUFBRSxzQkFBQSxLQUFLO1dBQUksT0FBTyxDQUFDLE9BQU8sQ0FDcEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLEtBQUssS0FBSztLQUFB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QUFJO1dBQ1osQ0FDRixDQUFDLENBQUM7U0FDSixFQUFDLENBQUMsQ0FBQztPQUNMLEVBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLXF1aWNrLW9wZW4vc3BlYy9TZWFyY2hSZXN1bHRNYW5hZ2VyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU2VhcmNoUmVzdWx0TWFuYWdlciBmcm9tICcuLi9saWIvU2VhcmNoUmVzdWx0TWFuYWdlcic7XG5pbXBvcnQge19fdGVzdF9ffSBmcm9tICcuLi9saWIvU2VhcmNoUmVzdWx0TWFuYWdlcic7XG5jb25zdCB7X2dldE9tbmlTZWFyY2hQcm92aWRlclNwZWN9ID0gIF9fdGVzdF9fO1xuXG5jb25zdCBGYWtlUHJvdmlkZXIgPSB7XG4gIGdldFByb3ZpZGVyVHlwZTogKCkgPT4gJ0dMT0JBTCcsXG4gIGdldE5hbWU6ICgpID0+ICdGYWtlUHJvdmlkZXInLFxuICBpc1JlbmRlcmFibGU6ICgpID0+IHRydWUsXG4gIGdldFRhYlRpdGxlOiAoKSA9PiAnTm90aGluZyB0byBzZWUgaGVyZScsXG4gIGV4ZWN1dGVRdWVyeTogcXVlcnkgPT4gUHJvbWlzZS5yZXNvbHZlKFtdKSxcbn07XG5cbmNvbnN0IEZha2VQcm92aWRlclNwZWMgPSB7XG4gIGFjdGlvbjogJycsXG4gIGRlYm91bmNlRGVsYXk6IDIwMCxcbiAgbmFtZTogJ0Zha2VQcm92aWRlcicsXG4gIHByb21wdDogJ1NlYXJjaCBGYWtlUHJvdmlkZXInLFxuICB0aXRsZTogJ05vdGhpbmcgdG8gc2VlIGhlcmUnLFxufTtcblxuY29uc3QgVEVTVF9TVFJJTkdTID0gWyd5b2xvJywgJ2ZvbycsICdiYXInXTtcbmNvbnN0IEV4YWN0U3RyaW5nTWF0Y2hQcm92aWRlciA9IHtcbiAgZ2V0UHJvdmlkZXJUeXBlOiAoKSA9PiAnR0xPQkFMJyxcbiAgZ2V0TmFtZTogKCkgPT4gJ0V4YWN0U3RyaW5nTWF0Y2hQcm92aWRlcicsXG4gIGlzUmVuZGVyYWJsZTogKCkgPT4gdHJ1ZSxcbiAgZ2V0VGFiVGl0bGU6ICgpID0+ICdOb3RoaW5nIHRvIHNlZSBoZXJlJyxcbiAgZXhlY3V0ZVF1ZXJ5OiBxdWVyeSA9PiBQcm9taXNlLnJlc29sdmUoXG4gICAgVEVTVF9TVFJJTkdTLmZpbHRlcihzID0+IHMgPT09IHF1ZXJ5KS5tYXAocyA9PiAoe3BhdGg6IHN9KSlcbiAgKSxcbn07XG5cbi8vIFByb21pc2UtaWZ5IHRoZSBmbHV4IGN5Y2xlIGFyb3VuZCBTZWFyY2hSZXN1bHRNYW5hZ2VyOjpleGVjdXRlUXVlcnkuXG5mdW5jdGlvbiBxdWVyeVNpbmdsZVByb3ZpZGVyKFxuICBzZWFyY2hSZXN1bHRNYW5hZ2VyOiBhbnksXG4gIHF1ZXJ5OiBzdHJpbmcsXG4gIHByb3ZpZGVyTmFtZTogc3RyaW5nXG4pOiBQcm9taXNlPE9iamVjdD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNlYXJjaFJlc3VsdE1hbmFnZXIub24oc2VhcmNoUmVzdWx0TWFuYWdlci5SRVNVTFRTX0NIQU5HRUQsICgpID0+IHtcbiAgICAgIHJlc29sdmUoc2VhcmNoUmVzdWx0TWFuYWdlci5nZXRSZXN1bHRzKHF1ZXJ5LCBwcm92aWRlck5hbWUpKTtcbiAgICB9KTtcbiAgICBzZWFyY2hSZXN1bHRNYW5hZ2VyLmV4ZWN1dGVRdWVyeShxdWVyeSk7XG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgdG8gY29uc3RydWN0IGV4cGVjdGVkIHJlc3VsdCBvYmplY3RzIGZvciBhIGdsb2JhbCBwcm92aWRlci5cbmZ1bmN0aW9uIGNvbnN0cnVjdFNpbmdsZVByb3ZpZGVyUmVzdWx0KHByb3ZpZGVyOiBPYmplY3QsIHJlc3VsdDogT2JqZWN0KSB7XG4gIGNvbnN0IHdyYXBwZWRSZXN1bHQgPSB7fTtcbiAgd3JhcHBlZFJlc3VsdFtwcm92aWRlci5nZXROYW1lKCldID0ge1xuICAgIHRpdGxlOiBwcm92aWRlci5nZXRUYWJUaXRsZSgpLFxuICAgIHJlc3VsdHM6IHtcbiAgICAgIGdsb2JhbDogey4uLnJlc3VsdH0sXG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZWRSZXN1bHQ7XG59XG5cbmxldCBzZWFyY2hSZXN1bHRNYW5hZ2VyOiBhbnkgPSBudWxsO1xuZGVzY3JpYmUoJ1NlYXJjaFJlc3VsdE1hbmFnZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHNlYXJjaFJlc3VsdE1hbmFnZXIgPSBuZXcgU2VhcmNoUmVzdWx0TWFuYWdlcigpO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0UmVuZGVyYWJsZVByb3ZpZGVycycsICgpID0+IHtcbiAgICBpdCgnU2hvdWxkIHJldHVybiBPbW5pU2VhcmNoUHJvdmlkZXIgZXZlbiBpZiBubyBhY3R1YWwgcHJvdmlkZXJzIGFyZSBhdmFpbGFibGUuJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVuZGVyYWJsZVByb3ZpZGVycyA9IHNlYXJjaFJlc3VsdE1hbmFnZXIuZ2V0UmVuZGVyYWJsZVByb3ZpZGVycygpO1xuICAgICAgZXhwZWN0KHJlbmRlcmFibGVQcm92aWRlcnMpLnRvRXF1YWwoW19nZXRPbW5pU2VhcmNoUHJvdmlkZXJTcGVjKCldKTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncHJvdmlkZXIvZGlyZWN0b3J5IGNhY2hlJywgKCkgPT4ge1xuICAgIGl0KCd1cGRhdGVzIHRoZSBjYWNoZSB3aGVuIHByb3ZpZGVycyBiZWNvbWUgKHVuKWF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZha2VQcm92aWRlckRpc3Bvc2FibGUgPSBzZWFyY2hSZXN1bHRNYW5hZ2VyLnJlZ2lzdGVyUHJvdmlkZXIoey4uLkZha2VQcm92aWRlcn0pO1xuICAgICAgICBsZXQgcHJvdmlkZXJzQ2hhbmdlZENhbGxDb3VudCA9IDA7XG4gICAgICAgIHNlYXJjaFJlc3VsdE1hbmFnZXIub24oXG4gICAgICAgICAgc2VhcmNoUmVzdWx0TWFuYWdlci5QUk9WSURFUlNfQ0hBTkdFRCxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBwcm92aWRlcnNDaGFuZ2VkQ2FsbENvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBhd2FpdCBzZWFyY2hSZXN1bHRNYW5hZ2VyLl91cGRhdGVEaXJlY3RvcmllcygpO1xuICAgICAgICBsZXQgcmVuZGVyYWJsZVByb3ZpZGVycyA9IHNlYXJjaFJlc3VsdE1hbmFnZXIuZ2V0UmVuZGVyYWJsZVByb3ZpZGVycygpO1xuICAgICAgICBleHBlY3QocmVuZGVyYWJsZVByb3ZpZGVycy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChyZW5kZXJhYmxlUHJvdmlkZXJzWzFdKS50b0VxdWFsKEZha2VQcm92aWRlclNwZWMpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXJzQ2hhbmdlZENhbGxDb3VudCkudG9FcXVhbCgxKTtcblxuICAgICAgICAvLyBTaW11bGF0ZSBkZWFjdGl2YXRpb24gb2YgRmFrZVByb3ZpZGVyXG4gICAgICAgIGZha2VQcm92aWRlckRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICByZW5kZXJhYmxlUHJvdmlkZXJzID0gc2VhcmNoUmVzdWx0TWFuYWdlci5nZXRSZW5kZXJhYmxlUHJvdmlkZXJzKCk7XG4gICAgICAgIGV4cGVjdChyZW5kZXJhYmxlUHJvdmlkZXJzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyc0NoYW5nZWRDYWxsQ291bnQpLnRvRXF1YWwoMik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncXVlcnlpbmcgcHJvdmlkZXJzJywgKCkgPT4ge1xuICAgIGl0KCdxdWVyaWVzIHByb3ZpZGVycyBhc3luY2hyb25vdXNseSwgZW1pdHMgY2hhbmdlIGV2ZW50cyBhbmQgcmV0dXJucyBmaWx0ZXJlZCByZXN1bHRzJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgc2VhcmNoUmVzdWx0TWFuYWdlci5yZWdpc3RlclByb3ZpZGVyKHsuLi5FeGFjdFN0cmluZ01hdGNoUHJvdmlkZXJ9KTtcbiAgICAgICAgZXhwZWN0KGF3YWl0IHF1ZXJ5U2luZ2xlUHJvdmlkZXIoc2VhcmNoUmVzdWx0TWFuYWdlciwgJ3lvbG8nLCAnRXhhY3RTdHJpbmdNYXRjaFByb3ZpZGVyJykpXG4gICAgICAgICAgLnRvRXF1YWwoY29uc3RydWN0U2luZ2xlUHJvdmlkZXJSZXN1bHQoRXhhY3RTdHJpbmdNYXRjaFByb3ZpZGVyLCB7XG4gICAgICAgICAgICByZXN1bHRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiAneW9sbycsXG4gICAgICAgICAgICAgICAgc291cmNlUHJvdmlkZXI6ICdFeGFjdFN0cmluZ01hdGNoUHJvdmlkZXInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgfVxuICAgICAgICApKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgdHJhaWxpbmcgd2hpdGVzcGFjZSBpbiBxdWVyeXN0cmluZy4nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZWFyY2hSZXN1bHRNYW5hZ2VyLnJlZ2lzdGVyUHJvdmlkZXIoey4uLkV4YWN0U3RyaW5nTWF0Y2hQcm92aWRlcn0pO1xuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgJyAgIHlvbG8nLFxuICAgICAgICAgICd5b2xvICAgJyxcbiAgICAgICAgICAnICAgeW9sbyAgIFxcbiAnLFxuICAgICAgICBdLm1hcChhc3luYyBxdWVyeSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGF3YWl0IHF1ZXJ5U2luZ2xlUHJvdmlkZXIoc2VhcmNoUmVzdWx0TWFuYWdlciwgcXVlcnksICdFeGFjdFN0cmluZ01hdGNoUHJvdmlkZXInKSlcbiAgICAgICAgICAgIC50b0VxdWFsKGNvbnN0cnVjdFNpbmdsZVByb3ZpZGVyUmVzdWx0KEV4YWN0U3RyaW5nTWF0Y2hQcm92aWRlciwge1xuICAgICAgICAgICAgICByZXN1bHRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcGF0aDogcXVlcnkudHJpbSgpLFxuICAgICAgICAgICAgICAgICAgc291cmNlUHJvdmlkZXI6ICdFeGFjdFN0cmluZ01hdGNoUHJvdmlkZXInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApKTtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-quick-open/spec/SearchResultManager-spec.js
