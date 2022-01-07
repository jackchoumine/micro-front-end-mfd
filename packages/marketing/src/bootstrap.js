import React from 'react'
import ReactDOM from 'react-dom'
import { createMemoryHistory, createBrowserHistory } from 'history'
import App from './App'

// Mount function to start up the app
const mount = (el, { onChildNavigate, defaultHistory, currentPathParent }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [currentPathParent],
    })
  const { pathname: currentPathChild } = history.location
  // NOTE 浏览器刷新，应用会重新挂载，此时要保持路径和当前路径一致
  if (currentPathParent && currentPathChild && currentPathParent !== currentPathChild) {
    console.log('child history.push', currentPathParent)
    history.push(currentPathParent)
  }

  onChildNavigate && history.listen(onChildNavigate)

  ReactDOM.render(<App history={history} />, el)

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location

      nextPathname && pathname !== nextPathname && history.push(nextPathname)
    },
  }
}

// We are running through container
// and we should export the mount function
export { mount }
