'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
var JumpToRelatedFile = require('../lib/JumpToRelatedFile');

describe('JumpToRelatedFile', function () {
  var relatedFiles = ['dir/Test.h', 'dir/Test.m', 'dir/TestInternal.h'];

  describe('@getNextRelatedFile_', function () {
    it('gets next related file at the start of the sequence', function () {
      var currentFile = 'dir/Test.h';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getNextRelatedFile(currentFile)).toEqual('dir/TestInternal.h');
    });

    it('gets next related file in the middle of the sequence', function () {
      var currentFile = 'dir/Test.m';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getNextRelatedFile(currentFile)).toEqual('dir/Test.h');
    });

    it('gets next related file at the end of the sequence', function () {
      var currentFile = 'dir/TestInternal.h';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getNextRelatedFile(currentFile)).toEqual('dir/Test.m');
    });
  });

  describe('@getPreviousRelatedFile_', function () {
    it('gets previous related file at the start of the sequence', function () {
      var currentFile = 'dir/Test.h';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getPreviousRelatedFile(currentFile)).toEqual('dir/Test.m');
    });

    it('gets previous related file in the middle of the sequence', function () {
      var currentFile = 'dir/Test.m';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getPreviousRelatedFile(currentFile)).toEqual('dir/TestInternal.h');
    });

    it('gets previous related file at the end of the sequence', function () {
      var currentFile = 'dir/TestInternal.h';

      var jumpToRelatedFile = new JumpToRelatedFile({
        find: function find() {
          return { relatedFiles: relatedFiles, index: relatedFiles.indexOf(currentFile) };
        }
      });

      expect(jumpToRelatedFile.getPreviousRelatedFile(currentFile)).toEqual('dir/Test.h');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtY2xhbmctYXRvbS9zcGVjL0p1bXBUb1JlbGF0ZWRGaWxlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7QUFVWixJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUU5RCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsWUFBTTtBQUNsQyxNQUFNLFlBQVksR0FBRyxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsb0JBQW9CLENBQUMsQ0FBQzs7QUFFeEUsVUFBUSxDQUFDLHNCQUFzQixFQUFFLFlBQU07QUFDckMsTUFBRSxDQUFDLHFEQUFxRCxFQUFFLFlBQU07QUFDOUQsVUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDOztBQUVqQyxVQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLENBQUM7QUFDOUMsWUFBSSxFQUFFO2lCQUFPLEVBQUMsWUFBWSxFQUFaLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBQztTQUFDO09BQ3ZFLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FDcEQsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxzREFBc0QsRUFBRSxZQUFNO0FBQy9ELFVBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQzs7QUFFakMsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDO0FBQzlDLFlBQUksRUFBRTtpQkFBTyxFQUFDLFlBQVksRUFBWixZQUFZLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUM7U0FBQztPQUN2RSxDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQ3BELE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1QixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLG1EQUFtRCxFQUFFLFlBQU07QUFDNUQsVUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUM7O0FBRXpDLFVBQU0saUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztBQUM5QyxZQUFJLEVBQUU7aUJBQU8sRUFBQyxZQUFZLEVBQVosWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFDO1NBQUM7T0FDdkUsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUNwRCxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUIsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQywwQkFBMEIsRUFBRSxZQUFNO0FBQ3pDLE1BQUUsQ0FBQyx5REFBeUQsRUFBRSxZQUFNO0FBQ2xFLFVBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQzs7QUFFakMsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDO0FBQzlDLFlBQUksRUFBRTtpQkFBTyxFQUFDLFlBQVksRUFBWixZQUFZLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUM7U0FBQztPQUN2RSxDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQ3hELE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1QixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDBEQUEwRCxFQUFFLFlBQU07QUFDbkUsVUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDOztBQUVqQyxVQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLENBQUM7QUFDOUMsWUFBSSxFQUFFO2lCQUFPLEVBQUMsWUFBWSxFQUFaLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBQztTQUFDO09BQ3ZFLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FDeEQsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx1REFBdUQsRUFBRSxZQUFNO0FBQ2hFLFVBQU0sV0FBVyxHQUFHLG9CQUFvQixDQUFDOztBQUV6QyxVQUFNLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLENBQUM7QUFDOUMsWUFBSSxFQUFFO2lCQUFPLEVBQUMsWUFBWSxFQUFaLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBQztTQUFDO09BQ3ZFLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FDeEQsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWNsYW5nLWF0b20vc3BlYy9KdW1wVG9SZWxhdGVkRmlsZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbmNvbnN0IEp1bXBUb1JlbGF0ZWRGaWxlID0gcmVxdWlyZSgnLi4vbGliL0p1bXBUb1JlbGF0ZWRGaWxlJyk7XG5cbmRlc2NyaWJlKCdKdW1wVG9SZWxhdGVkRmlsZScsICgpID0+IHtcbiAgY29uc3QgcmVsYXRlZEZpbGVzID0gWydkaXIvVGVzdC5oJywgJ2Rpci9UZXN0Lm0nLCAnZGlyL1Rlc3RJbnRlcm5hbC5oJ107XG5cbiAgZGVzY3JpYmUoJ0BnZXROZXh0UmVsYXRlZEZpbGVfJywgKCkgPT4ge1xuICAgIGl0KCdnZXRzIG5leHQgcmVsYXRlZCBmaWxlIGF0IHRoZSBzdGFydCBvZiB0aGUgc2VxdWVuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RmlsZSA9ICdkaXIvVGVzdC5oJztcblxuICAgICAgY29uc3QganVtcFRvUmVsYXRlZEZpbGUgPSBuZXcgSnVtcFRvUmVsYXRlZEZpbGUoe1xuICAgICAgICBmaW5kOiAoKSA9PiAoe3JlbGF0ZWRGaWxlcywgaW5kZXg6IHJlbGF0ZWRGaWxlcy5pbmRleE9mKGN1cnJlbnRGaWxlKX0pLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChqdW1wVG9SZWxhdGVkRmlsZS5nZXROZXh0UmVsYXRlZEZpbGUoY3VycmVudEZpbGUpKVxuICAgICAgICAgIC50b0VxdWFsKCdkaXIvVGVzdEludGVybmFsLmgnKTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXRzIG5leHQgcmVsYXRlZCBmaWxlIGluIHRoZSBtaWRkbGUgb2YgdGhlIHNlcXVlbmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEZpbGUgPSAnZGlyL1Rlc3QubSc7XG5cbiAgICAgIGNvbnN0IGp1bXBUb1JlbGF0ZWRGaWxlID0gbmV3IEp1bXBUb1JlbGF0ZWRGaWxlKHtcbiAgICAgICAgZmluZDogKCkgPT4gKHtyZWxhdGVkRmlsZXMsIGluZGV4OiByZWxhdGVkRmlsZXMuaW5kZXhPZihjdXJyZW50RmlsZSl9KSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoanVtcFRvUmVsYXRlZEZpbGUuZ2V0TmV4dFJlbGF0ZWRGaWxlKGN1cnJlbnRGaWxlKSlcbiAgICAgICAgICAudG9FcXVhbCgnZGlyL1Rlc3QuaCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2dldHMgbmV4dCByZWxhdGVkIGZpbGUgYXQgdGhlIGVuZCBvZiB0aGUgc2VxdWVuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RmlsZSA9ICdkaXIvVGVzdEludGVybmFsLmgnO1xuXG4gICAgICBjb25zdCBqdW1wVG9SZWxhdGVkRmlsZSA9IG5ldyBKdW1wVG9SZWxhdGVkRmlsZSh7XG4gICAgICAgIGZpbmQ6ICgpID0+ICh7cmVsYXRlZEZpbGVzLCBpbmRleDogcmVsYXRlZEZpbGVzLmluZGV4T2YoY3VycmVudEZpbGUpfSksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGp1bXBUb1JlbGF0ZWRGaWxlLmdldE5leHRSZWxhdGVkRmlsZShjdXJyZW50RmlsZSkpXG4gICAgICAgICAgLnRvRXF1YWwoJ2Rpci9UZXN0Lm0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0BnZXRQcmV2aW91c1JlbGF0ZWRGaWxlXycsICgpID0+IHtcbiAgICBpdCgnZ2V0cyBwcmV2aW91cyByZWxhdGVkIGZpbGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBzZXF1ZW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRGaWxlID0gJ2Rpci9UZXN0LmgnO1xuXG4gICAgICBjb25zdCBqdW1wVG9SZWxhdGVkRmlsZSA9IG5ldyBKdW1wVG9SZWxhdGVkRmlsZSh7XG4gICAgICAgIGZpbmQ6ICgpID0+ICh7cmVsYXRlZEZpbGVzLCBpbmRleDogcmVsYXRlZEZpbGVzLmluZGV4T2YoY3VycmVudEZpbGUpfSksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGp1bXBUb1JlbGF0ZWRGaWxlLmdldFByZXZpb3VzUmVsYXRlZEZpbGUoY3VycmVudEZpbGUpKVxuICAgICAgICAgIC50b0VxdWFsKCdkaXIvVGVzdC5tJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZ2V0cyBwcmV2aW91cyByZWxhdGVkIGZpbGUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2VxdWVuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RmlsZSA9ICdkaXIvVGVzdC5tJztcblxuICAgICAgY29uc3QganVtcFRvUmVsYXRlZEZpbGUgPSBuZXcgSnVtcFRvUmVsYXRlZEZpbGUoe1xuICAgICAgICBmaW5kOiAoKSA9PiAoe3JlbGF0ZWRGaWxlcywgaW5kZXg6IHJlbGF0ZWRGaWxlcy5pbmRleE9mKGN1cnJlbnRGaWxlKX0pLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChqdW1wVG9SZWxhdGVkRmlsZS5nZXRQcmV2aW91c1JlbGF0ZWRGaWxlKGN1cnJlbnRGaWxlKSlcbiAgICAgICAgICAudG9FcXVhbCgnZGlyL1Rlc3RJbnRlcm5hbC5oJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZ2V0cyBwcmV2aW91cyByZWxhdGVkIGZpbGUgYXQgdGhlIGVuZCBvZiB0aGUgc2VxdWVuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RmlsZSA9ICdkaXIvVGVzdEludGVybmFsLmgnO1xuXG4gICAgICBjb25zdCBqdW1wVG9SZWxhdGVkRmlsZSA9IG5ldyBKdW1wVG9SZWxhdGVkRmlsZSh7XG4gICAgICAgIGZpbmQ6ICgpID0+ICh7cmVsYXRlZEZpbGVzLCBpbmRleDogcmVsYXRlZEZpbGVzLmluZGV4T2YoY3VycmVudEZpbGUpfSksXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGp1bXBUb1JlbGF0ZWRGaWxlLmdldFByZXZpb3VzUmVsYXRlZEZpbGUoY3VycmVudEZpbGUpKVxuICAgICAgICAgIC50b0VxdWFsKCdkaXIvVGVzdC5oJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-clang-atom/spec/JumpToRelatedFile-spec.js
