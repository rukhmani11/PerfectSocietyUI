import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material'
import { SelectListModel } from '../../models/ApiResponse';

export default function Select(props: any) {

    const { name, label, value, disabled, dataId, dataNested, error = null, showEmptyItem = true, onChange, options } = props;

    return (
        <>
            {
                <FormControl variant="outlined" fullWidth size='small' disabled={disabled}
                    {...(error && { error: true })}>
                    <InputLabel>{label}</InputLabel>
                    <MuiSelect
                        variant="outlined"
                        size='small'
                        label={label}
                        name={name}
                        value={value}
                        inputProps={{
                            'data-id': dataId,
                            'data-nested': dataNested
                        }}
                        onChange={onChange}>
                        {showEmptyItem && <MenuItem value="">--Select--</MenuItem>}
                        {options &&
                            options.map(
                                (item: SelectListModel) => (<MenuItem key={item.Value} value={item.Value}>{item.Text}</MenuItem>)
                            )
                        }
                    </MuiSelect>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            }
        </>
    )
}
