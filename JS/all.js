// global variables
var data;
var map;
// call function and eventlistener
getData();
document.querySelector('select').addEventListener("change", printList);


// 建立地圖
function initMap() {
    //設定中心點座標
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.170073, lng: 120.685666 },
        zoom: 11
    });
    // Hightlight 地圖範圍
    var polygonMask = new google.maps.Polygon({
        map: map,
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#CACACA',
        fillOpacity: 0.7,
        paths: [[new google.maps.LatLng(21.226082, 118.017032),
        new google.maps.LatLng(27.236681, 118.017032),
        new google.maps.LatLng(27.236681, 123.784854),
        new google.maps.LatLng(21.226082, 123.784854),
        new google.maps.LatLng(21.226082, 118.017032)],
        [new google.maps.LatLng(24.216910, 120.460968),
        new google.maps.LatLng(24.185595, 120.508347),
        new google.maps.LatLng(24.139548, 120.524998),
        new google.maps.LatLng(24.114011, 120.555296),
        new google.maps.LatLng(24.103513, 120.610313),
        new google.maps.LatLng(24.033452, 120.628939),
        new google.maps.LatLng(24.014715, 120.675330),
        new google.maps.LatLng(23.998485, 120.740948),
        new google.maps.LatLng(24.028748, 120.787039),
        new google.maps.LatLng(24.065196, 120.808711),
        new google.maps.LatLng(24.073385, 120.826414),
        new google.maps.LatLng(24.160537, 121.048737),
        new google.maps.LatLng(24.220667, 121.170959),
        new google.maps.LatLng(24.224424, 121.245117),
        new google.maps.LatLng(24.379623, 121.371460),
        new google.maps.LatLng(24.389944, 121.328657),
        new google.maps.LatLng(24.435277, 121.318814),
        new google.maps.LatLng(24.423089, 121.248545),
        new google.maps.LatLng(24.360711, 121.150239),
        new google.maps.LatLng(24.332599, 121.120170),
        new google.maps.LatLng(24.327007, 121.102460),
        new google.maps.LatLng(24.305812, 121.046441),
        new google.maps.LatLng(24.319588, 121.018052),
        new google.maps.LatLng(24.347136, 120.972261),
        new google.maps.LatLng(24.342170, 120.919132),
        new google.maps.LatLng(24.312216, 120.911751),
        new google.maps.LatLng(24.287340, 120.842056),
        new google.maps.LatLng(24.352727, 120.713654),
        new google.maps.LatLng(24.403386, 120.588684),
        new google.maps.LatLng(24.311434, 120.525513),
        new google.maps.LatLng(24.216910, 120.460968)]]
    });
}
// funtions 
// get data by Ajax and store it
function getData(e) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'JSON/data.json', true);
    xhr.send(null);
    xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    data = data.result.records.filter(function (item, index, array) {
            return item.CityName === "臺中市";
            });
    }
}


function printList(e) {
    const selectedData = data.filter(function (item, index, array) {
        return item.RegionName === e.target.value;
    });
    console.log(selectedData[0].RegionName);
    let str = `<h3 class="text-light">${e.target.value}</h3>
                    <ul class="list-group" style="overflow:scroll;height: 628px">
                `
    for (let i = 0; i < selectedData.length; i++) {
            let content = `
                        <li class="list-group-item" data-num="${i}"> 
                            <p class="h6 text-center p-1 mb-3 mt-0 bg-secondary text-light rounded">編號：${i+1}</p>
                            <p class="text-danger h5 mb-3">速限 ${selectedData[i].limit}</p>
                            <p class="mb-1">地點：${selectedData[i].Address}</p>
                            <p class="pb-1">方向：${selectedData[i].direct}</p>
                        </li>
                        `
                    str += content;
    }
    document.getElementById('listArea').innerHTML = str;
    tagsOnMap(selectedData);
} 

// add tags on Map
function tagsOnMap(selectedData){
    let centerLat = parseFloat(selectedData[0].Latitude);
    let centerLng = parseFloat(selectedData[0].Longitude);
    let centerLatLng = { lat: centerLat, lng: centerLng }
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: centerLatLng,
    });
    for (let i = 0; i < selectedData.length; i++) {
        let tagLat = parseFloat(selectedData[i].Latitude);
        let tagLng = parseFloat(selectedData[i].Longitude);
        let tagLatLng = { lat: tagLat, lng: tagLng };
        let marker = new google.maps.Marker({
            position: tagLatLng,
            map:map,
        });
        let infoWindow = new google.maps.InfoWindow({
                content: `
                <ul style="list-style:none;">
                    <li>編號：${i+1}
                    <li>速限 ${selectedData[i].limit}</li>
                    <li>地點：${selectedData[i].Address}</li>
                    <li>方向：${selectedData[i].direct}</li>
                </ul>
                `,
            });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
            document.querySelector(`li[data-num='${i}']`).classList.add("actived");
        });
        infoWindow.addListener('closeclick',function() {
            document.querySelector(`li[data-num='${i}']`).classList.remove("actived");
        });
    listInfoWindow(i,marker,infoWindow);
    }
}

// click list item and pop up infoWindow 
function listInfoWindow(i,marker,infoWindow) {
    let listClick = document.querySelector(`li[data-num='${i}']`);
    listClick.addEventListener("click",function () {
        if (listClick.classList.contains("actived")) {
            infoWindow.close(map, marker);
            listClick.classList.remove("actived");
        }else{
            infoWindow.open(map, marker);
            listClick.classList.add("actived");
        }   
    });

}

