import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  CardActions,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Stack,
  Switch,
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { standardAcSubCategoriesService } from "../../services/StandardAcSubCategoriesService";
import { TdscategoriesService } from "../../services/TdscategoriesService";
import { StandardAcHeadsModel } from "../../models/StandardAcHeadsModel";
import { standardAcHeadsService } from "../../services/StandardAcHeadsService";
import { globalService } from "../../services/GlobalService";
import useForm from "../../utility/hooks/UseForm";
import { SelectListModel } from "../../models/ApiResponse";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Controls from "../../utility/controls/Controls";
import { ROLES } from "../../utility/Config";
import { AuthContext } from "../../utility/context/AuthContext";

const StandardChargeHeadForm = (...props: any) => {
  const { auth } = React.useContext(AuthContext);
  const { AcHeadId } = useParams();

  let navigate = useNavigate();
  const [SubCategory, setSubCategory] = useState<SelectListModel[]>([]);
  const [Tdscategory, setTdscategory] = useState<SelectListModel[]>([]);
  const NatureList = [
    { Value: "C", Text: "Cash" },
    { Value: "B", Text: "Bank" },
    { Value: "S", Text: "Creditor" },
    { Value: "D", Text: "Debtor" },
    { Value: "T", Text: "TDS" },
    { Value: "F", Text: "Year End Closing Transaction" },
  ];
  const validate = (fieldValues: StandardAcHeadsModel = values) => {
    let temp: any = { ...errors };
    if ("AcHead" in fieldValues)
      temp.AcHead = fieldValues.AcHead ? "" : "AC Head is required.";
    if ("SubCategoryId" in fieldValues)
      temp.SubCategoryId = fieldValues.SubCategoryId
        ? ""
        : "SubCategoryId is required.";
    if ("Sequence" in fieldValues)
      temp.Sequence = fieldValues.Sequence ? "" : "Sequence is required.";
    // if ("Nature" in fieldValues)
    //   temp.Nature = fieldValues.Nature ? "" : "Nature is required.";
    // if ("TdscategoryId" in fieldValues)
    //   temp.TdscategoryId = fieldValues.TdscategoryId
    //     ? ""
    //     : "TdscategoryId is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(
      standardAcHeadsService.initialFieldValues,
      validate,
      props.AcHeadId
    );

  const newstandardAchead = () => {
    setValues(standardAcHeadsService.initialFieldValues);
  };

  function setFormValue(model: StandardAcHeadsModel) {
    let newModel = {
      AcHeadId: model.AcHeadId,
      AcHead: model.AcHead,
      SubCategoryId: model.SubCategoryId,
      Nature: model.Nature || "",
      TdscategoryId: model.TdscategoryId || "",
      Tdscompany: model.Tdscompany,
    };
    return newModel;
  }
  useEffect(() => {
    if (Tdscategory.length === 0) getTdscategory();
    if (SubCategory.length === 0) getSubCategory();

    if (AcHeadId) {
      getstandardAchead(AcHeadId);
    } else {
      newstandardAchead();
      setErrors({});
    }
  }, [AcHeadId]);

  const getTdscategory = () => {
    TdscategoriesService.getSelectList().then((response) => {
      setTdscategory(response.data);
    });
  };
  const getSubCategory = () => {
    standardAcSubCategoriesService.getSelectList().then((response: any) => {
      setSubCategory(response.data);
    });
  };

  const getstandardAchead = (AcHeadId: any) => {
    standardAcHeadsService.getById(AcHeadId).then((response) => {
      if (response) {
        let result = response.data;
        setValues(setFormValue(result.data));
        setValues(result.data);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (AcHeadId) {
        standardAcHeadsService.put(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              navigate("/standardAcheads");
            }
          }
        });
      } else {
        standardAcHeadsService.post(values).then((response: any) => {
          if (response) {
            let result = response.data;
            if (result.isSuccess) {
              globalService.success(result.message);
              resetForm();
              navigate("/standardAcheads");
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
        Account Heads
      </Typography>
      <form
        autoComplete="off"
        noValidate
        //className={classes.root}
        onSubmit={handleSubmit}
      >
        <Card>
          <CardContent>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="AC Head"
                    fullWidth
                    autoComplete="given-name"
                    name="AcHead"
                    length={100}
                    value={values.AcHead}
                    onChange={handleInputChange}
                    error={errors.AcHead}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    showEmptyItem={false}
                    name="SubCategoryId"
                    label="Sub Category"
                    required
                    value={SubCategory.length > 0 ? values.SubCategoryId : ""}
                    onChange={handleInputChange}
                    options={SubCategory}
                    error={errors.SubCategoryId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    required
                    label="Sequence "
                    fullWidth
                    autoComplete="given-name"
                    name="Sequence"
                    type="Number"
                    value={values.Sequence}
                    onChange={handleInputChange}
                    error={errors.Sequence}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    // showEmptyItem={false}
                    name="TdscategoryId"
                    label="Tds category"
                    value={Tdscategory.length > 0 ? values.TdscategoryId : ""}
                    onChange={handleInputChange}
                    options={Tdscategory}
                    error={errors.TdscategoryId}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Select
                    name="Nature"
                    label="Nature"
                    value={NatureList.length > 0 ? values.Nature : ""}
                    onChange={handleInputChange}
                    options={NatureList}
                    error={errors.Nature}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controls.Checkbox
                    name="Tdscompany"
                    label="Tds company"
                    value={values.Tdscompany}
                    onChange={handleInputChange}
                  />
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
                href="/standardAcheads"
              >
                Back To List
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default StandardChargeHeadForm;
