/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import Freezer = require('freezer-js');
import moment = require('moment');

import models = require('./Models');

import bv = require('./BaseViews');



var PureRenderMixin = require('react/addons').addons.PureRenderMixin;


export interface ReconciliationViewProps {
    tickets: { [key: string]: models.TicketModel };
}
export interface ReconciliationViewState {
    selectedTicket: models.TicketModel;
}
export class ReconciliationView extends React.Component<ReconciliationViewProps, ReconciliationViewState> {
    mixins = [PureRenderMixin]
    constructor(props) {
        super(props);
        this.state = {
            selectedTicket: null
        };
    }
    handleSelectTicket(ticket: models.TicketModel) {
        console.log('Select ticket: ' + JSON.stringify(ticket));
        this.setState({ selectedTicket: ticket });
    }
    render() {
        console.log('   Render: Reconciliation');
        return (
            <div className="reconciliation">
            <TicketsView tickets={this.props.tickets}
            onSelectTicket={ this.handleSelectTicket.bind(this) }
            selectedTicket={ this.state.selectedTicket }></TicketsView>
            { /*
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
    tickets: { [key: string]: models.TicketModel }
    selectedTicket: models.TicketModel;
    /*
    onFilterChanged: (filter: string) => void;
    onInsertTicket: (name: string) => void;*/
    onSelectTicket: (ticket: models.TicketModel) => void;
}
export interface TicketsViewState {
    filteredTickets?: { [key: string]: models.TicketModel };
}
export class TicketsView extends React.Component<TicketsViewProps, any> {
    //mixins = [PureRenderMixin]
    stateStore: any;
    constructor(props: TicketsViewProps) {
        super(props);
        this.stateStore = new Freezer<TicketsViewState>({
            filteredTickets: this.getFilteredTickets('', props.tickets)
        });
        this.state = {
            store: this.stateStore.get()
        };
    }
    componentDidMount() {
        this.stateStore.on('update', () => {
            this.setState({ store: this.stateStore.get() });
        });
    }
    shouldComponentUpdate(nextProps: TicketsViewProps, nextState: any) {
        var shouldUpdate = this.props.tickets !== nextProps.tickets
            || this.props.selectedTicket !== nextProps.selectedTicket
            || this.state.store !== nextState.store;
        return shouldUpdate;
    }
    handleFilterChanged(element, e) {
        var tickets = this.props.tickets;
        if (e.keyCode === 13) {
            var ticket: models.TicketModel = {
                key: new Date().toISOString(),
                name: e.target.value
            };
            e.target.value = '';
            tickets = (this.props.tickets as any).set(ticket.key, ticket);
        }
        var filter = e.target.value;
        var filteredTickets = this.getFilteredTickets(filter, tickets);
        this.state.store.set('filteredTickets', filteredTickets);
    }
    getFilteredTickets(filter: string, tickets: { [key: string]: models.TicketModel }): { [key: string]: models.TicketModel } {
        var normalized = filter.trim().toLowerCase();
        if (normalized.length === 0) return tickets;

        var filtered: { [key: string]: models.TicketModel } = {};

        Object.keys(tickets).forEach((key) => {
            if (tickets[key].name.toLowerCase().indexOf(normalized) >= 0) {
                filtered[key] = tickets[key];
            }
        });
        return filtered;
    }
    render() {
        console.log('     Render: Tickets List');
        var tickets = this.state.store.filteredTickets;
        var nodes = Object.keys(tickets).map((key) => {
            var ticket = tickets[key];
            var isSelected = this.props.selectedTicket === ticket;
            return (<TicketView key={key} isSelected={isSelected} ticket={ticket} onSelect={(ticket) => { this.props.onSelectTicket(ticket) } }></TicketView>);
        });
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
    isSelected: boolean;
    ticket: models.TicketModel;
    onSelect: (ticket: models.TicketModel) => void;
}
export class TicketView extends React.Component<TicketViewProps, any> {
    shouldComponentUpdate(nextProps: TicketViewProps) {
        var shouldUpdate = this.props.ticket !== nextProps.ticket || this.props.isSelected !== nextProps.isSelected;
        return shouldUpdate;
    }
    render() {
        var ticket = this.props.ticket;
        console.log('       Render: Ticket: ' + ticket.name);
        return (
            <li className={ this.props.isSelected ? 'active' : '' } onClick={() => { this.props.onSelect(ticket) } }>{ticket.name}</li>
        );
    }
}
