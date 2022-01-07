import React from 'react'
import ReactDOM from 'react-dom'
import { createMemoryHistory } from 'history'
import App from './App'

// Mount function to start up the app
const mount = (el, { onSignIn, onChildNavigate, defaultHistory, currentPathParent }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [currentPathParent],
    })

  onChildNavigate && history.listen(onChildNavigate)

  ReactDOM.render(<App onSignIn={onSignIn} history={history} />, el)

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
