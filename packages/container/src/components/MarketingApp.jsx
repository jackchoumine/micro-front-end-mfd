import { mount } from 'marketing/MarketingApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default () => {
  const ref = useRef(null)
  const history = useHistory()

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      currentPathParent: history.location.pathname,
      onChildNavigate: ({ pathname: nextPathname }) => {
        console.log('marketing react: ', nextPathname)
        const { pathname } = history.location

        nextPathname && pathname !== nextPathname && history.push(nextPathname)
      },
    })

    history.listen(onParentNavigate)
  }, [])

  return <div ref={ref} />
}
