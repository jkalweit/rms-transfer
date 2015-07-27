define(["require", "exports"], function (require, exports) {
    var DbObjectModel = (function () {
        function DbObjectModel() {
        }
        return DbObjectModel;
    })();
    exports.DbObjectModel = DbObjectModel;
    var InventoryItemModel = (function () {
        function InventoryItemModel() {
        }
        InventoryItemModel.collectionName = 'inventory_items';
        InventoryItemModel.apiPath = '/api/items/';
        return InventoryItemModel;
    })();
    exports.InventoryItemModel = InventoryItemModel;
});
//# sourceMappingURL=Models.js.map