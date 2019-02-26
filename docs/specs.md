<link rel="stylesheet" href="style.css">

## Functyped : About

| [Home](./README.md) | About | Usage | Install | Expand |


<div id="cols" class="cols">
	<div class="text-justified">
       <h3>Background :</h3>
The  Not-Strongly-Typed natural condition of Javascriot lets us perform fast and safe implementations, without caring too much about data types, however we all found ourselves introducing manual type checks at the entry points of our functions, to ensure the incoming data will not break the expected behaviour of those functions.
It is a tedious a task, and a simple mistake or an oversight, can lead into  nasty bugs and unexpected consequences, sometimes dificult to trace and debug. Functyped aims to provide an assortment of tools to tackle this subject, using a natural and non intrusive approach, respectful with your current coding style.
    </div>
	<div class="">
        <h3>Features :</h3>
        - Tiny (6Kb minified)<br>
        - No dependencies<br>
        - Multi enviroment & crossbrowser 
        <div class="small-text">(Node, Chrome, Firefox, Safari, Edge...)</div>
        - Multiple declaration syntax styles availables : 
        <div class="small-text">Overload / Inline / Interface</div>
        - Declarative / Imperative typechecks available<br>
        - Uses Native types identifiers
        <div class="small-text">Number / String / Boolean / Object...</div>
        - Complex typed structures supported<br>
        - Configurable<br>
        - Expandable (custom types)<br>
    </div>
</div>


---
**Supported types :**
One of the objectives in the development on Funtyped was to avoid introducing new exotic identifiers, and use instead all the currently available elements from the language, in order to keep everything simple and famiiar. 
This are the Types supported by Functyped out-of-the-box :


<table id="supported-types" align="center">
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
        <td align="center">*Any* </td>
        <td align="center">*Structured { } / [ ]*</td>
        <td align="center">*Custom*</td>
    </tr>
</table>



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