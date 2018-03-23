const request = require('request-promise');
const moment = require('moment-timezone');

const database = require('./firebase.js');

let _COUNT_ = 0;

function goOfflineOnceDone() {
  const id = setInterval(() => {
    if(_COUNT_ === 500) {
      clearInterval(id);
      
      _COUNT_ = 0;
      
      database.goOffline();
    }
  }, 1000);
}

function getHotels(city, count, checkin, checkout) {
  const oyoHotelsAPI = 'https://www.oyorooms.com/api/search/hotels';

  const params = {
    'additional_fields': 'cancellation_policies,best_image,room_pricing,availability,amenities,restrictions,category,captains_info,new_applicable_filters,additional_charge_info,images,hotel_images,guest_rating',
    'available_room_count[checkin]': checkin,
    'available_room_count[checkout]': checkout,
    'available_room_count[min_count]': 1,
    'fields': 'id,name,city,street,category,geo_location,category,hotel_type,alternate_name,short_address',
    'filters[coordinates][city]': city,
    'format_response[batch][count]': count,
    'format_response[batch][offset]': 0,
    'format_response[sort_params][ascending]': true,
    'pre_apply_coupon_switch': true,
    'rooms_config': '1,0,0',
    'source': 'Web Booking'
  }

  return request({
    url: oyoHotelsAPI,
    qs: params
  });
}

function init() {
  database.goOnline();
  
  const cities = [{
    name: 'delhi',
    hotels: 419
  }, {
    name: 'bangalore',
    hotels: 287
  }, {
    name: 'hyderabad',
    hotels: 176
  }, {
    name: 'goa',
    hotels: 616
  }, {
    name: 'chennai',
    hotels: 197
  }];

  const now = moment().tz("Asia/Kolkata");
  const today = now.format('DD/MM/YYYY');
  const tomorrow = now.add(1, 'days').format('DD/MM/YYYY');
  const timestamp = now.format('lll');

  cities.map(city => {
    getHotels(city.name, 100, today, tomorrow)
      .then(res => {
        const data = JSON.parse(res);
        const hotels = data.hotels;

        console.log(`${timestamp}: Creating log [${today}]: ${city.name}`);

        hotels.map(hotel => {
          const ref = '/' + city.name + '/' + hotel.id;

          const id = hotel.id,
            name = hotel.name,
            price = hotel.reduced_room_pricing[0] || hotel.pricing_info[0];

          try {
            const p = database.ref(ref).push({
              id: id,
              name: name,
              price: price,
              timestamp: timestamp
            });

            p.then(() => {
              _COUNT_++;

              console.log(`Writing node ${ref}: ${id}`);
            });
          } catch (err) {
            console.error('Write operation to firebase failed!!!');
          }
        });
      });
  });

  goOfflineOnceDone();
}


module.exports = init;