import React, { useState, useEffect } from "react";

const useForm = (initialFieldValues: any, validate: any, setCurrentId: any) => {
  //const useForm = (initialFieldValues: any) => {
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: any) => {
    let { name, value, valueAsNumber, dataset } = e.target;
    value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    //const fieldValue = { [name]: (e.target.type === 'checkbox' ) ? e.target.checked : (e.target.type === 'number' ? valueAsNumber : value)};
    //const fieldValue = (e.target.type !== 'checkbox') ? { [name]: (e.target.type === 'number' ? valueAsNumber : value) } : null;
    const fieldValue = { [name]: (e.target.type === 'number' ? valueAsNumber : value) };

    setValues({
      ...values,
      ...fieldValue,

      [dataset?.id]: dataset ? {
        ...values[dataset.id],
        ...(dataset.nested
          ? {
            nested: {
              ...values[dataset.id]?.nested,
              [name]: value
            }
          }
          : {
            [name]: value
          })
      } : null
      // // update the correct dataset id
      // [dataset.id]: {
      //   // shallow copy existing dataset values
      //   ...values[dataset.id],

      //   // if value is nested then update nested state value
      //   ...(dataset.nested
      //     ? {
      //       nested: {
      //         // shallow copy existing nested values
      //         ...values[dataset.id]?.nested,

      //         // update nested field value
      //         [name]: value
      //       }
      //     }
      //     : {
      //       // update unnested field value
      //       [name]: value
      //      })
      // }
    });
    validate(fieldValue)
  };

  const resetForm = () => {
    setValues({
      ...initialFieldValues
    })
    setErrors({})
    //setCurrentId(0)
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  };
};

export default useForm;
