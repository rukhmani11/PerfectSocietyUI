import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material'
import { MultiSelectListModel } from "../../models/ApiResponse";

//https://www.npmjs.com/package/react-multi-select-component
const ReactMultiSelect = (props: any) => {
  const { setFieldValue, error, touched } = props;
  const { label, value, disabled, onChange, options } = props;
  return (
    <div>
      {
        <FormControl variant="outlined" fullWidth size='small' disabled={disabled}
          {...(error && { error: true })}>
          <InputLabel>{label}</InputLabel>

          <MultiSelect
            options={options}
            value={value}
            onChange={onChange}
            // onChange={(e: MultiSelectListModel) => {
            //   setFieldValue(value, e);
            // }}
            labelledBy="Select"
          />
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      }
    </div>
  )
}

export default ReactMultiSelect


// import React from 'react'
// import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, SelectChangeEvent, OutlinedInput, Theme, useTheme } from '@mui/material'
// import { SelectListModel } from '../../models/ApiResponse';
// //Its incomplete
// export default function MultiSelect(props: any) {

//     const { name, label, value, error = null, onChange, options } = props;
//     const [personName, setPersonName] = React.useState<SelectListModel[]>([]);

//     const ITEM_HEIGHT = 48;
//     const ITEM_PADDING_TOP = 8;
//     const MenuProps = {
//         PaperProps: {
//             style: {
//                 maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//                 width: 250,
//             },
//         },
//     };

//     function getStyles(name: SelectListModel, personName: SelectListModel[], theme: Theme) {
//         return {
//             fontWeight:
//                 personName.indexOf(name) === -1
//                     ? theme.typography.fontWeightRegular
//                     : theme.typography.fontWeightMedium,
//         };
//     }

//     const handleChange = (event: SelectChangeEvent<typeof personName>) => {
//         const {
//             target: { value },
//         } = event;
//         // setPersonName(
//         //     //On autofill we get a stringified value.
//         //     //typeof value === 'string' ? value.split(',') : value,
//         //     value,
//         // );
//     };
//     const theme = useTheme();
//     return (
//         <>
//             {

//                 <div>
//                     <FormControl fullWidth  {...(error && { error: true })}>
//                         <InputLabel>{label}</InputLabel>
//                         <MuiSelect
//                             label={label}
//                             name={name}
//                             value={personName}
//                             onChange={handleChange}
//                             multiple
//                             input={<OutlinedInput label="Name" />}
//                             MenuProps={MenuProps}
//                         >
//                             {options &&
//                                 options.map(
//                                     (item: SelectListModel) => (<MenuItem
//                                         key={item.Value}
//                                         value={item.Value}
//                                         style={getStyles(item, personName, theme)}
//                                     >{item.Text}</MenuItem>)
//                                 )
//                             }
//                         </MuiSelect>
//                     </FormControl>
//                 </div>
//             }
//         </>
//     )
// }
