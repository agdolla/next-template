import {useContext} from 'react'
import { withFormik } from 'formik'
import Select from 'react-select'
import {MembershipsContext} from 'containers/contexts'
import Button from '@material-ui/core/Button';
import dynamic from 'next/dynamic'
const RolesInfo = () => {
  return (
    <>

    </>
  )
}

const formikEnhancer = withFormik({
  mapPropsToValues: props => ({
    user_id: '',
    role_ids: [],
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const payload = {
      user_id: values.user_id.value,
      role_ids: values.role_ids.map(t => t.value),
    };
    setTimeout(() => {
      alert(JSON.stringify(payload, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'MyForm',
});

const MembershipsForm = props => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldTouched,
    isSubmitting,    
  } = props;

  const options = useContext(MembershipsContext)


  const onChange = (e, value) => {
    const tmpRoles = options.roles.filter(function(item) {
      return value.roles.includes(item.label)
    })
    values.role_ids = tmpRoles
    setFieldValue(e, value)
  }

  let UserDetail = null

  if (values.user_id) {
    UserDetail = dynamic(import('components/forms/user-detail'))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="user_id" style={{ display: 'block' }}>
        Email
      </label>
      <MySelect
        value={values.user_id}
        onChange={onChange}
        onBlur={setFieldTouched}
        error={errors.user_id}
        touched={touched.user_id}
        options={options.users}
        fieldName={'user_id'}
      />
      
      { values.user_id ? (
        <>
        <label htmlFor="role_ids" style={{ display: 'block' }}>
          Roles
        </label>
        <MySelect
          value={values.role_ids}
          onChange={setFieldValue}
          onBlur={setFieldTouched}
          error={errors.role_ids}
          touched={touched.role_ids}
          options={options.roles}
          fieldName={'role_ids'}
          isMulti
        />
        </>)  : null }
     
      <Button variant="contained" color="secondary"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}>        
        Reset
      </Button>

      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
        Submit
      </Button>

      { values.user_id ? <UserDetail detail={values.user_id.detail} /> : null}
    </form>
  );
};


class MySelect extends React.Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange(this.props.fieldName, value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur(this.props.fieldName, true);
  };

  render() {
    const { options, isMulti } = this.props
    return (
      <div style={{ margin: '1rem 0' }}>
        <Select
          id="color"
          options={options}
          isMulti={isMulti}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error &&
          this.props.touched && (
            <div style={{ color: 'red', marginTop: '.5rem' }}>{this.props.error}</div>
          )}
      </div>
    );
  }
}

export default formikEnhancer(MembershipsForm);