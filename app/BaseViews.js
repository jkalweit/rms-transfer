/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'jquery', 'socket.io'], function (require, exports, React, $, io) {
    var socket = io();
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
            this.socketSubscriptions = {};
            socket.on('updated:' + this.collectionName, function (data) {
                this.refresh();
                var subscribers = this.socketSubscriptions[data.action] || [];
                subscribers.forEach(function (callback) {
                    callback(data);
                });
            }.bind(this));
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
            var me = this;
            $.getJSON('/api/' + this.collectionName, function (result) {
                me.setState({ data: result });
            });
        };
        BaseView.prototype.insertBase = function (item) {
            var me = this;
            $.post('/api/' + this.collectionName, item, function (result) {
                me.refresh();
            });
        };
        BaseView.prototype.update = function (data) {
            var me = this;
            $.ajax({
                url: '/api/' + this.collectionName + '/' + data._id,
                type: 'PATCH',
                data: data,
                success: function (result) {
                    me.refresh();
                }
            });
        };
        BaseView.prototype.remove = function (id) {
            var me = this;
            $.ajax({
                url: '/api/' + this.collectionName + '/' + id,
                type: 'DELETE',
                success: function (result) {
                    me.refresh();
                }
            });
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