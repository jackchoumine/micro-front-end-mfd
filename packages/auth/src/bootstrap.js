import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory, createMemoryHistory } from 'history'
import App from './App'

// Mount function to start up the app
const mount = (el, { onSignIn, onChildNavigate, defaultHistory, currentPathParent }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [currentPathParent],
    })

  const { pathname: currentPathChild } = history.location
  // NOTE 浏览器刷新，应用会重新挂载，此时要保持路径和当前路径一致
  if (currentPathParent && currentPathParent !== currentPathChild) {
    console.log('child history.push', currentPathParent)
    history.push(currentPathParent)
  }

  onChildNavigate && history.listen(onChildNavigate)

  ReactDOM.render(<App onSignIn={onSignIn} history={history} />, el)

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location

      nextPathname && pathname !== nextPathname && history.push(nextPathname)
    },
  }
}

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const el = document.getElementById('_auth-dev-root')
  const history = createBrowserHistory()
  function onSignIn(user) {
    console.log('sign in', user)
  }
  el && mount(el, { defaultHistory: history, onSignIn })
}

// We are running through container
// and we should export the mount function
export { mount }
