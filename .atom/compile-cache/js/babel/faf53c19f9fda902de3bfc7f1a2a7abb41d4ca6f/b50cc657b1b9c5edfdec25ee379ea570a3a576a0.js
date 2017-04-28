'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _require = require('atom');

var Range = _require.Range;

var findWholeRangeOfSymbol = require('../lib/findWholeRangeOfSymbol');

var _require$jasmineMatchers = require('nuclide-atom-test-helpers').jasmineMatchers;

var toEqualAtomRange = _require$jasmineMatchers.toEqualAtomRange;
var toEqualAtomRanges = _require$jasmineMatchers.toEqualAtomRanges;

describe('findWholeRangeOfSymbol', function () {
  var editor = undefined;

  beforeEach(function () {
    var rangeMatchers = { toEqualAtomRange: toEqualAtomRange, toEqualAtomRanges: toEqualAtomRanges };
    this.addMatchers(rangeMatchers);
    waitsForPromise(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open('sampleObjC.m');
    }));
  });

  it('finds the range of a non-selector symbol.', function () {
    var text = 'name';
    var spelling = 'name';
    var textRangeInSample = new Range([8, 31], [8, 35]);
    var extent = { start: { line: 8, column: 31 }, end: { line: 8, column: 35 } };
    var ranges = findWholeRangeOfSymbol(editor, text, textRangeInSample, spelling, extent);
    // The range returned should just be the range of the original text.
    expect(ranges).toEqualAtomRanges([textRangeInSample]);
  });

  it('finds the range of a selector with one argument.', function () {
    var text = 'cStringUsingEncoding';
    var spelling = 'cStringUsingEncoding:';
    var textRangeInSample = new Range([12, 39], [12, 59]);
    var extent = { start: { line: 12, column: 35 }, end: { line: 12, column: 83 } };
    var ranges = findWholeRangeOfSymbol(editor, text, textRangeInSample, spelling, extent);
    // The range returned should just be the range of the original text + 1 for the colon.
    var expectedRange = new Range(textRangeInSample.start, [12, 60]);
    expect(ranges).toEqualAtomRanges([expectedRange]);
  });

  it('finds the range of a selector with multiple arguments, when any of the segments is the selected "text".', function () {
    var spelling = 'createDirectoryAtPath:withIntermediateDirectories:attributes:error:';
    // The ranges returned should be all the ranges of all the segments, including the colons.
    var expectedRange1 = new Range([17, 20], [17, 42]); // location of textRangeInSample1 + 1 colon
    var expectedRange2 = new Range([18, 14], [18, 42]); // location of textRangeInSample2 + 1 colon
    var expectedRange3 = new Range([19, 31], [19, 42]); // location of textRangeInSample3 + 1 colon
    var expectedRange4 = new Range([19, 46], [19, 52]); // location of textRangeInSample4 + 1 colon
    var expectedRanges = [expectedRange1, expectedRange2, expectedRange3, expectedRange4];
    var extent = { start: { line: 17, column: 6 }, end: { line: 19, column: 56 } };

    var text1 = 'createDirectoryAtPath';
    var textRangeInSample1 = new Range([17, 20], [17, 41]);
    var ranges1 = findWholeRangeOfSymbol(editor, text1, textRangeInSample1, spelling, extent);
    expect(ranges1).toEqualAtomRanges(expectedRanges);

    var text2 = 'withIntermediateDirectories';
    var textRangeInSample2 = new Range([18, 14], [18, 41]);
    var ranges2 = findWholeRangeOfSymbol(editor, text2, textRangeInSample2, spelling, extent);
    expect(ranges2).toEqualAtomRanges(expectedRanges);

    var text3 = 'attributes';
    var textRangeInSample3 = new Range([19, 31], [19, 41]);
    var ranges3 = findWholeRangeOfSymbol(editor, text3, textRangeInSample3, spelling, extent);
    expect(ranges3).toEqualAtomRanges(expectedRanges);

    var text4 = 'createDirectoryAtPath';
    var textRangeInSample4 = new Range([19, 46], [19, 51]);
    var ranges4 = findWholeRangeOfSymbol(editor, text4, textRangeInSample4, spelling, extent);
    expect(ranges4).toEqualAtomRanges(expectedRanges);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtY2xhbmctYXRvbS9zcGVjL2ZpbmRXaG9sZVJhbmdlT2ZTeW1ib2wtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztlQVdJLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhCLEtBQUssWUFBTCxLQUFLOztBQUNaLElBQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7OytCQUMxQixPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxlQUFlOztJQUEzRixnQkFBZ0IsNEJBQWhCLGdCQUFnQjtJQUFFLGlCQUFpQiw0QkFBakIsaUJBQWlCOztBQUUxQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtBQUN2QyxNQUFJLE1BQU0sWUFBQSxDQUFDOztBQUVYLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFFBQU0sYUFBYSxHQUFHLEVBQUMsZ0JBQWdCLEVBQWhCLGdCQUFnQixFQUFFLGlCQUFpQixFQUFqQixpQkFBaUIsRUFBQyxDQUFDO0FBQzVELFFBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEMsbUJBQWUsbUJBQUMsYUFBWTtBQUMxQixZQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUNwRCxFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLDJDQUEyQyxFQUFFLFlBQU07QUFDcEQsUUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3BCLFFBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN4QixRQUFNLGlCQUFpQixHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsUUFBTSxNQUFNLEdBQUcs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O0FBQzVGLFVBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztHQUNuRCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvbnVjbGlkZS1jbGFuZy1hdG9tL3NwZWMvZmluZFdob2xlUmFuZ2VPZlN5bWJvbC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3Qge1JhbmdlfSA9IHJlcXVpcmUoJ2F0b20nKTtcbmNvbnN0IGZpbmRXaG9sZVJhbmdlT2ZTeW1ib2wgPSByZXF1aXJlKCcuLi9saWIvZmluZFdob2xlUmFuZ2VPZlN5bWJvbCcpO1xuY29uc3Qge3RvRXF1YWxBdG9tUmFuZ2UsIHRvRXF1YWxBdG9tUmFuZ2VzfSA9IHJlcXVpcmUoJ251Y2xpZGUtYXRvbS10ZXN0LWhlbHBlcnMnKS5qYXNtaW5lTWF0Y2hlcnM7XG5cbmRlc2NyaWJlKCdmaW5kV2hvbGVSYW5nZU9mU3ltYm9sJywgKCkgPT4ge1xuICBsZXQgZWRpdG9yO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmFuZ2VNYXRjaGVycyA9IHt0b0VxdWFsQXRvbVJhbmdlLCB0b0VxdWFsQXRvbVJhbmdlc307XG4gICAgdGhpcy5hZGRNYXRjaGVycyhyYW5nZU1hdGNoZXJzKTtcbiAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlT2JqQy5tJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyB0aGUgcmFuZ2Ugb2YgYSBub24tc2VsZWN0b3Igc3ltYm9sLicsICgpID0+IHtcbiAgICBjb25zdCB0ZXh0ID0gJ25hbWUnO1xuICAgIGNvbnN0IHNwZWxsaW5nID0gJ25hbWUnO1xuICAgIGNvbnN0IHRleHRSYW5nZUluU2FtcGxlID0gbmV3IFJhbmdlKFs4LCAzMV0sIFs4LCAzNV0pO1xuICAgIGNvbnN0IGV4dGVudCA9IHtzdGFydDoge2xpbmU6IDgsIGNvbHVtbjogMzF9LCBlbmQ6IHtsaW5lOiA4LCBjb2x1bW46IDM1fX07XG4gICAgY29uc3QgcmFuZ2VzID0gZmluZFdob2xlUmFuZ2VPZlN5bWJvbChlZGl0b3IsIHRleHQsIHRleHRSYW5nZUluU2FtcGxlLCBzcGVsbGluZywgZXh0ZW50KTtcbiAgICAvLyBUaGUgcmFuZ2UgcmV0dXJuZWQgc2hvdWxkIGp1c3QgYmUgdGhlIHJhbmdlIG9mIHRoZSBvcmlnaW5hbCB0ZXh0LlxuICAgIGV4cGVjdChyYW5nZXMpLnRvRXF1YWxBdG9tUmFuZ2VzKFt0ZXh0UmFuZ2VJblNhbXBsZV0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgdGhlIHJhbmdlIG9mIGEgc2VsZWN0b3Igd2l0aCBvbmUgYXJndW1lbnQuJywgKCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSAnY1N0cmluZ1VzaW5nRW5jb2RpbmcnO1xuICAgIGNvbnN0IHNwZWxsaW5nID0gJ2NTdHJpbmdVc2luZ0VuY29kaW5nOic7XG4gICAgY29uc3QgdGV4dFJhbmdlSW5TYW1wbGUgPSBuZXcgUmFuZ2UoWzEyLCAzOV0sIFsxMiwgNTldKTtcbiAgICBjb25zdCBleHRlbnQgPSB7c3RhcnQ6IHtsaW5lOiAxMiwgY29sdW1uOiAzNX0sIGVuZDoge2xpbmU6IDEyLCBjb2x1bW46IDgzfX07XG4gICAgY29uc3QgcmFuZ2VzID0gZmluZFdob2xlUmFuZ2VPZlN5bWJvbChlZGl0b3IsIHRleHQsIHRleHRSYW5nZUluU2FtcGxlLCBzcGVsbGluZywgZXh0ZW50KTtcbiAgICAvLyBUaGUgcmFuZ2UgcmV0dXJuZWQgc2hvdWxkIGp1c3QgYmUgdGhlIHJhbmdlIG9mIHRoZSBvcmlnaW5hbCB0ZXh0ICsgMSBmb3IgdGhlIGNvbG9uLlxuICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UgPSBuZXcgUmFuZ2UodGV4dFJhbmdlSW5TYW1wbGUuc3RhcnQsIFsxMiwgNjBdKTtcbiAgICBleHBlY3QocmFuZ2VzKS50b0VxdWFsQXRvbVJhbmdlcyhbZXhwZWN0ZWRSYW5nZV0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgdGhlIHJhbmdlIG9mIGEgc2VsZWN0b3Igd2l0aCBtdWx0aXBsZSBhcmd1bWVudHMsIHdoZW4gYW55IG9mIHRoZSBzZWdtZW50cyBpcyB0aGUgc2VsZWN0ZWQgXCJ0ZXh0XCIuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWxsaW5nID0gJ2NyZWF0ZURpcmVjdG9yeUF0UGF0aDp3aXRoSW50ZXJtZWRpYXRlRGlyZWN0b3JpZXM6YXR0cmlidXRlczplcnJvcjonO1xuICAgIC8vIFRoZSByYW5nZXMgcmV0dXJuZWQgc2hvdWxkIGJlIGFsbCB0aGUgcmFuZ2VzIG9mIGFsbCB0aGUgc2VnbWVudHMsIGluY2x1ZGluZyB0aGUgY29sb25zLlxuICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2UxID0gbmV3IFJhbmdlKFsxNywgMjBdLCBbMTcsIDQyXSk7IC8vIGxvY2F0aW9uIG9mIHRleHRSYW5nZUluU2FtcGxlMSArIDEgY29sb25cbiAgICBjb25zdCBleHBlY3RlZFJhbmdlMiA9IG5ldyBSYW5nZShbMTgsIDE0XSwgWzE4LCA0Ml0pOyAvLyBsb2NhdGlvbiBvZiB0ZXh0UmFuZ2VJblNhbXBsZTIgKyAxIGNvbG9uXG4gICAgY29uc3QgZXhwZWN0ZWRSYW5nZTMgPSBuZXcgUmFuZ2UoWzE5LCAzMV0sIFsxOSwgNDJdKTsgLy8gbG9jYXRpb24gb2YgdGV4dFJhbmdlSW5TYW1wbGUzICsgMSBjb2xvblxuICAgIGNvbnN0IGV4cGVjdGVkUmFuZ2U0ID0gbmV3IFJhbmdlKFsxOSwgNDZdLCBbMTksIDUyXSk7IC8vIGxvY2F0aW9uIG9mIHRleHRSYW5nZUluU2FtcGxlNCArIDEgY29sb25cbiAgICBjb25zdCBleHBlY3RlZFJhbmdlcyA9IFtleHBlY3RlZFJhbmdlMSwgZXhwZWN0ZWRSYW5nZTIsIGV4cGVjdGVkUmFuZ2UzLCBleHBlY3RlZFJhbmdlNF07XG4gICAgY29uc3QgZXh0ZW50ID0ge3N0YXJ0OiB7bGluZTogMTcsIGNvbHVtbjogNn0sIGVuZDoge2xpbmU6IDE5LCBjb2x1bW46IDU2fX07XG5cbiAgICBjb25zdCB0ZXh0MSA9ICdjcmVhdGVEaXJlY3RvcnlBdFBhdGgnO1xuICAgIGNvbnN0IHRleHRSYW5nZUluU2FtcGxlMSA9IG5ldyBSYW5nZShbMTcsIDIwXSwgWzE3LCA0MV0pO1xuICAgIGNvbnN0IHJhbmdlczEgPSBmaW5kV2hvbGVSYW5nZU9mU3ltYm9sKGVkaXRvciwgdGV4dDEsIHRleHRSYW5nZUluU2FtcGxlMSwgc3BlbGxpbmcsIGV4dGVudCk7XG4gICAgZXhwZWN0KHJhbmdlczEpLnRvRXF1YWxBdG9tUmFuZ2VzKGV4cGVjdGVkUmFuZ2VzKTtcblxuICAgIGNvbnN0IHRleHQyID0gJ3dpdGhJbnRlcm1lZGlhdGVEaXJlY3Rvcmllcyc7XG4gICAgY29uc3QgdGV4dFJhbmdlSW5TYW1wbGUyID0gbmV3IFJhbmdlKFsxOCwgMTRdLCBbMTgsIDQxXSk7XG4gICAgY29uc3QgcmFuZ2VzMiA9IGZpbmRXaG9sZVJhbmdlT2ZTeW1ib2woZWRpdG9yLCB0ZXh0MiwgdGV4dFJhbmdlSW5TYW1wbGUyLCBzcGVsbGluZywgZXh0ZW50KTtcbiAgICBleHBlY3QocmFuZ2VzMikudG9FcXVhbEF0b21SYW5nZXMoZXhwZWN0ZWRSYW5nZXMpO1xuXG4gICAgY29uc3QgdGV4dDMgPSAnYXR0cmlidXRlcyc7XG4gICAgY29uc3QgdGV4dFJhbmdlSW5TYW1wbGUzID0gbmV3IFJhbmdlKFsxOSwgMzFdLCBbMTksIDQxXSk7XG4gICAgY29uc3QgcmFuZ2VzMyA9IGZpbmRXaG9sZVJhbmdlT2ZTeW1ib2woZWRpdG9yLCB0ZXh0MywgdGV4dFJhbmdlSW5TYW1wbGUzLCBzcGVsbGluZywgZXh0ZW50KTtcbiAgICBleHBlY3QocmFuZ2VzMykudG9FcXVhbEF0b21SYW5nZXMoZXhwZWN0ZWRSYW5nZXMpO1xuXG4gICAgY29uc3QgdGV4dDQgPSAnY3JlYXRlRGlyZWN0b3J5QXRQYXRoJztcbiAgICBjb25zdCB0ZXh0UmFuZ2VJblNhbXBsZTQgPSBuZXcgUmFuZ2UoWzE5LCA0Nl0sIFsxOSwgNTFdKTtcbiAgICBjb25zdCByYW5nZXM0ID0gZmluZFdob2xlUmFuZ2VPZlN5bWJvbChlZGl0b3IsIHRleHQ0LCB0ZXh0UmFuZ2VJblNhbXBsZTQsIHNwZWxsaW5nLCBleHRlbnQpO1xuICAgIGV4cGVjdChyYW5nZXM0KS50b0VxdWFsQXRvbVJhbmdlcyhleHBlY3RlZFJhbmdlcyk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-clang-atom/spec/findWholeRangeOfSymbol-spec.js