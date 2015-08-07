/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./freezer-js.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons'], function (require, exports, React) {
    var MenuView = (function (_super) {
        __extends(MenuView, _super);
        function MenuView() {
            _super.apply(this, arguments);
        }
        MenuView.prototype.shouldComponentUpdate = function (nextProps) {
            return this.props.menu !== nextProps.menu;
        };
        MenuView.prototype.render = function () {
            console.log('   Render: MenuView');
            return (React.createElement("div", {"className": "menu"}, React.createElement(MenuCategoriesView, {"categories": this.props.menu.categories})));
        };
        return MenuView;
    })(React.Component);
    exports.MenuView = MenuView;
    var MenuCategoriesViewProps = (function () {
        function MenuCategoriesViewProps() {
        }
        return MenuCategoriesViewProps;
    })();
    exports.MenuCategoriesViewProps = MenuCategoriesViewProps;
    var MenuCategoriesView = (function (_super) {
        __extends(MenuCategoriesView, _super);
        function MenuCategoriesView() {
            _super.apply(this, arguments);
        }
        MenuCategoriesView.prototype.shouldComponentUpdate = function (nextProps) {
            var shouldUpdate = this.props.categories != nextProps.categories;
            if (shouldUpdate)
                console.log('MenuCategoriesView: update');
            else
                console.log('MenuCategoriesView: NO UPDATE!');
            return shouldUpdate;
        };
        MenuCategoriesView.prototype.doTest = function () {
            /*console.log('Before: ' + JSON.stringify(this.props.categories));
            this.props.categories['0'].name = 'IT CHANGED!';
            console.log('After: ' + JSON.stringify(this.props.categories));
            this.props.categories['0'].set('name', 'IT REALLY CHANGED!');
            console.log('After again: ' + JSON.stringify(this.props.categories));*/
            var category = {
                key: new Date().toISOString(),
                name: 'Dinner Entrees',
                items: {}
            };
            this.props.categories.set(category.key, category);
        };
        MenuCategoriesView.prototype.render = function () {
            var _this = this;
            var nodes = Object.keys(this.props.categories).map(function (key) {
                return (React.createElement(MenuCategoryView, {"key": key, "category": _this.props.categories[key]}));
            });
            return (React.createElement("div", {"className": "menu-categories"}, React.createElement("h3", null, "Menu Categories"), React.createElement("button", {"onClick": this.doTest.bind(this)}, "Do Test"), React.createElement("ul", null, nodes)));
        };
        return MenuCategoriesView;
    })(React.Component);
    exports.MenuCategoriesView = MenuCategoriesView;
    var MenuCategoryViewProps = (function () {
        function MenuCategoryViewProps() {
        }
        return MenuCategoryViewProps;
    })();
    exports.MenuCategoryViewProps = MenuCategoryViewProps;
    var MenuCategoryView = (function (_super) {
        __extends(MenuCategoryView, _super);
        function MenuCategoryView() {
            _super.apply(this, arguments);
        }
        MenuCategoryView.prototype.shouldComponentUpdate = function (nextProps) {
            var shouldUpdate = this.props.category != nextProps.category;
            if (shouldUpdate)
                console.log('MenuCategoryView: update: ' + this.props.category.name + ': ' + nextProps.category.name);
            else
                console.log('MenuCategoryView: NO UPDATE: ' + this.props.category.name);
            return shouldUpdate;
        };
        MenuCategoryView.prototype.doTest = function () {
            this.props.category.set('name', 'I CHANGED IT!');
        };
        MenuCategoryView.prototype.render = function () {
            return (React.createElement("li", {"onClick": this.doTest.bind(this)}, this.props.category.name));
        };
        return MenuCategoryView;
    })(React.Component);
    exports.MenuCategoryView = MenuCategoryView;
});
//# sourceMappingURL=MenuViews.js.map