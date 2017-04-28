'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _require = require('atom');

var Point = _require.Point;
var TextBuffer = _require.TextBuffer;

var ObjectiveCColonIndenter = require('../lib/ObjectiveCColonIndenter');
var getIndentedColonColumn = ObjectiveCColonIndenter.getIndentedColonColumn;

describe('ObjectiveCColonIndenter', function () {
    describe('getIndentedColonColumn', function () {
        it('throws an error if the close bracket position does not contain a colon', function () {
            var error = new Error('The start position must contain a colon, found \'\' instead');
            expect(function () {
                return getIndentedColonColumn(new TextBuffer(''), Point.fromObject([0, 0]));
            }).toThrow(error);
            error = new Error('The start position must contain a colon, found \' \' instead');
            expect(function () {
                return getIndentedColonColumn(new TextBuffer(' :'), Point.fromObject([0, 0]));
            }).toThrow(error);
            expect(function () {
                return getIndentedColonColumn(new TextBuffer(': '), Point.fromObject([0, 1]));
            }).toThrow(error);
        });

        it('returns null if no colons are found for a method declaration', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              + (Type *)arg\n              arg:'), Point.fromObject([2, 17]))).toBeNull();
        });

        it('works on class method declarations', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              + (Type *)arg:(Type *)value\n              arg:'), Point.fromObject([2, 17]))).toEqual(27);
        });

        it('works on instance method declarations', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              - (Type *)arg:(Type *)value\n              arg:'), Point.fromObject([2, 17]))).toEqual(27);
        });

        it('returns null for single-line method calls', function () {
            expect(getIndentedColonColumn(new TextBuffer('[obj arg:value :'), Point.fromObject([0, 15]))).toBeNull();
        });

        it('works on multi-line method calls', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg:value\n                   arg:value\n              arg:'), Point.fromObject([3, 17]))).toEqual(22);
        });

        it('returns null if no colons are found for a method call', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg\n              arg:'), Point.fromObject([2, 17]))).toBeNull();
        });

        it('returns null if no key characters are found', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              obj arg\n              arg:'), Point.fromObject([2, 17]))).toBeNull();
        });

        it('works when the first line of the method has multiple colons', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg:value arg:value\n              arg:'), Point.fromObject([2, 17]))).toEqual(22);
        });

        it('works when the previous line is not indented properly', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg:value\n              arg:value\n              arg:'), Point.fromObject([3, 17]))).toEqual(22);
        });

        it('works when the method is nested and on the same line as the outer method', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg:[obj value:\n              arg:'), Point.fromObject([2, 17]))).toEqual(33);
        });

        it('works when a previous argument is a nested method', function () {
            expect(getIndentedColonColumn(new TextBuffer('\n              [obj arg:[obj arg:value]\n              arg:'), Point.fromObject([2, 17]))).toEqual(22);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtb2JqYy9zcGVjL09iamVjdGl2ZUNDb2xvbkluZGVudGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O2VBVWdCLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXBDLEtBQUssWUFBTCxLQUFLO0lBQUUsVUFBVSxZQUFWLFVBQVU7O0FBQ3hCLElBQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDbkUsc0JBQXNCLEdBQUksdUJBQXVCLENBQWpELHNCQUFzQjs7QUFFN0IsUUFBUSxDQUFDLHlCQUF5QixFQUFFLFlBQU07QUFDeEMsWUFBUSxDQUFDLHdCQUF3QixFQUFFLFlBQU07QUFDdkMsVUFBRSxDQUFDLHdFQUF3RSxFQUFFLFlBQU07QUFDakYsZ0JBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7QUFDckYsa0JBQU0sQ0FBQzt1QkFBTSxzQkFBc0IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFBQSxDQUFDLENBQzdFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQixpQkFBSyxHQUFHLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7QUFDbEYsa0JBQU0sQ0FBQzt1QkFBTSxzQkFBc0IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFBQSxDQUFDLENBQy9FLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQixrQkFBTSxDQUFDO3VCQUFNLHNCQUFzQixDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FB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O0FBRUgsVUFBRSxDQUFDLDBFQUEwRSxFQUFFLFlBQU07QUFDbkYsa0JBQU0sQ0FBQyxzQkFBc0IsQ0FDekIsSUFBSSxVQUFVLDREQUVKLEVBQ1YsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xCLENBQUMsQ0FBQzs7QUFFSCxVQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUM1RCxrQkFBTSxDQUFDLHNCQUFzQixDQUN6QixJQUFJLFVBQVUsZ0VBRUosRUFDVixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtb2JqYy9zcGVjL09iamVjdGl2ZUNDb2xvbkluZGVudGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuY29uc3Qge1BvaW50LCBUZXh0QnVmZmVyfSA9IHJlcXVpcmUoJ2F0b20nKTtcbmNvbnN0IE9iamVjdGl2ZUNDb2xvbkluZGVudGVyID0gcmVxdWlyZSgnLi4vbGliL09iamVjdGl2ZUNDb2xvbkluZGVudGVyJyk7XG5jb25zdCB7Z2V0SW5kZW50ZWRDb2xvbkNvbHVtbn0gPSBPYmplY3RpdmVDQ29sb25JbmRlbnRlcjtcblxuZGVzY3JpYmUoJ09iamVjdGl2ZUNDb2xvbkluZGVudGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZ2V0SW5kZW50ZWRDb2xvbkNvbHVtbicsICgpID0+IHtcbiAgICBpdCgndGhyb3dzIGFuIGVycm9yIGlmIHRoZSBjbG9zZSBicmFja2V0IHBvc2l0aW9uIGRvZXMgbm90IGNvbnRhaW4gYSBjb2xvbicsICgpID0+IHtcbiAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcignVGhlIHN0YXJ0IHBvc2l0aW9uIG11c3QgY29udGFpbiBhIGNvbG9uLCBmb3VuZCBcXCdcXCcgaW5zdGVhZCcpO1xuICAgICAgZXhwZWN0KCgpID0+IGdldEluZGVudGVkQ29sb25Db2x1bW4obmV3IFRleHRCdWZmZXIoJycpLCBQb2ludC5mcm9tT2JqZWN0KFswLCAwXSkpKVxuICAgICAgICAgIC50b1Rocm93KGVycm9yKTtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdUaGUgc3RhcnQgcG9zaXRpb24gbXVzdCBjb250YWluIGEgY29sb24sIGZvdW5kIFxcJyBcXCcgaW5zdGVhZCcpO1xuICAgICAgZXhwZWN0KCgpID0+IGdldEluZGVudGVkQ29sb25Db2x1bW4obmV3IFRleHRCdWZmZXIoJyA6JyksIFBvaW50LmZyb21PYmplY3QoWzAsIDBdKSkpXG4gICAgICAgICAgLnRvVGhyb3coZXJyb3IpO1xuICAgICAgZXhwZWN0KCgpID0+IGdldEluZGVudGVkQ29sb25Db2x1bW4obmV3IFRleHRCdWZmZXIoJzogJyksIFBvaW50LmZyb21PYmplY3QoWzAsIDFdKSkpXG4gICAgICAgICAgLnRvVGhyb3coZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgbnVsbCBpZiBubyBjb2xvbnMgYXJlIGZvdW5kIGZvciBhIG1ldGhvZCBkZWNsYXJhdGlvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRJbmRlbnRlZENvbG9uQ29sdW1uKFxuICAgICAgICAgIG5ldyBUZXh0QnVmZmVyKGBcbiAgICAgICAgICAgICAgKyAoVHlwZSAqKWFyZ1xuICAgICAgICAgICAgICBhcmc6YCksXG4gICAgICAgICAgUG9pbnQuZnJvbU9iamVjdChbMiwgMTddKSkpXG4gICAgICAgICAgLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnd29ya3Mgb24gY2xhc3MgbWV0aG9kIGRlY2xhcmF0aW9ucycsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRJbmRlbnRlZENvbG9uQ29sdW1uKFxuICAgICAgICAgIG5ldyBUZXh0QnVmZmVyKGBcbiAgICAgICAgICAgICAgKyAoVHlwZSAqKWFyZzooVHlwZSAqKXZhbHVlXG4gICAgICAgICAgICAgIGFyZzpgKSxcbiAgICAgICAgICBQb2ludC5mcm9tT2JqZWN0KFsyLCAxN10pKSlcbiAgICAgICAgICAudG9FcXVhbCgyNyk7XG4gICAgfSk7XG5cbiAgICBpdCgnd29ya3Mgb24gaW5zdGFuY2UgbWV0aG9kIGRlY2xhcmF0aW9ucycsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRJbmRlbnRlZENvbG9uQ29sdW1uKFxuICAgICAgICAgIG5ldyBUZXh0QnVmZmVyKGBcbiAgICAgICAgICAgICAgLSAoVHlwZSAqKWFyZzooVHlwZSAqKXZhbHVlXG4gICAgICAgICAgICAgIGFyZzpgKSxcbiAgICAgICAgICBQb2ludC5mcm9tT2JqZWN0KFsyLCAxN10pKSlcbiAgICAgICAgICAudG9FcXVhbCgyNyk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBudWxsIGZvciBzaW5nbGUtbGluZSBtZXRob2QgY2FsbHMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0SW5kZW50ZWRDb2xvbkNvbHVtbihcbiAgICAgICAgICBuZXcgVGV4dEJ1ZmZlcihgW29iaiBhcmc6dmFsdWUgOmApLFxuICAgICAgICAgIFBvaW50LmZyb21PYmplY3QoWzAsIDE1XSkpKVxuICAgICAgICAgIC50b0JlTnVsbCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dvcmtzIG9uIG11bHRpLWxpbmUgbWV0aG9kIGNhbGxzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEluZGVudGVkQ29sb25Db2x1bW4oXG4gICAgICAgICAgbmV3IFRleHRCdWZmZXIoYFxuICAgICAgICAgICAgICBbb2JqIGFyZzp2YWx1ZVxuICAgICAgICAgICAgICAgICAgIGFyZzp2YWx1ZVxuICAgICAgICAgICAgICBhcmc6YCksXG4gICAgICAgICAgUG9pbnQuZnJvbU9iamVjdChbMywgMTddKSkpXG4gICAgICAgICAgLnRvRXF1YWwoMjIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgbnVsbCBpZiBubyBjb2xvbnMgYXJlIGZvdW5kIGZvciBhIG1ldGhvZCBjYWxsJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEluZGVudGVkQ29sb25Db2x1bW4oXG4gICAgICAgICAgbmV3IFRleHRCdWZmZXIoYFxuICAgICAgICAgICAgICBbb2JqIGFyZ1xuICAgICAgICAgICAgICBhcmc6YCksXG4gICAgICAgICAgUG9pbnQuZnJvbU9iamVjdChbMiwgMTddKSkpXG4gICAgICAgICAgLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBudWxsIGlmIG5vIGtleSBjaGFyYWN0ZXJzIGFyZSBmb3VuZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRJbmRlbnRlZENvbG9uQ29sdW1uKFxuICAgICAgICAgIG5ldyBUZXh0QnVmZmVyKGBcbiAgICAgICAgICAgICAgb2JqIGFyZ1xuICAgICAgICAgICAgICBhcmc6YCksXG4gICAgICAgICAgUG9pbnQuZnJvbU9iamVjdChbMiwgMTddKSkpXG4gICAgICAgICAgLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnd29ya3Mgd2hlbiB0aGUgZmlyc3QgbGluZSBvZiB0aGUgbWV0aG9kIGhhcyBtdWx0aXBsZSBjb2xvbnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0SW5kZW50ZWRDb2xvbkNvbHVtbihcbiAgICAgICAgICBuZXcgVGV4dEJ1ZmZlcihgXG4gICAgICAgICAgICAgIFtvYmogYXJnOnZhbHVlIGFyZzp2YWx1ZVxuICAgICAgICAgICAgICBhcmc6YCksXG4gICAgICAgICAgUG9pbnQuZnJvbU9iamVjdChbMiwgMTddKSkpXG4gICAgICAgICAgLnRvRXF1YWwoMjIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dvcmtzIHdoZW4gdGhlIHByZXZpb3VzIGxpbmUgaXMgbm90IGluZGVudGVkIHByb3Blcmx5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEluZGVudGVkQ29sb25Db2x1bW4oXG4gICAgICAgICAgbmV3IFRleHRCdWZmZXIoYFxuICAgICAgICAgICAgICBbb2JqIGFyZzp2YWx1ZVxuICAgICAgICAgICAgICBhcmc6dmFsdWVcbiAgICAgICAgICAgICAgYXJnOmApLFxuICAgICAgICAgIFBvaW50LmZyb21PYmplY3QoWzMsIDE3XSkpKVxuICAgICAgICAgIC50b0VxdWFsKDIyKTtcbiAgICB9KTtcblxuICAgIGl0KCd3b3JrcyB3aGVuIHRoZSBtZXRob2QgaXMgbmVzdGVkIGFuZCBvbiB0aGUgc2FtZSBsaW5lIGFzIHRoZSBvdXRlciBtZXRob2QnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0SW5kZW50ZWRDb2xvbkNvbHVtbihcbiAgICAgICAgICBuZXcgVGV4dEJ1ZmZlcihgXG4gICAgICAgICAgICAgIFtvYmogYXJnOltvYmogdmFsdWU6XG4gICAgICAgICAgICAgIGFyZzpgKSxcbiAgICAgICAgICBQb2ludC5mcm9tT2JqZWN0KFsyLCAxN10pKSlcbiAgICAgICAgICAudG9FcXVhbCgzMyk7XG4gICAgfSk7XG5cbiAgICBpdCgnd29ya3Mgd2hlbiBhIHByZXZpb3VzIGFyZ3VtZW50IGlzIGEgbmVzdGVkIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRJbmRlbnRlZENvbG9uQ29sdW1uKFxuICAgICAgICAgIG5ldyBUZXh0QnVmZmVyKGBcbiAgICAgICAgICAgICAgW29iaiBhcmc6W29iaiBhcmc6dmFsdWVdXG4gICAgICAgICAgICAgIGFyZzpgKSxcbiAgICAgICAgICBQb2ludC5mcm9tT2JqZWN0KFsyLCAxN10pKSlcbiAgICAgICAgICAudG9FcXVhbCgyMik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-objc/spec/ObjectiveCColonIndenter-spec.js
