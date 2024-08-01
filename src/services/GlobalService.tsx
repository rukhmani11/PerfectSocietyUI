import React from 'react'
import { toast } from 'react-toastify';
import { AuthModel } from '../models/UserModel';

///////////////Toast Notifications/////////////////////
const pageTitle = "Home";
//https://fkhadra.github.io/react-toastify/introduction/
const success = (msg: string) => toast.success(msg, {
  position: "top-left",
  theme: "colored",
});

function error(msg: string) {
  return toast.error(msg, {
    position: "top-left",
    theme: "colored",
  });
}

function warning(msg: string) {
  return toast.warning(msg, {
    position: "top-left",
    theme: "colored",
  });
}

function info(msg: string) {
  return toast.info(msg, {
    position: "top-left",
    theme: "colored",
  });
}
///////////////Ends Toast Notifications/////////////////////

function getNatures() {
  const result = [
    { Value: "A", Text: "Per Area" },
    { Value: "L", Text: "Late Payment Penalty" },
    { Value: "E", Text: "Early Payment Discount" },
    { Value: "I", Text: "Interest" },
    { Value: "T", Text: "Tax" },
    { Value: "N", Text: "Non-Occupancy" },
  ];
  return result;
}

function getBalanceFilterForReport() {
  const result = [
    { Value: "All", Text: "All" },
    { Value: "Advance", Text: "Advance" },
    { Value: "Outstanding", Text: "Outstanding" }
  ];
  return result;
}

function getBillingFrequency() {
  const result = [
    { Text: 'Monthly', Value: 'M' },
    { Text: 'Bi-Monthly', Value: 'B' },
    { Text: 'Quarterly', Value: 'Q' },
    { Text: 'Half-Yearly', Value: 'H' },
    { Text: 'Yearly', Value: 'Y' },
  ];
  return result;
}

function getOsAdjustments() {
  const result = [
    { Text: 'Tax/Int/NonChg/Chg', Value: 'A' },
    { Text: 'Tax/Chg/Int/NonChg', Value: 'B' },
  ];
  return result;
}

function getAccountPostings() {
  const result = [
    { Value: 'S', Text: 'Summary' },
    { Value: 'D', Text: 'Details' },
    { Value: 'N', Text: 'No' },
  ];
  return result;
}

function getDocTypeSelectList() {
  const result = [
    { Value: "OP", Text: "Opening Balance" },
    { Value: "CP", Text: "Cash Payment" },
    { Value: "CR", Text: "Cash Receipt" },
    { Value: "BP", Text: "Bank Payment" },
    { Value: "BR", Text: "Bank Receipt" },
    { Value: "PB", Text: "Purchase Bill" },
    { Value: "SB", Text: "SocietyBill" },
    { Value: "JV", Text: "Journal Voucher" },
    { Value: "MC", Text: "Member Collection" },
    { Value: "YC", Text: "Year End Closing Entry" }
  ];
  return result;
}

function getParkingRegisterReportStatus() {
  const result = [
    { Value: "All", Text: "All" },
    { Value: "Active", Text: "Active" },
    { Value: "Closed", Text: "Closed" }
  ];
  return result;
}

function getDocTypeMenuText(docType: string) {
  switch (docType) {
    case 'OP':
      return 'Opening Balance';
    case 'CP':
      return 'Cash Payment';
    case 'CR':
      return 'Cash Receipt';
    case 'BP':
      return 'Bank Payment';
    case 'BR':
      return 'Bank Receipt';
    case 'PB':
      return 'Purchase Bill';
    case 'EB':
      return 'Expense Bill';
    case 'JV':
      return 'Journal Voucher';
    case 'SB':
      return 'Society Bill';
    case 'MC':
      return 'Member Collection';
    case 'CV':
      return 'Collection Revesal';
    case 'YC':
      return 'Year End Closing Transaction';
    default:
      return '';
  }
}

function convertLocalToUTCDate(date: Date) {
  if (!date) {
    return date
  }

  //date = new Date(date);
  // var now = new Date();
  // var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
  //date.setUTCHours(0);
  return date;
}

function validateEmail(email: string) {

  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  return regex.test(email);
}

function getDrCrList() {
  const result = [
    { Value: 'B', Text: 'Both' },
    { Value: 'D', Text: 'Debit' },
    { Value: 'C', Text: 'Credit' },
  ];
  return result;
}
function getDrCr() {
  const result = [
    { Value: 'D', Text: 'Debit' },
    { Value: 'C', Text: 'Credit' },
  ];
  return result;
}

const addMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() + months);
  return date;
}

function convertJsonToBlob(obj: any) {
  const str = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/json;charset=utf-8"
  });
  return blob;
}

function convertJsonToBlobExcel(obj: any) {
  const str = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  return blob;
}

function isFirstSocietySubscription() {
  let isFirstSocietySubscription = (localStorage.getItem("firstSocietySubscriptionId") === localStorage.getItem("societySubscriptionId"));
  return isFirstSocietySubscription;
}

function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}

const roleMatch = (allowedRoles: string[], auth: AuthModel) => {
  var isMatch = false;
  auth?.Roles?.find((role: any) => allowedRoles?.includes(role))
    ? (isMatch = true)
    : (isMatch = false);
  // (allowedRoles?.includes(auth?.Roles)) ? isMatch = true : isMatch = false;
  return isMatch;
};

function isSocietySelected() {
  let societyId = localStorage.getItem("societyId");
  return societyId ? true : false;
}

export const globalService = {
  pageTitle,
  success,
  error,
  info,
  warning,

  convertLocalToUTCDate,
  getNatures,
  getBillingFrequency,
  getOsAdjustments,
  getAccountPostings,
  getBalanceFilterForReport,
  validateEmail,
  getDocTypeMenuText,
  getDocTypeSelectList,
  getDrCrList,
  addMonths,
  getParkingRegisterReportStatus,
  convertJsonToBlobExcel,
  getDrCr,
  // getDrCrId
  isFirstSocietySubscription,
  generateSessionId,
  roleMatch,
  isSocietySelected
};