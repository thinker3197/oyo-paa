const request = require('request-promise');

const cities = [{
  name: 'delhi',
  hotels: 419
}, {
  name: 'banglore',
  hotels: 21}, 'hyderabad', 'chennai', 'goa'];

const getHotels = (city) => {
  const oyoHotelsAPI = 'https://www.oyorooms.com/api/search/hotels';

  const params = {
    'additional_fields': 'cancellation_policies,best_image,room_pricing,availability,amenities,restrictions,category,captains_info,new_applicable_filters,additional_charge_info,images,hotel_images,guest_rating',
    'available_room_count[checkin]': '20/03/2018',
    'available_room_count[checkout]': '21/03/2018',
    'available_room_count[min_count]': 1,
    'fields': 'id,name,city,street,category,geo_location,category,hotel_type,alternate_name,short_address',
    'filters[coordinates][city]': city,
    'format_response[batch][count]': 20,
    'format_response[batch][offset]': 0,
    'format_response[sort_params][ascending]': true,
    'pre_apply_coupon_switch': true,
    'rooms_config': '1,0,0',
    'source': 'Web Booking'
  }

  return request({url: oyoHotelsAPI, qs: params});
}

getHotels('delhi').then((response) => {
  const data = JSON.parse(response);

  console.log(data.hotels.length);
});