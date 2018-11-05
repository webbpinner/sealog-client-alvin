import moment from 'moment';
import Datetime from 'react-datetime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row, Tooltip, OverlayTrigger} from 'react-bootstrap';
import * as actions from '../actions';

const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm"

class UpdateLowering extends Component {

  componentWillMount() {
    // console.log(this.props);
    if(this.props.loweringID) {
      this.props.initLowering(this.props.loweringID);
    }
  }

  componentWillUnmount() {
    this.props.leaveUpdateLoweringForm();
  }


  handleLoweringDelete(id) {
    console.log("delete lowering", id)
    this.props.showModal('deleteLowering', { id: id, handleDelete: this.props.deleteLowering });
  }

  handleFormSubmit(formProps) {
    formProps.lowering_observers = (formProps.lowering_observers)? formProps.lowering_observers.map(tag => tag.trim()): [];
    formProps.lowering_tags = (formProps.lowering_tags)? formProps.lowering_tags.map(tag => tag.trim()): [];
    this.props.updateLowering(formProps);
  }

  renderField({ input, label, placeholder, required, type, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    let placeholder_txt = (placeholder)? placeholder: label

    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={placeholder_txt} type={type}/>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderTextArea({ input, label, type, placeholder, required, rows = 4, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    let placeholder_txt = (placeholder)? placeholder: label
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={placeholder_txt} componentClass={type} rows={rows}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderDatePicker({ input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''

    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <Datetime {...input} utc={true} value={input.value ? moment.utc(input.value).format(dateFormat + " " + timeFormat) : null} dateFormat={dateFormat} timeFormat={timeFormat} selected={input.value ? moment.utc(input.value, dateFormat + " " + timeFormat) : null }/>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, name, options, input, meta: { dirty, error, warning } }) {    

    let checkboxList = options.map((option, index) => {

      let tooltip = (option.description)? (<Tooltip id={`${option.value}_Tooltip`}>{option.description}</Tooltip>) : null
      let overlay = (tooltip != null)? (<OverlayTrigger placement="right" overlay={tooltip}><span>{option.label}</span></OverlayTrigger>) : option.label

      return (
          <Checkbox
            name={`${option.label}[${index}]`}
            key={`${label}.${index}`}
            value={option.value}
            checked={input.value.indexOf(option.value) !== -1}
            onChange={event => {
              const newValue = [...input.value];
              if(event.target.checked) {
                newValue.push(option.value);
              } else {
                newValue.splice(newValue.indexOf(option.value), 1);
              }
              return input.onChange(newValue);
            }}
          >
            { overlay }
          </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}</label>
        {checkboxList}
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    );
  }


  renderCheckbox({ input, label, meta: { dirty, error, warning } }) {    

    return (
      <FormGroup>
        <Checkbox
          checked={input.value ? true : false}
          onChange={(e) => input.onChange(e.target.checked)}
        >
          {label}
        </Checkbox>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    );
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <Alert bsStyle="danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </Alert>
      )
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <Alert bsStyle="success">
          <strong>Success!</strong> {this.props.message}
        </Alert>
      )
    }
  }

  render() {

    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this lowering.</Tooltip>)

    const { handleSubmit, pristine, reset, submitting, valid } = this.props;



    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes('cruise_manager'))) {

      const updateLoweringFormHeader = (this.props.roles.includes("admin"))? (
        <div>
          Update Lowering
          <div className="pull-right">
            <OverlayTrigger placement="top" overlay={deleteTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleLoweringDelete(this.props.initialValues.id)  } ><FontAwesomeIcon icon='trash' fixedWidth/></Button></OverlayTrigger>
          </div>
        </div>
      ) : (<div>Update Lowering</div>);

      return (
        <Panel>
          <Panel.Heading>{updateLoweringFormHeader}</Panel.Heading>
          <Panel.Body>
            <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
              <Field
                name="lowering_id"
                component={this.renderField}
                type="text"
                label="Lowering ID"
                placeholder="i.e. 4023"
                required={true}
              />
              <Field
                name="lowering_description"
                component={this.renderTextArea}
                type="textarea"
                label="Lowering Description"
                placeholder="A brief description of the lowering"
                rows={10}
              />
              <Field
                name="lowering_location"
                type="text"
                component={this.renderField}
                label="Lowering Location"
                placeholder="i.e. Kelvin Seamount"
              />
              <Field
                name="start_ts"
                component={this.renderDatePicker}
                type="text"
                label="Start Time"
                required={true}
              />
              <Field
                name="stop_ts"
                component={this.renderDatePicker}
                type="text"
                label="Stop Time"
                required={true}
              />
              <Field
                name="lowering_pilot"
                component={this.renderField}
                type="text"
                label="Pilot"
                placeholder="i.e. Bruce Strickrott"
                required={true}
              />
              <Field
                name="lowering_observers"
                component={this.renderField}
                type="text"
                label="Observers (comma delimited)"
                placeholder="i.e. Adam Soule,Masako Tominaga"
              />
              <Field
                name="lowering_tags"
                component={this.renderTextArea}
                type="textarea"
                label="Lowering Tags (comma delimited)"
                placeholder="A comma-delimited list of tags, i.e. coral,chemistry,engineering"
              />
              {this.renderAlert()}
              {this.renderMessage()}
              <div className="pull-right">
                <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                <Button bsStyle="primary" type="submit" disabled={submitting || !valid}>Update</Button>
              </div>
            </form>
          </Panel.Body>
        </Panel>
      )
    } else {
      return (
        <div>
          What are YOU doing here?
        </div>
      )
    }
  }
}

function validate(formProps) {

  const errors = {};

  if (!formProps.lowering_id) {
    errors.lowering_id = 'Required'
  } else if (formProps.lowering_id.length > 15) {
    errors.lowering_id = 'Must be 15 characters or less'
  }

if (!formProps.start_ts) {
    errors.start_ts = 'Required'
  }

  if (!formProps.stop_ts) {
    errors.stop_ts = 'Required'
  }

  if ((formProps.start_ts != '') && (formProps.stop_ts != '')) {
    if(moment(formProps.stop_ts, dateFormat).isBefore(moment(formProps.start_ts, dateFormat))) {
      errors.stop_ts = 'Stop date must be later than start data'
    }
  }

  if (!formProps.lowering_pilot) {
    errors.lowering_pilot = 'Required'
  }

  if (typeof formProps.lowering_observers == "string") {
    if (formProps.lowering_observers == '') {
      formProps.lowering_observers = []
    } else {
      formProps.lowering_observers = formProps.lowering_observers.split(',');
    }
  }

  if (typeof formProps.lowering_tags == "string") {
    if (formProps.lowering_tags == '') {
      formProps.lowering_tags = []
    } else {
      formProps.lowering_tags = formProps.lowering_tags.split(',');
    }
  }

  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.lowering.lowering_error,
    message: state.lowering.lowering_message,
    initialValues: state.lowering.lowering,
    roles: state.user.profile.roles,
  };

}

UpdateLowering = reduxForm({
  form: 'editLowering',
  enableReinitialize: true,
  validate: validate
})(UpdateLowering);

export default connect(mapStateToProps, actions)(UpdateLowering);