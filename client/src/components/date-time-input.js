import 'rc-calendar/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';

const now = moment();
now.locale('en-gb').utcOffset(0);

function getFormat() {
  return format;
}


const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;


class DateTimeInput extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.object,
    defaultCalendarValue: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.calendarContainerRef = React.createRef();

    this.state = {
      showTime: true,
      showDateInput: true,
      disabled: false,
      open: false,
      value: props.defaultValue,
    };
  }

  onChange = (value) => {
    this.setState({
      value,
    });
    this.props.onChange && this.props.onChange(value)
  }

  onOpenChange = (open) => {
    this.setState({
      open,
    });
  }

  onFocus = () => {
    if (!this.state.open && this.state.isMouseDown) {
      // focus from a "click" event, let the picker trigger automatically open the calendar
      this.setState({
        isMouseDown: false,
      });
    } else {
      // focus not caused by "click" (such as programmatic or via keyboard)
      this.setState({
        open: true,
      });
    }
  }

  onMouseDown = () => {
    this.setState({
      isMouseDown: true,
    });
  }

  render() {
    const state = this.state;
    const calendar = (<Calendar
      locale={enUS}
      style={{ zIndex: 1001 }}
      dateInputPlaceholder="please input"
      format={getFormat()}
      timePicker={timePickerElement}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput}
      focusablePanel={false}
    />);
    return (
      <div style={{ width: 400, margin: 20 }}>
        <div style={{
          boxSizing: 'border-box',
          position: 'relative',
          display: 'block',
          lineHeight: 1.5,
          marginBottom: 22,
        }}
        >
          <DatePicker
            animation="slide-up"
            calendar={calendar}
            value={state.value}
            onChange={this.onChange}
            onOpenChange={this.onOpenChange}
            open={state.open}
            style={{ zIndex: 1001 }}
          >
            {
              ({ value }) => {
                return (
                  <span tabIndex="0" onMouseDown={this.onMouseDown} onFocus={this.onFocus}>
                    <input
                      placeholder="Time"
                      style={{ width: 250 }}
                      disabled={state.disabled}
                      readOnly
                      tabIndex="-1"
                      className="ant-calendar-picker-input ant-input"
                      value={value && value.format(getFormat())}
                    />
                    <div ref={this.calendarContainerRef} />
                  </span>
                );
              }
            }
          </DatePicker>
        </div>
      </div>
    );
  }
}


export default DateTimeInput
