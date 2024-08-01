import React from "react";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "../components/helper/PageNotFound";
import UnAuthorized from "../components/helper/UnAuthorized";
import Home from "../components/user/Home";
import Login from "../components/user/Login";
import UserList from "../components/user/UserList";
import { ROLES } from "./Config";
import RequireAuth from "./RequireAuth";
import DefaultLayout from "../components/layout/DefaultLayout";
import AdminHome from "../components/user/AdminHome";
import BankList from "../components/commonMasters/BankList";
import ParkingTypeList from "../components/commonMasters/ParkingTypeList";
import UnitTypesList from "../components/commonMasters/UnitTypesList";
import SmsList from "../components/commonMasters/SmsList";
import UserForm from "../components/user/UserForm";

import PayModeList from "../components/standard/PayModeList";
import SubscriberForm from "../components/society/SubscriberForm";
import UomsList from "../components/commonMasters/UomsList";
import StandardAcHeadForm from "../components/standard/StandardAcHeadForm";
import PayModeForm from "../components/standard/PayModeForm";
import StandardAcCategoryList from "../components/standard/StandardAcCategoryList";
import RelationshipList from "../components/society/RelationshipList";
import MemberClassList from "../components/society/MemberClassList";
//import StandardAcSubCategoryList from "../components/standard/StandardAcSubCategoryList";
//import StandardAcHeadList from "../components/standard/StandardAcHeadList";
import BankForm from "../components/commonMasters/BankForm";
import AppInfoForm from "../components/commonMasters/AppInfoForm";
//import StandardChargeHeadList from "../components/standard/StandardChargeHeadList";
import TdscategoriesList from "../components/tax/TdsCategoryList";
import TaxList from "../components/tax/TaxList";
import ParkingTypeForm from "../components/commonMasters/ParkingTypeForm";
import RelationshipForm from "../components/society/RelationshipForm";
import UnitTypesForm from "../components/commonMasters/UnitTypesForm";
import MemberClassForm from "../components/society/MemberClassForm";
import SocietiesList from "../components/society/SocietiesList";
import SocietiesForm from "../components/society/SocietiesForm";
import StandardAcCategoryForm from "../components/standard/StandardAcCategoryForm";
import StandardAcSubCategoriesForm from "../components/standard/StandardAcSubCategoriesForm";
import UomForm from "../components/commonMasters/UomForm";
import StandardChargeHeadForm from "../components/standard/StandardChargeHeadForm";
import MySocietyList from "../components/society/MySocietyList";
import SocietyMembersList from "../components/society/member/SocietyMembersList";
import SocietySubscriptionList from "../components/society/SocietySubscriptionList";
import SocietyView from "../components/society/SocietyView";
import SocietyMembersForm from "../components/society/member/SocietyMembersForm";
import TdsCategoryForm from "../components/tax/TdsCategoryForm";
import Dashboard from "../components/society/Dashboard";
import SocietyBuildingList from "../components/society/building/SocietyBuildingList";
import SocietyBuildingUnitList from "../components/society/building/SocietyBuildingUnitList";
import SocietyBuildingUnitForm from "../components/society/building/SocietyBuildingUnitForm";
import TaxForm from "../components/tax/TaxForm";
import SocietyBuildingForm from "../components/society/building/SocietyBuildingForm";
import TdsCategoryRateList from "../components/tax/TdsCategoryRateList";
import TdsCategoryRateForm from "../components/tax/TdsCategoryRateForm";

