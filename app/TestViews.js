/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons'], function (require, exports, React) {
    var TestView = (function (_super) {
        __extends(TestView, _super);
        function TestView() {
            _super.apply(this, arguments);
        }
        TestView.prototype.render = function () {
            return (React.createElement("div", null, "Hello from Test View6!"));
        };
        return TestView;
    })(React.Component);
    exports.TestView = TestView;
});
//# sourceMappingURL=TestViews.js.map