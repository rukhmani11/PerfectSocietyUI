import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  Button,
  Typography,
  Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { globalService } from "../../../services/GlobalService";
import Controls from "../../../utility/controls/Controls";
import useForm from "../../../utility/hooks/UseForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SelectListModel } from "../../../models/ApiResponse";
import { SocietyBuildingUnitChargeHeadsModel } from "../../../models/SocietyBuildingUnitChargeHeadsModel";
import { societyBuildingUnitChargeHeadsService } from "../../../services/SocietyBuildingUnitChargeHeadsService";
import { societyChargeHeadsService } from "../../../services/SocietyChargeHeadsService";
import { SocietyBuildingTitleModel } from "../../../models/SocietyBuildingsModel";
import { societyBuildingsService } from "../../../services/SocietyBuildingsService";
import { Messages, ROLES } from "../../../utility/Config";
import { AuthContext } from "../../../utility/context/AuthContext";
import { useSharedNavigation } from "../../../utility/context/NavigationContext";

const SocietyBuildingUnitChargeHeadForm = () => {
  const { auth } = React.useContext(AuthContext);
  const { societyBuildingUnitId, societyBuildingUnitChargeHeadId }: any = useParams();
  const societyId: string = localStorage.getItem("societyId") || "";
  let navigate = useNavigate();
  const [chargeHeads, setChargeHeads] = useState<SelectListModel[]>([]);
  const mode = societyBuildingUnitChargeHeadId ? 'Edit' : 'Create';
  const [title, setTitle] = useState<any>({});
  const { goToHome } = useSharedNavigation();
  
  const validate = (fieldValues: SocietyBuildingUnitChargeHeadsModel = values) => {
    let temp: any = { ...errors };
    if ("ChargeHeadId" in fieldValues)
      temp.ChargeHeadId = fieldValues.ChargeHeadId ? "" : "ChargeHead is required.";
    if ("Rate" in fieldValues)
      temp.Rate = fieldValues.Rate ? "" : "Rate is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(societyBuildingUnitChargeHeadsService.initialFieldValues, validate, societyBuildingUnitChargeHeadId);

  const newSocietyBuildingUnitChargeHead = () => {
    setValues(societyBuildingUnitChargeHeadsService.initialFieldValues);
  };

  //This is used since in get the null property is not returned
  function setFormValue(model: SocietyBuildingUnitChargeHeadsModel) {
    let newModel = {
      SocietyBuildingUnitChargeHeadId: model.SocietyBuildingUnitChargeHeadId,
      SocietyBuildingUnitId: model.SocietyBuildingUnitId || '',
      ChargeHeadId: model.ChargeHeadId || '',
      Rate: model.Rate
    }
    return newModel;
  }

  useEffect(() => {
    if (!globalService.isSocietySelected()) {
      globalService.info(Messages.SocietyUnSelected);
      return goToHome();
    }
    if (chargeHeads.length === 0)
      getChargeHeads();
      
    if (societyBuildingUnitChargeHeadId) {
      getSocietyBuildingUnitChargeHead(societyBuildingUnitChargeHeadId);
    }
    else {
      newSocietyBuildingUnitChargeHead();
      setErrors({});
    }
    
    if (Object.keys(title).length === 0)
      getBuildingTitle();

  }, [societyBuildingUnitChargeHeadId]);

  const getBuildingTitle = () => {
    let model: SocietyBuildingTitleModel = {
      SocietyBuildingUnitId: societyBuildingUnitId,
      SocietyBuildingId: ""
    }
    societyBuildingsService
      .getPageTitle(model)
      .then((response) => {
        setTitle(response.data);
      });
  };

  // const getChargeHeads = () => {
  //   societyChargeHeadsService
  //     .getSelectListBySocietyId(societyId)
  //     .then((response) => {
  //       setChargeHeads(response.data);
  //     });
  // };
  const getChargeHeads = () => {
    societyBuildingUnitChargeHeadsService
      .getSocietyChargeHeadsBySocietyBuildingUnitId(societyId, societyBuildingUnitId)
      .then((response) => {
        setChargeHeads(response.data);
      });
  };


  const getSocietyBuildingUnitChargeHead = (societyBuildingUnitChargeHeadId: any) => {
    societyBuildingUnitChargeHeadsService
      .getById(societyBuildingUnitChargeHeadId)
      .then((response) => {
        if (response) {
          let result = response.data;
          setValues(setFormValue(result.data));
        }
      })
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      values.SocietyBuildingUnitId = societyBuildingUnitId;
      if (societyBuildingUnitChargeHeadId) {
        societyBuildingUnitChargeHeadsService.put(values).then((response: any) => {
          let result = response.data;
          if (result.isSuccess) {
            resetForm();
            navigate("/societyBuildingUnitChargeHeads/" + societyBuildingUnitId);
            globalService.success("Society BuildingUnit Charge Head updated successfully.");
          }
        });
      } else {
        societyBuildingUnitChargeHeadsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success("Society BuildingUnit Charge Head added successfully.");
              resetForm();
              navigate("/societyBuildingUnitChargeHeads/" + societyBuildingUnitId);
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
      <Stack direction="row" spacing={0} justifyContent="space-between">
        <Typography variant="h5" align="center">
           Society BuildingUnit Charge Head
        </Typography>
        <Typography variant="body1"><b>Building : </b>{title.Building}  <b>Unit :</b> {title.Unit}  </Typography>
      </Stack>
      <form
        //autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              {/* <Typography variant="h6" gutterBottom>
                Shipping address
              </Typography> */}
              <Grid container spacing={3}>

                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="ChargeHeadId"
                    label="Charge Head"
                    required
                    showEmptyItem={false}
                    value={chargeHeads.length > 0 ? values.ChargeHeadId : ''}
                    onChange={handleInputChange}
                    options={chargeHeads}
                    error={errors.ChargeHeadId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Rate"
                    name="Rate"
                    type="number"
                    value={values.Rate}
                    onChange={handleInputChange}
                    error={errors.Rate}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2} direction="row">
              <Button type="submit" variant="contained" className={!globalService.roleMatch([ROLES.ReadOnly], auth) ? '' : 'hidden'}>Submit</Button>
              <Button variant="outlined" startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/societyBuildingUnitChargeHeads/" + societyBuildingUnitId)}
              >Back To List</Button>
            </Stack>

          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default SocietyBuildingUnitChargeHeadForm;