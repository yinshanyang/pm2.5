var app = require('app'),
  ipc = require('ipc'),
  Menu = require('menu'),
  Tray = require('tray'),
  NativeImage = require('native-image'),
  path = require('path'),
  request = require('request');

var appIcon = null,
  area = 'central',
  pm25 = 0,
  interval = 60 * 1000,
  timer;

app.on('ready', function(){
  appIcon = new Tray(null);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'North',
      type: 'radio',
      click: function() { area = 'north'; poll(); }
    },
    {
      label: 'South',
      type: 'radio',
      click: function() { area = 'south'; poll(); }
    },
    {
      label: 'East',
      type: 'radio',
      click: function() { area = 'east'; poll(); }
    },
    {
      label: 'West',
      type: 'radio',
      click: function() { area = 'west'; poll(); }
    },
    {
      checked: true,
      label: 'Central',
      type: 'radio',
      click: function() { area = 'central'; poll(); }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() { app.quit(); }
    }
  ]);
  appIcon.setContextMenu(contextMenu);
  app.dock.hide();
  poll();
});

function poll() {
  if (timer) clearTimeout(timer);

  request({
    uri: 'http://haze.api.swarm.is/',
    method: 'get',
    json: true
  }, function(err, res, body) {
    if (err) {
      appIcon.setTitle([area[0].toUpperCase(), '✖'].join(':'));
    }
    else {
      pm25 = body[area].value;
      appIcon.setTitle([area[0].toUpperCase(), pm25].join(':'));
    }
  });

  timer = setTimeout(poll, interval);
}
