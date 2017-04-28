'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var BreakpointDisplayController = require('../lib/BreakpointDisplayController');
var BreakpointStore = require('../lib/BreakpointStore');
var utils = require('./utils');

var controllerDelegate = {
  handleTextEditorDestroyed: function handleTextEditorDestroyed(controller) {
    controller.dispose();
  }
};

describe('BreakpointDisplayController', function () {
  /* eslint-disable no-unused-vars */

  /* eslint-enable no-unused-vars */
  var editor = undefined;
  var store = undefined;
  var testFilePath = undefined;

  function simulateClickAtBufferPosition(target, row) {
    var editorView = atom.views.getView(editor);
    var position = editorView.pixelPositionForBufferPosition([row, 0]);
    var event = new window.MouseEvent('click', {
      clientX: position.left,
      clientY: position.top,
      bubbles: true
    });
    target.dispatchEvent(event);
  }

  beforeEach(function () {
    waitsForPromise(_asyncToGenerator(function* () {
      editor = yield utils.createEditorWithUniquePath();
      testFilePath = editor.getPath();
      store = new BreakpointStore();
      document.querySelector('#jasmine-content').appendChild(atom.views.getView(editor));
      displayController = new BreakpointDisplayController(controllerDelegate, store, editor);
    }));
  });

  it('should remove breakpoint when marker decoration is clicked', function () {
    editor.setText('foo\nbar\nbaz');
    store.addBreakpoint(testFilePath, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);

    var decoration = utils.getBreakpointDecorationInRow(editor, 1);
    simulateClickAtBufferPosition(decoration.getProperties().item, 1);

    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
    expect(store.getBreakpointsForPath(testFilePath)).toEqual(new Set());
  });

  it('should toggle breakpoint when breakpoint gutter is clicked', function () {
    editor.setText('foo\nbar\nbaz');
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
    var gutter = editor.gutterWithName('nuclide-breakpoint');
    var gutterView = atom.views.getView(gutter);
    simulateClickAtBufferPosition(gutterView, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);
    simulateClickAtBufferPosition(gutterView, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
  });

  it('should toggle breakpoint when line number gutter is clicked', function () {
    editor.setText('foo\nbar\nbaz');
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
    var gutter = editor.gutterWithName('line-number');
    var lineNumberElem = atom.views.getView(gutter).querySelector('.line-number');
    expect(lineNumberElem).not.toBeNull();
    simulateClickAtBufferPosition(lineNumberElem, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);
    simulateClickAtBufferPosition(lineNumberElem, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
  });

  it('should only set markers for breakpoints in current file', function () {
    editor.setText('foo\nbar\nbaz');
    store.addBreakpoint(testFilePath, 1);
    store.addBreakpoint('/tmp/bar.m', 2);

    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);
    expect(utils.hasBreakpointDecorationInRow(editor, 2)).toBe(false);
  });

  it('should update breakpoint when marker moves', function () {
    editor.setText('foo\nbar\nbaz');
    store.addBreakpoint(testFilePath, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);
    expect(utils.hasBreakpointDecorationInRow(editor, 2)).toBe(false);

    editor.setCursorBufferPosition([0, 0]);
    editor.insertText('newfirstline\n');
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
    expect(utils.hasBreakpointDecorationInRow(editor, 2)).toBe(true);
    expect(store.getBreakpointsForPath(testFilePath)).toEqual(new Set([2]));
  });

  it('should remove markers for removed breakpoints', function () {
    editor.setText('foo\nbar\nbaz');
    store.addBreakpoint(testFilePath, 1);
    store.addBreakpoint(testFilePath, 2);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(true);
    expect(utils.hasBreakpointDecorationInRow(editor, 2)).toBe(true);
    store.deleteBreakpoint(testFilePath, 1);
    expect(utils.hasBreakpointDecorationInRow(editor, 1)).toBe(false);
    expect(utils.hasBreakpointDecorationInRow(editor, 2)).toBe(true);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGVidWdnZXItYXRvbS9zcGVjL0JyZWFrcG9pbnREaXNwbGF5Q29udHJvbGxlclRlc3Qtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztBQVdaLElBQU0sMkJBQTJCLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDbEYsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDMUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqQyxJQUFNLGtCQUFrQixHQUFHO0FBQ3pCLDJCQUF5QixFQUFBLG1DQUFDLFVBQXVDLEVBQUU7QUFDakUsY0FBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3RCO0NBQ0YsQ0FBQzs7QUFFRixRQUFRLENBQUMsNkJBQTZCLEVBQUUsWUFBTTs7OztBQUk1QyxNQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsTUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLE1BQUksWUFBWSxZQUFBLENBQUM7O0FBRWpCLFdBQVMsNkJBQTZCLENBQUMsTUFBbUIsRUFBRSxHQUFXLEVBQUU7QUFDdkUsUUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsUUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsUUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUMzQyxhQUFPLEVBQUUsUUFBUSxDQUFDLElBQUk7QUFDdEIsYUFBTyxFQUFFLFFBQVEsQ0FBQyxHQUFHO0FBQ3JCLGFBQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLGFB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LENBQUMsNEJBQTRCLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLFNBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsVUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEUsVUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEUsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGVidWdnZXItYXRvbS9zcGVjL0JyZWFrcG9pbnREaXNwbGF5Q29udHJvbGxlclRlc3Qtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IEJyZWFrcG9pbnREaXNwbGF5Q29udHJvbGxlciA9IHJlcXVpcmUoJy4uL2xpYi9CcmVha3BvaW50RGlzcGxheUNvbnRyb2xsZXInKTtcbmNvbnN0IEJyZWFrcG9pbnRTdG9yZSA9IHJlcXVpcmUoJy4uL2xpYi9CcmVha3BvaW50U3RvcmUnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5jb25zdCBjb250cm9sbGVyRGVsZWdhdGUgPSB7XG4gIGhhbmRsZVRleHRFZGl0b3JEZXN0cm95ZWQoY29udHJvbGxlcjogQnJlYWtwb2ludERpc3BsYXlDb250cm9sbGVyKSB7XG4gICAgY29udHJvbGxlci5kaXNwb3NlKCk7XG4gIH0sXG59O1xuXG5kZXNjcmliZSgnQnJlYWtwb2ludERpc3BsYXlDb250cm9sbGVyJywgKCkgPT4ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgbGV0IGVkaXRvcjtcbiAgbGV0IHN0b3JlO1xuICBsZXQgdGVzdEZpbGVQYXRoO1xuXG4gIGZ1bmN0aW9uIHNpbXVsYXRlQ2xpY2tBdEJ1ZmZlclBvc2l0aW9uKHRhcmdldDogRXZlbnRUYXJnZXQsIHJvdzogbnVtYmVyKSB7XG4gICAgY29uc3QgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdG9yVmlldy5waXhlbFBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgMF0pO1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IHdpbmRvdy5Nb3VzZUV2ZW50KCdjbGljaycsIHtcbiAgICAgIGNsaWVudFg6IHBvc2l0aW9uLmxlZnQsXG4gICAgICBjbGllbnRZOiBwb3NpdGlvbi50b3AsXG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgIH0pO1xuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICBlZGl0b3IgPSBhd2FpdCB1dGlscy5jcmVhdGVFZGl0b3JXaXRoVW5pcXVlUGF0aCgpO1xuICAgICAgdGVzdEZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIHN0b3JlID0gbmV3IEJyZWFrcG9pbnRTdG9yZSgpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2phc21pbmUtY29udGVudCcpLmFwcGVuZENoaWxkKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpKTtcbiAgICAgIGRpc3BsYXlDb250cm9sbGVyID0gbmV3IEJyZWFrcG9pbnREaXNwbGF5Q29udHJvbGxlcihjb250cm9sbGVyRGVsZWdhdGUsIHN0b3JlLCBlZGl0b3IpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlbW92ZSBicmVha3BvaW50IHdoZW4gbWFya2VyIGRlY29yYXRpb24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dCgnZm9vXFxuYmFyXFxuYmF6Jyk7XG4gICAgc3RvcmUuYWRkQnJlYWtwb2ludCh0ZXN0RmlsZVBhdGgsIDEpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUodHJ1ZSk7XG5cbiAgICBjb25zdCBkZWNvcmF0aW9uID0gdXRpbHMuZ2V0QnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDEpO1xuICAgIHNpbXVsYXRlQ2xpY2tBdEJ1ZmZlclBvc2l0aW9uKGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpLml0ZW0sIDEpO1xuXG4gICAgZXhwZWN0KHV0aWxzLmhhc0JyZWFrcG9pbnREZWNvcmF0aW9uSW5Sb3coZWRpdG9yLCAxKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHN0b3JlLmdldEJyZWFrcG9pbnRzRm9yUGF0aCh0ZXN0RmlsZVBhdGgpKS50b0VxdWFsKG5ldyBTZXQoKSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdG9nZ2xlIGJyZWFrcG9pbnQgd2hlbiBicmVha3BvaW50IGd1dHRlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KCdmb29cXG5iYXJcXG5iYXonKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDEpKS50b0JlKGZhbHNlKTtcbiAgICBjb25zdCBndXR0ZXIgPSBlZGl0b3IuZ3V0dGVyV2l0aE5hbWUoJ251Y2xpZGUtYnJlYWtwb2ludCcpO1xuICAgIGNvbnN0IGd1dHRlclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZ3V0dGVyKTtcbiAgICBzaW11bGF0ZUNsaWNrQXRCdWZmZXJQb3NpdGlvbihndXR0ZXJWaWV3LCAxKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDEpKS50b0JlKHRydWUpO1xuICAgIHNpbXVsYXRlQ2xpY2tBdEJ1ZmZlclBvc2l0aW9uKGd1dHRlclZpZXcsIDEpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUoZmFsc2UpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHRvZ2dsZSBicmVha3BvaW50IHdoZW4gbGluZSBudW1iZXIgZ3V0dGVyIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoJ2Zvb1xcbmJhclxcbmJheicpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUoZmFsc2UpO1xuICAgIGNvbnN0IGd1dHRlciA9IGVkaXRvci5ndXR0ZXJXaXRoTmFtZSgnbGluZS1udW1iZXInKTtcbiAgICBjb25zdCBsaW5lTnVtYmVyRWxlbSA9IGF0b20udmlld3MuZ2V0VmlldyhndXR0ZXIpLnF1ZXJ5U2VsZWN0b3IoJy5saW5lLW51bWJlcicpO1xuICAgIGV4cGVjdChsaW5lTnVtYmVyRWxlbSkubm90LnRvQmVOdWxsKCk7XG4gICAgc2ltdWxhdGVDbGlja0F0QnVmZmVyUG9zaXRpb24obGluZU51bWJlckVsZW0sIDEpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUodHJ1ZSk7XG4gICAgc2ltdWxhdGVDbGlja0F0QnVmZmVyUG9zaXRpb24obGluZU51bWJlckVsZW0sIDEpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUoZmFsc2UpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG9ubHkgc2V0IG1hcmtlcnMgZm9yIGJyZWFrcG9pbnRzIGluIGN1cnJlbnQgZmlsZScsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dCgnZm9vXFxuYmFyXFxuYmF6Jyk7XG4gICAgc3RvcmUuYWRkQnJlYWtwb2ludCh0ZXN0RmlsZVBhdGgsIDEpO1xuICAgIHN0b3JlLmFkZEJyZWFrcG9pbnQoJy90bXAvYmFyLm0nLCAyKTtcblxuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHV0aWxzLmhhc0JyZWFrcG9pbnREZWNvcmF0aW9uSW5Sb3coZWRpdG9yLCAyKSkudG9CZShmYWxzZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdXBkYXRlIGJyZWFrcG9pbnQgd2hlbiBtYXJrZXIgbW92ZXMnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoJ2Zvb1xcbmJhclxcbmJheicpO1xuICAgIHN0b3JlLmFkZEJyZWFrcG9pbnQodGVzdEZpbGVQYXRoLCAxKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDEpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMikpLnRvQmUoZmFsc2UpO1xuXG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSk7XG4gICAgZWRpdG9yLmluc2VydFRleHQoJ25ld2ZpcnN0bGluZVxcbicpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMSkpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh1dGlscy5oYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgMikpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHN0b3JlLmdldEJyZWFrcG9pbnRzRm9yUGF0aCh0ZXN0RmlsZVBhdGgpKS50b0VxdWFsKG5ldyBTZXQoWzJdKSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVtb3ZlIG1hcmtlcnMgZm9yIHJlbW92ZWQgYnJlYWtwb2ludHMnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoJ2Zvb1xcbmJhclxcbmJheicpO1xuICAgIHN0b3JlLmFkZEJyZWFrcG9pbnQodGVzdEZpbGVQYXRoLCAxKTtcbiAgICBzdG9yZS5hZGRCcmVha3BvaW50KHRlc3RGaWxlUGF0aCwgMik7XG4gICAgZXhwZWN0KHV0aWxzLmhhc0JyZWFrcG9pbnREZWNvcmF0aW9uSW5Sb3coZWRpdG9yLCAxKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDIpKS50b0JlKHRydWUpO1xuICAgIHN0b3JlLmRlbGV0ZUJyZWFrcG9pbnQodGVzdEZpbGVQYXRoLCAxKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDEpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QodXRpbHMuaGFzQnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3IsIDIpKS50b0JlKHRydWUpO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-debugger-atom/spec/BreakpointDisplayControllerTest-spec.js