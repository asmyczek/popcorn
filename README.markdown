Popcorn - a DSL for JSON
========================

## Description

Popcorn is a JavaScript embedded DSL designed for quick, ease and
flexible JSON object generation. The core modules provides a basic set
of generators for most common JavaScript types, and combinators to build
new generators for any kind of data. Additional modules extend the 
functionality with random generators, dictionaries, network type
generators for IP or mac address and more.

Main purpose of this framework is mock object generation for testing
of JSON services and browser side JavaScript code. Since with this DSL
thousands of test cases can be expressed in just few lines of code,
it makes for a great driver for data-driven test engines.

To see the DSL in action try 'popcorn_maker.html'.

## Build

To use the library just load Core, Common and other modules as needed. 
Use [jGrouseDoc](http://code.google.com/p/jgrousedoc/) to build the 
API docs. Just update 'build.properties' file with the location
of the jGrouseDoc project and run ant.

## Getting started

The library consist of several independent loadable modules build on
top of the Core module. Load only the modules you like to use or
module All that combines all generators together.
Just three steps are required to setup the generator:

  1. Define the base test case JSON object.
  2. Define the generator object and assign generators to attributes you like to alter.
  3. Run the `generator` function on the generator and base object.

For example:

<pre><code>
	// Modules containing generators used in this scope.
	with(Popcorn.Core) { 
	with(Popcorn.Common) {   

		var base_object = { // The base test case object.
			id   : 1, 
			name : 'Woody'
		};

		var generator = { // The generator object altering only the name attribute.
			name : list('Buzz', 'Slinky')
		};

		// And the generator runner.
		var results = generate(generator, base_object);

	} }
</code></pre>

## Generators 101

In the basics, generators are functions that take one argument and return
a value. The Core module function `gen()` creates the most basic generator
that returns the argument value passed to `gen()` ignoring the argument
the generator itself is called with:

<pre><core>
	var g = gen('test'); // Create a generator g with value 'test'.
	g('any input')       // Execute the generator g. The result is 'test'.
</core></pre>

In comparison to `gen()`, `prepend()` generator uses the input value, 
for example:

<pre><core>
	var p = prepend('Hello ');
	p('world'); // returns 'Hello world'
	p('Buzz'); // returns 'Hello Buzz', etc.
</core></pre>

Some generators accept other generators or generator arrays as argument.
For example `append(g)` executes the generator `g` and appends the
result to the input value:

<pre><core>
	var r = random().int(), // See next section for random generators.
	    a = append(r);
	    a('user'); // Will return for example 'user42' or 'user573' etc.
</core></pre>

If you like to pass a generator value to another generator function that 
does not accept generator arguments, you can use `chain()` function to 
execute the generators in sequence. For example to generate random user 
names of the form '<user>-<random int>' we can define a generator as 
following:

<pre><core>
  var r = random().int(),
      u = chain(r, function(i) { return append('-' + i); });
      u('admin'); // Will return for example 'admin-385' or 'admin-712', etc.
</core></pre>

`chain()` takes a generator and a function as argument. It executes the 
generator and passes the result to the function that always has to return 
another generator as result. `chain()` itself is a generator that can be 
evaluated or passed to another generator.

The previous example seams to be quite useful already. It can be extracted 
into a separate library and used with any other generator, for example:

<pre><core>
	var randomUser = chain(random().int(), function(i) { return append('-' + i); });
	repeat(10, randomUser)('user'); // Generates 10 random user names.
</core></pre>

See 'popcorn_maker.html' and API documentation for more information and 
the complete generator list.

## Random generators

The Core module defines a random generator object and a library class that 
can be extended with custom random generators. The constructor function 
`random()` creates the random object. It accepts an optional seed value 
as argument.
The generator functions provided by the core random object are:

  - `int()` - range function that returns an integer in a defined rage.
  - `element()` - picks one random element from the provided array.

For example:

<pre><code>
  var r = random();
  r.int(100, 200); // Returns a random int in the range from 100 to 200
  r.element(['a', 'b', 'c']); // Returns one of the chars in argument array.
</code></pre>

To extend the random object with a custom generator, assign 
the generator to the `RandomLib` class defined in Core:

<pre><code>
	RandomLib.myRandGenerator = function() {
		... 
		// this.int()(); can be used here.
		... 
	};
</code></pre>

and use as <code>random().myRandGenerator()<code>.
Most modules extend the random object with custom generator.
See Common.alpha or Network.emailAddress for more details.

## Dictionaries

Module Dictionary provides functions to build dictionaries
from JavaScript arrays. The constructor function `dictionary()`
takes an array as argument and returns the dictionary object.
Currently two generator functions are provided by the dictionary 
object:

  - `list()` - a range function which returns all or a subset 
               of elements and
  - `element()` - picks a random dictionary element.

Popcorn comes with several default dictionaries for most common
names, surnames, passwords, domains etc.

## License

BSD License, see LICENSE for more information.

