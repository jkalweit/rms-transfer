/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import moment = require('moment');
import models = require('Models');

import bv = require('./BaseViews');





export interface ReconciliationViewState {
  filteredTickets?: models.TicketModel[];
  selectedTicket?: models.TicketModel;
}
export class ReconciliationView extends React.Component<{}, ReconciliationViewState> {
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
        var filtered = this.tickets.filter((obj: models.TicketModel) => { return obj.name.toLowerCase().indexOf(normalized) >= 0 });
        return filtered;
    }
    handleFilterChanged(filter: string) {
        this.setState({
            filteredTickets: this.getFilteredTickets(filter)
        });
    }
    handleInsertTicket(name: string) {
        var ticket = new models.TicketModel();
        ticket._id = moment().toISOString();
        ticket.name = name;
        this.tickets.push(ticket);
        this.handleSelectTicket(ticket);
    }
    handleSelectTicket(ticket: models.TicketModel) {
      this.setState({ selectedTicket: ticket });
    }
    render() {
        return (
            <div className="reconciliation">
              <TicketsView tickets={this.state.filteredTickets}
              selectedTicket={this.state.selectedTicket}
              onFilterChanged={ this.handleFilterChanged.bind(this) }
              onInsertTicket={ this.handleInsertTicket.bind(this) }
              onSelectTicket={ this.handleSelectTicket.bind(this) }></TicketsView>
              { this.state.selectedTicket ? ( <TicketView ticket={this.state.selectedTicket}></TicketView> ) : null }
            </div>
        );
    }
}






export interface TicketViewProps {
    ticket: models.TicketModel;
}
export class TicketView extends React.Component<TicketViewProps, any> {
    nameInput: any;
    render() {
        return (
            <div className="ticket">
              <div className="header">
                <h3>{ this.props.ticket.name }</h3>
              </div>

            </div>);
    }
}



export interface TicketsViewProps {
    tickets: models.TicketModel[];
    selectedTicket: models.TicketModel;
    onFilterChanged: (filter: string) => void;
    onInsertTicket: (name: string) => void;
    onSelectTicket: (ticket: models.TicketModel) => void;
}
export class TicketsView extends React.Component<TicketsViewProps, any> {
    nameInput: any;
    handleFilterChanged(element, e) {
        if (e.keyCode === 13) {
            this.props.onInsertTicket(e.target.value);
            this.nameInput.value = '';
        }
        this.props.onFilterChanged(e.target.value);
    }
    render() {
        var nodes = this.props.tickets.map((ticket: models.TicketModel) => {
            var className = (this.props.selectedTicket && this.props.selectedTicket.name.toLowerCase() === ticket.name.toLowerCase()) ? 'active' : '';
            return (<li key={ticket._id} className={className} onClick={() => { this.props.onSelectTicket(ticket) }}>{ticket.name}</li>);
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
