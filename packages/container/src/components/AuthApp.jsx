import { mount } from 'auth/AuthApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default ({ onSignIn }) => {
  const ref = useRef(null)
  const history = useHistory()

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      currentPathParent: history.location.pathname,
      onChildNavigate: ({ pathname: nextPathname }) => {
        const { pathname } = history.location

        nextPathname && pathname !== nextPathname && history.push(nextPathname)
      },
      onSignIn,
    })

    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
