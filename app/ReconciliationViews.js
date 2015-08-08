/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', './Store'], function (require, exports, React, Store) {
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
            this.setState({ selectedTicket: ticket });
        };
        ReconciliationView.prototype.render = function () {
            console.log('   Render: Reconciliation');
            return (React.createElement("div", {"className": "reconciliation"}, "Testing...", React.createElement(TicketsView, {"tickets": this.props.tickets, "onSelectTicket": this.handleSelectTicket.bind(this), "selectedTicket": this.state.selectedTicket})));
        };
        return ReconciliationView;
    })(React.Component);
    exports.ReconciliationView = ReconciliationView;
    var TicketsView = (function (_super) {
        __extends(TicketsView, _super);
        function TicketsView(props) {
            _super.call(this, props);
            var tickets = this.props.tickets;
            var filteredTickets = tickets;
            this.state = {
                filteredTickets: filteredTickets
            };
        }
        TicketsView.prototype.shallowCompare = function (curr, next) {
            var equal = true;
            Object.keys(next).forEach(function (key) {
                if ((next[key] !== curr[key])) {
                    console.log(key + ': ' + next[key] + ' ===? ' + (next[key] === curr[key]));
                    equal = false;
                }
            });
            return equal;
        };
        TicketsView.prototype.willReceiveProps = function (nextProps) {
            this.setState(this.getFilteredState('', nextProps.tickets));
        };
        TicketsView.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var propsEqual = this.shallowCompare(this.props, nextProps);
            var stateEqual = this.shallowCompare(this.state, nextState);
            return !propsEqual || !stateEqual;
        };
        TicketsView.prototype.getFilteredState = function (filter, tickets) {
            return { filteredTickets: this.getFilteredTickets(filter, tickets) };
        };
        TicketsView.prototype.handleFilterChanged = function (element, e) {
            var tickets = this.props.tickets;
            var name = e.target.value.trim();
            if (e.keyCode === 13 && name !== '') {
                var ticket = {
                    key: new Date().toISOString(),
                    name: name
                };
                e.target.value = name = '';
                Store.insertTicket(ticket);
            }
            var filteredTickets = this.getFilteredTickets(name, this.props.tickets);
            this.setState({ filteredTickets: filteredTickets });
        };
        TicketsView.prototype.getFilteredTickets = function (filter, tickets) {
            var normalized = filter.trim().toLowerCase();
            if (normalized.length === 0)
                return tickets;
            var filtered = tickets.filter(function (ticket) {
                return ticket.get('name').toLowerCase().indexOf(normalized) >= 0;
            });
            return filtered;
        };
        TicketsView.prototype.render = function () {
            var _this = this;
            console.log('     Render: Tickets List');
            var tickets = this.state.filteredTickets;
            var nodes = tickets.map(function (ticket) {
                return (React.createElement(TicketView, {"key": ticket.get('key'), "selectedTicket": _this.props.selectedTicket, "ticket": ticket, "onSelect": function (ticket) { _this.props.onSelectTicket(ticket); }}));
            }).toArray();
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
            var update = !this.shallowCompare(this.props, nextProps);
            return update;
        };
        TicketView.prototype.shallowCompare = function (curr, next) {
            var equal = true;
            Object.keys(next).forEach(function (key) {
                if ((next[key] !== curr[key])) {
                    console.log(key + ': ' + next[key] + ' ===? NOT EQUAL');
                    equal = false;
                }
            });
            return equal;
        };
        TicketView.prototype.render = function () {
            var _this = this;
            var ticket = this.props.ticket;
            var isSelected = this.props.selectedTicket === ticket;
            console.log('       Render: Ticket: ' + ticket.get('name'));
            return (React.createElement("li", {"className": isSelected ? 'active' : '', "onClick": function () { _this.props.onSelect(ticket); }}, ticket.get('name')));
        };
        return TicketView;
    })(React.Component);
    exports.TicketView = TicketView;
});
//# sourceMappingURL=ReconciliationViews.js.map