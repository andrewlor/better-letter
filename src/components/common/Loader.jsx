import React, { useRef, useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar'

export default ({ isLoading }) => {
    const ref = useRef(null)

    useEffect(() => {
        if (isLoading) {
            ref.current.continuousStart()
        } else {
            ref.current.complete()
        }
    }, [isLoading])

    return <LoadingBar color="#6ea5ff" height={5} ref={ref} />
}
