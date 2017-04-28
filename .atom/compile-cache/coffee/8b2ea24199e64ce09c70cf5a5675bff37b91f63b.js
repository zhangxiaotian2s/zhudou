(function() {
  var ToolBarManager;

  ToolBarManager = null;

  module.exports = {
    toolBar: null,
    activate: function() {
      var ToolBarView;
      ToolBarView = require('./tool-bar-view');
      this.toolBar = new ToolBarView();
      return ToolBarManager = require('./tool-bar-manager');
    },
    deactivate: function() {
      return this.toolBar.destroy();
    },
    serialize: function() {},
    config: {
      position: {
        type: 'string',
        "default": 'Top',
        "enum": ['Top', 'Right', 'Bottom', 'Left']
      },
      visible: {
        type: 'boolean',
        "default": true
      },
      iconSize: {
        type: 'string',
        "default": '24px',
        "enum": ['16px', '24px', '32px']
      }
    },
    provideToolBar: function() {
      return (function(_this) {
        return function(group) {
          return new ToolBarManager(group, _this.toolBar);
        };
      })(this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3poYW5neGlhb3RpYW4vLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixJQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsV0FBQSxDQUFBLENBRGYsQ0FBQTthQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLEVBSFQ7SUFBQSxDQUZWO0FBQUEsSUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsRUFEVTtJQUFBLENBUFo7QUFBQSxJQVVBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FWWDtBQUFBLElBWUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsQ0FGTjtPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFPQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsTUFEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsQ0FGTjtPQVJGO0tBYkY7QUFBQSxJQXlCQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTthQUNkLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFBZSxJQUFBLGNBQUEsQ0FBZSxLQUFmLEVBQXNCLEtBQUMsQ0FBQSxPQUF2QixFQUFmO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsRUFEYztJQUFBLENBekJoQjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/zhangxiaotian/.atom/packages/tool-bar/lib/tool-bar.coffee