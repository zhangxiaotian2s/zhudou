'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _require = require('atom');

var Range = _require.Range;

var _require2 = require('../lib/paneUtils');

var compareMessagesByFile = _require2.compareMessagesByFile;

describe('compareMessagesByFile', function () {

  var fileAMsgA = undefined;
  var fileAMsgB = undefined;
  var fileBMsgA = undefined;

  beforeEach(function () {
    fileAMsgA = {
      filePath: '/foo/bar/baz.html',
      providerName: 'foo',
      range: new Range([0, 0], [1, 0]),
      scope: 'file',
      type: 'Warning'
    };
    fileAMsgB = {
      filePath: '/foo/bar/baz.html',
      providerName: 'foo',
      range: new Range([5, 0], [6, 0]),
      scope: 'file',
      type: 'Warning'
    };
    fileBMsgA = {
      filePath: '/foo/bar/xyz.html',
      providerName: 'foo',
      range: new Range([3, 0], [4, 0]),
      scope: 'file',
      type: 'Warning'
    };
  });

  it('sorts messages based on file path', function () {
    var msgs = [fileBMsgA, fileAMsgA];
    expect(msgs.sort(compareMessagesByFile)).toEqual([fileAMsgA, fileBMsgA]);
  });

  it('sorts messages within a file based on line number', function () {
    var msgs = [fileAMsgB, fileAMsgA];
    expect(msgs.sort(compareMessagesByFile)).toEqual([fileAMsgA, fileAMsgB]);
  });

  it('sorts messages based on file path && by line number', function () {
    var msgs = [fileAMsgB, fileBMsgA, fileAMsgA];
    expect(msgs.sort(compareMessagesByFile)).toEqual([fileAMsgA, fileAMsgB, fileBMsgA]);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlhZ25vc3RpY3MtdWkvc3BlYy9wYW5lVXRpbHMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7ZUFXSSxPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF4QixLQUFLLFlBQUwsS0FBSzs7Z0JBRW9CLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBcEQscUJBQXFCLGFBQXJCLHFCQUFxQjs7QUFFNUIsUUFBUSxDQUFDLHVCQUF1QixFQUFFLFlBQU07O0FBRXRDLE1BQUksU0FBZ0MsWUFBQSxDQUFDO0FBQ3JDLE1BQUksU0FBZ0MsWUFBQSxDQUFDO0FBQ3JDLE1BQUksU0FBZ0MsWUFBQSxDQUFDOztBQUVyQyxZQUFVLENBQUMsWUFBTTtBQUNmLGFBQVMsR0FBRztBQUNWLGNBQVEsRUFBRSxtQkFBbUI7QUFDN0Isa0JBQVksRUFBRSxLQUFLO0FBQ25CLFdBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxXQUFLLEVBQUUsTUFBTTtBQUNiLFVBQUksRUFBRSxTQUFTO0tBQ2hCLENBQUM7QUFDRixhQUFTLEdBQUc7QUFDVixjQUFRLEVBQUUsbUJBQW1CO0FBQzdCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixXQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsV0FBSyxFQUFFLE1BQU07QUFDYixVQUFJLEVBQUUsU0FBUztLQUNoQixDQUFDO0FBQ0YsYUFBUyxHQUFHO0FBQ1YsY0FBUSxFQUFFLG1CQUFtQjtBQUM3QixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsV0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFdBQUssRUFBRSxNQUFNO0FBQ2IsVUFBSSxFQUFFLFNBQVM7S0FDaEIsQ0FBQztHQUNILENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsbUNBQW1DLEVBQUUsWUFBTTtBQUM1QyxRQUFNLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwQyxVQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7R0FDMUUsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxtREFBbUQsRUFBRSxZQUFNO0FBQzVELFFBQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLFVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztHQUMxRSxDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLHFEQUFxRCxFQUFFLFlBQU07QUFDOUQsUUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLFVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7R0FDckYsQ0FBQyxDQUFDO0NBRUosQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlhZ25vc3RpY3MtdWkvc3BlYy9wYW5lVXRpbHMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IHtSYW5nZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5cbmNvbnN0IHtjb21wYXJlTWVzc2FnZXNCeUZpbGV9ID0gcmVxdWlyZSgnLi4vbGliL3BhbmVVdGlscycpO1xuXG5kZXNjcmliZSgnY29tcGFyZU1lc3NhZ2VzQnlGaWxlJywgKCkgPT4ge1xuXG4gIGxldCBmaWxlQU1zZ0E6IEZpbGVEaWFnbm9zdGljTWVzc2FnZTtcbiAgbGV0IGZpbGVBTXNnQjogRmlsZURpYWdub3N0aWNNZXNzYWdlO1xuICBsZXQgZmlsZUJNc2dBOiBGaWxlRGlhZ25vc3RpY01lc3NhZ2U7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZmlsZUFNc2dBID0ge1xuICAgICAgZmlsZVBhdGg6ICcvZm9vL2Jhci9iYXouaHRtbCcsXG4gICAgICBwcm92aWRlck5hbWU6ICdmb28nLFxuICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbMCwgMF0sIFsxLCAwXSksXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgdHlwZTogJ1dhcm5pbmcnLFxuICAgIH07XG4gICAgZmlsZUFNc2dCID0ge1xuICAgICAgZmlsZVBhdGg6ICcvZm9vL2Jhci9iYXouaHRtbCcsXG4gICAgICBwcm92aWRlck5hbWU6ICdmb28nLFxuICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbNSwgMF0sIFs2LCAwXSksXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgdHlwZTogJ1dhcm5pbmcnLFxuICAgIH07XG4gICAgZmlsZUJNc2dBID0ge1xuICAgICAgZmlsZVBhdGg6ICcvZm9vL2Jhci94eXouaHRtbCcsXG4gICAgICBwcm92aWRlck5hbWU6ICdmb28nLFxuICAgICAgcmFuZ2U6IG5ldyBSYW5nZShbMywgMF0sIFs0LCAwXSksXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgdHlwZTogJ1dhcm5pbmcnLFxuICAgIH07XG4gIH0pO1xuXG4gIGl0KCdzb3J0cyBtZXNzYWdlcyBiYXNlZCBvbiBmaWxlIHBhdGgnLCAoKSA9PiB7XG4gICAgY29uc3QgbXNncyA9IFtmaWxlQk1zZ0EsIGZpbGVBTXNnQV07XG4gICAgZXhwZWN0KG1zZ3Muc29ydChjb21wYXJlTWVzc2FnZXNCeUZpbGUpKS50b0VxdWFsKFtmaWxlQU1zZ0EsIGZpbGVCTXNnQV0pO1xuICB9KTtcblxuICBpdCgnc29ydHMgbWVzc2FnZXMgd2l0aGluIGEgZmlsZSBiYXNlZCBvbiBsaW5lIG51bWJlcicsICgpID0+IHtcbiAgICBjb25zdCBtc2dzID0gW2ZpbGVBTXNnQiwgZmlsZUFNc2dBXTtcbiAgICBleHBlY3QobXNncy5zb3J0KGNvbXBhcmVNZXNzYWdlc0J5RmlsZSkpLnRvRXF1YWwoW2ZpbGVBTXNnQSwgZmlsZUFNc2dCXSk7XG4gIH0pO1xuXG4gIGl0KCdzb3J0cyBtZXNzYWdlcyBiYXNlZCBvbiBmaWxlIHBhdGggJiYgYnkgbGluZSBudW1iZXInLCAoKSA9PiB7XG4gICAgY29uc3QgbXNncyA9IFtmaWxlQU1zZ0IsIGZpbGVCTXNnQSwgZmlsZUFNc2dBXTtcbiAgICBleHBlY3QobXNncy5zb3J0KGNvbXBhcmVNZXNzYWdlc0J5RmlsZSkpLnRvRXF1YWwoW2ZpbGVBTXNnQSwgZmlsZUFNc2dCLCBmaWxlQk1zZ0FdKTtcbiAgfSk7XG5cbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-diagnostics-ui/spec/paneUtils-spec.js
