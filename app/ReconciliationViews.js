/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'moment', 'Models'], function (require, exports, React, moment, models) {
    var ReconciliationView = (function (_super) {
        __extends(ReconciliationView, _super);
        function ReconciliationView(props) {
            _super.call(this, props);
            this.tickets = [];
            this.state = {
                filteredTickets: this.getFilteredTickets('')
            };
        }
        ReconciliationView.prototype.getFilteredTickets = function (filter) {
            var normalized = filter.trim().toLowerCase();
            if (normalized.length === 0)
                return this.tickets.concat([]);
            var filtered = this.tickets.filter(function (obj) { return obj.name.toLowerCase().indexOf(normalized) >= 0; });
            return filtered;
        };
        ReconciliationView.prototype.handleFilterChanged = function (filter) {
            this.setState({
                filteredTickets: this.getFilteredTickets(filter)
            });
        };
        ReconciliationView.prototype.handleInsertTicket = function (name) {
            var ticket = new models.TicketModel();
            ticket._id = moment().toISOString();
            ticket.name = name;
            this.tickets.push(ticket);
            this.handleSelectTicket(ticket);
        };
        ReconciliationView.prototype.handleSelectTicket = function (ticket) {
            this.setState({ selectedTicket: ticket });
        };
        ReconciliationView.prototype.render = function () {
            return (React.createElement("div", {"className": "reconciliation"}, React.createElement(TicketsView, {"tickets": this.state.filteredTickets, "selectedTicket": this.state.selectedTicket, "onFilterChanged": this.handleFilterChanged.bind(this), "onInsertTicket": this.handleInsertTicket.bind(this), "onSelectTicket": this.handleSelectTicket.bind(this)}), this.state.selectedTicket ? (React.createElement(TicketView, {"ticket": this.state.selectedTicket})) : null));
        };
        return ReconciliationView;
    })(React.Component);
    exports.ReconciliationView = ReconciliationView;
    var TicketView = (function (_super) {
        __extends(TicketView, _super);
        function TicketView() {
            _super.apply(this, arguments);
        }
        TicketView.prototype.render = function () {
            return (React.createElement("div", {"className": "ticket"}, React.createElement("div", {"className": "header"}, React.createElement("h3", null, this.props.ticket.name))));
        };
        return TicketView;
    })(React.Component);
    exports.TicketView = TicketView;
    var TicketsView = (function (_super) {
        __extends(TicketsView, _super);
        function TicketsView() {
            _super.apply(this, arguments);
        }
        TicketsView.prototype.handleFilterChanged = function (element, e) {
            if (e.keyCode === 13) {
                this.props.onInsertTicket(e.target.value);
                this.nameInput.value = '';
            }
            this.props.onFilterChanged(e.target.value);
        };
        TicketsView.prototype.render = function () {
            var _this = this;
            var nodes = this.props.tickets.map(function (ticket) {
                var className = (_this.props.selectedTicket && _this.props.selectedTicket.name.toLowerCase() === ticket.name.toLowerCase()) ? 'active' : '';
                return (React.createElement("li", {"key": ticket._id, "className": className, "onClick": function () { _this.props.onSelectTicket(ticket); }}, ticket.name));
            });
            return (React.createElement("div", {"className": "ticket-list"}, React.createElement("h3", null, "Tickets"), React.createElement("input", {"className": "name-filter", "ref": function (el) {
                var input = React.findDOMNode(el);
                if (input) {
                    _this.nameInput = input;
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
});
//# sourceMappingURL=ReconciliationViews.js.map