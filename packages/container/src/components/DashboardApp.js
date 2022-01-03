import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      isMemoryHistory: true,
      basePath: '/dashboard',
      currentPath: history.location.pathname,
    })
    console.log('container dashboard')
    // history.listen((location) => {
    //   console.log('dashboard location')
    //   console.log(location)
    // }) //onParentNavigate
    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
