import { Navigate } from 'react-router-dom'
import { ComponentType, useContext } from 'react'
import { AppContext } from 'src/Context/app.context'

// const isAuthenticated = true
export const withProtectedRoute = <P extends object>(Component: ComponentType<P>): React.FC<P> => {
  const ProtectedRoute: React.FC<P> = (props) => {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Component {...props} /> : <Navigate to='/auth' />
  }

  return ProtectedRoute
}

export const withRejectedRoute = <P extends object>(Component: ComponentType<P>) => {
  const RejectedRoute: React.FC<P> = (props) => {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Component {...props} /> : <Navigate to='/admin' />
  }

  return RejectedRoute
}
