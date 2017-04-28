var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _libFileTreeActions = require('../lib/FileTreeActions');

var _libFileTreeActions2 = _interopRequireDefault(_libFileTreeActions);

var _componentsDirectoryEntryComponent = require('../components/DirectoryEntryComponent');

var _componentsDirectoryEntryComponent2 = _interopRequireDefault(_componentsDirectoryEntryComponent);

var _componentsFileEntryComponent = require('../components/FileEntryComponent');

var _componentsFileEntryComponent2 = _interopRequireDefault(_componentsFileEntryComponent);

var _reactForAtom = require('react-for-atom');

var _reactForAtom2 = _interopRequireDefault(_reactForAtom);

'use babel';
var TestUtils = _reactForAtom2['default'].addons.TestUtils;

function renderEntryComponentIntoDocument(componentKlass) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var componentProps = _extends({
    indentLevel: 0,
    isContainer: false,
    isExpanded: false,
    isLoading: false,
    isSelected: false,
    nodeKey: '',
    nodeName: '',
    nodePath: '',
    rootKey: ''
  }, props);
  return TestUtils.renderIntoDocument(_reactForAtom2['default'].createElement(componentKlass, componentProps));
}

describe('DirectoryEntryComponent', function () {
  var actions = _libFileTreeActions2['default'].getInstance();

  describe('when expanding/collapsing', function () {
    beforeEach(function () {
      spyOn(actions, 'expandNode');
    });

    it('expands on click when node is selected', function () {
      var nodeComponent = renderEntryComponentIntoDocument(_componentsDirectoryEntryComponent2['default'], {
        isRoot: false,
        isSelected: true
      });
      var domNode = _reactForAtom2['default'].findDOMNode(nodeComponent);
      TestUtils.Simulate.click(domNode);
      expect(actions.expandNode).toHaveBeenCalled();
    });
  });
});

