const EASE_POINTS = {
  'Linear.easeNone': [0.250, 0.250, 0.750, 0.750],
  'Quad.easeIn': [0.550, 0.085, 0.680, 0.530],
  'Quad.easeOut': [0.250, 0.460, 0.450, 0.940],
  'Quad.easeInOut': [0.455, 0.030, 0.515, 0.955],
  'Cubic.easeIn': [0.550, 0.055, 0.675, 0.190],
  'Cubic.easeOut': [0.215, 0.610, 0.355, 1.000],
  'Cubic.easeInOut': [0.645, 0.045, 0.355, 1.000],
  'Quart.easeIn': [0.895, 0.030, 0.685, 0.220],
  'Quart.easeOut': [0.165, 0.840, 0.440, 1.000],
  'Quart.easeInOut': [0.770, 0.000, 0.175, 1.000],
  'Quint.easeIn': [0.755, 0.050, 0.855, 0.060],
  'Quint.easeOut': [0.230, 1.000, 0.320, 1.000],
  'Quint.easeInOut': [0.860, 0.000, 0.070, 1.000]
};

export default class Utils {
  static formatMinutes(d) {
    // convert milliseconds to seconds
    let seconds = d / 1000;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    seconds = seconds - minutes * 60;
    let output = seconds + 's';
    if (minutes) {
      output = minutes + 'm ' + output;
    }
    if (hours) {
      output = hours + 'h ' + output;
    }
    return output;
  }

  static getClosestTime(data, time, objectId = false, property_name = false, timer = false, tolerance = 0.1) {
    if (timer) {
      var timer_time = timer.getCurrentTime() / 1000;
      if (Math.abs(timer_time - time) <= tolerance) {
        return timer_time;
      }
    }

    if (objectId || property_name) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        // Don't match item with itself, but allow property to match item start/end.
        if (item.id !== objectId || property_name) {
          // First check start & end.
          if (Math.abs(item.start - time) <= tolerance) {
            return item.start;
          }

          if (Math.abs(item.end - time) <= tolerance) {
            return item.end;
          }
        }

        // Test properties keys
        for (var j = 0; j < item.properties.length; j++) {
          var prop = item.properties[j];

          // Don't match property with itself.
          if (prop.keys && (item.id !== objectId || prop.name !== property_name)) {
            for (var k = 0; k < prop.keys.length; k++) {
              var key = prop.keys[k];
              if (Math.abs(key.time - time) <= tolerance) {
                return key.time;
              }
            }
          }
        }
      }
    }
    return false;
  }

  static getPreviousKey(keys, time) {
    var prevKey = false;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key.time < time) {
        prevKey = key;
      }
      else {
        return prevKey;
      }
    }
    return prevKey;
  }

  static sortKeys(keys) {
    var compare = function(a, b) {
      if (a.time < b.time) {
        return -1;
      }
      if (a.time > b.time) {
        return 1;
      }
      return 0;
    };
    return keys.sort(compare);
  }

  static guid() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  static getEasingPoints(ease) {
    // If already an array then return it directly.
    if (Array.isArray(ease)) {
      return ease;
    }
    // Return the points but clone the array first ; )
    if (EASE_POINTS[ease]) {
      return EASE_POINTS[ease].slice(0);
    }
    return EASE_POINTS['Quad.easeInOut'].slice(0);
  }
}
