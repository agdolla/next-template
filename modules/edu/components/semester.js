import { Table } from 'antd';
import AgeSelector from 'modules/edu/components/age-selector'
import TimePicker from 'modules/edu/components/time-picker'
import {usePageContext} from 'modules/edu/contexts'

const columns = (agesOptions) => [{
  title: 'Activity',
  dataIndex: 'activity',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: 'Start time',
  dataIndex: 'start_time',
  render: time => <TimePicker time={time} />
}, {
  title: 'End time',
  dataIndex: 'end_time',
  render: time => <TimePicker time={time} />
}, {
  title: 'Age',
  dateIndex: 'age_id',
  render: currentAge => <AgeSelector defaultValue={currentAge} agesOptions={agesOptions} />
}
];

const testData = [{
  key: '1',
  activity: 'Don tre',
  start_time: '08:30',
  end_time: '10:00',
  age_id: 1,
}];

const Semester = () => {  
  const {sche_ages} = usePageContext()
  return (
    <Table columns={columns(sche_ages)} dataSource={testData} />
  )
}

export default Semester
