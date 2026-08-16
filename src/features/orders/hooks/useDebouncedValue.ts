import { useState } from "react";

export function useDebouncedValue<T>(value:T , delay=400){
    const [debouncedValue , setDebounceValue] = useState(value)
}