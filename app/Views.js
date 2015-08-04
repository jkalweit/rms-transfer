/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './MenuViews'], function (require, exports, React, menuViews) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _super.apply(this, arguments);
        }
        MainView.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("div", {"className": "sticky-header"}, React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {"href": "#"}, "RMS")), React.createElement("li", null, React.createElement("a", {"href": "#menu"}, "Menu")))), React.createElement(menuViews.MenuCategoriesView, null)));
        };
        return MainView;
    })(React.Component);
    exports.MainView = MainView;
});
//# sourceMappingURL=Views.js.map