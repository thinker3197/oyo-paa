const jsonexport = require('jsonexport');
const jsonfile = require('jsonfile');
const database = require('./firebase.js');

const file = './analytics.json';

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

let count = 0;

const DATA = {}, 
MODEL = {};

function init() {
  database.goOnline();

  cities.map(city => {
    DATA[city.name] = {};

    database.ref('/' + city.name).on('value', (snapshot) => {
      const data = snapshot.val();
      const hotels = Object.keys(data);

      hotels.map(e => {
        DATA[city.name][e] = []

        const instances = Object.keys(data[e]);

        instances.map(i => {
          DATA[city.name][e].push(data[e][i]);
        })
      });

      count++;
      
      if(count === 5) {
        // console.log(JSON.stringify(DATA));
        // jsonexport(DATA, (err, csv) => {
        //   if(err) return console.log(err);
        //   console.log(csv);
        // });
        // console.log(JSON.stringify(DATA));
        // jsonfile.writeFileSync(file, DATA, {spaces: 2})
        
        database.goOffline();
      }
    });
  });
}

init();