function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideBusySignalProviderBase = require('nuclide-busy-signal-provider-base');

var _libArcanistDiagnosticsProvider = require('../lib/ArcanistDiagnosticsProvider');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _temp = require('temp');

'use babel';

var temp = (0, _temp.track)();

describe('ArcanistDiagnosticsProvider', function () {
  var provider = undefined;
  var tempFile = undefined;

  beforeEach(function () {
    var folder = temp.mkdirSync();
    tempFile = _path2['default'].join(folder, 'test');
    _fs2['default'].writeFileSync(tempFile, /* data */'');
    provider = new _libArcanistDiagnosticsProvider.ArcanistDiagnosticsProvider(new _nuclideBusySignalProviderBase.BusySignalProviderBase());
  });

  it('should invalidate the messages when a file is closed', function () {
    spyOn(provider._providerBase, 'publishMessageInvalidation');
    waitsForPromise(_asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(tempFile);

      // The editor path may get changed (empiracally, prefixed with 'private/'),
      // so we 'getPath()' here.
      var filePath = editor.getPath();

      // We have to destroy panes themselves, not merely the pane items, in order
      // to trigger the callbacks that ArcanistDiagnosticsProvider registers on
      // atom.workspace.onWillDestroyPaneItem.
      var theOnlyPane = atom.workspace.getPanes()[0];
      theOnlyPane.destroy();

      expect(provider._providerBase.publishMessageInvalidation).toHaveBeenCalledWith({
        scope: 'file',
        filePaths: [filePath]
      });
    }));
  });

  it('should not invalidate the messages when there are multiple buffers with the file', function () {
    spyOn(provider._providerBase, 'publishMessageInvalidation');
    waitsForPromise(_asyncToGenerator(function* () {
      yield atom.workspace.open(tempFile);
      // Open a second pane, containing a second editor with the same file.
      var paneToSplit = atom.workspace.getPanes()[0];
      paneToSplit.splitLeft({ copyActiveItem: true });

      // We have to destroy panes themselves, not merely the pane items, in order
      // to trigger the callbacks that ArcanistDiagnosticsProvider registers on
      // atom.workspace.onWillDestroyPaneItem.
      paneToSplit.destroy();
      expect(provider._providerBase.publishMessageInvalidation).not.toHaveBeenCalled();
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtYXJjYW5pc3Qvc3BlYy9BcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7NkNBV3FDLG1DQUFtQzs7OENBQzlCLG9DQUFvQzs7a0JBQy9ELElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDSCxNQUFNOztBQWYxQixXQUFXLENBQUM7O0FBZ0JaLElBQU0sSUFBSSxHQUFHLGtCQUFPLENBQUM7O0FBRXJCLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRSxZQUFNO0FBQzVDLE1BQUksUUFBYSxZQUFBLENBQUM7QUFDbEIsTUFBSSxRQUFpQixZQUFBLENBQUM7O0FBRXRCLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFlBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLG9CQUFHLGFBQWEsQ0FBQyxRQUFRLFlBQWEsRUFBRSxDQUFDLENBQUM7QUFDMUMsWUFBUSxHQUFHLGdFQUFnQywyREFBNEIsQ0FBQyxDQUFDO0dBQzFFLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsc0RBQXNELEVBQUUsWUFBTTtBQUMvRCxTQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQzVELG1CQUFlLG1CQUFDLGFBQVk7QUFDMUIsVUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7OztBQUluRCxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7Ozs7O0FBS2xDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsaUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFdEIsWUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztBQUM3RSxhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7T0FDdEIsQ0FBQyxDQUFDO0tBQ0osRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxrRkFBa0YsRUFBRSxZQUFNO0FBQzNGLFNBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLDRCQUE0QixDQUFDLENBQUM7QUFDNUQsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixZQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwQyxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELGlCQUFXLENBQUMsU0FBUyxDQUFDLEVBQUMsY0FBYyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7Ozs7O0FBSzlDLGlCQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEIsWUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUNsRixFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1hcmNhbmlzdC9zcGVjL0FyY2FuaXN0RGlhZ25vc3RpY3NQcm92aWRlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtCdXN5U2lnbmFsUHJvdmlkZXJCYXNlfSBmcm9tICdudWNsaWRlLWJ1c3ktc2lnbmFsLXByb3ZpZGVyLWJhc2UnO1xuaW1wb3J0IHtBcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXJ9IGZyb20gJy4uL2xpYi9BcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXInO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHt0cmFja30gZnJvbSAndGVtcCc7XG5jb25zdCB0ZW1wID0gdHJhY2soKTtcblxuZGVzY3JpYmUoJ0FyY2FuaXN0RGlhZ25vc3RpY3NQcm92aWRlcicsICgpID0+IHtcbiAgbGV0IHByb3ZpZGVyOiBhbnk7XG4gIGxldCB0ZW1wRmlsZSA6IHN0cmluZztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjb25zdCBmb2xkZXIgPSB0ZW1wLm1rZGlyU3luYygpO1xuICAgIHRlbXBGaWxlID0gcGF0aC5qb2luKGZvbGRlciwgJ3Rlc3QnKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRlbXBGaWxlLCAvKiBkYXRhICovICcnKTtcbiAgICBwcm92aWRlciA9IG5ldyBBcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXIobmV3IEJ1c3lTaWduYWxQcm92aWRlckJhc2UoKSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaW52YWxpZGF0ZSB0aGUgbWVzc2FnZXMgd2hlbiBhIGZpbGUgaXMgY2xvc2VkJywgKCkgPT4ge1xuICAgIHNweU9uKHByb3ZpZGVyLl9wcm92aWRlckJhc2UsICdwdWJsaXNoTWVzc2FnZUludmFsaWRhdGlvbicpO1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBGaWxlKTtcblxuICAgICAgLy8gVGhlIGVkaXRvciBwYXRoIG1heSBnZXQgY2hhbmdlZCAoZW1waXJhY2FsbHksIHByZWZpeGVkIHdpdGggJ3ByaXZhdGUvJyksXG4gICAgICAvLyBzbyB3ZSAnZ2V0UGF0aCgpJyBoZXJlLlxuICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuXG4gICAgICAvLyBXZSBoYXZlIHRvIGRlc3Ryb3kgcGFuZXMgdGhlbXNlbHZlcywgbm90IG1lcmVseSB0aGUgcGFuZSBpdGVtcywgaW4gb3JkZXJcbiAgICAgIC8vIHRvIHRyaWdnZXIgdGhlIGNhbGxiYWNrcyB0aGF0IEFyY2FuaXN0RGlhZ25vc3RpY3NQcm92aWRlciByZWdpc3RlcnMgb25cbiAgICAgIC8vIGF0b20ud29ya3NwYWNlLm9uV2lsbERlc3Ryb3lQYW5lSXRlbS5cbiAgICAgIGNvbnN0IHRoZU9ubHlQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVswXTtcbiAgICAgIHRoZU9ubHlQYW5lLmRlc3Ryb3koKTtcblxuICAgICAgZXhwZWN0KHByb3ZpZGVyLl9wcm92aWRlckJhc2UucHVibGlzaE1lc3NhZ2VJbnZhbGlkYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgZmlsZVBhdGhzOiBbZmlsZVBhdGhdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGludmFsaWRhdGUgdGhlIG1lc3NhZ2VzIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGJ1ZmZlcnMgd2l0aCB0aGUgZmlsZScsICgpID0+IHtcbiAgICBzcHlPbihwcm92aWRlci5fcHJvdmlkZXJCYXNlLCAncHVibGlzaE1lc3NhZ2VJbnZhbGlkYXRpb24nKTtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wRmlsZSk7XG4gICAgICAvLyBPcGVuIGEgc2Vjb25kIHBhbmUsIGNvbnRhaW5pbmcgYSBzZWNvbmQgZWRpdG9yIHdpdGggdGhlIHNhbWUgZmlsZS5cbiAgICAgIGNvbnN0IHBhbmVUb1NwbGl0ID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVswXTtcbiAgICAgIHBhbmVUb1NwbGl0LnNwbGl0TGVmdCh7Y29weUFjdGl2ZUl0ZW06IHRydWV9KTtcblxuICAgICAgLy8gV2UgaGF2ZSB0byBkZXN0cm95IHBhbmVzIHRoZW1zZWx2ZXMsIG5vdCBtZXJlbHkgdGhlIHBhbmUgaXRlbXMsIGluIG9yZGVyXG4gICAgICAvLyB0byB0cmlnZ2VyIHRoZSBjYWxsYmFja3MgdGhhdCBBcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXIgcmVnaXN0ZXJzIG9uXG4gICAgICAvLyBhdG9tLndvcmtzcGFjZS5vbldpbGxEZXN0cm95UGFuZUl0ZW0uXG4gICAgICBwYW5lVG9TcGxpdC5kZXN0cm95KCk7XG4gICAgICBleHBlY3QocHJvdmlkZXIuX3Byb3ZpZGVyQmFzZS5wdWJsaXNoTWVzc2FnZUludmFsaWRhdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-arcanist/spec/ArcanistDiagnosticsProvider-spec.js
