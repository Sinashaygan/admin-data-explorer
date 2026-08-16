import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value:T , delay=400){
    const [debouncedValue , setDebounceValue] = useState(value)

    useEffect(()=>{
        const timeoutId = window.setTimeout(()=>{
            setDebounceValue(value)
        }, delay)

        return ()=>{window.clearInterval(timeoutId)}
    },[value , delay])

    return debouncedValue
}