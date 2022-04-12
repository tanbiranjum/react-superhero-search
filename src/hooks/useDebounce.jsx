import React, {useState, useEffect} from 'react'

function useDebounce(value, timeout, callback) {
  const [timer, setTimer] = useState(null)
  
  const clearTimer = ()=> {
    if(timer) {
      clearTimeout(timer)
    }
  }

  useEffect(()=> {
    clearTimer()
    if(value && callback) {
      const timer = setTimeout(callback, timeout)
      setTimer(timer)
    }
  }, [value])
}

export default useDebounce