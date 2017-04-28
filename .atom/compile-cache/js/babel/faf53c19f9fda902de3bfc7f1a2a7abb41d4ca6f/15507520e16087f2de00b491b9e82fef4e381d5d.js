'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var NuclideTextBuffer = require('../lib/NuclideTextBuffer');

var _require = require('nuclide-remote-connection');

var RemoteFile = _require.RemoteFile;
var RemoteConnection = _require.RemoteConnection;

describe('NuclideTextBuffer', function () {

  var buffer = null;
  var connection = null;
  var filePath = __filename;

  beforeEach(function () {
    connection = new RemoteConnection({});
    connection._config = { host: 'most.fb.com', port: 9090 };
    // Mock watcher service handlers registry.
    connection._addHandlersForEntry = function () {};
    buffer = new NuclideTextBuffer(connection, {});
    // Disable file watch subscriptions, not needed here.
    buffer.subscribeToFile = function () {};
  });

  afterEach(function () {
    buffer = null;
    connection = null;
  });

  it('setPath creates a connection file', function () {
    buffer.setPath(filePath);
    expect(buffer.file instanceof RemoteFile).toBe(true);
    expect(buffer.file.getPath()).toBe('nuclide://most.fb.com:9090' + __filename);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcmVtb3RlLXByb2plY3RzL3NwZWMvTnVjbGlkZVRleHRCdWZmZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFXWixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztlQUN2QixPQUFPLENBQUMsMkJBQTJCLENBQUM7O0lBQXBFLFVBQVUsWUFBVixVQUFVO0lBQUUsZ0JBQWdCLFlBQWhCLGdCQUFnQjs7QUFFbkMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07O0FBRWxDLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDOztBQUU1QixZQUFVLENBQUMsWUFBTTtBQUNmLGNBQVUsR0FBRyxJQUFJLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLGNBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQyxJQUFJLEVBQUMsQ0FBQzs7QUFFdEQsY0FBVSxDQUFDLG9CQUFvQixHQUFHLFlBQU0sRUFBRSxDQUFDO0FBQzNDLFVBQU0sR0FBRyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFL0MsVUFBTSxDQUFDLGVBQWUsR0FBRyxZQUFNLEVBQUUsQ0FBQztHQUNuQyxDQUFDLENBQUM7O0FBRUgsV0FBUyxDQUFDLFlBQU07QUFDZCxVQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2QsY0FBVSxHQUFHLElBQUksQ0FBQztHQUNuQixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLG1DQUFtQyxFQUFFLFlBQU07QUFDNUMsVUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6QixVQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsVUFBVSxDQUFDLENBQUM7R0FDL0UsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcmVtb3RlLXByb2plY3RzL3NwZWMvTnVjbGlkZVRleHRCdWZmZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IE51Y2xpZGVUZXh0QnVmZmVyID0gcmVxdWlyZSgnLi4vbGliL051Y2xpZGVUZXh0QnVmZmVyJyk7XG5jb25zdCB7UmVtb3RlRmlsZSwgUmVtb3RlQ29ubmVjdGlvbn0gPSByZXF1aXJlKCdudWNsaWRlLXJlbW90ZS1jb25uZWN0aW9uJyk7XG5cbmRlc2NyaWJlKCdOdWNsaWRlVGV4dEJ1ZmZlcicsICgpID0+IHtcblxuICBsZXQgYnVmZmVyID0gbnVsbDtcbiAgbGV0IGNvbm5lY3Rpb24gPSBudWxsO1xuICBjb25zdCBmaWxlUGF0aCA9IF9fZmlsZW5hbWU7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgY29ubmVjdGlvbiA9IG5ldyBSZW1vdGVDb25uZWN0aW9uKHt9KTtcbiAgICBjb25uZWN0aW9uLl9jb25maWcgPSB7aG9zdDogJ21vc3QuZmIuY29tJywgcG9ydDo5MDkwfTtcbiAgICAvLyBNb2NrIHdhdGNoZXIgc2VydmljZSBoYW5kbGVycyByZWdpc3RyeS5cbiAgICBjb25uZWN0aW9uLl9hZGRIYW5kbGVyc0ZvckVudHJ5ID0gKCkgPT4ge307XG4gICAgYnVmZmVyID0gbmV3IE51Y2xpZGVUZXh0QnVmZmVyKGNvbm5lY3Rpb24sIHt9KTtcbiAgICAvLyBEaXNhYmxlIGZpbGUgd2F0Y2ggc3Vic2NyaXB0aW9ucywgbm90IG5lZWRlZCBoZXJlLlxuICAgIGJ1ZmZlci5zdWJzY3JpYmVUb0ZpbGUgPSAoKSA9PiB7fTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBidWZmZXIgPSBudWxsO1xuICAgIGNvbm5lY3Rpb24gPSBudWxsO1xuICB9KTtcblxuICBpdCgnc2V0UGF0aCBjcmVhdGVzIGEgY29ubmVjdGlvbiBmaWxlJywgKCkgPT4ge1xuICAgIGJ1ZmZlci5zZXRQYXRoKGZpbGVQYXRoKTtcbiAgICBleHBlY3QoYnVmZmVyLmZpbGUgaW5zdGFuY2VvZiBSZW1vdGVGaWxlKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChidWZmZXIuZmlsZS5nZXRQYXRoKCkpLnRvQmUoJ251Y2xpZGU6Ly9tb3N0LmZiLmNvbTo5MDkwJyArIF9fZmlsZW5hbWUpO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-remote-projects/spec/NuclideTextBuffer-spec.js
