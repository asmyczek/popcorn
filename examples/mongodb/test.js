// MongoDB test data generator

// Load popcorn libs
load('../../src/core.js', '../../src/common.js', '../../src/dictionary.js',
     '../../src/names.js', '../../src/passwords.js', '../../src/network.js',
     '../../src/all.js');

// Generator libs
var g = Popcorn.All;

// Author generator
var author_gen = { 
  last     : g.surnames.list(100000),
  first    : g.names.element(),
  password : g.passwords.element(),
  email    : g.random().emailAddress(),
  bio      : g.random().loremIpsum(5, 10)
};

// Generate and insert
var authors = g.generate(author_gen);
for (var i = 0, l = authors.length; i < l; i++) {
  db.authors.insert(authors[i]);
}


// Tile and tags dictionaries
var titles = g.dictionary(["Just testing", "Live is good!", "WTF is Popcorn?", "On the road", "and more..."]);
var tags  = g.dictionary(["MongoDB", "CouchDB", "Popcorn", "Programming", "JavaScript", "Java", "Mu", "Live"]);

// For all authors
for (var as = db.authors.find({}); as.hasNext(); ) {
  var author = as.next();

  // New blog generator for every author
  var blog_entry = {};
  blog_entry.author_id = author._id.toString(),

  // Generate random n blogs between ...
  // with one random tiles from titles generator
  blog_entry.title = g.chain(g.random().int(40, 60), 
                    function(i) { return g.repeat(i, titles.element()); });

  // and a date sometimes in 2009
  var from = new Date(2009, 1, 1);
      to   = new Date(2010, 1, 1);
  blog_entry.date = g.random().date(from, to);

  // Lorem ipsum body of random length
  blog_entry.body = g.lazy(function() { return g.random().loremIpsum(); });

  // With tags
  blog_entry.tags = g.array(tags.elements(3));

  // and comments:
  blog_comment = {
    name    : g.chain(g.random().int(1, 10), function(i) { return g.repeat(i, g.names.element()); }),
    email   : g.random().emailAddress(),
    comment : g.lazy(function() { return g.random().loremIpsum(); })
  };

  var blog_entries = g.generate(blog_entry);
  for (var i = 0, l = blog_entries.length; i < l; i++) {
    blog_entries[i].comments = g.generate(blog_comment);
//     printjson(blog_entries[i]);
    db.blog_entries.insert(blog_entries[i]);
  }

}

