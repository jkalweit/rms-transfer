/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'freezer-js', './MenuViews', './ReconciliationViews'], function (require, exports, React, Freezer, menuViews, recViews) {
    var NavigationBase = (function (_super) {
        __extends(NavigationBase, _super);
        function NavigationBase(props) {
            var _this = this;
            _super.call(this, props);
            this.state = { isSelected: this.compareHash() };
            window.addEventListener('hashchange', function () {
                _this.setState({ isSelected: _this.compareHash() });
            });
        }
        NavigationBase.prototype.compareHash = function () {
            var normalizedHash = (location.hash || '').toLowerCase();
            if (normalizedHash == '')
                normalizedHash = '#';
            return normalizedHash == this.props.hash;
        };
        NavigationBase.prototype.render = function () {
            return (React.createElement("div", null, "Navigator Base is an abstract class.You must implement your own render()."));
        };
        return NavigationBase;
    })(React.Component);
    exports.NavigationBase = NavigationBase;
    var NavigationView = (function (_super) {
        __extends(NavigationView, _super);
        function NavigationView() {
            _super.apply(this, arguments);
        }
        NavigationView.prototype.render = function () {
            var style = {
                zIndex: this.state.isSelected ? 1 : 0,
                opacity: this.state.isSelected ? 1 : 0
            };
            return (React.createElement("div", {"className": "navigation-view", "style": style}, this.props.children));
        };
        return NavigationView;
    })(NavigationBase);
    exports.NavigationView = NavigationView;
    var NavigationItem = (function (_super) {
        __extends(NavigationItem, _super);
        function NavigationItem() {
            _super.apply(this, arguments);
        }
        NavigationItem.prototype.render = function () {
            var className = this.state.isSelected ? 'active' : '';
            return (React.createElement("a", {"className": className, "href": this.props.hash}, this.props.children));
        };
        return NavigationItem;
    })(NavigationView);
    exports.NavigationItem = NavigationItem;
    var reconciliationStore = new Freezer({
        menu: {
            categories: {
                '0': {
                    key: '0',
                    name: 'Dinner Entrees',
                    items: {
                        '0': {
                            key: '0',
                            name: '14oz Ribeye',
                            price: 20
                        }
                    }
                }
            }
        },
        tickets: {
            '0': { key: '0', name: 'Justin' }
        }
    }, { live: false });
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView(props) {
            _super.call(this, props);
            this.state = {
                reconciliation: reconciliationStore.get()
            };
        }
        MainView.prototype.componentDidMount = function () {
            var _this = this;
            reconciliationStore.on('update', function () {
                var reconciliation = reconciliationStore.get();
                console.log('MainView Store: ' + JSON.stringify(reconciliation));
                _this.setState({
                    reconciliation: reconciliation
                });
            });
        };
        MainView.prototype.render = function () {
            var rec = this.state.reconciliation;
            return (React.createElement("div", null, React.createElement("div", {"className": "sticky-header"}, React.createElement("ul", null, React.createElement("li", null, React.createElement(NavigationItem, {"hash": "#"}, React.createElement("span", {"className": "col-2"}, "RMS"))), React.createElement("li", null, React.createElement(NavigationItem, {"hash": "#reconciliation"}, React.createElement("span", {"className": "col-6"}, "Reconciliation"))), React.createElement("li", null, React.createElement(NavigationItem, {"hash": "#menu"}, React.createElement("span", {"className": "col-5"}, "Menu"))), React.createElement("li", null, React.createElement(NavigationItem, {"hash": "#kitchen"}, React.createElement("span", {"className": "col-5"}, "Kitchen"))))), React.createElement(NavigationView, {"hash": "#"}, React.createElement("h1", null, "Welcome to RMS"), React.createElement("p", null, "There will be a dashboard here later."), React.createElement("p", null, "Use the navigation above to select a location.")), React.createElement(NavigationView, {"hash": "#reconciliation"}, React.createElement(recViews.ReconciliationView, {"tickets": rec.tickets})), React.createElement(NavigationView, {"hash": "#menu"}, React.createElement(menuViews.MenuView, {"menu": rec.menu})), React.createElement(NavigationView, {"hash": "#kitchen"}, React.createElement("h1", null, "The kitchen!"))));
        };
        return MainView;
    })(React.Component);
    exports.MainView = MainView;
});
//# sourceMappingURL=Views.js.map