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
        return InventoryItemModel;
    })();
    exports.InventoryItemModel = InventoryItemModel;
    var VendorModel = (function () {
        function VendorModel() {
        }
        VendorModel.collectionName = 'vendors';
        return VendorModel;
    })();
    exports.VendorModel = VendorModel;
});
//# sourceMappingURL=Models.js.map