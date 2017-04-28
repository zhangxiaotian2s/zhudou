function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _libFileTreeActions = require('../lib/FileTreeActions');

var _libFileTreeActions2 = _interopRequireDefault(_libFileTreeActions);

var _libFileTreeController = require('../lib/FileTreeController');

var _libFileTreeController2 = _interopRequireDefault(_libFileTreeController);

var _libFileTreeStore = require('../lib/FileTreeStore');

var _libFileTreeStore2 = _interopRequireDefault(_libFileTreeStore);

var _reactForAtom = require('react-for-atom');

var _reactForAtom2 = _interopRequireDefault(_reactForAtom);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

describe('FileTreeController', function () {
  var actions = _libFileTreeActions2['default'].getInstance();
  var store = _libFileTreeStore2['default'].getInstance();

  var controller = undefined;
  var workspaceElement = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    // Attach the workspace to the DOM so focus can be determined in tests below.
    jasmine.attachToDOM(workspaceElement);
    controller = new _libFileTreeController2['default'](null);

    // The controller uses the currently active file to decide when and what to reveal in the file
    // tree when revealActiveFile is called. Importantly, it also short-circuits in some cases if
    // the path is null or undefined. Here we mock it out so that we get normal behavior in our
    // tests.
    spyOn(atom.workspace, 'getActiveTextEditor').andReturn({
      getBuffer: function getBuffer() {
        return {
          file: {
            getPath: function getPath() {
              return 'foo';
            }
          }
        };
      }
    });
  });

  afterEach(function () {
    controller.destroy();
    store.reset();
  });

  describe('revealActiveFile', function () {
    beforeEach(function () {
      // Ensure the file tree's panel is hidden at first.
      controller.toggleVisibility();
      expect(controller._isVisible).toBe(false);
    });

    it('shows/unhides the controller\'s panel', function () {
      controller.revealActiveFile();
      expect(controller._isVisible).toBe(true);
    });

    it('does not show the panel if showIfHidden is false', function () {
      controller.revealActiveFile( /* showIfHidden */false);
      expect(controller._isVisible).toBe(false);
    });
  });

  describe('toggleVisibility', function () {
    it('focuses the file tree element when going from hidden to visible', function () {
      var domNode = _reactForAtom2['default'].findDOMNode(controller._fileTreePanel.getFileTree());
      controller.toggleVisibility();
      expect(domNode).not.toMatchSelector(':focus');
      controller.toggleVisibility();
      expect(domNode).toMatchSelector(':focus');
    });

    it('blurs the file tree element when going from visible to hidden', function () {
      var domNode = _reactForAtom2['default'].findDOMNode(controller._fileTreePanel.getFileTree());
      controller.focusTree();
      expect(domNode).toMatchSelector(':focus');
      controller.toggleVisibility();
      expect(domNode).not.toMatchSelector(':focus');
    });
  });

  describe('focusTree', function () {
    it('focuses the expected element', function () {
      var domNode = _reactForAtom2['default'].findDOMNode(controller._fileTreePanel.getFileTree());
      expect(domNode).not.toMatchSelector(':focus');
      controller.focusTree();
      expect(domNode).toMatchSelector(':focus');
    });
  });

  describe('blurTree', function () {
    it('sends focus to the workspace element to match Atom\'s tree-view API', function () {
      var domNode = _reactForAtom2['default'].findDOMNode(controller._fileTreePanel.getFileTree());
      controller.focusTree();
      expect(domNode).toMatchSelector(':focus');
      controller.blurTree();
      expect(atom.views.getView(atom.workspace.getActivePane())).toMatchSelector(':focus');
    });
  });

  describe('serialize', function () {
    it('returns an object with valid values', function () {
      var serializedControllerData = controller.serialize();
      expect(serializedControllerData.panel).toEqual({
        isVisible: true,
        width: _libFileTreeController2['default'].INITIAL_WIDTH
      });
      expect(typeof serializedControllerData.panel).toBe('object');
    });
  });

  describe('navigating with the keyboard', function () {
    var rootKey = _path2['default'].join(__dirname, 'fixtures') + '/';
    var dir1Key = _path2['default'].join(__dirname, 'fixtures/dir1') + '/';
    var fooTxtKey = _path2['default'].join(__dirname, 'fixtures/dir1/foo.txt');
    var dir2Key = _path2['default'].join(__dirname, 'fixtures/dir2') + '/';

    describe('with a collapsed root', function () {
      /*
       * Start with a simple structure that looks like the following:
       *
       *   → fixtures
       */
      describe('via _collapseSelection (left arrow)', function () {
        it('does not modify the selection if the root is selected', function () {
          actions.selectSingleNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
          controller._collapseSelection();

          // root was expanded, selection shouldn't change
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });
      });
    });

    describe('with single nesting', function () {
      beforeEach(function () {
        /*
         * ༼ つ ◕_◕ ༽つ
         * Start with an expanded and fetched state that looks like the following:
         *
         *   ↓ fixtures
         *     → dir1
         *     → dir2
         */
        waitsForPromise(_asyncToGenerator(function* () {
          actions.expandNode(rootKey, rootKey);
          // Populate real files from real disk like real people.
          yield store._fetchChildKeys(rootKey);
        }));
      });

      describe('via _collapseSelection (left arrow)', function () {
        it('selects the parent if the selected node is a collapsed directory', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._collapseSelection();

          // the root is dir2's parent
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });

        it('does not modify the selection if selected node is an expanded directory', function () {
          actions.selectSingleNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
          controller._collapseSelection();

          // root was expanded, selection shouldn't change
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });
      });

      describe('via _moveDown', function () {
        it('selects the first root if there is no selection', function () {
          expect(store.getSingleSelectedNode()).toBeNull();
          controller._moveDown();
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });

        it('does nothing if the bottommost node is selected', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._moveDown();
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });

        it('selects first child if parent is selected', function () {
          actions.selectSingleNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
          controller._moveDown();

          // dir1 is the first child, should get selected
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
        });

        it('selects the next sibling when one exists', function () {
          actions.selectSingleNode(rootKey, dir1Key);
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
          controller._moveDown();

          // dir2 is the next sibling, should get selected
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });
      });

      describe('via _moveUp', function () {
        it('selects the lowermost descendant if there is no selection', function () {
          expect(store.getSingleSelectedNode()).toBeNull();
          controller._moveUp();
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });

        it('does nothing if the topmost root node is selected', function () {
          actions.selectSingleNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
          controller._moveUp();
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });

        it('selects parent if first child is selected', function () {
          actions.selectSingleNode(rootKey, dir1Key);
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
          controller._moveUp();

          // dir1 is the first child, parent (root) should get selected
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });

        it('selects the previous sibling if one exists', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._moveUp();

          // dir2 is the second child, previous sibling (dir1) should be selected
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
        });

        it('selects the root after deselecting via collapsing', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          actions.collapseNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(false);
          controller._moveUp();

          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });
      });
    });

    describe('with double+ nesting', function () {
      beforeEach(function () {
        waitsForPromise(_asyncToGenerator(function* () {
          /*
           * ¯\_(ツ)_/¯
           * Expand to a view like the following:
           *
           *   ↓ fixtures
           *     ↓ dir1
           *       · foo.txt
           *     → dir2
           */
          actions.expandNode(rootKey, rootKey);
          yield store._fetchChildKeys(rootKey);
          actions.expandNode(rootKey, dir1Key);
          yield store._fetchChildKeys(dir1Key);
        }));
      });

      describe('via _collapseAll ( cmd+{ )', function () {
        it('collapses all visible nodes', function () {
          controller._collapseAll();
          expect(store.isExpanded(rootKey, rootKey)).toBe(false);
          expect(store.isExpanded(rootKey, dir1Key)).toBe(false);
        });
      });

      describe('via _collapseSelection (left arrow)', function () {
        it('selects the parent if the selected node is a file', function () {
          actions.selectSingleNode(rootKey, fooTxtKey);
          expect(store.isSelected(rootKey, fooTxtKey)).toEqual(true);
          controller._collapseSelection();

          // dir1 is foo.txt's parent
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
        });
      });

      describe('via _moveDown', function () {
        it('selects the previous nested descendant when one exists', function () {
          actions.selectSingleNode(rootKey, fooTxtKey);
          expect(store.isSelected(rootKey, fooTxtKey)).toEqual(true);
          controller._moveDown();

          // foo.txt is the previous visible descendant to dir2
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });
      });

      describe('via _moveUp', function () {
        it('selects the previous nested descendant when one exists', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._moveUp();

          // foo.txt is the previous visible descendant to dir2
          expect(store.isSelected(rootKey, fooTxtKey)).toEqual(true);
        });
      });

      describe('via _moveToTop', function () {
        it('selects the root', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._moveToTop();

          // the root is the topmost node
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
        });
      });

      describe('via _moveToBottom', function () {
        it('selects the bottommost node', function () {
          actions.selectSingleNode(rootKey, rootKey);
          expect(store.isSelected(rootKey, rootKey)).toEqual(true);
          controller._moveToBottom();

          // dir2 is the bottommost node
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });
      });
    });

    describe('with an expanded + loading directory', function () {
      beforeEach(function () {
        waitsForPromise(_asyncToGenerator(function* () {
          /*
           * Expand to a view like the following with a loading (indicated by ↻) dir1:
           *
           *   ↓ fixtures
           *     ↻ dir1
           *     → dir2
           */
          actions.expandNode(rootKey, rootKey);
          yield store._fetchChildKeys(rootKey);
          // Mimic the loading state where `dir1` reports itself as expanded but has no children
          // yet. Don't use `actions.expandNode` because it causes a re-render, which queues a real
          // fetch and might populate the children of `dir1`. We don't want that.
          store._setLoading(dir1Key, Promise.resolve());
          store._setExpandedKeys(rootKey, store._getExpandedKeys(rootKey).add(dir1Key));
        }));
      });

      describe('via _moveDown', function () {
        it('selects the next sibling', function () {
          actions.selectSingleNode(rootKey, dir1Key);
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
          controller._moveDown();
          // dir2 is dir1's next sibling
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
        });
      });

      describe('via _moveUp', function () {
        it('selects the previous sibling', function () {
          actions.selectSingleNode(rootKey, dir2Key);
          expect(store.isSelected(rootKey, dir2Key)).toEqual(true);
          controller._moveUp();

          // dir1 is dir2's previous sibling
          expect(store.isSelected(rootKey, dir1Key)).toEqual(true);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvRmlsZVRyZWVDb250cm9sbGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tDQVc0Qix3QkFBd0I7Ozs7cUNBQ3JCLDJCQUEyQjs7OztnQ0FDaEMsc0JBQXNCOzs7OzRCQUM5QixnQkFBZ0I7Ozs7b0JBRVgsTUFBTTs7OztBQWhCN0IsV0FBVyxDQUFDOztBQWtCWixRQUFRLENBQUMsb0JBQW9CLEVBQUUsWUFBTTtBQUNuQyxNQUFNLE9BQU8sR0FBRyxnQ0FBZ0IsV0FBVyxFQUFFLENBQUM7QUFDOUMsTUFBTSxLQUFLLEdBQUcsOEJBQWMsV0FBVyxFQUFFLENBQUM7O0FBRTFDLE1BQUksVUFBK0IsWUFBQSxDQUFDO0FBQ3BDLE1BQUksZ0JBQWdCLFlBQUEsQ0FBQzs7QUFFckIsWUFBVSxDQUFDLFlBQU07QUFDZixvQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXRELFdBQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0QyxjQUFVLEdBQUcsdUNBQXVCLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNMUMsU0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDckQsZUFBUyxFQUFBLHFCQUFHO0FBQ1YsZUFBTztBQUNMLGNBQUksRUFBRTtBQUNKLG1CQUFPLEVBQUEsbUJBQUc7QUFDUixxQkFBTyxLQUFLLENBQUM7YUFDZDtXQUNGO1NBQ0YsQ0FBQztPQUNIO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILFdBQVMsQ0FBQyxZQUFNO0FBQ2QsY0FBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JCLFNBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNmLENB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RSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxvQkFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUV2QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFELENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxjQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07QUFDNUIsVUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDdkMsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0MsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxvQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7QUFHckIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxRCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1maWxlLXRyZWUvc3BlYy9GaWxlVHJlZUNvbnRyb2xsZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBGaWxlVHJlZUFjdGlvbnMgZnJvbSAnLi4vbGliL0ZpbGVUcmVlQWN0aW9ucyc7XG5pbXBvcnQgRmlsZVRyZWVDb250cm9sbGVyIGZyb20gJy4uL2xpYi9GaWxlVHJlZUNvbnRyb2xsZXInO1xuaW1wb3J0IEZpbGVUcmVlU3RvcmUgZnJvbSAnLi4vbGliL0ZpbGVUcmVlU3RvcmUnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcblxuaW1wb3J0IHBhdGhNb2R1bGUgZnJvbSAncGF0aCc7XG5cbmRlc2NyaWJlKCdGaWxlVHJlZUNvbnRyb2xsZXInLCAoKSA9PiB7XG4gIGNvbnN0IGFjdGlvbnMgPSBGaWxlVHJlZUFjdGlvbnMuZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgc3RvcmUgPSBGaWxlVHJlZVN0b3JlLmdldEluc3RhbmNlKCk7XG5cbiAgbGV0IGNvbnRyb2xsZXI6ID9GaWxlVHJlZUNvbnRyb2xsZXI7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgIC8vIEF0dGFjaCB0aGUgd29ya3NwYWNlIHRvIHRoZSBET00gc28gZm9jdXMgY2FuIGJlIGRldGVybWluZWQgaW4gdGVzdHMgYmVsb3cuXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KTtcbiAgICBjb250cm9sbGVyID0gbmV3IEZpbGVUcmVlQ29udHJvbGxlcihudWxsKTtcblxuICAgIC8vIFRoZSBjb250cm9sbGVyIHVzZXMgdGhlIGN1cnJlbnRseSBhY3RpdmUgZmlsZSB0byBkZWNpZGUgd2hlbiBhbmQgd2hhdCB0byByZXZlYWwgaW4gdGhlIGZpbGVcbiAgICAvLyB0cmVlIHdoZW4gcmV2ZWFsQWN0aXZlRmlsZSBpcyBjYWxsZWQuIEltcG9ydGFudGx5LCBpdCBhbHNvIHNob3J0LWNpcmN1aXRzIGluIHNvbWUgY2FzZXMgaWZcbiAgICAvLyB0aGUgcGF0aCBpcyBudWxsIG9yIHVuZGVmaW5lZC4gSGVyZSB3ZSBtb2NrIGl0IG91dCBzbyB0aGF0IHdlIGdldCBub3JtYWwgYmVoYXZpb3IgaW4gb3VyXG4gICAgLy8gdGVzdHMuXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdnZXRBY3RpdmVUZXh0RWRpdG9yJykuYW5kUmV0dXJuKHtcbiAgICAgIGdldEJ1ZmZlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlOiB7XG4gICAgICAgICAgICBnZXRQYXRoKCkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2Zvbyc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGNvbnRyb2xsZXIuZGVzdHJveSgpO1xuICAgIHN0b3JlLnJlc2V0KCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyZXZlYWxBY3RpdmVGaWxlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgLy8gRW5zdXJlIHRoZSBmaWxlIHRyZWUncyBwYW5lbCBpcyBoaWRkZW4gYXQgZmlyc3QuXG4gICAgICBjb250cm9sbGVyLnRvZ2dsZVZpc2liaWxpdHkoKTtcbiAgICAgIGV4cGVjdChjb250cm9sbGVyLl9pc1Zpc2libGUpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3dzL3VuaGlkZXMgdGhlIGNvbnRyb2xsZXJcXCdzIHBhbmVsJywgKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5yZXZlYWxBY3RpdmVGaWxlKCk7XG4gICAgICBleHBlY3QoY29udHJvbGxlci5faXNWaXNpYmxlKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXMgbm90IHNob3cgdGhlIHBhbmVsIGlmIHNob3dJZkhpZGRlbiBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIucmV2ZWFsQWN0aXZlRmlsZSgvKiBzaG93SWZIaWRkZW4gKi8gZmFsc2UpO1xuICAgICAgZXhwZWN0KGNvbnRyb2xsZXIuX2lzVmlzaWJsZSkudG9CZShmYWxzZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0b2dnbGVWaXNpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdmb2N1c2VzIHRoZSBmaWxlIHRyZWUgZWxlbWVudCB3aGVuIGdvaW5nIGZyb20gaGlkZGVuIHRvIHZpc2libGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21Ob2RlID0gUmVhY3QuZmluZERPTU5vZGUoY29udHJvbGxlci5fZmlsZVRyZWVQYW5lbC5nZXRGaWxlVHJlZSgpKTtcbiAgICAgIGNvbnRyb2xsZXIudG9nZ2xlVmlzaWJpbGl0eSgpO1xuICAgICAgZXhwZWN0KGRvbU5vZGUpLm5vdC50b01hdGNoU2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgY29udHJvbGxlci50b2dnbGVWaXNpYmlsaXR5KCk7XG4gICAgICBleHBlY3QoZG9tTm9kZSkudG9NYXRjaFNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdibHVycyB0aGUgZmlsZSB0cmVlIGVsZW1lbnQgd2hlbiBnb2luZyBmcm9tIHZpc2libGUgdG8gaGlkZGVuJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKGNvbnRyb2xsZXIuX2ZpbGVUcmVlUGFuZWwuZ2V0RmlsZVRyZWUoKSk7XG4gICAgICBjb250cm9sbGVyLmZvY3VzVHJlZSgpO1xuICAgICAgZXhwZWN0KGRvbU5vZGUpLnRvTWF0Y2hTZWxlY3RvcignOmZvY3VzJyk7XG4gICAgICBjb250cm9sbGVyLnRvZ2dsZVZpc2liaWxpdHkoKTtcbiAgICAgIGV4cGVjdChkb21Ob2RlKS5ub3QudG9NYXRjaFNlbGVjdG9yKCc6Zm9jdXMnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZvY3VzVHJlZScsICgpID0+IHtcbiAgICBpdCgnZm9jdXNlcyB0aGUgZXhwZWN0ZWQgZWxlbWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbU5vZGUgPSBSZWFjdC5maW5kRE9NTm9kZShjb250cm9sbGVyLl9maWxlVHJlZVBhbmVsLmdldEZpbGVUcmVlKCkpO1xuICAgICAgZXhwZWN0KGRvbU5vZGUpLm5vdC50b01hdGNoU2VsZWN0b3IoJzpmb2N1cycpO1xuICAgICAgY29udHJvbGxlci5mb2N1c1RyZWUoKTtcbiAgICAgIGV4cGVjdChkb21Ob2RlKS50b01hdGNoU2VsZWN0b3IoJzpmb2N1cycpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYmx1clRyZWUnLCAoKSA9PiB7XG4gICAgaXQoJ3NlbmRzIGZvY3VzIHRvIHRoZSB3b3Jrc3BhY2UgZWxlbWVudCB0byBtYXRjaCBBdG9tXFwncyB0cmVlLXZpZXcgQVBJJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tTm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKGNvbnRyb2xsZXIuX2ZpbGVUcmVlUGFuZWwuZ2V0RmlsZVRyZWUoKSk7XG4gICAgICBjb250cm9sbGVyLmZvY3VzVHJlZSgpO1xuICAgICAgZXhwZWN0KGRvbU5vZGUpLnRvTWF0Y2hTZWxlY3RvcignOmZvY3VzJyk7XG4gICAgICBjb250cm9sbGVyLmJsdXJUcmVlKCk7XG4gICAgICBleHBlY3QoYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkpLnRvTWF0Y2hTZWxlY3RvcignOmZvY3VzJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzZXJpYWxpemUnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgYW4gb2JqZWN0IHdpdGggdmFsaWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VyaWFsaXplZENvbnRyb2xsZXJEYXRhID0gY29udHJvbGxlci5zZXJpYWxpemUoKTtcbiAgICAgIGV4cGVjdChzZXJpYWxpemVkQ29udHJvbGxlckRhdGEucGFuZWwpLnRvRXF1YWwoe1xuICAgICAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgICAgIHdpZHRoOiBGaWxlVHJlZUNvbnRyb2xsZXIuSU5JVElBTF9XSURUSCxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHR5cGVvZiBzZXJpYWxpemVkQ29udHJvbGxlckRhdGEucGFuZWwpLnRvQmUoJ29iamVjdCcpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbmF2aWdhdGluZyB3aXRoIHRoZSBrZXlib2FyZCcsICgpID0+IHtcbiAgICBjb25zdCByb290S2V5ID0gcGF0aE1vZHVsZS5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJykgKyAnLyc7XG4gICAgY29uc3QgZGlyMUtleSA9IHBhdGhNb2R1bGUuam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcy9kaXIxJykgKyAnLyc7XG4gICAgY29uc3QgZm9vVHh0S2V5ID0gcGF0aE1vZHVsZS5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL2RpcjEvZm9vLnR4dCcpO1xuICAgIGNvbnN0IGRpcjJLZXkgPSBwYXRoTW9kdWxlLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvZGlyMicpICsgJy8nO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYSBjb2xsYXBzZWQgcm9vdCcsICgpID0+IHtcbiAgICAgIC8qXG4gICAgICAgKiBTdGFydCB3aXRoIGEgc2ltcGxlIHN0cnVjdHVyZSB0aGF0IGxvb2tzIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgICAgICAqXG4gICAgICAgKiAgIOKGkiBmaXh0dXJlc1xuICAgICAgICovXG4gICAgICBkZXNjcmliZSgndmlhIF9jb2xsYXBzZVNlbGVjdGlvbiAobGVmdCBhcnJvdyknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdkb2VzIG5vdCBtb2RpZnkgdGhlIHNlbGVjdGlvbiBpZiB0aGUgcm9vdCBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgcm9vdEtleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgcm9vdEtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fY29sbGFwc2VTZWxlY3Rpb24oKTtcblxuICAgICAgICAgIC8vIHJvb3Qgd2FzIGV4cGFuZGVkLCBzZWxlY3Rpb24gc2hvdWxkbid0IGNoYW5nZVxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIHJvb3RLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggc2luZ2xlIG5lc3RpbmcnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICog4Ly8IOOBpCDil5Vf4peVIOC8veOBpFxuICAgICAgICAgKiBTdGFydCB3aXRoIGFuIGV4cGFuZGVkIGFuZCBmZXRjaGVkIHN0YXRlIHRoYXQgbG9va3MgbGlrZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgIOKGkyBmaXh0dXJlc1xuICAgICAgICAgKiAgICAg4oaSIGRpcjFcbiAgICAgICAgICogICAgIOKGkiBkaXIyXG4gICAgICAgICAqL1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuZXhwYW5kTm9kZShyb290S2V5LCByb290S2V5KTtcbiAgICAgICAgICAvLyBQb3B1bGF0ZSByZWFsIGZpbGVzIGZyb20gcmVhbCBkaXNrIGxpa2UgcmVhbCBwZW9wbGUuXG4gICAgICAgICAgYXdhaXQgc3RvcmUuX2ZldGNoQ2hpbGRLZXlzKHJvb3RLZXkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9jb2xsYXBzZVNlbGVjdGlvbiAobGVmdCBhcnJvdyknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBwYXJlbnQgaWYgdGhlIHNlbGVjdGVkIG5vZGUgaXMgYSBjb2xsYXBzZWQgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShyb290S2V5LCBkaXIyS2V5KTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBkaXIyS2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBjb250cm9sbGVyLl9jb2xsYXBzZVNlbGVjdGlvbigpO1xuXG4gICAgICAgICAgLy8gdGhlIHJvb3QgaXMgZGlyMidzIHBhcmVudFxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIHJvb3RLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3QgbW9kaWZ5IHRoZSBzZWxlY3Rpb24gaWYgc2VsZWN0ZWQgbm9kZSBpcyBhbiBleHBhbmRlZCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5zZWxlY3RTaW5nbGVOb2RlKHJvb3RLZXksIHJvb3RLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIHJvb3RLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX2NvbGxhcHNlU2VsZWN0aW9uKCk7XG5cbiAgICAgICAgICAvLyByb290IHdhcyBleHBhbmRlZCwgc2VsZWN0aW9uIHNob3VsZG4ndCBjaGFuZ2VcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCByb290S2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3ZpYSBfbW92ZURvd24nLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBmaXJzdCByb290IGlmIHRoZXJlIGlzIG5vIHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0U2luZ2xlU2VsZWN0ZWROb2RlKCkpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZURvd24oKTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCByb290S2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2RvZXMgbm90aGluZyBpZiB0aGUgYm90dG9tbW9zdCBub2RlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShyb290S2V5LCBkaXIyS2V5KTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBkaXIyS2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBjb250cm9sbGVyLl9tb3ZlRG93bigpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2VsZWN0cyBmaXJzdCBjaGlsZCBpZiBwYXJlbnQgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5zZWxlY3RTaW5nbGVOb2RlKHJvb3RLZXksIHJvb3RLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIHJvb3RLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX21vdmVEb3duKCk7XG5cbiAgICAgICAgICAvLyBkaXIxIGlzIHRoZSBmaXJzdCBjaGlsZCwgc2hvdWxkIGdldCBzZWxlY3RlZFxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjFLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2VsZWN0cyB0aGUgbmV4dCBzaWJsaW5nIHdoZW4gb25lIGV4aXN0cycsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgZGlyMUtleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgZGlyMUtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZURvd24oKTtcblxuICAgICAgICAgIC8vIGRpcjIgaXMgdGhlIG5leHQgc2libGluZywgc2hvdWxkIGdldCBzZWxlY3RlZFxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9tb3ZlVXAnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBsb3dlcm1vc3QgZGVzY2VuZGFudCBpZiB0aGVyZSBpcyBubyBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmdldFNpbmdsZVNlbGVjdGVkTm9kZSgpKS50b0JlTnVsbCgpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX21vdmVVcCgpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZG9lcyBub3RoaW5nIGlmIHRoZSB0b3Btb3N0IHJvb3Qgbm9kZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgcm9vdEtleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgcm9vdEtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZVVwKCk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgcm9vdEtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZWxlY3RzIHBhcmVudCBpZiBmaXJzdCBjaGlsZCBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgZGlyMUtleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgZGlyMUtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZVVwKCk7XG5cbiAgICAgICAgICAvLyBkaXIxIGlzIHRoZSBmaXJzdCBjaGlsZCwgcGFyZW50IChyb290KSBzaG91bGQgZ2V0IHNlbGVjdGVkXG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgcm9vdEtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBwcmV2aW91cyBzaWJsaW5nIGlmIG9uZSBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5zZWxlY3RTaW5nbGVOb2RlKHJvb3RLZXksIGRpcjJLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX21vdmVVcCgpO1xuXG4gICAgICAgICAgLy8gZGlyMiBpcyB0aGUgc2Vjb25kIGNoaWxkLCBwcmV2aW91cyBzaWJsaW5nIChkaXIxKSBzaG91bGQgYmUgc2VsZWN0ZWRcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBkaXIxS2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3NlbGVjdHMgdGhlIHJvb3QgYWZ0ZXIgZGVzZWxlY3RpbmcgdmlhIGNvbGxhcHNpbmcnLCAoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5zZWxlY3RTaW5nbGVOb2RlKHJvb3RLZXksIGRpcjJLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGFjdGlvbnMuY29sbGFwc2VOb2RlKHJvb3RLZXksIHJvb3RLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICBjb250cm9sbGVyLl9tb3ZlVXAoKTtcblxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIHJvb3RLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggZG91YmxlKyBuZXN0aW5nJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiDCr1xcXyjjg4QpXy/Cr1xuICAgICAgICAgICAqIEV4cGFuZCB0byBhIHZpZXcgbGlrZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogICDihpMgZml4dHVyZXNcbiAgICAgICAgICAgKiAgICAg4oaTIGRpcjFcbiAgICAgICAgICAgKiAgICAgICDCtyBmb28udHh0XG4gICAgICAgICAgICogICAgIOKGkiBkaXIyXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWN0aW9ucy5leHBhbmROb2RlKHJvb3RLZXksIHJvb3RLZXkpO1xuICAgICAgICAgIGF3YWl0IHN0b3JlLl9mZXRjaENoaWxkS2V5cyhyb290S2V5KTtcbiAgICAgICAgICBhY3Rpb25zLmV4cGFuZE5vZGUocm9vdEtleSwgZGlyMUtleSk7XG4gICAgICAgICAgYXdhaXQgc3RvcmUuX2ZldGNoQ2hpbGRLZXlzKGRpcjFLZXkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9jb2xsYXBzZUFsbCAoIGNtZCt7ICknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdjb2xsYXBzZXMgYWxsIHZpc2libGUgbm9kZXMnLCAoKSA9PiB7XG4gICAgICAgICAgY29udHJvbGxlci5fY29sbGFwc2VBbGwoKTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNFeHBhbmRlZChyb290S2V5LCByb290S2V5KSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzRXhwYW5kZWQocm9vdEtleSwgZGlyMUtleSkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9jb2xsYXBzZVNlbGVjdGlvbiAobGVmdCBhcnJvdyknLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBwYXJlbnQgaWYgdGhlIHNlbGVjdGVkIG5vZGUgaXMgYSBmaWxlJywgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShyb290S2V5LCBmb29UeHRLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGZvb1R4dEtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fY29sbGFwc2VTZWxlY3Rpb24oKTtcblxuICAgICAgICAgIC8vIGRpcjEgaXMgZm9vLnR4dCdzIHBhcmVudFxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjFLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9tb3ZlRG93bicsICgpID0+IHtcbiAgICAgICAgaXQoJ3NlbGVjdHMgdGhlIHByZXZpb3VzIG5lc3RlZCBkZXNjZW5kYW50IHdoZW4gb25lIGV4aXN0cycsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgZm9vVHh0S2V5KTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBmb29UeHRLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX21vdmVEb3duKCk7XG5cbiAgICAgICAgICAvLyBmb28udHh0IGlzIHRoZSBwcmV2aW91cyB2aXNpYmxlIGRlc2NlbmRhbnQgdG8gZGlyMlxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9tb3ZlVXAnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSBwcmV2aW91cyBuZXN0ZWQgZGVzY2VuZGFudCB3aGVuIG9uZSBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAgICAgYWN0aW9ucy5zZWxlY3RTaW5nbGVOb2RlKHJvb3RLZXksIGRpcjJLZXkpO1xuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGNvbnRyb2xsZXIuX21vdmVVcCgpO1xuXG4gICAgICAgICAgLy8gZm9vLnR4dCBpcyB0aGUgcHJldmlvdXMgdmlzaWJsZSBkZXNjZW5kYW50IHRvIGRpcjJcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBmb29UeHRLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9tb3ZlVG9Ub3AnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzZWxlY3RzIHRoZSByb290JywgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShyb290S2V5LCBkaXIyS2V5KTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBkaXIyS2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBjb250cm9sbGVyLl9tb3ZlVG9Ub3AoKTtcblxuICAgICAgICAgIC8vIHRoZSByb290IGlzIHRoZSB0b3Btb3N0IG5vZGVcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCByb290S2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3ZpYSBfbW92ZVRvQm90dG9tJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2VsZWN0cyB0aGUgYm90dG9tbW9zdCBub2RlJywgKCkgPT4ge1xuICAgICAgICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShyb290S2V5LCByb290S2V5KTtcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCByb290S2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBjb250cm9sbGVyLl9tb3ZlVG9Cb3R0b20oKTtcblxuICAgICAgICAgIC8vIGRpcjIgaXMgdGhlIGJvdHRvbW1vc3Qgbm9kZVxuICAgICAgICAgIGV4cGVjdChzdG9yZS5pc1NlbGVjdGVkKHJvb3RLZXksIGRpcjJLZXkpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYW4gZXhwYW5kZWQgKyBsb2FkaW5nIGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICogRXhwYW5kIHRvIGEgdmlldyBsaWtlIHRoZSBmb2xsb3dpbmcgd2l0aCBhIGxvYWRpbmcgKGluZGljYXRlZCBieSDihrspIGRpcjE6XG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiAgIOKGkyBmaXh0dXJlc1xuICAgICAgICAgICAqICAgICDihrsgZGlyMVxuICAgICAgICAgICAqICAgICDihpIgZGlyMlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGFjdGlvbnMuZXhwYW5kTm9kZShyb290S2V5LCByb290S2V5KTtcbiAgICAgICAgICBhd2FpdCBzdG9yZS5fZmV0Y2hDaGlsZEtleXMocm9vdEtleSk7XG4gICAgICAgICAgLy8gTWltaWMgdGhlIGxvYWRpbmcgc3RhdGUgd2hlcmUgYGRpcjFgIHJlcG9ydHMgaXRzZWxmIGFzIGV4cGFuZGVkIGJ1dCBoYXMgbm8gY2hpbGRyZW5cbiAgICAgICAgICAvLyB5ZXQuIERvbid0IHVzZSBgYWN0aW9ucy5leHBhbmROb2RlYCBiZWNhdXNlIGl0IGNhdXNlcyBhIHJlLXJlbmRlciwgd2hpY2ggcXVldWVzIGEgcmVhbFxuICAgICAgICAgIC8vIGZldGNoIGFuZCBtaWdodCBwb3B1bGF0ZSB0aGUgY2hpbGRyZW4gb2YgYGRpcjFgLiBXZSBkb24ndCB3YW50IHRoYXQuXG4gICAgICAgICAgc3RvcmUuX3NldExvYWRpbmcoZGlyMUtleSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICAgIHN0b3JlLl9zZXRFeHBhbmRlZEtleXMocm9vdEtleSwgc3RvcmUuX2dldEV4cGFuZGVkS2V5cyhyb290S2V5KS5hZGQoZGlyMUtleSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndmlhIF9tb3ZlRG93bicsICgpID0+IHtcbiAgICAgICAgaXQoJ3NlbGVjdHMgdGhlIG5leHQgc2libGluZycsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgZGlyMUtleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgZGlyMUtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZURvd24oKTtcbiAgICAgICAgICAvLyBkaXIyIGlzIGRpcjEncyBuZXh0IHNpYmxpbmdcbiAgICAgICAgICBleHBlY3Qoc3RvcmUuaXNTZWxlY3RlZChyb290S2V5LCBkaXIyS2V5KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3ZpYSBfbW92ZVVwJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2VsZWN0cyB0aGUgcHJldmlvdXMgc2libGluZycsICgpID0+IHtcbiAgICAgICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUocm9vdEtleSwgZGlyMktleSk7XG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgZGlyMktleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgY29udHJvbGxlci5fbW92ZVVwKCk7XG5cbiAgICAgICAgICAvLyBkaXIxIGlzIGRpcjIncyBwcmV2aW91cyBzaWJsaW5nXG4gICAgICAgICAgZXhwZWN0KHN0b3JlLmlzU2VsZWN0ZWQocm9vdEtleSwgZGlyMUtleSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-file-tree/spec/FileTreeController-spec.js
