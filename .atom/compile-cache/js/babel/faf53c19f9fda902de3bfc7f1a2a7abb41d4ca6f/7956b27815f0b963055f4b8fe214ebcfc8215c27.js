function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _libFileTreeHelpers = require('../lib/FileTreeHelpers');

var _libFileTreeHelpers2 = _interopRequireDefault(_libFileTreeHelpers);

'use babel';

describe('FileTreeHelpers', function () {
  it('should convert key to path', function () {
    expect(_libFileTreeHelpers2['default'].keyToPath('/a')).toBe('/a');
    expect(_libFileTreeHelpers2['default'].keyToPath('/a/')).toBe('/a');
    expect(_libFileTreeHelpers2['default'].keyToPath('/a/b//')).toBe('/a/b');
    expect(_libFileTreeHelpers2['default'].keyToPath('nuclide://host:123/a/b//')).toBe('nuclide://host:123/a/b');
  });

  it('should convert path to key', function () {
    expect(_libFileTreeHelpers2['default'].dirPathToKey('/a')).toBe('/a/');
    expect(_libFileTreeHelpers2['default'].dirPathToKey('/a/')).toBe('/a/');
    expect(_libFileTreeHelpers2['default'].dirPathToKey('/a//')).toBe('/a/');
  });

  it('should convert path to name', function () {
    expect(_libFileTreeHelpers2['default'].keyToName('/a/b/foo')).toBe('foo');
    expect(_libFileTreeHelpers2['default'].keyToName('/a/b/foo/')).toBe('foo');
    expect(_libFileTreeHelpers2['default'].keyToName('/a/b/foo//')).toBe('foo');
    expect(_libFileTreeHelpers2['default'].keyToName('nuclide://host:123/a/b/foo//')).toBe('foo');
    expect(_libFileTreeHelpers2['default'].keyToName('asdf')).toBe('asdf');
  });

  it('should determine if a key represents a directory', function () {
    expect(_libFileTreeHelpers2['default'].isDirKey('/a/b/foo')).toBe(false);
    expect(_libFileTreeHelpers2['default'].isDirKey('/a/b/')).toBe(true);
    expect(_libFileTreeHelpers2['default'].isDirKey('/a/b//')).toBe(true);
    expect(_libFileTreeHelpers2['default'].isDirKey('nuclide://host:456/a/b')).toBe(false);
    expect(_libFileTreeHelpers2['default'].isDirKey('nuclide://host:456/a/b/')).toBe(true);
  });

  it('should instantiate a local directory from a key', function () {
    expect(_libFileTreeHelpers2['default'].getDirectoryByKey('/a/') instanceof _atom.Directory).toBe(true);
  });

  it('should validate directories', function () {
    var validDir = new _atom.Directory('/a/b/c');
    expect(_libFileTreeHelpers2['default'].isValidDirectory(validDir)).toBe(true);
    var badDir = new _atom.Directory('nuclide://host:123/a/b/c');
    expect(_libFileTreeHelpers2['default'].isValidDirectory(badDir)).toBe(false);
  });

  describe('getFileByKey', function () {
    it('instantiates a local file from a key', function () {
      expect(_libFileTreeHelpers2['default'].getFileByKey('/a.md') instanceof _atom.File).toBe(true);
    });

    it('instantiates a local directory from a key', function () {
      expect(_libFileTreeHelpers2['default'].getFileByKey('/a/') instanceof _atom.Directory).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvRmlsZVRyZWVIZWxwZXJzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFjTyxNQUFNOztrQ0FDZSx3QkFBd0I7Ozs7QUFmcEQsV0FBVyxDQUFDOztBQWlCWixRQUFRLENBQUMsaUJBQWlCLEVBQUUsWUFBTTtBQUNoQyxJQUFFLENBQUMsNEJBQTRCLEVBQUUsWUFBTTtBQUNyQyxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6RCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7R0FDOUYsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ3JDLFVBQU0sQ0FBQyxnQ0FBZ0IsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxnQ0FBZ0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hELFVBQU0sQ0FBQyxnQ0FBZ0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzFELENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsNkJBQTZCLEVBQUUsWUFBTTtBQUN0QyxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1RCxVQUFNLENBQUMsZ0NBQWdCLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlFLFVBQU0sQ0FBQyxnQ0FBZ0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3hELENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsa0RBQWtELEVBQUUsWUFBTTtBQUMzRCxVQUFNLENBQUMsZ0NBQWdCLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6RCxVQUFNLENBQUMsZ0NBQWdCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxVQUFNLENBQUMsZ0NBQWdCLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxVQUFNLENBQUMsZ0NBQWdCLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZFLFVBQU0sQ0FBQyxnQ0FBZ0IsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDeEUsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxpREFBaUQsRUFBRSxZQUFNO0FBQzFELFVBQU0sQ0FBQyxnQ0FBZ0IsaUJBQWlCLENBQUMsS0FBSyxDQUFDLDJCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2xGLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsNkJBQTZCLEVBQUUsWUFBTTtBQUN0QyxRQUFNLFFBQVEsR0FBRyxvQkFBYyxRQUFRLENBQUMsQ0FBQztBQUN6QyxVQUFNLENBQUMsZ0NBQWdCLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlELFFBQU0sTUFBTSxHQUFHLG9CQUFjLDBCQUEwQixDQUFDLENBQUM7QUFDekQsVUFBTSxDQUFDLGdDQUFnQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUM5RCxDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzdCLE1BQUUsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFNO0FBQy9DLFlBQU0sQ0FBQyxnQ0FBZ0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxzQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxRSxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDJDQUEyQyxFQUFFLFlBQU07QUFDcEQsWUFBTSxDQUFDLGdDQUFnQixZQUFZLENBQUMsS0FBSyxDQUFDLDJCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdFLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWZpbGUtdHJlZS9zcGVjL0ZpbGVUcmVlSGVscGVycy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0b3J5LFxuICBGaWxlLFxufSBmcm9tICdhdG9tJztcbmltcG9ydCBGaWxlVHJlZUhlbHBlcnMgZnJvbSAnLi4vbGliL0ZpbGVUcmVlSGVscGVycyc7XG5cbmRlc2NyaWJlKCdGaWxlVHJlZUhlbHBlcnMnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgY29udmVydCBrZXkgdG8gcGF0aCcsICgpID0+IHtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvUGF0aCgnL2EnKSkudG9CZSgnL2EnKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvUGF0aCgnL2EvJykpLnRvQmUoJy9hJyk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5rZXlUb1BhdGgoJy9hL2IvLycpKS50b0JlKCcvYS9iJyk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5rZXlUb1BhdGgoJ251Y2xpZGU6Ly9ob3N0OjEyMy9hL2IvLycpKS50b0JlKCdudWNsaWRlOi8vaG9zdDoxMjMvYS9iJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY29udmVydCBwYXRoIHRvIGtleScsICgpID0+IHtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmRpclBhdGhUb0tleSgnL2EnKSkudG9CZSgnL2EvJyk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5kaXJQYXRoVG9LZXkoJy9hLycpKS50b0JlKCcvYS8nKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmRpclBhdGhUb0tleSgnL2EvLycpKS50b0JlKCcvYS8nKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjb252ZXJ0IHBhdGggdG8gbmFtZScsICgpID0+IHtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvTmFtZSgnL2EvYi9mb28nKSkudG9CZSgnZm9vJyk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5rZXlUb05hbWUoJy9hL2IvZm9vLycpKS50b0JlKCdmb28nKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvTmFtZSgnL2EvYi9mb28vLycpKS50b0JlKCdmb28nKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvTmFtZSgnbnVjbGlkZTovL2hvc3Q6MTIzL2EvYi9mb28vLycpKS50b0JlKCdmb28nKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmtleVRvTmFtZSgnYXNkZicpKS50b0JlKCdhc2RmJyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZGV0ZXJtaW5lIGlmIGEga2V5IHJlcHJlc2VudHMgYSBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5pc0RpcktleSgnL2EvYi9mb28nKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5pc0RpcktleSgnL2EvYi8nKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmlzRGlyS2V5KCcvYS9iLy8nKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmlzRGlyS2V5KCdudWNsaWRlOi8vaG9zdDo0NTYvYS9iJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdChGaWxlVHJlZUhlbHBlcnMuaXNEaXJLZXkoJ251Y2xpZGU6Ly9ob3N0OjQ1Ni9hL2IvJykpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaW5zdGFudGlhdGUgYSBsb2NhbCBkaXJlY3RvcnkgZnJvbSBhIGtleScsICgpID0+IHtcbiAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmdldERpcmVjdG9yeUJ5S2V5KCcvYS8nKSBpbnN0YW5jZW9mIERpcmVjdG9yeSkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBkaXJlY3RvcmllcycsICgpID0+IHtcbiAgICBjb25zdCB2YWxpZERpciA9IG5ldyBEaXJlY3RvcnkoJy9hL2IvYycpO1xuICAgIGV4cGVjdChGaWxlVHJlZUhlbHBlcnMuaXNWYWxpZERpcmVjdG9yeSh2YWxpZERpcikpLnRvQmUodHJ1ZSk7XG4gICAgY29uc3QgYmFkRGlyID0gbmV3IERpcmVjdG9yeSgnbnVjbGlkZTovL2hvc3Q6MTIzL2EvYi9jJyk7XG4gICAgZXhwZWN0KEZpbGVUcmVlSGVscGVycy5pc1ZhbGlkRGlyZWN0b3J5KGJhZERpcikpLnRvQmUoZmFsc2UpO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0RmlsZUJ5S2V5JywgKCkgPT4ge1xuICAgIGl0KCdpbnN0YW50aWF0ZXMgYSBsb2NhbCBmaWxlIGZyb20gYSBrZXknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmdldEZpbGVCeUtleSgnL2EubWQnKSBpbnN0YW5jZW9mIEZpbGUpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5zdGFudGlhdGVzIGEgbG9jYWwgZGlyZWN0b3J5IGZyb20gYSBrZXknLCAoKSA9PiB7XG4gICAgICBleHBlY3QoRmlsZVRyZWVIZWxwZXJzLmdldEZpbGVCeUtleSgnL2EvJykgaW5zdGFuY2VvZiBEaXJlY3RvcnkpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-file-tree/spec/FileTreeHelpers-spec.js
