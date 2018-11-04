import useAuth from 'lib/hooks/auth'
import {useApolloMutation} from 'lib/hooks/apollo'
import {LOGOUT} from 'components/auth/google-login.gql'
import {CURRENT_USER_SUBSCRIPTION, REFRESH_TOKEN_MUTATION} from 'containers/authentication.gql'
import isEqual from 'react-fast-compare'
import useLocalStorage from 'lib/hooks/local-storage'

function sorted(user) {
  return {
    user_id: user.user_id,
    roles: user.roles.sort(),
    permissions: user.permissions.sort(),
  }
}

const useSubscriptionAuth = () => {
  const { currentUser, isAuthenticated } = useAuth()
  const [_, setValue, removeItem] = useLocalStorage('token')
  const logout = useApolloMutation(LOGOUT)
  
  const onSubscriptionData = (refresh) => async (newData) => {
    if (newData) {
      const newUser = newData.subscriptionData.data.currentUser
      const isUser = newUser.roles.includes('user')
      const isGuest = newUser.roles.includes('guest')
      if (!isGuest) {
        if (isAuthenticated && !isUser){
          await logout()
          removeItem("token")
        } 
        if (isUser) {
          if (!isEqual(sorted(currentUser), sorted(newUser) )) {
            const res = await refresh()
            setValue(res.data.refresh.token)          
          }
        }
      }
    }
  }

  return {
    currentUser,
    onSubscriptionData,
    currentUserSubscription: CURRENT_USER_SUBSCRIPTION,
    refreshTokenMutation: REFRESH_TOKEN_MUTATION,
  }
}

export default useSubscriptionAuth