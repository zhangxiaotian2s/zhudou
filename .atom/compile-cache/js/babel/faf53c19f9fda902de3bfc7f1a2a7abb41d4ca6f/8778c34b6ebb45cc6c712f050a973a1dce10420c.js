'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var BreakpointManager = require('../lib/BreakpointManager.js');
var BreakpointStore = require('../lib/BreakpointStore.js');

var _require = require('./utils');

var hasBreakpointDecorationInRow = _require.hasBreakpointDecorationInRow;

var utils = require('./utils');

describe('BreakpointManager', function () {
  var breakpointManager = undefined;
  var breakpointStore = undefined;

  beforeEach(function () {
    breakpointStore = new BreakpointStore();
    breakpointManager = new BreakpointManager(breakpointStore);
  });

  it('should display existing breakpoints in editor when it is opened', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var path = utils.getUniquePath();
      breakpointStore.addBreakpoint(path, 0);
      var editor = yield atom.workspace.open(path);
      expect(hasBreakpointDecorationInRow(editor, 0)).toBe(true);
    }));
  });

  it('should clean up breakpoint display for an editor when the editor is closed', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var uniqueEditor = yield utils.createEditorWithUniquePath();
      var path = uniqueEditor.getPath();
      breakpointStore.addBreakpoint(path, 1);
      var editor = yield atom.workspace.open(path);
      expect(hasBreakpointDecorationInRow(editor, 0)).toBe(true);
      expect(breakpointManager.getDisplayControllers().size).toBe(1);

      atom.workspace.paneForItem(editor).destroyItem(editor);
      expect(breakpointManager.getDisplayControllers().size).toBe(0);

      // But the store should still remember the breakpoint
      expect(breakpointStore.getBreakpointsForPath(path)).toEqual(new Set([1]));
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGVidWdnZXItYXRvbS9zcGVjL0JyZWFrcG9pbnRNYW5hZ2VyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7QUFXWixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2pFLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztlQUN0QixPQUFPLENBQUMsU0FBUyxDQUFDOztJQUFsRCw0QkFBNEIsWUFBNUIsNEJBQTRCOztBQUNuQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxZQUFNO0FBQ2xDLE1BQUksaUJBQWlCLFlBQUEsQ0FBQztBQUN0QixNQUFJLGVBQWUsWUFBQSxDQUFDOztBQUVwQixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQUN4QyxxQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzVELENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLFVBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNuQyxxQkFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkMsVUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxZQUFNLENBQUMsNEJBQTRCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVELEVBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsNEVBQTRFLEVBQUUsWUFBTTtBQUNyRixtQkFBZSxtQkFBQyxhQUFZO0FBQzFCLFVBQU0sWUFBWSxHQUFHLE1BQU0sS0FBSyxDQUFDLDBCQUEwQixFQUFFLENBQUM7QUFDOUQsVUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLHFCQUFlLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxVQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFlBQU0sQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0QsWUFBTSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsWUFBTSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHL0QsWUFBTSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzRSxFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1kZWJ1Z2dlci1hdG9tL3NwZWMvQnJlYWtwb2ludE1hbmFnZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IEJyZWFrcG9pbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vbGliL0JyZWFrcG9pbnRNYW5hZ2VyLmpzJyk7XG5jb25zdCBCcmVha3BvaW50U3RvcmUgPSByZXF1aXJlKCcuLi9saWIvQnJlYWtwb2ludFN0b3JlLmpzJyk7XG5jb25zdCB7aGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvd30gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZGVzY3JpYmUoJ0JyZWFrcG9pbnRNYW5hZ2VyJywgKCkgPT4ge1xuICBsZXQgYnJlYWtwb2ludE1hbmFnZXI7XG4gIGxldCBicmVha3BvaW50U3RvcmU7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYnJlYWtwb2ludFN0b3JlID0gbmV3IEJyZWFrcG9pbnRTdG9yZSgpO1xuICAgIGJyZWFrcG9pbnRNYW5hZ2VyID0gbmV3IEJyZWFrcG9pbnRNYW5hZ2VyKGJyZWFrcG9pbnRTdG9yZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZGlzcGxheSBleGlzdGluZyBicmVha3BvaW50cyBpbiBlZGl0b3Igd2hlbiBpdCBpcyBvcGVuZWQnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSB1dGlscy5nZXRVbmlxdWVQYXRoKCk7XG4gICAgICBicmVha3BvaW50U3RvcmUuYWRkQnJlYWtwb2ludChwYXRoLCAwKTtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aCk7XG4gICAgICBleHBlY3QoaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDApKS50b0JlKHRydWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNsZWFuIHVwIGJyZWFrcG9pbnQgZGlzcGxheSBmb3IgYW4gZWRpdG9yIHdoZW4gdGhlIGVkaXRvciBpcyBjbG9zZWQnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVuaXF1ZUVkaXRvciA9IGF3YWl0IHV0aWxzLmNyZWF0ZUVkaXRvcldpdGhVbmlxdWVQYXRoKCk7XG4gICAgICBjb25zdCBwYXRoID0gdW5pcXVlRWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGJyZWFrcG9pbnRTdG9yZS5hZGRCcmVha3BvaW50KHBhdGgsIDEpO1xuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoKTtcbiAgICAgIGV4cGVjdChoYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMCkpLnRvQmUodHJ1ZSk7XG4gICAgICBleHBlY3QoYnJlYWtwb2ludE1hbmFnZXIuZ2V0RGlzcGxheUNvbnRyb2xsZXJzKCkuc2l6ZSkudG9CZSgxKTtcblxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yKS5kZXN0cm95SXRlbShlZGl0b3IpO1xuICAgICAgZXhwZWN0KGJyZWFrcG9pbnRNYW5hZ2VyLmdldERpc3BsYXlDb250cm9sbGVycygpLnNpemUpLnRvQmUoMCk7XG5cbiAgICAgIC8vIEJ1dCB0aGUgc3RvcmUgc2hvdWxkIHN0aWxsIHJlbWVtYmVyIHRoZSBicmVha3BvaW50XG4gICAgICBleHBlY3QoYnJlYWtwb2ludFN0b3JlLmdldEJyZWFrcG9pbnRzRm9yUGF0aChwYXRoKSkudG9FcXVhbChuZXcgU2V0KFsxXSkpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-debugger-atom/spec/BreakpointManager-spec.js
