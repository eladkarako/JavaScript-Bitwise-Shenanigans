String.prototype.base64_to_string = function () { return window.atob(this)}; //bonus
String.prototype.as_base64_string = function () { return window.btoa(this)}; //bonus

/**
 * @method as_array_buffer
 * read a string (I/O!!!) into an ArrayBuffer, you should choose ''new Uint8Array(.....)'' to view the result...
 * @param {function} callback
 */
String.prototype.as_array_buffer = function (callback) {
  var reader = new FileReader();
  reader.onload = function () { callback(reader.result)};
  reader.readAsArrayBuffer(new Blob([this], {type: 'text/plain'}));
};

/**
 * @method as_byte_array
 * represent string as array byte, chars with value > 128 will get 2 or 3 cells to represent their's value.
 * @note this function is limited by ''charCodeAt'' to chars with codes < 65536. most of higher chars will still have representative (or ''char replacement'') in the < 65536 table.
 * @returns {Array}
 */
String.prototype.as_byte_array = function () {
  var b = [];

  this.split('').forEach(function (c) {
    c = c.charCodeAt(0);

    (c < 128) ? (b.push(c)) :
      (c < 2048) ? ( b.push(c >> 6 | 192), b.push(c & 63 | 128)) :
        (b.push(c >> 12 | 224), b.push(c >> 6 & 63 | 128), b.push(c & 63 | 128));
  });
  return b;
};

/**
 * @method as_unicode_decoded
 * turns a string into a string with chars-value of less than 128 (but more chars)
 * @example #1:   "א"->([215, 144])-> "[?][?]"
 * @returns {string}
 */
String.prototype.as_unicode_decoded = function () {
  //breaks characters with code > 128 to pairs, then parse the pairs to ''strings''.
  return String.fromCharCode.apply(null, this.as_byte_array());
};

/**
 * @method as_unicode_encoded
 * turns a string into its unicode format collapsing extra chars (but result with chars with value > 128)
 * @returns {string}
 */
String.prototype.as_unicode_encoded = function () {
  //join strings that are pairs of characters with code < 128 to what probably had been their original format

  var
    str = this
    , sb = []
    , i
    , c
    ;

  str = str.split('').map(function (c) {return c.charCodeAt(0)});

  for (i = 0; i < str.length; i += 1) {
    c = [str[i] || '', str[i + 1] || '', str[i + 2] || ''];

    if (c[0] < 128)
      sb.push(String.fromCharCode(c[0]));
    else if (191 < c[0] && c[0] < 224) {
      sb.push(String.fromCharCode(((c[0] & 31) << 6) | (c[1] & 63)));
      i += 1;
    } else {
      sb.push(String.fromCharCode(((c[0] & 15) << 12) | ((c[1] & 63) << 6) | (c[2] & 63)));
      i += 2;
    }
  }
  sb = sb.join('');
  return sb;
};
