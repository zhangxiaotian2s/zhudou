'use babel';

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var path = require('path');
var fs = require('fs');
var HackLanguage = require('../lib/HackLanguage');

describe('HackLanguage', function () {
  var hackLanguage = undefined;
  beforeEach(function () {
    hackLanguage = new HackLanguage(false, '', '');
  });

  afterEach(function () {
    hackLanguage.dispose();
  });

  describe('getDiagnostics()', function () {
    it('gets the file errors', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var filePath = path.join(__dirname, 'fixtures', 'HackExample1.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');

        var errors = yield hackLanguage.getDiagnostics(filePath, fileContents);

        expect(errors.length).toBe(1);
        var diagnostics = errors[0].message;
        expect(diagnostics[0].descr).toMatch(/await.*async/);
        expect(diagnostics[0].path).toBe(filePath);
        expect(diagnostics[0].start).toBe(12);
        expect(diagnostics[0].end).toBe(36);
        expect(diagnostics[0].line).toBe(15);
      }));
    });
  });

  describe('getCompletions()', function () {
    it('gets the local completions', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var filePath = path.join(__dirname, 'fixtures', 'HackExample2.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');
        var completionOffset = fileContents.indexOf('->') + 2;

        var completions = yield hackLanguage.getCompletions(filePath, fileContents, completionOffset);

        expect(completions.length).toBe(2);
        expect(completions[0]).toEqual({
          matchText: 'doSomething',
          matchSnippet: 'doSomething(${1:$inputText})',
          matchType: 'function($inputText): string'
        });
        expect(completions[1]).toEqual({
          matchText: 'getPayload',
          matchSnippet: 'getPayload()',
          matchType: 'function(): string'
        });
      }));
    });
  });

  describe('formatSource()', function () {
    it('adds new line at the end and fixes indentation', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var contents = '<?hh // strict\n  // misplaced comment and class\n  class HackClass {}';
        var newSource = yield hackLanguage.formatSource(contents, 1, contents.length + 1);
        expect(newSource).toBe('<?hh // strict\n// misplaced comment and class\nclass HackClass {}\n');
      }));
    });
  });

  describe('getType()', function () {
    it('gets the defined and inferred types', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var filePath = path.join(__dirname, 'fixtures', 'HackExample3.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');

        var nullType = yield hackLanguage.getType(filePath, fileContents, 'WebSupportFormCountryTypeahead', 4, 14);
        expect(nullType).toBeNull();
        var timeZoneType = yield hackLanguage.getType(filePath, fileContents, '$timezone_id', 7, 27);
        expect(timeZoneType).toBe('TimeZoneTypeType');
        var groupedAdsType = yield hackLanguage.getType(filePath, fileContents, '$grouped_ads', 9, 11);
        expect(groupedAdsType).toBe('[shape-like array]');
      }));
    });
  });

  describe('getDefinition()', function () {
    it('gets the local definition', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var filePath = path.join(__dirname, 'fixtures', 'HackExample1.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');
        var lineNumber = 15;
        var column = 26;

        var definitions = yield hackLanguage._getDefinitionLocationAtPosition(filePath, fileContents, lineNumber, column);
        expect(definitions).toEqual([{
          path: filePath,
          line: 7,
          column: 6,
          length: 9
        }]);
      }));
    });

    it('_parseStringForExpression returns a php expression from a line', function () {
      var _hackLanguage$_parseStringForExpression = hackLanguage._parseStringForExpression('  $abcd = 123;', 4);

      var search = _hackLanguage$_parseStringForExpression.search;

      expect(search).toEqual('$abcd');
    });

    it('_parseStringForExpression returns an XHP expression from a line', function () {
      var _hackLanguage$_parseStringForExpression2 = hackLanguage._parseStringForExpression('  <ui:test:element attr="123">', 7);

      var search = _hackLanguage$_parseStringForExpression2.search;

      expect(search).toEqual(':ui:test:element');
    });

    it('_parseStringForExpression returns an php expression from a line with <', function () {
      var _hackLanguage$_parseStringForExpression3 = hackLanguage._parseStringForExpression('  $abc = $def<$lol;', 11);

      var search = _hackLanguage$_parseStringForExpression3.search;

      expect(search).toEqual('$def');
    });

    it('_parseStringForExpression returns an php expression from a line with < and >', function () {
      var _hackLanguage$_parseStringForExpression4 = hackLanguage._parseStringForExpression('  $abc = $def <$lol && $x > $z;', 11);

      var search = _hackLanguage$_parseStringForExpression4.search;

      expect(search).toEqual('$def');
    });

    it('_parseStringForExpression returns an php expression from a line with php code and xhp expression', function () {
      var _hackLanguage$_parseStringForExpression5 = hackLanguage._parseStringForExpression('  $abc = $get$Xhp() . <ui:button attr="cs">;', 25);

      var search = _hackLanguage$_parseStringForExpression5.search;

      expect(search).toEqual(':ui:button');
    });

    it('_parseStringForExpression returns an php expression from a line with multiple xhp expression', function () {
      var lineText = '  $abc = <ui:button attr="cs"> . <ui:radio>;';
      expect(hackLanguage._parseStringForExpression(lineText, 4).search).toBe('$abc');
      expect(hackLanguage._parseStringForExpression(lineText, 15).search).toBe(':ui:button');
      expect(hackLanguage._parseStringForExpression(lineText, 23).search).toBe('attr');
      expect(hackLanguage._parseStringForExpression(lineText, 36).search).toBe(':ui:radio');
    });
  });

  describe('getSymbolNameAtPosition()', function () {
    it('gets the symbol name', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var filePath = path.join(__dirname, 'fixtures', 'HackExample1.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');
        var lineNumber = 15;
        var column = 26;
        var symbol = yield hackLanguage.getSymbolNameAtPosition(filePath, fileContents, lineNumber, column);
        expect(symbol).toEqual({
          name: '\\WebSupportFormCountryTypeahead::genPayload',
          type: 2,
          line: 14,
          column: 24,
          length: 10
        });
      }));
    });
  });

  describe('isFinishedLoadingDependencies()', function () {
    it('updates the status of isFinishedLoadingDependencies', function () {
      waitsForPromise(_asyncToGenerator(function* () {
        var spy = jasmine.createSpy('callback');
        var filePath = path.join(__dirname, 'fixtures', 'HackExample1.php');
        var fileContents = fs.readFileSync(filePath, 'utf8');
        hackLanguage.onFinishedLoadingDependencies(spy);
        yield hackLanguage.updateFile(filePath, fileContents);
        // Initially, dependencies haven't been loaded yet.
        expect(hackLanguage.isFinishedLoadingDependencies()).toEqual(false);
        yield hackLanguage.updateDependencies();
        // HackExample1 refers to another class, which Hack tries to load.
        expect(hackLanguage.isFinishedLoadingDependencies()).toEqual(false);
        yield hackLanguage.updateDependencies();
        // There's no further dependencies to fetch.
        expect(hackLanguage.isFinishedLoadingDependencies()).toEqual(true);
        expect(spy).toHaveBeenCalled();
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtaGFjay9zcGVjL0hhY2tMYW5ndWFnZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7O0FBV1osSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFcEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzdCLE1BQUksWUFBWSxZQUFBLENBQUM7QUFDakIsWUFBVSxDQUFDLFlBQU07QUFDZixnQkFBWSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDaEQsQ0FBQyxDQUFDOztBQUVILFdBQVMsQ0FBQyxZQUFNO0FBQ2QsZ0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN4QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDakMsTUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQU07QUFDL0IscUJBQWUsbUJBQUMsYUFBWTtBQUMxQixZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN0RSxZQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFdkQsWUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFekUsY0FBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsWUFB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OztBQUV4QyxjQUFNLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEUsY0FBTSxZQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFeEMsY0FBTSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25FLGNBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO09BQ2hDLEVBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUVKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWhhY2svc3BlYy9IYWNrTGFuZ3VhZ2Utc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBIYWNrTGFuZ3VhZ2UgPSByZXF1aXJlKCcuLi9saWIvSGFja0xhbmd1YWdlJyk7XG5cbmRlc2NyaWJlKCdIYWNrTGFuZ3VhZ2UnLCAoKSA9PiB7XG4gIGxldCBoYWNrTGFuZ3VhZ2U7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGhhY2tMYW5ndWFnZSA9IG5ldyBIYWNrTGFuZ3VhZ2UoZmFsc2UsICcnLCAnJyk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgaGFja0xhbmd1YWdlLmRpc3Bvc2UoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldERpYWdub3N0aWNzKCknLCAoKSA9PiB7XG4gICAgaXQoJ2dldHMgdGhlIGZpbGUgZXJyb3JzJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnSGFja0V4YW1wbGUxLnBocCcpO1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG5cbiAgICAgICAgY29uc3QgZXJyb3JzID0gYXdhaXQgaGFja0xhbmd1YWdlLmdldERpYWdub3N0aWNzKGZpbGVQYXRoLCBmaWxlQ29udGVudHMpO1xuXG4gICAgICAgIGV4cGVjdChlcnJvcnMubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBjb25zdCBkaWFnbm9zdGljcyA9IGVycm9yc1swXS5tZXNzYWdlO1xuICAgICAgICBleHBlY3QoZGlhZ25vc3RpY3NbMF0uZGVzY3IpLnRvTWF0Y2goL2F3YWl0Liphc3luYy8pO1xuICAgICAgICBleHBlY3QoZGlhZ25vc3RpY3NbMF0ucGF0aCkudG9CZShmaWxlUGF0aCk7XG4gICAgICAgIGV4cGVjdChkaWFnbm9zdGljc1swXS5zdGFydCkudG9CZSgxMik7XG4gICAgICAgIGV4cGVjdChkaWFnbm9zdGljc1swXS5lbmQpLnRvQmUoMzYpO1xuICAgICAgICBleHBlY3QoZGlhZ25vc3RpY3NbMF0ubGluZSkudG9CZSgxNSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldENvbXBsZXRpb25zKCknLCAoKSA9PiB7XG4gICAgaXQoJ2dldHMgdGhlIGxvY2FsIGNvbXBsZXRpb25zJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnSGFja0V4YW1wbGUyLnBocCcpO1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICAgIGNvbnN0IGNvbXBsZXRpb25PZmZzZXQgPSBmaWxlQ29udGVudHMuaW5kZXhPZignLT4nKSArIDI7XG5cbiAgICAgICAgY29uc3QgY29tcGxldGlvbnMgPSBhd2FpdCBoYWNrTGFuZ3VhZ2UuZ2V0Q29tcGxldGlvbnMoZmlsZVBhdGgsIGZpbGVDb250ZW50cywgY29tcGxldGlvbk9mZnNldCk7XG5cbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zLmxlbmd0aCkudG9CZSgyKTtcbiAgICAgICAgZXhwZWN0KGNvbXBsZXRpb25zWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICBtYXRjaFRleHQgOiAnZG9Tb21ldGhpbmcnLFxuICAgICAgICAgIG1hdGNoU25pcHBldDogJ2RvU29tZXRoaW5nKCR7MTokaW5wdXRUZXh0fSknLFxuICAgICAgICAgIG1hdGNoVHlwZSA6ICdmdW5jdGlvbigkaW5wdXRUZXh0KTogc3RyaW5nJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChjb21wbGV0aW9uc1sxXSkudG9FcXVhbCh7XG4gICAgICAgICAgbWF0Y2hUZXh0IDogJ2dldFBheWxvYWQnLFxuICAgICAgICAgIG1hdGNoU25pcHBldDogJ2dldFBheWxvYWQoKScsXG4gICAgICAgICAgbWF0Y2hUeXBlIDogJ2Z1bmN0aW9uKCk6IHN0cmluZycsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmb3JtYXRTb3VyY2UoKScsICgpID0+IHtcbiAgICBpdCgnYWRkcyBuZXcgbGluZSBhdCB0aGUgZW5kIGFuZCBmaXhlcyBpbmRlbnRhdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYDw/aGggLy8gc3RyaWN0XG4gIC8vIG1pc3BsYWNlZCBjb21tZW50IGFuZCBjbGFzc1xuICBjbGFzcyBIYWNrQ2xhc3Mge31gO1xuICAgICAgICBjb25zdCBuZXdTb3VyY2UgPSBhd2FpdCBoYWNrTGFuZ3VhZ2UuZm9ybWF0U291cmNlKGNvbnRlbnRzLCAxLCBjb250ZW50cy5sZW5ndGgrMSk7XG4gICAgICAgIGV4cGVjdChuZXdTb3VyY2UpLnRvQmUoYDw/aGggLy8gc3RyaWN0XG4vLyBtaXNwbGFjZWQgY29tbWVudCBhbmQgY2xhc3NcbmNsYXNzIEhhY2tDbGFzcyB7fVxuYCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFR5cGUoKScsICgpID0+IHtcbiAgICBpdCgnZ2V0cyB0aGUgZGVmaW5lZCBhbmQgaW5mZXJyZWQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICB3YWl0c0ZvclByb21pc2UoYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdIYWNrRXhhbXBsZTMucGhwJyk7XG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0ZjgnKTtcblxuICAgICAgICBjb25zdCBudWxsVHlwZSA9IGF3YWl0IGhhY2tMYW5ndWFnZS5nZXRUeXBlKGZpbGVQYXRoLCBmaWxlQ29udGVudHMsICdXZWJTdXBwb3J0Rm9ybUNvdW50cnlUeXBlYWhlYWQnLCA0LCAxNCk7XG4gICAgICAgIGV4cGVjdChudWxsVHlwZSkudG9CZU51bGwoKTtcbiAgICAgICAgY29uc3QgdGltZVpvbmVUeXBlID0gYXdhaXQgaGFja0xhbmd1YWdlLmdldFR5cGUoZmlsZVBhdGgsIGZpbGVDb250ZW50cywgJyR0aW1lem9uZV9pZCcsIDcsIDI3KTtcbiAgICAgICAgZXhwZWN0KHRpbWVab25lVHlwZSkudG9CZSgnVGltZVpvbmVUeXBlVHlwZScpO1xuICAgICAgICBjb25zdCBncm91cGVkQWRzVHlwZSA9IGF3YWl0IGhhY2tMYW5ndWFnZS5nZXRUeXBlKGZpbGVQYXRoLCBmaWxlQ29udGVudHMsICckZ3JvdXBlZF9hZHMnLCA5LCAxMSk7XG4gICAgICAgIGV4cGVjdChncm91cGVkQWRzVHlwZSkudG9CZSgnW3NoYXBlLWxpa2UgYXJyYXldJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldERlZmluaXRpb24oKScsICgpID0+IHtcbiAgICBpdCgnZ2V0cyB0aGUgbG9jYWwgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ0hhY2tFeGFtcGxlMS5waHAnKTtcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICBjb25zdCBsaW5lTnVtYmVyID0gMTU7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IDI2O1xuXG5cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbnMgPSBhd2FpdCBoYWNrTGFuZ3VhZ2UuX2dldERlZmluaXRpb25Mb2NhdGlvbkF0UG9zaXRpb24oXG4gICAgICAgICAgZmlsZVBhdGgsIGZpbGVDb250ZW50cywgbGluZU51bWJlciwgY29sdW1uXG4gICAgICAgICk7XG4gICAgICAgIGV4cGVjdChkZWZpbml0aW9ucykudG9FcXVhbChbe1xuICAgICAgICAgIHBhdGg6IGZpbGVQYXRoLFxuICAgICAgICAgIGxpbmU6IDcsXG4gICAgICAgICAgY29sdW1uOiA2LFxuICAgICAgICAgIGxlbmd0aDogOSxcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnX3BhcnNlU3RyaW5nRm9yRXhwcmVzc2lvbiByZXR1cm5zIGEgcGhwIGV4cHJlc3Npb24gZnJvbSBhIGxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7c2VhcmNofSA9IGhhY2tMYW5ndWFnZS5fcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uKCcgICRhYmNkID0gMTIzOycsIDQpO1xuICAgICAgZXhwZWN0KHNlYXJjaCkudG9FcXVhbCgnJGFiY2QnKTtcbiAgICB9KTtcblxuICAgIGl0KCdfcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uIHJldHVybnMgYW4gWEhQIGV4cHJlc3Npb24gZnJvbSBhIGxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7c2VhcmNofSA9IGhhY2tMYW5ndWFnZS5fcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uKCcgIDx1aTp0ZXN0OmVsZW1lbnQgYXR0cj1cIjEyM1wiPicsIDcpO1xuICAgICAgZXhwZWN0KHNlYXJjaCkudG9FcXVhbCgnOnVpOnRlc3Q6ZWxlbWVudCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ19wYXJzZVN0cmluZ0ZvckV4cHJlc3Npb24gcmV0dXJucyBhbiBwaHAgZXhwcmVzc2lvbiBmcm9tIGEgbGluZSB3aXRoIDwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7c2VhcmNofSA9IGhhY2tMYW5ndWFnZS5fcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uKCcgICRhYmMgPSAkZGVmPCRsb2w7JywgMTEpO1xuICAgICAgZXhwZWN0KHNlYXJjaCkudG9FcXVhbCgnJGRlZicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ19wYXJzZVN0cmluZ0ZvckV4cHJlc3Npb24gcmV0dXJucyBhbiBwaHAgZXhwcmVzc2lvbiBmcm9tIGEgbGluZSB3aXRoIDwgYW5kID4nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7c2VhcmNofSA9IGhhY2tMYW5ndWFnZS5fcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uKCcgICRhYmMgPSAkZGVmIDwkbG9sICYmICR4ID4gJHo7JywgMTEpO1xuICAgICAgZXhwZWN0KHNlYXJjaCkudG9FcXVhbCgnJGRlZicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ19wYXJzZVN0cmluZ0ZvckV4cHJlc3Npb24gcmV0dXJucyBhbiBwaHAgZXhwcmVzc2lvbiBmcm9tIGEgbGluZSB3aXRoIHBocCBjb2RlIGFuZCB4aHAgZXhwcmVzc2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHtzZWFyY2h9ID0gaGFja0xhbmd1YWdlLl9wYXJzZVN0cmluZ0ZvckV4cHJlc3Npb24oJyAgJGFiYyA9ICRnZXQkWGhwKCkgLiA8dWk6YnV0dG9uIGF0dHI9XCJjc1wiPjsnLCAyNSk7XG4gICAgICBleHBlY3Qoc2VhcmNoKS50b0VxdWFsKCc6dWk6YnV0dG9uJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnX3BhcnNlU3RyaW5nRm9yRXhwcmVzc2lvbiByZXR1cm5zIGFuIHBocCBleHByZXNzaW9uIGZyb20gYSBsaW5lIHdpdGggbXVsdGlwbGUgeGhwIGV4cHJlc3Npb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBsaW5lVGV4dCA9ICcgICRhYmMgPSA8dWk6YnV0dG9uIGF0dHI9XCJjc1wiPiAuIDx1aTpyYWRpbz47JztcbiAgICAgIGV4cGVjdChoYWNrTGFuZ3VhZ2UuX3BhcnNlU3RyaW5nRm9yRXhwcmVzc2lvbihsaW5lVGV4dCwgNCkuc2VhcmNoKS50b0JlKCckYWJjJyk7XG4gICAgICBleHBlY3QoaGFja0xhbmd1YWdlLl9wYXJzZVN0cmluZ0ZvckV4cHJlc3Npb24obGluZVRleHQsIDE1KS5zZWFyY2gpLnRvQmUoJzp1aTpidXR0b24nKTtcbiAgICAgIGV4cGVjdChoYWNrTGFuZ3VhZ2UuX3BhcnNlU3RyaW5nRm9yRXhwcmVzc2lvbihsaW5lVGV4dCwgMjMpLnNlYXJjaCkudG9CZSgnYXR0cicpO1xuICAgICAgZXhwZWN0KGhhY2tMYW5ndWFnZS5fcGFyc2VTdHJpbmdGb3JFeHByZXNzaW9uKGxpbmVUZXh0LCAzNikuc2VhcmNoKS50b0JlKCc6dWk6cmFkaW8nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFN5bWJvbE5hbWVBdFBvc2l0aW9uKCknLCAoKSA9PiB7XG4gICAgaXQoJ2dldHMgdGhlIHN5bWJvbCBuYW1lJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnSGFja0V4YW1wbGUxLnBocCcpO1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSAxNTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gMjY7XG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IGF3YWl0IGhhY2tMYW5ndWFnZS5nZXRTeW1ib2xOYW1lQXRQb3NpdGlvbihcbiAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICBmaWxlQ29udGVudHMsXG4gICAgICAgICAgbGluZU51bWJlcixcbiAgICAgICAgICBjb2x1bW5cbiAgICAgICAgKTtcbiAgICAgICAgZXhwZWN0KHN5bWJvbCkudG9FcXVhbCh7XG4gICAgICAgICAgbmFtZTogJ1xcXFxXZWJTdXBwb3J0Rm9ybUNvdW50cnlUeXBlYWhlYWQ6OmdlblBheWxvYWQnLFxuICAgICAgICAgIHR5cGU6IDIsXG4gICAgICAgICAgbGluZTogMTQsXG4gICAgICAgICAgY29sdW1uOiAyNCxcbiAgICAgICAgICBsZW5ndGg6IDEwLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaXNGaW5pc2hlZExvYWRpbmdEZXBlbmRlbmNpZXMoKScsICgpID0+IHtcbiAgICBpdCgndXBkYXRlcyB0aGUgc3RhdHVzIG9mIGlzRmluaXNoZWRMb2FkaW5nRGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ2NhbGxiYWNrJyk7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ0hhY2tFeGFtcGxlMS5waHAnKTtcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICBoYWNrTGFuZ3VhZ2Uub25GaW5pc2hlZExvYWRpbmdEZXBlbmRlbmNpZXMoc3B5KTtcbiAgICAgICAgYXdhaXQgaGFja0xhbmd1YWdlLnVwZGF0ZUZpbGUoZmlsZVBhdGgsIGZpbGVDb250ZW50cyk7XG4gICAgICAgIC8vIEluaXRpYWxseSwgZGVwZW5kZW5jaWVzIGhhdmVuJ3QgYmVlbiBsb2FkZWQgeWV0LlxuICAgICAgICBleHBlY3QoaGFja0xhbmd1YWdlLmlzRmluaXNoZWRMb2FkaW5nRGVwZW5kZW5jaWVzKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICBhd2FpdCBoYWNrTGFuZ3VhZ2UudXBkYXRlRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIC8vIEhhY2tFeGFtcGxlMSByZWZlcnMgdG8gYW5vdGhlciBjbGFzcywgd2hpY2ggSGFjayB0cmllcyB0byBsb2FkLlxuICAgICAgICBleHBlY3QoaGFja0xhbmd1YWdlLmlzRmluaXNoZWRMb2FkaW5nRGVwZW5kZW5jaWVzKCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICBhd2FpdCBoYWNrTGFuZ3VhZ2UudXBkYXRlRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIC8vIFRoZXJlJ3Mgbm8gZnVydGhlciBkZXBlbmRlbmNpZXMgdG8gZmV0Y2guXG4gICAgICAgIGV4cGVjdChoYWNrTGFuZ3VhZ2UuaXNGaW5pc2hlZExvYWRpbmdEZXBlbmRlbmNpZXMoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-hack/spec/HackLanguage-spec.js
