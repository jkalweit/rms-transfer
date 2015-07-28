export class DbObjectModel {
    _id: string;
    static collectionName: string;
}


export class InventoryItemModel implements DbObjectModel {
    _id: string
    name: string;
    note: string;
    count: number;
    static collectionName: string = 'inventory_items';
}

export class VendorModel implements DbObjectModel {
    _id: string
    name: string;
    note: string;
    static collectionName: string = 'vendors';
}