describe('FileEntryComponent', function () {
  var actions = _libFileTreeActions2['default'].getInstance();

  describe('when expanding/collapsing', function () {
    beforeEach(function () {
      spyOn(actions, 'expandNode');
    });

    it('does not expand on click when node is selected', function () {
      var nodeComponent = renderEntryComponentIntoDocument(_componentsFileEntryComponent2['default'], { isSelected: true });
      var domNode = _reactForAtom2['default'].findDOMNode(nodeComponent);
      TestUtils.Simulate.click(domNode);
      expect(actions.expandNode).not.toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvTm9kZUNvbXBvbmVudC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQ0FXNEIsd0JBQXdCOzs7O2lEQUNoQix1Q0FBdUM7Ozs7NENBQzVDLGtDQUFrQzs7Ozs0QkFDL0MsZ0JBQWdCOzs7O0FBZGxDLFdBQVcsQ0FBQztJQWdCTCxTQUFTLEdBQUksMEJBQU0sTUFBTSxDQUF6QixTQUFTOztBQUVoQixTQUFTLGdDQUFnQyxDQUFDLGNBQXNCLEVBQXNCO01BQXBCLEtBQWEseURBQUcsRUFBRTs7QUFDbEYsTUFBTSxjQUFjLFlBQ2Y7QUFDRCxlQUFXLEVBQUUsQ0FBQztBQUNkLGVBQVcsRUFBRSxLQUFLO0FBQ2xCLGNBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQVMsRUFBRSxLQUFLO0FBQ2hCLGNBQVUsRUFBRSxLQUFLO0FBQ2pCLFdBQU8sRUFBRSxFQUFFO0FBQ1gsWUFBUSxFQUFFLEVBQUU7QUFDWixZQUFRLEVBQUUsRUFBRTtBQUNaLFdBQU8sRUFBRSxFQUFFO0dBQ1osRUFDRSxLQUFLLENBQ1QsQ0FBQztBQUNGLFNBQU8sU0FBUyxDQUFDLGtCQUFrQixDQUFDLDBCQUFNLGFBQWEsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztDQUMxRjs7QUFFRCxRQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN4QyxNQUFNLE9BQU8sR0FBRyxnQ0FBZ0IsV0FBVyxFQUFFLENBQUM7O0FBRTlDLFVBQVEsQ0FBQywyQkFBMkIsRUFBRSxZQUFNO0FBQzFDLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsV0FBSyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztLQUM5QixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDakQsVUFBTSxhQUFhLEdBQUcsZ0NBQWdDLGlEQUVwRDtBQUNFLGNBQU0sRUFBRSxLQUFLO0FBQ2Isa0JBQVUsRUFBRSxJQUFJO09BQ2pCLENBQ0YsQ0FBQztBQUNGLFVBQU0sT0FBTyxHQUFHLDBCQUFNLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqRCxlQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsQyxZQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDL0MsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDOztBQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxZQUFNO0FBQ25DLE1BQU0sT0FBTyxHQUFHLGdDQUFnQixXQUFXLEVBQUUsQ0FBQzs7QUFFOUMsVUFBUSxDQUFDLDJCQUEyQixFQUFFLFlBQU07QUFDMUMsY0FBVSxDQUFDLFlBQU07QUFDZixXQUFLLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzlCLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsZ0RBQWdELEVBQUUsWUFBTTtBQUN6RCxVQUFNLGFBQWEsR0FBRyxnQ0FBZ0MsNENBRXBELEVBQUMsVUFBVSxFQUFFLElBQUksRUFBQyxDQUNuQixDQUFDO0FBQ0YsVUFBTSxPQUFPLEdBQUcsMEJBQU0sV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pELGVBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUM7S0FDbkQsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvTm9kZUNvbXBvbmVudC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IEZpbGVUcmVlQWN0aW9ucyBmcm9tICcuLi9saWIvRmlsZVRyZWVBY3Rpb25zJztcbmltcG9ydCBEaXJlY3RvcnlFbnRyeUNvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnRzL0RpcmVjdG9yeUVudHJ5Q29tcG9uZW50JztcbmltcG9ydCBGaWxlRW50cnlDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50cy9GaWxlRW50cnlDb21wb25lbnQnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcblxuY29uc3Qge1Rlc3RVdGlsc30gPSBSZWFjdC5hZGRvbnM7XG5cbmZ1bmN0aW9uIHJlbmRlckVudHJ5Q29tcG9uZW50SW50b0RvY3VtZW50KGNvbXBvbmVudEtsYXNzOiBPYmplY3QsIHByb3BzOiBPYmplY3QgPSB7fSkge1xuICBjb25zdCBjb21wb25lbnRQcm9wcyA9IHtcbiAgICAuLi57XG4gICAgICBpbmRlbnRMZXZlbDogMCxcbiAgICAgIGlzQ29udGFpbmVyOiBmYWxzZSxcbiAgICAgIGlzRXhwYW5kZWQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIGlzU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgbm9kZUtleTogJycsXG4gICAgICBub2RlTmFtZTogJycsXG4gICAgICBub2RlUGF0aDogJycsXG4gICAgICByb290S2V5OiAnJyxcbiAgICB9LFxuICAgIC4uLnByb3BzLFxuICB9O1xuICByZXR1cm4gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudEtsYXNzLCBjb21wb25lbnRQcm9wcykpO1xufVxuXG5kZXNjcmliZSgnRGlyZWN0b3J5RW50cnlDb21wb25lbnQnLCAoKSA9PiB7XG4gIGNvbnN0IGFjdGlvbnMgPSBGaWxlVHJlZUFjdGlvbnMuZ2V0SW5zdGFuY2UoKTtcblxuICBkZXNjcmliZSgnd2hlbiBleHBhbmRpbmcvY29sbGFwc2luZycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHNweU9uKGFjdGlvbnMsICdleHBhbmROb2RlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZXhwYW5kcyBvbiBjbGljayB3aGVuIG5vZGUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlQ29tcG9uZW50ID0gcmVuZGVyRW50cnlDb21wb25lbnRJbnRvRG9jdW1lbnQoXG4gICAgICAgIERpcmVjdG9yeUVudHJ5Q29tcG9uZW50LFxuICAgICAgICB7XG4gICAgICAgICAgaXNSb290OiBmYWxzZSxcbiAgICAgICAgICBpc1NlbGVjdGVkOiB0cnVlLFxuICAgICAgICB9XG4gICAgICApO1xuICAgICAgY29uc3QgZG9tTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKG5vZGVDb21wb25lbnQpO1xuICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKGRvbU5vZGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbnMuZXhwYW5kTm9kZSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnRmlsZUVudHJ5Q29tcG9uZW50JywgKCkgPT4ge1xuICBjb25zdCBhY3Rpb25zID0gRmlsZVRyZWVBY3Rpb25zLmdldEluc3RhbmNlKCk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gZXhwYW5kaW5nL2NvbGxhcHNpbmcnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzcHlPbihhY3Rpb25zLCAnZXhwYW5kTm9kZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IGV4cGFuZCBvbiBjbGljayB3aGVuIG5vZGUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlQ29tcG9uZW50ID0gcmVuZGVyRW50cnlDb21wb25lbnRJbnRvRG9jdW1lbnQoXG4gICAgICAgIEZpbGVFbnRyeUNvbXBvbmVudCxcbiAgICAgICAge2lzU2VsZWN0ZWQ6IHRydWV9XG4gICAgICApO1xuICAgICAgY29uc3QgZG9tTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKG5vZGVDb21wb25lbnQpO1xuICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNsaWNrKGRvbU5vZGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbnMuZXhwYW5kTm9kZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-file-tree/spec/NodeComponent-spec.js
