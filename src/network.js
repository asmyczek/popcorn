/**
 * @module Popcorn.Network
 * @requires Popcorn.Core
 * @requires Popcorn.Common 
 * @requires Popcorn.Dictionary 
 * @requires Popcorn.Names 
 */

/**
 * Generators for common data types used in networking.
 *
 * @namespace Popcorn.Network
 * @author Adam Smyczek
 * @author Brian Wilkerson
 */
Popcorn.Network = function (core, common, dict, names) {

  var lib = {};

  // Hex char set
  var hex = "FEDCBA9876543210";

  // ------ Utils for IP addresses ------

  // Parse and validate IP string to an int array,
  // for example "192.168.0.1" -> [192, 168, 0, 1]
  var parseIP = function(ip_str) {
    var ip   = new RegExp("(\\d{1,3})\.(\\d{1,3})\.(\\d{1,3})\.(\\d{1,3})", "g").exec(ip_str),
        pInt = function(seg) {
          var i = parseInt(seg, 10);
          if (isNaN(i) || i > 255 || i < 0) throw "Invalid IP octet " + seg + " of IP: " + ip_str;
          return i;
        };
    if (ip && ip.length > 4) {
      return core.map(pInt, ip.slice(1));
    };
    throw "Invalid IP address: " + ip_str;
  };

  // Convert an IP array to a string
  var ip2str = function(ip) {
    return ip.join(".");
  }

  // Convert an IP array to an int value.
  // Uses only last three octets.
  var ip2int = function(ip) {
    if (ip.length > 3) throw "Max 3 IP octets supported."
    var rip = ip.reverse();
    return core.seq(core.mapGen(rip.slice(1)), function(r, o, i) { return r + (o << (8 << i)); }, rip[0])();
  };

  // Opposite to ip2int converts an int to last three IP octets.
  var int2ip = function(i) {
    return core.seq(core.mapGen([0,8,16]), function(r, s) { return r.concat((i >> s) & 255); }, [])().reverse();
  };
 
  // ------ Random generators extensions ------

  /** @scope Popcorn.Core.Random */

  /**
   * Generates a random IP address string in the range 
   * from 'fromIP' to 'toIP'.
   * 
   * @function {generator} ipAddress
   * @param {string} fromIP - IP string of the form '192.168.0.1'.
   * @param {string} toIP - IP string of the form '192.168.0.10'.
   * @return a random IP address generator.
   */
  core.RandomLib.ipAddress = function(fromIP, toIP) {
    var ip1 = parseIP(fromIP),
        ip2 = parseIP(toIP);

    // Validate range
    if (ip1[0] !== ip2[0]) throw "Ip rage to large.";

    // Convert string to int array first and int using last three octets.
    var ipi1 = ip2int(ip1.slice(1)),
        ipi2 = ip2int(ip2.slice(1)),
        from = Math.min(ipi1, ipi2),
        to   = Math.max(ipi1, ipi2),
        int  = this.int(from, to);

    return core.lazy(function() {
      return core.gen(ip2str([ip1[0]].concat(int2ip(int()))));
    });
  };

  /**
   * Generates a random mac address string. This generator
   * accepts an optional delimiter char.
   * 
   * @function {generator} macAddress
   * @param {string} delimiter - an optional delimiter char.
   * @return a random mac address generator.
   */
  core.RandomLib.macAddress = function(delimiter) {
    var del = delimiter|| ":", 
        hCh = this.element(hex);
    return core.lazy(function() {
      var mac = "00";
      for (var i = 0; i < 5; i++) {
        mac = mac.concat(del, hCh(), hCh());
      }
      return core.gen(mac);
    });
  };

  /**
   * Random email address generator that 
   * uses {@link names}, {@link surnames} and
   * {@link domains} dictionaries to generate 
   * email addresses of the form 'name.surname1@surname2.domain'.
   * 
   * @function {generator} emailAddress
   * @return a random email address generator.
   */
  core.RandomLib.emailAddress = function() {
    var n = names.names.element(this), 
        s = names.surnames.element(this),
        d = domains.element(this);
    return core.lazy(function() {
      return core.gen("".concat(n(), ".", s(), "@", s(), ".", d()));
    });
  };


  // ------ Ohter network generator ------

  /** @scope Popcorn.Network */

  /**
   * IP range generator creates IPs in the range from 'fromIP' to 'toIP'.
   * Currently the maximum range length is restricted to 5000 elements.
   *
   * @function {generator} ipRange
   * @param {string} fromIP - IP string of the form '192.168.0.1'.
   * @param {string} toIP - IP string of the form '192.168.0.10'.
   * @return a IP range generator.
   */
  var ipRange = lib.ipRange = function(fromIp, toIp) {
    var ip1 = parseIP(fromIp),
        ip2 = parseIP(toIp),
        max_ips = 5000;

    // Validate range
    if (ip1[0] !== ip2[0]) {
      throw "To many IP addresses, maximum range count is " + max_ips + ".";
    }

    // Convert string to int array first and int using last three octets.
    var ipi1 = ip2int(ip1.slice(1)),
        ipi2 = ip2int(ip2.slice(1)),
        from = Math.min(ipi1, ipi2),
        to   = Math.max(ipi1, ipi2),
        r    = new Array(to - from);

    // Create IP array
    for (var i = from; i <= to; i++) {
      r[i - from] = core.gen(ip2str([ip1[0]].concat(int2ip(i))));
    }
    return r;
  };

  // ------ Domains dictionary ------

  // Domains dictionary
  var domains_dict = [
    "ac", "ad", "ae", "aero", "af", "ag", "ai", "al", "am", "an",
    "ao", "aq", "ar", "arpa", "as", "asia", "at", "au", "aw", "ax",
    "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "biz", "bj",
    "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca",
    "cat", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn",
    "co", "com", "coop", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj",
    "dk", "dm", "do", "dz", "ec", "edu", "ee", "eg", "er", "es", "et",
    "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf",
    "gg", "gh", "gi", "gl", "gm", "gn", "gov", "gp", "gq", "gr", "gs",
    "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id",
    "ie", "il", "im", "in", "info", "int", "io", "iq", "ir", "is", "it",
    "je", "jm", "jo", "jobs", "jp", "ke", "kg", "kh", "ki", "km", "kn",
    "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", 
    "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", 
    "mil", "mk", "ml", "mm", "mn", "mo", "mobi", "mp", "mq", "mr", "ms", 
    "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "name", 
    "nc", "ne", "net", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz",
    "om", "org", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr",
    "pro", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa",
    "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn",
    "so", "sr", "st", "su", "sv", "sy", "sz", "tc", "td", "tel", "tf", "tg",
    "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "travel", "tt", "tv",
    "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi",
    "vn", "vu", "wf", "ws", "xn", "ye", "yt", "yu", "za", "zm", "zw"];

  /**
   * Domains dictionary.
   * 
   * @function {Dict} domains
   * @return the domains dictionary object.
   *
   * @see Popcorn.Dictionary.Dict
   */
  var domains = lib.domains = dict.dictionary(domains_dict);

  /**
   * Most common domains dictionary.
   * It contains the domains com, net, org, edu, gov, biz and info.
   * 
   * @function {Dict} commonDomains
   * @return the common domains dictionary object.
   *
   * @see Popcorn.Dictionary.Dict
   */
  var commonDomains = lib.commonDomains = dict.dictionary(["com", "net", "org", "edu", "gov", "biz", "info"]);

  return lib;

}(Popcorn.Core, Popcorn.Common, Popcorn.Dictionary, Popcorn.Names);

