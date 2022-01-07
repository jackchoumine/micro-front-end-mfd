import { mount } from 'dashboard/DashboardApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default ({ isSignedIn, user }) => {
  const ref = useRef(null)
  const history = useHistory()
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      isMemoryHistory: true,
      basePath: '/dashboard',
      currentPath: history.location.pathname,
      onNavigate: (nextPathname) => {
        const { pathname } = history.location
        if (pathname !== nextPathname) {
          console.log('vue 子应用跳转', nextPathname)
          history.push(nextPathname)
        }
      },
      sharedData: { isSignedIn, user },
    })
    console.log('container dashboard navigate')
    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
