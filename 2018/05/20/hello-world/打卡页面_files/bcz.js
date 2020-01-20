// 仅支持IE9+，特殊兼容需求请自行补充兼容代码
// 由于仿jQ 太过。。。所以用起来应该会比较方便
// 传统的$() 选择器请直接用js 原生的 querySelectorAll 和 querySelector

!(function(doc,win){
  "use strict";

  // 定义主配置
  var Bcz=function (){
    this.statOptions={
      opname : "",
      host : "http://www.baicizhan.com",
      onBottom: false,
      onLoad: true
    };
  };

  // cookie 操作集合
  // bcz.cookie('testcookie')              // 获取cookie
  // bcz.cookie('testcookie',1024,365)     // 设置cookie，第二个参数为value，第三个参数是过期时间（单位：天，空参数则默认30天）
  // bcz.cookie('testcookie',1,-1)         // 删除cookie（关键在于第三个参数为-1）
  Bcz.prototype.cookie=function(name,value,Days){
    if(value){        // 如果有值执行设置操作
      Days = Days || 30;
      var exdate=new Date();
      exdate.setTime(exdate.getTime() + Days * 24 * 60 * 60 * 1000);
      doc.cookie = name + '=' + escape(value) + ';expires=' + exdate.toGMTString();
      return ;
    }else{        // 否则执行获取操作
      var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
          arr = doc.cookie.match(reg);
      return arr ? unescape(arr[2]) : arr;
    }
  };

  // ajax 封装模块
  // 仿jq格式调用，若还需要其他姿势（如JS跨域，jsonp等）请自行扩展
  // bcz.ajax({
  //   url: "http://xxx.com/api/test",
  //   type: "get",
  //   data: {
  //     page: 1
  //   },
  //   ContentType: 'application/json',
  //   success:function(data){
  //     console.log(data)
  //   }
  // })
  Bcz.prototype.ajax=function(ajaxdata){
    var sendData='',
        ContentType=ajaxdata.ContentType || 'application/x-www-form-urlencoded',
        xmlhttp=new XMLHttpRequest();
    for(var x in ajaxdata.data){
      sendData+='&'+x+'='+ajaxdata.data[x];
    }
    sendData=sendData.substr(1);

    // 状态交互
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200 && ajaxdata.hasOwnProperty('success')){
        var res=null;
        try{
          res=JSON.parse(xmlhttp.responseText);
        }catch(err){
          res=xmlhttp.responseText;
        }
        ajaxdata.success(res);
      }
    };

    // 发送数据
    switch( ajaxdata.type.toLowerCase() ){
      case 'get':
        var tmpUrl=ajaxdata.url+(sendData && '?'+sendData);
        xmlhttp.open(ajaxdata.type,tmpUrl,true);
        xmlhttp.send(null);
        break;
      case 'post':
        xmlhttp.open(ajaxdata.type,ajaxdata.url,true);
        xmlhttp.setRequestHeader('Content-Type', ContentType);
        xmlhttp.send(sendData);
        break;
      default:
        xmlhttp.open(ajaxdata.type,ajaxdata.url,true);
        xmlhttp.send(null);
    }
  };

  // 获取查询参数解析器，例如：传 "?page=12&list=20" 返回对象 {page:'12',list:'20'}
  Bcz.prototype.getQueryParams=function(qs) {
    if(qs.length<1) return;
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
  };

  // 根据URL判断当前页面所在的位置，如ios设备内，或者微信朋友圈
  Bcz.prototype.getPageFrom=function() {
    var search = this.getQueryParams(window.location.search);
    if (!search){
      return "";
    }
    if (search.inbczapp == "ios" || search.inbczapp == "android") {
      return "inapp";
    } else if (search.from == "singlemessage" || search.from == "groupmessage") {
      return "wxfriends";
    } else if (search.from == "timeline") {
      return "wxtimeline";
    } else {
      return "";
    }
  };

  // 百词斩统计init
  // bcz.stat({
  //   opname : "bczhomepage",             // 页面名称
  //   host : "http://www.baicizhan.com",  // 接收统计的主域
  //   onBottom: false,                    // 是否开启页面滚动到底部后发送统计
  //   onLoad: true                        // 是否开启加载页面后就立即发送统计
  // })
  Bcz.prototype.stat=function(options) {
    var self = this,
        // var keyname = self.getPageFrom().length > 0 ? self.getPageFrom() : "";
        keyname=self.getPageFrom();

    // 自定义选项赋值
    for(var k in options){
      self.statOptions[k]=options[k];
    }
    
    // 页面加载就发送统计
    if (self.statOptions.onLoad === true) {
      statSend("", "pv");
      statSend("uv", "uv");
      
      // 有参数的统计
      if (keyname.length > 0) {
        statSend(keyname, "pv");
        statSend("uv" + keyname, "uv");
      }
    }
    
    // 滚动到页面底部后发送统计
    if (self.statOptions.onBottom === true) {
      window.addEventListener("scroll",scrollFn);
    }

    // 滚动监听fn
    function scrollFn(){
      var a=(doc.documentElement.scrollTop || doc.body.scrollTop)+(doc.documentElement.clientHeight || doc.body.clientHeight),
          c=(doc.documentElement.scrollHeight || doc.body.scrollHeight);
      if(a == c){
        statOn("onfooter", false);
        window.removeEventListener("scroll",scrollFn);
      }
    }

    // 给所有带有 data-stat-btnname 属性的标签绑定点击事件，点击后发送统计
    var btnames=doc.querySelectorAll("*[data-stat-btnname]");
    for(var i=0;i<btnames.length;i++){
      // 更棒的的写法
      // btnames[i].dataset("stat-btnname");
      btnames[i].addEventListener("click",statOn.bind(btnames[i], btnames[i].getAttribute("data-stat-btnname", true)));
    }

    // 绑定不同事件发送的不同代码
    function statOn(btname,single) {
      if (single) {
        statSend(btname + "_pv", "pv");
      } else {
        statSend(btname + "_pv", "pv");
        statSend(btname + "_uv", "uv");
        
        if (keyname.length > 0) {
          statSend(btname + "_pv_" + keyname, "pv");
          statSend(btname + "_uv_" + keyname, "uv");
        }
      }
    }

    // 发送统计数据
    function statSend(btname, type) {
      type = type || "pv";
      if (type === "uv" && self.cookie(self.statOptions.opname + btname) === null ) {
        self.cookie(self.statOptions.opname + btname, 1024);
      } else if (type === "uv" && self.cookie(self.statOptions.opname + btname)) {
        return;
      }

      var ua = navigator.userAgent.toLowerCase(),
          device_type = "other";
      if(/iphone|ipod|ipad/.test(ua)) device_type = "ios";
      if(/android/.test(ua)) device_type = "android";

      var statUrl = self.statOptions.host + "/api/promote_click?opname=" + self.statOptions.opname + "&device=" + device_type;
      if (typeof btname == "string" && btname.length > 0) {
        statUrl += "&btname=" + btname;
      }
      self.ajax({
        url:statUrl,
        type:'get',
        success: function(data){
          console.log(data);
        }
      });
    }
  };

  // 封装返回bcz对象
  win.bcz = new Bcz();
})(document, window);