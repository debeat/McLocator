/*
	addLocator() will add a responsive Google Map locator map.
	It expects an object detailing two mandatory and several optional attributes.
	
	It requires a "title", which will display the label text for the locator map.
	It requires at least one location to mark, passed in "points". Points may either be a single location or an array of locations. Each place to be marked should have a "lat" and a "lng" coordinate.
	
	Optionally, map options, map styles and zoom and center may be passed to the function.
	
	A default zoom, style and option set will be defined as fallback; without a center, the map will default to centering on the first given marker.
*/

/* ARRAY TO HOLD ALL MAPS TO BE ADDED (MAP DRAWING IS DELEGATED UNTIL AFTER PAGE LOAD) */
var locatorMaps=[];

/* CONDITIONALLY LOAD GOOGLE'S API */
if(!window.google || !google.maps){
	if(!gAPIkey){
		var gAPIkey=" *** INSERT YOUR GOOGLE MAPS API KEY HERE *** ";
	}
	var jq = document.createElement("script");
	jq.type = "text/javascript";
	jq.src = "https://maps.googleapis.com/maps/api/js?key="+gAPIkey+"&callback=initMaps";
	document.getElementsByTagName('head')[0].appendChild(jq);
} else {
	google.maps.event.addDomListener(window, 'load', drawLocatorMaps);
}

/* LOAD THE CUSTOM CSS FOR THE CONTAINER DIV */
var locCSS=document.createElement("style");
locCSS.innerHTML='.locmapHolder{ position:relative; margin:5% auto; width:100%; height:0; padding-bottom:65%; } .locmapHolder>div{ position:absolute; top:0; left:0; width:100%; height:100%; }.locmapHolder:before{ content:" "; position:absolute; top:-1px; left:0; width:100%; z-index:10; border-top:3px solid #777; pointer-events:none; } .locmapHolder[title]:before{ content:attr(title); position:absolute; top:-1px; left:0; width:97%; z-index:10; padding:.33333em 1.5%; font-weight:bold; font-size:2em; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background:rgba(255,255,255,.6666); border-top:3px solid #777; border-bottom:1px solid rgba(255,255,255,.9); pointer-events:none; } .locmapHolder:after{ content:" "; position:absolute; bottom:0; left:0; width:100%; height:0; border-bottom:2px solid #777; pointer-events:none; z-index:10; }';
document.getElementsByTagName("head")[0].appendChild(locCSS);

/* RECEIVE THE MAP DATA, NOTE OUR LOCATION IF WE DON'T HAVE A CONTAINER */
function addLocator(newMap){
	if(!newMap.container){
		var js=document.getElementsByTagName("script")[document.getElementsByTagName("script").length-1];
		newMap.container=js.parentNode.insertBefore(document.createElement("div"),js.nextSibling);
		newMap.container.className="locmapHolder";
	}
	locatorMaps.push(newMap);
}

