'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BreakpointStore = require('../lib/BreakpointStore');
var Bridge = require('../lib/Bridge');
var utils = require('./utils');

var _require = require('nuclide-commons');

var array = _require.array;

var MockWebview = (function () {
  function MockWebview() {
    _classCallCheck(this, MockWebview);

    this._listeners = new Map();
    this._sendSpy = jasmine.createSpy('send');
  }

  _createClass(MockWebview, [{
    key: 'addEventListener',
    value: function addEventListener(name, callback) {
      var set = this._listeners.get(name);
      if (set) {
        set.add(callback);
      } else {
        this._listeners.set(name, new Set([callback]));
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, callback) {
      var set = this._listeners.get(name);
      if (set) {
        set['delete'](callback);
      }
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(name, obj) {
      var set = this._listeners.get(name);
      if (set) {
        set.forEach(function (callback) {
          return callback(obj);
        });
      }
    }
  }, {
    key: 'getListeners',
    value: function getListeners(name) {
      return this._listeners.get(name) || new Set();
    }

    // send(...args: any[])
  }, {
    key: 'send',
    get: function get() {
      return this._sendSpy;
    }
  }]);

  return MockWebview;
})();

describe('Bridge', function () {
  var breakpointStore = undefined;
  var bridge = undefined;
  var editor = undefined;
  var mockWebview = undefined;
  var path = undefined;

  function getCallFrameDecorationInRow(row) {
    var decorationArrays = editor.decorationsForScreenRowRange(row, row);
    for (var key in decorationArrays) {
      var result = array.find(decorationArrays[key], function (item) {
        return item.getProperties()['class'] === 'nuclide-current-line-highlight';
      });
      if (result !== undefined) {
        return result;
      }
    }
    return null;
  }

  function getCursorInRow(row) {
    var result = null;
    var cursors = editor.getCursors();
    cursors.forEach(function (cursor) {
      if (cursor.getBufferRow() === row) {
        result = cursor;
      }
    });
    return result;
  }

  function sendIpcNotification() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    mockWebview.dispatchEvent('ipc-message', {
      channel: 'notification',
      args: args
    });
  }

  beforeEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      editor = yield utils.createEditorWithUniquePath();
      // Feed 30 lines to editor
      editor.setText('foo\nbar\nbaz'.repeat(10));
      path = editor.getPath();
      mockWebview = new MockWebview();
      breakpointStore = new BreakpointStore();
      bridge = new Bridge(breakpointStore);
      spyOn(breakpointStore, 'addBreakpoint').andCallThrough();
      spyOn(breakpointStore, 'deleteBreakpoint').andCallThrough();
      bridge.setWebviewElement(mockWebview);
    }));
    runs(function () {
      sendIpcNotification('CallFrameSelected', {
        sourceURL: 'file://' + path,
        lineNumber: 1
      });
    });
  });

  it('should add decoration to line of current call frame', function () {
    waitsFor(function () {
      return !!getCallFrameDecorationInRow(1);
    }, 'call frame highlight to appear', 100);

    runs(function () {
      expect(getCallFrameDecorationInRow(1)).toBeTruthy();
    });
  });

  it('should remove decoration when resuming', function () {
    waitsFor(function () {
      return !!getCallFrameDecorationInRow(1);
    }, 'call frame highlight to appear', 100);

    runs(function () {
      expect(getCallFrameDecorationInRow(1)).toBeTruthy();
      sendIpcNotification('DebuggerResumed');
      expect(getCallFrameDecorationInRow(1)).toBeFalsy();
    });
  });

  it('should remove decoration and unregister listener when disposed', function () {
    waitsFor(function () {
      return !!getCallFrameDecorationInRow(1);
    }, 'call frame highlight to appear', 100);

    runs(function () {
      expect(getCallFrameDecorationInRow(1)).toBeTruthy();
      bridge.dispose();
      expect(getCallFrameDecorationInRow(1)).toBeFalsy();
      expect(mockWebview.getListeners('ipc-message').size).toEqual(0);
    });
  });

  it('should remove decoration and unregister listener after cleanup', function () {
    waitsFor(function () {
      return !!getCallFrameDecorationInRow(1);
    }, 'call frame highlight to appear', 100);

    runs(function () {
      expect(getCallFrameDecorationInRow(1)).toBeTruthy();
      bridge.cleanup();
      expect(getCallFrameDecorationInRow(1)).toBeFalsy();
      expect(mockWebview.getListeners('ipc-message').size).toEqual(0);
    });
  });

  it('should send breakpoints over ipc when breakpoints change', function () {
    breakpointStore.addBreakpoint('/tmp/foobarbaz.js', 4);
    expect(mockWebview.send).toHaveBeenCalledWith('command', 'SyncBreakpoints', [{
      sourceURL: 'file:///tmp/foobarbaz.js',
      lineNumber: 4
    }]);
  });

  it('should send execution control commands over ipc', function () {
    bridge['continue']();
    expect(mockWebview.send).toHaveBeenCalledWith('command', 'Continue');

    bridge.stepOver();
    expect(mockWebview.send).toHaveBeenCalledWith('command', 'StepOver');

    bridge.stepInto();
    expect(mockWebview.send).toHaveBeenCalledWith('command', 'StepInto');

    bridge.stepOut();
    expect(mockWebview.send).toHaveBeenCalledWith('command', 'StepOut');
  });

  it('should move cursor to target line when open source location', function () {
    var line = 13;
    sendIpcNotification('OpenSourceLocation', {
      sourceURL: 'file://' + path,
      lineNumber: line
    });

    waitsFor(function () {
      return !!getCursorInRow(line);
    }, 'cursor at line to appear', 100);

    runs(function () {
      expect(editor.getCursorBufferPosition().row).toEqual(line);
    });
  });

  it('should change BreakpointStore when getting add/remove breakpoints notification', function () {
    var line = 15;
    sendIpcNotification('BreakpointAdded', {
      sourceURL: 'file://' + path,
      lineNumber: line
    });
    expect(breakpointStore.addBreakpoint).toHaveBeenCalledWith(path, line);

    sendIpcNotification('BreakpointRemoved', {
      sourceURL: 'file://' + path,
      lineNumber: line
    });
    expect(breakpointStore.deleteBreakpoint).toHaveBeenCalledWith(path, line);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGVidWdnZXItYXRvbS9zcGVjL0JyaWRnZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQVdaLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzFELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN4QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O2VBQ2pCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQzs7SUFBbkMsS0FBSyxZQUFMLEtBQUs7O0lBRU4sV0FBVztBQUlKLFdBSlAsV0FBVyxHQUlEOzBCQUpWLFdBQVc7O0FBS2IsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMzQzs7ZUFQRyxXQUFXOztXQVNDLDBCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDL0IsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsVUFBSSxHQUFHLEVBQUU7QUFDUCxXQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ25CLE1BQU07QUFDTCxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDaEQ7S0FDRjs7O1dBRWtCLDZCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDbEMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsVUFBSSxHQUFH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Q0FBQyxZQUFNO0FBQ1QsWUFBTSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGdGQUFnRixFQUFFLFlBQU07QUFDekYsUUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLHVCQUFtQixDQUFDLGlCQUFpQixFQUFFO0FBQ3JDLGVBQVMsRUFBRSxTQUFTLEdBQUcsSUFBSTtBQUMzQixnQkFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXZFLHVCQUFtQixDQUFDLG1CQUFtQixFQUFFO0FBQ3ZDLGVBQVMsRUFBRSxTQUFTLEdBQUcsSUFBSTtBQUMzQixnQkFBVSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUMzRSxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1kZWJ1Z2dlci1hdG9tL3NwZWMvQnJpZGdlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5jb25zdCBCcmVha3BvaW50U3RvcmUgPSByZXF1aXJlKCcuLi9saWIvQnJlYWtwb2ludFN0b3JlJyk7XG5jb25zdCBCcmlkZ2UgPSByZXF1aXJlKCcuLi9saWIvQnJpZGdlJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IHthcnJheX0gPSByZXF1aXJlKCdudWNsaWRlLWNvbW1vbnMnKTtcblxuY2xhc3MgTW9ja1dlYnZpZXcge1xuICBfbGlzdGVuZXJzOiBNYXA8U3RyaW5nLCBTZXQ8RnVuY3Rpb24+PjtcbiAgX3NlbmRTcHk6IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fc2VuZFNweSA9IGphc21pbmUuY3JlYXRlU3B5KCdzZW5kJyk7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc2V0ID0gdGhpcy5fbGlzdGVuZXJzLmdldChuYW1lKTtcbiAgICBpZiAoc2V0KSB7XG4gICAgICBzZXQuYWRkKGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNldChuYW1lLCBuZXcgU2V0KFtjYWxsYmFja10pKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc2V0ID0gdGhpcy5fbGlzdGVuZXJzLmdldChuYW1lKTtcbiAgICBpZiAoc2V0KSB7XG4gICAgICBzZXQuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KG5hbWUsIG9iaikge1xuICAgIGNvbnN0IHNldCA9IHRoaXMuX2xpc3RlbmVycy5nZXQobmFtZSk7XG4gICAgaWYgKHNldCkge1xuICAgICAgc2V0LmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sob2JqKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TGlzdGVuZXJzKG5hbWUpOiBTZXQ8RnVuY3Rpb24+IHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmdldChuYW1lKSB8fCBuZXcgU2V0KCk7XG4gIH1cblxuICAvLyBzZW5kKC4uLmFyZ3M6IGFueVtdKVxuICBnZXQgc2VuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VuZFNweTtcbiAgfVxufVxuXG5kZXNjcmliZSgnQnJpZGdlJywgKCkgPT4ge1xuICBsZXQgYnJlYWtwb2ludFN0b3JlO1xuICBsZXQgYnJpZGdlO1xuICBsZXQgZWRpdG9yO1xuICBsZXQgbW9ja1dlYnZpZXc7XG4gIGxldCBwYXRoO1xuXG4gIGZ1bmN0aW9uIGdldENhbGxGcmFtZURlY29yYXRpb25JblJvdyhyb3c6IG51bWJlcik6ID9hdG9tJERlY29yYXRpb24ge1xuICAgIGNvbnN0IGRlY29yYXRpb25BcnJheXMgPSBlZGl0b3IuZGVjb3JhdGlvbnNGb3JTY3JlZW5Sb3dSYW5nZShyb3csIHJvdyk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVjb3JhdGlvbkFycmF5cykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXJyYXkuZmluZChkZWNvcmF0aW9uQXJyYXlzW2tleV0sIChpdGVtKSA9PiBpdGVtLmdldFByb3BlcnRpZXMoKS5jbGFzcyA9PT0gJ251Y2xpZGUtY3VycmVudC1saW5lLWhpZ2hsaWdodCcpO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3Vyc29ySW5Sb3cocm93OiBudW1iZXIpOiA/YXRvbSRDdXJzb3Ige1xuICAgIGxldCByZXN1bHQgPSBudWxsO1xuICAgIGNvbnN0IGN1cnNvcnMgPSBlZGl0b3IuZ2V0Q3Vyc29ycygpO1xuICAgIGN1cnNvcnMuZm9yRWFjaChjdXJzb3IgPT4ge1xuICAgICAgaWYgKGN1cnNvci5nZXRCdWZmZXJSb3coKSA9PT0gcm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGN1cnNvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2VuZElwY05vdGlmaWNhdGlvbiguLi5hcmdzOiBhbnlbXSkge1xuICAgIG1vY2tXZWJ2aWV3LmRpc3BhdGNoRXZlbnQoJ2lwYy1tZXNzYWdlJywge1xuICAgICAgY2hhbm5lbDogJ25vdGlmaWNhdGlvbicsXG4gICAgICBhcmdzOiBhcmdzLFxuICAgIH0pO1xuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgIGVkaXRvciA9IGF3YWl0IHV0aWxzLmNyZWF0ZUVkaXRvcldpdGhVbmlxdWVQYXRoKCk7XG4gICAgICAvLyBGZWVkIDMwIGxpbmVzIHRvIGVkaXRvclxuICAgICAgZWRpdG9yLnNldFRleHQoJ2Zvb1xcbmJhclxcbmJheicucmVwZWF0KDEwKSk7XG4gICAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIG1vY2tXZWJ2aWV3ID0gbmV3IE1vY2tXZWJ2aWV3KCk7XG4gICAgICBicmVha3BvaW50U3RvcmUgPSBuZXcgQnJlYWtwb2ludFN0b3JlKCk7XG4gICAgICBicmlkZ2UgPSBuZXcgQnJpZGdlKGJyZWFrcG9pbnRTdG9yZSk7XG4gICAgICBzcHlPbihicmVha3BvaW50U3RvcmUsICdhZGRCcmVha3BvaW50JykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgIHNweU9uKGJyZWFrcG9pbnRTdG9yZSwgJ2RlbGV0ZUJyZWFrcG9pbnQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgYnJpZGdlLnNldFdlYnZpZXdFbGVtZW50KG1vY2tXZWJ2aWV3KTtcbiAgICB9KTtcbiAgICBydW5zKCgpID0+IHtcbiAgICAgIHNlbmRJcGNOb3RpZmljYXRpb24oJ0NhbGxGcmFtZVNlbGVjdGVkJywge1xuICAgICAgICBzb3VyY2VVUkw6ICdmaWxlOi8vJyArIHBhdGgsXG4gICAgICAgIGxpbmVOdW1iZXI6IDEsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhZGQgZGVjb3JhdGlvbiB0byBsaW5lIG9mIGN1cnJlbnQgY2FsbCBmcmFtZScsICgpID0+IHtcbiAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICByZXR1cm4gISFnZXRDYWxsRnJhbWVEZWNvcmF0aW9uSW5Sb3coMSk7XG4gICAgfSwgJ2NhbGwgZnJhbWUgaGlnaGxpZ2h0IHRvIGFwcGVhcicsIDEwMCk7XG5cbiAgICBydW5zKCgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRDYWxsRnJhbWVEZWNvcmF0aW9uSW5Sb3coMSkpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZW1vdmUgZGVjb3JhdGlvbiB3aGVuIHJlc3VtaW5nJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiAhIWdldENhbGxGcmFtZURlY29yYXRpb25JblJvdygxKTtcbiAgICB9LCAnY2FsbCBmcmFtZSBoaWdobGlnaHQgdG8gYXBwZWFyJywgMTAwKTtcblxuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldENhbGxGcmFtZURlY29yYXRpb25JblJvdygxKSkudG9CZVRydXRoeSgpO1xuICAgICAgc2VuZElwY05vdGlmaWNhdGlvbignRGVidWdnZXJSZXN1bWVkJyk7XG4gICAgICBleHBlY3QoZ2V0Q2FsbEZyYW1lRGVjb3JhdGlvbkluUm93KDEpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZW1vdmUgZGVjb3JhdGlvbiBhbmQgdW5yZWdpc3RlciBsaXN0ZW5lciB3aGVuIGRpc3Bvc2VkJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgIHJldHVybiAhIWdldENhbGxGcmFtZURlY29yYXRpb25JblJvdygxKTtcbiAgICB9LCAnY2FsbCBmcmFtZSBoaWdobGlnaHQgdG8gYXBwZWFyJywgMTAwKTtcblxuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldENhbGxGcmFtZURlY29yYXRpb25JblJvdygxKSkudG9CZVRydXRoeSgpO1xuICAgICAgYnJpZGdlLmRpc3Bvc2UoKTtcbiAgICAgIGV4cGVjdChnZXRDYWxsRnJhbWVEZWNvcmF0aW9uSW5Sb3coMSkpLnRvQmVGYWxzeSgpO1xuICAgICAgZXhwZWN0KG1vY2tXZWJ2aWV3LmdldExpc3RlbmVycygnaXBjLW1lc3NhZ2UnKS5zaXplKS50b0VxdWFsKDApO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlbW92ZSBkZWNvcmF0aW9uIGFuZCB1bnJlZ2lzdGVyIGxpc3RlbmVyIGFmdGVyIGNsZWFudXAnLCAoKSA9PiB7XG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuICEhZ2V0Q2FsbEZyYW1lRGVjb3JhdGlvbkluUm93KDEpO1xuICAgIH0sICdjYWxsIGZyYW1lIGhpZ2hsaWdodCB0byBhcHBlYXInLCAxMDApO1xuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0Q2FsbEZyYW1lRGVjb3JhdGlvbkluUm93KDEpKS50b0JlVHJ1dGh5KCk7XG4gICAgICBicmlkZ2UuY2xlYW51cCgpO1xuICAgICAgZXhwZWN0KGdldENhbGxGcmFtZURlY29yYXRpb25JblJvdygxKSkudG9CZUZhbHN5KCk7XG4gICAgICBleHBlY3QobW9ja1dlYnZpZXcuZ2V0TGlzdGVuZXJzKCdpcGMtbWVzc2FnZScpLnNpemUpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2VuZCBicmVha3BvaW50cyBvdmVyIGlwYyB3aGVuIGJyZWFrcG9pbnRzIGNoYW5nZScsICgpID0+IHtcbiAgICBicmVha3BvaW50U3RvcmUuYWRkQnJlYWtwb2ludCgnL3RtcC9mb29iYXJiYXouanMnLCA0KTtcbiAgICBleHBlY3QobW9ja1dlYnZpZXcuc2VuZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NvbW1hbmQnLCAnU3luY0JyZWFrcG9pbnRzJywgW3tcbiAgICAgIHNvdXJjZVVSTDogJ2ZpbGU6Ly8vdG1wL2Zvb2JhcmJhei5qcycsXG4gICAgICBsaW5lTnVtYmVyOiA0LFxuICAgIH1dKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZW5kIGV4ZWN1dGlvbiBjb250cm9sIGNvbW1hbmRzIG92ZXIgaXBjJywgKCkgPT4ge1xuICAgIGJyaWRnZS5jb250aW51ZSgpO1xuICAgIGV4cGVjdChtb2NrV2Vidmlldy5zZW5kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY29tbWFuZCcsICdDb250aW51ZScpO1xuXG4gICAgYnJpZGdlLnN0ZXBPdmVyKCk7XG4gICAgZXhwZWN0KG1vY2tXZWJ2aWV3LnNlbmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjb21tYW5kJywgJ1N0ZXBPdmVyJyk7XG5cbiAgICBicmlkZ2Uuc3RlcEludG8oKTtcbiAgICBleHBlY3QobW9ja1dlYnZpZXcuc2VuZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NvbW1hbmQnLCAnU3RlcEludG8nKTtcblxuICAgIGJyaWRnZS5zdGVwT3V0KCk7XG4gICAgZXhwZWN0KG1vY2tXZWJ2aWV3LnNlbmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjb21tYW5kJywgJ1N0ZXBPdXQnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBtb3ZlIGN1cnNvciB0byB0YXJnZXQgbGluZSB3aGVuIG9wZW4gc291cmNlIGxvY2F0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGxpbmUgPSAxMztcbiAgICBzZW5kSXBjTm90aWZpY2F0aW9uKCdPcGVuU291cmNlTG9jYXRpb24nLCB7XG4gICAgICBzb3VyY2VVUkw6ICdmaWxlOi8vJyArIHBhdGgsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lLFxuICAgIH0pO1xuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuICEhZ2V0Q3Vyc29ySW5Sb3cobGluZSk7XG4gICAgfSwgJ2N1cnNvciBhdCBsaW5lIHRvIGFwcGVhcicsIDEwMCk7XG5cbiAgICBydW5zKCgpID0+IHtcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3cpLnRvRXF1YWwobGluZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY2hhbmdlIEJyZWFrcG9pbnRTdG9yZSB3aGVuIGdldHRpbmcgYWRkL3JlbW92ZSBicmVha3BvaW50cyBub3RpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgbGluZSA9IDE1O1xuICAgIHNlbmRJcGNOb3RpZmljYXRpb24oJ0JyZWFrcG9pbnRBZGRlZCcsIHtcbiAgICAgIHNvdXJjZVVSTDogJ2ZpbGU6Ly8nICsgcGF0aCxcbiAgICAgIGxpbmVOdW1iZXI6IGxpbmUsXG4gICAgfSk7XG4gICAgZXhwZWN0KGJyZWFrcG9pbnRTdG9yZS5hZGRCcmVha3BvaW50KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoLCBsaW5lKTtcblxuICAgIHNlbmRJcGNOb3RpZmljYXRpb24oJ0JyZWFrcG9pbnRSZW1vdmVkJywge1xuICAgICAgc291cmNlVVJMOiAnZmlsZTovLycgKyBwYXRoLFxuICAgICAgbGluZU51bWJlcjogbGluZSxcbiAgICB9KTtcbiAgICBleHBlY3QoYnJlYWtwb2ludFN0b3JlLmRlbGV0ZUJyZWFrcG9pbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGgsIGxpbmUpO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-debugger-atom/spec/Bridge-spec.js
