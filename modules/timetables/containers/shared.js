import {memo, createContext} from 'react'
import Layout from 'containers/layout-router'
import dynamic from 'next/dynamic'
import { withNamespaces } from 'react-i18next'
import { compose } from 'recompose'
import isAllowed from 'lib/utils/is-allowed'
import mkQuery from 'lib/utils/mk-query'
import {VIEW_TIMETABLE} from 'modules/timetables/policies'
const Grid = dynamic(import('components/grids/report'))
const LiveComponent = dynamic(import('containers/live-component'))
const Calendar = dynamic(import('modules/timetables/components/calendar'))

export const makeInitialProps = (columns, dataKey, allowedPermissions=[VIEW_TIMETABLE]) => {
  const query = mkQuery('query', columns, dataKey)
  const subscription = mkQuery('subscription', columns, dataKey)
  return {
    getIndexProps: async ({req, apolloClient, currentUser}) => {
      let fetchPolicy = req ? { fetchPolicy: 'network-only' } : { fetchPolicy: 'cache-first' }
      if (isAllowed({currentUser, allowedPermissions})) {
        await apolloClient.query({query, ...fetchPolicy})
      }
    },
    query,
    subscription,
  }
}

const Shared = ({
  t, titleKey, descriptionKey, allowedPermissions=[VIEW_TIMETABLE], namespaces=['timetables'], dataKey, i18nKey, columns, query, subscription, displayColumns
}) => {
  const tableContext = createContext(dataKey)
  return (
    <Layout
      title={t(titleKey)}
      description={t(descriptionKey)}
    >
      <Grid>
        <LiveComponent
          allowedPermissions={allowedPermissions}
          query={query}
          subscription={subscription}
          context={tableContext}
        >
          <DataTable 
            namespaces={namespaces}
            dataKey={dataKey}
            tableContext={tableContext}
            i18nKey={i18nKey}
            columns={columns}
            displayColumns={displayColumns}
          />
        </LiveComponent>
      </Grid>
    </Layout>
  )
}

export default compose(
  memo,
  withNamespaces(['timetables'])
)(Shared)