/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
//import Freezer = require('freezer-js');
import Immutable = require('immutable');
import moment = require('moment');

import models = require('./Models');
import Store = require('./Store');



var PureRenderMixin = require('react/addons').addons.PureRenderMixin;


export interface ReconciliationViewProps {
    tickets: Immutable.Map<string, models.TicketModel>;
}
export interface ReconciliationViewState {
    selectedTicket: models.TicketModel;
}
export class ReconciliationView extends React.Component<ReconciliationViewProps, ReconciliationViewState> {
    mixins = [PureRenderMixin];
    constructor(props) {
        super(props);
        this.state = {
            selectedTicket: null
        };
    }
    handleSelectTicket(ticket: models.TicketModel) {
        this.setState({ selectedTicket: ticket });
    }
    render() {
        console.log('   Render: Reconciliation');
        return (
            <div className="reconciliation">
              Testing...
            {
            <TicketsView tickets={this.props.tickets}
            onSelectTicket={ this.handleSelectTicket.bind(this) }
            selectedTicket={ this.state.selectedTicket }></TicketsView>
/*
              <TicketsView tickets={this.state.filteredTickets}
              selectedTicket={this.state.selectedTicket}
              onFilterChanged={ this.handleFilterChanged.bind(this) }
              onInsertTicket={ this.handleInsertTicket.bind(this) }
              onSelectTicket={ this.handleSelectTicket.bind(this) }></TicketsView>
              this.state.selectedTicket ? ( <TicketView ticket={this.state.selectedTicket}></TicketView> ) : null */ }
            </div>
        );
    }
}





/*
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
}*/


export interface TicketsViewProps {
    tickets: Immutable.Map<string, models.TicketModel>;
    selectedTicket: models.TicketModel;
    onSelectTicket: (ticket: models.TicketModel) => void;
}
export interface TicketsViewState {
    filteredTickets?: Immutable.Map<string, models.TicketModel>;
}
export class TicketsView extends React.Component<TicketsViewProps, TicketsViewState> {
    //mixins = [PureRenderMixin];
    constructor(props: TicketsViewProps) {
        super(props);
      var tickets = this.props.tickets;
      var filteredTickets = tickets;
        this.state = {
            filteredTickets: filteredTickets
        };
    }
    shallowCompare(curr: any, next: any): boolean {
      var equal = true;
      Object.keys(next).forEach((key) => {
        if((next[key] !== curr[key])) {
          console.log(key + ': ' + next[key] + ' ===? ' + (next[key] === curr[key]));
          equal = false;
        }
        //console.log(key + ': ' + next[key] + ' ===? ' + (next[key] === curr[key]));
        });
        return equal;
    }
    willReceiveProps(nextProps) {
      this.setState(this.getFilteredState('', nextProps.tickets));
    }
    shouldComponentUpdate(nextProps: TicketsViewProps, nextState: TicketsViewState) {
      var propsEqual = this.shallowCompare(this.props, nextProps);
      var stateEqual = this.shallowCompare(this.state, nextState);
      return !propsEqual || !stateEqual;
    }
    getFilteredState(filter: string, tickets: Immutable.Map<string, models.TicketModel>): any {
      return { filteredTickets: this.getFilteredTickets(filter, tickets) };
    }
    handleFilterChanged(element, e) {
        var tickets = this.props.tickets;
        var name = e.target.value.trim();
        if (e.keyCode === 13 && name !== '') {
            var ticket: models.TicketModel = {
                key: new Date().toISOString(),
                name: name
            };
            e.target.value = name = '';
            Store.insertTicket(ticket);
        }
        var filteredTickets = this.getFilteredTickets(name, this.props.tickets);
        this.setState( {filteredTickets: filteredTickets});
    }
    getFilteredTickets(filter: string, tickets: Immutable.Map<string, models.TicketModel>): Immutable.Map<string, models.TicketModel> {
        var normalized = filter.trim().toLowerCase();
        if (normalized.length === 0) return tickets;

        var filtered = tickets.filter((ticket: models.TicketModel): boolean => {
          return ticket.get('name').toLowerCase().indexOf(normalized) >= 0;
        });

        return filtered as Immutable.Map<string, models.TicketModel>;
    }
    render() {
        console.log('     Render: Tickets List');
        var tickets = this.state.filteredTickets;
        var nodes = tickets.map((ticket) => {
            return (<TicketView key={ticket.get('key')} selectedTicket={this.props.selectedTicket} ticket={ticket} onSelect={(ticket) => { this.props.onSelectTicket(ticket) } }></TicketView>);
        }).toArray();
        return (
            <div className="ticket-list">
              <h3>Tickets</h3>
              <input className="name-filter" ref={(el) => {
                  var input = (React.findDOMNode(el) as any);
                  if (input) {
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





export interface TicketViewProps {
    key: string;
    ticket: models.TicketModel;
    selectedTicket: models.TicketModel;
    onSelect: (ticket: models.TicketModel) => void;
}
export class TicketView extends React.Component<TicketViewProps, {}> {
    shouldComponentUpdate(nextProps: TicketViewProps) {
      var update = !this.shallowCompare(this.props, nextProps);
      return update;
    }
    shallowCompare(curr: any, next: any): boolean {
      var equal = true;
      Object.keys(next).forEach((key) => {
        if((next[key] !== curr[key])) {
          console.log(key + ': ' + next[key] + ' ===? NOT EQUAL');
          equal = false;
        }
        });
        return equal;
    }
    render() {
        var ticket = this.props.ticket;
        var isSelected = this.props.selectedTicket === ticket;
        console.log('       Render: Ticket: ' + ticket.get('name'));
        return (
            <li className={ isSelected ? 'active' : '' } onClick={() => { this.props.onSelect(ticket) } }>{ticket.get('name')}</li>
        );
    }
}