/* CLEAN UP THE MAP DATA, DROPPING IN DEFAULTS WHERE WE DON'T HAVE OVERRIDES */
function prepMap(newMap){
	if(!newMap.points){
		if(newMap.lat && newMap.lng){
			newMap.points=[{lat:newMap.lat,lng:newMap.lng,name:newMap.title}];
		} else if(newMap.center){
			newMap.points=center;
			newMap.points.name=newMap.title;
		}
	} else if(!Object.prototype.toString.call(newMap.points) == Object.prototype.toString.call(["Array"])){
		newMap.points=[newMap.points];
	}
	if(!newMap.options){
		newMap.options=defaultLocOptions;
	}
	if(newMap.styles){
		newMap.options.styles=newMap.styles;
	} else if(!newMap.options.styles){
		newMap.options.styles=defaultLocStyles;
	}
	if(newMap.zoom){
		newMap.options.zoom=newMap.zoom;
	} else if(!newMap.options.zoom){
		newMap.options.zoom=7;
	}
	if(newMap.center){
		newMap.options.center=new google.maps.LatLng(newMap.center.lat,newMap.center.lng);
	} else if(!newMap.options.center){
		newMap.options.center=new google.maps.LatLng(newMap.points[0].lat,newMap.points[0].lng);
	} else if(newMap.lat && newMap.lng){
		newMap.options.center=new google.maps.LatLng(newMap.lat,newMap.lng);
	}
	if(Object.prototype.toString.call(newMap.container) == Object.prototype.toString.call("String")){
		newMap.container=document.getElementById(newMap.container);
		if(newMap.container){
			newMap.container.className="locmapHolder";
		} else {
			console.log("ADDLOCATOR.JS: TARGET NODE ID NOT FOUND");
		}
	}
	if(!newMap.container.className){
		newMap.container.className="locmapHolder";
	} else {
		if(newMap.container.className.indexOf("locmapHolder")<0){
			newMap.container.className=newMap.container.className+" locmapHolder";
		}
	}
	if(newMap.title){
		newMap.container.setAttribute("title",newMap.title);
	}
	delete newMap.styles;
	delete newMap.zoom;
	delete newMap.center;
}

function initMaps(){
		/* INSTANTIATE DEFAULT SETTINGS FOR MAPS */
		window.defaultLocStyles=[ {stylers:[{"visibility":"off"},{"saturation":"-10"},{"lightness":"-15"},{"gamma":".5"}]}, {"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]}, {"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"-99"},{"gamma":"8.5"}]}, {"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"40"},{"gamma":".85"}]},  {"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"lightness":"60"},{"weight":"2.5"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":"2"}]}, {"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":"60"},{"gamma":"10"}]}, {"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"on"},{"saturation":"-15"},{"lightness":"50"}]}, {"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"on"}]}, {"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"simplified"},{"saturation":"-50"},{"lightness":"50"}]}, {"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-5"}]}, {"featureType":"road","elementType":"labels","stylers":[{"lightness":"10"},{"saturation":"-66.666"},{"gamma":"2"}]}, {"featureType":"water","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#7fc6e4"},{"saturation":"-75"},{"lightness":"60"}]} ];
		window.defaultLocOptions={ scrollwheel:false, zoomControl:true, zoomControlOptions:{ style:google.maps.ZoomControlStyle.SMALL, position:google.maps.ControlPosition.RIGHT_BOTTOM }, draggable:false, panControl:false, scaleControl:false, mapTypeControl:false, streetViewControl:false, overviewMapControl:true, overviewMapControlOptions:{ opened:true }, mapTypeId: google.maps.MapTypeId.TERRAIN };
		
		if(document.readyState == "complete"){
			drawLocatorMaps();
		} else {
			google.maps.event.addDomListener(window, 'load', drawLocatorMaps);
		}
}
/* AFTER PAGE LOAD, INJECT MAPS */
function drawLocatorMaps(){
	var tmpMaps;
	var tmpMark;
	for(i=0,n=locatorMaps.length;i<n;i++){
		prepMap(locatorMaps[i]);
		tmpMaps=new google.maps.Map(locatorMaps[i].container,locatorMaps[i].options);
		for(j=0,m=locatorMaps[i].points.length;j<m;j++){
			if(!locatorMaps[i].points[j].name){
				locatorMaps[i].points[j].name=locatorMaps.title;
			}
			if(!locatorMaps[i].points[j].icon){
				locatorMaps[i].points[j].icon="http://www.mcclatchydc.com/static/images/map-icons/star-3.png";
			}
			tmpMark=new google.maps.Marker({
				position:new google.maps.LatLng(locatorMaps[i].points[j].lat,locatorMaps[i].points[j].lng),
				map:tmpMaps,
				title:locatorMaps[i].points[j].name,
				icon:locatorMaps[i].points[j].icon
			});
			locatorMaps[i].points[j]=tmpMark;
		}
		delete locatorMaps[i].options;
		locatorMaps[i].map=tmpMaps;
	}
	console.log(locatorMaps);
}