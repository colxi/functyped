console.log('Disabling functyped... ('+Typed.__fn__+' functions still have wrappers)', Typed)
if(Typed) Typed.enabled = false;