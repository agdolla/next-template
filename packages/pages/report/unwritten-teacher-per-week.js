import { memo, createContext } from 'react'
import { compose } from 'recompose'
import { withNamespaces } from 'react-i18next'
import {allow, VIEW_QLGD_REPORT} from 'lib/policies'
import withContextProvider from 'lib/hocs/with-context-provider'
// layout + routing
import Layout from 'containers/layout-router'
import Grid from 'components/grids/report'
// i18n 
import {
  UNWRITTEN_TEACHER_PER_WEEK,
  UNWRITTEN_TEACHER_PER_WEEK_KEY,
} from 'lib/i18n/translations'
// gql
import {
  FullPageQuery,
  unwrittenTeacherPerWeekQuery as query, 
  unwrittenTeacherPerWeekSubscription as subscription
} from 'pages/report/unwritten-teacher.gql'

// shared components
import LiveComponent from 'containers/live-component'
import DataTable from 'components/datatables/mui-wrapper'

const namespaces=['report']
const dataKey='v_total_teacher_do_not_write_in_week'
const titleKey=UNWRITTEN_TEACHER_PER_WEEK
const descriptionKey=UNWRITTEN_TEACHER_PER_WEEK
const i18nKey=UNWRITTEN_TEACHER_PER_WEEK_KEY
const allowedPermissions=[VIEW_QLGD_REPORT]
const metaContext = createContext(titleKey)
const tableContext = createContext(dataKey)

export const getIndexProps = async ({apolloClient, currentUser}) => {
  if (allow(currentUser, allowedPermissions[0])) {
    const {data} = await apolloClient.query({query: FullPageQuery})
    return {
      meta: data.meta
    }
  }
}

const Page = ({t}) => {
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
            metaContext={metaContext}
            i18nKey={i18nKey}
          />
        </LiveComponent>
      </Grid>
    </Layout>
  )
}
  
export default compose(
  withContextProvider(metaContext),
  memo,
  withNamespaces(namespaces)
)(Page)