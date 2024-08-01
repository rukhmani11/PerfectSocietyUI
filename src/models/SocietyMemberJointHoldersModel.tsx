export interface SocietyMemberJointHoldersModel{
    SocietyMemberJointHolderId:string;
    SocietyMemberId:string;
    Name:string;
    MemberClassId:string;
    StartDate: Date;
    EndDate: Date;
    EnteranceFeePaidOn: Date;
    Address:string;
    City:string;
    Pin:number;
    StateId:string;
    CountryCode:string;
    PhoneNo:string;
    OfficePhoneNo:string;
    MobileNo:string;
    EmailId:string;
}