import SocietyBuildingUnitView from "../components/society/building/SocietyBuildingUnitView";
import SocietyBuildingUnitChargeHeadList from "../components/society/building/SocietyBuildingUnitChargeHeadList";
import SocietyBuildingUnitChargeHeadForm from "../components/society/building/SocietyBuildingUnitChargeHeadForm";
import SocietyBillSeriesList from "../components/billing/SocietyBillSeriesList";
import SocietyBillSeriesForm from "../components/billing/SocietyBillSeriesForm";
import SocietyParkingList from "../components/society/parking/SocietyParkingList";
import SocietyParkingForm from "../components/society/parking/SocietyParkingForm";
import SocietyMemberJointHoldersForm from "../components/society/member/SocietyMemberJointHoldersForm";
import SocietyMemberJointHoldersList from "../components/society/member/SocietyMemberJointHoldersList";
import StandardAcHeadsList from "../components/standard/StandardAcHeadsList";
import StandardAcSubCategoriesList from "../components/standard/StandardAcSubCategoriesList";
import StandardChargeHeadsList from "../components/standard/StandardChargeHeadsList";
import SocietyChargeHeadList from "../components/billing/SocietyChargeHeadList";
import SocietyChargeHeadForm from "../components/billing/SocietyChargeHeadForm";
import SocietyBuildingUnitMemberList from "../components/society/building/SocietyBuildingUnitMemberList";
import SocietyBuildingUnitMemberForm from "../components/society/building/SocietyBuildingUnitMemberForm";
import SocietySpecialBillList from "../components/billing/SocietySpecialBillList";
import SocietySpecialBillForm from "../components/billing/SocietySpecialBillForm";
import SocietyBuildingUnitParkingList from "../components/society/building/SocietyBuildingUnitParkingList";
import SocietyBuildingUnitParkingForm from "../components/society/building/SocietyBuildingUnitParkingForm";
import ParametersForm from "../components/society/ParametersForm";
import SocietySubscriptionForm from "../components/society/SocietySubscriptionForm";
import SocietyPayModeList from "../components/society/collection/SocietyPayModeList";
import SocietyPayModeForm from "../components/society/collection/SocietyPayModeForm";
import SocietyMemberNomineeList from "../components/society/member/SocietyMemberNomineeList";
import SocietyMemberNomineeForm from "../components/society/member/SocietyMemberNomineeForm";
import SocietySpecialBillChargeHeadList from "../components/billing/SocietySpecialBillChargeHeadList";
import SocietySpecialBillChargeHeadForm from "../components/billing/SocietySpecialBillChargeHeadForm";
import SocietySpecialBillUnitList from "../components/billing/SocietySpecialBillUnitList";
import SocietySpecialBillUnitForm from "../components/billing/SocietySpecialBillUnitForm";
import SocietyCollectionReversalForm from "../components/society/collection/SocietyCollectionReversalForm";
import SocietyReceiptsList from "../components/society/collection/SocietyReceiptsList";
import SocietiesListView from "../components/society/SocietiesListView";
import SocietyReceiptsForm from "../components/society/collection/SocietyReceiptsForm";
import SocietyBillForm from "../components/billing/SocietyBillForm";
import SocietyInvestmentList from "../components/society/collection/SocietyInvestmentList";
import SocietyInvestmentForm from "../components/society/collection/SocietyInvestmentForm";
import PasswordQuestionList from "../components/user/PasswordQuestionList";
import PasswordQuestionForm from "../components/user/PasswordQuestionForm";
import SocietyReceiptView from "../components/society/collection/SocietyReceiptView";
import AcTransactionsList from "../components/transaction/AcTransactionsList";
import AcTransactionsForm from "../components/transaction/AcTransactionsForm";
import SocietyBuildingUnitSubscriptionBalancesList from "../components/society/building/SocietyBuildingUnitSubscriptionBalancesList";
import SocietyBuildingUnitSubscriptionBalancesForm from "../components/society/building/SocietyBuildingUnitSubscriptionBalancesForm";
import BillView from "../components/billing/BillView";
import SocietyCollectionReversalList from "../components/society/collection/SocietyCollectionReversalList";
import MemberLedgerReportForm from "../components/societyReport/MemberLedgerReportForm";
import MemberBalanceReportForm from "../components/societyReport/MemberBalanceReportForm";
import BillRegisterReportForm from "../components/societyReport/BillRegisterReportForm";
import CollectionReportForm from "../components/societyReport/CollectionReportForm";
import CollectionReversalReportForm from "../components/societyReport/CollectionReversalReportForm";
import SocietyBuildingUnitExcelUpload from "../components/society/building/SocietyBuildingUnitExcelUpload";
import SocietyCollectionReversalView from "../components/society/collection/SocietyCollectionReversalView";
import SocietyBuildingUnitChargeHeadsExcelUpload from "../components/society/building/SocietyBuildingUnitChargeHeadsExcelUpload";
import AcTransactionsAcsList from "../components/transaction/AcTransactionsAcsList";
import AcTransactionView from "../components/transaction/AcTransactionView";
import TransactionReportForm from "../components/accountingReport/TransactionReportForm";
import TrialBalanceReportForm from "../components/accountingReport/TrialBalanceReportForm";
import IncomeExpenditureScheduleReport from "../components/accountingReport/IncomeExpenditureScheduleReport";
import IncomeExpenditureStatementForm from "../components/accountingReport/IncomeExpenditureStatementForm";
import BalanceSheetForm from "../components/accountingReport/BalanceSheetForm";
import AcSubCategoriesList from "../components/account/AcSubCategoriesList";
import AcCategoriesList from "../components/account/AcCategoriesList";
import AcHeadsList from "../components/account/AcHeadsList";
import FinalReportForAuditForm from "../components/accountingReport/FinalReportForAuditForm";
import BankReconciliationReportForm from "../components/accountingReport/BankReconciliationReportForm";
import ReceiptAndPaymentStatementReportForm from "../components/accountingReport/ReceiptAndPaymentStatementReportForm";
import AcTransactionsAcsForm from "../components/transaction/AcTransactionsAcsForm";
import GeneralLedgerReportForm from "../components/accountingReport/GeneralLedgerReportForm";
import SocietyBuildingUnitMemberExcelUpload from "../components/society/building/SocietyBuildingUnitMemberExcelUpload";
import SocietyMembersExcelUpload from "../components/society/member/SocietyMembersExcelUpload";
import AcCategoriesForm from "../components/account/AcCategoriesForm";
import AcSubCategoriesForm from "../components/account/AcSubCategoriesForm";
import AcHeadsForm from "../components/account/AcHeadsForm";
import InvestmentReportForm from "../components/societyReport/InvestmentReportForm";
import BankReconciliationForm from "../components/account/BankReconciliationForm";
import SocietyReceiptsExcelUpload from "../components/society/collection/SocietyReceiptsExcelUpload";
import PayInSlipReportForm from "../components/societyReport/PayInSlipReportForm";
import ParkingRegisterReportForm from "../components/societyReport/ParkingRegisterReportForm";
import AdvertisementsList from "../components/commonMasters/AdvertisementsList";
import AdvertisementForm from "../components/commonMasters/AdvertisementsForm";
import MailersList from "../components/commonMasters/MailersList";
import MailersForm from "../components/commonMasters/MailersForm";
import Examples from "../components/user/Examples";
import ResetPasswordForm from "../components/user/ResetPasswordForm";
import ItemRateForm from "../components/etc/ItemRateForm";
import Index from "../components/user/Index";
import PrivacyPolicy from "../components/user/PrivacyPolicy";
import RefundPolicy from "../components/user/RefundPolicy";
import TermsandConditions from "../components/user/TermsandConditions";
import ExampleB from "../components/user/ExampleB";
import AppInfoView from "../components/commonMasters/AppInfoView";
import { NavigationProvider } from "./context/NavigationContext";

