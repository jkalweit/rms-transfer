export class DbObjectModel {
    _id: string;
}


export class InventoryItemModel implements DbObjectModel {
    _id: string
    name: string;
    note: string;
    count: number;
    static collectionName: string = 'inventory_items';
    static apiPath: string = '/api/items/';
}
