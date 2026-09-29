export interface SonItem {
    barcode: string;
    itemCode: string;
    itemName: string;
    unit: string;
    category?: string;
    systemStock: number;
    physicalStock: number;
}

export interface SonPayload {
    date?: string;
    createdBy?: string;
    items: {
        barcode?: string;
        itemCode: string;
        itemName: string;
        unit?: string;
        category?: string;
        systemStock: number;
        physicalStock: number;
    }[];
}

export interface SonListItem {
    id: string;
    sonNumber: string;
    date: string;
    totalItems: number;
    createdBy?: string;
}

export interface SonDetailItem {
    sonNumber: string;
    itemCode: string;
    itemName: string;
    systemStock: number;
    physicalStock: number;
    difference: number;
}

export interface DeleteSon {
    message: string;
}