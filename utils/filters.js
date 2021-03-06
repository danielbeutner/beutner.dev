const { DateTime } = require('luxon');
const slugify = require('slugify');

module.exports = {
  readableDate: function (date, format) {
    // Default to Europe/Berlin timezone
    const dt = DateTime.fromJSDate(date, { zone: 'UTC+2' });

    if (!format) {
      format = dt.hour + dt.minute > 0 ? 'dd LLL yyyy - HH:mm' : 'dd LLL yyyy';
    }

    return dt.toFormat(format);
  },

  dateToFormat: function (date, format) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(String(format));
  },

  dateToISO: function (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
      includeOffset: false,
      suppressMilliseconds: true,
    });
  },

  obfuscate: function (str) {
    const chars = [];
    for (var i = str.length - 1; i >= 0; i--) {
      chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return chars.join('');
  },
  // See: https://github.com/11ty/eleventy/issues/278#issuecomment-451105828
  slug: function (input) {
    const options = {
      replacement: '-',
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true,
      trim: true,
    };

    return slugify(input, options);
  },
};
