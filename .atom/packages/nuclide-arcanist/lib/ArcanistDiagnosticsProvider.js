Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _nuclideDiagnosticsProviderBase = require('nuclide-diagnostics-provider-base');

var _nuclideAnalytics = require('nuclide-analytics');

var _nuclideAtomHelpers = require('nuclide-atom-helpers');

var _nuclideCommons = require('nuclide-commons');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

'use babel';
var RequestSerializer = _nuclideCommons.promises.RequestSerializer;

var ArcanistDiagnosticsProvider = (function () {
  function ArcanistDiagnosticsProvider(busySignalProvider) {
    var _this = this;

    _classCallCheck(this, ArcanistDiagnosticsProvider);

    this._busySignalProvider = busySignalProvider;
    this._subscriptions = new _atom.CompositeDisposable();
    var baseOptions = {
      enableForAllGrammars: true,
      shouldRunOnTheFly: false,
      onTextEditorEvent: this._runLintWithBusyMessage.bind(this),
      onNewUpdateSubscriber: this._receivedNewUpdateSubscriber.bind(this)
    };
    this._providerBase = new _nuclideDiagnosticsProviderBase.DiagnosticsProviderBase(baseOptions);
    this._requestSerializer = new RequestSerializer();
    this._subscriptions.add(atom.workspace.onWillDestroyPaneItem(function (_ref) {
      var item = _ref.item;

      if ((0, _nuclideAtomHelpers.isTextEditor)(item)) {
        var path = item.getPath();
        if (!path) {
          return;
        }
        var openBufferCount = _this._getOpenBufferCount(path);
        (0, _assert2['default'])(openBufferCount !== 0, 'The file that is about to be closed should still be open.');
        if (openBufferCount === 1) {
          _this._providerBase.publishMessageInvalidation({ scope: 'file', filePaths: [path] });
        }
      }
    }));
  }

  _createDecoratedClass(ArcanistDiagnosticsProvider, [{
    key: 'dispose',
    value: function dispose() {
      this._subscriptions.dispose();
    }

    /** The returned Promise will resolve when results have been published. */
  }, {
    key: '_runLintWithBusyMessage',
    value: function _runLintWithBusyMessage(textEditor) {
      var _this2 = this;

      var path = textEditor.getPath();
      if (path == null) {
        return Promise.resolve();
      }
      return this._busySignalProvider.reportBusy('Waiting for arc lint results for `' + textEditor.getTitle() + '`', function () {
        return _this2._runLint(textEditor);
      });
    }

    /** Do not call this directly -- call _runLintWithBusyMessage */
  }, {
    key: '_runLint',
    decorators: [(0, _nuclideAnalytics.trackTiming)('nuclide-arcanist:lint')],
    value: _asyncToGenerator(function* (textEditor) {
      var _this3 = this;

      var filePath = textEditor.getPath();
      (0, _assert2['default'])(filePath);

      var _require = require('atom');

      var Range = _require.Range;

      try {
        var _ret = yield* (function* () {
          var result = yield _this3._requestSerializer.run(require('nuclide-arcanist-client').findDiagnostics([textEditor.getPath()]));
          if (result.status === 'outdated') {
            return {
              v: undefined
            };
          }
          var diagnostics = result.result;
          var blackListedLinters = new Set(atom.config.get('nuclide-arcanist.blacklistedLinters'));
          var filteredDiagnostics = diagnostics.filter(function (diagnostic) {
            return !blackListedLinters.has(diagnostic.code);
          });
          var fileDiagnostics = filteredDiagnostics.map(function (diagnostic) {
            var range = new Range([diagnostic.row, diagnostic.col], [diagnostic.row, textEditor.getBuffer().lineLengthForRow(diagnostic.row)]);
            var text = undefined;
            if (Array.isArray(diagnostic.text)) {
              // Sometimes `arc lint` returns an array of strings for the text, rather than just a
              // string :(.
              text = diagnostic.text.join(' ');
            } else {
              text = diagnostic.text;
            }
            return {
              scope: 'file',
              providerName: 'Arc' + (diagnostic.code ? ': ' + diagnostic.code : ''),
              type: diagnostic.type,
              text: text,
              filePath: diagnostic.filePath,
              range: range
            };
          });
          var diagnosticsUpdate = {
            filePathToMessages: new Map([[filePath, fileDiagnostics]])
          };
          _this3._providerBase.publishMessageUpdate(diagnosticsUpdate);
        })();

        if (typeof _ret === 'object') return _ret.v;
      } catch (error) {
        var logger = require('nuclide-logging').getLogger();
        logger.error(error);
        return;
      }
    })
  }, {
    key: '_receivedNewUpdateSubscriber',
    value: function _receivedNewUpdateSubscriber() {
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      if (activeTextEditor) {
        this._runLintWithBusyMessage(activeTextEditor);
      }
    }
  }, {
    key: 'onMessageUpdate',
    value: function onMessageUpdate(callback) {
      return this._providerBase.onMessageUpdate(callback);
    }
  }, {
    key: 'onMessageInvalidation',
    value: function onMessageInvalidation(callback) {
      return this._providerBase.onMessageInvalidation(callback);
    }
  }, {
    key: '_getOpenBufferCount',
    value: function _getOpenBufferCount(path) {
      return atom.workspace.getTextEditors().filter(function (editor) {
        return editor.getPath() === path;
      }).length;
    }
  }]);

  return ArcanistDiagnosticsProvider;
})();

