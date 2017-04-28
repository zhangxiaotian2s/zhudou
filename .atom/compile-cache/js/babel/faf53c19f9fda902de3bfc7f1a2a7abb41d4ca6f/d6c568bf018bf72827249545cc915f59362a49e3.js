'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _require = require('../lib/utils');

var sanitizeNuclideUri = _require.sanitizeNuclideUri;

describe('Utils Test Suite', function () {

  describe('sanitizeUri()', function () {
    it('returns a clean url from a normalized url version', function () {
      var normalizedUrl = 'nuclide:/abc.fb.com/some/path';
      var fixedUrl = sanitizeNuclideUri(normalizedUrl);
      expect(fixedUrl).toBe('nuclide://abc.fb.com/some/path');
    });

    it('returns a clean url from a normalized and path prepended url version', function () {
      var brokenUrl = '/some_path/abosolute/atom/nuclide:/abc.fb.com/some/path';
      var fixedUrl = sanitizeNuclideUri(brokenUrl);
      expect(fixedUrl).toBe('nuclide://abc.fb.com/some/path');
    });

    it('returns the same url if it is valid url', function () {
      var url = 'nuclide://abc.fb.com/some/path';
      expect(sanitizeNuclideUri(url)).toBe(url);
      var ftpUrl = 'ftp://abc.fb.com/some/path';
      expect(sanitizeNuclideUri(ftpUrl)).toBe(ftpUrl);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcmVtb3RlLXByb2plY3RzL3NwZWMvdXRpbHMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7ZUFXaUIsT0FBTyxDQUFDLGNBQWMsQ0FBQzs7SUFBN0Msa0JBQWtCLFlBQWxCLGtCQUFrQjs7QUFFekIsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07O0FBRWpDLFVBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUM1RCxVQUFNLGFBQWEsR0FBRywrQkFBK0IsQ0FBQztBQUN0RCxVQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxzRUFBc0UsRUFBRSxZQUFNO0FBQy9FLFVBQU0sU0FBUyxHQUFHLHlEQUF5RCxDQUFDO0FBQzVFLFVBQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztLQUN6RCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHlDQUF5QyxFQUFFLFlBQU07QUFDbEQsVUFBTSxHQUFHLEdBQUcsZ0NBQWdDLENBQUM7QUFDN0MsWUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLFVBQU0sTUFBTSxHQUFHLDRCQUE0QixDQUFDO0FBQzVDLFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1yZW1vdGUtcHJvamVjdHMvc3BlYy91dGlscy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3Qge3Nhbml0aXplTnVjbGlkZVVyaX0gPSByZXF1aXJlKCcuLi9saWIvdXRpbHMnKTtcblxuZGVzY3JpYmUoJ1V0aWxzIFRlc3QgU3VpdGUnLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJ3Nhbml0aXplVXJpKCknLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgYSBjbGVhbiB1cmwgZnJvbSBhIG5vcm1hbGl6ZWQgdXJsIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVkVXJsID0gJ251Y2xpZGU6L2FiYy5mYi5jb20vc29tZS9wYXRoJztcbiAgICAgIGNvbnN0IGZpeGVkVXJsID0gc2FuaXRpemVOdWNsaWRlVXJpKG5vcm1hbGl6ZWRVcmwpO1xuICAgICAgZXhwZWN0KGZpeGVkVXJsKS50b0JlKCdudWNsaWRlOi8vYWJjLmZiLmNvbS9zb21lL3BhdGgnKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgY2xlYW4gdXJsIGZyb20gYSBub3JtYWxpemVkIGFuZCBwYXRoIHByZXBlbmRlZCB1cmwgdmVyc2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGJyb2tlblVybCA9ICcvc29tZV9wYXRoL2Fib3NvbHV0ZS9hdG9tL251Y2xpZGU6L2FiYy5mYi5jb20vc29tZS9wYXRoJztcbiAgICAgIGNvbnN0IGZpeGVkVXJsID0gc2FuaXRpemVOdWNsaWRlVXJpKGJyb2tlblVybCk7XG4gICAgICBleHBlY3QoZml4ZWRVcmwpLnRvQmUoJ251Y2xpZGU6Ly9hYmMuZmIuY29tL3NvbWUvcGF0aCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgdGhlIHNhbWUgdXJsIGlmIGl0IGlzIHZhbGlkIHVybCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9ICdudWNsaWRlOi8vYWJjLmZiLmNvbS9zb21lL3BhdGgnO1xuICAgICAgZXhwZWN0KHNhbml0aXplTnVjbGlkZVVyaSh1cmwpKS50b0JlKHVybCk7XG4gICAgICBjb25zdCBmdHBVcmwgPSAnZnRwOi8vYWJjLmZiLmNvbS9zb21lL3BhdGgnO1xuICAgICAgZXhwZWN0KHNhbml0aXplTnVjbGlkZVVyaShmdHBVcmwpKS50b0JlKGZ0cFVybCk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-remote-projects/spec/utils-spec.js
