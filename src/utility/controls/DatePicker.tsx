import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { globalService } from '../../services/GlobalService';
// import { registerLocale, setDefaultLocale } from "react-datepicker";
// import es from 'date-fns/locale/es';
// registerLocale('es', es)

//https://github.com/Hacker0x01/react-datepicker/issues/1787#issuecomment-951754695
// eslint-disable-next-line no-confusing-arrow
const buildClassNames = (touched: any, isInvalid: any) =>
  touched && isInvalid ? 'form-control is-invalid' : 'form-control';

export const ReactDatePicker = (props: any) => {
  const { setFieldValue, setFieldTouched, error, touched } = props;
  const { name, value, label, min, max, dataId, dataNested, ...others } = props;

  return (
    <>
      <div>
        {/* <label className='datePickerLabel' htmlFor={name}>{label}</label> */}
        <DatePicker
          //locale="es"
          //selected={convertLocalToUTCDate(value)} causing time set issue. 1 day ago is set.eg. 1-May-2023
          selected={value}
          dateFormat="dd-MM-yyyy"
          onChange={(e) => {
            setFieldValue(name, e);
            setFieldTouched(name);
          }}
          isClearable={true}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // showIcon
          //closeOnScroll={true}
          minDate={min}
          maxDate={max}
          className={buildClassNames(touched, !!error)}
          customInput={
            <TextField
              variant="outlined"
              size='small'
              label={label}
              name={name}
              //value={globalService.convertLocalToUTCDate(value)}
              //onChange={onChange}
              fullWidth
              //defaultValue={""}
              //{...other}
              inputProps={{
                'data-id': dataId,
                'data-nested': dataNested
              }}
              {...(error && { error: true, helperText: error })}
            />
          }
          {...others}
        />
      </div>
    </>
  );
};
export default ReactDatePicker;
// import * as React from 'react';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

// //https://v4.mui.com/components/pickers/
// //https://mui.com/x/react-date-pickers/date-picker/

// const tomorrow = dayjs().add(1, 'day');
// const today = dayjs();
// const yesterday = dayjs().subtract(1, 'day');

// export default function DatePicker(props: any) {
//   const { name, label, value, min, max, defaultDate, error = null, onChange, ...other } = props;

//   const convertToDefEventPara = (name: any, value: any) => ({
//     target: {
//       name, value
//     }
//   })

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={['DatePicker']}>
//         <MuiDatePicker
//           //format="dd-MMM-yyyy"
//           //name={name}
//           //label={label}
//           value={value}
//           //defaultValue={defaultDate}
//           minDate={min}
//           maxDate={max}
//           views={['year', 'month', 'day']}
//           //disableFuture
//           //onError={(newError) => setError(newError)}
//           slotProps={{
//             textField: {
//               helperText: error,
//             },
//           }}
//           //onChange={onChange}
//           onChange={date => onChange(convertToDefEventPara(name, date))}
//           //fullWidth
//           {...other}
//           {...(error && { error: true, helperText: error })}
//         />
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }
