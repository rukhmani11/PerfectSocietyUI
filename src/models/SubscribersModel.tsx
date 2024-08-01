
import { SelectListModel } from "./ApiResponse";

export interface SubscribersModel {
  SubscriberId: string;
  Subscriber: string;
  Abbreviation: string;
  Address: string;
  City: string;
  Pin: number;
  StateId: string;
  //States: Option[];
  CountryCode: string;
  ContactPerson: string;
  Phone: string;
  Mobile: string;
  Active: boolean;
  Email: string;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
} 