'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var BASE_ITEM_URI = 'nuclide-health://';

function findHealthPaneAndItem() {
  var pane = atom.workspace.paneForURI(BASE_ITEM_URI);
  var item = pane ? pane.itemForURI(BASE_ITEM_URI) : null;
  return { pane: pane, item: item };
}

function sleep(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}

describe('Health', function () {

  beforeEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      jasmine.unspy(window, 'setTimeout');
      yield atom.packages.activatePackage('nuclide-health');
    }));
  });

  it('appears when opened by URI and contains stats after its first refresh', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      yield atom.workspace.open(BASE_ITEM_URI);

      var _findHealthPaneAndItem = findHealthPaneAndItem();

      var item = _findHealthPaneAndItem.item;

      expect(item).toBeTruthy();
      if (item) {
        expect(item.getTitle()).toEqual('Health');
        var interval = atom.config.get('nuclide-health.viewTimeout');
        expect(typeof interval).toEqual('number');

        if (typeof interval === 'number') {
          // Flow considers atom config items to be mixed.
          yield sleep((interval + 1) * 1000);
          // An extra second should be enough for this test not to be flakey.
          expect(item.innerHTML).toContain('Stats');
          expect(item.innerHTML).toContain('CPU');
          expect(item.innerHTML).toContain('Heap');
          expect(item.innerHTML).toContain('Memory');
          expect(item.innerHTML).toContain('Key latency');
          expect(item.innerHTML).toContain('Handles');
          expect(item.innerHTML).toContain('Event loop');
        }
      }
    }));
  });

  it('disappears when closed', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      yield atom.workspace.open(BASE_ITEM_URI);

      var _findHealthPaneAndItem2 = findHealthPaneAndItem();

      var pane = _findHealthPaneAndItem2.pane;
      var item = _findHealthPaneAndItem2.item;

      expect(item).toBeTruthy();
      if (pane && item) {
        pane.activateItem(item);
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'core:close');
        expect(findHealthPaneAndItem().item).toBeFalsy();
      }
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtaGVhbHRoL3NwZWMvaGVhbHRoLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7QUFXWixJQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQzs7QUFFMUMsU0FBUyxxQkFBcUIsR0FBc0M7QUFDbEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFELFNBQU8sRUFBQyxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUMsQ0FBQztDQUNyQjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFVLEVBQVc7QUFDbEMsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsY0FBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztHQUN6QixDQUFDLENBQUM7Q0FDSjs7QUFFRCxRQUFRLENBQUMsUUFBUSxFQUFFLFlBQU07O0FBRXZCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixhQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwQyxZQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDdkQsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyx1RUFBdUUsRUFBRSxZQUFNO0FBQ2hGLG1CQUFlLG1CQUFDLGFBQVk7QUFDMUIsWUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7bUNBQzFCLHFCQUFxQixFQUFFOztVQUEvQixJQUFJLDBCQUFKLElBQUk7O0FBQ1gsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCLFVBQUksSUFBSSxFQUFFO0FBQ1IsY0FBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQy9ELGNBQU0sQ0FBQyxPQUFPLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFMUMsWUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7O0FBRWhDLGdCQUFNLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsQ0FBQzs7QUFFbkMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLGdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxnQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLGdCQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoRCxnQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2hEO09BQ0Y7S0FDRixFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLHdCQUF3QixFQUFFLFlBQU07QUFDakMsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixZQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztvQ0FDcEIscUJBQXFCLEVBQUU7O1VBQXJDLElBQUksMkJBQUosSUFBSTtVQUFFLElBQUksMkJBQUosSUFBSTs7QUFDakIsWUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCLFVBQUksSUFBSSxJQUFJLElBQUksRUFBRTtBQUNoQixZQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN6RSxjQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztPQUNsRDtLQUNGLEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWhlYWx0aC9zcGVjL2hlYWx0aC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3QgQkFTRV9JVEVNX1VSSSA9ICdudWNsaWRlLWhlYWx0aDovLyc7XG5cbmZ1bmN0aW9uIGZpbmRIZWFsdGhQYW5lQW5kSXRlbSgpOiB7cGFuZTogP2F0b20kUGFuZSwgaXRlbTogP09iamVjdH0ge1xuICBjb25zdCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShCQVNFX0lURU1fVVJJKTtcbiAgY29uc3QgaXRlbSA9IHBhbmUgPyBwYW5lLml0ZW1Gb3JVUkkoQkFTRV9JVEVNX1VSSSkgOiBudWxsO1xuICByZXR1cm4ge3BhbmUsIGl0ZW19O1xufVxuXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufVxuXG5kZXNjcmliZSgnSGVhbHRoJywgKCkgPT4ge1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcbiAgICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdudWNsaWRlLWhlYWx0aCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnYXBwZWFycyB3aGVuIG9wZW5lZCBieSBVUkkgYW5kIGNvbnRhaW5zIHN0YXRzIGFmdGVyIGl0cyBmaXJzdCByZWZyZXNoJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKEJBU0VfSVRFTV9VUkkpO1xuICAgICAgY29uc3Qge2l0ZW19ID0gZmluZEhlYWx0aFBhbmVBbmRJdGVtKCk7XG4gICAgICBleHBlY3QoaXRlbSkudG9CZVRydXRoeSgpO1xuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgZXhwZWN0KGl0ZW0uZ2V0VGl0bGUoKSkudG9FcXVhbCgnSGVhbHRoJyk7XG4gICAgICAgIGNvbnN0IGludGVydmFsID0gYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWhlYWx0aC52aWV3VGltZW91dCcpO1xuICAgICAgICBleHBlY3QodHlwZW9mIGludGVydmFsKS50b0VxdWFsKCdudW1iZXInKTtcblxuICAgICAgICBpZiAodHlwZW9mIGludGVydmFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIC8vIEZsb3cgY29uc2lkZXJzIGF0b20gY29uZmlnIGl0ZW1zIHRvIGJlIG1peGVkLlxuICAgICAgICAgIGF3YWl0IHNsZWVwKChpbnRlcnZhbCArIDEpICogMTAwMCk7XG4gICAgICAgICAgLy8gQW4gZXh0cmEgc2Vjb25kIHNob3VsZCBiZSBlbm91Z2ggZm9yIHRoaXMgdGVzdCBub3QgdG8gYmUgZmxha2V5LlxuICAgICAgICAgIGV4cGVjdChpdGVtLmlubmVySFRNTCkudG9Db250YWluKCdTdGF0cycpO1xuICAgICAgICAgIGV4cGVjdChpdGVtLmlubmVySFRNTCkudG9Db250YWluKCdDUFUnKTtcbiAgICAgICAgICBleHBlY3QoaXRlbS5pbm5lckhUTUwpLnRvQ29udGFpbignSGVhcCcpO1xuICAgICAgICAgIGV4cGVjdChpdGVtLmlubmVySFRNTCkudG9Db250YWluKCdNZW1vcnknKTtcbiAgICAgICAgICBleHBlY3QoaXRlbS5pbm5lckhUTUwpLnRvQ29udGFpbignS2V5IGxhdGVuY3knKTtcbiAgICAgICAgICBleHBlY3QoaXRlbS5pbm5lckhUTUwpLnRvQ29udGFpbignSGFuZGxlcycpO1xuICAgICAgICAgIGV4cGVjdChpdGVtLmlubmVySFRNTCkudG9Db250YWluKCdFdmVudCBsb29wJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2Rpc2FwcGVhcnMgd2hlbiBjbG9zZWQnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oQkFTRV9JVEVNX1VSSSk7XG4gICAgICBjb25zdCB7cGFuZSwgaXRlbX0gPSBmaW5kSGVhbHRoUGFuZUFuZEl0ZW0oKTtcbiAgICAgIGV4cGVjdChpdGVtKS50b0JlVHJ1dGh5KCk7XG4gICAgICBpZiAocGFuZSAmJiBpdGVtKSB7XG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0pO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdjb3JlOmNsb3NlJyk7XG4gICAgICAgIGV4cGVjdChmaW5kSGVhbHRoUGFuZUFuZEl0ZW0oKS5pdGVtKS50b0JlRmFsc3koKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-health/spec/health-spec.js