exports.ArcanistDiagnosticsProvider = ArcanistDiagnosticsProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWFyY2FuaXN0L2xpYi9BcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBYWtDLE1BQU07OzhDQUVGLG1DQUFtQzs7Z0NBRS9DLG1CQUFtQjs7a0NBQ2xCLHNCQUFzQjs7OEJBQzFCLGlCQUFpQjs7c0JBQ2xCLFFBQVE7Ozs7QUFwQjlCLFdBQVcsQ0FBQztJQXFCTCxpQkFBaUIsbUJBRmhCLFFBQVEsQ0FFVCxpQkFBaUI7O0lBRVgsMkJBQTJCO0FBTTNCLFdBTkEsMkJBQTJCLENBTTFCLGtCQUEwQyxFQUFFOzs7MEJBTjdDLDJCQUEyQjs7QUFPcEMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO0FBQzlDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFsQmxCLG1CQUFtQixFQWtCd0IsQ0FBQztBQUNoRCxRQUFNLFdBQVcsR0FBRztBQUNsQiwwQkFBb0IsRUFBRSxJQUFJO0FBQzFCLHVCQUFpQixFQUFFLEtBQUs7QUFDeEIsdUJBQWlCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDMUQsMkJBQXFCLEVBQUUsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEUsQ0FBQztBQUNGLFFBQUksQ0FBQyxhQUFhLEdBQUcsb0NBdkJqQix1QkFBdUIsQ0F1QnNCLFdBQVcsQ0FBQyxDQUFDO0FBQzlELFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7QUFDbEQsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFDLElBQU0sRUFBSztVQUFWLElB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QU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMzRDs7O1dBRWtCLDZCQUFDLElBQVksRUFBVTtBQUN4QyxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQ25DLE1BQU0sQ0FBQyxVQUFBLE1BQU07ZUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSTtPQUFBLENBQUMsQ0FDM0MsTUFBTSxDQUFDO0tBQ1g7OztTQXpIVSwyQkFBMkIiLCJmaWxlIjoiL3Zhci9mb2xkZXJzL3hmL3JzcGg0X2M1NzMxNXJzNTd4eHNkc2tyeG52MzZ0MC9UL3RtcHBmbDUybnB1Ymxpc2hfcGFja2FnZXMvYXBtL251Y2xpZGUtYXJjYW5pc3QvbGliL0FyY2FuaXN0RGlhZ25vc3RpY3NQcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtCdXN5U2lnbmFsUHJvdmlkZXJCYXNlfSBmcm9tICdudWNsaWRlLWJ1c3ktc2lnbmFsLXByb3ZpZGVyLWJhc2UnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQge0RpYWdub3N0aWNzUHJvdmlkZXJCYXNlfSBmcm9tICdudWNsaWRlLWRpYWdub3N0aWNzLXByb3ZpZGVyLWJhc2UnO1xuXG5pbXBvcnQge3RyYWNrVGltaW5nfSBmcm9tICdudWNsaWRlLWFuYWx5dGljcyc7XG5pbXBvcnQge2lzVGV4dEVkaXRvcn0gZnJvbSAnbnVjbGlkZS1hdG9tLWhlbHBlcnMnO1xuaW1wb3J0IHtwcm9taXNlc30gZnJvbSAnbnVjbGlkZS1jb21tb25zJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcbmNvbnN0IHtSZXF1ZXN0U2VyaWFsaXplcn0gPSBwcm9taXNlcztcblxuZXhwb3J0IGNsYXNzIEFyY2FuaXN0RGlhZ25vc3RpY3NQcm92aWRlciB7XG4gIF9wcm92aWRlckJhc2U6IERpYWdub3N0aWNzUHJvdmlkZXJCYXNlO1xuICBfcmVxdWVzdFNlcmlhbGl6ZXI6IFJlcXVlc3RTZXJpYWxpemVyO1xuICBfc3Vic2NyaXB0aW9uczogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBfYnVzeVNpZ25hbFByb3ZpZGVyOiBCdXN5U2lnbmFsUHJvdmlkZXJCYXNlO1xuXG4gIGNvbnN0cnVjdG9yKGJ1c3lTaWduYWxQcm92aWRlcjogQnVzeVNpZ25hbFByb3ZpZGVyQmFzZSkge1xuICAgIHRoaXMuX2J1c3lTaWduYWxQcm92aWRlciA9IGJ1c3lTaWduYWxQcm92aWRlcjtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBjb25zdCBiYXNlT3B0aW9ucyA9IHtcbiAgICAgIGVuYWJsZUZvckFsbEdyYW1tYXJzOiB0cnVlLFxuICAgICAgc2hvdWxkUnVuT25UaGVGbHk6IGZhbHNlLFxuICAgICAgb25UZXh0RWRpdG9yRXZlbnQ6IHRoaXMuX3J1bkxpbnRXaXRoQnVzeU1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgIG9uTmV3VXBkYXRlU3Vic2NyaWJlcjogdGhpcy5fcmVjZWl2ZWROZXdVcGRhdGVTdWJzY3JpYmVyLmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0aGlzLl9wcm92aWRlckJhc2UgPSBuZXcgRGlhZ25vc3RpY3NQcm92aWRlckJhc2UoYmFzZU9wdGlvbnMpO1xuICAgIHRoaXMuX3JlcXVlc3RTZXJpYWxpemVyID0gbmV3IFJlcXVlc3RTZXJpYWxpemVyKCk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25XaWxsRGVzdHJveVBhbmVJdGVtKCh7aXRlbX0pID0+IHtcbiAgICAgIGlmIChpc1RleHRFZGl0b3IoaXRlbSkpIHtcbiAgICAgICAgY29uc3QgcGF0aDogP3N0cmluZyA9IGl0ZW0uZ2V0UGF0aCgpO1xuICAgICAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3BlbkJ1ZmZlckNvdW50ID0gdGhpcy5fZ2V0T3BlbkJ1ZmZlckNvdW50KHBhdGgpO1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgb3BlbkJ1ZmZlckNvdW50ICE9PSAwLFxuICAgICAgICAgICdUaGUgZmlsZSB0aGF0IGlzIGFib3V0IHRvIGJlIGNsb3NlZCBzaG91bGQgc3RpbGwgYmUgb3Blbi4nXG4gICAgICAgICk7XG4gICAgICAgIGlmIChvcGVuQnVmZmVyQ291bnQgPT09IDEpIHtcbiAgICAgICAgICB0aGlzLl9wcm92aWRlckJhc2UucHVibGlzaE1lc3NhZ2VJbnZhbGlkYXRpb24oe3Njb3BlOiAnZmlsZScsIGZpbGVQYXRoczogW3BhdGhdfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqIFRoZSByZXR1cm5lZCBQcm9taXNlIHdpbGwgcmVzb2x2ZSB3aGVuIHJlc3VsdHMgaGF2ZSBiZWVuIHB1Ymxpc2hlZC4gKi9cbiAgX3J1bkxpbnRXaXRoQnVzeU1lc3NhZ2UodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICBpZiAocGF0aCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9idXN5U2lnbmFsUHJvdmlkZXIucmVwb3J0QnVzeShcbiAgICAgIGBXYWl0aW5nIGZvciBhcmMgbGludCByZXN1bHRzIGZvciBcXGAke3RleHRFZGl0b3IuZ2V0VGl0bGUoKX1cXGBgLFxuICAgICAgKCkgPT4gdGhpcy5fcnVuTGludCh0ZXh0RWRpdG9yKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIERvIG5vdCBjYWxsIHRoaXMgZGlyZWN0bHkgLS0gY2FsbCBfcnVuTGludFdpdGhCdXN5TWVzc2FnZSAqL1xuICBAdHJhY2tUaW1pbmcoJ251Y2xpZGUtYXJjYW5pc3Q6bGludCcpXG4gIGFzeW5jIF9ydW5MaW50KHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGludmFyaWFudChmaWxlUGF0aCk7XG4gICAgY29uc3Qge1JhbmdlfSA9IHJlcXVpcmUoJ2F0b20nKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5fcmVxdWVzdFNlcmlhbGl6ZXIucnVuKFxuICAgICAgICByZXF1aXJlKCdudWNsaWRlLWFyY2FuaXN0LWNsaWVudCcpLmZpbmREaWFnbm9zdGljcyhbdGV4dEVkaXRvci5nZXRQYXRoKCldKVxuICAgICAgKTtcbiAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnb3V0ZGF0ZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRpYWdub3N0aWNzID0gcmVzdWx0LnJlc3VsdDtcbiAgICAgIGNvbnN0IGJsYWNrTGlzdGVkTGludGVycyA9IG5ldyBTZXQoYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWFyY2FuaXN0LmJsYWNrbGlzdGVkTGludGVycycpKTtcbiAgICAgIGNvbnN0IGZpbHRlcmVkRGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcy5maWx0ZXIoZGlhZ25vc3RpYyA9PiB7XG4gICAgICAgIHJldHVybiAhYmxhY2tMaXN0ZWRMaW50ZXJzLmhhcyhkaWFnbm9zdGljLmNvZGUpO1xuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWxlRGlhZ25vc3RpY3MgPSBmaWx0ZXJlZERpYWdub3N0aWNzLm1hcChkaWFnbm9zdGljID0+IHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBuZXcgUmFuZ2UoXG4gICAgICAgICAgW2RpYWdub3N0aWMucm93LCBkaWFnbm9zdGljLmNvbF0sXG4gICAgICAgICAgW2RpYWdub3N0aWMucm93LCB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3coZGlhZ25vc3RpYy5yb3cpXVxuICAgICAgICApO1xuICAgICAgICBsZXQgdGV4dDtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGlhZ25vc3RpYy50ZXh0KSkge1xuICAgICAgICAgIC8vIFNvbWV0aW1lcyBgYXJjIGxpbnRgIHJldHVybnMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBmb3IgdGhlIHRleHQsIHJhdGhlciB0aGFuIGp1c3QgYVxuICAgICAgICAgIC8vIHN0cmluZyA6KC5cbiAgICAgICAgICB0ZXh0ID0gZGlhZ25vc3RpYy50ZXh0LmpvaW4oJyAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0ID0gZGlhZ25vc3RpYy50ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgICBwcm92aWRlck5hbWU6ICdBcmMnICsgKGRpYWdub3N0aWMuY29kZSA/IGA6ICR7ZGlhZ25vc3RpYy5jb2RlfWAgOiAnJyksXG4gICAgICAgICAgdHlwZTogZGlhZ25vc3RpYy50eXBlLFxuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgZmlsZVBhdGg6IGRpYWdub3N0aWMuZmlsZVBhdGgsXG4gICAgICAgICAgcmFuZ2UsXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRpYWdub3N0aWNzVXBkYXRlID0ge1xuICAgICAgICBmaWxlUGF0aFRvTWVzc2FnZXM6IG5ldyBNYXAoW1tmaWxlUGF0aCwgZmlsZURpYWdub3N0aWNzXV0pLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX3Byb3ZpZGVyQmFzZS5wdWJsaXNoTWVzc2FnZVVwZGF0ZShkaWFnbm9zdGljc1VwZGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnN0IGxvZ2dlciA9IHJlcXVpcmUoJ251Y2xpZGUtbG9nZ2luZycpLmdldExvZ2dlcigpO1xuICAgICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBfcmVjZWl2ZWROZXdVcGRhdGVTdWJzY3JpYmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGl2ZVRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKGFjdGl2ZVRleHRFZGl0b3IpIHtcbiAgICAgIHRoaXMuX3J1bkxpbnRXaXRoQnVzeU1lc3NhZ2UoYWN0aXZlVGV4dEVkaXRvcik7XG4gICAgfVxuICB9XG5cbiAgb25NZXNzYWdlVXBkYXRlKGNhbGxiYWNrOiBNZXNzYWdlVXBkYXRlQ2FsbGJhY2spOiBhdG9tJERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLl9wcm92aWRlckJhc2Uub25NZXNzYWdlVXBkYXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uTWVzc2FnZUludmFsaWRhdGlvbihjYWxsYmFjazogTWVzc2FnZUludmFsaWRhdGlvbkNhbGxiYWNrKTogYXRvbSREaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJCYXNlLm9uTWVzc2FnZUludmFsaWRhdGlvbihjYWxsYmFjayk7XG4gIH1cblxuICBfZ2V0T3BlbkJ1ZmZlckNvdW50KHBhdGg6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIC5maWx0ZXIoZWRpdG9yID0+IGVkaXRvci5nZXRQYXRoKCkgPT09IHBhdGgpXG4gICAgICAubGVuZ3RoO1xuICB9XG59XG4iXX0=
