var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

'use babel';

var React = require('react-for-atom');
var QuickSelectionComponent = require('../lib/QuickSelectionComponent');

var TestQuickSelectionProvider = (function () {
  function TestQuickSelectionProvider(items) {
    _classCallCheck(this, TestQuickSelectionProvider);

    this._items = items;
  }

  _createClass(TestQuickSelectionProvider, [{
    key: 'getPromptText',
    value: function getPromptText() {
      return 'test';
    }
  }, {
    key: 'executeQuery',
    value: function executeQuery(query) {
      return Promise.resolve(this._items);
    }
  }]);

  return TestQuickSelectionProvider;
})();

xdescribe('QuickSelectionComponent', function () {
  var componentRoot = undefined;
  var component = undefined;

  beforeEach(function () {
    spyOn(Date, 'now').andCallFake(function () {
      return window.now;
    });

    componentRoot = document.createElement('div');
    document.body.appendChild(componentRoot);

    var testProvider = new TestQuickSelectionProvider({});
    component = React.render(React.createElement(QuickSelectionComponent, {
      provider: testProvider
    }), componentRoot);
  });

  afterEach(function () {
    React.unmountComponentAtNode(componentRoot);
    document.body.removeChild(componentRoot);
  });

  // Updates the component to be using a TestQuickSelectionProvider that will serve @items, then
  // executes @callback after the component has completely updated to be using the new provider.
  function withItemsSetTo(items, callback) {
    waitsForPromise(function () {
      return new Promise(function (resolve, reject) {

        component.onItemsChanged(function (newItems) {
          resolve(component);
        });
        component = React.render(React.createElement(QuickSelectionComponent, {
          provider: new TestQuickSelectionProvider(items)
        }), componentRoot);
        window.advanceClock(250);

        component.clear();
      }).then(callback);
    });
  }

  xdescribe('Confirmation', function () {
    it('should return the selected item on selection', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {

        var selectedItemIndex = component.getSelectedIndex();
        expect(selectedItemIndex.selectedDirectory).toBe('');
        expect(selectedItemIndex.selectedService).toBe('');
        expect(selectedItemIndex.selectedItemIndex).toBe(-1);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelection(function (item) {
              expect(item).toBe(1);
              resolve();
            });

            component.moveSelectionDown();
            component.select();
          });
        });
      });
    });

    it('should select on the core:confirm command (enter)', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        var componentNode = React.findDOMNode(component);

        var selectedItemIndex = component.getSelectedIndex();
        expect(selectedItemIndex.selectedDirectory).toBe('');
        expect(selectedItemIndex.selectedService).toBe('');
        expect(selectedItemIndex.selectedItemIndex).toBe(-1);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelection(function (item) {
              expect(item).toBe(1);
              resolve();
            });

            component.moveSelectionDown();
            atom.commands.dispatch(componentNode, 'core:confirm');
          });
        });
      });
    });

    it('should cancel instead of selecting when there are no items', function () {
      withItemsSetTo({}, function () {
        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onCancellation(function (item) {
              resolve();
            });

            component.select();
          });
        });
      });
    });
  });

  describe('Cancellation', function () {
    it('should cancel on the core:cancel command (esc)', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        var componentNode = React.findDOMNode(component);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onCancellation(function (item) {
              resolve();
            });

            atom.commands.dispatch(componentNode, 'core:cancel');
          });
        });
      });
    });
  });

  describe('Selection', function () {
    it('should start out without selection', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        var selectedItemIndex = component.getSelectedIndex();
        expect(selectedItemIndex.selectedDirectory).toBe('');
        expect(selectedItemIndex.selectedService).toBe('');
        expect(selectedItemIndex.selectedItemIndex).toBe(-1);
      });
    });

    it('should move the selection and wrap at the top/bottom', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionDown();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(0);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionDown();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(1);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionDown();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(2);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionDown();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(0);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionUp();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(2);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionUp();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(1);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionUp();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(0);
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionUp();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(2);
          });
        });
      });
    });

    it('should move the selection appropriately on core:move* commands', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        var componentNode = React.findDOMNode(component);

        var steps = [{ expectedIndex: 0, nextCommand: 'core:move-up' }, { expectedIndex: 2, nextCommand: 'core:move-down' }, { expectedIndex: 0, nextCommand: 'core:move-down' }, { expectedIndex: 1, nextCommand: 'core:move-to-bottom' }, { expectedIndex: 2, nextCommand: 'core:move-to-top' }, { expectedIndex: 0, nextCommand: '' }];
        var index = 0;

        expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              if (index === steps.length - 1) {
                resolve();
              } else {
                var spec = steps[index];
                expect(newIndex.selectedItemIndex).toBe(spec.expectedIndex);
                atom.commands.dispatch(componentNode, spec.nextCommand);
                index++;
              }
            });
            component.moveSelectionToTop();
          });
        });
      });
    });

    it('should reset the selection when the list contents change', function () {
      withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [1, 2, 3] }) } }, function () {
        expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            component.onSelectionChanged(function (newIndex) {
              resolve(newIndex);
            });
            component.moveSelectionDown();
          }).then(function (newIndex) {
            expect(newIndex.selectedItemIndex).toBe(0);
          });
        });

        withItemsSetTo({ testDirectory: { testProvider: Promise.resolve({ results: [5, 6, 7] }) } }, function () {
          expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
        });
      });
    });

    it('should keep the selection index at -1 when there are no items', function () {
      withItemsSetTo({}, function () {
        //enable setTimeout: https://discuss.atom.io/t/solved-settimeout-not-working-firing-in-specs-tests/11427
        jasmine.unspy(window, 'setTimeout');

        expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
              resolve();
            }, 0);
            component.moveSelectionDown();
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
              resolve();
            }, 0);
            component.moveSelectionToBottom();
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
              resolve();
            }, 0);
            component.moveSelectionUp();
          });
        });

        waitsForPromise(function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              expect(component.getSelectedIndex().selectedItemIndex).toBe(-1);
              resolve();
            }, 0);
            component.moveSelectionToTop();
          });
        });
      });
    });

    it('should allow input text to be set after mount', function () {
      component.setInputValue('foo');
      var editor = component.getInputTextEditor().model;
      expect(editor.getText()).toBe('foo');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtcXVpY2stb3Blbi9zcGVjL1F1aWNrU2VsZWN0aW9uQ29tcG9uZW50LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsV0FBVyxDQUFDOztBQWVaLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0lBRXBFLDBCQUEwQjtBQUduQixXQUhQLDBCQUEwQixDQUdsQixLQUE4QyxFQUFFOzBCQUh4RCwwQkFBMEI7O0FBSTVCLFFBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0dBQ3JCOztlQUxHLDBCQUEwQjs7V0FPakIseUJBQUc7QUFDZCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFVyxzQkFBQyxLQUFhLEVBQW9EO0FBQzVFLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckM7OztTQWJHLDBCQUEwQjs7O0FBZ0JoQyxTQUFTLENBQUMseUJBQXlCLEVBQUUsWUFBTTtBQUN6QyxNQUFJLGFBQW1CLFlBQUEsQ0FBQztBQUN4QixNQUFJLFNBQWtDLFlBQUEsQ0FBQzs7QUFFdkMsWUFBVSxDQUFDLFlBQU07QUFDZixTQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQzthQUFNLE1BQU0sQ0FBQyxHQUFHO0tBQUEsQ0FBQyxDQUFDOztBQUVqRCxpQkFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsWUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXpDLFFBQU0sWUFBWSxHQUFHLElBQUksMEJBQTBCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEQsYUFBUyxHQUFHLEtBQUss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Q2hFLHFCQUFPLEVBQUUsQ0FBQzthQUNYLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDTixxQkFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUM7V0FDaEMsQ0FBQztTQUFBLENBQUMsQ0FBQztPQUNMLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBTTtBQUN4RCxlQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLFVBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNwRCxZQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDLENBQUMsQ0FBQztHQUVKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLXF1aWNrLW9wZW4vc3BlYy9RdWlja1NlbGVjdGlvbkNvbXBvbmVudC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICBGaWxlUmVzdWx0LFxufSBmcm9tICdudWNsaWRlLXF1aWNrLW9wZW4taW50ZXJmYWNlcyc7XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QtZm9yLWF0b20nKTtcbmNvbnN0IFF1aWNrU2VsZWN0aW9uQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vbGliL1F1aWNrU2VsZWN0aW9uQ29tcG9uZW50Jyk7XG5cbmNsYXNzIFRlc3RRdWlja1NlbGVjdGlvblByb3ZpZGVyIHtcbiAgX2l0ZW1zOiB7c3RyaW5nOiB7c3RyaW5nOiBQcm9taXNlPEZpbGVSZXN1bHQ+fX07XG5cbiAgY29uc3RydWN0b3IoaXRlbXM6IHtzdHJpbmc6IHtzdHJpbmc6IFByb21pc2U8RmlsZVJlc3VsdD59fSkge1xuICAgIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG4gIH1cblxuICBnZXRQcm9tcHRUZXh0KCkge1xuICAgIHJldHVybiAndGVzdCc7XG4gIH1cblxuICBleGVjdXRlUXVlcnkocXVlcnk6IFN0cmluZyk6IFByb21pc2U8e3N0cmluZzoge3N0cmluZzogUHJvbWlzZTxGaWxlUmVzdWx0Pn19PiB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9pdGVtcyk7XG4gIH1cbn1cblxueGRlc2NyaWJlKCdRdWlja1NlbGVjdGlvbkNvbXBvbmVudCcsICgpID0+IHtcbiAgbGV0IGNvbXBvbmVudFJvb3Q6IE5vZGU7XG4gIGxldCBjb21wb25lbnQ6IFF1aWNrU2VsZWN0aW9uQ29tcG9uZW50O1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHNweU9uKERhdGUsICdub3cnKS5hbmRDYWxsRmFrZSgoKSA9PiB3aW5kb3cubm93KTtcblxuICAgIGNvbXBvbmVudFJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbXBvbmVudFJvb3QpO1xuXG4gICAgY29uc3QgdGVzdFByb3ZpZGVyID0gbmV3IFRlc3RRdWlja1NlbGVjdGlvblByb3ZpZGVyKHt9KTtcbiAgICBjb21wb25lbnQgPSBSZWFjdC5yZW5kZXIoXG4gICAgICA8UXVpY2tTZWxlY3Rpb25Db21wb25lbnRcbiAgICAgICAgcHJvdmlkZXI9e3Rlc3RQcm92aWRlcn1cbiAgICAgIC8+LFxuICAgICAgY29tcG9uZW50Um9vdFxuICAgICk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgUmVhY3QudW5tb3VudENvbXBvbmVudEF0Tm9kZShjb21wb25lbnRSb290KTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGNvbXBvbmVudFJvb3QpO1xuICB9KTtcblxuICAvLyBVcGRhdGVzIHRoZSBjb21wb25lbnQgdG8gYmUgdXNpbmcgYSBUZXN0UXVpY2tTZWxlY3Rpb25Qcm92aWRlciB0aGF0IHdpbGwgc2VydmUgQGl0ZW1zLCB0aGVuXG4gIC8vIGV4ZWN1dGVzIEBjYWxsYmFjayBhZnRlciB0aGUgY29tcG9uZW50IGhhcyBjb21wbGV0ZWx5IHVwZGF0ZWQgdG8gYmUgdXNpbmcgdGhlIG5ldyBwcm92aWRlci5cbiAgZnVuY3Rpb24gd2l0aEl0ZW1zU2V0VG8oXG4gICAgaXRlbXM6IHtzdHJpbmc6IHtzdHJpbmc6IFByb21pc2U8RmlsZVJlc3VsdD59fSxcbiAgICBjYWxsYmFjazogKGNvbXBvbmVudDogUXVpY2tTZWxlY3Rpb25Db21wb25lbnQpID0+IHZvaWQpIHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBjb21wb25lbnQub25JdGVtc0NoYW5nZWQoKG5ld0l0ZW1zKSA9PiB7XG4gICAgICAgIHJlc29sdmUoY29tcG9uZW50KTtcbiAgICAgIH0pO1xuICAgICAgY29tcG9uZW50ID0gUmVhY3QucmVuZGVyKFxuICAgICAgICA8UXVpY2tTZWxlY3Rpb25Db21wb25lbnRcbiAgICAgICAgICBwcm92aWRlcj17bmV3IFRlc3RRdWlja1NlbGVjdGlvblByb3ZpZGVyKGl0ZW1zKX1cbiAgICAgICAgLz4sXG4gICAgICAgIGNvbXBvbmVudFJvb3RcbiAgICAgICk7XG4gICAgICB3aW5kb3cuYWR2YW5jZUNsb2NrKDI1MCk7XG5cbiAgICAgIGNvbXBvbmVudC5jbGVhcigpO1xuXG4gICAgfSkudGhlbihjYWxsYmFjaykpO1xuICB9XG5cbiAgeGRlc2NyaWJlKCdDb25maXJtYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNlbGVjdGVkIGl0ZW0gb24gc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgd2l0aEl0ZW1zU2V0VG8oe3Rlc3REaXJlY3Rvcnk6IHt0ZXN0UHJvdmlkZXI6IFByb21pc2UucmVzb2x2ZSh7cmVzdWx0czogWzEsIDIsIDNdfSl9fSwgKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUluZGV4ID0gY29tcG9uZW50LmdldFNlbGVjdGVkSW5kZXgoKTtcbiAgICAgICAgZXhwZWN0KHNlbGVjdGVkSXRlbUluZGV4LnNlbGVjdGVkRGlyZWN0b3J5KS50b0JlKCcnKTtcbiAgICAgICAgZXhwZWN0KHNlbGVjdGVkSXRlbUluZGV4LnNlbGVjdGVkU2VydmljZSkudG9CZSgnJyk7XG4gICAgICAgIGV4cGVjdChzZWxlY3RlZEl0ZW1JbmRleC5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgtMSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb21wb25lbnQub25TZWxlY3Rpb24oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChpdGVtKS50b0JlKDEpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25Eb3duKCk7XG4gICAgICAgICAgY29tcG9uZW50LnNlbGVjdCgpO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2VsZWN0IG9uIHRoZSBjb3JlOmNvbmZpcm0gY29tbWFuZCAoZW50ZXIpJywgKCkgPT4ge1xuICAgICAgd2l0aEl0ZW1zU2V0VG8oe3Rlc3REaXJlY3Rvcnk6IHt0ZXN0UHJvdmlkZXI6IFByb21pc2UucmVzb2x2ZSh7cmVzdWx0czogWzEsIDIsIDNdfSl9fSwgKCkgPT4ge1xuICAgICAgICBjb25zdCBjb21wb25lbnROb2RlID0gUmVhY3QuZmluZERPTU5vZGUoY29tcG9uZW50KTtcblxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1JbmRleCA9IGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCk7XG4gICAgICAgIGV4cGVjdChzZWxlY3RlZEl0ZW1JbmRleC5zZWxlY3RlZERpcmVjdG9yeSkudG9CZSgnJyk7XG4gICAgICAgIGV4cGVjdChzZWxlY3RlZEl0ZW1JbmRleC5zZWxlY3RlZFNlcnZpY2UpLnRvQmUoJycpO1xuICAgICAgICBleHBlY3Qoc2VsZWN0ZWRJdGVtSW5kZXguc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uU2VsZWN0aW9uKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoaXRlbSkudG9CZSgxKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbXBvbmVudC5tb3ZlU2VsZWN0aW9uRG93bigpO1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goY29tcG9uZW50Tm9kZSwgJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjYW5jZWwgaW5zdGVhZCBvZiBzZWxlY3Rpbmcgd2hlbiB0aGVyZSBhcmUgbm8gaXRlbXMnLCAoKSA9PiB7XG4gICAgICB3aXRoSXRlbXNTZXRUbyh7fSwgKCkgPT4ge1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudC5vbkNhbmNlbGxhdGlvbigoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29tcG9uZW50LnNlbGVjdCgpO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0NhbmNlbGxhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbmNlbCBvbiB0aGUgY29yZTpjYW5jZWwgY29tbWFuZCAoZXNjKScsICgpID0+IHtcbiAgICAgIHdpdGhJdGVtc1NldFRvKHt0ZXN0RGlyZWN0b3J5OiB7dGVzdFByb3ZpZGVyOiBQcm9taXNlLnJlc29sdmUoe3Jlc3VsdHM6IFsxLCAyLCAzXX0pfX0sICgpID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb21wb25lbnQub25DYW5jZWxsYXRpb24oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goY29tcG9uZW50Tm9kZSwgJ2NvcmU6Y2FuY2VsJyk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnU2VsZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3RhcnQgb3V0IHdpdGhvdXQgc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgd2l0aEl0ZW1zU2V0VG8oe3Rlc3REaXJlY3Rvcnk6IHt0ZXN0UHJvdmlkZXI6IFByb21pc2UucmVzb2x2ZSh7cmVzdWx0czogWzEsIDIsIDNdfSl9fSwgKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW1JbmRleCA9IGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCk7XG4gICAgICAgIGV4cGVjdChzZWxlY3RlZEl0ZW1JbmRleC5zZWxlY3RlZERpcmVjdG9yeSkudG9CZSgnJyk7XG4gICAgICAgIGV4cGVjdChzZWxlY3RlZEl0ZW1JbmRleC5zZWxlY3RlZFNlcnZpY2UpLnRvQmUoJycpO1xuICAgICAgICBleHBlY3Qoc2VsZWN0ZWRJdGVtSW5kZXguc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1vdmUgdGhlIHNlbGVjdGlvbiBhbmQgd3JhcCBhdCB0aGUgdG9wL2JvdHRvbScsICgpID0+IHtcbiAgICAgIHdpdGhJdGVtc1NldFRvKHt0ZXN0RGlyZWN0b3J5OiB7dGVzdFByb3ZpZGVyOiBQcm9taXNlLnJlc29sdmUoe3Jlc3VsdHM6IFsxLCAyLCAzXX0pfX0sICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCkuc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uU2VsZWN0aW9uQ2hhbmdlZCgobmV3SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUobmV3SW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbXBvbmVudC5tb3ZlU2VsZWN0aW9uRG93bigpO1xuICAgICAgICB9KS50aGVuKG5ld0luZGV4ID0+IHtcbiAgICAgICAgICBleHBlY3QobmV3SW5kZXguc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoMCk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudC5vblNlbGVjdGlvbkNoYW5nZWQoKG5ld0luZGV4KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKG5ld0luZGV4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb21wb25lbnQubW92ZVNlbGVjdGlvbkRvd24oKTtcbiAgICAgICAgfSkudGhlbihuZXdJbmRleCA9PiB7XG4gICAgICAgICAgZXhwZWN0KG5ld0luZGV4LnNlbGVjdGVkSXRlbUluZGV4KS50b0JlKDEpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb21wb25lbnQub25TZWxlY3Rpb25DaGFuZ2VkKChuZXdJbmRleCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShuZXdJbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25Eb3duKCk7XG4gICAgICAgIH0pLnRoZW4obmV3SW5kZXggPT4ge1xuICAgICAgICAgIGV4cGVjdChuZXdJbmRleC5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgyKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uU2VsZWN0aW9uQ2hhbmdlZCgobmV3SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUobmV3SW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbXBvbmVudC5tb3ZlU2VsZWN0aW9uRG93bigpO1xuICAgICAgICB9KS50aGVuKG5ld0luZGV4ID0+IHtcbiAgICAgICAgICBleHBlY3QobmV3SW5kZXguc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoMCk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudC5vblNlbGVjdGlvbkNoYW5nZWQoKG5ld0luZGV4KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKG5ld0luZGV4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb21wb25lbnQubW92ZVNlbGVjdGlvblVwKCk7XG4gICAgICAgIH0pLnRoZW4obmV3SW5kZXggPT4ge1xuICAgICAgICAgIGV4cGVjdChuZXdJbmRleC5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgyKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uU2VsZWN0aW9uQ2hhbmdlZCgobmV3SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUobmV3SW5kZXgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbXBvbmVudC5tb3ZlU2VsZWN0aW9uVXAoKTtcbiAgICAgICAgfSkudGhlbihuZXdJbmRleCA9PiB7XG4gICAgICAgICAgZXhwZWN0KG5ld0luZGV4LnNlbGVjdGVkSXRlbUluZGV4KS50b0JlKDEpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb21wb25lbnQub25TZWxlY3Rpb25DaGFuZ2VkKChuZXdJbmRleCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShuZXdJbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25VcCgpO1xuICAgICAgICB9KS50aGVuKG5ld0luZGV4ID0+IHtcbiAgICAgICAgICBleHBlY3QobmV3SW5kZXguc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoMCk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudC5vblNlbGVjdGlvbkNoYW5nZWQoKG5ld0luZGV4KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKG5ld0luZGV4KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb21wb25lbnQubW92ZVNlbGVjdGlvblVwKCk7XG4gICAgICAgIH0pLnRoZW4obmV3SW5kZXggPT4ge1xuICAgICAgICAgIGV4cGVjdChuZXdJbmRleC5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgyKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbW92ZSB0aGUgc2VsZWN0aW9uIGFwcHJvcHJpYXRlbHkgb24gY29yZTptb3ZlKiBjb21tYW5kcycsICgpID0+IHtcbiAgICAgIHdpdGhJdGVtc1NldFRvKHt0ZXN0RGlyZWN0b3J5OiB7dGVzdFByb3ZpZGVyOiBQcm9taXNlLnJlc29sdmUoe3Jlc3VsdHM6IFsxLCAyLCAzXX0pfX0sICgpID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50Tm9kZSA9IFJlYWN0LmZpbmRET01Ob2RlKGNvbXBvbmVudCk7XG5cbiAgICAgICAgY29uc3Qgc3RlcHMgPSBbXG4gICAgICAgICAge2V4cGVjdGVkSW5kZXg6IDAsIG5leHRDb21tYW5kOiAnY29yZTptb3ZlLXVwJ30sXG4gICAgICAgICAge2V4cGVjdGVkSW5kZXg6IDIsIG5leHRDb21tYW5kOiAnY29yZTptb3ZlLWRvd24nfSxcbiAgICAgICAgICB7ZXhwZWN0ZWRJbmRleDogMCwgbmV4dENvbW1hbmQ6ICdjb3JlOm1vdmUtZG93bid9LFxuICAgICAgICAgIHtleHBlY3RlZEluZGV4OiAxLCBuZXh0Q29tbWFuZDogJ2NvcmU6bW92ZS10by1ib3R0b20nfSxcbiAgICAgICAgICB7ZXhwZWN0ZWRJbmRleDogMiwgbmV4dENvbW1hbmQ6ICdjb3JlOm1vdmUtdG8tdG9wJ30sXG4gICAgICAgICAge2V4cGVjdGVkSW5kZXg6IDAsIG5leHRDb21tYW5kOiAnJ30sXG4gICAgICAgIF07XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICAgICAgZXhwZWN0KGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCkuc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudC5vblNlbGVjdGlvbkNoYW5nZWQoKG5ld0luZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IHN0ZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3Qgc3BlYyA9IHN0ZXBzW2luZGV4XTtcbiAgICAgICAgICAgICAgZXhwZWN0KG5ld0luZGV4LnNlbGVjdGVkSXRlbUluZGV4KS50b0JlKHNwZWMuZXhwZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goY29tcG9uZW50Tm9kZSwgc3BlYy5uZXh0Q29tbWFuZCk7XG4gICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25Ub1RvcCgpO1xuICAgICAgICB9KSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXNldCB0aGUgc2VsZWN0aW9uIHdoZW4gdGhlIGxpc3QgY29udGVudHMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgd2l0aEl0ZW1zU2V0VG8oe3Rlc3REaXJlY3Rvcnk6IHt0ZXN0UHJvdmlkZXI6IFByb21pc2UucmVzb2x2ZSh7cmVzdWx0czogWzEsIDIsIDNdfSl9fSwgKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29tcG9uZW50LmdldFNlbGVjdGVkSW5kZXgoKS5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgtMSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb21wb25lbnQub25TZWxlY3Rpb25DaGFuZ2VkKChuZXdJbmRleCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShuZXdJbmRleCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25Eb3duKCk7XG4gICAgICAgIH0pLnRoZW4obmV3SW5kZXggPT4ge1xuICAgICAgICAgIGV4cGVjdChuZXdJbmRleC5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgwKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdpdGhJdGVtc1NldFRvKFxuICAgICAgICAgIHt0ZXN0RGlyZWN0b3J5OiB7dGVzdFByb3ZpZGVyOiBQcm9taXNlLnJlc29sdmUoe3Jlc3VsdHM6IFs1LCA2LCA3XX0pfX0sXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCkuc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBrZWVwIHRoZSBzZWxlY3Rpb24gaW5kZXggYXQgLTEgd2hlbiB0aGVyZSBhcmUgbm8gaXRlbXMnLCAoKSA9PiB7XG4gICAgICB3aXRoSXRlbXNTZXRUbyh7fSwgKCkgPT4ge1xuICAgICAgICAvL2VuYWJsZSBzZXRUaW1lb3V0OiBodHRwczovL2Rpc2N1c3MuYXRvbS5pby90L3NvbHZlZC1zZXR0aW1lb3V0LW5vdC13b3JraW5nLWZpcmluZy1pbi1zcGVjcy10ZXN0cy8xMTQyN1xuICAgICAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcblxuICAgICAgICBleHBlY3QoY29tcG9uZW50LmdldFNlbGVjdGVkSW5kZXgoKS5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgtMSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChjb21wb25lbnQuZ2V0U2VsZWN0ZWRJbmRleCgpLnNlbGVjdGVkSXRlbUluZGV4KS50b0JlKC0xKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICBjb21wb25lbnQubW92ZVNlbGVjdGlvbkRvd24oKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoY29tcG9uZW50LmdldFNlbGVjdGVkSW5kZXgoKS5zZWxlY3RlZEl0ZW1JbmRleCkudG9CZSgtMSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgY29tcG9uZW50Lm1vdmVTZWxlY3Rpb25Ub0JvdHRvbSgpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChjb21wb25lbnQuZ2V0U2VsZWN0ZWRJbmRleCgpLnNlbGVjdGVkSXRlbUluZGV4KS50b0JlKC0xKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICBjb21wb25lbnQubW92ZVNlbGVjdGlvblVwKCk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGNvbXBvbmVudC5nZXRTZWxlY3RlZEluZGV4KCkuc2VsZWN0ZWRJdGVtSW5kZXgpLnRvQmUoLTEpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICAgIGNvbXBvbmVudC5tb3ZlU2VsZWN0aW9uVG9Ub3AoKTtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGlucHV0IHRleHQgdG8gYmUgc2V0IGFmdGVyIG1vdW50JywgKCkgPT4ge1xuICAgICAgY29tcG9uZW50LnNldElucHV0VmFsdWUoJ2ZvbycpO1xuICAgICAgY29uc3QgZWRpdG9yID0gY29tcG9uZW50LmdldElucHV0VGV4dEVkaXRvcigpLm1vZGVsO1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJ2ZvbycpO1xuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-quick-open/spec/QuickSelectionComponent-spec.js
