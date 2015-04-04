/**
 * asynchronous implementation of string-to byte-array (ArrayBuffer) that uses 'Blob' and 'FileReader'.
 * @param str
 * @param callback
 * @deprecated
 */
function to_byte_array(str, callback) {
  var reader = new FileReader();
  str = new Blob([str, {type: "text/plain"}]);

  reader.onloadend = function () {
    callback(reader.result)
  };
  reader.readAsArrayBuffer(str);
}


/**
 * longer implementation of string-to byte-array
 * @returns {Array}
 * @deprecated
 */
function to_byte_array(str) {
  var b = [];

  Array.prototype.forEach.call(str, function (c) {
    c = c.charCodeAt(0);
    if (c < 128) {          //128     0x80     Math.pow(2,7)
      b.push(0);
      b.push(0);
      b.push(0);
      b.push(c);
    }
    else if (c < 2048) {    //2048    0x800    Math.pow(2,11)
      b.push(0);
      b.push(0);
      b.push(c >> 6 | 192);
      b.push(c & 63 | 128);
    }
    else if (c < 65536) {  //65536   0x10000  Math.pow(2,16)
      b.push(0);
      b.push(c >> 12 | 224);
      b.push(c >> 6 & 63 | 128);
      b.push(c & 63 | 128);
    }
    else {
      b.push(c >> 18 | 240);
      b.push(c >> 12 & 63 | 128);
      b.push(c >> 6 & 63 | 128);
      b.push(c & 63 | 128);
    }
  });
  return b;
}


/**
 * convert a string to a native array of 4 byte value (array's length is always a whole divided of 4).
 * @param {string} str
 * @returns {Array}
 */
function to_byte_array(str) {
  var b = [];

  Array.prototype.forEach.call(str, function (c) {
    c = c.charCodeAt(0);

    (c < 128) ? (b.push(0), b.push(0), b.push(0), b.push(c)) :
      (c < 2048) ? ( b.push(0), b.push(0), b.push(c >> 6 | 192), b.push(c & 63 | 128)) :
        (c < 65536) ? (b.push(0), b.push(c >> 12 | 224), b.push(c >> 6 & 63 | 128), b.push(c & 63 | 128)) :
          (b.push(c >> 18 | 240), b.push(c >> 12 & 63 | 128), b.push(c >> 6 & 63 | 128), b.push(c & 63 | 128));
  });
  return b;
}

/**
 * convert a string to a native array of 1's and 0's
 * @param {string} str
 * @returns {Array}
 */
function string_to_binary_array(str) {
  str = str.toByteArray();
  str = str.map(function (n) { return n.toString(2) });
  str = str.join('').split('').map(function (n) { Number(n)});
  return str;
}


//|||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||

String.prototype.toByteArray = function () { return to_byte_array(this) };
String.prototype.toByteArray = function () { return to_byte_array(this) };
Array.prototype.toWholeString = function () { return String.fromCharCode.apply(null, this) };

window.base64dec = window.atob;
window.base64enc = window.btoa;
