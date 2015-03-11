var markersArray = [];
var map;
var refreshInterval;

function initialize() {
  var bcitLatlng = new google.maps.LatLng(49.2504322,-122.9938279);
  var mapOptions = {
    zoom: 10,
    center: bcitLatlng
  }

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
/*
  var marker = new google.maps.Marker({
      position: bcitLatlng,
      map: map,
      title: 'BCIT'
  });
*/
  makeTableHead();
  addMarkers();
}

function loadXMLDoc(filename)
{
  if (window.XMLHttpRequest)
    {
    xhttp=new XMLHttpRequest();
    }
  else
    {
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  xhttp.open("POST",filename,false);
  xhttp.send();
  return xhttp.responseXML;
}

function makeTableRow(row, ip, time, long, lat)
{
    var table = document.getElementById("record");
    var row = table.insertRow(row+1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = ip;
    cell2.innerHTML = time;
    cell3.innerHTML = Number(long).toFixed(4);
    cell4.innerHTML = Number(lat).toFixed(4);
}

function makeTableHead()
{
  var table = document.getElementById("record");
  var header = table.createTHead();
  var row = header.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = "<b>IP</b>";
  cell2.innerHTML = "<b>TIME</b>";
  cell3.innerHTML = "<b>LONG</b>";
  cell4.innerHTML = "<b>LAT</b>";
}

function refresh()
{
  removeMarkers();
  addMarkers();
}

function removeMarkers()
{
  var myTable = document.getElementById("record");
  var rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
     myTable.deleteRow(x);
  }

  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

function addMarkers()
{
  var xmlDoc = loadXMLDoc("coordinates.xml");
  var x=xmlDoc.getElementsByTagName("coord");

  for (i=0;i<x.length;i++)
    {
      var ip = xmlDoc.getElementsByTagName("ip")[i].childNodes[0].nodeValue;
      var time = xmlDoc.getElementsByTagName("time")[i].childNodes[0].nodeValue;

      var long = xmlDoc.getElementsByTagName("long")[i].childNodes[0].nodeValue;
      var lat = xmlDoc.getElementsByTagName("lat")[i].childNodes[0].nodeValue;
      var name = xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue;

      var newCoord = new google.maps.LatLng(long,lat);

      var marker = new google.maps.Marker({
          position: newCoord,
          map: map,
          title: name
      });

      markersArray.push(marker);

      makeTableRow(i, ip, time, long, lat);
    }
}

function refreshOn()
{
  refreshInterval = setInterval(function () {refresh()}, 1000);
}

function refreshOff()
{
  clearInterval(refreshInterval);
}

google.maps.event.addDomListener(window, 'load', initialize);
