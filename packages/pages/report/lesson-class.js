import {compose} from 'recompose'
import { createContext, memo, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import {allow, VIEW_QLGD_REPORT} from 'lib/policies'
import mkQuery from 'lib/utils/mk-query'
import Shared from 'pages/report/shared'
import {
  LESSON_CLASS,
  LESSON_CLASS_KEY,
} from 'lib/i18n/translations'

const namespaces=['report']
const dataKey='v_all_lesson_class'
const titleKey=LESSON_CLASS
const descriptionKey=LESSON_CLASS
const i18nKey=LESSON_CLASS_KEY
const allowedPermissions=[VIEW_QLGD_REPORT]
const tableContext = createContext(dataKey)
const columns = [
  'tuan',
  'don_vi',
  'giang_vien',
  'ma_lop',
  'si_so',
  'thoi_gian',
  'ten_mon_hoc',
  'ma_mon_hoc',
  'magv',
  'noi_dung',
  'phong',
  'so_tiet',
  'tiet_bat_dau',
  'trang_thai',
]
const displayColumns = [
  'tuan',
  'don_vi',
  'giang_vien',
  'ma_lop',
  'ten_mon_hoc',
  'si_so',
  'thoi_gian',
]
const query = mkQuery('query', columns, dataKey)
const subscription = mkQuery('subscription', columns, dataKey)

export const getIndexProps = async ({req, apolloClient, currentUser}) => {
  const query = mkQuery('query', columns, dataKey)
  let fetchPolicy = req ? { fetchPolicy: 'network-only' } : { fetchPolicy: 'cache-first' }
  if (allow(currentUser, allowedPermissions[0])) {
    await apolloClient.query({query, ...fetchPolicy})
  }
}

const Page = ({t}) => {
  return (
    <Shared
      titleKey={titleKey} 
      descriptionKey={descriptionKey} 
      allowedPermissions={allowedPermissions}      
      tableContext={tableContext}
      namespaces={namespaces}
      dataKey={dataKey}
      i18nKey={i18nKey}
      columns={columns}
      query={query}
      subscription={subscription}
      displayColumns={displayColumns}
      t={t}
    />
  )
}

export default compose(
  memo,
  withNamespaces(['report'])
)(Page)
