import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'

export default () => {
  const ref = useRef(null)

  useEffect(() => {
    mount(ref.current, { isMemoryHistory: true })
  }, [])

  return <div ref={ref} />
}
