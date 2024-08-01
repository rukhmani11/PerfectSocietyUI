export interface CommunicationsModel {
    CommunicationId: string;
    SocietyId: string;
    FromSocietyMemberId: string;
    CommunicationTypeId: string;
    Subject: string;
    Details: string;
    Published: boolean;
    LastUpdate: Date;
    Replies: number;
    Closed: boolean;
    TicketNumber: number;
    ClosedOn: Date;
    ClosedBySocietyMemberId: string;
    ApprovedBySocietyMemberId: string;
    ApprovedOn: Date;
    FromSocietyMemberTenantId: string;
    FromSocietyUserId: string;
}