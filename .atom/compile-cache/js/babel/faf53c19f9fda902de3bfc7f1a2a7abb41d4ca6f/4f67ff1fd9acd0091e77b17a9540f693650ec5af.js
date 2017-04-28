function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

'use babel';

var TestRunnerController = require('../lib/TestRunnerController');

describe('TestRunnerController', function () {

  var testRunners = undefined;

  beforeEach(function () {
    testRunners = new Set();
  });

  describe('on initialization', function () {

    it('does not create a panel if `panelVisible` is false', function () {
      new TestRunnerController({ panelVisible: false }, testRunners); // eslint-disable-line no-new
      expect(atom.workspace.getBottomPanels().length).toEqual(0);
    });

    it('does not create a panel if no state is provided', function () {
      new TestRunnerController(undefined, testRunners); // eslint-disable-line no-new
      expect(atom.workspace.getBottomPanels().length).toEqual(0);
    });

    it('creates a panel if `panelVisible` is true', function () {
      new TestRunnerController({ panelVisible: true }, testRunners); // eslint-disable-line no-new
      expect(atom.workspace.getBottomPanels().length).toEqual(1);
    });
  });

  describe('runTests()', function () {

    it('forces the panel to be shown', function () {
      // The controller needs at least one test runner to run tests.
      testRunners.add({ getByUri: function getByUri() {}, label: '' });
      // Start with `panelVisible: false` to ensure the panel is initially hidden.
      var controller = new TestRunnerController({ panelVisible: false }, testRunners);
      expect(atom.workspace.getBottomPanels().length).toEqual(0);
      waitsForPromise(_asyncToGenerator(function* () {
        yield controller.runTests();
        expect(atom.workspace.getBottomPanels().length).toEqual(1);
      }));
    });
  });

  describe('on addition of new test runners', function () {

    // When new test runners are added, the dropdown in the UI needs to update. However, it should
    // not force a render if the panel is still supposed to be hidden.
    it('does not create a panel if `panelVisible` is false', function () {
      var controller = new TestRunnerController({ panelVisible: false }, testRunners);
      testRunners.add({
        getByUri: function getByUri() {},
        label: ''
      });
      controller.didUpdateTestRunners();
      expect(atom.workspace.getBottomPanels().length).toEqual(0);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtdGVzdC1ydW5uZXIvc3BlYy9UZXN0UnVubmVyQ29udHJvbGxlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxXQUFXLENBQUM7O0FBYVosSUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFcEUsUUFBUSxDQUFDLHNCQUFzQixFQUFFLFlBQU07O0FBRXJDLE1BQUksV0FBNEIsWUFBQSxDQUFDOztBQUVqQyxZQUFVLENBQUMsWUFBTTtBQUNmLGVBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0dBQ3pCLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsbUJBQW1CLEVBQUUsWUFBTTs7QUFFbEMsTUFBRSxDQUFDLG9EQUFvRCxFQUFFLFlBQU07QUFDN0QsVUFBSSxvQkFBb0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM3RCxZQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxpREFBaUQsRUFBRSxZQUFNO0FBQzFELFVBQUksb0JBQW9CLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2pELFlBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDJDQUEyQyxFQUFFLFlBQU07QUFDcEQsVUFBSSxvQkFBb0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxJQUFJLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1RCxZQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDO0dBRUosQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTs7QUFFM0IsTUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQU07O0FBRXZDLGlCQUFXLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxFQUFBLG9CQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQzs7QUFFNUMsVUFBTSxVQUFVLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoRixZQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QscUJBQWUsbUJBQUMsYUFBWTtBQUMxQixjQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM1QixjQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDNUQsRUFBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBRUosQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNOzs7O0FBSWhELE1BQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFNO0FBQzdELFVBQU0sVUFBVSxHQUFHLElBQUksb0JBQW9CLENBQUMsRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEYsaUJBQVcsQ0FBQyxHQUFHLENBQUM7QUFDZCxnQkFBUSxFQUFBLG9CQUFHLEVBQUU7QUFDYixhQUFLLEVBQUUsRUFBRTtPQUNWLENBQUMsQ0FBQztBQUNILGdCQUFVLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUNsQyxZQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDO0dBRUosQ0FBQyxDQUFDO0NBRUosQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtdGVzdC1ydW5uZXIvc3BlYy9UZXN0UnVubmVyQ29udHJvbGxlci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUgVGVzdFJ1bm5lciBmcm9tICcuLi9saWIvVGVzdFJ1bm5lcic7XG5cbmNvbnN0IFRlc3RSdW5uZXJDb250cm9sbGVyID0gcmVxdWlyZSgnLi4vbGliL1Rlc3RSdW5uZXJDb250cm9sbGVyJyk7XG5cbmRlc2NyaWJlKCdUZXN0UnVubmVyQ29udHJvbGxlcicsICgpID0+IHtcblxuICBsZXQgdGVzdFJ1bm5lcnM6IFNldDxUZXN0UnVubmVyPjtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB0ZXN0UnVubmVycyA9IG5ldyBTZXQoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ29uIGluaXRpYWxpemF0aW9uJywgKCkgPT4ge1xuXG4gICAgaXQoJ2RvZXMgbm90IGNyZWF0ZSBhIHBhbmVsIGlmIGBwYW5lbFZpc2libGVgIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgbmV3IFRlc3RSdW5uZXJDb250cm9sbGVyKHtwYW5lbFZpc2libGU6IGZhbHNlfSwgdGVzdFJ1bm5lcnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEJvdHRvbVBhbmVscygpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBjcmVhdGUgYSBwYW5lbCBpZiBubyBzdGF0ZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIG5ldyBUZXN0UnVubmVyQ29udHJvbGxlcih1bmRlZmluZWQsIHRlc3RSdW5uZXJzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21QYW5lbHMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlcyBhIHBhbmVsIGlmIGBwYW5lbFZpc2libGVgIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBuZXcgVGVzdFJ1bm5lckNvbnRyb2xsZXIoe3BhbmVsVmlzaWJsZTogdHJ1ZX0sIHRlc3RSdW5uZXJzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21QYW5lbHMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3J1blRlc3RzKCknLCAoKSA9PiB7XG5cbiAgICBpdCgnZm9yY2VzIHRoZSBwYW5lbCB0byBiZSBzaG93bicsICgpID0+IHtcbiAgICAgIC8vIFRoZSBjb250cm9sbGVyIG5lZWRzIGF0IGxlYXN0IG9uZSB0ZXN0IHJ1bm5lciB0byBydW4gdGVzdHMuXG4gICAgICB0ZXN0UnVubmVycy5hZGQoe2dldEJ5VXJpKCkge30sIGxhYmVsOiAnJ30pO1xuICAgICAgLy8gU3RhcnQgd2l0aCBgcGFuZWxWaXNpYmxlOiBmYWxzZWAgdG8gZW5zdXJlIHRoZSBwYW5lbCBpcyBpbml0aWFsbHkgaGlkZGVuLlxuICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBUZXN0UnVubmVyQ29udHJvbGxlcih7cGFuZWxWaXNpYmxlOiBmYWxzZX0sIHRlc3RSdW5uZXJzKTtcbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21QYW5lbHMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBjb250cm9sbGVyLnJ1blRlc3RzKCk7XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21QYW5lbHMoKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnb24gYWRkaXRpb24gb2YgbmV3IHRlc3QgcnVubmVycycsICgpID0+IHtcblxuICAgIC8vIFdoZW4gbmV3IHRlc3QgcnVubmVycyBhcmUgYWRkZWQsIHRoZSBkcm9wZG93biBpbiB0aGUgVUkgbmVlZHMgdG8gdXBkYXRlLiBIb3dldmVyLCBpdCBzaG91bGRcbiAgICAvLyBub3QgZm9yY2UgYSByZW5kZXIgaWYgdGhlIHBhbmVsIGlzIHN0aWxsIHN1cHBvc2VkIHRvIGJlIGhpZGRlbi5cbiAgICBpdCgnZG9lcyBub3QgY3JlYXRlIGEgcGFuZWwgaWYgYHBhbmVsVmlzaWJsZWAgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IFRlc3RSdW5uZXJDb250cm9sbGVyKHtwYW5lbFZpc2libGU6IGZhbHNlfSwgdGVzdFJ1bm5lcnMpO1xuICAgICAgdGVzdFJ1bm5lcnMuYWRkKHtcbiAgICAgICAgZ2V0QnlVcmkoKSB7fSxcbiAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgfSk7XG4gICAgICBjb250cm9sbGVyLmRpZFVwZGF0ZVRlc3RSdW5uZXJzKCk7XG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tUGFuZWxzKCkubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgIH0pO1xuXG4gIH0pO1xuXG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-test-runner/spec/TestRunnerController-spec.js
