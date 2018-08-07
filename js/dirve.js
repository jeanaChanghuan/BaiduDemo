/**驾车路线起始点样式**/
	var startIconImg = new BMap.Icon("images/bus_start.png",
					new BMap.Size(28, 32),{
					anchor : new BMap.Size(7, 34)
				});
	/**驾车路线终点样式**/
	var endIconImg=new BMap.Icon("images/bus_end.png",
					new BMap.Size(28, 32),{
					anchor : new BMap.Size(7, 34)
				});
	
	/*******************/
	/**驾车起始点：搜索框关键字提示输入并在地图上画点   与终点共用同一个结果显示块**/
	var acStart = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "startId"
		,"location" : map
	});
	acStart.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		setPlace("start");
	});
	/**驾车终点：搜索框关键字提示输入并在地图上画点    与起始点共用同一个结果显示块**/
	var acEnd = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "endId"
		,"location" : map
	});
    function G(id) {
		return document.getElementById(id);
	}
	var myValue;
	acEnd.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace("end");
	});
	
	/**驾车路线：起始点与终止点定位并绘制在地图上**/
	function setPlace(state){
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp,12);
			var iconImg;
			if(state=="start"){
				iconImg=startIconImg;
				startPoint=pp;
			}else{
				iconImg=endIconImg;
				endPoint=pp;
			}
	      var localMarker = new BMap.Marker(pp,
				        {icon : iconImg});  // 创建标注，为要查询的地方对应的经纬度
			map.addOverlay(localMarker);    //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}
	/**切换起终点:交换起终点的位置和文本框内容**/
	function TransPoint_ClickHandler(){
		var preStartAddr=$("#startId").val();
		var preEndAddr=$("#endId").val();
		$("#startId").val(preEndAddr);
		$("#endId").val(preStartAddr);
		map.clearOverlays(); 
		var startMarker = new BMap.Marker(endPoint,
				        {icon : startIconImg});  // 创建标注，为要查询的地方对应的经纬度
		map.addOverlay(startMarker);    //添加标注
		var endMarker = new BMap.Marker(startPoint,
				        {icon : endIconImg});  // 创建标注，为要查询的地方对应的经纬度
		map.addOverlay(endMarker);    //添加标
		passValue=""; 
		passArr=[];
		$("#passId").val("");
	}
	/**驾车路线经过点：点击地图将点逆解析为地址并显示在文本框中**/
	var geoc = new BMap.Geocoder();   
	var passValue=""; 
	function passAddress_ClickHandler(e){
		var pt = e.point;
		geoc.getLocation(pt, function(rs){
			var addComp = rs.addressComponents;
			var poiAddr=rs.surroundingPois[0].title;
			var passName=addComp.district;
            if(poiAddr != null){
				passName+=poiAddr;
			}else {
				passName+=addComp.street+addComp.streetNumber;
			}
			passArr.push(passName);
			passValue+=passName+";";
			$("#passId").val(passValue);
		}); 
	}
	/**搜索驾车路线：将驾车路线绘制在地图上，并显示路线文本**/
	function Search_drawDriveLine(){
		map.clearOverlays(); 
		var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map,panel: "r-result", enableDragging : true}});
		driving.search(startPoint, endPoint,{waypoints:passArr});//waypoints表示途经点
		passValue=""; 
		passArr=[];
		driving.setSearchCompleteCallback(function(result){
			alert("路线绘制完成");
		});
	}