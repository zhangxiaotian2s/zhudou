function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-env browser */

var _nuclideCommons = require('nuclide-commons');

var _atom = require('atom');

var _libHyperclick = require('../lib/Hyperclick');

var _libHyperclick2 = _interopRequireDefault(_libHyperclick);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

'use babel';

describe('Hyperclick', function () {
  var textEditor = null;
  var textEditorView = null;
  var hyperclick = null;
  var hyperclickForTextEditor = null;

  beforeEach(function () {
    return waitsForPromise(_asyncToGenerator(function* () {
      textEditor = yield atom.workspace.open('hyperclick.txt');
      textEditorView = atom.views.getView(textEditor);

      // We need the view attached to the DOM for the mouse events to work.
      jasmine.attachToDOM(textEditorView);

      hyperclick = new _libHyperclick2['default']();
      hyperclickForTextEditor = _nuclideCommons.array.from(hyperclick._hyperclickForTextEditors)[0];
    }));
  });

  afterEach(function () {
    hyperclick.dispose();
  });

  /**
   * Returns the pixel position in the DOM of the text editor's screen position.
   * This is used for dispatching mouse events in the text editor.
   *
   * Adapted from https://github.com/atom/atom/blob/5272584d2910e5b3f2b0f309aab4775eb0f779a6/spec/text-editor-component-spec.coffee#L2845
   */
  function clientCoordinatesForScreenPosition(screenPosition) {
    var positionOffset = textEditorView.pixelPositionForScreenPosition(screenPosition);
    var _textEditorView = textEditorView;
    var component = _textEditorView.component;

    (0, _assert2['default'])(component);
    var scrollViewClientRect = component.domNode.querySelector('.scroll-view').getBoundingClientRect();
    // $FlowFixMe: Use of private method.
    var scrollLeft = textEditor.getScrollLeft();
    // $FlowFixMe: Use of private method.
    var scrollTop = textEditor.getScrollTop();
    var clientX = scrollViewClientRect.left + positionOffset.left - scrollLeft;
    var clientY = scrollViewClientRect.top + positionOffset.top - scrollTop;
    return { clientX: clientX, clientY: clientY };
  }

  function dispatch(
  // $FlowIssue KeyboardEvent isn't defined.
  eventClass, type, position, properties) {
    var _clientCoordinatesForScreenPosition = clientCoordinatesForScreenPosition(position);

    var clientX = _clientCoordinatesForScreenPosition.clientX;
    var clientY = _clientCoordinatesForScreenPosition.clientY;

    if (properties != null) {
      properties.clientX = clientX;
      properties.clientY = clientY;
    } else {
      properties = { clientX: clientX, clientY: clientY };
    }
    var event = new eventClass(type, properties);
    var domNode = null;
    if (eventClass === MouseEvent) {
      var _textEditorView2 = textEditorView;
      var component = _textEditorView2.component;

      (0, _assert2['default'])(component);
      domNode = component.linesComponent.getDomNode();
    } else {
      domNode = textEditorView;
    }
    domNode.dispatchEvent(event);
  }

  describe('simple case', function () {
    var provider = null;
    var position = new _atom.Point(0, 1);

    beforeEach(function () {
      provider = {
        providerName: 'test',
        getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
          return { range: range, callback: function callback() {} };
        })
      };
      spyOn(provider, 'getSuggestionForWord').andCallThrough();
      hyperclick.consumeProvider(provider);
    });
    it('should call the provider', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        yield hyperclick.getSuggestion(textEditor, position);
        expect(provider.getSuggestionForWord).toHaveBeenCalled();
      }));
    });
    it('should not call a removed provider', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        hyperclick.removeProvider(provider);
        yield hyperclick.getSuggestion(textEditor, position);
        expect(provider.getSuggestionForWord).not.toHaveBeenCalled();
      }));
    });
  });

  describe('<meta-mousemove> + <meta-mousedown>', function () {
    it('consumes single-word providers without wordRegExp', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        var expectedText = 'word1';
        var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('consumes single-word providers with wordRegExp', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          }),
          wordRegExp: /word/g
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 8);
        var expectedText = 'word';
        var expectedRange = _atom.Range.fromObject([[0, 6], [0, 10]]);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('consumes multi-range providers', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestion: _asyncToGenerator(function* (sourceTextEditor, sourcePosition) {
            var range = [new _atom.Range(sourcePosition, sourcePosition.translate([0, 1])), new _atom.Range(sourcePosition.translate([0, 2]), sourcePosition.translate([0, 3]))];
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestion').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 8);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('consumes multiple providers from different sources', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          // Do not return a suggestion, so we can fall through to provider2.
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {})
        };
        spyOn(provider1, 'getSuggestionForWord').andCallThrough();

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          })
        };
        spyOn(provider2, 'getSuggestionForWord').andCallThrough();

        hyperclick.consumeProvider(provider1);
        hyperclick.consumeProvider(provider2);

        var position = new _atom.Point(0, 1);
        var expectedText = 'word1';
        var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider2.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });

    it('consumes multiple providers from the same source', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          // Do not return a suggestion, so we can fall through to provider2.
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {})
        };
        spyOn(provider1, 'getSuggestionForWord').andCallThrough();

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          })
        };
        spyOn(provider2, 'getSuggestionForWord').andCallThrough();

        hyperclick.consumeProvider([provider1, provider2]);

        var position = new _atom.Point(0, 1);
        var expectedText = 'word1';
        var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider2.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });
  });

  describe('avoids excessive calls', function () {
    it('ignores <mousemove> in the same word as the last position', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            // Never resolve this, so we know that no suggestion is set.
            return new Promise(function () {});
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        dispatch(MouseEvent, 'mousemove', position.translate([0, 1]), { metaKey: true });
        dispatch(MouseEvent, 'mousemove', position.translate([0, 2]), { metaKey: true });

        expect(provider.getSuggestionForWord.callCount).toBe(1);
      }));
    });

    it('ignores <mousemove> in the same single-range as the last suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        var expectedText = 'word1';
        var expectedRange = _atom.Range.fromObject([[0, 0], [0, 5]]);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedRange);

        dispatch(MouseEvent, 'mousemove', position.translate([0, 1]), { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();

        expect(provider.getSuggestionForWord.callCount).toBe(1);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('handles <mousemove> in a different single-range as the last suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position1 = new _atom.Point(0, 1);
        var expectedText1 = 'word1';
        var expectedRange1 = _atom.Range.fromObject([[0, 0], [0, 5]]);

        dispatch(MouseEvent, 'mousemove', position1, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText1, expectedRange1);

        var position2 = new _atom.Point(0, 8);
        var expectedText2 = 'word2';
        var expectedRange2 = _atom.Range.fromObject([[0, 6], [0, 11]]);
        dispatch(MouseEvent, 'mousemove', position2, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText2, expectedRange2);

        expect(provider.getSuggestionForWord.callCount).toBe(2);

        dispatch(MouseEvent, 'mousedown', position2, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('ignores <mousemove> in the same multi-range as the last suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var range = [new _atom.Range(new _atom.Point(0, 1), new _atom.Point(0, 2)), new _atom.Range(new _atom.Point(0, 4), new _atom.Point(0, 5))];
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestion: _asyncToGenerator(function* (sourceTextEditor, sourcePosition) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestion').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position);

        dispatch(MouseEvent, 'mousemove', new _atom.Point(0, 4), { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();

        expect(provider.getSuggestion.callCount).toBe(1);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });

    it('handles <mousemove> in a different multi-range as the last suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var range = [new _atom.Range(new _atom.Point(0, 1), new _atom.Point(0, 2)), new _atom.Range(new _atom.Point(0, 4), new _atom.Point(0, 5))];
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestion: _asyncToGenerator(function* (sourceTextEditor, position) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestion').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position1 = new _atom.Point(0, 1);

        dispatch(MouseEvent, 'mousemove', position1, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position1);

        var position2 = new _atom.Point(0, 3);
        dispatch(MouseEvent, 'mousemove', position2, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestion).toHaveBeenCalledWith(textEditor, position2);

        expect(provider.getSuggestion.callCount).toBe(2);

        dispatch(MouseEvent, 'mousedown', position2, { metaKey: true });
        expect(callback.callCount).toBe(1);
      }));
    });
  });

  describe('adds the `hyperclick` CSS class', function () {
    var provider = {
      providerName: 'test',
      getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
        return { range: range, callback: function callback() {} };
      })
    };

    beforeEach(function () {
      hyperclick.consumeProvider(provider);
    });

    it('adds on <meta-mousemove>, removes on <meta-mousedown>', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var position = new _atom.Point(0, 1);

        expect(textEditorView.classList.contains('hyperclick')).toBe(false);

        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(textEditorView.classList.contains('hyperclick')).toBe(true);

        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });
        expect(textEditorView.classList.contains('hyperclick')).toBe(false);
      }));
    });

    it('adds on <meta-keydown>, removes on <meta-keyup>', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var position = new _atom.Point(0, 1);

        // We need to move the mouse once, so Hyperclick knows where it is.
        dispatch(MouseEvent, 'mousemove', position);
        expect(textEditorView.classList.contains('hyperclick')).toBe(false);

        dispatch(KeyboardEvent, 'keydown', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(textEditorView.classList.contains('hyperclick')).toBe(true);

        dispatch(KeyboardEvent, 'keyup', position);
        expect(textEditorView.classList.contains('hyperclick')).toBe(false);
      }));
    });
  });

  describe('hyperclick:confirm-cursor', function () {
    it('confirms the suggestion at the cursor even if the mouse moved', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();

        textEditor.setCursorBufferPosition(new _atom.Point(0, 8));
        atom.commands.dispatch(textEditorView, 'hyperclick:confirm-cursor');
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, 'word2', _atom.Range.fromObject([[0, 6], [0, 11]]));
        waitsFor(function () {
          return callback.callCount === 1;
        });
      }));
    });
  });

  describe('priority', function () {
    it('confirms higher priority provider when it is consumed first', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          }),
          priority: 5
        };
        hyperclick.consumeProvider(provider1);

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          }),
          priority: 3
        };
        hyperclick.consumeProvider(provider2);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(1);
        expect(callback2.callCount).toBe(0);
      }));
    });

    it('confirms higher priority provider when it is consumed last', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          }),
          priority: 3
        };
        hyperclick.consumeProvider(provider1);

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          }),
          priority: 5
        };
        hyperclick.consumeProvider(provider2);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });

    it('confirms >0 priority before default priority', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          })
        };
        hyperclick.consumeProvider(provider1);

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          }),
          priority: 1
        };
        hyperclick.consumeProvider(provider2);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });

    it('confirms <0 priority after default priority', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          }),
          priority: -1
        };
        hyperclick.consumeProvider(provider1);

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          })
        };
        hyperclick.consumeProvider(provider2);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });

    it('confirms same-priority in the order they are consumed', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          })
        };
        hyperclick.consumeProvider(provider1);

        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          })
        };
        hyperclick.consumeProvider(provider2);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(1);
        expect(callback2.callCount).toBe(0);
      }));
    });

    it('confirms highest priority provider when multiple are consumed at a time', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback1 = jasmine.createSpy('callback');
        var provider1 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback1 };
          }),
          priority: 1
        };
        var callback2 = jasmine.createSpy('callback');
        var provider2 = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback2 };
          }),
          priority: 2
        };

        hyperclick.consumeProvider([provider1, provider2]);

        var mousePosition = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', mousePosition, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', mousePosition, { metaKey: true });

        expect(callback1.callCount).toBe(0);
        expect(callback2.callCount).toBe(1);
      }));
    });
  });

  describe('multiple suggestions', function () {
    it('confirms the first suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = [{
          title: 'callback1',
          callback: jasmine.createSpy('callback1')
        }, {
          title: 'callback2',
          callback: jasmine.createSpy('callback1')
        }];
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

        var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
        expect(suggestionListEl).toExist();

        atom.commands.dispatch(textEditorView, 'editor:newline');

        expect(callback[0].callback.callCount).toBe(1);
        expect(callback[1].callback.callCount).toBe(0);
        expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
      }));
    });

    it('confirms the second suggestion', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = [{
          title: 'callback1',
          callback: jasmine.createSpy('callback1')
        }, {
          title: 'callback2',
          callback: jasmine.createSpy('callback1')
        }];
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

        var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
        expect(suggestionListEl).toExist();

        atom.commands.dispatch(textEditorView, 'core:move-down');
        atom.commands.dispatch(textEditorView, 'editor:newline');

        expect(callback[0].callback.callCount).toBe(0);
        expect(callback[1].callback.callCount).toBe(1);
        expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
      }));
    });

    it('is cancelable', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var callback = [{
          title: 'callback1',
          callback: jasmine.createSpy('callback1')
        }, {
          title: 'callback2',
          callback: jasmine.createSpy('callback1')
        }];
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(0, 1);
        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        dispatch(MouseEvent, 'mousedown', position, { metaKey: true });

        var suggestionListEl = textEditorView.querySelector('hyperclick-suggestion-list');
        expect(suggestionListEl).toExist();

        atom.commands.dispatch(textEditorView, 'core:cancel');

        expect(callback[0].callback.callCount).toBe(0);
        expect(callback[1].callback.callCount).toBe(0);
        expect(textEditorView.querySelector('hyperclick-suggestion-list')).not.toExist();
      }));
    });
  });

  describe('when the editor has soft-wrapped lines', function () {
    beforeEach(function () {
      textEditor.setSoftWrapped(true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 6); // This wraps each word onto its own line.
    });

    it('Hyperclick correctly detects the word being moused over.', function () {
      waitsForPromise(_asyncToGenerator(function* () {

        var callback = jasmine.createSpy('callback');
        var provider = {
          providerName: 'test',
          getSuggestionForWord: _asyncToGenerator(function* (sourceTextEditor, text, range) {
            return { range: range, callback: callback };
          })
        };
        spyOn(provider, 'getSuggestionForWord').andCallThrough();
        hyperclick.consumeProvider(provider);

        var position = new _atom.Point(8, 0);
        var expectedText = 'word9';
        var expectedBufferRange = _atom.Range.fromObject([[2, 12], [2, 17]]);
        dispatch(MouseEvent, 'mousemove', position, { metaKey: true });
        yield hyperclickForTextEditor.getSuggestionAtMouse();
        expect(provider.getSuggestionForWord).toHaveBeenCalledWith(textEditor, expectedText, expectedBufferRange);
        expect(provider.getSuggestionForWord.callCount).toBe(1);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL2h5cGVyY2xpY2svc3BlYy9IeXBlcmNsaWNrLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OEJBZ0JvQixpQkFBaUI7O29CQUNWLE1BQU07OzZCQUNWLG1CQUFtQjs7OztzQkFDcEIsUUFBUTs7OztBQW5COUIsV0FBVyxDQUFDOztBQXFCWixRQUFRLENBQUMsWUFBWSxFQUFFLFlBQU07QUFDM0IsTUFBSSxVQUEyQixHQUFJLElBQUksQUFBTSxDQUFDO0FBQzlDLE1BQUksY0FBc0MsR0FBSSxJQUFJLEFBQU0sQ0FBQztBQUN6RCxNQUFJLFVBQXNCLEdBQUksSUFBSSxBQUFNLENBQUM7QUFDekMsTUFBSSx1QkFBZ0QsR0FBSSxJQUFJLEFBQU0sQ0FBQzs7QUFFbkUsWUFBVSxDQUFDO1dBQU0sZUFBZSxtQkFBQyxhQUFZO0FBQzNDLGdCQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pELG9CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdoRCxhQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVwQyxnQkFBVSxHQUFHLGdDQUFnQixDQUFDO0FBQzlCLDZCQUF1QixHQUFHLHNCQUFNLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRSxFQUFDO0dBQUEsQ0FBQyxDQUFDOztBQUVKLFdBQVMsQ0FBQyxZQUFNO0FBQ2QsY0FBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3RCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRSCxXQUFTLGtDQUFrQyxDQUN6QyxjQUEwQixFQUNVO0FBQ3BDLFFBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FB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Y2xpY2stc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgdHlwZSB7SHlwZXJjbGlja1Byb3ZpZGVyfSBmcm9tICdoeXBlcmNsaWNrLWludGVyZmFjZXMnO1xuaW1wb3J0IHR5cGUgSHlwZXJjbGlja0ZvclRleHRFZGl0b3IgZnJvbSAnLi4vbGliL0h5cGVyY2xpY2tGb3JUZXh0RWRpdG9yJztcblxuaW1wb3J0IHthcnJheX0gZnJvbSAnbnVjbGlkZS1jb21tb25zJztcbmltcG9ydCB7UG9pbnQsIFJhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCBIeXBlcmNsaWNrIGZyb20gJy4uL2xpYi9IeXBlcmNsaWNrJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcblxuZGVzY3JpYmUoJ0h5cGVyY2xpY2snLCAoKSA9PiB7XG4gIGxldCB0ZXh0RWRpdG9yOiBhdG9tJFRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcbiAgbGV0IHRleHRFZGl0b3JWaWV3OiBhdG9tJFRleHRFZGl0b3JFbGVtZW50ID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrOiBIeXBlcmNsaWNrID0gKG51bGw6IGFueSk7XG4gIGxldCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvcjogSHlwZXJjbGlja0ZvclRleHRFZGl0b3IgPSAobnVsbDogYW55KTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgdGV4dEVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oJ2h5cGVyY2xpY2sudHh0Jyk7XG4gICAgdGV4dEVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcik7XG5cbiAgICAvLyBXZSBuZWVkIHRoZSB2aWV3IGF0dGFjaGVkIHRvIHRoZSBET00gZm9yIHRoZSBtb3VzZSBldmVudHMgdG8gd29yay5cbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRleHRFZGl0b3JWaWV3KTtcblxuICAgIGh5cGVyY2xpY2sgPSBuZXcgSHlwZXJjbGljaygpO1xuICAgIGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yID0gYXJyYXkuZnJvbShoeXBlcmNsaWNrLl9oeXBlcmNsaWNrRm9yVGV4dEVkaXRvcnMpWzBdO1xuICB9KSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBoeXBlcmNsaWNrLmRpc3Bvc2UoKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHBpeGVsIHBvc2l0aW9uIGluIHRoZSBET00gb2YgdGhlIHRleHQgZWRpdG9yJ3Mgc2NyZWVuIHBvc2l0aW9uLlxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGRpc3BhdGNoaW5nIG1vdXNlIGV2ZW50cyBpbiB0aGUgdGV4dCBlZGl0b3IuXG4gICAqXG4gICAqIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL2Jsb2IvNTI3MjU4NGQyOTEwZTViM2YyYjBmMzA5YWFiNDc3NWViMGY3NzlhNi9zcGVjL3RleHQtZWRpdG9yLWNvbXBvbmVudC1zcGVjLmNvZmZlZSNMMjg0NVxuICAgKi9cbiAgZnVuY3Rpb24gY2xpZW50Q29vcmRpbmF0ZXNGb3JTY3JlZW5Qb3NpdGlvbihcbiAgICBzY3JlZW5Qb3NpdGlvbjogYXRvbSRQb2ludCxcbiAgKToge2NsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyfSB7XG4gICAgY29uc3QgcG9zaXRpb25PZmZzZXQgPSB0ZXh0RWRpdG9yVmlldy5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pO1xuICAgIGNvbnN0IHtjb21wb25lbnR9ID0gdGV4dEVkaXRvclZpZXc7XG4gICAgaW52YXJpYW50KGNvbXBvbmVudCk7XG4gICAgY29uc3Qgc2Nyb2xsVmlld0NsaWVudFJlY3QgPSBjb21wb25lbnQuZG9tTm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3JylcbiAgICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vICRGbG93Rml4TWU6IFVzZSBvZiBwcml2YXRlIG1ldGhvZC5cbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gdGV4dEVkaXRvci5nZXRTY3JvbGxMZWZ0KCk7XG4gICAgLy8gJEZsb3dGaXhNZTogVXNlIG9mIHByaXZhdGUgbWV0aG9kLlxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHRleHRFZGl0b3IuZ2V0U2Nyb2xsVG9wKCk7XG4gICAgY29uc3QgY2xpZW50WCA9IHNjcm9sbFZpZXdDbGllbnRSZWN0LmxlZnQgKyBwb3NpdGlvbk9mZnNldC5sZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBjbGllbnRZID0gc2Nyb2xsVmlld0NsaWVudFJlY3QudG9wICsgcG9zaXRpb25PZmZzZXQudG9wIC0gc2Nyb2xsVG9wO1xuICAgIHJldHVybiB7Y2xpZW50WCwgY2xpZW50WX07XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwYXRjaChcbiAgICAgIC8vICRGbG93SXNzdWUgS2V5Ym9hcmRFdmVudCBpc24ndCBkZWZpbmVkLlxuICAgICAgZXZlbnRDbGFzczogdHlwZW9mIEtleWJvYXJkRXZlbnQgfCB0eXBlb2YgTW91c2VFdmVudCxcbiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgIHBvc2l0aW9uOiBhdG9tJFBvaW50LFxuICAgICAgcHJvcGVydGllcz86IHtjbGllbnRYPzogbnVtYmVyLCBjbGllbnRZPzogbnVtYmVyLCBtZXRhS2V5PzogYm9vbGVhbn0sXG4gICAgKTogdm9pZCB7XG4gICAgY29uc3Qge2NsaWVudFgsIGNsaWVudFl9ID0gY2xpZW50Q29vcmRpbmF0ZXNGb3JTY3JlZW5Qb3NpdGlvbihwb3NpdGlvbik7XG4gICAgaWYgKHByb3BlcnRpZXMgIT0gbnVsbCkge1xuICAgICAgcHJvcGVydGllcy5jbGllbnRYID0gY2xpZW50WDtcbiAgICAgIHByb3BlcnRpZXMuY2xpZW50WSA9IGNsaWVudFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BlcnRpZXMgPSB7Y2xpZW50WCwgY2xpZW50WX07XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IGV2ZW50Q2xhc3ModHlwZSwgcHJvcGVydGllcyk7XG4gICAgbGV0IGRvbU5vZGUgPSBudWxsO1xuICAgIGlmIChldmVudENsYXNzID09PSBNb3VzZUV2ZW50KSB7XG4gICAgICBjb25zdCB7Y29tcG9uZW50fSA9IHRleHRFZGl0b3JWaWV3O1xuICAgICAgaW52YXJpYW50KGNvbXBvbmVudCk7XG4gICAgICBkb21Ob2RlID0gY29tcG9uZW50LmxpbmVzQ29tcG9uZW50LmdldERvbU5vZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9tTm9kZSA9IHRleHRFZGl0b3JWaWV3O1xuICAgIH1cbiAgICBkb21Ob2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBjYXNlJywgKCkgPT4ge1xuICAgIGxldCBwcm92aWRlcjogSHlwZXJjbGlja1Byb3ZpZGVyID0gKG51bGw6IGFueSk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHByb3ZpZGVyID0ge1xuICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogKCkgPT4ge319O1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgY2FsbCB0aGUgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrLmdldFN1Z2dlc3Rpb24odGV4dEVkaXRvciwgcG9zaXRpb24pO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgYSByZW1vdmVkIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgaHlwZXJjbGljay5yZW1vdmVQcm92aWRlcihwcm92aWRlcik7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2suZ2V0U3VnZ2VzdGlvbih0ZXh0RWRpdG9yLCBwb3NpdGlvbik7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnPG1ldGEtbW91c2Vtb3ZlPiArIDxtZXRhLW1vdXNlZG93bj4nLCAoKSA9PiB7XG4gICAgaXQoJ2NvbnN1bWVzIHNpbmdsZS13b3JkIHByb3ZpZGVycyB3aXRob3V0IHdvcmRSZWdFeHAnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkMSc7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCA1XV0pO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25zdW1lcyBzaW5nbGUtd29yZCBwcm92aWRlcnMgd2l0aCB3b3JkUmVnRXhwJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmRSZWdFeHA6IC93b3JkL2csXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgOCk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkJztcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1swLCA2XSwgWzAsIDEwXV0pO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25zdW1lcyBtdWx0aS1yYW5nZSBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uKHNvdXJjZVRleHRFZGl0b3I6IFRleHRFZGl0b3IsIHNvdXJjZVBvc2l0aW9uOiBQb2ludCkge1xuICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgICAgICAgIG5ldyBSYW5nZShzb3VyY2VQb3NpdGlvbiwgc291cmNlUG9zaXRpb24udHJhbnNsYXRlKFswLCAxXSkpLFxuICAgICAgICAgICAgICBuZXcgUmFuZ2Uoc291cmNlUG9zaXRpb24udHJhbnNsYXRlKFswLCAyXSksIHNvdXJjZVBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgM10pKSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIsICdnZXRTdWdnZXN0aW9uJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDgpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRleHRFZGl0b3IsIHBvc2l0aW9uKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25zdW1lcyBtdWx0aXBsZSBwcm92aWRlcnMgZnJvbSBkaWZmZXJlbnQgc291cmNlcycsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMSA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjEgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgLy8gRG8gbm90IHJldHVybiBhIHN1Z2dlc3Rpb24sIHNvIHdlIGNhbiBmYWxsIHRocm91Z2ggdG8gcHJvdmlkZXIyLlxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIxLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyMiwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcblxuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjEpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlcjIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgIGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uc3VtZXMgbXVsdGlwbGUgcHJvdmlkZXJzIGZyb20gdGhlIHNhbWUgc291cmNlJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMSA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAvLyBEbyBub3QgcmV0dXJuIGEgc3VnZ2VzdGlvbiwgc28gd2UgY2FuIGZhbGwgdGhyb3VnaCB0byBwcm92aWRlcjIuXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHt9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlcjEsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuXG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKFtwcm92aWRlcjEsIHByb3ZpZGVyMl0pO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQgPSAnd29yZDEnO1xuICAgICAgICBjb25zdCBleHBlY3RlZFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlcjIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgIGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgIGV4cGVjdGVkUmFuZ2UpO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhdm9pZHMgZXhjZXNzaXZlIGNhbGxzJywgKCkgPT4ge1xuICAgIGl0KCdpZ25vcmVzIDxtb3VzZW1vdmU+IGluIHRoZSBzYW1lIHdvcmQgYXMgdGhlIGxhc3QgcG9zaXRpb24nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgLy8gTmV2ZXIgcmVzb2x2ZSB0aGlzLCBzbyB3ZSBrbm93IHRoYXQgbm8gc3VnZ2VzdGlvbiBpcyBzZXQuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMV0pLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24udHJhbnNsYXRlKFswLCAyXSksIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgPG1vdXNlbW92ZT4gaW4gdGhlIHNhbWUgc2luZ2xlLXJhbmdlIGFzIHRoZSBsYXN0IHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbkZvcldvcmQnKS5hbmRDYWxsVGhyb3VnaCgpO1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcik7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkVGV4dCA9ICd3b3JkMSc7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgMF0sIFswLCA1XV0pO1xuXG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24udHJhbnNsYXRlKFswLCAxXSksIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG5cbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkLmNhbGxDb3VudCkudG9CZSgxKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdoYW5kbGVzIDxtb3VzZW1vdmU+IGluIGEgZGlmZmVyZW50IHNpbmdsZS1yYW5nZSBhcyB0aGUgbGFzdCBzdWdnZXN0aW9uJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uMSA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0MSA9ICd3b3JkMSc7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UxID0gUmFuZ2UuZnJvbU9iamVjdChbWzAsIDBdLCBbMCwgNV1dKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24xLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgIGV4cGVjdGVkVGV4dDEsXG4gICAgICAgICAgICBleHBlY3RlZFJhbmdlMSk7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24yID0gbmV3IFBvaW50KDAsIDgpO1xuICAgICAgICBjb25zdCBleHBlY3RlZFRleHQyID0gJ3dvcmQyJztcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRSYW5nZTIgPSBSYW5nZS5mcm9tT2JqZWN0KFtbMCwgNl0sIFswLCAxMV1dKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uMiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICBleHBlY3RlZFRleHQyLFxuICAgICAgICAgICAgZXhwZWN0ZWRSYW5nZTIpO1xuXG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uRm9yV29yZC5jYWxsQ291bnQpLnRvQmUoMik7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uMiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgPG1vdXNlbW92ZT4gaW4gdGhlIHNhbWUgbXVsdGktcmFuZ2UgYXMgdGhlIGxhc3Qgc3VnZ2VzdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gW1xuICAgICAgICAgIG5ldyBSYW5nZShuZXcgUG9pbnQoMCwgMSksIG5ldyBQb2ludCgwLCAyKSksXG4gICAgICAgICAgbmV3IFJhbmdlKG5ldyBQb2ludCgwLCA0KSwgbmV3IFBvaW50KDAsIDUpKSxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbihzb3VyY2VUZXh0RWRpdG9yLCBzb3VyY2VQb3NpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHNweU9uKHByb3ZpZGVyLCAnZ2V0U3VnZ2VzdGlvbicpLmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0ZXh0RWRpdG9yLCBwb3NpdGlvbik7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG5ldyBQb2ludCgwLCA0KSwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcblxuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbi5jYWxsQ291bnQpLnRvQmUoMSk7XG5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGFuZGxlcyA8bW91c2Vtb3ZlPiBpbiBhIGRpZmZlcmVudCBtdWx0aS1yYW5nZSBhcyB0aGUgbGFzdCBzdWdnZXN0aW9uJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgICAgbmV3IFJhbmdlKG5ldyBQb2ludCgwLCAxKSwgbmV3IFBvaW50KDAsIDIpKSxcbiAgICAgICAgICBuZXcgUmFuZ2UobmV3IFBvaW50KDAsIDQpLCBuZXcgUG9pbnQoMCwgNSkpLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uKHNvdXJjZVRleHRFZGl0b3IsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIsICdnZXRTdWdnZXN0aW9uJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uMSA9IG5ldyBQb2ludCgwLCAxKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24xLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgodGV4dEVkaXRvciwgcG9zaXRpb24xKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbjIgPSBuZXcgUG9pbnQoMCwgMyk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBwb3NpdGlvbjIsIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0ZXh0RWRpdG9yLCBwb3NpdGlvbjIpO1xuXG4gICAgICAgIGV4cGVjdChwcm92aWRlci5nZXRTdWdnZXN0aW9uLmNhbGxDb3VudCkudG9CZSgyKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24yLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhZGRzIHRoZSBgaHlwZXJjbGlja2AgQ1NTIGNsYXNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjaygpIHt9fTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgb24gPG1ldGEtbW91c2Vtb3ZlPiwgcmVtb3ZlcyBvbiA8bWV0YS1tb3VzZWRvd24+JywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG5cbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaHlwZXJjbGljaycpKS50b0JlKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZSh0cnVlKTtcblxuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2h5cGVyY2xpY2snKSkudG9CZShmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdhZGRzIG9uIDxtZXRhLWtleWRvd24+LCByZW1vdmVzIG9uIDxtZXRhLWtleXVwPicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gbW92ZSB0aGUgbW91c2Ugb25jZSwgc28gSHlwZXJjbGljayBrbm93cyB3aGVyZSBpdCBpcy5cbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uKTtcbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaHlwZXJjbGljaycpKS50b0JlKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaChLZXlib2FyZEV2ZW50LCAna2V5ZG93bicsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUodHJ1ZSk7XG5cbiAgICAgICAgZGlzcGF0Y2goS2V5Ym9hcmRFdmVudCwgJ2tleXVwJywgcG9zaXRpb24pO1xuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdoeXBlcmNsaWNrJykpLnRvQmUoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoeXBlcmNsaWNrOmNvbmZpcm0tY3Vyc29yJywgKCkgPT4ge1xuICAgIGl0KCdjb25maXJtcyB0aGUgc3VnZ2VzdGlvbiBhdCB0aGUgY3Vyc29yIGV2ZW4gaWYgdGhlIG1vdXNlIG1vdmVkJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzcHlPbihwcm92aWRlciwgJ2dldFN1Z2dlc3Rpb25Gb3JXb3JkJykuYW5kQ2FsbFRocm91Z2goKTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuXG4gICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obmV3IFBvaW50KDAsIDgpKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0ZXh0RWRpdG9yVmlldywgJ2h5cGVyY2xpY2s6Y29uZmlybS1jdXJzb3InKTtcbiAgICAgICAgZXhwZWN0KHByb3ZpZGVyLmdldFN1Z2dlc3Rpb25Gb3JXb3JkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIHRleHRFZGl0b3IsXG4gICAgICAgICAgICAnd29yZDInLFxuICAgICAgICAgICAgUmFuZ2UuZnJvbU9iamVjdChbWzAsIDZdLCBbMCwgMTFdXSkpO1xuICAgICAgICB3YWl0c0ZvcigoKSA9PiBjYWxsYmFjay5jYWxsQ291bnQgPT09IDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwcmlvcml0eScsICgpID0+IHtcbiAgICBpdCgnY29uZmlybXMgaGlnaGVyIHByaW9yaXR5IHByb3ZpZGVyIHdoZW4gaXQgaXMgY29uc3VtZWQgZmlyc3QnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiA1LFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjEpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazF9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJpb3JpdHk6IDMsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMik7XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbmZpcm1zIGhpZ2hlciBwcmlvcml0eSBwcm92aWRlciB3aGVuIGl0IGlzIGNvbnN1bWVkIGxhc3QnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiAzLFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjEpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJpb3JpdHk6IDUsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMik7XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbmZpcm1zID4wIHByaW9yaXR5IGJlZm9yZSBkZWZhdWx0IHByaW9yaXR5JywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMSA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMX07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIxKTtcblxuICAgICAgICBjb25zdCBjYWxsYmFjazIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2syfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjIpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMSk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZW1vdmUnLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBleHBlY3QoY2FsbGJhY2sxLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMi5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25maXJtcyA8MCBwcmlvcml0eSBhZnRlciBkZWZhdWx0IHByaW9yaXR5JywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMSA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMX07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmlvcml0eTogLTEsXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMSk7XG5cbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29uZmlybXMgc2FtZS1wcmlvcml0eSBpbiB0aGUgb3JkZXIgdGhleSBhcmUgY29uc3VtZWQnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjazEgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2snKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIxID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFjazogY2FsbGJhY2sxfTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihwcm92aWRlcjEpO1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrMiA9IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCBwcm92aWRlcjIgPSB7XG4gICAgICAgICAgcHJvdmlkZXJOYW1lOiAndGVzdCcsXG4gICAgICAgICAgYXN5bmMgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoc291cmNlVGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrOiBjYWxsYmFjazJ9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyMik7XG5cbiAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBtb3VzZVBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFjazEuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2syLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvbmZpcm1zIGhpZ2hlc3QgcHJpb3JpdHkgcHJvdmlkZXIgd2hlbiBtdWx0aXBsZSBhcmUgY29uc3VtZWQgYXQgYSB0aW1lJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sxID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMSA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMX07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmlvcml0eTogMSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsbGJhY2syID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyMiA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2s6IGNhbGxiYWNrMn07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwcmlvcml0eTogMixcbiAgICAgICAgfTtcblxuICAgICAgICBoeXBlcmNsaWNrLmNvbnN1bWVQcm92aWRlcihbcHJvdmlkZXIxLCBwcm92aWRlcjJdKTtcblxuICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgbW91c2VQb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcbiAgICAgICAgYXdhaXQgaHlwZXJjbGlja0ZvclRleHRFZGl0b3IuZ2V0U3VnZ2VzdGlvbkF0TW91c2UoKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlZG93bicsIG1vdXNlUG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrMS5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFjazIuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdtdWx0aXBsZSBzdWdnZXN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnY29uZmlybXMgdGhlIGZpcnN0IHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ2NhbGxiYWNrMScsXG4gICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazInLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjazEnKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkxpc3RFbCA9IHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0Jyk7XG4gICAgICAgIGV4cGVjdChzdWdnZXN0aW9uTGlzdEVsKS50b0V4aXN0KCk7XG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0ZXh0RWRpdG9yVmlldywgJ2VkaXRvcjpuZXdsaW5lJyk7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzBdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KGNhbGxiYWNrWzFdLmNhbGxiYWNrLmNhbGxDb3VudCkudG9CZSgwKTtcbiAgICAgICAgZXhwZWN0KHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0JykpLm5vdC50b0V4aXN0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb25maXJtcyB0aGUgc2Vjb25kIHN1Z2dlc3Rpb24nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ2NhbGxiYWNrMScsXG4gICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdjYWxsYmFjazInLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGphc21pbmUuY3JlYXRlU3B5KCdjYWxsYmFjazEnKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHtcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZChzb3VyY2VUZXh0RWRpdG9yLCB0ZXh0LCByYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtyYW5nZSwgY2FsbGJhY2t9O1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAxKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vkb3duJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG5cbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkxpc3RFbCA9IHRleHRFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJ2h5cGVyY2xpY2stc3VnZ2VzdGlvbi1saXN0Jyk7XG4gICAgICAgIGV4cGVjdChzdWdnZXN0aW9uTGlzdEVsKS50b0V4aXN0KCk7XG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0ZXh0RWRpdG9yVmlldywgJ2NvcmU6bW92ZS1kb3duJyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGV4dEVkaXRvclZpZXcsICdlZGl0b3I6bmV3bGluZScpO1xuXG4gICAgICAgIGV4cGVjdChjYWxsYmFja1swXS5jYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMCk7XG4gICAgICAgIGV4cGVjdChjYWxsYmFja1sxXS5jYWxsYmFjay5jYWxsQ291bnQpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yVmlldy5xdWVyeVNlbGVjdG9yKCdoeXBlcmNsaWNrLXN1Z2dlc3Rpb24tbGlzdCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXMgY2FuY2VsYWJsZScsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnY2FsbGJhY2sxJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBqYXNtaW5lLmNyZWF0ZVNweSgnY2FsbGJhY2sxJyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ2NhbGxiYWNrMicsXG4gICAgICAgICAgICBjYWxsYmFjazogamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrMScpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgaHlwZXJjbGljay5jb25zdW1lUHJvdmlkZXIocHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDEpO1xuICAgICAgICBkaXNwYXRjaChNb3VzZUV2ZW50LCAnbW91c2Vtb3ZlJywgcG9zaXRpb24sIHttZXRhS2V5OiB0cnVlfSk7XG4gICAgICAgIGF3YWl0IGh5cGVyY2xpY2tGb3JUZXh0RWRpdG9yLmdldFN1Z2dlc3Rpb25BdE1vdXNlKCk7XG4gICAgICAgIGRpc3BhdGNoKE1vdXNlRXZlbnQsICdtb3VzZWRvd24nLCBwb3NpdGlvbiwge21ldGFLZXk6IHRydWV9KTtcblxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uTGlzdEVsID0gdGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKTtcbiAgICAgICAgZXhwZWN0KHN1Z2dlc3Rpb25MaXN0RWwpLnRvRXhpc3QoKTtcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRleHRFZGl0b3JWaWV3LCAnY29yZTpjYW5jZWwnKTtcblxuICAgICAgICBleHBlY3QoY2FsbGJhY2tbMF0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QoY2FsbGJhY2tbMV0uY2FsbGJhY2suY2FsbENvdW50KS50b0JlKDApO1xuICAgICAgICBleHBlY3QodGV4dEVkaXRvclZpZXcucXVlcnlTZWxlY3RvcignaHlwZXJjbGljay1zdWdnZXN0aW9uLWxpc3QnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiB0aGUgZWRpdG9yIGhhcyBzb2Z0LXdyYXBwZWQgbGluZXMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB0ZXh0RWRpdG9yLnNldFNvZnRXcmFwcGVkKHRydWUpO1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFdyYXBBdFByZWZlcnJlZExpbmVMZW5ndGgnLCB0cnVlKTtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCA2KTsgLy8gVGhpcyB3cmFwcyBlYWNoIHdvcmQgb250byBpdHMgb3duIGxpbmUuXG4gICAgfSk7XG5cbiAgICBpdCgnSHlwZXJjbGljayBjb3JyZWN0bHkgZGV0ZWN0cyB0aGUgd29yZCBiZWluZyBtb3VzZWQgb3Zlci4nLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0ge1xuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIGFzeW5jIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKHNvdXJjZVRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja307XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc3B5T24ocHJvdmlkZXIsICdnZXRTdWdnZXN0aW9uRm9yV29yZCcpLmFuZENhbGxUaHJvdWdoKCk7XG4gICAgICAgIGh5cGVyY2xpY2suY29uc3VtZVByb3ZpZGVyKHByb3ZpZGVyKTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCg4LCAwKTtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0ID0gJ3dvcmQ5JztcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRCdWZmZXJSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1syLCAxMl0sIFsyLCAxN11dKTtcbiAgICAgICAgZGlzcGF0Y2goTW91c2VFdmVudCwgJ21vdXNlbW92ZScsIHBvc2l0aW9uLCB7bWV0YUtleTogdHJ1ZX0pO1xuICAgICAgICBhd2FpdCBoeXBlcmNsaWNrRm9yVGV4dEVkaXRvci5nZXRTdWdnZXN0aW9uQXRNb3VzZSgpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgICAgIGV4cGVjdGVkVGV4dCxcbiAgICAgICAgICAgIGV4cGVjdGVkQnVmZmVyUmFuZ2UpO1xuICAgICAgICBleHBlY3QocHJvdmlkZXIuZ2V0U3VnZ2VzdGlvbkZvcldvcmQuY2FsbENvdW50KS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/hyperclick/spec/Hyperclick-spec.js
