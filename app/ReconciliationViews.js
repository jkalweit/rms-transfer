/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'freezer-js'], function (require, exports, React, Freezer) {
    var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
    var ReconciliationView = (function (_super) {
        __extends(ReconciliationView, _super);
        function ReconciliationView(props) {
            _super.call(this, props);
            this.mixins = [PureRenderMixin];
            this.state = {
                selectedTicket: null
            };
        }
        ReconciliationView.prototype.handleSelectTicket = function (ticket) {
            console.log('Select ticket: ' + JSON.stringify(ticket));
            this.setState({ selectedTicket: ticket });
        };
        ReconciliationView.prototype.render = function () {
            console.log('   Render: Reconciliation');
            return (React.createElement("div", {"className": "reconciliation"}, React.createElement(TicketsView, {"tickets": this.props.tickets, "onSelectTicket": this.handleSelectTicket.bind(this), "selectedTicket": this.state.selectedTicket})));
        };
        return ReconciliationView;
    })(React.Component);
    exports.ReconciliationView = ReconciliationView;
    var TicketsView = (function (_super) {
        __extends(TicketsView, _super);
        function TicketsView(props) {
            _super.call(this, props);
            this.stateStore = new Freezer({
                filteredTickets: this.getFilteredTickets('', props.tickets)
            });
            this.state = {
                store: this.stateStore.get()
            };
        }
        TicketsView.prototype.componentDidMount = function () {
            var _this = this;
            this.stateStore.on('update', function () {
                _this.setState({ store: _this.stateStore.get() });
            });
        };
        TicketsView.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var shouldUpdate = this.props.tickets !== nextProps.tickets
                || this.props.selectedTicket !== nextProps.selectedTicket
                || this.state.store !== nextState.store;
            return shouldUpdate;
        };
        TicketsView.prototype.handleFilterChanged = function (element, e) {
            var tickets = this.props.tickets;
            if (e.keyCode === 13) {
                var ticket = {
                    key: new Date().toISOString(),
                    name: e.target.value
                };
                e.target.value = '';
                tickets = this.props.tickets.set(ticket.key, ticket);
            }
            var filter = e.target.value;
            var filteredTickets = this.getFilteredTickets(filter, tickets);
            this.state.store.set('filteredTickets', filteredTickets);
        };
        TicketsView.prototype.getFilteredTickets = function (filter, tickets) {
            var normalized = filter.trim().toLowerCase();
            if (normalized.length === 0)
                return tickets;
            var filtered = {};
            Object.keys(tickets).forEach(function (key) {
                if (tickets[key].name.toLowerCase().indexOf(normalized) >= 0) {
                    filtered[key] = tickets[key];
                }
            });
            return filtered;
        };
        TicketsView.prototype.render = function () {
            var _this = this;
            console.log('     Render: Tickets List');
            var tickets = this.state.store.filteredTickets;
            var nodes = Object.keys(tickets).map(function (key) {
                var ticket = tickets[key];
                var isSelected = _this.props.selectedTicket === ticket;
                return (React.createElement(TicketView, {"key": key, "isSelected": isSelected, "ticket": ticket, "onSelect": function (ticket) { _this.props.onSelectTicket(ticket); }}));
            });
            return (React.createElement("div", {"className": "ticket-list"}, React.createElement("h3", null, "Tickets"), React.createElement("input", {"className": "name-filter", "ref": function (el) {
                var input = React.findDOMNode(el);
                if (input) {
                    input.focus();
                    input['onkeyup'] = function (e) {
                        _this.handleFilterChanged(input, e);
                    };
                }
            }}), React.createElement("ul", null, nodes)));
        };
        return TicketsView;
    })(React.Component);
    exports.TicketsView = TicketsView;
    var TicketView = (function (_super) {
        __extends(TicketView, _super);
        function TicketView() {
            _super.apply(this, arguments);
        }
        TicketView.prototype.shouldComponentUpdate = function (nextProps) {
            var shouldUpdate = this.props.ticket !== nextProps.ticket || this.props.isSelected !== nextProps.isSelected;
            return shouldUpdate;
        };
        TicketView.prototype.render = function () {
            var _this = this;
            var ticket = this.props.ticket;
            console.log('       Render: Ticket: ' + ticket.name);
            return (React.createElement("li", {"className": this.props.isSelected ? 'active' : '', "onClick": function () { _this.props.onSelect(ticket); }}, ticket.name));
        };
        return TicketView;
    })(React.Component);
    exports.TicketView = TicketView;
});
//# sourceMappingURL=ReconciliationViews.js.map