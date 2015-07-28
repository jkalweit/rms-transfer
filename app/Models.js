/// <reference path="../typings/tsd.d.ts" />
define(["require", "exports", 'moment'], function (require, exports, moment) {
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
    var ShiftModel = (function () {
        function ShiftModel() {
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
    })();
    exports.ShiftModel = ShiftModel;
    var ShiftPositionModel = (function () {
        function ShiftPositionModel() {
        }
        ShiftPositionModel.collectionName = 'shifts.position';
        return ShiftPositionModel;
    })();
    exports.ShiftPositionModel = ShiftPositionModel;
});
//# sourceMappingURL=Models.js.map