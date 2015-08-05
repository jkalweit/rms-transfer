/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import moment = require('moment');
import models = require('Models');

import bv = require('./BaseViews');

export interface TicketsViewProps {
    tickets: models.TicketModel[];
    onFilterChanged: (filter: string) => void;
    onInsertCustomer: (name: string) => void;
}
export class TicketsView extends React.Component<TicketsViewProps, any> {
    nameInput: any;
    handleFilterChanged(element, e) {
        if (e.keyCode === 13) {
            this.props.onInsertCustomer(e.target.value);
            this.nameInput.value = '';
        }
        this.props.onFilterChanged(e.target.value);
    }
    render() {
        var nodes = this.props.tickets.map((ticket) => {
            return (<li key={ticket._id}>{ticket.name}</li>);
        });
        return (
            <div className="ticket-list">
              <h3>Tickets</h3>
              <input className="name-filter" ref={(el) => {
                  var input = (React.findDOMNode(el) as any);
                  if (input) {
                      this.nameInput = input;
                      input.focus();
                      input['onkeyup'] = (e) => {
                          this.handleFilterChanged(input, e);
                      }
                  }
              } } />
              <ul>
              { nodes }
              </ul>
            </div>);
    }
}

export class ReconciliationView extends React.Component<{}, any> {
    tickets: models.TicketModel[];

    constructor(props) {
        super(props);
        this.tickets = [];

        this.state = {
            filteredTickets: this.getFilteredTickets('')
        };
    }
    getFilteredTickets(filter: string): models.TicketModel[] {
        var normalized = filter.trim().toLowerCase();
        if(normalized.length === 0) return this.tickets.concat([]); // concat makes a copy (to maintain immutableness)
        console.log('Tickets: ' + JSON.stringify(this.tickets));
        var filtered = this.tickets.filter((obj: models.TicketModel) => { return obj.name.toLowerCase().indexOf(normalized) >= 0 });
        console.log('Filtered: ' + JSON.stringify(filtered));
        return filtered;
    }
    handleFilterChanged(filter: string) {
        this.setState({
            filteredTickets: this.getFilteredTickets(filter)
        });
    }
    handleInsertCustomer(name: string) {
        var ticket = new models.TicketModel();
        ticket._id = moment().toISOString();
        ticket.name = name;
        this.tickets.push(ticket);
    }
    render() {
        return (
            <div className="reconciliation">
              <TicketsView tickets={this.state.filteredTickets} onFilterChanged={ this.handleFilterChanged.bind(this) } onInsertCustomer={ this.handleInsertCustomer.bind(this) }></TicketsView>
            </div>
        );
    }
}
