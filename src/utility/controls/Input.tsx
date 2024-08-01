import React from "react";
import { TextField } from "@mui/material";

export default function Input(props: any) {
  const {
    name,
    label,
    value,
    length,
    error = null,
    onChange,
    readOnly = false,
    dataId,//This represent to which object we need to nest it (eg. employee Object)
    dataNested, // nested inside dataId object (eg. employee > address employee:{address:{name:"",city:""}})
    ...other
  } = props;
  return (
    <TextField
      variant="outlined"
      size="small"
      label={label}
      name={name}
      //value={value}
      value={value ? value : value === 0 ? 0 : ""}
      onChange={onChange}
      fullWidth
      inputProps={{
        maxLength: length,
        readOnly: readOnly,
        'data-id': dataId,
        'data-nested': dataNested
      }}
      //defaultValue={""}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
