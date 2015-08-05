/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react/addons', 'moment', 'Models'], function (require, exports, React, moment, models) {
    var TicketsView = (function (_super) {
        __extends(TicketsView, _super);
        function TicketsView() {
            _super.apply(this, arguments);
        }
        TicketsView.prototype.handleFilterChanged = function (element, e) {
            if (e.keyCode === 13) {
                this.props.onInsertCustomer(e.target.value);
                this.nameInput.value = '';
            }
            this.props.onFilterChanged(e.target.value);
        };
        TicketsView.prototype.render = function () {
            var _this = this;
            var nodes = this.props.tickets.map(function (ticket) {
                return (React.createElement("li", {"key": ticket._id}, ticket.name));
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
            console.log('Tickets: ' + JSON.stringify(this.tickets));
            var filtered = this.tickets.filter(function (obj) { return obj.name.toLowerCase().indexOf(normalized) >= 0; });
            console.log('Filtered: ' + JSON.stringify(filtered));
            return filtered;
        };
        ReconciliationView.prototype.handleFilterChanged = function (filter) {
            this.setState({
                filteredTickets: this.getFilteredTickets(filter)
            });
        };
        ReconciliationView.prototype.handleInsertCustomer = function (name) {
            var ticket = new models.TicketModel();
            ticket._id = moment().toISOString();
            ticket.name = name;
            this.tickets.push(ticket);
        };
        ReconciliationView.prototype.render = function () {
            return (React.createElement("div", {"className": "reconciliation"}, React.createElement(TicketsView, {"tickets": this.state.filteredTickets, "onFilterChanged": this.handleFilterChanged.bind(this), "onInsertCustomer": this.handleInsertCustomer.bind(this)})));
        };
        return ReconciliationView;
    })(React.Component);
    exports.ReconciliationView = ReconciliationView;
});
//# sourceMappingURL=ReconciliationViews.js.map