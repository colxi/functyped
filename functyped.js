/*
* @Author       : colxi
* @Webpage      : github.com/colxi
* @FirstRelease : February 2020
*/


(function(){
    'use strict';

    // Detect the root object, and set the Typed API object in it
    // `window`in the browser,
    // 'self' in WebWorkers
    // `global` in Node
    let _global = typeof window === 'object' && window.self === window && window ||
        typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global;


    /*
     * _TypeTests Object : Container to store the collection off supported  
     * types , and the methods to test/identify them. More types can be added
     * using the Typed.addType() method
     */
    const _TypeTests = new Map();

    /**
     * 
     */
    const _TypeRefs = {
        /*
            [Any]     : 'Any',
            [Boolean] : 'Boolean',
            [Number]  : 'Number',
            [String]  : 'String',
            [Array]   : 'Array',
            [Function]: 'Function',
            [Promise] : 'Promise',
            [Object]  : 'Object',
            [Date]    : 'Date',
            [Symbol]  : 'Symbol',
            [Error]   : 'Error',
            [null]    : 'null',
            [undefined] : 'undefined'
        */
    };

    /*
     * getFunctionParams() : Gets a function and returns, converts it to string,
     * extracts the string representation of the parameters definitions and
     * types signatures, and generates a structured representation of it that
     * can be used later to perform the type checks
     */
    const getFunctionParams = function( func ){
        // _parse() : parses a stringified representation of function parameters
        // into a structured object. 
        function _parse(s, type='root'){
            let obj;
            if( type === 'type' ){ 
                return s;
            }else if( type === 'root' ){
                obj = {};
                let members = _getMembers(s);
                let _length = members.length;
                for(let i=0;i<_length;i++){
                    let memberName = members[i].split('=')[0].trim();
                    let memberValue = members[i].split('=')[1].trim();
                    obj[ memberName ] = _parse(memberValue, _getParamType(memberValue) );
                }
            }else if( type === 'array' ){
                obj = [];
                let members = _getMembers(  s.substr(1, s.length-2) );
                // empty arraysm ust be declared using "Array" signature instead 
                // of the '[]' representation
                if( members.length===1 && members[0]==='' ) throw new Error('Syntax Error. Use "Array" to declare generic typed arrays ( instead of "[]" )' ); 
                let _length = members.length;
                for(let i=0;i<_length;i++){
                    obj.push( _parse(members[i] , _getParamType(members[i] ) ) ); 
                }
            }else if( type === 'object' ){
                obj = {};
                let members = _getMembers(  s.substr(1, s.length-2) );
                // If an object withoit properties type has been declared using 
                // an empty {} object literal throw an error, requesting the usage of 'Object'
                if( members.length===1 && members[0]==='' ) throw new Error('Syntax Error. Use "Object" to declare generic typed Object structures ( instead of "{}" )' ); 
                let _length = members.length;
                for(let i=0;i<_length;i++){
                    let index = members[i].indexOf(':');
                    let memberName;
                    let memberValue;
                    if( index !== -1){
                        memberName  =  members[i].substr(0, index).trim();
                        memberValue = members[i].substr(index+1 ).trim();
                    }else{
                        throw new Error('Syntax error : Structured object property type in not defined.');
                    }
                    if( memberValue.length ) obj[ memberName ] = _parse(memberValue, _getParamType(memberValue) );
                }
            }
            return obj;
        }
        //  _getParamType : Analizes a stringified representation of a parameter
        // and type signature and identifies if is an Array, an Object, or a 
        // supported Type. Throws an error if non of the above are found. 
        function _getParamType(s){
            if( s[0] === '[' ) return 'array';
            else if( s[0] === '{' ) return 'object';
            else{
                if( !_TypeTests.has(s) ) throw new Error(`Unsupported type '${s}' found in type signature.`);
                return 'type';
            }
        }
        // _getMembers :Receives a stringified representation of a parameter
        // structured type signature, and extracts its keys/properties.
        function _getMembers(s){
            let last    = 0;
            let open    = 0;
            let members = [];
            let _length = s.length;
            for(let i=0;i<_length;i++){
                if( s[i] === '[' || s[i] === '{') open++;
                else if( s[i] === ']' || s[i] === '}') open--;
                else if( !open && s[i] === ','){
                    let current = s.substr(last, i-last);
                    members.push(current.trim());
                    last = i+1;
                }
            }
            let current = s.substr(last, s.length-last);
            members.push(current.trim());
            return members;
        }
        // _isArrowFunction() : Basic check to identify an arrow Function.
        function _isArrowFunction(f){
            if( typeof f === 'function' && f instanceof Function && !f.hasOwnProperty('prototype') ) return true;
            else return false;
        }

        // Convert the fnction into string, remove commets
        // and extract the parameters part of the function declaration
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let begin;
        let end;
        let str;
        if( _isArrowFunction(func) ){
            begin=1;
            end = fnStr.indexOf('=>');
            str = fnStr.substr(begin,end-begin).trim().slice(0,-1);
        }else{
            let open = 1;
            begin = fnStr.indexOf('(')+1;
            let _length = fnStr.length;
            for(let i = begin; i<_length; i++){
                if( fnStr[i] === '[' || fnStr[i] === '{' ||  fnStr[i] === '(') open++;
                else if( fnStr[i] === ']' || fnStr[i] === '}' || fnStr[i] === ')') open--;
                if( !open ){
                    end = i;
                    break;
                }
            }
            str = fnStr.substr(begin,end-begin).trim();
        }
        //Done!
        return _parse( str );
    };
    

    /*
     * _isPlainObject() : Function to test if an object is a plain object, i.e. is constructed
     * by the built-in Object constructor and inherits directly from Object.prototype
     * or null. Some built-in objects pass the test, e.g. Math which is a plain object
     * and some host or exotic objects may pass also.
     */
    const _isPlainObject = function(obj) {
        // Basic check for Type object that's not null
        if (typeof obj == 'object' && obj !== null) {
            // If Object.getPrototypeOf supported, use it
            if (typeof Object.getPrototypeOf == 'function') {
                var proto = Object.getPrototypeOf(obj);
                return proto === Object.prototype || proto === null;
            }
            // Otherwise, use internal class
            // This should be reliable as if getPrototypeOf not supported, is pre-ES5
            return Object.prototype.toString.call(obj) == '[object Object]';
        }
        // Not an object
        return false;
    };


    /*
     * _throwTypeError() : Throws and error, showing the stack trace details. If
     * the engine is set to throw warning, warning will be printed, and exection
     * will not be blocked with an Error.
     */
    const _throwTypeError = function( msg ){
        let err = new Error();
        // remove the last two levels of the stack trace
        let stack = err.stack.split('\n').slice(3).join('\n');
        // if warning mode is enabled, trhow a warning
        if(Typed.warnings){
            console.warn( `${msg}\n${stack}`);
            return false;
        }
        // ... instead, finishes execution with an Error
        throw `${msg}\n${stack}`;
    };


    /*
     * 
     */
    const _onTypeError = function(type,value,location){
        // check the failure cause and
        // output an informative error to the user

        // if is an ARRAY...
        if( type.constructor === Array ){
            if( value.constructor === Array  ){
                // both are typed structures(array)
                return _throwTypeError(`TypeError : Invalid Typed Array structure found in ${location}.`);
            }else{
                // not a typed structures (array)
                return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting a "Typed Array structure").`);
            }
        }
        // if is a PLAIN OBJECT
        else if( _isPlainObject( type ) ){
            if( _isPlainObject( value ) ){
                // both are typed structures (array)
                return _throwTypeError(`TypeError : Invalid Typed Object structure found in ${location}.`);
            }else{
                // not a typed structures (array)
                return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting a "Typed Object structure").`);
            }
        }
        // if not an Array or plan Object, and  failed the test
        // , asume is an unsupported type
        else return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting type: "${type}").`);
    };


    /**
     * 
     */
    const _typeCheck = function( value, type ){
        if( typeof type === 'string' ){
            // is SUPPORTED TYPE SIGNATURE
            if( _TypeTests.has( type ) && _TypeTests.get( type )( value ) ){
                return true;
            }else{ 
                return false;
            }
        }
        else if( type.constructor === Array ){
            // is TYPED ARRAY
            // both type and value need to be an array
            if( !value.constructor === Array ) return false;
            // ...with the same length
            if( value.length !== type.length ) return false;
            // Inspect each array index
            let _length = value.length;
            for( let i=0; i<_length; i++){
                if(!_typeCheck( value[i] , type[i] , true) ) return false;
            }
            return true;
        }
        else if( _isPlainObject( type ) ){
            // is TYPED OBJECT STRUCTURE
            // both type and value have to be a plain object
            if(  !_isPlainObject( value ) ) return false;
            // ...with same amount of properties
            if( Object.keys(type).length !== Object.keys(value).length ) return false;
            // Inspect all object properties (included non enumerable ones)
            let props = Object.getOwnPropertyNames(type);
            let _length = props.length;
            for(let i=0; i<_length;i++) if( !_typeCheck( value[ props[i] ] ,type[ props[i] ],true ) ) return false;
            return true;
        }else{ 
            // Unknown type!
            return false;
        }
    };


    /*
     * 
     */
    const _parseTypeSignature = function( type ){
        let obj;
        if(type.constructor === Array ){
            obj = [];
            if( !type.length )  throw new Error('Syntax Error. Use "Array" to declare generic typed arrays ( instead of "[]" )' ); 
            let _length = type.length;
            for(let i=0;i<_length;i++){
                obj.push( _parseTypeSignature( type[i] ) );
            }
            return obj;
        }if( _isPlainObject(type) ){
            let obj = {};
            let keys = Object.keys(type);
            if( !keys.length )throw new Error('Syntax Error. Use "Object" to declare generic typed Object structures ( instead of "{}" )' ); 
            let _length = keys.length;
            for(let i=0;i<_length;i++){
                obj[ keys[i] ] = _parseTypeSignature( type[ keys[i] ] );
            }
            return obj;
        }else{
            if( !_TypeRefs.hasOwnProperty( type ) ) throw new Error('unknown type!!!');
            return _TypeRefs[type];
        }
    };


    /*
     * Typed : Public Object, containing the methods and properties that conform
     * the library ublic API
     */
    const noReturn = Symbol('noReturn');
    const Typed = function( func  , returnType=noReturn ){
        /** VALIDATE PROVIDED FUNCTION **/
        // check if second argument is a function (typed function)
        if( typeof func !== 'function' ) throw new Error('Typed : Expecting a function in first argument');
      
        let paramObj   = getFunctionParams( func );
        let paramNames = Object.keys( paramObj );
        let paramTypes = paramNames.map( (a,i)=> paramObj[ paramNames[i] ] );

        let returnObj;
        let checkReturn = false; 
        if(returnType !== noReturn){
            checkReturn = true;
            returnObj = _parseTypeSignature( returnType );
        }
        // 
        // Return the function typecheck decorator
        //
        return function(...args){
            // validate arguments: iterate the provided arguments
            if( args.length !== paramTypes.length ){
                _throwTypeError(`Typed : Function Expects ${paramTypes.length} arguments, instead ${args.length} where provided`);
            }
            // test the arguments against the typesignatures
            let _length = args.length;
            for(let i=0; i<_length;i++){
                if( !_typeCheck( args[i], paramTypes[i] ) ){
                    _onTypeError(paramTypes[i], args[i],  'argument ' + (i+1) );
                }
            }
            // call the function
            let result = func.bind(this)(...args);
            // validate return value if required and type is not 'Any'
            if( checkReturn && returnObj !== Any ){
                if( !_typeCheck(result, returnObj ) ){
                    _onTypeError(returnObj, result,  'return value' );
                }
            }
            // done!!
            return(result);
        };
    };


    // if warnings is set to true, the engine will only display warnings
    // when types mismatchs are detected (instead of Errors)
    Typed.warnings  = false;


    /**
     * Add new types to the supportes types collection
     * 
     */
    Typed.addType = function(name , test){
        if( _TypeTests.has(name) ){
            console.log('Typed.addType() : Provided type already exists.');
            return false;
        }
        _TypeTests.set(name, test);
        // if no reference with the provided name exists in the global scope
        // generate one using a symbol
        if( !_global.hasOwnProperty(name) )  _global[name] =  Symbol('_type.'+name);
        
        if( !_TypeRefs.hasOwnProperty( _global[name] ) ) _TypeRefs[  _global[name] ] = name;

        return true;
    };


    /**
     * 
     */
    Typed.function = function( ...args ){
        //
        return Typed( ...args );  
    };


    /**
     * 
     */
    Typed.test= function( value , type){ 
        let _type = _parseTypeSignature( type );
        return _typeCheck(value,_type);
    };

  
  
    // Add builtin type tests
    Typed.addType( 'Any'       , ()=>{ return true } );
    Typed.addType( 'Boolean'   , x=>{ return typeof x === 'boolean' } );
    Typed.addType( 'Number'    , x=>{ return typeof x === 'number' } );
    Typed.addType( 'String'    , x=>{ return typeof x === 'string' } );
    Typed.addType( 'Array'     , x=>{ return x.constructor === Array } );
    Typed.addType( 'Function'  , x=>{ return typeof x === 'function' } );
    Typed.addType( 'Promise'   , x=>{ return !!x && (typeof x === 'object' || typeof x === 'function') && typeof x.then === 'function' } );
    Typed.addType( 'Object'    , x=>{ return x && typeof x === 'object' } );
    Typed.addType( 'Date'      , x=>{ return x instanceof Date } );
    Typed.addType( 'Symbol'    , x=>{ return typeof x === 'symbol' } );
    Typed.addType( 'Error'     , x=>{ return x instanceof Error } );
    Typed.addType( 'null'      , x=>{ return !x && typeof x === 'object' } );
    Typed.addType( 'undefined' , x=>{ return typeof x === 'undefined' } );


    // make Typed accesible (set in global scope)
    _global.Typed = Typed;

})();

  
  
  