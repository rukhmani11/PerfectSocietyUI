export interface CouponsModel{
    CouponNo:string;
    Ipin:string;
    DiscountPerc:number;
    DiscountAmount:number;
    ValidityStart:Date | null;
    ValidityEnd:Date | null;
    MinAmount:number;
    MaxAmount:number;
    SubscriberId:string;
    SocietyId:string;
}