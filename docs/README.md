<link rel="stylesheet" href="style.css">
| [Home](./README.md) | [Usage](./usage.md) | Install | [Types](./types.md)  |

## Functyped


Automatic real time **static type-checking** for Javascript functions through declarative syntax. This library provides  complete support to the language native data-types / primitives,  as well as to complex typed structures and custom types. 


---

<div id="cols" class="cols">
	<div class="text-justified">
The  Not-Strongly-Typed natural condition of Javascriot lets us perform fast and safe implementations, without caring too much about data types, however we all found ourselves introducing manual type checks at the entry points of our functions, to ensure the incoming data will not break the expected behaviour of those functions.
It is a tedious a task, and a simple mistake or an oversight, can lead into  nasty bugs and unexpected consequences, sometimes dificult to trace and debug. Functyped aims to provide an assortment of tools to tackle this subject, using a natural and non intrusive approach, respectful with your current coding style.
    </div>
	<ul class="features">
        <li>Tiny (6Kb minified)</li>
        <li>No dependencies</li>
        <li>Multi enviroment & crossbrowser 
          <div class="small-text">Node, Chrome, Firefox, Safari, Edge</div>
        </li>
        <li>Multiple syntax styles available : 
          <div class="small-text">Overload / Inline / Interface</div>
        </li>
        <li>Declarative / Imperative typechecks</li>
        <li>Uses Native types identifiers
          <div class="small-text">Number / String / Boolean / Object...</div>
        </li>
        <li>Complex typed structures supported</li>
        <li>Configurable</li>
        <li>Expandable (custom types)</li>
    </ul>
</div>

---


**Example of implicit type check :**

```javascript
import './functyped.js';

// Declare your function  as you normally do
function stringCompare(a,b){
	return a==b
};

// Use the typefunction Constructor to declare the types signature 
// overloading your original function.
stringCompare = Typed.function( [ String, String ] , stringCompare ,  Boolean);

/* DEMO */
stringCompare( 'foo', 'bar'); 
// returns true;
stringCompare( 'foo', false); 
// TypeError : Invalid type found in argument 2. (Expecting "Number").
stringCompare( 'foo' ); 
// TypeError : Function expects 2 arguments. (1 provided)
```


**Example of explicit type check :**
```javascript
// declare a regular function
function myFunc(a,b,c){
	// perform an explicit type check for the provided arguments
	Typed.validate( arguments, [String,Number, Boolean] );
	console.log(a,b,c);
	return true;
}

myFunc('foo', 12, true);
// passes the explicit type checks


**Example of safe type chek :**
```javascript
// declare a regular function
function myFunc(a,b,c){
	// perform a safe type check for the provided arguments
	let result =  Typed.test( arguments, [String,Number, Boolean] );
	console.log(a,b,c);
	return result;
}

myFunc('foo', 12, true);
// passes the explicit type checks, an d returns true


```