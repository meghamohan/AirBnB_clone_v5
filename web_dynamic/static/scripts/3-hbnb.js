$(document).ready(function(){
  let myDict = {};
  $("input[type='checkbox']").click(function() {
    if (this.checked) {
      myDict[($(this).attr('data-id'))] = ($(this).attr('data-name'))
    } else {
      delete myDict[$(this).attr('data-id')];
    }
    let myString = Object.values(myDict)
    let stringAmenities = myString.join(', ');
    $('.amenities h4').text(stringAmenities);
  })
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  })

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({}),
    error: function (response) {
      $('.places').append('<p>Server issue</p>');
      console.log(response);
    },
    success: function (response) {
      $(response).each( function(idx, place) {
        //Max Guest
        var $maxGuest = $('<div class="max_guest"></div>');
        $maxGuest.append('<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />');
        $maxGuest.append(place['max_guest'] + ' Guests');
        //Num Rooms
        var $numRooms = $('<div class="number_rooms"></div>');
        $numRooms.append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />');
        $numRooms.append(place['number_rooms'] + ' Rooms');
        //Num Bathroom
        var $numBathrooms = $('<div class="number_bathrooms">');
        $numBathrooms.append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />');
        $numBathrooms.append(place['number_bathrooms'] + ' Bathrooms');

        $('.places').append(
          $('<article>').append(
            $('<div class="title"></div>').append(
              $('<h2></h2>').text(place.name),
              $('<div class="price_by_night"></div>').text('$' + place['price_by_night'])
            ),
            $('<div class="information">').append($maxGuest, $numRooms, $numBathrooms),
            $('<div class="user"></div>'),
            $('<div class="description"></div>').text(place['description'])
        ));
      })
    }
  })

});
