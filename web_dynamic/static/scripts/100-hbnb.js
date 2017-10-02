// Task 5
$(document).ready(function () {
  let myDict = {};
  $('.amenities input[type=checkbox]').click(function () {
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


  let myDictState = {}
  //task1 of advanced
  $('.locations ul h2 input[type=checkbox]').click(function () {
    if (this.checked) {
      myDictState[($(this).attr('data-id'))] = ($(this).attr('data-name'));
    } else {
      delete myDictState[$(this).attr('data-id')];
    }
    let myStringState = ''
    myStringState = Object.values(myDictState);
    let stateAmenities = myStringState.join(', ');
    $('.locations h4').text(this.text + stateAmenities);
  });

  let myDictCity = {}
  $('.locations ul li input[type=checkbox]').click(function () {
    if (this.checked) {
      myDictCity[($(this).attr('data-id'))] = ($(this).attr('data-name'));
    } else {
      delete myDictCity[$(this).attr('data-id')];
    }
    let myStringCity = ''
    myStringCity = Object.values(myDictCity);
    let cityAmenities = myStringCity.join(', ');
    $('.locations h4').text(cityAmenities);
  });
 
 showPlaces({});
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
        let $places = $('.places');
        $places.empty();
        $places.append('<h1>Places</h1>');

        $(response).each(function (idx, place) {
          let $article = $('<article>');
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

          $article.append(
            $('<div class="title"></div>').append(
              $('<h2></h2>').text(place.name),
              $('<div class="price_by_night"></div>').text('$' + place['price_by_night'])
            ),
            $('<div class="information">').append($maxGuest, $numRooms, $numBathrooms),
            $('<div class="user"></div>'),
            $('<div class="description"></div>').text(place['description'])
          );
          $places.append($article);
        });
      }
    });
  }
  // task 5 adding search button ajax call
  $('button').on('click', function () {
    let checkBoxDict = {};
    checkBoxDict['amenities'] = Object.keys(myDict);
    showPlaces(checkBoxDict);
  });
});
