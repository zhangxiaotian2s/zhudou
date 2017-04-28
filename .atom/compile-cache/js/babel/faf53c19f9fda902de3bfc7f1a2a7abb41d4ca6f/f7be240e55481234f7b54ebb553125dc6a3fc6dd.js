'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _require = require('../lib/HyperclickProvider');

var findTargetLocation = _require.findTargetLocation;
var parseTarget = _require.parseTarget;

describe('HyperclickProvider', function () {
  var projectPath = undefined;

  beforeEach(function () {
    projectPath = require('path').join(__dirname, 'fixtures/test-project') + '/';
    atom.project.setPaths([projectPath]);
  });

  describe('parseTarget', function () {
    it('searches //Apps/TestApp/BUCK.test', function () {
      var buckProject = {
        getPath: function getPath() {
          return Promise.resolve(projectPath);
        }
      };
      waitsForPromise(_asyncToGenerator(function* () {
        var target = yield parseTarget([':target1', null, 'target1'], null, buckProject);
        expect(target).toBe(null);

        target = yield parseTarget([':target1', null, 'target1'], projectPath + 'test/BUCK', buckProject);
        expect(target).toEqual({ path: projectPath + 'test/BUCK', name: 'target1' });

        target = yield parseTarget(['//Apps/TestApp:w3ird', '//Apps/TestApp', 'w3ird'], null, buckProject);
        expect(target).toEqual(null);

        target = yield parseTarget(['//Apps/TestApp:w3ird', '//Apps/TestApp', 'w3ird'], '//test/BUCK', buckProject);
        expect(target).toEqual({ path: projectPath + 'Apps/TestApp/BUCK', name: 'w3ird' });
      }));
    });
  });

  describe('findTargetLocation', function () {
    var targetsByFile = {
      'Apps/TestApp/BUCK.test': {
        'Target1': 1,
        'w3ird_target-name': 7,
        'Target2': 13,
        'TestsTarget': 27,
        'non-existing-target': -1
      },
      'Apps/BUCK.test': {
        'test_target123': 1
      },
      'Libraries/TestLib1/BUCK.test': {
        'target_with_no_trailling_comma': 1,
        'target_with_no_trailling_commas': -1,
        'lib_target1': 5,
        'lib_target-test': 12,
        'lib_target': -1,
        'TestsTarget': 23,
        'PUBLIC': -1,
        '[]': -1
      },
      'Libraries/TestLib1/test-ios-sdk/sdk-v.1.2.3/BUCK.test': {
        'target-v.1': 1,
        'target': 7,
        'targett': -1,
        'arget': -1
      }
    };

    var _loop = function (file) {
      var _loop2 = function (targetName) {
        it('asks for a location of the target', function () {
          waitsForPromise(function () {
            return findTargetLocation({ path: projectPath + file, name: targetName }).then(function (location) {
              var line = targetsByFile[file][targetName];
              if (line !== -1) {
                expect(location).toEqual({
                  path: projectPath + file,
                  line: line,
                  column: 0
                });
              } else {
                expect(location).toEqual({ path: projectPath + file, line: 0, column: 0 });
              }
            });
          });
        });
      };

      for (var targetName in targetsByFile[file]) {
        _loop2(targetName);
      }
    };

    for (var file in targetsByFile) {
      _loop(file);
    }
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtYnVjay1maWxlcy9zcGVjL0h5cGVyY2xpY2tQcm92aWRlci1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7O2VBVzhCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQzs7SUFBdkUsa0JBQWtCLFlBQWxCLGtCQUFrQjtJQUFFLFdBQVcsWUFBWCxXQUFXOztBQUV0QyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsWUFBTTtBQUNuQyxNQUFJLFdBQVcsWUFBQSxDQUFDOztBQUVoQixZQUFVLENBQUMsWUFBTTtBQUNmLGVBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUM3RSxRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7R0FDdEMsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxhQUFhLEVBQUUsWUFBTTtBQUM1QixNQUFFLENBQUMsbUNBQW1DLEVBQUUsWUFBTTtBQUM1QyxVQUFNLFdBQVcsR0FBRztBQUNsQixlQUFPLEVBQUEsbUJBQUc7QUFDUixpQkFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JDO09BQ0YsQ0FBQztBQUNGLHFCQUFlLG1CQUFDLGFBQVk7QUFDMUIsWUFBSSxNQUFNLEdBQUcsTUFBTSxXQUFXLENBQzFCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsRUFDN0IsSUFBSSxFQUNKLFdBQVcsQ0FBQyxDQUFDO0FBQ2pCLGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFCLGNBQU0sR0FBRyxNQUFNLFdBQVcsQ0FDdEIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FB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QUFJLENBQUMsRUFBRTtlQUFuQyxVQUFVO09BbUJwQjs7O0FBcEJILFNBQUssSUFBTSxJQUFJLElBQUksYUFBYSxFQUFFO1lBQXZCLElBQUk7S0FxQmQ7R0FDRixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1idWNrLWZpbGVzL3NwZWMvSHlwZXJjbGlja1Byb3ZpZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5jb25zdCB7ZmluZFRhcmdldExvY2F0aW9uLCBwYXJzZVRhcmdldH0gPSByZXF1aXJlKCcuLi9saWIvSHlwZXJjbGlja1Byb3ZpZGVyJyk7XG5cbmRlc2NyaWJlKCdIeXBlcmNsaWNrUHJvdmlkZXInLCAoKSA9PiB7XG4gIGxldCBwcm9qZWN0UGF0aDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBwcm9qZWN0UGF0aCA9IHJlcXVpcmUoJ3BhdGgnKS5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL3Rlc3QtcHJvamVjdCcpICsgJy8nO1xuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcHJvamVjdFBhdGhdKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlVGFyZ2V0JywgKCkgPT4ge1xuICAgIGl0KCdzZWFyY2hlcyAvL0FwcHMvVGVzdEFwcC9CVUNLLnRlc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBidWNrUHJvamVjdCA9IHtcbiAgICAgICAgZ2V0UGF0aCgpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByb2plY3RQYXRoKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgdGFyZ2V0ID0gYXdhaXQgcGFyc2VUYXJnZXQoXG4gICAgICAgICAgICBbJzp0YXJnZXQxJywgbnVsbCwgJ3RhcmdldDEnXSxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBidWNrUHJvamVjdCk7XG4gICAgICAgIGV4cGVjdCh0YXJnZXQpLnRvQmUobnVsbCk7XG5cbiAgICAgICAgdGFyZ2V0ID0gYXdhaXQgcGFyc2VUYXJnZXQoXG4gICAgICAgICAgICBbJzp0YXJnZXQxJywgbnVsbCwgJ3RhcmdldDEnXSxcbiAgICAgICAgICAgIHByb2plY3RQYXRoICsgJ3Rlc3QvQlVDSycsXG4gICAgICAgICAgICBidWNrUHJvamVjdCk7XG4gICAgICAgIGV4cGVjdCh0YXJnZXQpLnRvRXF1YWwoe3BhdGg6IHByb2plY3RQYXRoICsgJ3Rlc3QvQlVDSycsIG5hbWU6ICd0YXJnZXQxJ30pO1xuXG4gICAgICAgIHRhcmdldCA9IGF3YWl0IHBhcnNlVGFyZ2V0KFxuICAgICAgICAgICAgWycvL0FwcHMvVGVzdEFwcDp3M2lyZCcsICcvL0FwcHMvVGVzdEFwcCcsICd3M2lyZCddLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIGJ1Y2tQcm9qZWN0KTtcbiAgICAgICAgZXhwZWN0KHRhcmdldCkudG9FcXVhbChudWxsKTtcblxuICAgICAgICB0YXJnZXQgPSBhd2FpdCBwYXJzZVRhcmdldChcbiAgICAgICAgICAgIFsnLy9BcHBzL1Rlc3RBcHA6dzNpcmQnLCAnLy9BcHBzL1Rlc3RBcHAnLCAndzNpcmQnXSxcbiAgICAgICAgICAgICcvL3Rlc3QvQlVDSycsXG4gICAgICAgICAgICBidWNrUHJvamVjdCk7XG4gICAgICAgIGV4cGVjdCh0YXJnZXQpLnRvRXF1YWwoe3BhdGg6IHByb2plY3RQYXRoICsgJ0FwcHMvVGVzdEFwcC9CVUNLJywgbmFtZTogJ3czaXJkJ30pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmaW5kVGFyZ2V0TG9jYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0c0J5RmlsZSA9IHtcbiAgICAgICdBcHBzL1Rlc3RBcHAvQlVDSy50ZXN0Jzoge1xuICAgICAgICAnVGFyZ2V0MSc6IDEsXG4gICAgICAgICd3M2lyZF90YXJnZXQtbmFtZSc6IDcsXG4gICAgICAgICdUYXJnZXQyJzogMTMsXG4gICAgICAgICdUZXN0c1RhcmdldCc6IDI3LFxuICAgICAgICAnbm9uLWV4aXN0aW5nLXRhcmdldCc6IC0xLFxuICAgICAgfSxcbiAgICAgICdBcHBzL0JVQ0sudGVzdCc6IHtcbiAgICAgICAgJ3Rlc3RfdGFyZ2V0MTIzJzogMSxcbiAgICAgIH0sXG4gICAgICAnTGlicmFyaWVzL1Rlc3RMaWIxL0JVQ0sudGVzdCc6IHtcbiAgICAgICAgJ3RhcmdldF93aXRoX25vX3RyYWlsbGluZ19jb21tYSc6IDEsXG4gICAgICAgICd0YXJnZXRfd2l0aF9ub190cmFpbGxpbmdfY29tbWFzJzogLTEsXG4gICAgICAgICdsaWJfdGFyZ2V0MSc6IDUsXG4gICAgICAgICdsaWJfdGFyZ2V0LXRlc3QnOiAxMixcbiAgICAgICAgJ2xpYl90YXJnZXQnOiAtMSxcbiAgICAgICAgJ1Rlc3RzVGFyZ2V0JzogMjMsXG4gICAgICAgICdQVUJMSUMnOiAtMSxcbiAgICAgICAgJ1tdJzogLTEsXG4gICAgICB9LFxuICAgICAgJ0xpYnJhcmllcy9UZXN0TGliMS90ZXN0LWlvcy1zZGsvc2RrLXYuMS4yLjMvQlVDSy50ZXN0Jzoge1xuICAgICAgICAndGFyZ2V0LXYuMSc6IDEsXG4gICAgICAgICd0YXJnZXQnOiA3LFxuICAgICAgICAndGFyZ2V0dCc6IC0xLFxuICAgICAgICAnYXJnZXQnOiAtMSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgZmlsZSBpbiB0YXJnZXRzQnlGaWxlKSB7XG4gICAgICBmb3IgKGNvbnN0IHRhcmdldE5hbWUgaW4gdGFyZ2V0c0J5RmlsZVtmaWxlXSkge1xuICAgICAgICBpdCgnYXNrcyBmb3IgYSBsb2NhdGlvbiBvZiB0aGUgdGFyZ2V0JywgKCkgPT4ge1xuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZmluZFRhcmdldExvY2F0aW9uKHtwYXRoOiBwcm9qZWN0UGF0aCArIGZpbGUsIG5hbWU6IHRhcmdldE5hbWV9KVxuICAgICAgICAgICAgLnRoZW4oKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSB0YXJnZXRzQnlGaWxlW2ZpbGVdW3RhcmdldE5hbWVdO1xuICAgICAgICAgICAgICBpZiAobGluZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QobG9jYXRpb24pLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHByb2plY3RQYXRoICsgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiAwLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGxvY2F0aW9uKS50b0VxdWFsKHtwYXRoOiBwcm9qZWN0UGF0aCArIGZpbGUsIGxpbmU6IDAsIGNvbHVtbjogMH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-buck-files/spec/HyperclickProvider-spec.js
