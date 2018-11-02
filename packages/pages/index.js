import { memo } from 'react'
import AppLayout from 'containers/layouts/app'
import DndTest from 'components/dnd-test'
import AgTest from 'components/datatables/ag-test'
import UserTest from 'containers/authenticated/user-info'
import Suspense from 'containers/suspense'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const IndexPage = () =>
  <AppLayout
    title='Home page'
    description='Simple things'
  >
    <>
    <UserTest />
    <Suspense loadPath={() => import('components/sms/facebook')} />
    <div
      id="grid1"
      className="ag-theme-balham"
      style={{ marginTop: '10px', height: '20rem', width: '100%' }}
    >
      
      
      <AgTest />

    </div>
    
    <DndTest />
    </>
  </AppLayout>

export default memo(IndexPage)
