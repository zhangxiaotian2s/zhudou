'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var formatBlameInfo = require('../lib/HgBlameProvider').__test__.formatBlameInfo;

describe('HgBlameProvider', function () {
  describe('formatBlameInfo', function () {
    it('Returns the front part of an email address, iff an email is present.', function () {
      var originalBlame = new Map([['1', 'Foo Bar <foo@bar.com> faceb00c'], ['2', 'A B <a.b@c.org> faceb00c'], ['3', 'alice@bob.com null'], ['4', '<alice@bob.com> faceb00c'], ['5', 'No Email Here faceb00c']]);
      var expectedShortenedBlame = new Map([[1, { author: 'foo', changeset: 'faceb00c' }], [2, { author: 'a.b', changeset: 'faceb00c' }], [3, { author: 'alice', changeset: null }], [4, { author: 'alice', changeset: 'faceb00c' }], [5, { author: 'No Email Here', changeset: 'faceb00c' }]]);
      var formattedBlameInfo = formatBlameInfo(originalBlame, /* useShortName */true);
      var numEntries = 0;
      for (var _ref3 of formattedBlameInfo) {
        var _ref2 = _slicedToArray(_ref3, 2);

        var index = _ref2[0];
        var blame = _ref2[1];

        ++numEntries;
        expect(blame).toEqual(expectedShortenedBlame.get(index));
      }
      expect(numEntries).toBe(5);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtYmxhbWUtcHJvdmlkZXItaGcvc3BlYy9IZ0JsYW1lUHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztJQVdMLGVBQWUsR0FBSSxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxRQUFRLENBQTdELGVBQWU7O0FBRXRCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLFVBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFNO0FBQ2hDLE1BQUUsQ0FBQyxzRUFBc0UsRUFBRSxZQUFNO0FBQy9FLFVBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLENBQzVCLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLEVBQ3ZDLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLEVBQ2pDLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLEVBQzNCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLEVBQ2pDLENBQUMsR0FBRyxFQUFFLHdCQUF3QixDQUFDLENBQ2hDLENBQUMsQ0FBQztBQUNILFVBQU0sc0JBQXNCLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FDckMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUMzQyxDQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQzNDLENBQUMsQ0FBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFDdkMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUM3QyxDQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQ3RELENBQUMsQ0FBQztBQUNILFVBQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDLGFBQWEsb0JBQXFCLElBQUksQ0FBQyxDQUFDO0FBQ25GLFVBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQix3QkFBNkIsa0JBQWtCLEVBQUU7OztZQUFyQyxLQUFLO1lBQUUsS0FBSzs7QUFDdEIsVUFBRSxVQUFVLENBQUM7QUFDYixjQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQzFEO0FBQ0QsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1ibGFtZS1wcm92aWRlci1oZy9zcGVjL0hnQmxhbWVQcm92aWRlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3Qge2Zvcm1hdEJsYW1lSW5mb30gPSByZXF1aXJlKCcuLi9saWIvSGdCbGFtZVByb3ZpZGVyJykuX190ZXN0X187XG5cbmRlc2NyaWJlKCdIZ0JsYW1lUHJvdmlkZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdmb3JtYXRCbGFtZUluZm8nLCAoKSA9PiB7XG4gICAgaXQoJ1JldHVybnMgdGhlIGZyb250IHBhcnQgb2YgYW4gZW1haWwgYWRkcmVzcywgaWZmIGFuIGVtYWlsIGlzIHByZXNlbnQuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxCbGFtZSA9IG5ldyBNYXAoW1xuICAgICAgICBbJzEnLCAnRm9vIEJhciA8Zm9vQGJhci5jb20+IGZhY2ViMDBjJ10sXG4gICAgICAgIFsnMicsICdBIEIgPGEuYkBjLm9yZz4gZmFjZWIwMGMnXSxcbiAgICAgICAgWyczJywgJ2FsaWNlQGJvYi5jb20gbnVsbCddLFxuICAgICAgICBbJzQnLCAnPGFsaWNlQGJvYi5jb20+IGZhY2ViMDBjJ10sXG4gICAgICAgIFsnNScsICdObyBFbWFpbCBIZXJlIGZhY2ViMDBjJ10sXG4gICAgICBdKTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkU2hvcnRlbmVkQmxhbWUgPSBuZXcgTWFwKFtcbiAgICAgICAgWzEsIHthdXRob3I6ICdmb28nLCBjaGFuZ2VzZXQ6ICdmYWNlYjAwYyd9XSxcbiAgICAgICAgWzIsIHthdXRob3I6ICdhLmInLCBjaGFuZ2VzZXQ6ICdmYWNlYjAwYyd9XSxcbiAgICAgICAgWzMsIHthdXRob3I6ICdhbGljZScsIGNoYW5nZXNldDogbnVsbH1dLFxuICAgICAgICBbNCwge2F1dGhvcjogJ2FsaWNlJywgY2hhbmdlc2V0OiAnZmFjZWIwMGMnfV0sXG4gICAgICAgIFs1LCB7YXV0aG9yOiAnTm8gRW1haWwgSGVyZScsIGNoYW5nZXNldDogJ2ZhY2ViMDBjJ31dLFxuICAgICAgXSk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRCbGFtZUluZm8gPSBmb3JtYXRCbGFtZUluZm8ob3JpZ2luYWxCbGFtZSwgLyogdXNlU2hvcnROYW1lICovIHRydWUpO1xuICAgICAgbGV0IG51bUVudHJpZXMgPSAwO1xuICAgICAgZm9yIChjb25zdCBbaW5kZXgsIGJsYW1lXSBvZiBmb3JtYXR0ZWRCbGFtZUluZm8pIHtcbiAgICAgICAgKytudW1FbnRyaWVzO1xuICAgICAgICBleHBlY3QoYmxhbWUpLnRvRXF1YWwoZXhwZWN0ZWRTaG9ydGVuZWRCbGFtZS5nZXQoaW5kZXgpKTtcbiAgICAgIH1cbiAgICAgIGV4cGVjdChudW1FbnRyaWVzKS50b0JlKDUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-blame-provider-hg/spec/HgBlameProvider-spec.js
