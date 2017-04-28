'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

describe('main', function () {
  // TODO: Loading packages is rightfully slow; it `require`s a lot of files. Possible to inject
  // the `activation` class or move it to its own package to mock `require` it?
  it("disables Atom's builtin tree-view package on activation", function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
      yield atom.packages.activatePackage('nuclide-file-tree');
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
    }));
  });

  // Closing an Atom window calls `deactivate` on loaded packages.
  it("keeps Atom's builtin tree-view package disabled on deactivation", function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
      yield atom.packages.activatePackage('nuclide-file-tree');
      atom.packages.deactivatePackage('nuclide-file-tree');
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(true);
    }));
  });

  it("re-enables Atom's builtin tree-view package on disable", function () {
    waitsForPromise(_asyncToGenerator(function* () {
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
      yield atom.packages.activatePackage('nuclide-file-tree');
      atom.packages.disablePackage('nuclide-file-tree');
      atom.packages.deactivatePackage('nuclide-file-tree');
      expect(atom.packages.isPackageDisabled('tree-view')).toBe(false);
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvbWFpbi1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7O0FBV1osUUFBUSxDQUFDLE1BQU0sRUFBRSxZQUFNOzs7QUFHckIsSUFBRSxDQUFDLHlEQUF5RCxFQUFFLFlBQU07QUFDbEUsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRSxZQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekQsWUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakUsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOzs7QUFHSCxJQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLFlBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pFLFlBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDckQsWUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakUsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyx3REFBd0QsRUFBRSxZQUFNO0FBQ2pFLG1CQUFlLG1CQUFDLGFBQVk7QUFDMUIsWUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakUsWUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JELFlBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xFLEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWZpbGUtdHJlZS9zcGVjL21haW4tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmRlc2NyaWJlKCdtYWluJywgKCkgPT4ge1xuICAvLyBUT0RPOiBMb2FkaW5nIHBhY2thZ2VzIGlzIHJpZ2h0ZnVsbHkgc2xvdzsgaXQgYHJlcXVpcmVgcyBhIGxvdCBvZiBmaWxlcy4gUG9zc2libGUgdG8gaW5qZWN0XG4gIC8vIHRoZSBgYWN0aXZhdGlvbmAgY2xhc3Mgb3IgbW92ZSBpdCB0byBpdHMgb3duIHBhY2thZ2UgdG8gbW9jayBgcmVxdWlyZWAgaXQ/XG4gIGl0KFwiZGlzYWJsZXMgQXRvbSdzIGJ1aWx0aW4gdHJlZS12aWV3IHBhY2thZ2Ugb24gYWN0aXZhdGlvblwiLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKCd0cmVlLXZpZXcnKSkudG9CZShmYWxzZSk7XG4gICAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbnVjbGlkZS1maWxlLXRyZWUnKTtcbiAgICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKCd0cmVlLXZpZXcnKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gQ2xvc2luZyBhbiBBdG9tIHdpbmRvdyBjYWxscyBgZGVhY3RpdmF0ZWAgb24gbG9hZGVkIHBhY2thZ2VzLlxuICBpdChcImtlZXBzIEF0b20ncyBidWlsdGluIHRyZWUtdmlldyBwYWNrYWdlIGRpc2FibGVkIG9uIGRlYWN0aXZhdGlvblwiLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZURpc2FibGVkKCd0cmVlLXZpZXcnKSkudG9CZShmYWxzZSk7XG4gICAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbnVjbGlkZS1maWxlLXRyZWUnKTtcbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ251Y2xpZGUtZmlsZS10cmVlJyk7XG4gICAgICBleHBlY3QoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VEaXNhYmxlZCgndHJlZS12aWV3JykpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwicmUtZW5hYmxlcyBBdG9tJ3MgYnVpbHRpbiB0cmVlLXZpZXcgcGFja2FnZSBvbiBkaXNhYmxlXCIsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlRGlzYWJsZWQoJ3RyZWUtdmlldycpKS50b0JlKGZhbHNlKTtcbiAgICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdudWNsaWRlLWZpbGUtdHJlZScpO1xuICAgICAgYXRvbS5wYWNrYWdlcy5kaXNhYmxlUGFja2FnZSgnbnVjbGlkZS1maWxlLXRyZWUnKTtcbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ251Y2xpZGUtZmlsZS10cmVlJyk7XG4gICAgICBleHBlY3QoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VEaXNhYmxlZCgndHJlZS12aWV3JykpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-file-tree/spec/main-spec.js