interface ParamTypes {
  societyBuildingId: string;
  societyBuildingUnitId: string;
  societyBuildingUnitChargeHeadId: string;
}

function AppRoutes() {
  return (
    <div>
      <NavigationProvider>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="html" element={<ExampleB />} />
            <Route path="login" element={<Login />} />
            <Route path="unauthorized" element={<UnAuthorized />} />
            <Route path="example" element={<Examples />} />
            <Route path="privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="refundPolicy" element={<RefundPolicy />} />
            <Route path="termsandConditions" element={<TermsandConditions />} />
            {/* <Route path="index" element={<Index />} /> */}
            {/* <Route path={"/aboutUs.html"} /> */}


            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Subscriber, ROLES.Society, ROLES.ReadOnly]} />}>
              <Route path="resetPassword/:id" element={<ResetPasswordForm />} />

              <Route path="societyUsers/:societyId/:callFrom" element={<UserList />} />
              <Route path="societyUser/:societyId" element={<UserForm />} />
              <Route path="societyUser/:societyId/:id" element={<UserForm />} />

              <Route path="societies/:subscriberId" element={<SocietiesList />} />
              <Route path="addSociety" element={<SocietiesForm />} />
              <Route path="editSociety/:societyId" element={<SocietiesForm />} />
              <Route path="viewSociety/:societyId" element={<SocietiesListView />} />
              <Route path="mySociety" element={<MySocietyList showCard={true} />} />
              <Route path="parameters/:societyId" element={<ParametersForm />} />

              <Route path="societySubscriptions/:societyId" element={<SocietySubscriptionList />} />
              <Route path="addSocietySubscription/:societyId" element={<SocietySubscriptionForm />} />
              <Route path="editSocietySubscription/:societyId/:societySubscriptionId" element={<SocietySubscriptionForm />} />

              <Route path="societyView/:societySubscriptionId" element={<SocietyView />} />
              <Route path="dashboard/:societySubscriptionId" element={<Dashboard />} />

              <Route path="societyMembers/:societyId" element={<SocietyMembersList />} />
              <Route path="addsocietyMember/:societyId" element={<SocietyMembersForm />} />
              <Route path="editsocietyMember/:societyId/:societyMemberId" element={<SocietyMembersForm />} />
              <Route path="societyMembersExcelUpload/:societyId" element={<SocietyMembersExcelUpload />} />

              <Route path="SocietyMemberNominees/:societyMemberId/:societyId" element={<SocietyMemberNomineeList />} />
              <Route path="addSocietyMemberNominee/:societyMemberId/:societyId" element={<SocietyMemberNomineeForm />} />
              <Route path="editSocietyMemberNominee/:societyMemberId/:SocietyMemberNomineeId/:societyId" element={<SocietyMemberNomineeForm />} />

              <Route path="societyBuildings/:societyId" element={<SocietyBuildingList />} />
              <Route path="addSocietyBuilding/:societyId" element={<SocietyBuildingForm />} />
              <Route path="editSocietyBuilding/:societyId/:societyBuildingId" element={<SocietyBuildingForm />} />

              <Route path="societyBuildingUnits/:societyBuildingId" element={<SocietyBuildingUnitList />} />
              <Route path="addSocietyBuildingUnit/:societyBuildingId" element={<SocietyBuildingUnitForm />} />
              <Route path="editSocietyBuildingUnit/:societyBuildingId/:societyBuildingUnitId" element={<SocietyBuildingUnitForm />} />
              <Route path="viewSocietyBuildingUnit/:societyBuildingId/:societyBuildingUnitId" element={<SocietyBuildingUnitView />} />
              <Route path="societyBuildingUnitExcelUpload/:societyBuildingId" element={<SocietyBuildingUnitExcelUpload />} />

              <Route path="societyParkings/:societyId" element={<SocietyParkingList />} />
              <Route path="addsocietyParking/:societyId" element={<SocietyParkingForm />} />
              <Route path="editsocietyParking/:societyId/:SocietyParkingId" element={<SocietyParkingForm />} />

              <Route path="societyCollectionReversal/:societyId" element={<SocietyCollectionReversalList />} />
              <Route path="addsocietyCollectionReversal/:societySubscriptionId/:societyId" element={<SocietyCollectionReversalForm />} />
              <Route path="editsocietyCollectionReversal/:societyId/:societyCollectionReversalId" element={<SocietyCollectionReversalForm />} />
              <Route path="viewSocietyCollectionReversal/:societyId/:societyCollectionReversalId" element={<SocietyCollectionReversalView />} />

              <Route path="societyBuildingUnitParkings/:societyBuildingUnitId" element={<SocietyBuildingUnitParkingList />} />
              <Route path="addsocietyBuildingUnitParking/:societyBuildingUnitId" element={<SocietyBuildingUnitParkingForm />} />
              <Route path="editsocietyBuildingUnitParking/:societyBuildingUnitId/:SocietyBuildingUnitParkingId" element={<SocietyBuildingUnitParkingForm />} />

              <Route path="societyBuildingUnitChargeHeads/:societyBuildingUnitId" element={<SocietyBuildingUnitChargeHeadList />} />
              <Route path="addSocietyBuildingUnitChargeHead/:societyBuildingUnitId" element={<SocietyBuildingUnitChargeHeadForm />} />
              <Route path="editSocietyBuildingUnitChargeHead/:societyBuildingUnitId/:societyBuildingUnitChargeHeadId" element={<SocietyBuildingUnitChargeHeadForm />} />
              <Route path="societyBuildingUnitChargeHeadsExcelUpload/:societyBuildingId" element={<SocietyBuildingUnitChargeHeadsExcelUpload />} />

              <Route path="societyChargeHeads/:societyId" element={<SocietyChargeHeadList />} />
              <Route path="addSocietyChargeHead/:societyId" element={<SocietyChargeHeadForm />} />
              <Route path="editSocietyChargeHead/:societyId/:chargeHeadId" element={<SocietyChargeHeadForm />} />

              <Route path="societyBillSeries/:societyId" element={<SocietyBillSeriesList />} />
              <Route path="addSocietyBillSeries/:societyId" element={<SocietyBillSeriesForm />} />
              <Route path="editSocietyBillSeries/:societyId/:billAbbr" element={<SocietyBillSeriesForm />} />

              <Route path="societySpecialBills/:societyId" element={<SocietySpecialBillList />} />
              <Route path="addSocietySpecialBill/:societyId" element={<SocietySpecialBillForm />} />
              <Route path="editSocietySpecialBill/:societyId/:societySpecialBillId" element={<SocietySpecialBillForm />} />

              <Route path="societySpecialBillChargeHeads/:societySpecialBillId" element={<SocietySpecialBillChargeHeadList />} />
              <Route path="addSocietySpecialBillChargeHead/:societySpecialBillId" element={<SocietySpecialBillChargeHeadForm />} />
              <Route path="editSocietySpecialBillChargeHead/:societySpecialBillId/:societySpecialBillChargeHeadId" element={<SocietySpecialBillChargeHeadForm />} />

              <Route path="societySpecialBillUnits/:societySpecialBillId" element={<SocietySpecialBillUnitList />} />
              <Route path="addSocietySpecialBillUnit/:societySpecialBillId" element={<SocietySpecialBillUnitForm />} />
              {/* <Route path="editSocietySpecialBillUnit/:societySpecialBillId/:societySpecialBillUnitId" element={<SocietySpecialBillUnitForm />} /> */}

              <Route path="viewBill/:societyId/:societyBillId" element={<BillView />} />

              <Route path="societyMemberJointHolders/:societyMemberId/:societyId" element={<SocietyMemberJointHoldersList />} />
              <Route path="addSocietyMemberJointHolders/:societyMemberId/:societyId" element={<SocietyMemberJointHoldersForm />} />
              <Route path="ediSocietyMemberJointHolders/:societyMemberId/:societyMemberJointHolderId/:societyId" element={<SocietyMemberJointHoldersForm />} />

              <Route path="societyBuildingUnitMembers/:societyBuildingUnitId" element={<SocietyBuildingUnitMemberList />} />
              <Route path="addSocietyBuildingUnitMember/:societyBuildingUnitId" element={<SocietyBuildingUnitMemberForm />} />
              <Route path="editSocietyBuildingUnitMember/:societyBuildingUnitId/:SocietyBuildingUnitTransferId" element={<SocietyBuildingUnitMemberForm />} />
              <Route path="societyBuildingUnitMemberExcelUpload/:societyBuildingId" element={<SocietyBuildingUnitMemberExcelUpload />} />

              <Route path="societyPayModes/:societyId" element={<SocietyPayModeList />} />
              <Route path="addSocietyPayMode/:societyId" element={<SocietyPayModeForm />} />
              <Route path="editSocietyPayMode/:societyId/:payModeCode" element={<SocietyPayModeForm />} />

              <Route path="societyReceipts/:societyId/:societySubscriptionId" element={<SocietyReceiptsList />} />
              <Route path="addSocietyReceipt/:societyId/:societySubscriptionId" element={<SocietyReceiptsForm />} />
              <Route path="editSocietyReceipt/:societyId/:societyReceiptId" element={<SocietyReceiptsForm />} />
              <Route path="viewSocietyReceipt/:societyId/:societyReceiptId" element={<SocietyReceiptView />} />
              <Route path="societyReceiptExcelUpload/:societyId/:societySubscriptionId" element={<SocietyReceiptsExcelUpload />} />

              <Route path="societyBuildingUnitSubscriptionBalance/:societyBuildingUnitId" element={<SocietyBuildingUnitSubscriptionBalancesList />} />
              <Route path="addSocietyBuildingUnitSubscriptionBalance/:societyBuildingUnitId" element={<SocietyBuildingUnitSubscriptionBalancesForm />} />
              <Route path="editSocietyBuildingUnitSubscriptionBalance/:societyBuildingUnitId/:SocietyBuildingUnitSubscriptionBalanceId" element={<SocietyBuildingUnitSubscriptionBalancesForm />} />

              <Route path="addSocietyBill/:societyId" element={<SocietyBillForm />} />
              <Route path="societyInvestments/:societyId" element={<SocietyInvestmentList />} />
              <Route path="addSocietyInvestment/:societyId" element={<SocietyInvestmentForm />} />
              <Route path="editSocietyInvestment/:societyId/:societyInvestmentId" element={<SocietyInvestmentForm />} />

              <Route path="acTransactions/:societySubscriptionId/:docType" element={<AcTransactionsList />} />
              <Route path="addAcTransaction/:societySubscriptionId/:docType" element={<AcTransactionsForm />} />
              <Route path="editAcTransaction/:societySubscriptionId/:docType/:acTransactionId" element={<AcTransactionsForm />} />
              <Route path="viewAcTransaction/:societySubscriptionId/:docType/:acTransactionId" element={<AcTransactionView />} />

              <Route path="acCategorie/:societyId" element={<AcCategoriesList />} />
              <Route path="addacCategorie/:societyId" element={<AcCategoriesForm />} />
              <Route path="editacCategorie/:societyId/:CategoryId" element={<AcCategoriesForm />} />

              <Route path="acSubCategorie/:societyId" element={<AcSubCategoriesList />} />
              <Route path="addacSubCategorie/:societyId" element={< AcSubCategoriesForm />} />
              <Route path="editacSubCategorie/:societyId/:SubCategoryId" element={<AcSubCategoriesForm />} />

              <Route path="acTransactionsac/:societySubscriptionId/:docType/:acTransactionId" element={<AcTransactionsAcsList />} />
              <Route path="addacTransactionsac/:societySubscriptionId/:docType/:acTransactionId" element={<AcTransactionsAcsForm />} />
              <Route path="editAcTransactionsAcs/:societySubscriptionId/:docType/:acTransactionId/:acTransactionAcId" element={<AcTransactionsAcsForm />} />

              <Route path="acTransactionsac/:acTransactionId" element={<AcTransactionsAcsList />} />

              <Route path="acHeads/:societyId" element={<AcHeadsList />} />
              <Route path="addAcHeads/:societyId" element={<AcHeadsForm />} />
              <Route path="editAcHeads/:societyId/:AcHeadId" element={<AcHeadsForm />} />

              {/* Society Reports */}
              <Route path="memberLedgerReport/:societyId/:societySubscriptionId" element={<MemberLedgerReportForm />} />
              <Route path="memberBalanceReport/:societyId/:societySubscriptionId" element={<MemberBalanceReportForm />} />
              <Route path="billRegisterReport/:societyId/:societySubscriptionId" element={< BillRegisterReportForm />} />
              <Route path="collectionReport/:societyId/:societySubscriptionId" element={<CollectionReportForm />} />
              <Route path="collectionReversalReport/:societyId/:societySubscriptionId" element={<CollectionReversalReportForm />} />
              <Route path="investmentReport/:societyId/:societySubscriptionId" element={<InvestmentReportForm />} />
              <Route path="payInSlip/:societyId/:societySubscriptionId" element={<PayInSlipReportForm />} />
              <Route path="parkingRegister/:societyId/:societySubscriptionId" element={<ParkingRegisterReportForm />} />

              {/* Account Reports */}
              <Route path="transactionReport/:societyId/:societySubscriptionId" element={<TransactionReportForm />} />
              <Route path="trialBalanceReport/:societyId/:societySubscriptionId" element={<TrialBalanceReportForm />} />
              <Route path="incomeExpenditureStatement/:societyId/:societySubscriptionId" element={<IncomeExpenditureStatementForm />} />
              <Route path="incomeExpenditureSchedule/:societyId/:societySubscriptionId" element={<IncomeExpenditureScheduleReport />} />
              <Route path="balanceSheet/:societyId/:societySubscriptionId" element={<BalanceSheetForm />} />
              <Route path="balanceSheetSchedule/:societyId/:societySubscriptionId" element={<BalanceSheetForm />} />
              <Route path="finalReport/:societyId/:societySubscriptionId" element={<FinalReportForAuditForm />} />
              <Route path="bankReconciliationReport/:societyId/:societySubscriptionId" element={<BankReconciliationReportForm />} />
              <Route path="receiptAndPaymentStatementReport/:societyId/:societySubscriptionId" element={<ReceiptAndPaymentStatementReportForm />} />
              <Route path="generalLedgerReport/:societyId/:societySubscriptionId" element={<GeneralLedgerReportForm />} />

              <Route path="bankReconciliation/:societyId/:societySubscriptionId" element={<BankReconciliationForm />} />
              <Route path="acHeads/:societyId" element={<AcHeadsList />} />
              <Route path="itemRate" element={<ItemRateForm />} />

            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.ReadOnly]} />}>
              <Route path="admin" element={<AdminHome />} />

              <Route path="users" element={<UserList />} />
              <Route path="user" element={<UserForm />} />
              <Route path="user/:id" element={<UserForm />} />

              <Route path="subscriber" element={<SubscriberForm />} />
              <Route path="subscriber/:subscriberId" element={<SubscriberForm />} />

              <Route path="banks" element={<BankList />} />
              <Route path="bank" element={<BankForm />} />
              <Route path="bank/:bankId" element={<BankForm />} />

              <Route path="appInfo" element={<AppInfoForm />} />
              <Route path="appInfoView" element={<AppInfoView />} />
              <Route path="mailers" element={<MailersList />} />
              <Route path="mailer" element={<MailersForm />} />
              <Route path="mailer/:mailerId" element={<MailersForm />} />

              <Route path="advertisements" element={<AdvertisementsList />} />
              <Route path="advertisement" element={<AdvertisementForm />} />
              <Route path="advertisement/:AdvertisementId" element={<AdvertisementForm />} />

              <Route path="standardAcCategories" element={<StandardAcCategoryList />} />
              <Route path="standardAcCategorie" element={<StandardAcCategoryForm />} />
              <Route path="standardAcCategorie/:CategoryId" element={<StandardAcCategoryForm />} />

              <Route path="standardAcheads" element={<StandardAcHeadsList />} />
              <Route path="standardAchead" element={<StandardAcHeadForm />} />
              <Route path="standardAchead/:AcHeadId" element={<StandardAcHeadForm />} />

              <Route path="standardAcSubCategories" element={<StandardAcSubCategoriesList />} />
              <Route path="standardAcSubCategorie" element={<StandardAcSubCategoriesForm />} />
              <Route path="standardAcSubCategorie/:SubCategoryId" element={<StandardAcSubCategoriesForm />} />

              <Route path="standardChargeheads" element={<StandardChargeHeadsList />} />
              <Route path="standardChargehead" element={<StandardChargeHeadForm />} />
              <Route path="standardChargehead/:ChargeHeadId" element={<StandardChargeHeadForm />} />

              <Route path="taxes" element={<TaxList />} />
              <Route path="tax" element={<TaxForm />} />
              <Route path="tax/:TaxId" element={<TaxForm />} />

              <Route path="parkingTypes" element={<ParkingTypeList />} />
              <Route path="addParkingType" element={<ParkingTypeForm />} />
              <Route path="editParkingType/:parkingTypeId" element={<ParkingTypeForm />} />

              <Route path="payModes" element={<PayModeList />} />
              <Route path="payMode" element={<PayModeForm />} />
              <Route path="payMode/:PayModeCode" element={<PayModeForm />} />

              <Route path="sms" element={<SmsList />} />

              <Route path="Relationships" element={<RelationshipList />} />
              <Route path="Relationship" element={<RelationshipForm />} />
              <Route path="Relationship/:RelationshipId" element={<RelationshipForm />} />

              <Route path="memberclasses" element={<MemberClassList />} />
              <Route path="memberclass" element={<MemberClassForm />} />
              <Route path="memberclass/:MemberClassId" element={<MemberClassForm />} />

              <Route path="unitTypes" element={<UnitTypesList />} />
              <Route path="UnitType" element={<UnitTypesForm />} />
              <Route path="UnitType/:UnitTypeId" element={<UnitTypesForm />} />

              <Route path="societyMembers" element={<SocietyMembersList />} />

              <Route path="uoms" element={<UomsList />} />
              <Route path="uom" element={<UomForm />} />
              <Route path="uom/:Uomid" element={<UomForm />} />

              <Route path="tdsCategories" element={<TdscategoriesList />} />
              <Route path="tdsCategory" element={<TdsCategoryForm />} />
              <Route path="tdsCategory/:tdsCategoryId" element={<TdsCategoryForm />} />

              <Route path="tdsCategoryRates/:tdsCategoryId" element={<TdsCategoryRateList />} />
              <Route path="addTdsCategoryRate/:tdsCategoryId" element={<TdsCategoryRateForm />} />
              <Route path="editTdsCategoryRate/:tdsCategoryId/:tdsCategoryRateId" element={<TdsCategoryRateForm />} />

              <Route path="passwordQuestions" element={<PasswordQuestionList />} />
              <Route path="addPasswordQuestion" element={<PasswordQuestionForm />} />
              <Route path="editPasswordQuestion/:PasswordQuestionId" element={<PasswordQuestionForm />} />

            </Route>

          </Route>

          {/* catch all for page not found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </NavigationProvider>
    </div>
  );
}

export default AppRoutes;
