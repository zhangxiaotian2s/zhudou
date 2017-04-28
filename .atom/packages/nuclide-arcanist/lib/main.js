function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

'use babel';

var subscriptions = null;

var busySignalProvider = null;

function getBusySignalProvider() {
  if (busySignalProvider == null) {
    var _require = require('nuclide-busy-signal-provider-base');

    var BusySignalProviderBase = _require.BusySignalProviderBase;

    busySignalProvider = new BusySignalProviderBase();
  }
  return busySignalProvider;
}

module.exports = {
  // $FlowIssue https://github.com/facebook/flow/issues/620
  config: require('../package.json').nuclide.config,

  activate: function activate() {
    if (subscriptions) {
      return;
    }

    var _require2 = require('nuclide-atom-helpers');

    var registerGrammarForFileExtension = _require2.registerGrammarForFileExtension;

    subscriptions = new _atom.CompositeDisposable();
    subscriptions.add(registerGrammarForFileExtension('source.json', '.arcconfig'));
  },

  dactivate: function dactivate() {
    if (subscriptions) {
      subscriptions.dispose();
      subscriptions = null;
    }
    busySignalProvider = null;
  },

  provideBusySignal: function provideBusySignal() {
    return getBusySignalProvider();
  },

  provideDiagnostics: function provideDiagnostics() {
    var _require3 = require('./ArcanistDiagnosticsProvider');

    var ArcanistDiagnosticsProvider = _require3.ArcanistDiagnosticsProvider;

    var provider = new ArcanistDiagnosticsProvider(getBusySignalProvider());
    (0, _assert2['default'])(subscriptions != null);
    subscriptions.add(provider);
    return provider;
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWFyY2FuaXN0L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBZWtDLE1BQU07O3NCQUNsQixRQUFROzs7O0FBaEI5QixXQUFXLENBQUM7O0FBa0JaLElBQUksYUFBbUMsR0FBRyxJQUFJLENBQUM7O0FBRS9DLElBQUksa0JBQTRDLEdBQUcsSUFBSSxDQUFDOztBQUV4RCxTQUFTLHFCQUFxQixHQUE0QjtBQUN4RCxNQUFJLGtCQUFrQixJQUFJLElBQUksRUFBRTttQkFDRyxPQUFPLENBQUMsbUNBQW1DLENBQUM7O1FBQXRFLHNCQUFzQixZQUF0QixzQkFBc0I7O0FBQzdCLHNCQUFrQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztHQUNuRDtBQUNELFNBQU8sa0JBQWtCLENBQUM7Q0FDM0I7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixRQUFNLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU07O0FBRWpELFVBQVEsRUFBQSxvQkFBUztBQUNmLFFBQUksYUFBYSxFQUFFO0FBQ2pCLGFBQU87S0FDUjs7b0JBRXlDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7UUFBbEUsK0JBQStCLGFBQS9CLCtCQUErQjs7QUFDdEMsaUJBQWEsR0FBRyxVQXpCWixtQkFBbUIsRUF5QmtCLENBQUM7QUFDMUMsaUJBQWEsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7R0FDakY7O0FBRUQsV0FBUyxFQUFBLHFCQUFTO0FBQ2hCLFFBQUksYUFBYSxFQUFFO0FBQ2pCLG1CQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsbUJBQWEsR0FBRyxJQUFJLENBQUM7S0FDdEI7QUFDRCxzQkFBa0IsR0FBRyxJQUFJLENBQUM7R0FDM0I7O0FBRUQsbUJBQWlCLEVBQUEsNkJBQXVCO0FBQ3RDLFdBQU8scUJBQXFCLEVBQUUsQ0FBQztHQUNoQzs7QUFFRCxvQkFBa0IsRUFBQSw4QkFBRztvQkFDbUIsT0FBTyxDQUFDLCtCQUErQixDQUFDOztRQUF2RSwyQkFBMkIsYUFBM0IsMkJBQTJCOztBQUNsQyxRQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUEyQixDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztBQUMxRSw2QkFBVSxhQUFhLElBQUksSUFBSSxDQUFDLENBQUM7QUFDakMsaUJBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsV0FBTyxRQUFRLENBQUM7R0FDakI7Q0FDRixDQUFDIiwiZmlsZSI6Ii92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWFyY2FuaXN0L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICBCdXN5U2lnbmFsUHJvdmlkZXJCYXNlIGFzIEJ1c3lTaWduYWxQcm92aWRlckJhc2VULFxufSBmcm9tICdudWNsaWRlLWJ1c3ktc2lnbmFsLXByb3ZpZGVyLWJhc2UnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdhc3NlcnQnO1xuXG5sZXQgc3Vic2NyaXB0aW9uczogP0NvbXBvc2l0ZURpc3Bvc2FibGUgPSBudWxsO1xuXG5sZXQgYnVzeVNpZ25hbFByb3ZpZGVyOiA/QnVzeVNpZ25hbFByb3ZpZGVyQmFzZVQgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRCdXN5U2lnbmFsUHJvdmlkZXIoKTogQnVzeVNpZ25hbFByb3ZpZGVyQmFzZVQge1xuICBpZiAoYnVzeVNpZ25hbFByb3ZpZGVyID09IG51bGwpIHtcbiAgICBjb25zdCB7QnVzeVNpZ25hbFByb3ZpZGVyQmFzZX0gPSByZXF1aXJlKCdudWNsaWRlLWJ1c3ktc2lnbmFsLXByb3ZpZGVyLWJhc2UnKTtcbiAgICBidXN5U2lnbmFsUHJvdmlkZXIgPSBuZXcgQnVzeVNpZ25hbFByb3ZpZGVyQmFzZSgpO1xuICB9XG4gIHJldHVybiBidXN5U2lnbmFsUHJvdmlkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyAkRmxvd0lzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy82MjBcbiAgY29uZmlnOiByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS5udWNsaWRlLmNvbmZpZyxcblxuICBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtyZWdpc3RlckdyYW1tYXJGb3JGaWxlRXh0ZW5zaW9ufSA9IHJlcXVpcmUoJ251Y2xpZGUtYXRvbS1oZWxwZXJzJyk7XG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgc3Vic2NyaXB0aW9ucy5hZGQocmVnaXN0ZXJHcmFtbWFyRm9yRmlsZUV4dGVuc2lvbignc291cmNlLmpzb24nLCAnLmFyY2NvbmZpZycpKTtcbiAgfSxcblxuICBkYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIGJ1c3lTaWduYWxQcm92aWRlciA9IG51bGw7XG4gIH0sXG5cbiAgcHJvdmlkZUJ1c3lTaWduYWwoKTogQnVzeVNpZ25hbFByb3ZpZGVyIHtcbiAgICByZXR1cm4gZ2V0QnVzeVNpZ25hbFByb3ZpZGVyKCk7XG4gIH0sXG5cbiAgcHJvdmlkZURpYWdub3N0aWNzKCkge1xuICAgIGNvbnN0IHtBcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXJ9ID0gcmVxdWlyZSgnLi9BcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXInKTtcbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBBcmNhbmlzdERpYWdub3N0aWNzUHJvdmlkZXIoZ2V0QnVzeVNpZ25hbFByb3ZpZGVyKCkpO1xuICAgIGludmFyaWFudChzdWJzY3JpcHRpb25zICE9IG51bGwpO1xuICAgIHN1YnNjcmlwdGlvbnMuYWRkKHByb3ZpZGVyKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH0sXG59O1xuIl19
