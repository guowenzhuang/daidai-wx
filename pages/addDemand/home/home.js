// pages/addDemand/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    region: [],
    windowHeight: 0,
    screenHeight: 0,
    picker: ['代吃', '代做'],
    style: 0,
    title: '',
    body: '',
    address: '',
    price: 0
  },
  showModal(content){
    wx.showModal({
      content: content,
      showCancel: false,
    })
  },
  saveDemand() {
    var data={
      Title: this.data.title,
      Body: this.data.body,
      Photo: this.data.imgList.join(","),
      Price: this.data.price*100,
      Style: this.data.style,
      Province: this.data.region[0],
      City: this.data.region[1],
      Area: this.data.region[2],
      Address: this.data.address
    }
    if(data.Title == null || data.Title.trim() == ''){
       this.showModal('标题必填')
        return
    }
    if(data.Title.trim().length<=3){
      this.showModal('标题必须大于三个汉字')
      return
    }
    if(data.Body == null || data.Body.trim() == ''){
      this.showModal('内容必填')
       return
   }
    if(data.Body.trim().length<=5){
      this.showModal('内容必须大于五个汉字')
      return
    }
    if(data.Price == 0){
      this.showModal('价格不能为0')
      return
    }
    if(data.Province == null || data.City == null || data.Area == null){
      this.showModal('地址必选')
        return
    }
    if(data.Address == null || data.Address.trim() == ''){
      this.showModal('详细地址必填')
       return
   }
    if(data.Address.trim().length<=5){
      this.showModal('详细地址必须大于五个汉字')
      return
    }



      wx.request({
        url: app.globalData.url+'/demand',
        method: 'POST',
        data,
        success (res) {
          var data=res.data
          if(data.code == 200){
            wx.showModal({
              content: '发布成功',
              showCancel: false,
              complete(){
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }else{
            this.showModal(data.msg)
          }
        }
      })
  },
  bodyInput(e) {
    this.setData({
      body: e.detail.value
    })
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  priceInput(e) {
    this.setData({
      price: e.detail.value
    })
  },
  textareaAInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      style: e.detail.value
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        var tempImages = []
        let promiseArr = [];

        res.tempFilePaths.forEach(element => {

          let promise = new Promise((resolve, reject) => {
            //微信图片上传
            wx.uploadFile({
              url: app.globalData.url+'/oss/upload', //仅为示例，非真实的接口地址
              filePath: element,
              name: 'file',
              success: function (res) {
                const data = JSON.parse(res.data)
                tempImages.push(data.data)
                //可以对res进行处理，然后resolve返回
                resolve(res);
              },
              fail: function (error) {
                reject(error);
              },
              complete: function (res) {},
            })
          });
          promiseArr.push(promise)
        });

        Promise.all(promiseArr).then((result) => {
          //对返回的result数组进行处理
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(tempImages)
            })
          } else {
            this.setData({
              imgList: tempImages
            })
          }
        })


      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight: app.globalData.windowHeight,
      screenHeight: app.globalData.screenHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})