export interface SocietyMembersModel {
  SocietyMemberId: string;
  SocietyId: string;
  FolioNo: number;
  Member: string;
  MemberClassId: string;
  ContactPerson: string;
  Address: string;
  City: string;
  Pin: number;
  StateId: string;
  CountryCode: string;
  PhoneNo: string;
  HomePhoneNo: string;
  OfficePhoneNo: string;
  MobileNo: string;
  OccupationId: string;
  Occupation: string;
  LoanFrom: string;
  LoanClearedOn: Date;
  FourWheelers: number;
  TwoWheelers: number;
  EmailId: string;
  GstNo: string;
  IsCommitteeMember: boolean;
}
export interface SocietyMemberTitleModel {
  SocietyMemberId: string;
  Member: string;
}
