var fs = require('fs');
var parse = require('csv-parse')
var events = require('events');
var eventEmitter = new events.EventEmitter();
var notifEmitter = new events.EventEmitter();
var input_file = 'StockWatch.csv'
var yahoo = require('yahoo-finance');
var moment = require('moment')

function getCurrentDate() {
  var today = new Date();
  var day = today.getDay();
  if (day === 6) {
    return moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
  } else if (day === 0) {
    return moment(new Date()).subtract(2, 'day').format('YYYY-MM-DD');
  }
  return moment(new Date()).format('YYYY-MM-DD');
}

function getPreviousDate(current_date) {
  var current_date = new Date(moment(current_date));
  var day = current_date.getDay();

  // console.log("Today is " + current_date + " with day " + current_date.getDay());

  if (day === 1) {
    return moment(current_date).subtract(3, 'day').format('YYYY-MM-DD');
  } else if (day === 0) {
    return moment(current_date).subtract(2, 'day').format('YYYY-MM-DD');
  } else if (day === 6) {
    return moment(current_date).subtract(1, 'day').format('YYYY-MM-DD');
  }
  return moment(current_date).subtract(1, 'day').format('YYYY-MM-DD');
}

eventEmitter.on('stock', (stock) => {
  to_date = getCurrentDate();
  console.log(to_date);
  from_date = getPreviousDate(to_date);
  console.log(from_date);
  yahoo.historical({
    symbol: stock.symbol,
    from: from_date,
    to: to_date,
    period: 'd'
  }).then((quotes) => {
    if (typeof quotes[0] === 'undefined' || quotes[0] === null) {
      console.err("Error with stock ", JSON.stringify(stock));
    }
    notifEmitter.emit('check', quotes[0], quotes[quotes.length - 1], stock)
  }).catch((err) => {
    console.log("Error with stock " + JSON.stringify(stock), err);
  })
});

notifEmitter.on('check', (current, yesterday, stock) => {
  const buy_price = stock.buyprice;
  var diff = (buy_price * 0.02);
  var low = parseFloat(buy_price) - parseFloat(diff);
  var high = parseFloat(buy_price) + parseFloat(diff);
  if (low < current.open && high > current.open) {
    console.log("buy price %s high price %s low price %s diff %s", buy_price, high, low, diff);
    console.log("Notify here Open for stock " + JSON.stringify(stock));
  } else if (low < current.close && high > current.close) {
    console.log("buy price %s high price %s low price %s diff %s", buy_price, high, low, diff);
    console.log("Notify here close for stock " + JSON.stringify(stock));
  } else if (low < current.high && high > current.high) {
    console.log("buy price %s high price %s low price %s diff %s", buy_price, high, low, diff);
    console.log("Notify here high for stock " + JSON.stringify(stock));
  } else if (low < current.low && high > current.low) {
    console.log("buy price %s high price %s low price %s diff %s", buy_price, high, low, diff);
    console.log("Notify here low for stock " + JSON.stringify(stock));
  }
});

var parser = parse({
  delimiter: '|'
}, function (err, data) {
  data.forEach(function (line) {
    var stock = {
      "name": line[0],
      "symbol": line[1],
      "buyprice": line[2]
    };
    eventEmitter.emit('stock', stock)
  });
});
fs.createReadStream(input_file).pipe(parser);

var d = new Date();