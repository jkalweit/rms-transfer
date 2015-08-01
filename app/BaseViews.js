/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './DataStores'], function (require, exports, React, dataStores) {
    var BaseViewProps = (function () {
        function BaseViewProps() {
        }
        return BaseViewProps;
    })();
    exports.BaseViewProps = BaseViewProps;
    var BaseItemViewProps = (function (_super) {
        __extends(BaseItemViewProps, _super);
        function BaseItemViewProps() {
            _super.apply(this, arguments);
        }
        return BaseItemViewProps;
    })(BaseViewProps);
    exports.BaseItemViewProps = BaseItemViewProps;
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView(props, collectionName) {
            _super.call(this, props);
            this.collectionName = collectionName;
            this.state = {
                data: [],
                isDisabled: false
            };
            var doRefresh = this.refresh.bind(this);
            this.dataStore = new dataStores.SocketIODataStore(collectionName, this.handleRefresh.bind(this), doRefresh, doRefresh, doRefresh);
            this.socketSubscriptions = {};
        }
        BaseView.prototype.subscribe = function (action, callback) {
            this.socketSubscriptions[action] = this.socketSubscriptions[action] || [];
            this.socketSubscriptions[action].push(callback);
        };
        BaseView.prototype.toggleIsDisabled = function () {
            this.setState({ isDisabled: !this.state.isDisabled });
        };
        BaseView.prototype.componentDidMount = function () {
            this.refresh();
        };
        BaseView.prototype.refresh = function () {
            console.log('doing requery: ' + this.dataStore.path);
            this.dataStore.query({});
        };
        BaseView.prototype.handleRefresh = function (data) {
            console.log('handlingRefresh: ' + this.dataStore.path + ': ' + JSON.stringify(data));
            this.setState({ data: data.data });
        };
        BaseView.prototype.insertBase = function (item) {
            this.dataStore.insert(item);
        };
        BaseView.prototype.update = function (data) {
            var me = this;
            this.dataStore.update(data);
        };
        BaseView.prototype.remove = function (id) {
            var me = this;
            this.dataStore.remove(id);
        };
        return BaseView;
    })(React.Component);
    exports.BaseView = BaseView;
    var BaseItemView = (function (_super) {
        __extends(BaseItemView, _super);
        function BaseItemView(props) {
            _super.call(this, props);
            this.state = {
                entity: props.entity,
                isDirty: false,
                isDisabled: false
            };
        }
        BaseItemView.prototype.toggleIsDisabled = function () {
            this.setState({ isDisabled: !this.state.isDisabled });
        };
        BaseItemView.prototype.componentWillReceiveProps = function (nextProps) {
            this.setState({
                entity: nextProps.entity,
                isDirty: false
            });
        };
        BaseItemView.prototype.update = function () {
            var me = this;
            this.props.onUpdate(this.state.entity);
        };
        BaseItemView.prototype.remove = function () {
            if (confirm('Delete?')) {
                this.props.onRemove(this.props.entity._id);
            }
        };
        BaseItemView.prototype.handleChange = function (fieldName, event) {
            var newEntity = this.state.entity;
            if (newEntity[fieldName] !== event.target.value) {
                newEntity[fieldName] = event.target.value;
                this.setState({
                    entity: newEntity,
                    isDirty: true
                });
            }
        };
        return BaseItemView;
    })(React.Component);
    exports.BaseItemView = BaseItemView;
});
//# sourceMappingURL=BaseViews.js.map