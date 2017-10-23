// Task 5
$(document).ready(function () {
  let myDict = {};
  $("input[type='checkbox']").click(function () {
    if (this.checked) {
      myDict[($(this).attr('data-id'))] = ($(this).attr('data-name'));
    } else {
      delete myDict[$(this).attr('data-id')];
    }
    let myString = Object.values(myDict);
    let stringAmenities = myString.join(', ');
    $('.amenities h4').text(stringAmenities);
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
  showPlaces({});

  var bounceTimer;
  greenIcon = "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png";
  blueIcon = "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png";
  PLACEID = "";
  latLongDict = {};
  infoWindowsDict = {};

  function fetchLatLong(id, txt) {
    if(txt == "green") {
        initialize({[id]:latLongDict[id]}, "green");
    } else {
        initialize({[id]:latLongDict[id]}, "blue");
    }
  }

  function saveLatLong(id, latitude, longitude) {
    latLongDict[id] = (latitude + "." + longitude);
  }


 // task 4
  function showPlaces (placesList) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(placesList),
      error: function (response) {
        $('.places').append('<p>Server issue</p>');
        console.log(response);
      },
      success: function (response) {
        latLongDict = {};
        infoWindowsDict = {};
        let $places = $('.places');
        $places.empty();
        $places.append('<h1>Places</h1>');

        $(response).each(function (idx, place) {
          let $article = $('<article>');
          let wrapper = $('<div>').attr('id',place['id']);
          // Max Guest
          var $maxGuest = $('<div class="max_guest"></div>');
          $maxGuest.append('<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />');
          $maxGuest.append(place['max_guest'] + ' Guests');
          // Num Rooms
          var $numRooms = $('<div class="number_rooms"></div>');
          $numRooms.append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />');
          $numRooms.append(place['number_rooms'] + ' Rooms');
          // Num Bathroom
          var $numBathrooms = $('<div class="number_bathrooms">');
          $numBathrooms.append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />');
          $numBathrooms.append(place['number_bathrooms'] + ' Bathrooms');

          wrapper.append(
            $('<div class="title"></div>').append(
              $('<h2></h2>').text(place.name),
              $('<div class="price_by_night"></div>').text('$' + place['price_by_night'])
            ),
            $('<div class="information">').append($maxGuest, $numRooms, $numBathrooms),
            $('<div class="user"></div>'),
            $('<div class="description"></div>').text(place['description'])
          );
          $article.append(wrapper);
          $places.append($article);
	  latLongDict[place["id"]] = {
		"lat": place["latitude"],
		"lng": place["longitude"]
	  };
          infoWindowsDict[place["id"]] = {
                "price": place["price_by_night"],
                "title": place["name"],
                "desc": (place["description"]).substring(0, 100)
          };

          $("#" + place['id']).mouseenter(function() {
		console.log("mouse enter!!!");
		return fetchLatLong(place["id"], "green");
	  });
          
          $("#" + place['id']).mouseleave(function() {
                console.log("mouse leave!!!");
                return fetchLatLong(place["id"], "blue");
          });
        initialize(latLongDict);
      });
     }
   });
 }


  // task 5 adding search button ajax call
  $('#searchButton').on('click', function () {
    let checkBoxDict = {};
    checkBoxDict['amenities'] = Object.keys(myDict);
    showPlaces(checkBoxDict);
  });

  var markers = [];
  map = new google.maps.Map(document.getElementById('map'), {
    	      zoom: 8,
          center: {lat: 20, lng:20}
        });
  function initialize(locObj = {1: {lat: 21, lng: -23}}, fn="loadAllMarkers") {
    if(fn=="loadAllMarkers") {
      if (markers.length > 0) {
          $.each(markers, function(idx, marker) {
            marker.setMap(null);
          });
          markers = [];
      }
      bounds  = new google.maps.LatLngBounds();
      // Add a marker at the center of the map.
      $.each( locObj, function( k, v ) {
        addMarker(k, v, map, bounds);
      });
      map.fitBounds(bounds); 
      map.panToBounds(bounds);
    } else {
      var pos = (Object.values(locObj))[0];
      var locId = (Object.keys(locObj))[0];
      $.each(markers, function(idx, marker) {
        if(marker.locationId == locId) {
          if (fn == "green") {
            if (this.getAnimation() == null || typeof this.getAnimation() === 'undefined') {
              clearTimeout(bounceTimer);
              var that = this;
              bounceTimer = setTimeout(setTimer(this), 50);
            }
          }
          else if(fn == "blue") {
            if (this.getAnimation() != null) {
              this.setAnimation(null);
            }
            clearTimeout(bounceTimer);
          }

        }
      });
    }
  }

  function setTimer(ob){
      ob.setAnimation(google.maps.Animation.BOUNCE);
  }


  // Adds a marker to the map.
  function addMarker(locId="1a", location, map, bounds) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var contentDict = infoWindowsDict[locId];
    var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+ 
            '<h4 id="firstHeading" class="firstHeading">'+ contentDict.title+'</h4>'+
            '<div id="bodyContent">'+
             contentDict.desc
            '</div>'+
            '</div>';
    var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
    var marker = new google.maps.Marker({
      position: location,
      locationId: locId,
      icon: blueIcon,
      label: String(contentDict.price),
      map: map
    });
    marker.addListener('click', function() {
          infowindow.open(map, marker);
    });
    markers.push(marker);
    loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    bounds.extend(loc);
    //marker bounce animation
    function setTimer(ob){
      ob.setAnimation(google.maps.Animation.BOUNCE);
     }
    var bounceTimer;
    google.maps.event.addListener(marker, 'mouseover', function() {
      if (this.getAnimation() == null || typeof this.getAnimation() === 'undefined') {      
        clearTimeout(bounceTimer);     
        var that = this;     
        bounceTimer = setTimeout(setTimer(that), 50); 
      }
    });
    google.maps.event.addListener(marker, 'mouseout', function() {    
      if (this.getAnimation() != null) {
        this.setAnimation(null);
      } 
      clearTimeout(bounceTimer);  
    });
 }


  //fetch marker from the visible portion of map
  function displayPlaces(placesIdList) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/placesFromMap/',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(placesIdList),
      error: function (response) {
        $('.places').empty();
        $('.places').append('<h2>No listings to show!!</h2>');
        console.log(response);
      },
      success: function (response) {
        let $places = $('.places');
        $places.empty();
        $places.append('<h1>Places</h1>');

        $(response).each(function (idx, place) {
          let $article = $('<article>');
          let wrapper = $('<div>').attr('id',place['id']);
          // Max Guest
          var $maxGuest = $('<div class="max_guest"></div>');
          $maxGuest.append('<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />');
          $maxGuest.append(place['max_guest'] + ' Guests');
          // Num Rooms
          var $numRooms = $('<div class="number_rooms"></div>');
          $numRooms.append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />');
          $numRooms.append(place['number_rooms'] + ' Rooms');
          // Num Bathroom
          var $numBathrooms = $('<div class="number_bathrooms">');
          $numBathrooms.append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />');
          $numBathrooms.append(place['number_bathrooms'] + ' Bathrooms');
          wrapper.append(
            $('<div class="title"></div>').append(
              $('<h2></h2>').text(place.name),
              $('<div class="price_by_night"></div>').text('$' + place['price_by_night'])
            ),
            $('<div class="information">').append($maxGuest, $numRooms, $numBathrooms),
            $('<div class="user"></div>'),
            $('<div class="description"></div>').text(place['description'])
          );
          $article.append(wrapper);
          $places.append($article);
          $("#" + place['id']).mouseenter(function() {
                console.log("mouse enter!!!");
                return fetchLatLong(place["id"], "green");
          });

          $("#" + place['id']).mouseleave(function() {
                console.log("mouse leave!!!");
                return fetchLatLong(place["id"], "blue");
          });
        });
      }
   });
  }


  $('#fetchMarkers').on('click', function () {
    var visibleMarkers = []; // your markers
    for (var i=0; i<markers.length; i++){
      if( map.getBounds().contains(markers[i].getPosition()) ){
        visibleMarkers.push(markers[i].locationId);
      }
    }
    displayPlaces(visibleMarkers);
  });

});
