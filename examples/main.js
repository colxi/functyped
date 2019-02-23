import '../functyped.js';


// OVERLOAD SYNTAX

//declare your function normaly
function myFunc(a,b){
	return a===b;
};
// perform overloading
myFunc = Typed.function(  [ Number, Number ] , myFunc, Boolean );

myFunc(6,8); // returns false


// INLINE SYNTAX

// declare the typed function
var myFunc2 = Typed.function( [ Number, Number ] , (a,b)=>{
	return a===b;
}, Boolean );


myFunc2(6,8); // returns false



// INTERFACES SINTAX

Typed.interface( [ Number, Number ] , 'myFunc3' ,  Boolean);

// declare a function using the interface id as the function name
function myFunc3(a,b){ return a===b }
// Perform overloading (but it could be declared inline instead)
myFunc3 = Typed.function( myFunc3 );

myFunc3(6,8); // returns false


