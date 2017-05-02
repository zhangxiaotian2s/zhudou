// pages/question/index.js

Page({
   data: {
        tabs: ["最新问题", "悬赏问题"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0
    },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
      var that = this;
        wx.getSystemInfo({
            success: function(res) {
              console.log( (res.windowWidth / that.data.tabs.length ))
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length ),
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
              
            }
        });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  tabClick: function (e) {
    console.log( e.currentTarget.offsetLeft)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
})