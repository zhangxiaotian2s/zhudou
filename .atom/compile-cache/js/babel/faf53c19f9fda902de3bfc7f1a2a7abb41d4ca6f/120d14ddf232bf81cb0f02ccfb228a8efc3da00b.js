var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Builds a temporary folder tree structure. Receives a variargs array of leaf node names
 * and creates the structure in a temporary folder.
 * To create an empty directory as leaf pass a name with '/' suffix. E.g. '/dir1/dir2/'
 * Returns a map that maps between the node names (without the '/' suffixes) and the actual
 * paths on the file system.
 * For a deep node passed such as 'dir1/dir2/foo.txt' each of the intermediate
 * nodes 'dir1', 'dir1/dir2', 'dir1/dir2' and 'dir1/dir2/foo.txt' entries will be
 * present in the returned map
 */
/*eslint babel/no-await-in-loop:0 */

var buildTempDirTree = _asyncToGenerator(function* () {
  var rootPath = yield tempMkDir('/');
  var fileMap = new Map();

  for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
    paths[_key] = arguments[_key];
  }

  var _loop = function* (i) {
    var pathItem = paths[i];
    var arrPathItemParts = pathItem.split(_path2['default'].sep);
    var itemLocalDirPath = arrPathItemParts.slice(0, -1).join(_path2['default'].sep);
    var itemGlobalDirPath = _path2['default'].join(rootPath, itemLocalDirPath);
    var itemLocalFileName = arrPathItemParts[arrPathItemParts.length - 1];

    yield mkdir(itemGlobalDirPath);
    if (itemLocalFileName) {
      yield touch(_path2['default'].join(itemGlobalDirPath, itemLocalFileName));
    }

    arrPathItemParts.forEach(function (val, j) {
      var pathPrefix = arrPathItemParts.slice(0, j + 1).join(_path2['default'].sep);
      var prefixNodePath = _path2['default'].join(rootPath, pathPrefix);
      if (j < arrPathItemParts.length - 1 || pathPrefix.endsWith('/')) {
        prefixNodePath += '/';
      }

      fileMap.set(pathPrefix, prefixNodePath);
    });
  };

  for (var i = 0; i < paths.length; i++) {
    yield* _loop(i);
  }

  return fileMap;
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _libFileTreeActions = require('../lib/FileTreeActions');

var _libFileTreeActions2 = _interopRequireDefault(_libFileTreeActions);

var _libFileTreeHelpers = require('../lib/FileTreeHelpers');

var _libFileTreeHelpers2 = _interopRequireDefault(_libFileTreeHelpers);

var _libFileTreeStore = require('../lib/FileTreeStore');

var _libFileTreeStore2 = _interopRequireDefault(_libFileTreeStore);

var _nuclideTestHelpers = require('nuclide-test-helpers');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nuclideCommons = require('nuclide-commons');

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _fsPlus = require('fs-plus');

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

'use babel';

_temp2['default'].track();
var tempMkDir = (0, _nuclideCommons.denodeify)(_temp2['default'].mkdir);
var tempCleanup = (0, _nuclideCommons.denodeify)(_temp2['default'].cleanup);

var mkdir = (0, _nuclideCommons.denodeify)(_fsPlus.makeTree);

var touch = (0, _nuclideCommons.denodeify)(_touch2['default']);

var MockRepository = (function () {
  function MockRepository() {
    _classCallCheck(this, MockRepository);
  }

  _createClass(MockRepository, [{
    key: 'isProjectAtRoot',
    value: function isProjectAtRoot() {
      return true;
    }
  }, {
    key: 'isPathIgnored',
    value: function isPathIgnored() {
      return true;
    }
  }]);

  return MockRepository;
})();

describe('FileTreeStore', function () {
  var dir1 = '';
  var fooTxt = '';
  var dir2 = '';

  var actions = _libFileTreeActions2['default'].getInstance();
  var store = _libFileTreeStore2['default'].getInstance();

  /*
   * `getChildKeys` is the public API used by UIs. It queues Promises, which are stored in the
   * `isLoading` map. Fetch via the public API and return the **internal-only** Promise to enable
   * tests to await loading children.
   */
  function loadChildKeys(rootKey, nodeKey) {
    store.getChildKeys(rootKey, nodeKey);
    return Promise.resolve(store._getLoading(nodeKey));
  }

  beforeEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var tmpFixturesDir = yield _nuclideTestHelpers.fixtures.copyFixture('.', __dirname);
      dir1 = _path2['default'].join(tmpFixturesDir, 'dir1');
      fooTxt = _path2['default'].join(dir1, 'foo.txt');
      dir2 = _path2['default'].join(tmpFixturesDir, 'dir2');
    }));
  });

  afterEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      store.reset();
      yield tempCleanup();
    }));
  });

  it('should be initialized with no root keys', function () {
    var rootKeys = store.getRootKeys();
    expect(Array.isArray(rootKeys)).toBe(true);
    expect(rootKeys.length).toBe(0);
  });

  describe('isEmpty', function () {
    it('returns true when the store is empty, has no roots', function () {
      expect(store.isEmpty()).toBe(true);
    });

    it('returns false when the store has data, has roots', function () {
      actions.setRootKeys([dir1]);
      expect(store.isEmpty()).toBe(false);
    });
  });

  it('should update root keys via actions', function () {
    actions.setRootKeys([dir1, dir2]);
    var rootKeys = store.getRootKeys();
    expect(Array.isArray(rootKeys)).toBe(true);
    expect(rootKeys.join('|')).toBe(dir1 + '|' + dir2);
  });

  it('should expand root keys as they are added', function () {
    var rootKey = _path2['default'].join(__dirname, 'fixtures') + '/';
    actions.setRootKeys([rootKey]);
    var node = store.getNode(rootKey, rootKey);
    expect(node.isExpanded()).toBe(true);
  });

  it('should consider non-existent keys collapsed', function () {
    var rootKey = _path2['default'].join(__dirname, 'fixtures') + '/';
    var node = store.getNode(rootKey, rootKey + 'asdf');
    expect(node.isExpanded()).toBe(false);
  });

  it('toggles selected items', function () {
    actions.setRootKeys([dir1]);
    actions.toggleSelectNode(dir1, dir1);
    var node = store.getNode(dir1, dir1);
    expect(node.isSelected()).toBe(true);
    actions.toggleSelectNode(dir1, dir1);
    expect(node.isSelected()).toBe(false);
  });

  it('deselects items in other roots when a single node is selected', function () {
    actions.setRootKeys([dir1, dir2]);
    actions.toggleSelectNode(dir1, dir1);
    var node1 = store.getNode(dir1, dir1);
    var node2 = store.getNode(dir2, dir2);

    // Node 1 is selected, node 2 is not selected
    expect(node1.isSelected()).toBe(true);
    expect(node2.isSelected()).toBe(false);

    // Selecting a single node, node2, deselects nodes in all other roots
    actions.selectSingleNode(dir2, dir2);
    expect(node1.isSelected()).toBe(false);
    expect(node2.isSelected()).toBe(true);
  });

  describe('getSelectedKeys', function () {
    beforeEach(function () {
      /*
       * Create two roots and select them both. It'll look like the following:
       *
       *   → **dir1**
       *   → **dir2**
       */
      actions.setRootKeys([dir1, dir2]);
      actions.toggleSelectNode(dir1, dir1);
      actions.toggleSelectNode(dir2, dir2);
    });

    it('returns selected nodes from all roots when no argument is given', function () {
      // Convert the `Immutable.Set` to a native `Array` for simpler use w/ Jasmine.
      var selectedNodes = store.getSelectedKeys().toArray();
      expect(selectedNodes).toEqual([dir1, dir2]);
    });

    it('returns selected nodes from a specific root', function () {
      // Convert the `Immutable.Set` to a native `Array` for simpler use w/ Jasmine.
      var selectedNodes = store.getSelectedKeys(dir1).toArray();
      expect(selectedNodes).toEqual([dir1]);
    });
  });

  describe('getSelectedNodes', function () {
    it('returns selected nodes from all roots', function () {
      actions.setRootKeys([dir1, dir2]);
      actions.toggleSelectNode(dir1, dir1);
      actions.toggleSelectNode(dir2, dir2);

      // Convert the `Immutable.Set` to a native `Array` for simpler use w/ Jasmine.
      var selectedNodes = store.getSelectedNodes().map(function (node) {
        return node.nodeKey;
      }).toArray();
      expect(selectedNodes).toEqual([dir1, dir2]);
    });

    it('returns an empty Set when no nodes are selected', function () {
      var selectedNodes = store.getSelectedNodes().map(function (node) {
        return node.nodeKey;
      }).toArray();
      expect(selectedNodes).toEqual([]);
    });
  });

  describe('getSingleSelectedNode', function () {
    beforeEach(function () {
      /*
       * Create two roots. It'll look like the following:
       *
       *   → dir1
       *   → dir2
       */
      actions.setRootKeys([dir1, dir2]);
    });

    it('returns null when no nodes are selected', function () {
      expect(store.getSingleSelectedNode()).toBeNull();
    });

    it('returns null when more than 1 node is selected', function () {
      actions.toggleSelectNode(dir1, dir1);
      actions.toggleSelectNode(dir2, dir2);
      expect(store.getSingleSelectedNode()).toBeNull();
    });

    it('returns a node when only 1 is selected', function () {
      actions.toggleSelectNode(dir2, dir2);
      expect(store.getSingleSelectedNode().nodeKey).toEqual(dir2);
    });
  });

  describe('trackedNode', function () {
    it('resets when there is a new selection', function () {
      actions.setRootKeys([dir1]);
      actions.setTrackedNode(dir1, dir1);

      // Root is tracked after setting it.
      var trackedNode = store.getTrackedNode();
      expect(trackedNode && trackedNode.nodeKey).toBe(dir1);
      actions.selectSingleNode(dir1, dir1);

      // New selection, which happens on user interaction via select and collapse, resets the
      // tracked node.
      expect(store.getTrackedNode()).toBe(null);
    });
  });

  describe('getChildKeys', function () {
    it("clears loading and expanded states when there's an error fetching children", function () {
      waitsForPromise(_asyncToGenerator(function* () {
        actions.setRootKeys([dir1]);
        actions.expandNode(dir1, fooTxt);
        expect(store.isExpanded(dir1, fooTxt)).toBe(true);
        store.getChildKeys(dir1, fooTxt);
        expect(store.isLoading(dir1, fooTxt)).toBe(true);

        try {
          yield loadChildKeys(fooTxt, fooTxt);
        } catch (e) {
          // This will always throw an exception, but that's irrelevant to this test. The side
          // effects after this try/catch capture the purpose of this test.
        }

        expect(store.isExpanded(dir1, fooTxt)).toBe(false);
        expect(store.isLoading(dir1, fooTxt)).toBe(false);
      }));
    });
  });

  it('omits hidden nodes', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      actions.setRootKeys([dir1]);
      actions.expandNode(dir1, fooTxt);
      actions.setIgnoredNames(['foo.*']);

      yield loadChildKeys(dir1, dir1);

      expect(store.getChildKeys(dir1, dir1).length).toBe(0);
    }));
  });

  it('shows nodes if the pattern changes to no longer match', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      actions.setRootKeys([dir1]);
      actions.expandNode(dir1, fooTxt);
      actions.setIgnoredNames(['foo.*']);

      yield loadChildKeys(dir1, dir1);

      actions.setIgnoredNames(['bar.*']);
      expect(store.getChildKeys(dir1, dir1).length).toBe(1);
    }));
  });

  it('obeys the hideIgnoredNames setting', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      actions.setRootKeys([dir1]);
      actions.expandNode(dir1, fooTxt);
      actions.setIgnoredNames(['foo.*']);
      actions.setHideIgnoredNames(false);

      yield loadChildKeys(dir1, dir1);

      expect(store.getChildKeys(dir1, dir1).length).toBe(1);
    }));
  });

  describe('recovering from failed subscriptions', function () {
    it('fetches children on re-expansion of failed directories', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var unsubscribeableDir = new _atom.Directory(dir1);
        // Force subscription to fail to mimic network failure, etc.
        spyOn(unsubscribeableDir, 'onDidChange').andCallFake(function () {
          throw new Error('This error **should** be thrown.');
        });

        // Return the always-fail directory when it is expanded.
        spyOn(_libFileTreeHelpers2['default'], 'getDirectoryByKey').andReturn(unsubscribeableDir);

        actions.setRootKeys([dir1]);
        actions.expandNode(dir1, dir1);
        yield loadChildKeys(dir1, dir1);

        // Children should load but the subscription should fail.
        expect(store.getCachedChildKeys(dir1, dir1)).toEqual([fooTxt]);

        // Add a new file, 'bar.baz', for which the store will not get a notification because
        // the subscription failed.
        var barBaz = _path2['default'].join(dir1, 'bar.baz');
        _fs2['default'].writeFileSync(barBaz, '');
        yield loadChildKeys(dir1, dir1);
        expect(store.getCachedChildKeys(dir1, dir1)).toEqual([fooTxt]);

        // Collapsing and re-expanding a directory should forcibly fetch its children regardless of
        // whether a subscription is possible.
        actions.collapseNode(dir1, dir1);
        actions.expandNode(dir1, dir1);
        yield loadChildKeys(dir1, dir1);

        // The subscription should fail again, but the children should be refetched and match the
        // changed structure (i.e. include the new 'bar.baz' file).
        expect(store.getCachedChildKeys(dir1, dir1)).toEqual([barBaz, fooTxt]);
      }));
    });
  });

  it('omits vcs-excluded paths', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      actions.setRootKeys([dir1]);
      actions.expandNode(dir1, fooTxt);
      actions.setExcludeVcsIgnoredPaths(true);

      var mockRepo = new MockRepository();
      spyOn(store, '_repositoryForPath').andReturn(mockRepo);

      yield loadChildKeys(dir1, dir1);
      expect(store.getCachedChildKeys(dir1, dir1).length).toBe(0);
    }));
  });

  it('includes vcs-excluded paths when told to', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      actions.setRootKeys([dir1]);
      actions.expandNode(dir1, fooTxt);
      actions.setExcludeVcsIgnoredPaths(false);

      var mockRepo = new MockRepository();
      spyOn(store, '_repositoryForPath').andReturn(mockRepo);

      yield loadChildKeys(dir1, dir1);
      expect(store.getCachedChildKeys(dir1, dir1).length).toBe(1);
    }));
  });

  it('expands deep nested structure of the node', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var map = yield buildTempDirTree('dir3/dir31/foo31.txt', 'dir3/dir32/bar32.txt');
      var dir3 = map.get('dir3');
      var dir31 = map.get('dir3/dir31');
      actions.setRootKeys([dir3]);

      // Await **internal-only** API because the public `expandNodeDeep` API does not
      // return the promise that can be awaited on
      yield store._expandNodeDeep(dir3, dir3);
      expect(store.getChildKeys(dir31, dir31).length).toBe(1);
    }));
  });

  it('collapses deep nested structore', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var map = yield buildTempDirTree('dir3/dir31/foo31.txt', 'dir3/dir32/bar32.txt');
      var dir3 = map.get('dir3');
      var dir31 = map.get('dir3/dir31');
      actions.setRootKeys([dir3]);

      // Await **internal-only** API because the public `expandNodeDeep` API does not
      // return the promise that can be awaited on
      yield store._expandNodeDeep(dir3, dir3);
      expect(store.isExpanded(dir3, dir31)).toBe(true);
      actions.collapseNodeDeep(dir3, dir3);
      expect(store.isExpanded(dir3, dir31)).toBe(false);
    }));
  });

  it('stops expanding after adding 100 items to the tree in BFS order', function () {
    waitsForPromise(_asyncToGenerator(function* () {
      var arrFiles = [];
      for (var i = 0; i < 100; i++) {
        arrFiles.push('dir3/dir31/foo' + i + '.txt');
      }
      arrFiles.push('dir3/dir32/bar.txt');

      var map = yield buildTempDirTree.apply(undefined, arrFiles);
      var dir3 = map.get('dir3');
      var dir31 = map.get('dir3/dir31');
      var dir32 = map.get('dir3/dir32');
      actions.setRootKeys([dir3]);

      // Await **internal-only** API because the public `expandNodeDeep` API does not
      // return the promise that can be awaited on
      yield store._expandNodeDeep(dir3, dir3);
      expect(store.isExpanded(dir3, dir31)).toBe(true);
      expect(store.isExpanded(dir3, dir32)).toBe(false);
    }));
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvRmlsZVRyZWVTdG9yZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBcURlLGdCQUFnQixxQkFBL0IsYUFBdUY7QUFDckYsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7b0NBRk8sS0FBSztBQUFMLFNBQUs7Ozt5QkFJN0IsQ0FBQztBQUNSLFFBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixRQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsa0JBQVcsR0FBRyxDQUFDLENBQUM7QUFDeEQsUUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQzVFLFFBQU0saUJBQWlCLEdBQUcsa0JBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RFLFFBQU0saUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUV4RSxVQUFNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9CLFFBQUksaUJBQWlCLEVBQUU7QUFDckIsWUFBTSxLQUFLLENBQUMsa0JBQVcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztLQUNwRTs7QUFFRCxvQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFLO0FBQ25DLFVBQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FB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Q0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxZQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkQsRUFBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZmlsZS10cmVlL3NwZWMvRmlsZVRyZWVTdG9yZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rvcnl9IGZyb20gJ2F0b20nO1xuaW1wb3J0IEZpbGVUcmVlQWN0aW9ucyBmcm9tICcuLi9saWIvRmlsZVRyZWVBY3Rpb25zJztcbmltcG9ydCBGaWxlVHJlZUhlbHBlcnMgZnJvbSAnLi4vbGliL0ZpbGVUcmVlSGVscGVycyc7XG5pbXBvcnQgRmlsZVRyZWVTdG9yZSBmcm9tICcuLi9saWIvRmlsZVRyZWVTdG9yZSc7XG5cbmltcG9ydCB7Zml4dHVyZXN9IGZyb20gJ251Y2xpZGUtdGVzdC1oZWxwZXJzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aE1vZHVsZSBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtkZW5vZGVpZnl9IGZyb20gJ251Y2xpZGUtY29tbW9ucyc7XG5cbmltcG9ydCB0ZW1wTW9kdWxlIGZyb20gJ3RlbXAnO1xudGVtcE1vZHVsZS50cmFjaygpO1xuY29uc3QgdGVtcE1rRGlyID0gZGVub2RlaWZ5KHRlbXBNb2R1bGUubWtkaXIpO1xuY29uc3QgdGVtcENsZWFudXAgPSBkZW5vZGVpZnkodGVtcE1vZHVsZS5jbGVhbnVwKTtcblxuaW1wb3J0IHttYWtlVHJlZX0gZnJvbSAnZnMtcGx1cyc7XG5jb25zdCBta2RpciA9IGRlbm9kZWlmeShtYWtlVHJlZSk7XG5cbmltcG9ydCB0b3VjaE1vZHVsZSBmcm9tICd0b3VjaCc7XG5jb25zdCB0b3VjaCA9IGRlbm9kZWlmeSh0b3VjaE1vZHVsZSk7XG5cbmNsYXNzIE1vY2tSZXBvc2l0b3J5IHtcbiAgaXNQcm9qZWN0QXRSb290KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlzUGF0aElnbm9yZWQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZHMgYSB0ZW1wb3JhcnkgZm9sZGVyIHRyZWUgc3RydWN0dXJlLiBSZWNlaXZlcyBhIHZhcmlhcmdzIGFycmF5IG9mIGxlYWYgbm9kZSBuYW1lc1xuICogYW5kIGNyZWF0ZXMgdGhlIHN0cnVjdHVyZSBpbiBhIHRlbXBvcmFyeSBmb2xkZXIuXG4gKiBUbyBjcmVhdGUgYW4gZW1wdHkgZGlyZWN0b3J5IGFzIGxlYWYgcGFzcyBhIG5hbWUgd2l0aCAnLycgc3VmZml4LiBFLmcuICcvZGlyMS9kaXIyLydcbiAqIFJldHVybnMgYSBtYXAgdGhhdCBtYXBzIGJldHdlZW4gdGhlIG5vZGUgbmFtZXMgKHdpdGhvdXQgdGhlICcvJyBzdWZmaXhlcykgYW5kIHRoZSBhY3R1YWxcbiAqIHBhdGhzIG9uIHRoZSBmaWxlIHN5c3RlbS5cbiAqIEZvciBhIGRlZXAgbm9kZSBwYXNzZWQgc3VjaCBhcyAnZGlyMS9kaXIyL2Zvby50eHQnIGVhY2ggb2YgdGhlIGludGVybWVkaWF0ZVxuICogbm9kZXMgJ2RpcjEnLCAnZGlyMS9kaXIyJywgJ2RpcjEvZGlyMicgYW5kICdkaXIxL2RpcjIvZm9vLnR4dCcgZW50cmllcyB3aWxsIGJlXG4gKiBwcmVzZW50IGluIHRoZSByZXR1cm5lZCBtYXBcbiAqL1xuIC8qZXNsaW50IGJhYmVsL25vLWF3YWl0LWluLWxvb3A6MCAqL1xuYXN5bmMgZnVuY3Rpb24gYnVpbGRUZW1wRGlyVHJlZSguLi5wYXRoczogQXJyYXk8c3RyaW5nPik6IFByb21pc2U8TWFwPHN0cmluZywgc3RyaW5nPj4ge1xuICBjb25zdCByb290UGF0aCA9IGF3YWl0IHRlbXBNa0RpcignLycpO1xuICBjb25zdCBmaWxlTWFwID0gbmV3IE1hcCgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoSXRlbSA9IHBhdGhzW2ldO1xuICAgIGNvbnN0IGFyclBhdGhJdGVtUGFydHMgPSBwYXRoSXRlbS5zcGxpdChwYXRoTW9kdWxlLnNlcCk7XG4gICAgY29uc3QgaXRlbUxvY2FsRGlyUGF0aCA9IGFyclBhdGhJdGVtUGFydHMuc2xpY2UoMCwgLTEpLmpvaW4ocGF0aE1vZHVsZS5zZXApO1xuICAgIGNvbnN0IGl0ZW1HbG9iYWxEaXJQYXRoID0gcGF0aE1vZHVsZS5qb2luKHJvb3RQYXRoLCBpdGVtTG9jYWxEaXJQYXRoKTtcbiAgICBjb25zdCBpdGVtTG9jYWxGaWxlTmFtZSA9IGFyclBhdGhJdGVtUGFydHNbYXJyUGF0aEl0ZW1QYXJ0cy5sZW5ndGggLSAxXTtcblxuICAgIGF3YWl0IG1rZGlyKGl0ZW1HbG9iYWxEaXJQYXRoKTtcbiAgICBpZiAoaXRlbUxvY2FsRmlsZU5hbWUpIHtcbiAgICAgIGF3YWl0IHRvdWNoKHBhdGhNb2R1bGUuam9pbihpdGVtR2xvYmFsRGlyUGF0aCwgaXRlbUxvY2FsRmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBhcnJQYXRoSXRlbVBhcnRzLmZvckVhY2goKHZhbCwgaikgPT4ge1xuICAgICAgY29uc3QgcGF0aFByZWZpeCA9IGFyclBhdGhJdGVtUGFydHMuc2xpY2UoMCwgaiArIDEpLmpvaW4ocGF0aE1vZHVsZS5zZXApO1xuICAgICAgbGV0IHByZWZpeE5vZGVQYXRoID0gcGF0aE1vZHVsZS5qb2luKHJvb3RQYXRoLCBwYXRoUHJlZml4KTtcbiAgICAgIGlmIChqIDwgYXJyUGF0aEl0ZW1QYXJ0cy5sZW5ndGggLSAxIHx8IHBhdGhQcmVmaXguZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICBwcmVmaXhOb2RlUGF0aCArPSAnLyc7XG4gICAgICB9XG5cbiAgICAgIGZpbGVNYXAuc2V0KHBhdGhQcmVmaXgsIHByZWZpeE5vZGVQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmaWxlTWFwO1xufVxuXG5kZXNjcmliZSgnRmlsZVRyZWVTdG9yZScsICgpID0+IHtcbiAgbGV0IGRpcjEgPSAnJztcbiAgbGV0IGZvb1R4dCA9ICcnO1xuICBsZXQgZGlyMiA9ICcnO1xuXG4gIGNvbnN0IGFjdGlvbnM6IEZpbGVUcmVlQWN0aW9ucyA9IEZpbGVUcmVlQWN0aW9ucy5nZXRJbnN0YW5jZSgpO1xuICBjb25zdCBzdG9yZTogRmlsZVRyZWVTdG9yZSA9IEZpbGVUcmVlU3RvcmUuZ2V0SW5zdGFuY2UoKTtcblxuICAvKlxuICAgKiBgZ2V0Q2hpbGRLZXlzYCBpcyB0aGUgcHVibGljIEFQSSB1c2VkIGJ5IFVJcy4gSXQgcXVldWVzIFByb21pc2VzLCB3aGljaCBhcmUgc3RvcmVkIGluIHRoZVxuICAgKiBgaXNMb2FkaW5nYCBtYXAuIEZldGNoIHZpYSB0aGUgcHVibGljIEFQSSBhbmQgcmV0dXJuIHRoZSAqKmludGVybmFsLW9ubHkqKiBQcm9taXNlIHRvIGVuYWJsZVxuICAgKiB0ZXN0cyB0byBhd2FpdCBsb2FkaW5nIGNoaWxkcmVuLlxuICAgKi9cbiAgZnVuY3Rpb24gbG9hZENoaWxkS2V5cyhyb290S2V5OiBzdHJpbmcsIG5vZGVLZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHN0b3JlLmdldENoaWxkS2V5cyhyb290S2V5LCBub2RlS2V5KTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN0b3JlLl9nZXRMb2FkaW5nKG5vZGVLZXkpKTtcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0bXBGaXh0dXJlc0RpciA9IGF3YWl0IGZpeHR1cmVzLmNvcHlGaXh0dXJlKCcuJywgX19kaXJuYW1lKTtcbiAgICAgIGRpcjEgPSBwYXRoTW9kdWxlLmpvaW4odG1wRml4dHVyZXNEaXIsICdkaXIxJyk7XG4gICAgICBmb29UeHQgPSBwYXRoTW9kdWxlLmpvaW4oZGlyMSwgJ2Zvby50eHQnKTtcbiAgICAgIGRpcjIgPSBwYXRoTW9kdWxlLmpvaW4odG1wRml4dHVyZXNEaXIsICdkaXIyJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIHN0b3JlLnJlc2V0KCk7XG4gICAgICBhd2FpdCB0ZW1wQ2xlYW51cCgpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGJlIGluaXRpYWxpemVkIHdpdGggbm8gcm9vdCBrZXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3RLZXlzID0gc3RvcmUuZ2V0Um9vdEtleXMoKTtcbiAgICBleHBlY3QoQXJyYXkuaXNBcnJheShyb290S2V5cykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHJvb3RLZXlzLmxlbmd0aCkudG9CZSgwKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzRW1wdHknLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIHRoZSBzdG9yZSBpcyBlbXB0eSwgaGFzIG5vIHJvb3RzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHN0b3JlLmlzRW1wdHkoKSkudG9CZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gdGhlIHN0b3JlIGhhcyBkYXRhLCBoYXMgcm9vdHMnLCAoKSA9PiB7XG4gICAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIxXSk7XG4gICAgICBleHBlY3Qoc3RvcmUuaXNFbXB0eSgpKS50b0JlKGZhbHNlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1cGRhdGUgcm9vdCBrZXlzIHZpYSBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjEsIGRpcjJdKTtcbiAgICBjb25zdCByb290S2V5cyA9IHN0b3JlLmdldFJvb3RLZXlzKCk7XG4gICAgZXhwZWN0KEFycmF5LmlzQXJyYXkocm9vdEtleXMpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChyb290S2V5cy5qb2luKCd8JykpLnRvQmUoYCR7ZGlyMX18JHtkaXIyfWApO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGV4cGFuZCByb290IGtleXMgYXMgdGhleSBhcmUgYWRkZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdEtleSA9IHBhdGhNb2R1bGUuam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpICsgJy8nO1xuICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW3Jvb3RLZXldKTtcbiAgICBjb25zdCBub2RlID0gc3RvcmUuZ2V0Tm9kZShyb290S2V5LCByb290S2V5KTtcbiAgICBleHBlY3Qobm9kZS5pc0V4cGFuZGVkKCkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY29uc2lkZXIgbm9uLWV4aXN0ZW50IGtleXMgY29sbGFwc2VkJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3RLZXkgPSBwYXRoTW9kdWxlLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnKSArICcvJztcbiAgICBjb25zdCBub2RlID0gc3RvcmUuZ2V0Tm9kZShyb290S2V5LCByb290S2V5ICsgJ2FzZGYnKTtcbiAgICBleHBlY3Qobm9kZS5pc0V4cGFuZGVkKCkpLnRvQmUoZmFsc2UpO1xuICB9KTtcblxuICBpdCgndG9nZ2xlcyBzZWxlY3RlZCBpdGVtcycsICgpID0+IHtcbiAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIxXSk7XG4gICAgYWN0aW9ucy50b2dnbGVTZWxlY3ROb2RlKGRpcjEsIGRpcjEpO1xuICAgIGNvbnN0IG5vZGUgPSBzdG9yZS5nZXROb2RlKGRpcjEsIGRpcjEpO1xuICAgIGV4cGVjdChub2RlLmlzU2VsZWN0ZWQoKSkudG9CZSh0cnVlKTtcbiAgICBhY3Rpb25zLnRvZ2dsZVNlbGVjdE5vZGUoZGlyMSwgZGlyMSk7XG4gICAgZXhwZWN0KG5vZGUuaXNTZWxlY3RlZCgpKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoJ2Rlc2VsZWN0cyBpdGVtcyBpbiBvdGhlciByb290cyB3aGVuIGEgc2luZ2xlIG5vZGUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgYWN0aW9ucy5zZXRSb290S2V5cyhbZGlyMSwgZGlyMl0pO1xuICAgIGFjdGlvbnMudG9nZ2xlU2VsZWN0Tm9kZShkaXIxLCBkaXIxKTtcbiAgICBjb25zdCBub2RlMSA9IHN0b3JlLmdldE5vZGUoZGlyMSwgZGlyMSk7XG4gICAgY29uc3Qgbm9kZTIgPSBzdG9yZS5nZXROb2RlKGRpcjIsIGRpcjIpO1xuXG4gICAgLy8gTm9kZSAxIGlzIHNlbGVjdGVkLCBub2RlIDIgaXMgbm90IHNlbGVjdGVkXG4gICAgZXhwZWN0KG5vZGUxLmlzU2VsZWN0ZWQoKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3Qobm9kZTIuaXNTZWxlY3RlZCgpKS50b0JlKGZhbHNlKTtcblxuICAgIC8vIFNlbGVjdGluZyBhIHNpbmdsZSBub2RlLCBub2RlMiwgZGVzZWxlY3RzIG5vZGVzIGluIGFsbCBvdGhlciByb290c1xuICAgIGFjdGlvbnMuc2VsZWN0U2luZ2xlTm9kZShkaXIyLCBkaXIyKTtcbiAgICBleHBlY3Qobm9kZTEuaXNTZWxlY3RlZCgpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3Qobm9kZTIuaXNTZWxlY3RlZCgpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0U2VsZWN0ZWRLZXlzJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgLypcbiAgICAgICAqIENyZWF0ZSB0d28gcm9vdHMgYW5kIHNlbGVjdCB0aGVtIGJvdGguIEl0J2xsIGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxuICAgICAgICpcbiAgICAgICAqICAg4oaSICoqZGlyMSoqXG4gICAgICAgKiAgIOKGkiAqKmRpcjIqKlxuICAgICAgICovXG4gICAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIxLCBkaXIyXSk7XG4gICAgICBhY3Rpb25zLnRvZ2dsZVNlbGVjdE5vZGUoZGlyMSwgZGlyMSk7XG4gICAgICBhY3Rpb25zLnRvZ2dsZVNlbGVjdE5vZGUoZGlyMiwgZGlyMik7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBzZWxlY3RlZCBub2RlcyBmcm9tIGFsbCByb290cyB3aGVuIG5vIGFyZ3VtZW50IGlzIGdpdmVuJywgKCkgPT4ge1xuICAgICAgLy8gQ29udmVydCB0aGUgYEltbXV0YWJsZS5TZXRgIHRvIGEgbmF0aXZlIGBBcnJheWAgZm9yIHNpbXBsZXIgdXNlIHcvIEphc21pbmUuXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gc3RvcmUuZ2V0U2VsZWN0ZWRLZXlzKCkudG9BcnJheSgpO1xuICAgICAgZXhwZWN0KHNlbGVjdGVkTm9kZXMpLnRvRXF1YWwoW2RpcjEsIGRpcjJdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHNlbGVjdGVkIG5vZGVzIGZyb20gYSBzcGVjaWZpYyByb290JywgKCkgPT4ge1xuICAgICAgLy8gQ29udmVydCB0aGUgYEltbXV0YWJsZS5TZXRgIHRvIGEgbmF0aXZlIGBBcnJheWAgZm9yIHNpbXBsZXIgdXNlIHcvIEphc21pbmUuXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gc3RvcmUuZ2V0U2VsZWN0ZWRLZXlzKGRpcjEpLnRvQXJyYXkoKTtcbiAgICAgIGV4cGVjdChzZWxlY3RlZE5vZGVzKS50b0VxdWFsKFtkaXIxXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRTZWxlY3RlZE5vZGVzJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHNlbGVjdGVkIG5vZGVzIGZyb20gYWxsIHJvb3RzJywgKCkgPT4ge1xuICAgICAgYWN0aW9ucy5zZXRSb290S2V5cyhbZGlyMSwgZGlyMl0pO1xuICAgICAgYWN0aW9ucy50b2dnbGVTZWxlY3ROb2RlKGRpcjEsIGRpcjEpO1xuICAgICAgYWN0aW9ucy50b2dnbGVTZWxlY3ROb2RlKGRpcjIsIGRpcjIpO1xuXG4gICAgICAvLyBDb252ZXJ0IHRoZSBgSW1tdXRhYmxlLlNldGAgdG8gYSBuYXRpdmUgYEFycmF5YCBmb3Igc2ltcGxlciB1c2Ugdy8gSmFzbWluZS5cbiAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBzdG9yZS5nZXRTZWxlY3RlZE5vZGVzKCkubWFwKG5vZGUgPT4gbm9kZS5ub2RlS2V5KS50b0FycmF5KCk7XG4gICAgICBleHBlY3Qoc2VsZWN0ZWROb2RlcykudG9FcXVhbChbZGlyMSwgZGlyMl0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgYW4gZW1wdHkgU2V0IHdoZW4gbm8gbm9kZXMgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHN0b3JlLmdldFNlbGVjdGVkTm9kZXMoKS5tYXAobm9kZSA9PiBub2RlLm5vZGVLZXkpLnRvQXJyYXkoKTtcbiAgICAgIGV4cGVjdChzZWxlY3RlZE5vZGVzKS50b0VxdWFsKFtdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFNpbmdsZVNlbGVjdGVkTm9kZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIC8qXG4gICAgICAgKiBDcmVhdGUgdHdvIHJvb3RzLiBJdCdsbCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgICAgICAqXG4gICAgICAgKiAgIOKGkiBkaXIxXG4gICAgICAgKiAgIOKGkiBkaXIyXG4gICAgICAgKi9cbiAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjEsIGRpcjJdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIG51bGwgd2hlbiBubyBub2RlcyBhcmUgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0U2luZ2xlU2VsZWN0ZWROb2RlKCkpLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBudWxsIHdoZW4gbW9yZSB0aGFuIDEgbm9kZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGFjdGlvbnMudG9nZ2xlU2VsZWN0Tm9kZShkaXIxLCBkaXIxKTtcbiAgICAgIGFjdGlvbnMudG9nZ2xlU2VsZWN0Tm9kZShkaXIyLCBkaXIyKTtcbiAgICAgIGV4cGVjdChzdG9yZS5nZXRTaW5nbGVTZWxlY3RlZE5vZGUoKSkudG9CZU51bGwoKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgbm9kZSB3aGVuIG9ubHkgMSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGFjdGlvbnMudG9nZ2xlU2VsZWN0Tm9kZShkaXIyLCBkaXIyKTtcbiAgICAgIGV4cGVjdChzdG9yZS5nZXRTaW5nbGVTZWxlY3RlZE5vZGUoKS5ub2RlS2V5KS50b0VxdWFsKGRpcjIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndHJhY2tlZE5vZGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Jlc2V0cyB3aGVuIHRoZXJlIGlzIGEgbmV3IHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjFdKTtcbiAgICAgIGFjdGlvbnMuc2V0VHJhY2tlZE5vZGUoZGlyMSwgZGlyMSk7XG5cbiAgICAgIC8vIFJvb3QgaXMgdHJhY2tlZCBhZnRlciBzZXR0aW5nIGl0LlxuICAgICAgY29uc3QgdHJhY2tlZE5vZGUgPSBzdG9yZS5nZXRUcmFja2VkTm9kZSgpO1xuICAgICAgZXhwZWN0KHRyYWNrZWROb2RlICYmIHRyYWNrZWROb2RlLm5vZGVLZXkpLnRvQmUoZGlyMSk7XG4gICAgICBhY3Rpb25zLnNlbGVjdFNpbmdsZU5vZGUoZGlyMSwgZGlyMSk7XG5cbiAgICAgIC8vIE5ldyBzZWxlY3Rpb24sIHdoaWNoIGhhcHBlbnMgb24gdXNlciBpbnRlcmFjdGlvbiB2aWEgc2VsZWN0IGFuZCBjb2xsYXBzZSwgcmVzZXRzIHRoZVxuICAgICAgLy8gdHJhY2tlZCBub2RlLlxuICAgICAgZXhwZWN0KHN0b3JlLmdldFRyYWNrZWROb2RlKCkpLnRvQmUobnVsbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRDaGlsZEtleXMnLCAoKSA9PiB7XG4gICAgaXQoXCJjbGVhcnMgbG9hZGluZyBhbmQgZXhwYW5kZWQgc3RhdGVzIHdoZW4gdGhlcmUncyBhbiBlcnJvciBmZXRjaGluZyBjaGlsZHJlblwiLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIxXSk7XG4gICAgICAgIGFjdGlvbnMuZXhwYW5kTm9kZShkaXIxLCBmb29UeHQpO1xuICAgICAgICBleHBlY3Qoc3RvcmUuaXNFeHBhbmRlZChkaXIxLCBmb29UeHQpKS50b0JlKHRydWUpO1xuICAgICAgICBzdG9yZS5nZXRDaGlsZEtleXMoZGlyMSwgZm9vVHh0KTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmlzTG9hZGluZyhkaXIxLCBmb29UeHQpKS50b0JlKHRydWUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgbG9hZENoaWxkS2V5cyhmb29UeHQsIGZvb1R4dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBUaGlzIHdpbGwgYWx3YXlzIHRocm93IGFuIGV4Y2VwdGlvbiwgYnV0IHRoYXQncyBpcnJlbGV2YW50IHRvIHRoaXMgdGVzdC4gVGhlIHNpZGVcbiAgICAgICAgICAvLyBlZmZlY3RzIGFmdGVyIHRoaXMgdHJ5L2NhdGNoIGNhcHR1cmUgdGhlIHB1cnBvc2Ugb2YgdGhpcyB0ZXN0LlxuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KHN0b3JlLmlzRXhwYW5kZWQoZGlyMSwgZm9vVHh0KSkudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChzdG9yZS5pc0xvYWRpbmcoZGlyMSwgZm9vVHh0KSkudG9CZShmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ29taXRzIGhpZGRlbiBub2RlcycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgYWN0aW9ucy5zZXRSb290S2V5cyhbZGlyMV0pO1xuICAgICAgYWN0aW9ucy5leHBhbmROb2RlKGRpcjEsIGZvb1R4dCk7XG4gICAgICBhY3Rpb25zLnNldElnbm9yZWROYW1lcyhbJ2Zvby4qJ10pO1xuXG4gICAgICBhd2FpdCBsb2FkQ2hpbGRLZXlzKGRpcjEsIGRpcjEpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0Q2hpbGRLZXlzKGRpcjEsIGRpcjEpLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3dzIG5vZGVzIGlmIHRoZSBwYXR0ZXJuIGNoYW5nZXMgdG8gbm8gbG9uZ2VyIG1hdGNoJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIxXSk7XG4gICAgICBhY3Rpb25zLmV4cGFuZE5vZGUoZGlyMSwgZm9vVHh0KTtcbiAgICAgIGFjdGlvbnMuc2V0SWdub3JlZE5hbWVzKFsnZm9vLionXSk7XG5cbiAgICAgIGF3YWl0IGxvYWRDaGlsZEtleXMoZGlyMSwgZGlyMSk7XG5cbiAgICAgIGFjdGlvbnMuc2V0SWdub3JlZE5hbWVzKFsnYmFyLionXSk7XG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0Q2hpbGRLZXlzKGRpcjEsIGRpcjEpLmxlbmd0aCkudG9CZSgxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ29iZXlzIHRoZSBoaWRlSWdub3JlZE5hbWVzIHNldHRpbmcnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjFdKTtcbiAgICAgIGFjdGlvbnMuZXhwYW5kTm9kZShkaXIxLCBmb29UeHQpO1xuICAgICAgYWN0aW9ucy5zZXRJZ25vcmVkTmFtZXMoWydmb28uKiddKTtcbiAgICAgIGFjdGlvbnMuc2V0SGlkZUlnbm9yZWROYW1lcyhmYWxzZSk7XG5cbiAgICAgIGF3YWl0IGxvYWRDaGlsZEtleXMoZGlyMSwgZGlyMSk7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5nZXRDaGlsZEtleXMoZGlyMSwgZGlyMSkubGVuZ3RoKS50b0JlKDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVjb3ZlcmluZyBmcm9tIGZhaWxlZCBzdWJzY3JpcHRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdmZXRjaGVzIGNoaWxkcmVuIG9uIHJlLWV4cGFuc2lvbiBvZiBmYWlsZWQgZGlyZWN0b3JpZXMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZWFibGVEaXIgPSBuZXcgRGlyZWN0b3J5KGRpcjEpO1xuICAgICAgICAvLyBGb3JjZSBzdWJzY3JpcHRpb24gdG8gZmFpbCB0byBtaW1pYyBuZXR3b3JrIGZhaWx1cmUsIGV0Yy5cbiAgICAgICAgc3B5T24odW5zdWJzY3JpYmVhYmxlRGlyLCAnb25EaWRDaGFuZ2UnKS5hbmRDYWxsRmFrZSgoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGVycm9yICoqc2hvdWxkKiogYmUgdGhyb3duLicpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIGFsd2F5cy1mYWlsIGRpcmVjdG9yeSB3aGVuIGl0IGlzIGV4cGFuZGVkLlxuICAgICAgICBzcHlPbihGaWxlVHJlZUhlbHBlcnMsICdnZXREaXJlY3RvcnlCeUtleScpLmFuZFJldHVybih1bnN1YnNjcmliZWFibGVEaXIpO1xuXG4gICAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjFdKTtcbiAgICAgICAgYWN0aW9ucy5leHBhbmROb2RlKGRpcjEsIGRpcjEpO1xuICAgICAgICBhd2FpdCBsb2FkQ2hpbGRLZXlzKGRpcjEsIGRpcjEpO1xuXG4gICAgICAgIC8vIENoaWxkcmVuIHNob3VsZCBsb2FkIGJ1dCB0aGUgc3Vic2NyaXB0aW9uIHNob3VsZCBmYWlsLlxuICAgICAgICBleHBlY3Qoc3RvcmUuZ2V0Q2FjaGVkQ2hpbGRLZXlzKGRpcjEsIGRpcjEpKS50b0VxdWFsKFtmb29UeHRdKTtcblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmlsZSwgJ2Jhci5iYXonLCBmb3Igd2hpY2ggdGhlIHN0b3JlIHdpbGwgbm90IGdldCBhIG5vdGlmaWNhdGlvbiBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBzdWJzY3JpcHRpb24gZmFpbGVkLlxuICAgICAgICBjb25zdCBiYXJCYXogPSBwYXRoTW9kdWxlLmpvaW4oZGlyMSwgJ2Jhci5iYXonKTtcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhiYXJCYXosICcnKTtcbiAgICAgICAgYXdhaXQgbG9hZENoaWxkS2V5cyhkaXIxLCBkaXIxKTtcbiAgICAgICAgZXhwZWN0KHN0b3JlLmdldENhY2hlZENoaWxkS2V5cyhkaXIxLCBkaXIxKSkudG9FcXVhbChbZm9vVHh0XSk7XG5cbiAgICAgICAgLy8gQ29sbGFwc2luZyBhbmQgcmUtZXhwYW5kaW5nIGEgZGlyZWN0b3J5IHNob3VsZCBmb3JjaWJseSBmZXRjaCBpdHMgY2hpbGRyZW4gcmVnYXJkbGVzcyBvZlxuICAgICAgICAvLyB3aGV0aGVyIGEgc3Vic2NyaXB0aW9uIGlzIHBvc3NpYmxlLlxuICAgICAgICBhY3Rpb25zLmNvbGxhcHNlTm9kZShkaXIxLCBkaXIxKTtcbiAgICAgICAgYWN0aW9ucy5leHBhbmROb2RlKGRpcjEsIGRpcjEpO1xuICAgICAgICBhd2FpdCBsb2FkQ2hpbGRLZXlzKGRpcjEsIGRpcjEpO1xuXG4gICAgICAgIC8vIFRoZSBzdWJzY3JpcHRpb24gc2hvdWxkIGZhaWwgYWdhaW4sIGJ1dCB0aGUgY2hpbGRyZW4gc2hvdWxkIGJlIHJlZmV0Y2hlZCBhbmQgbWF0Y2ggdGhlXG4gICAgICAgIC8vIGNoYW5nZWQgc3RydWN0dXJlIChpLmUuIGluY2x1ZGUgdGhlIG5ldyAnYmFyLmJheicgZmlsZSkuXG4gICAgICAgIGV4cGVjdChzdG9yZS5nZXRDYWNoZWRDaGlsZEtleXMoZGlyMSwgZGlyMSkpLnRvRXF1YWwoW2JhckJheiwgZm9vVHh0XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ29taXRzIHZjcy1leGNsdWRlZCBwYXRocycsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgYWN0aW9ucy5zZXRSb290S2V5cyhbZGlyMV0pO1xuICAgICAgYWN0aW9ucy5leHBhbmROb2RlKGRpcjEsIGZvb1R4dCk7XG4gICAgICBhY3Rpb25zLnNldEV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHModHJ1ZSk7XG5cbiAgICAgIGNvbnN0IG1vY2tSZXBvID0gbmV3IE1vY2tSZXBvc2l0b3J5KCk7XG4gICAgICBzcHlPbihzdG9yZSwgJ19yZXBvc2l0b3J5Rm9yUGF0aCcpLmFuZFJldHVybihtb2NrUmVwbyk7XG5cbiAgICAgIGF3YWl0IGxvYWRDaGlsZEtleXMoZGlyMSwgZGlyMSk7XG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0Q2FjaGVkQ2hpbGRLZXlzKGRpcjEsIGRpcjEpLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2luY2x1ZGVzIHZjcy1leGNsdWRlZCBwYXRocyB3aGVuIHRvbGQgdG8nLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjFdKTtcbiAgICAgIGFjdGlvbnMuZXhwYW5kTm9kZShkaXIxLCBmb29UeHQpO1xuICAgICAgYWN0aW9ucy5zZXRFeGNsdWRlVmNzSWdub3JlZFBhdGhzKGZhbHNlKTtcblxuICAgICAgY29uc3QgbW9ja1JlcG8gPSBuZXcgTW9ja1JlcG9zaXRvcnkoKTtcbiAgICAgIHNweU9uKHN0b3JlLCAnX3JlcG9zaXRvcnlGb3JQYXRoJykuYW5kUmV0dXJuKG1vY2tSZXBvKTtcblxuICAgICAgYXdhaXQgbG9hZENoaWxkS2V5cyhkaXIxLCBkaXIxKTtcbiAgICAgIGV4cGVjdChzdG9yZS5nZXRDYWNoZWRDaGlsZEtleXMoZGlyMSwgZGlyMSkubGVuZ3RoKS50b0JlKDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZXhwYW5kcyBkZWVwIG5lc3RlZCBzdHJ1Y3R1cmUgb2YgdGhlIG5vZGUnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtYXAgPSBhd2FpdCBidWlsZFRlbXBEaXJUcmVlKCdkaXIzL2RpcjMxL2ZvbzMxLnR4dCcsICdkaXIzL2RpcjMyL2JhcjMyLnR4dCcpO1xuICAgICAgY29uc3QgZGlyMyA9IG1hcC5nZXQoJ2RpcjMnKTtcbiAgICAgIGNvbnN0IGRpcjMxID0gbWFwLmdldCgnZGlyMy9kaXIzMScpO1xuICAgICAgYWN0aW9ucy5zZXRSb290S2V5cyhbZGlyM10pO1xuXG4gICAgICAvLyBBd2FpdCAqKmludGVybmFsLW9ubHkqKiBBUEkgYmVjYXVzZSB0aGUgcHVibGljIGBleHBhbmROb2RlRGVlcGAgQVBJIGRvZXMgbm90XG4gICAgICAvLyByZXR1cm4gdGhlIHByb21pc2UgdGhhdCBjYW4gYmUgYXdhaXRlZCBvblxuICAgICAgYXdhaXQgc3RvcmUuX2V4cGFuZE5vZGVEZWVwKGRpcjMsIGRpcjMpO1xuICAgICAgZXhwZWN0KHN0b3JlLmdldENoaWxkS2V5cyhkaXIzMSwgZGlyMzEpLmxlbmd0aCkudG9CZSgxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2NvbGxhcHNlcyBkZWVwIG5lc3RlZCBzdHJ1Y3RvcmUnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1hcCA9IGF3YWl0IGJ1aWxkVGVtcERpclRyZWUoJ2RpcjMvZGlyMzEvZm9vMzEudHh0JywgJ2RpcjMvZGlyMzIvYmFyMzIudHh0Jyk7XG4gICAgICBjb25zdCBkaXIzID0gbWFwLmdldCgnZGlyMycpO1xuICAgICAgY29uc3QgZGlyMzEgPSBtYXAuZ2V0KCdkaXIzL2RpcjMxJyk7XG4gICAgICBhY3Rpb25zLnNldFJvb3RLZXlzKFtkaXIzXSk7XG5cbiAgICAgIC8vIEF3YWl0ICoqaW50ZXJuYWwtb25seSoqIEFQSSBiZWNhdXNlIHRoZSBwdWJsaWMgYGV4cGFuZE5vZGVEZWVwYCBBUEkgZG9lcyBub3RcbiAgICAgIC8vIHJldHVybiB0aGUgcHJvbWlzZSB0aGF0IGNhbiBiZSBhd2FpdGVkIG9uXG4gICAgICBhd2FpdCBzdG9yZS5fZXhwYW5kTm9kZURlZXAoZGlyMywgZGlyMyk7XG4gICAgICBleHBlY3Qoc3RvcmUuaXNFeHBhbmRlZChkaXIzLCBkaXIzMSkpLnRvQmUodHJ1ZSk7XG4gICAgICBhY3Rpb25zLmNvbGxhcHNlTm9kZURlZXAoZGlyMywgZGlyMyk7XG4gICAgICBleHBlY3Qoc3RvcmUuaXNFeHBhbmRlZChkaXIzLCBkaXIzMSkpLnRvQmUoZmFsc2UpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc3RvcHMgZXhwYW5kaW5nIGFmdGVyIGFkZGluZyAxMDAgaXRlbXMgdG8gdGhlIHRyZWUgaW4gQkZTIG9yZGVyJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhcnJGaWxlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICBhcnJGaWxlcy5wdXNoKGBkaXIzL2RpcjMxL2ZvbyR7aX0udHh0YCk7XG4gICAgICB9XG4gICAgICBhcnJGaWxlcy5wdXNoKCdkaXIzL2RpcjMyL2Jhci50eHQnKTtcblxuICAgICAgY29uc3QgbWFwID0gYXdhaXQgYnVpbGRUZW1wRGlyVHJlZSguLi5hcnJGaWxlcyk7XG4gICAgICBjb25zdCBkaXIzID0gbWFwLmdldCgnZGlyMycpO1xuICAgICAgY29uc3QgZGlyMzEgPSBtYXAuZ2V0KCdkaXIzL2RpcjMxJyk7XG4gICAgICBjb25zdCBkaXIzMiA9IG1hcC5nZXQoJ2RpcjMvZGlyMzInKTtcbiAgICAgIGFjdGlvbnMuc2V0Um9vdEtleXMoW2RpcjNdKTtcblxuICAgICAgLy8gQXdhaXQgKippbnRlcm5hbC1vbmx5KiogQVBJIGJlY2F1c2UgdGhlIHB1YmxpYyBgZXhwYW5kTm9kZURlZXBgIEFQSSBkb2VzIG5vdFxuICAgICAgLy8gcmV0dXJuIHRoZSBwcm9taXNlIHRoYXQgY2FuIGJlIGF3YWl0ZWQgb25cbiAgICAgIGF3YWl0IHN0b3JlLl9leHBhbmROb2RlRGVlcChkaXIzLCBkaXIzKTtcbiAgICAgIGV4cGVjdChzdG9yZS5pc0V4cGFuZGVkKGRpcjMsIGRpcjMxKSkudG9CZSh0cnVlKTtcbiAgICAgIGV4cGVjdChzdG9yZS5pc0V4cGFuZGVkKGRpcjMsIGRpcjMyKSkudG9CZShmYWxzZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-file-tree/spec/FileTreeStore-spec.js
