import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    mount(ref.current, { isMemoryHistory: true, basePath: '/dashboard' })
    history.listen((location) => {
      console.log(location)
    }) //onParentNavigate
  }, [])

  return <div ref={ref} />
}
