import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import Controls from "../../utility/controls/Controls";
import { AdvertisementsModel } from "../../models/AdvertisementsModel";
import { AdvertisementsService } from "../../services/AdvertisementsService";
import { FolderPath, ROLES, config } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const AdvertisementForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  globalService.pageTitle = "Advertisements";
  const { AdvertisementId } = useParams();
  const [AdvertisementlogoFile, setAdvertisementLogoFile] = useState<File>();
  let navigate = useNavigate();
  const mode = AdvertisementId ? "Edit" : "Create";
  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };
    if ("AdvHeading" in fieldValues)
      temp.AdvHeading = fieldValues.AdvHeading
        ? ""
        : "Adv Heading  is required.";
        // if ("AdvSequence" in fieldValues)
        //  temp.AdvSequence = fieldValues.AdvSequence? "": "AdvSequence is required";;
    if ("AdvSequence" in fieldValues) {
      temp.AdvSequence = fieldValues.AdvSequence || fieldValues.AdvSequence === 0
          ? /^[0-9\b]+$/.test(fieldValues.AdvSequence.toString())
              ? ""
              : "AdvSequence is not valid."
          : "AdvSequence is required";
  }
  
      
         setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      AdvertisementsService.initialFieldValues,
      validate,
      props.setCurrentId
    );

  const newUser = () => {
    setValues(AdvertisementsService.initialFieldValues);
  };

  function setFormValue(model: AdvertisementsModel) {
    let newModel = {
      AdvertisementId: model.AdvertisementId,
      AdvHeading: model.AdvHeading,
      AdvInfo: model.AdvInfo,
      AdvUrl: model.AdvUrl || null,
      AdvSequence: model.AdvSequence || 0,
      Active: model.Active || false,
      AdvImageName:model.AdvImageName|| null
    };
    return newModel;
  }

  useEffect(() => {
    if (AdvertisementId) {
      getAdvertisement(AdvertisementId);
      setErrors({});
    } else newUser();
  }, [AdvertisementId]);

  const getAdvertisement = (AdvertisementId: any) => {
    AdvertisementsService.getById(AdvertisementId).then((response) => {
      
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
      }
    });
  };

  // const onFileChange = (fileInput: any) => {
  //   const selectedFile = fileInput.target.files[0];
  
  //   if (selectedFile) {
  //     // Check if the file size is greater than 50KB (50 * 1024 bytes)
  //     if (selectedFile.size <= 50 * 1024) {
  //       // File size exceeds the limit
  //       //alert('File size should be no more than 50KB');
  //       globalService.error('File size should be less than  50KB');
  //       // Optionally, clear the file input
  //       fileInput.target.value = null;
  //     } else {
  //       // File size is within the limit, set the file in your state
  //       setAdvertisementLogoFile(selectedFile);
  //     }
  //   }
  // };
  const onFileChange = (fileInput: any) => {
    const selectedFile = fileInput.target.files[0];

    if (selectedFile) {
        // Check if it's an image file (you can use more robust checks here)
            // Check if the file size is less than or equal to 50KB (50 * 1024 bytes)
            if (selectedFile.size <= 50 * 1024) {
                // File is valid, set it in state
                setAdvertisementLogoFile(selectedFile);
            } else {
                // File is too large, show an error message
                globalService.error("File size must be 50KB or less.");
            }
        } 
};
  const clearAdvertisementLogoFile = () => {
    setAdvertisementLogoFile(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (AdvertisementId) {
        AdvertisementsService.put(values,AdvertisementlogoFile).then((response: any) => {
          
          let result = response.data;
          if (response) {
            globalService.success(result.message);
            navigate("/advertisements");
          } else {
            globalService.error(result.message);
          }
        });
      } else {
        AdvertisementsService.post(values,AdvertisementlogoFile).then((response: any) => {
          if (response) {
            
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/advertisements");
            } else {
              globalService.error(result.message);
            }
          }
        });
      }
    }
  };

  return (
    <>
      <Typography variant="h5" align="center">
        {mode} Advertisement
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Adv Heading"
                    name="AdvHeading"
                    value={values.AdvHeading}
                    onChange={handleInputChange}
                    error={errors.AdvHeading}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Adv Info"
                    name="AdvInfo"
                    value={values.AdvInfo}
                    onChange={handleInputChange}
                    error={errors.AdvInfo}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    label="Adv URL"
                    name="AdvUrl"
                    value={values.AdvUrl}
                    onChange={handleInputChange}
                    error={errors.AdvUrl}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    type="number"
                    label="Adv Sequence"
                    name="AdvSequence"
                    inputProps={{min:0}}
                    //value={values.AdvSequence>=0?values.AdvSequence:""}
                    value={values.AdvSequence}
                    onChange={handleInputChange}
                    error={errors.AdvSequence}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={mode !== "Edit" ? "hidden" : ""}>
                  <Controls.Checkbox
                    required
                    label="Active"
                    name="Active"
                    value={values.Active}
                    onChange={handleInputChange}
                    error={errors.Active}
                  />
                </Grid>
               <Grid item xs={12} sm={4}>
    <Typography   style={{color: 'red',  fontSize: '0.75rem'}}> File Size Should be 50Kb
        </Typography>
    <Stack spacing={1} direction="row">
        <Button variant="contained" component="label" >
            Upload image
            <input type="file" accept="image/*" onChange={(event: any) => { onFileChange(event); }} hidden  />
        </Button>

        <IconButton aria-label="delete" size="medium" color="error" onClick={clearAdvertisementLogoFile}>
            <DeleteIcon fontSize="small"  />
        </IconButton>

        <>
            {values.AdvImageName && <img
                alt=""
                className="dvImg"
                src={`${process.env.REACT_APP_BASE_URL}/${FolderPath.AdvertisementLogo}/${values.AdvImageName}`}
                loading="lazy"
                style={{ width: '150px', height: '100px' }}
            />}
        </>
    </Stack>

    <br />

    {AdvertisementlogoFile?.name}
</Grid>

              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>
                Submit
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                href="/advertisements"
              >
                Back{" "}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default AdvertisementForm;
