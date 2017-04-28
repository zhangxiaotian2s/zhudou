'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var BASE_ITEM_URI = 'nuclide-home://';
var CONFIG_KEY = 'nuclide-home.showHome';

function findHomePaneAndItem() {
  var pane = atom.workspace.paneForURI(BASE_ITEM_URI);
  var item = pane ? pane.itemForURI(BASE_ITEM_URI) : null;
  return { pane: pane, item: item };
}

describe('Home', function () {

  beforeEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      jasmine.unspy(window, 'setTimeout');
      yield atom.packages.activatePackage('nuclide-home');
    }));
  });

  it('does not appear by default', function () {
    expect(findHomePaneAndItem().item).toBeTruthy();
  });

  it('appears when opened by URI, persisting into config', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      yield atom.workspace.open(BASE_ITEM_URI);

      var _findHomePaneAndItem = findHomePaneAndItem();

      var item = _findHomePaneAndItem.item;

      expect(item).toBeTruthy();
      if (item) {
        expect(item.getTitle()).toEqual('Home');
        expect(item.innerHTML).toContain('Welcome to Nuclide');
        expect(atom.config.get(CONFIG_KEY)).toBeTruthy();
      }
    }));
  });

  it('disappears when closed, persisting into config', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      yield atom.workspace.open(BASE_ITEM_URI);

      var _findHomePaneAndItem2 = findHomePaneAndItem();

      var pane = _findHomePaneAndItem2.pane;
      var item = _findHomePaneAndItem2.item;

      expect(item).toBeTruthy();
      if (pane && item) {
        pane.activateItem(item);
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'core:close');
        expect(findHomePaneAndItem().item).toBeFalsy();
        expect(atom.config.get(CONFIG_KEY)).toBeFalsy();
      }
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtaG9tZS9zcGVjL2hvbWUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztBQVdaLElBQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDO0FBQ3hDLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDOztBQUUzQyxTQUFTLG1CQUFtQixHQUFzQztBQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUQsU0FBTyxFQUFDLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDO0NBQ3JCOztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUUsWUFBTTs7QUFFckIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLGFBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFlBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDckQsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ3JDLFVBQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ2pELENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBTTtBQUM3RCxtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLFlBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7O2lDQUMxQixtQkFBbUIsRUFBRTs7VUFBN0IsSUFBSSx3QkFBSixJQUFJOztBQUNYLFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMxQixVQUFJLElBQUksRUFBRTtBQUNSLGNBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEMsY0FBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2RCxjQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztPQUNsRDtLQUNGLEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0RBQWdELEVBQUUsWUFBTTtBQUN6RCxtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLFlBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7O2tDQUNwQixtQkFBbUIsRUFBRTs7VUFBbkMsSUFBSSx5QkFBSixJQUFJO1VBQUUsSUFBSSx5QkFBSixJQUFJOztBQUNqQixZQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDMUIsVUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3pFLGNBQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQy9DLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO09BQ2pEO0tBQ0YsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBRUosQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtaG9tZS9zcGVjL2hvbWUtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IEJBU0VfSVRFTV9VUkkgPSAnbnVjbGlkZS1ob21lOi8vJztcbmNvbnN0IENPTkZJR19LRVkgPSAnbnVjbGlkZS1ob21lLnNob3dIb21lJztcblxuZnVuY3Rpb24gZmluZEhvbWVQYW5lQW5kSXRlbSgpOiB7cGFuZTogP2F0b20kUGFuZSwgaXRlbTogP09iamVjdH0ge1xuICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShCQVNFX0lURU1fVVJJKTtcbiAgY29uc3QgaXRlbSA9IHBhbmUgPyBwYW5lLml0ZW1Gb3JVUkkoQkFTRV9JVEVNX1VSSSkgOiBudWxsO1xuICByZXR1cm4ge3BhbmUsIGl0ZW19O1xufVxuXG5kZXNjcmliZSgnSG9tZScsICgpID0+IHtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgamFzbWluZS51bnNweSh3aW5kb3csICdzZXRUaW1lb3V0Jyk7XG4gICAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbnVjbGlkZS1ob21lJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdkb2VzIG5vdCBhcHBlYXIgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICBleHBlY3QoZmluZEhvbWVQYW5lQW5kSXRlbSgpLml0ZW0pLnRvQmVUcnV0aHkoKTtcbiAgfSk7XG5cbiAgaXQoJ2FwcGVhcnMgd2hlbiBvcGVuZWQgYnkgVVJJLCBwZXJzaXN0aW5nIGludG8gY29uZmlnJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKEJBU0VfSVRFTV9VUkkpO1xuICAgICAgY29uc3Qge2l0ZW19ID0gZmluZEhvbWVQYW5lQW5kSXRlbSgpO1xuICAgICAgZXhwZWN0KGl0ZW0pLnRvQmVUcnV0aHkoKTtcbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGV4cGVjdChpdGVtLmdldFRpdGxlKCkpLnRvRXF1YWwoJ0hvbWUnKTtcbiAgICAgICAgZXhwZWN0KGl0ZW0uaW5uZXJIVE1MKS50b0NvbnRhaW4oJ1dlbGNvbWUgdG8gTnVjbGlkZScpO1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KENPTkZJR19LRVkpKS50b0JlVHJ1dGh5KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdkaXNhcHBlYXJzIHdoZW4gY2xvc2VkLCBwZXJzaXN0aW5nIGludG8gY29uZmlnJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKEJBU0VfSVRFTV9VUkkpO1xuICAgICAgY29uc3Qge3BhbmUsIGl0ZW19ID0gZmluZEhvbWVQYW5lQW5kSXRlbSgpO1xuICAgICAgZXhwZWN0KGl0ZW0pLnRvQmVUcnV0aHkoKTtcbiAgICAgIGlmIChwYW5lICYmIGl0ZW0pIHtcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2NvcmU6Y2xvc2UnKTtcbiAgICAgICAgZXhwZWN0KGZpbmRIb21lUGFuZUFuZEl0ZW0oKS5pdGVtKS50b0JlRmFsc3koKTtcbiAgICAgICAgZXhwZWN0KGF0b20uY29uZmlnLmdldChDT05GSUdfS0VZKSkudG9CZUZhbHN5KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-home/spec/home-spec.js
