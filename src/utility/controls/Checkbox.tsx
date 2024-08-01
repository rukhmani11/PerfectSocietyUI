import React from 'react'
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';

export default function Checkbox(props: any) {

    const { name, label, value, onChange, dataId, dataNested, ...other } = props;

    const convertToDefEventPara = (name: string, value: any) => ({
        target: {
            name, value
        }
    })

    return (
        <FormControl>
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color="primary"
                    checked={value}
                    {...other}
                    onChange={onChange}
                    //onChange={e => onChange(convertToDefEventPara(name, e.target.checked), e.target.dataset)}
                    inputProps={{
                        'data-id': dataId,
                        'data-nested': dataNested
                    }}
                />}
                label={label}
            />
        </FormControl>
    )
}
