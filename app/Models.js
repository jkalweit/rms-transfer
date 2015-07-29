/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'moment'], function (require, exports, moment) {
    var DbObjectModel = (function () {
        function DbObjectModel() {
        }
        return DbObjectModel;
    })();
    exports.DbObjectModel = DbObjectModel;
    var InventoryItemModel = (function (_super) {
        __extends(InventoryItemModel, _super);
        function InventoryItemModel() {
            _super.apply(this, arguments);
        }
        InventoryItemModel.collectionName = 'inventory_items';
        return InventoryItemModel;
    })(DbObjectModel);
    exports.InventoryItemModel = InventoryItemModel;
    var VendorModel = (function (_super) {
        __extends(VendorModel, _super);
        function VendorModel() {
            _super.apply(this, arguments);
        }
        VendorModel.collectionName = 'vendors';
        return VendorModel;
    })(DbObjectModel);
    exports.VendorModel = VendorModel;
    var ShiftModel = (function (_super) {
        __extends(ShiftModel, _super);
        function ShiftModel() {
            _super.apply(this, arguments);
        }
        ShiftModel.shiftLength = function (shift) {
            var start = moment(shift.date);
            var end = moment(shift.date);
            if (shift.start && shift.end) {
                var startSplit = shift.start.split(':');
                var endSplit = shift.end.split(':');
                start.hour(startSplit[0]);
                start.minute(startSplit[1]);
                end.hour(endSplit[0]);
                end.minute(endSplit[1]);
                if (end.diff(start) < 0) {
                    end.add(1, 'days');
                }
                ;
            }
            var diff = moment.duration(end.diff(start));
            return diff.hours() + ":" + ('0' + diff.minutes()).slice(-2);
        };
        ShiftModel.collectionName = 'shifts';
        return ShiftModel;
    })(DbObjectModel);
    exports.ShiftModel = ShiftModel;
    var ShiftPositionModel = (function () {
        function ShiftPositionModel() {
        }
        ShiftPositionModel.collectionName = 'shifts.position';
        return ShiftPositionModel;
    })();
    exports.ShiftPositionModel = ShiftPositionModel;
    var KitchenOrderModel = (function (_super) {
        __extends(KitchenOrderModel, _super);
        function KitchenOrderModel() {
            _super.apply(this, arguments);
        }
        KitchenOrderModel.collectionName = 'kitchen_orders';
        return KitchenOrderModel;
    })(DbObjectModel);
    exports.KitchenOrderModel = KitchenOrderModel;
});
//# sourceMappingURL=Models.js.map