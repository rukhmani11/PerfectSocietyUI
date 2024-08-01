import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import { Button, Toolbar, Link, Divider } from "@mui/material";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AuthContext } from "../../utility/context/AuthContext";
import { ROLES } from "../../utility/Config";
import { useLocation } from "react-router-dom";
import { societyReportService } from "../../services/SocietyReportService";
import fileDownload from "js-file-download";
import { globalService } from "../../services/GlobalService";
import { useEffect, useState } from "react";
import { appInfoService } from "../../services/AppInfoService";


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Navbar: React.FC = () => {
  const { auth } = React.useContext(AuthContext);
  let societyId = localStorage.getItem("societyId");
  let societySubscriptionId = localStorage.getItem("societySubscriptionId");
  let showSocietySubscriptedNav = true;
  let showReadonlySubscriptedNav = true;
  let isFirstSocietySubscription = globalService.isFirstSocietySubscription();
  //const [isFirstSocietySubscription, setIsFirstSocietySubscription] = React.useState<boolean>((localStorage.getItem("firstSocietySubscriptionId") === localStorage.getItem("societySubscriptionId")));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [commonAnchorEl, setCommonAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [adminSocietyAnchorEl, setAdminSocietyAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [standardAnchorEl, setStandardAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [taxAnchorEl, setTaxAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [ReportExcelAppInfo,setReportExcelAppInfo]=useState(false);

  //Business Analyst Login
  const [societyAnchorEl, setSocietyAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [billingAnchorEl, setBillingAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [collectionAnchorEl, setCollectionAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [reportAnchorEl, setReportAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [accountAnchorEl, setAccountAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [transactionAnchorEl, setTransactionAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [utilityAnchorEl, setUtilityAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [accountReportAnchorEl, setAccountReportAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [isVisible,setIsVisible]=useState(false);
  const [societyVisible,setSocietyVisible]=useState(false);


  useEffect(() => {
    getAllAppinfo();
  },[]);
  
  const open = Boolean(anchorEl);
  const location = useLocation();
  const openCommon = Boolean(commonAnchorEl);
  const openAdminSociety = Boolean(adminSocietyAnchorEl);
  const openStandard = Boolean(standardAnchorEl);
  const openTax = Boolean(taxAnchorEl);
  const openUser = Boolean(userAnchorEl);
  const openSociety = Boolean(societyAnchorEl);
  const openBilling = Boolean(billingAnchorEl);
  const openCollection = Boolean(collectionAnchorEl);
  const openReport = Boolean(reportAnchorEl);
  const openAccount = Boolean(accountAnchorEl);
  const openTransaction = Boolean(transactionAnchorEl);
  const openUtility = Boolean(utilityAnchorEl);
  const openAccountReport = Boolean(accountReportAnchorEl);

  if (location.pathname === "/admin" || !societySubscriptionId) {
    showSocietySubscriptedNav = false;
    showReadonlySubscriptedNav =false;
  }

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    mainMenu: string
  ) => {
    if (mainMenu === "common") setCommonAnchorEl(event.currentTarget);
    else if (mainMenu === "adminSociety")
      setAdminSocietyAnchorEl(event.currentTarget);
    else if (mainMenu === "standard") setStandardAnchorEl(event.currentTarget);
    else if (mainMenu === "tax") setTaxAnchorEl(event.currentTarget);
    else if (mainMenu === "user") setUserAnchorEl(event.currentTarget);
    else if (mainMenu === "society") setSocietyAnchorEl(event.currentTarget);
    else if (mainMenu === "billing") setBillingAnchorEl(event.currentTarget);
    else if (mainMenu === "collection")
      setCollectionAnchorEl(event.currentTarget);
    else if (mainMenu === "report") setReportAnchorEl(event.currentTarget);
    else if (mainMenu === "account") setAccountAnchorEl(event.currentTarget);
    else if (mainMenu === "transaction")
      setTransactionAnchorEl(event.currentTarget);
    else if (mainMenu === "utility") setUtilityAnchorEl(event.currentTarget);
    else if (mainMenu === "account-report")
      setAccountReportAnchorEl(event.currentTarget);
  };
  const docTypes = [
    "OP",
    "CP",
    "CR",
    "BP",
    "BR",
    "PB",
    "EB",
    "JV",
    "SB",
    "MC",
    "CV",
    "YC",
  ];

  const handleClose = () => {
    setCommonAnchorEl(null);
    setAdminSocietyAnchorEl(null);
    setStandardAnchorEl(null);
    setTaxAnchorEl(null);
    setUserAnchorEl(null);
    setSocietyAnchorEl(null);
    setBillingAnchorEl(null);
    setCollectionAnchorEl(null);
    setReportAnchorEl(null);
    setAccountAnchorEl(null);
    setTransactionAnchorEl(null);
    setUtilityAnchorEl(null);
    setAccountReportAnchorEl(null);
  };

  // const roleMatch = (allowedRoles: string[]) => {
  //   var isMatch = false;
  //   auth?.Roles?.find((role: any) => allowedRoles?.includes(role))
  //     ? (isMatch = true)
  //     : (isMatch = false);
  //   return isMatch;
  // };
  const getAllAppinfo = () => {
    appInfoService.getAppInfo().then((response) =>{
      
      let result = response.data;
      setReportExcelAppInfo(result.row.FlagInfo.OtherReportExcel)
    })
  }

  const downloadReport = (name: string) => {
    switch (name) {
      case 'MemberRegister':
        societyReportService
          .membersRegisterPdf(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "MemberList.pdf");
          });
        break;

      case "MemberRegisterExportToExcel":
        societyReportService
          .membersRegisterExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "MemberRegisterReport.xlsx");
          });
        break;
      case "LienRegisterExportToExcel":
        societyReportService
          .lienRegisterExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "LienRegisterReport.xlsx");
          });
        break;
      case "NominationRegister":
        societyReportService
          .nominationRegisterPdf(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "NominationReport.pdf");
          });
        break;
      case "CommitteeMembersExportToExcel":
        societyReportService
          .committeeMembersExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "CommitteeMembersReport.xlsx");
          });
        break;
      case "JointHolderRegisterExportToExcel":
        societyReportService
          .jointHolderRegisterExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "JointHolderRegister.xlsx");
          });
        break;
      case "JFormReportPDF":
        societyReportService
          .jFormReportPdf(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "J-Form.pdf");
          });
        break;
      case "JFormReportExcel":
        societyReportService.jFormReportExcel(localStorage.getItem("societySubscriptionId")).then((response) => {
          let result = response.data;
          fileDownload(result,"J-Form.xlsx")
        });
        break;
      case "IFormReport":
        societyReportService
          .iFormReportPdf(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "I-Form.pdf");
          });
        break;
      case "ShareRegister":
        societyReportService
          .shareRegisterExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "ShareRegisterReport.xlsx");
          });
        break;
      case "ShareTransferReport":
        societyReportService
          .shareTransferReportExcel(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "ShareTransferReport.xlsx");
          });
        break;
      case "ShareLedgerReport":
        societyReportService
          .shareLedgerReport(localStorage.getItem("societySubscriptionId"))
          .then((response) => {
            let result = response.data;
            fileDownload(result, "ShareLedgerReport.pdf");
          });
        break;
      default:
        globalService.error('Api not found. Invalid Report name.')
    }
  };

  return (
    <>
      <React.Fragment>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            justifyContent: "flex-start",
            backgroundColor: "var(--primary-color)",
            color: "white",
            textDecoration: "none",
            overflowX: "auto",
          }}
        >
          {/* Common */}
          <Button
            id="common-button"
            aria-controls={open ? "common-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Admin],auth) && !showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "common")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Common
          </Button>
          <StyledMenu
            id="common-menu"
            MenuListProps={{
              "aria-labelledby": "common-button",
            }}
            anchorEl={commonAnchorEl}
            open={openCommon}
            onClose={handleClose}
          >
            <Link color="inherit" href={"/banks"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Bank
              </MenuItem>
            </Link>
            <Link color="inherit" href={"/parkingTypes"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Parking Type
              </MenuItem>
            </Link>
            {/* <Divider sx={{ my: 0.5 }} /> */}
            <Link color="inherit" href={"/unitTypes"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Unit Type
              </MenuItem>
            </Link>

            <Link color="inherit" href={"/uoms"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Unit of Measurement
              </MenuItem>
            </Link>
            {isVisible &&
            <Link color="inherit" href={"/sms"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Sms Template
              </MenuItem>
            </Link>
            }
            
            <Link color="inherit" href={"/advertisements"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Advertisement
              </MenuItem>
            </Link>
             { isVisible &&
            <Link color="inherit" href={"/mailers"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Mailers
              </MenuItem>
            </Link>
              }
            <Link color="inherit" href={"/Relationships"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Relationship
              </MenuItem>
            </Link>

          </StyledMenu>

          {/*Admin Society */}
          { societyVisible &&
          <Button
            id="admin-society-button"
            aria-controls={open ? "admin-society-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Admin], auth) && !showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "adminSociety")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Society
          </Button>
          }
          <StyledMenu
            id="admin-society-menu"
            MenuListProps={{
              "aria-labelledby": "admin-society-button",
            }}
            anchorEl={adminSocietyAnchorEl}
            open={openAdminSociety}
            onClose={handleClose}
          >
          </StyledMenu>
          
          {/* Standard */}
          <Button
            id="standard-button"
            aria-controls={open ? "standard-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Admin],auth) && !showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "standard")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Standard
          </Button>
          <StyledMenu
            id="standard-menu"
            MenuListProps={{
              "aria-labelledby": "standard-button",
            }}
            anchorEl={standardAnchorEl}
            open={openStandard}
            onClose={handleClose}
          >
            <Link color="inherit" href={"/payModes"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Pay Mode
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/standardAcCategories"}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account Category
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/standardAcSubCategories"}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account Sub Category
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/standardAcheads"}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account Head
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/standardChargeheads"}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Charge Head
              </MenuItem>
            </Link>
          </StyledMenu>
          {/* Tax */}
          <Button
            id="tax-button"
            //aria-controls={open ? 'tax-menu' : undefined}
            //aria-haspopup="true"
            //aria-expanded={open ? 'true' : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Admin],auth) && !showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "tax")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Tax
          </Button>
          <StyledMenu
            id="tax-menu"
            MenuListProps={{
              "aria-labelledby": "tax-button",
            }}
            anchorEl={taxAnchorEl}
            open={openTax}
            onClose={handleClose}
          >
            <Link color="inherit" href={"/taxes"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                Tax
              </MenuItem>
            </Link>
            <Link color="inherit" href={"/Tdscategories"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                TDS Category
              </MenuItem>
            </Link>
          </StyledMenu>

          {/*Society */}
          {/* <Link
                        color="inherit"
                        noWrap
                        variant="body2"
                        href={"/mySociety"}
                        className={`nav-link ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Subscriber],auth) ? "" : "hidden"}`}
                        sx={{
                            p: 1,
                            flexShrink: 0,
                        }}
                    >
                        My Society
                    </Link> */}
          <Button
            id="society-button"
            aria-controls={open ? "society-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "society")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Society
          </Button>
          <StyledMenu
            id="society-menu"
            MenuListProps={{
              "aria-labelledby": "society-button",
            }}
            anchorEl={societyAnchorEl}
            open={openSociety}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={"/editSociety/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Society Detail
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/parameters/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Parameters
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societyMembers/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Member Details
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societyBuildings/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Building Details
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/societyParkings/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Parking Details
              </MenuItem>
            </Link>
            {/* <Link
              color="inherit"
              href={"/societySubscriptions/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Change year
              </MenuItem>
            </Link> */}
          </StyledMenu>

          {/*Billing */}
          <Button
            id="billing-button"
            aria-controls={open ? "billing-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "billing")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Billing
          </Button>
          <StyledMenu
            id="billing-menu"
            MenuListProps={{
              "aria-labelledby": "billing-button",
            }}
            anchorEl={billingAnchorEl}
            open={openBilling}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={"/societyChargeHeads/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Charge Head
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societyBillSeries/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bill Series
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societySpecialBills/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Special Bills
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/addSocietyBill/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bills
              </MenuItem>
            </Link>
          </StyledMenu>

          <Button
            id="collection-button"
            aria-controls={open ? "collection-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "collection")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Collection
          </Button>
          <StyledMenu
            id="collection-menu"
            MenuListProps={{
              "aria-labelledby": "collection-button",
            }}
            anchorEl={collectionAnchorEl}
            open={openCollection}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={"/societyPayModes/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Pay Mode
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/societyReceipts/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Receipt
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societyCollectionReversal/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Collection Reversal
              </MenuItem>
            </Link>
            {/* <Link color="inherit" href={"/"} className="nav-link">
              <MenuItem
                onClick={handleClose}
                disableRipple
                className="bg-light-red"
              >
                On Hold Receipt
              </MenuItem>
            </Link> */}
            <Link
              color="inherit"
              href={"/payInSlip/" + societyId + "/" + societySubscriptionId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Pay in slip
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/societyInvestments/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Investment
              </MenuItem>
            </Link>
          </StyledMenu>

          <Button
            id="report-button"
            aria-controls={open ? "report-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "report")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Report
          </Button>
          <StyledMenu
            id="report-menu"
            MenuListProps={{
              "aria-labelledby": "report-button",
            }}
            anchorEl={reportAnchorEl}
            open={openReport}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              onClick={(e) => downloadReport("MemberRegister")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Member Register (Pdf)
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("MemberRegisterExportToExcel")}
              className="nav-link"
            >
              {ReportExcelAppInfo && 
              <MenuItem onClick={handleClose} disableRipple>
                Member Register (Excel)
              </MenuItem>
              }
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("LienRegisterExportToExcel")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Lien Register (Excel)
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("NominationRegister")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Nomination Register
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("CommitteeMembersExportToExcel")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                List Of Committee Members
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) =>
                downloadReport("JointHolderRegisterExportToExcel")
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Joint Holder Register
              </MenuItem>
            </Link>
            <Divider />
            <Link
              color="inherit"
              href={
                "/memberLedgerReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Member Ledger Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/memberBalanceReport/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Member Balance Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("JFormReportPDF")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                "J" Form (PDF)
              </MenuItem>
            </Link>
            { ReportExcelAppInfo &&
            <Link
            color='inherit'
            onClick={(e) => downloadReport("JFormReportExcel")}
            className="nav-link"
            >
            <MenuItem onClick={handleClose} disableRipple>
              "J" Form (Excel)
            </MenuItem>
            </Link>
            }
            <Link
              color="inherit"
              onClick={(e) => downloadReport("IFormReport")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                "I" Form (PDF)
              </MenuItem>
            </Link>
            <Divider />
            <Link
              color="inherit"
              onClick={(e) => downloadReport("ShareRegister")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Share Register
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("ShareTransferReport")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Share Transfer Register
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              onClick={(e) => downloadReport("ShareLedgerReport")}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Share Ledger Register
              </MenuItem>
            </Link>
            <Divider />
            <Link
              color="inherit"
              href={
                "/billRegisterReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bill Register
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/collectionReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Collection Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/collectionReversalReport/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Collection Reversal Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/investmentReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Investment Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/parkingRegister/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Parking Register
              </MenuItem>
            </Link>
          </StyledMenu>

          <Button
            id="account-button"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "account")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Account
          </Button>
          <StyledMenu
            id="account-menu"
            MenuListProps={{
              "aria-labelledby": "account-button",
            }}
            anchorEl={accountAnchorEl}
            open={openAccount}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={"/acCategorie/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account Category
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/acSubCategorie/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account Sub Category
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/acHeads/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Account
              </MenuItem>
            </Link>
          </StyledMenu>

          <Button
            id="transaction-button"
            aria-controls={open ? "transaction-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "transaction")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Transaction
          </Button>
          <StyledMenu
            id="transaction-menu"
            MenuListProps={{
              "aria-labelledby": "transaction-button",
            }}
            anchorEl={transactionAnchorEl}
            open={openTransaction}
            onClose={handleClose}
          >
            {docTypes &&
              docTypes.map((docType: string) => (
                ((docType === "OP" && isFirstSocietySubscription === true) || docType !== "OP") && (
                  <Link
                    key={"lnk" + docType}
                    color="inherit"
                    href={
                      "/acTransactions/" + societySubscriptionId + "/" + docType
                    }
                    className="nav-link"
                  >
                    <MenuItem onClick={handleClose} disableRipple>
                      {globalService.getDocTypeMenuText(docType)}
                    </MenuItem>
                  </Link>
                )
              ))}
          </StyledMenu>
          
          <Button
            id="account-report-button"
            aria-controls={open ? "account-report-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "account-report")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            A/c Report
          </Button>
          <Button
            id="utility-button"
            aria-controls={open ? "utility-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "utility")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            A/c Utility
          </Button>
          <StyledMenu
            id="utility-menu"
            MenuListProps={{
              "aria-labelledby": "utility-button",
            }}
            anchorEl={utilityAnchorEl}
            open={openUtility}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={
                "/bankReconciliation/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bank Reconciliation
              </MenuItem>
            </Link>
          </StyledMenu>


          <Button
            id="utility-button"
            aria-controls={open ? "utility-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Subscriber, ROLES.Admin, ROLES.Society],auth) &&
              showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "utility")}
            href={"/societySubscriptions/" + societyId}
            //endIcon={<KeyboardArrowDownIcon />}
          >
            Change Year
          </Button>
          {/* <StyledMenu
            id="utility-menu"
            MenuListProps={{
              "aria-labelledby": "utility-button",
            }}
            anchorEl={utilityAnchorEl}
            open={openUtility}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={"/societySubscriptions/" + societyId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bank Reconciliation
              </MenuItem> 
            </Link>
          </StyledMenu> */}



          <StyledMenu
            id="account-report-menu"
            MenuListProps={{
              "aria-labelledby": "report-button",
            }}
            anchorEl={accountReportAnchorEl}
            open={openAccountReport}
            onClose={handleClose}
          >
            <Link
              color="inherit"
              href={
                "/transactionReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Transaction Register Report
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={
                "/generalLedgerReport/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                General Ledger
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/trialBalanceReport/" + societyId + "/" + societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Trial Balance
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/incomeExpenditureStatement/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Income & Expenditure A/c
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/incomeExpenditureSchedule/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Schedule to Income & Expenditure A/c
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/balanceSheet/" + societyId + "/" + societySubscriptionId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Balance Sheet
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/balanceSheetSchedule/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Schedule to Balance Sheet
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={"/finalReport/" + societyId + "/" + societySubscriptionId}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Final Report for Audit
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/bankReconciliationReport/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Bank Reconciliation Report
              </MenuItem>
            </Link>
            <Link
              color="inherit"
              href={
                "/receiptAndPaymentStatementReport/" +
                societyId +
                "/" +
                societySubscriptionId
              }
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Receipt & Payment Report
              </MenuItem>
            </Link>
          </StyledMenu>

          <Button
            id="user-button"
            //aria-controls={open ? 'tax-menu' : undefined}
            //aria-haspopup="true"
            //aria-expanded={open ? 'true' : undefined}
            // variant="contained"
            className={`nav-btn ${globalService.roleMatch([ROLES.ReadOnly,ROLES.Admin],auth) && !showSocietySubscriptedNav
              ? ""
              : "hidden"
              }`}
            disableElevation
            onClick={(e) => handleClick(e, "user")}
            endIcon={<KeyboardArrowDownIcon />}
          >
            User
          </Button>
          <StyledMenu
            id="user-menu"
            MenuListProps={{
              "aria-labelledby": "user-button",
            }}
            anchorEl={userAnchorEl}
            open={openUser}
            onClose={handleClose}
          >
            <Link color="inherit" href={"/users"} className="nav-link">
              <MenuItem onClick={handleClose} disableRipple>
                User
              </MenuItem>
            </Link>

            <Link
              color="inherit"
              href={"/passwordQuestions"}
              className="nav-link"
            >
              <MenuItem onClick={handleClose} disableRipple>
                Password Question
              </MenuItem>
            </Link>
          </StyledMenu>
        </Toolbar>
      </React.Fragment>
    </>
  );
};

export default Navbar;
