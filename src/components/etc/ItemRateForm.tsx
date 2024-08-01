import { useNavigate, useParams } from "react-router";
import { globalService } from "../../services/GlobalService";
import { MemberClassesModel } from "../../models/MemberClassesModel";
import useForm from "../../utility/hooks/UseForm";
import { memberClassesService } from "../../services/MemberClassesService";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import Controls from "../../utility/controls/Controls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { itemRateService } from "../../services/ItemRateService";

const ItemRateForm = () => {
  const [itemRates, setItemRates] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState("");

  const validate = (fieldValues: any = values) => {
    let temp: any = { ...errors };

    if ("SearchText" in fieldValues)
      temp.SearchText = fieldValues.SearchText ? "" : "Search Text is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    itemRateService.initialSearchFieldValues,
    validate,
    ""
  );

  function getItemRates(searchCriteria: any) {
    
    setSelectedSearch(searchCriteria);
    if (validate()) {
      itemRateService.getItemRates(values.SearchText, searchCriteria).then(
        (response) => {
          if (response) {
            
            let result = response.data;
            if (result.isSuccess) {
              setItemRates(result.list);
            } else {
              globalService.error(result.message);
            }
          }
        }
      );
    }
  }

  const columnItemRate: GridColDef[] = [
    { field: "SearchedItem", headerName: "Searched Item", width: 130, flex: 2 },
    { field: "Ranks", headerName: "Ranks", width: 130, flex: 1 },
    { field: "ItemRate", headerName: "ItemRate", width: 130, flex: 1 },
    { field: "Client", headerName: "Client", width: 130, flex: 1 },
    { field: "BOQNo", headerName: "BOQNo", width: 130, flex: 1 },
  ];

  return (
    <>
      <Typography variant="h5" align="center">
        Item Rate
      </Typography>
     
      <form autoComplete="off" noValidate>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controls.Input
                  label="Search Text"
                  name="SearchText"
                  value={values.SearchText}
                  required
                  onChange={handleInputChange}
                  error={errors.SearchText}
                />
              </Grid>
              <Grid item xs={16} sm={4}>
                <Button
                  type="button"
                  color={selectedSearch === "FULLTEXT" ? "success" : "primary"}
                  variant="contained"
                  onClick={() => getItemRates("FULLTEXT")}
                >
                  FULL TEXT Search
                </Button>
                <Button
                  type="button"
                  className="m-l-5"
                  color={selectedSearch === "LIKE" ? "success" : "primary"}
                  variant="contained"
                  onClick={() => getItemRates("LIKE")}
                >
                  LIKE Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div style={{ width: "100%" }}>
              <DataGrid className="tblItemRate"
                getRowId={(row) => row.SearchedItem}
                rows={itemRates}
                columns={columnItemRate}
                columnHeaderHeight={30}
                //rowHeight={30}
                autoHeight={true}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 200}
                initialState={{
                  columns: {
                    columnVisibilityModel: {},
                  },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default ItemRateForm;
