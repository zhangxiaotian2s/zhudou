'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var createEditorWithUniquePath = _asyncToGenerator(function* () {
  var path = getUniquePath();
  return yield atom.workspace.open(path);
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var nextFileId = 0;

function getUniquePath() {
  nextFileId++;
  return '/tmp/nuclide-debugger-BreakpointDisplayControllerTest-spec-' + nextFileId + '.m';
}

function hasBreakpointDecorationInRow(editor, row) {
  return !!getBreakpointDecorationInRow(editor, row);
}

function getBreakpointDecorationInRow(editor, row) {
  var decorationArrays = editor.decorationsForScreenRowRange(row, row);
  for (var key in decorationArrays) {
    var decorations = decorationArrays[key];
    for (var i = 0; i < decorations.length; i++) {
      if (decorations[i].getProperties().gutterName === 'nuclide-breakpoint') {
        return decorations[i];
      }
    }
  }
  return null;
}

module.exports = {
  createEditorWithUniquePath: createEditorWithUniquePath,
  getBreakpointDecorationInRow: getBreakpointDecorationInRow,
  getUniquePath: getUniquePath,
  hasBreakpointDecorationInRow: hasBreakpointDecorationInRow
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGVidWdnZXItYXRvbS9zcGVjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQWtCRywwQkFBMEIscUJBQXpDLGFBQTZEO0FBQzNELE1BQU0sSUFBSSxHQUFHLGFBQWEsRUFBRSxDQUFDO0FBQzdCLFNBQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN4Qzs7OztBQVZELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsU0FBUyxhQUFhLEdBQUc7QUFDdkIsWUFBVSxFQUFFLENBQUM7QUFDYix5RUFBcUUsVUFBVSxRQUFLO0NBQ3JGOztBQU9ELFNBQVMsNEJBQTRCLENBQUMsTUFBdUIsRUFBRSxHQUFXLEVBQVc7QUFDbkYsU0FBTyxDQUFDLENBQUMsNEJBQTRCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQ3BEOztBQUVELFNBQVMsNEJBQTRCLENBQUMsTUFBdUIsRUFBRSxHQUFXLEVBQW9CO0FBQzVGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2RSxPQUFLLElBQU0sR0FBRyxJQUFJLGdCQUFnQixFQUFFO0FBQ2xDLFFBQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLFVBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLFVBQVUsS0FBSyxvQkFBb0IsRUFBRTtBQUN0RSxlQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2QjtLQUNGO0dBQ0Y7QUFDRCxTQUFPLElBQUksQ0FBQztDQUNiOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZiw0QkFBMEIsRUFBMUIsMEJBQTBCO0FBQzFCLDhCQUE0QixFQUE1Qiw0QkFBNEI7QUFDNUIsZUFBYSxFQUFiLGFBQWE7QUFDYiw4QkFBNEIsRUFBNUIsNEJBQTRCO0NBQzdCLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1kZWJ1Z2dlci1hdG9tL3NwZWMvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5sZXQgbmV4dEZpbGVJZCA9IDA7XG5cbmZ1bmN0aW9uIGdldFVuaXF1ZVBhdGgoKSB7XG4gIG5leHRGaWxlSWQrKztcbiAgcmV0dXJuIGAvdG1wL251Y2xpZGUtZGVidWdnZXItQnJlYWtwb2ludERpc3BsYXlDb250cm9sbGVyVGVzdC1zcGVjLSR7bmV4dEZpbGVJZH0ubWA7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUVkaXRvcldpdGhVbmlxdWVQYXRoKCk6IGF0b20kVGV4dEVkaXRvciB7XG4gIGNvbnN0IHBhdGggPSBnZXRVbmlxdWVQYXRoKCk7XG4gIHJldHVybiBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGgpO1xufVxuXG5mdW5jdGlvbiBoYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLCByb3c6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gISFnZXRCcmVha3BvaW50RGVjb3JhdGlvbkluUm93KGVkaXRvciwgcm93KTtcbn1cblxuZnVuY3Rpb24gZ2V0QnJlYWtwb2ludERlY29yYXRpb25JblJvdyhlZGl0b3I6IGF0b20kVGV4dEVkaXRvciwgcm93OiBudW1iZXIpOiA/YXRvbSREZWNvcmF0aW9uIHtcbiAgY29uc3QgZGVjb3JhdGlvbkFycmF5cyA9IGVkaXRvci5kZWNvcmF0aW9uc0ZvclNjcmVlblJvd1JhbmdlKHJvdywgcm93KTtcbiAgZm9yIChjb25zdCBrZXkgaW4gZGVjb3JhdGlvbkFycmF5cykge1xuICAgIGNvbnN0IGRlY29yYXRpb25zID0gZGVjb3JhdGlvbkFycmF5c1trZXldO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjb3JhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChkZWNvcmF0aW9uc1tpXS5nZXRQcm9wZXJ0aWVzKCkuZ3V0dGVyTmFtZSA9PT0gJ251Y2xpZGUtYnJlYWtwb2ludCcpIHtcbiAgICAgICAgcmV0dXJuIGRlY29yYXRpb25zW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUVkaXRvcldpdGhVbmlxdWVQYXRoLFxuICBnZXRCcmVha3BvaW50RGVjb3JhdGlvbkluUm93LFxuICBnZXRVbmlxdWVQYXRoLFxuICBoYXNCcmVha3BvaW50RGVjb3JhdGlvbkluUm93LFxufTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-debugger-atom/spec/utils.js