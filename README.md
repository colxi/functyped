## Functyped : Static types for JS functions

Automatic runtime  **static type-checking** for javascript functions through declarative syntax, providing  complete support to the most **common types** ,  as well as to complex **typed structures** and **custom types**.

```javascript
import {Typed} from './functyped.js';

// declare a typed functioin that expects a Number 
// and a String as arguments 
const myFunc = Typed( (a=Number , b=String) => {
    console.log( a , b );
})

myFunc( 12, 12 );
// TypeError : Invalid type found in argument 2. 
// (Expecting type: "String").
```

## Features
- Highly performant (x50 faster after version v2.0.0)
- Tiny (6Kb minified)
- No dependencies
- Multi enviroment & crossbrowser (Node, Chrome, Firefox, Safari, Edge...)
- Declarative syntax (type signatures as default parameter values)
- Complex typed structures supported
- Expandable (custom types)

**Supported types :**

The following  `types` are supported out-of-the-box :

<table align="center">
    <tr>
        <td align="center">Boolean</td>
        <td align="center">Number</td>
        <td align="center">String</td>
        <td align="center">Array</td>
    </tr>
    <tr>
        <td align="center">Function</td>
        <td align="center">Object</td>
        <td align="center">Symbol</td>
        <td align="center">Promise</td>
    </tr>
    <tr>
        <td align="center">Date</td>
        <td align="center">Error</td>
        <td align="center">undefined</td>
        <td align="center">null</td>
    </tr>
    <tr style="font-weight: bold; font-style: italic;">
        <td align="center">Any</td>
        <td align="center">Struct [...]</td>
        <td align="center">Struct {...}</td>
        <td align="center">Custom</td>
    </tr>
</table>

> You can find information about the special types from this last row in this documentation.


## Package distribution 

**Npm** : Install using... 
```
$ npm install functyped -s
```

**Git** : Clone from Github...
```
$ git clone https://github.com/colxi/functyped
```
**Hotlink** : Add in your HTML head (not recomended for production enviroments):
```
<script src="https://colxi.github.io/functyped/main.js"></script>
```

### Importing 
The library can be imported using ES6 `import`
``` javascript
import {Typed} from './functyped.js';
```

Or using  Node `require`

```javascript
const Typed = require('functyped');
```

As alternative method, you can include in your header the following script, and the `Typed` global variable will be created.
```
<script src="path_to_functyped/main.js"></script>
```


---
## Syntax
```
Typed( functionDeclaration [,returnType] )
```

**Parameters** :
- `functionDeclaration` : Function to be type typechecked. Parameters types must be declared using 'default parameter values' 
- `returnType` : (Optional) Type for the function return value.

**Returns** :
Function with automatic type checking

> When declaring typed `arrow functions` you may prefer to use the  available alias method found in  `Typed.function()` to keep you code more semantycal. 


## Typed structures
The typecheck engine comes with the most common type checks out-of-the-box. They can be used individually to perform single tests, but can also be used to define **complex structures**, and perform complex checks. The two supported structures are :

 - `Typed Objects Structure` : Objects with typed properties.
 - `Typed  Array Structured` : Arrays with typed keys.
 
 Combinations of the previous `typed structured` are allowed, as well as unlimited levels of nesting.


```javascript
// EXAMPLE 1:  
// declare a function that expects an Object as argument. 
// The object contains a property called 'name' (String) 
// and a property called 'age' (Number).
const sayHi = Typed( ( user={name:String, age:Number} )=>{
    console.log('Hi' + user.name + '!');
} );
sayHi( { name : 'Phil', age: 23 } );

// EXAMPLE 2: 
// Declare a function that expects a Number as a first 
// argument, and an array with two Numbers in the second 
// argument.
const drawCircle = Typed( ( rad=Number , coords=[Number,Number] )=>{
    console.log('Draw a circle with radius', rad, 'at coordinates', coords);
});
drawCircle( 66 , [97,28] );
```


> Important : **The checks performed in Typed Structures are strict, with the provided type signature. In the case of the Typed Arrays, the Array provided in the function call, must contain the same ammount of keys as the one provided in the type signature, to pass the check. The same happens with the objects, where the passed object must contain the same keys found in the Structured Objetc type signature.

> Tip : If you want to handle Objects and Arrays, in a more permisive way, use generic 'Object' and 'Array' type signature instead of  '[...]' and '{...}' 


## Adding Custom types
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

By default the engine will trigger an `Error`, stopping the execution, when a type mismatch is found, however you can disable the Error triggering, enabling the  `Warning mode`. 

```
Typed.warnings = true | false
```






## Changelog
v2.0.2 :
- Replace Array.isArray for .constructor === Array (gained 5% performance)
- Replace Types test container from Object to Map ( Gained 5% performqnce)
- Refactored code (gainer 10% performance)
- Other Minor performance optimizations
- Deprcated Typed.validate()


v2.0.0 :
- Removed Interfaces
- Removed explicit bindig (automatic binding is performed)
- Bugfix : Fixed exception retrieving Type name for : undefined, null and Any
- Return value check , becomes optional

v1.2.2
- Improved performance (x10) , using Map() to store Types instead of Object{}
- Improved error messages