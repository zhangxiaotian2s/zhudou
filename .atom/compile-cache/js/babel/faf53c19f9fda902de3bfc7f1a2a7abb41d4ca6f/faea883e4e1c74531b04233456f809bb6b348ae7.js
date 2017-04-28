

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _libDiffUtils = require('../lib/diff-utils');

'use babel';

describe('diff-utils', function () {
  describe('computeDiff()', function () {
    it('diffs two empty texts', function () {
      var _computeDiff = (0, _libDiffUtils.computeDiff)('', '');

      var addedLines = _computeDiff.addedLines;
      var removedLines = _computeDiff.removedLines;
      var oldLineOffsets = _computeDiff.oldLineOffsets;
      var newLineOffsets = _computeDiff.newLineOffsets;

      expect(addedLines).toEqual([]);
      expect(removedLines).toEqual([]);
      expect(oldLineOffsets.size).toBe(0);
      expect(newLineOffsets.size).toBe(0);
    });

    it('diffs simple text with one line changes', function () {
      var _computeDiff2 = (0, _libDiffUtils.computeDiff)('simple text\non multiline\nsame end line', 'on multiline\nadded text\nsame end line');

      var addedLines = _computeDiff2.addedLines;
      var removedLines = _computeDiff2.removedLines;
      var oldLineOffsets = _computeDiff2.oldLineOffsets;
      var newLineOffsets = _computeDiff2.newLineOffsets;

      expect(addedLines).toEqual([1]); // the second line is newly added.
      expect(removedLines).toEqual([0]); // the first line was removed.
      expect(oldLineOffsets).toEqual(new Map([[2, 1]])); // offset 1 for the new added line.
      expect(newLineOffsets).toEqual(new Map([[0, 1]])); // offset 1 for the first removed line.
    });

    it('diffs multi-line text changes', function () {
      var _computeDiff3 = (0, _libDiffUtils.computeDiff)('This text is intended for testing.\nIf we test at too low a level,\ntesting for matching tags\nwith pattern matching,\nour tests will be BAD.\nThe slightest change in layout,\ncould break a large number of tests.\n', 'This text is intended for testing.\nwith pattern matching,\nadding different two lines\nreplacing the two lines removed above!\nour tests will be BAD.\nThe slightest change in layout,\ncould break a large number of tests.\nadding a non-new-line line');

      var addedLines = _computeDiff3.addedLines;
      var removedLines = _computeDiff3.removedLines;
      var oldLineOffsets = _computeDiff3.oldLineOffsets;
      var newLineOffsets = _computeDiff3.newLineOffsets;

      expect(addedLines).toEqual([2, 3, 7]); // 2 lines were added in the middle and one at the end.
      expect(removedLines).toEqual([1, 2, 7]); // 2 lines were removed in the middle and last new-line replaced.
      expect(oldLineOffsets).toEqual(new Map([[4, 2]])); // offset 2 for the 2 lines added.
      expect(newLineOffsets).toEqual(new Map([[1, 2]])); // offset 2 for the 2 lines removed.
    });
  });

  describe('getLineCountWithOffsets()', function () {

    it('gets the same number of lines when no offsets', function () {
      expect((0, _libDiffUtils.getLineCountWithOffsets)('line-1\nline-2\nline-3', new Map())).toBe(3);
    });

    it('gets the line numbers with offsets', function () {
      expect((0, _libDiffUtils.getLineCountWithOffsets)('line-1\nline-2\nline-3', new Map([[0, 2], [2, 1]]))).toBe(6);
    });
  });

  describe('getOffsetLineNumber()', function () {

    it('return the same line number when no are given', function () {
      expect((0, _libDiffUtils.getOffsetLineNumber)(2, new Map())).toBe(2);
    });

    it('return the offseted line number when passed offsets', function () {
      var offsets = new Map([[0, 1], [1, 2], [2, 3]]);
      expect((0, _libDiffUtils.getOffsetLineNumber)(0, offsets)).toBe(0);
      expect((0, _libDiffUtils.getOffsetLineNumber)(1, offsets)).toBe(2);
      expect((0, _libDiffUtils.getOffsetLineNumber)(2, offsets)).toBe(5);
      expect((0, _libDiffUtils.getOffsetLineNumber)(3, offsets)).toBe(9);
      expect((0, _libDiffUtils.getOffsetLineNumber)(4, offsets)).toBe(10);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlmZi12aWV3L3NwZWMvZGlmZi11dGlscy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7NEJBV3dFLG1CQUFtQjs7QUFYM0YsV0FBVyxDQUFDOztBQWFaLFFBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBTTtBQUMzQixVQUFRLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDOUIsTUFBRSxDQUFDLHVCQUF1QixFQUFFLFlBQU07eUJBQ21DLCtCQUFZLEVBQUUsRUFBRSxFQUFFLENBQUM7O1VBQS9FLFVBQVUsZ0JBQVYsVUFBVTtVQUFFLFlBQVksZ0JBQVosWUFBWTtVQUFFLGNBQWMsZ0JBQWQsY0FBYztVQUFFLGNBQWMsZ0JBQWQsY0FBYzs7QUFDL0QsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvQixZQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLFlBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFlBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMseUNBQXlDLEVBQUUsWUFBTTswQkFDaUIscUhBT2xFOztVQVBNLFVBQVUsaUJBQVYsVUFBVTtVQUFFLFlBQVksaUJBQVosWUFBWTtVQUFFLGNBQWMsaUJBQWQsY0FBYztVQUFFLGNBQWMsaUJBQWQsY0FBYzs7QUFTL0QsWUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsWUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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TyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsWUFBTSxDQUFDLHVDQUFvQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEQsQ0FBQyxDQUFDO0dBRUosQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtZGlmZi12aWV3L3NwZWMvZGlmZi11dGlscy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHtjb21wdXRlRGlmZiwgZ2V0TGluZUNvdW50V2l0aE9mZnNldHMsIGdldE9mZnNldExpbmVOdW1iZXJ9IGZyb20gJy4uL2xpYi9kaWZmLXV0aWxzJztcblxuZGVzY3JpYmUoJ2RpZmYtdXRpbHMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdjb21wdXRlRGlmZigpJywgKCkgPT4ge1xuICAgIGl0KCdkaWZmcyB0d28gZW1wdHkgdGV4dHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7YWRkZWRMaW5lcywgcmVtb3ZlZExpbmVzLCBvbGRMaW5lT2Zmc2V0cywgbmV3TGluZU9mZnNldHN9ID0gY29tcHV0ZURpZmYoJycsICcnKTtcbiAgICAgIGV4cGVjdChhZGRlZExpbmVzKS50b0VxdWFsKFtdKTtcbiAgICAgIGV4cGVjdChyZW1vdmVkTGluZXMpLnRvRXF1YWwoW10pO1xuICAgICAgZXhwZWN0KG9sZExpbmVPZmZzZXRzLnNpemUpLnRvQmUoMCk7XG4gICAgICBleHBlY3QobmV3TGluZU9mZnNldHMuc2l6ZSkudG9CZSgwKTtcbiAgICB9KTtcblxuICAgIGl0KCdkaWZmcyBzaW1wbGUgdGV4dCB3aXRoIG9uZSBsaW5lIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7YWRkZWRMaW5lcywgcmVtb3ZlZExpbmVzLCBvbGRMaW5lT2Zmc2V0cywgbmV3TGluZU9mZnNldHN9ID0gY29tcHV0ZURpZmYoXG5gc2ltcGxlIHRleHRcbm9uIG11bHRpbGluZVxuc2FtZSBlbmQgbGluZWAsXG5gb24gbXVsdGlsaW5lXG5hZGRlZCB0ZXh0XG5zYW1lIGVuZCBsaW5lYFxuICAgICAgKTtcblxuICAgICAgZXhwZWN0KGFkZGVkTGluZXMpLnRvRXF1YWwoWzFdKTsgLy8gdGhlIHNlY29uZCBsaW5lIGlzIG5ld2x5IGFkZGVkLlxuICAgICAgZXhwZWN0KHJlbW92ZWRMaW5lcykudG9FcXVhbChbMF0pOyAvLyB0aGUgZmlyc3QgbGluZSB3YXMgcmVtb3ZlZC5cbiAgICAgIGV4cGVjdChvbGRMaW5lT2Zmc2V0cykudG9FcXVhbChuZXcgTWFwKFtbMiwgMV1dKSk7IC8vIG9mZnNldCAxIGZvciB0aGUgbmV3IGFkZGVkIGxpbmUuXG4gICAgICBleHBlY3QobmV3TGluZU9mZnNldHMpLnRvRXF1YWwobmV3IE1hcChbWzAsIDFdXSkpOyAvLyBvZmZzZXQgMSBmb3IgdGhlIGZpcnN0IHJlbW92ZWQgbGluZS5cbiAgICB9KTtcblxuICAgIGl0KCdkaWZmcyBtdWx0aS1saW5lIHRleHQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHthZGRlZExpbmVzLCByZW1vdmVkTGluZXMsIG9sZExpbmVPZmZzZXRzLCBuZXdMaW5lT2Zmc2V0c30gPSBjb21wdXRlRGlmZihcbmBUaGlzIHRleHQgaXMgaW50ZW5kZWQgZm9yIHRlc3RpbmcuXG5JZiB3ZSB0ZXN0IGF0IHRvbyBsb3cgYSBsZXZlbCxcbnRlc3RpbmcgZm9yIG1hdGNoaW5nIHRhZ3NcbndpdGggcGF0dGVybiBtYXRjaGluZyxcbm91ciB0ZXN0cyB3aWxsIGJlIEJBRC5cblRoZSBzbGlnaHRlc3QgY2hhbmdlIGluIGxheW91dCxcbmNvdWxkIGJyZWFrIGEgbGFyZ2UgbnVtYmVyIG9mIHRlc3RzLlxuYCwgYFRoaXMgdGV4dCBpcyBpbnRlbmRlZCBmb3IgdGVzdGluZy5cbndpdGggcGF0dGVybiBtYXRjaGluZyxcbmFkZGluZyBkaWZmZXJlbnQgdHdvIGxpbmVzXG5yZXBsYWNpbmcgdGhlIHR3byBsaW5lcyByZW1vdmVkIGFib3ZlIVxub3VyIHRlc3RzIHdpbGwgYmUgQkFELlxuVGhlIHNsaWdodGVzdCBjaGFuZ2UgaW4gbGF5b3V0LFxuY291bGQgYnJlYWsgYSBsYXJnZSBudW1iZXIgb2YgdGVzdHMuXG5hZGRpbmcgYSBub24tbmV3LWxpbmUgbGluZWBcbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdChhZGRlZExpbmVzKS50b0VxdWFsKFsyLCAzLCA3XSk7IC8vIDIgbGluZXMgd2VyZSBhZGRlZCBpbiB0aGUgbWlkZGxlIGFuZCBvbmUgYXQgdGhlIGVuZC5cbiAgICAgIGV4cGVjdChyZW1vdmVkTGluZXMpLnRvRXF1YWwoWzEsIDIsIDddKTsgLy8gMiBsaW5lcyB3ZXJlIHJlbW92ZWQgaW4gdGhlIG1pZGRsZSBhbmQgbGFzdCBuZXctbGluZSByZXBsYWNlZC5cbiAgICAgIGV4cGVjdChvbGRMaW5lT2Zmc2V0cykudG9FcXVhbChuZXcgTWFwKFtbNCwgMl1dKSk7IC8vIG9mZnNldCAyIGZvciB0aGUgMiBsaW5lcyBhZGRlZC5cbiAgICAgIGV4cGVjdChuZXdMaW5lT2Zmc2V0cykudG9FcXVhbChuZXcgTWFwKFtbMSwgMl1dKSk7IC8vIG9mZnNldCAyIGZvciB0aGUgMiBsaW5lcyByZW1vdmVkLlxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRMaW5lQ291bnRXaXRoT2Zmc2V0cygpJywgKCkgPT4ge1xuXG4gICAgaXQoJ2dldHMgdGhlIHNhbWUgbnVtYmVyIG9mIGxpbmVzIHdoZW4gbm8gb2Zmc2V0cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRMaW5lQ291bnRXaXRoT2Zmc2V0cygnbGluZS0xXFxubGluZS0yXFxubGluZS0zJywgbmV3IE1hcCgpKSkudG9CZSgzKTtcbiAgICB9KTtcblxuICAgIGl0KCdnZXRzIHRoZSBsaW5lIG51bWJlcnMgd2l0aCBvZmZzZXRzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldExpbmVDb3VudFdpdGhPZmZzZXRzKCdsaW5lLTFcXG5saW5lLTJcXG5saW5lLTMnLCBuZXcgTWFwKFtbMCwgMl0sIFsyLCAxXV0pKSkudG9CZSg2KTtcbiAgICB9KTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0T2Zmc2V0TGluZU51bWJlcigpJywgKCkgPT4ge1xuXG4gICAgaXQoJ3JldHVybiB0aGUgc2FtZSBsaW5lIG51bWJlciB3aGVuIG5vIGFyZSBnaXZlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRPZmZzZXRMaW5lTnVtYmVyKDIsIG5ldyBNYXAoKSkpLnRvQmUoMik7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJuIHRoZSBvZmZzZXRlZCBsaW5lIG51bWJlciB3aGVuIHBhc3NlZCBvZmZzZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb2Zmc2V0cyA9IG5ldyBNYXAoW1swLCAxXSwgWzEsIDJdLCBbMiwgM11dKTtcbiAgICAgIGV4cGVjdChnZXRPZmZzZXRMaW5lTnVtYmVyKDAsIG9mZnNldHMpKS50b0JlKDApO1xuICAgICAgZXhwZWN0KGdldE9mZnNldExpbmVOdW1iZXIoMSwgb2Zmc2V0cykpLnRvQmUoMik7XG4gICAgICBleHBlY3QoZ2V0T2Zmc2V0TGluZU51bWJlcigyLCBvZmZzZXRzKSkudG9CZSg1KTtcbiAgICAgIGV4cGVjdChnZXRPZmZzZXRMaW5lTnVtYmVyKDMsIG9mZnNldHMpKS50b0JlKDkpO1xuICAgICAgZXhwZWN0KGdldE9mZnNldExpbmVOdW1iZXIoNCwgb2Zmc2V0cykpLnRvQmUoMTApO1xuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-diff-view/spec/diff-utils-spec.js
