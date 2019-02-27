
## Binding
In some circunstances , you will need to bind your function to a specific context, and the `binding` parameter lets you accomplish that.

> Note : Binding is not possible when arrow functions are used.

Example for each declaration approach :

```javascript
// Declare the context to be used for binding
let myObj = {  myProp : 123 };

/* OVERLOAD DECLARATION WITH BINDING */
let myFunc = function(a){ return a===this.myProp; };
myFunc = Typed.function( Number , myFunc, Boolean , myObj );
myFunc(123); // returns true

/* INLINE DECLARATION WITH BINDONG */
let myFunc = Typed.function( Number  , function(a){
  return a===this.myProp;
} , Boolean , myObj );
myFunc(123); // returns true

/* INTERFACED DECLARATION WITH BINDONG */
Typed.interface( Number, 'myInterface' , Boolean );
let myFunc = function myInterface(a){ return a===this.myProp };
myFunc = Typed.function( myFunc, myObj );
myFunc(123); // returns true

```

## Imperative type checks
If you prefer to perform the checks manualy, inside your functions there is a method available for it. If type check does not pass, an Error is thrown and execution stopped.

```
Typed.validate( values, types );
```
**Parameters** :
- `values`  : Values to be type-checked. If more than one is provided, they must be enclosed inside an Array.
- `types` :  Expected Types for each provided value. If more than one type is provided, they must be enclosed inside an Array 

**Usage** :
```javascript
myFunction(a,b,c){
	// validate the function argument types (error if fails)
	Typed.validate( arguments, [String, Boolean, Number] );
    /* rest of the function */
    return;
}
```
> Note : `Typed.validate()` is not affected by the `Typed.enabled` directive.

## Safe type checks
You can test value types, to check if they match the expected type, using the `Typed.test()` method. No errors are thrown when testing, instead a `Boolean` value is returned, indicating if the test was succesfull or failed instead.

```
Typed.test( values, types );
```

**Parameters** :
- `values`  : Values to be type-checked. If more than one is provided, they must be enclosed inside an Array.
- `types` :  Expected Types for each provided value. If more than one type is provided, they must be enclosed inside an Array 

**Usage** :
```javascript
Typed.test( 123, Number ); // returns true
Typed.test( [123, 456] , [Number,Boolean] ); // returns false
```

## Adding new Types
Using the `Typed.addType()` method , more types can be added easilly.

```
Typed.addType( type , test )
```
**Arguments :**
- `type` : Reference representing the new Type (Constructor, String, Symbol...)
- `test` : Function that will perform the test, and return a Boolean

**Example :**
```javascript
// adding a browser native object
Typed.addType( HTMLElement , x=> x instanceof HTMLElement );

// adding a custom type
const Integer = Symbol('Integer');
Typed.addType( Integer , x=> Number.isInteger(x) );

```
## Configuration
Two properties are provided to modify the type check engine behavior

```
Typed.enabled = true | false
```

**Enable/disable the full engine** ; You can disable the type checks by setting this property to false. If is set to false before any function is declared , your code will not suffer from the type check performance lose.

```
Typed.warings = true | false
```
**Enable/disable notifiacion mode** : If enabled, no Errors will be thrown and informative warning will be triggered instead.

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


## Performance


Because of the loosely typed nature of javascript, no type check is performed at compilation time. It is the developer who needs to perform those checks by their own, at execution time. 

> A continuous check on the used variables values comes obviously with a performance penalty, especially when it's widespread.

A system able to automatize this task in your functions requires the usage of wrappers over those functions, which, in turn, also adds another layer of performance reduction.

Personally, I think an automated type-check system can be especially useful in development enviroments, but should be disabled in **demanding production enviroments**.

The `Typed.enabled` property allows to completelly disable the type-checks without affecting the behavior of your code, and giving back the native execution performance. 
**It is important to understand that it is necessary to disable the engine before any function is declared, otherwise the function wrappers will still be generated.**

Since the imperative type-check method (`Typed.validate()`) is not affected by the `Typed.enabled` directive, it still can be used to perform critical type checks, in scenarios where type-checking is mandatory (like user input validation)

In result, you can enjoy a complete static type check experience, without any performance downside, or code style pollution (thanks to overload declaration syntax)

Performance tests : https://jsperf.com/functyped/