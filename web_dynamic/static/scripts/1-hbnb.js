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
});
