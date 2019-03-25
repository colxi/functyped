## Functyped : Static types for JS functions

Automatic **static type-checking** for javascript functions through declarative syntax, providing  complete support to the language native data-types / primitives,  as well as to complex typed structures and custom types.

```javascript
import 'functyped.js';

// declare a typed functioin that expects a Number 
// and a String as arguments 
const myFunc = Typed( (a=Number , b=String) => {
	console.log( a , b );
})

myFunc( 12, 12 );
// TypeError : Invalid type found in argument 2. 
// (Expecting type: "String").
```

**Characteristics & features :**
- Highly performant (v2.1 is x50 faster than previous release)
- Tiny (6Kb minified)
- No dependencies
- Multi enviroment & crossbrowser (Node, Chrome, Firefox, Safari, Edge...)
- Declarative syntax
- Complex type structures supported
- Expandable (custom types)

**Supported types :**

<table align="center">
    <tr>
        <td align="center">Boolean</td>
        <td align="center">Number</td>
        <td align="center">String</td>
        <td align="center">Array</td>
        <td align="center">Function</td>
    </tr>
    <tr>
        <td align="center">Object</td>
        <td align="center">Symbol</td>
        <td align="center">Promise</td>
        <td align="center">Date</td>
        <td align="center">Error</td>
    </tr>
    <tr>
        <td align="center">undefined</td>
        <td align="center">null</td>
        <td align="center">*Any</td>
        <td align="center">*Structures</td>
        <td align="center">*Custom</td>
    </tr>
</table>



## Package distribution 

Install using Npm :
```
$ npm install functyped
```

Clone with Git :
```
$ git clone https://github.com/colxi/functyped
```
Add to your HTML head :
```
<script src="https://colxi.github.io/functyped/functyped.js"></script>
```

The library can be imported using ES6 `import`, and Node `require`. In both cases no assignment needs to be performed, the global object `Typed		` is created automatically.

---
### Syntax
```
Typed( functionDeclaration [,returnType] )
```

**Parameters** :
- `functionDeclaration` : Function to be type typechecked. Parameters types must be declared using 'default parameter values' 
- `returnType` : Optional. Type for the function return value.

> If you prefer is also available an alias to this constructor, using  the same syntax, in :  Typed.function()


**Returns** :
Function with automatic type checking


## Typed structures
The type-check engine comes with the most common types checks implemented. They can be used to perform single tests, but can also be used to define complex structures, and perform complex checks.


```javascript
// EXAMPLE 1:  declare a function that expects an Object as argument. The object contains a property called 'name' (String) and a property called 'age' (Number).
const sayHi = Typed( ( user={name:String, age:Number} )=>{
	console.log('Hi' + user.name + '!');
} );
sayHi( { name : 'Phil', age: 23 } );

// EXAMPLE 2: Declare a function that expects a Number as a first argument, and an array with two Numbers in the second argument.
const drawCircle = Typed( ( rad=Number , coords=[Number,Number] )=>{
	console.log('Draw a circle with radius', rad, 'at coordinates', coords);
});
draw( 66 , [97,28] );



```
As you can see in the example, `Typed Objects Structure` and `Typed  Array Structured` are supported, as well as unlimited nesting. The structures can be as complex as you need.

> **The type checks performed in both Typed Structures are strict in the sense that Array length / Object structure (keys) must match, in order to pass the checks.** If you want to handle Objects and Arrays, in a more permisive way, use generic 'Object' and 'Array' type signature instead of  '[...]' and '{...}' 


## Adding new Types
Using the `Typed.addType()` method , more types can be added easilly.

```
Typed.addType( typeName , test )
```
**Arguments :**
- `typeName` : String with the name of the new type
- `test` : Function that will perform the test, and return a Boolean

**Example :**
```javascript
// adding a custom type : HTMLElement
Typed.addType( 'HTMLElement' , x=> x instanceof HTMLElement );

// adding a custom type : Integer
Typed.addType( 'Integer' , x=> Number.isInteger(x) );
```
When a new type is added, the engine declares a reference to it in the global scope (if it doesnt exist already), to ensure that the new type can be used anywhere.

```javascript
// declare a custom type : Integer
Typed.addType( 'Integer' , x=> Number.isInteger(x) );
// Use the new type in a typed function
const myFunc = Typed( (a=Integer) => {
	console.log( a );
})
// call your function
myFunc(12);
```


## Disable errors


```
Typed.warings = true | false
```
**Enable/disable notifiacion mode** : If enabled, no Errors will be thrown and informative warning will be triggered instead.





### Changelog
v2.0.2 :
- Replace Array.isArray for .constructor === Array (gained 5% performance)
- Replace Types test container from Object to Map ( Gained 5% performqnce)
- Refactored code (gainer 10% performance)
- Other Minor performance optimizations

v2.0.0 :
- Removed Interfaces
- Removed explicit bindig (automatic binding is performed)
- Bugfix : Fixed exception retrieving Type name for : undefined, null and Any
- Return value check , becomes optional

v1.2.2
- Improved performance (x10) , using Map() to store Types instead of Object{}
- Improved error messages