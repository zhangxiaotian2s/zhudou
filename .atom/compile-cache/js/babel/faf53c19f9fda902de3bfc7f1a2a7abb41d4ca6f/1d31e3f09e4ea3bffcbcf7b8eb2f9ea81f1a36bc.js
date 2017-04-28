var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _libRecentFilesProvider = require('../lib/RecentFilesProvider');

'use babel';

var PROJECT_PATH = '/Users/testuser/';
var PROJECT_PATH2 = '/Users/something_else/';

var FILE_PATHS = [PROJECT_PATH + 'foo/bla/foo.js', PROJECT_PATH + 'foo/bla/bar.js', PROJECT_PATH + 'foo/bla/baz.js'];

var FAKE_RECENT_FILES = FILE_PATHS.map(function (path, i) {
  return {
    path: path,
    timestamp: 1e8 - i * 1000
  };
});

var FakeRecentFilesService = {
  getRecentFiles: function getRecentFiles() {
    return FAKE_RECENT_FILES;
  },
  touchFile: function touchFile(path) {}
};

var fakeGetProjectPathsImpl = function fakeGetProjectPathsImpl() {
  return [];
};
var fakeGetProjectPaths = function fakeGetProjectPaths() {
  return fakeGetProjectPathsImpl();
};

describe('RecentFilesProvider', function () {
  var recentFilesProvider = undefined;

  beforeEach(function () {
    recentFilesProvider = _extends({}, _libRecentFilesProvider.RecentFilesProvider);
    recentFilesProvider.setRecentFilesService(FakeRecentFilesService);
    spyOn(atom.project, 'getPaths').andCallFake(fakeGetProjectPaths);
  });

  describe('getRecentFiles', function () {
    it('returns all recently opened files for currently mounted project directories', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        fakeGetProjectPathsImpl = function () {
          return [PROJECT_PATH];
        };
        expect((yield recentFilesProvider.executeQuery(''))).toEqual(FAKE_RECENT_FILES);
        fakeGetProjectPathsImpl = function () {
          return [PROJECT_PATH, PROJECT_PATH2];
        };
        expect((yield recentFilesProvider.executeQuery(''))).toEqual(FAKE_RECENT_FILES);
      }));
    });

    it('does not return files for project directories that are not currently mounted', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        fakeGetProjectPathsImpl = function () {
          return [PROJECT_PATH2];
        };
        expect((yield recentFilesProvider.executeQuery(''))).toEqual([]);

        fakeGetProjectPathsImpl = function () {
          return [];
        };
        expect((yield recentFilesProvider.executeQuery(''))).toEqual([]);
      }));
    });

    it('filters results according to the query string', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        fakeGetProjectPathsImpl = function () {
          return [PROJECT_PATH];
        };
        expect((yield recentFilesProvider.executeQuery('ba'))).toEqual([
        // 'foo/bla/foo.js' does not match 'ba', but `bar.js` and `baz.js` do:
        FAKE_RECENT_FILES[1], FAKE_RECENT_FILES[2]]);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcmVjZW50LWZpbGVzLXByb3ZpZGVyL3NwZWMvUmVjZW50RmlsZXNQcm92aWRlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQ0FXa0MsNEJBQTRCOztBQVg5RCxXQUFXLENBQUM7O0FBWVosSUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUM7QUFDeEMsSUFBTSxhQUFhLEdBQUcsd0JBQXdCLENBQUM7O0FBRS9DLElBQU0sVUFBVSxHQUFHLENBQ2pCLFlBQVksR0FBRyxnQkFBZ0IsRUFDL0IsWUFBWSxHQUFHLGdCQUFnQixFQUMvQixZQUFZLEdBQUcsZ0JBQWdCLENBQ2hDLENBQUM7O0FBRUYsSUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUM7U0FBTTtBQUNyRCxRQUFJLEVBQUosSUFBSTtBQUNKLGFBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUk7R0FDMUI7Q0FBQyxDQUFDLENBQUM7O0FBRUosSUFBTSxzQkFBc0IsR0FBRztBQUM3QixnQkFBYyxFQUFFO1dBQU0saUJBQWlCO0dBQUE7QUFDdkMsV0FBUyxFQUFFLG1CQUFDLElBQUksRUFBYSxFQUFFO0NBQ2hDLENBQUM7O0FBRUYsSUFBSSx1QkFBdUIsR0FBRztTQUFNLEVBQUU7Q0FBQSxDQUFDO0FBQ3ZDLElBQU0sbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CO1NBQVMsdUJBQXVCLEVBQUU7Q0FBQSxDQUFDOztBQUU1RCxRQUFRLENBQUMscUJBQXFCLEVBQUUsWUFBTTtBQUNwQyxNQUFJLG1CQUF3QixZQUFBLENBQUM7O0FBRTdCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsdUJBQW1CLDREQUEyQixDQUFDO0FBQy9DLHVCQUFtQixDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDbEUsU0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDbEUsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFNO0FBQy9CLE1BQUUsQ0FBQyw2RUFBNkUsRUFBRSxZQUFNO0FBQ3RGLHFCQUFlLG1CQUFDLGFBQVk7QUFDMUIsK0JBQXVCLEdBQUc7aUJBQU0sQ0FBQyxZQUFZLENBQUM7U0FBQSxDQUFDO0FBQy9DLGNBQU0sRUFBQyxNQUFNLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUUsK0JBQXVCLEdBQUc7aUJBQU0sQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO1NBQUEsQ0FBQztBQUM5RCxjQUFNLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO09BQy9FLEVBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsOEVBQThFLEVBQUUsWUFBTTtBQUN2RixxQkFBZSxtQkFBQyxhQUFZO0FBQzFCLCtCQUF1QixHQUFHO2lCQUFNLENBQUMsYUFBYSxDQUFDO1NBQUEsQ0FBQztBQUNoRCxjQUFNLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFL0QsK0JBQXVCLEdBQUc7aUJBQU0sRUFBRTtTQUFBLENBQUM7QUFDbkMsY0FBTSxFQUFDLE1BQU0sbUJBQW1CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDaEUsRUFBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywrQ0FBK0MsRUFBRSxZQUFNO0FBQ3hELHFCQUFlLG1CQUFDLGFBQVk7QUFDMUIsK0JBQXVCLEdBQUc7aUJBQU0sQ0FBQyxZQUFZLENBQUM7U0FBQSxDQUFDO0FBQy9DLGNBQU0sRUFBQyxNQUFNLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUUzRCx5QkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFDcEIsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQ3JCLENBQUMsQ0FBQztPQUNKLEVBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLXJlY2VudC1maWxlcy1wcm92aWRlci9zcGVjL1JlY2VudEZpbGVzUHJvdmlkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7UmVjZW50RmlsZXNQcm92aWRlcn0gZnJvbSAnLi4vbGliL1JlY2VudEZpbGVzUHJvdmlkZXInO1xuY29uc3QgUFJPSkVDVF9QQVRIID0gJy9Vc2Vycy90ZXN0dXNlci8nO1xuY29uc3QgUFJPSkVDVF9QQVRIMiA9ICcvVXNlcnMvc29tZXRoaW5nX2Vsc2UvJztcblxuY29uc3QgRklMRV9QQVRIUyA9IFtcbiAgUFJPSkVDVF9QQVRIICsgJ2Zvby9ibGEvZm9vLmpzJyxcbiAgUFJPSkVDVF9QQVRIICsgJ2Zvby9ibGEvYmFyLmpzJyxcbiAgUFJPSkVDVF9QQVRIICsgJ2Zvby9ibGEvYmF6LmpzJyxcbl07XG5cbmNvbnN0IEZBS0VfUkVDRU5UX0ZJTEVTID0gRklMRV9QQVRIUy5tYXAoKHBhdGgsIGkpID0+ICh7XG4gIHBhdGgsXG4gIHRpbWVzdGFtcDogMWU4IC0gaSAqIDEwMDAsXG59KSk7XG5cbmNvbnN0IEZha2VSZWNlbnRGaWxlc1NlcnZpY2UgPSB7XG4gIGdldFJlY2VudEZpbGVzOiAoKSA9PiBGQUtFX1JFQ0VOVF9GSUxFUyxcbiAgdG91Y2hGaWxlOiAocGF0aDogc3RyaW5nKSA9PiB7fSxcbn07XG5cbmxldCBmYWtlR2V0UHJvamVjdFBhdGhzSW1wbCA9ICgpID0+IFtdO1xuY29uc3QgZmFrZUdldFByb2plY3RQYXRocyA9ICgpID0+IGZha2VHZXRQcm9qZWN0UGF0aHNJbXBsKCk7XG5cbmRlc2NyaWJlKCdSZWNlbnRGaWxlc1Byb3ZpZGVyJywgKCkgPT4ge1xuICBsZXQgcmVjZW50RmlsZXNQcm92aWRlcjogYW55O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHJlY2VudEZpbGVzUHJvdmlkZXIgPSB7Li4uUmVjZW50RmlsZXNQcm92aWRlcn07XG4gICAgcmVjZW50RmlsZXNQcm92aWRlci5zZXRSZWNlbnRGaWxlc1NlcnZpY2UoRmFrZVJlY2VudEZpbGVzU2VydmljZSk7XG4gICAgc3B5T24oYXRvbS5wcm9qZWN0LCAnZ2V0UGF0aHMnKS5hbmRDYWxsRmFrZShmYWtlR2V0UHJvamVjdFBhdGhzKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFJlY2VudEZpbGVzJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGFsbCByZWNlbnRseSBvcGVuZWQgZmlsZXMgZm9yIGN1cnJlbnRseSBtb3VudGVkIHByb2plY3QgZGlyZWN0b3JpZXMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmYWtlR2V0UHJvamVjdFBhdGhzSW1wbCA9ICgpID0+IFtQUk9KRUNUX1BBVEhdO1xuICAgICAgICBleHBlY3QoYXdhaXQgcmVjZW50RmlsZXNQcm92aWRlci5leGVjdXRlUXVlcnkoJycpKS50b0VxdWFsKEZBS0VfUkVDRU5UX0ZJTEVTKTtcbiAgICAgICAgZmFrZUdldFByb2plY3RQYXRoc0ltcGwgPSAoKSA9PiBbUFJPSkVDVF9QQVRILCBQUk9KRUNUX1BBVEgyXTtcbiAgICAgICAgZXhwZWN0KGF3YWl0IHJlY2VudEZpbGVzUHJvdmlkZXIuZXhlY3V0ZVF1ZXJ5KCcnKSkudG9FcXVhbChGQUtFX1JFQ0VOVF9GSUxFUyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCByZXR1cm4gZmlsZXMgZm9yIHByb2plY3QgZGlyZWN0b3JpZXMgdGhhdCBhcmUgbm90IGN1cnJlbnRseSBtb3VudGVkJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgZmFrZUdldFByb2plY3RQYXRoc0ltcGwgPSAoKSA9PiBbUFJPSkVDVF9QQVRIMl07XG4gICAgICAgIGV4cGVjdChhd2FpdCByZWNlbnRGaWxlc1Byb3ZpZGVyLmV4ZWN1dGVRdWVyeSgnJykpLnRvRXF1YWwoW10pO1xuXG4gICAgICAgIGZha2VHZXRQcm9qZWN0UGF0aHNJbXBsID0gKCkgPT4gW107XG4gICAgICAgIGV4cGVjdChhd2FpdCByZWNlbnRGaWxlc1Byb3ZpZGVyLmV4ZWN1dGVRdWVyeSgnJykpLnRvRXF1YWwoW10pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmlsdGVycyByZXN1bHRzIGFjY29yZGluZyB0byB0aGUgcXVlcnkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgZmFrZUdldFByb2plY3RQYXRoc0ltcGwgPSAoKSA9PiBbUFJPSkVDVF9QQVRIXTtcbiAgICAgICAgZXhwZWN0KGF3YWl0IHJlY2VudEZpbGVzUHJvdmlkZXIuZXhlY3V0ZVF1ZXJ5KCdiYScpKS50b0VxdWFsKFtcbiAgICAgICAgICAvLyAnZm9vL2JsYS9mb28uanMnIGRvZXMgbm90IG1hdGNoICdiYScsIGJ1dCBgYmFyLmpzYCBhbmQgYGJhei5qc2AgZG86XG4gICAgICAgICAgRkFLRV9SRUNFTlRfRklMRVNbMV0sXG4gICAgICAgICAgRkFLRV9SRUNFTlRfRklMRVNbMl0sXG4gICAgICAgIF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-recent-files-provider/spec/RecentFilesProvider-spec.js
