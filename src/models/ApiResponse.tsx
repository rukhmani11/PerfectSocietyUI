export interface ApiResponse {
    isSuccess: boolean;
    data: any;
    list: any[];
}

export interface SelectListModel {
    Value: string;
    Text: string;
}

export interface MultiSelectListModel {
    value: string;
    label: string;
}

export interface TabModel {
    Text: string;
    Content: any;
}