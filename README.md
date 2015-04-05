# JavaScript-Bitwise-Shenanigans
Yeah I &lt;3 Bitewise... String, ArrayBuffer, Uint8Array, Uint16Array, Uint32Array. And Native Implementation That Won't Suck That Much.

from the following code:
```javascript
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
```

-  you can turn `"א"` (unicode `1488`) to its slim-bytewise representattive `[215, 144]` using `"א".as_byte_array()`.
-  you can turn `"א"` (unicode `1488`) to its 'ASCII-like' string (all chars-values are < 128): `"×"` using `"א".as_unicode_decoded()`

<hr/>

-  you can turn `"×"` back to `"א"` using `"×".as_unicode_encoded()`
-  you can use some `I/O` (!!!) and turn `"א"` to `ArrayBuffer` to which you can create a `view` using `Uint8Array` (prefered), `Uint16Array`, or `Uint32Array`,
By using 
```js
"א".as_array_buffer(function(array_buffer){
  console.log(  new Uint8Array(array_buffer)  );
});

//will log:  [215, 144]
```

<hr/>


-  Due to some limitation of `String.prototype.charCodeAt` can not process chars with-value > `0x10000 (65536)` -- the `"א".as_array_buffer` may be more accurate in the future, since `"א".as_array_buffer` uses a `FileReader` to read a unicode-encoded-string as array-buffer, while conventional methods such-as `"א".as_unicode_decoded()` or `"א".as_byte_array` will convert the string char-by-char, using some bitewise operations to render the "ASCII-like" result of chars with value < 128. This is a known fact...
-  finally the method such as `base64_to_string` and `as_base64_string` are wrapping around `atob` and `btoa` which I never remember which one does what *(seriously w.t.f. are those names??!!)*

<hr/>

-  the unicode decoding is more a UTF-8/Unicode break-down, so the base64 encode/decode methods will work on Unicode/UTF-8.

<hr/>

-  **Its all by industry standards so you may convert string around, and they will ALWAYS be compatible with `PHP` !!!**.

