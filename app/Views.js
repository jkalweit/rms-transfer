/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './InventoryViews'], function (require, exports, React, inventoryViews) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _super.apply(this, arguments);
        }
        MainView.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h1", null, "RMS"), React.createElement(inventoryViews.InventoryView, null)));
        };
        return MainView;
    })(React.Component);
    exports.MainView = MainView;
});
//# sourceMappingURL=Views.js.map