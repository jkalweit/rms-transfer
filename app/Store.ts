/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import Immutable = require('immutable');
import models = require('./Models');

class Store {
  reconciliation: any;
  onChanged: (updated) => void;
  constructor() {
    this.reconciliation = Immutable.fromJS({
        menu: {
            categories: {}
        },
        tickets: {
          '0': { key: '0', name: 'Justin' }
        }
    });
  }

  insertTicket(ticket: models.TicketModel) {
    var immutable = Immutable.fromJS(ticket);
    console.log(ticket);
    console.log(this.reconciliation);
    var tickets = this.reconciliation.get('tickets');
    console.log(tickets);
    var updated = tickets.set(ticket);
    console.log(tickets);
    console.log(this.reconciliation);
    console.log('===? ' + (this.reconciliation === updated));
    this.reconciliation = updated;
    this.onChanged(this.reconciliation);
  }
}

var store = new Store();
export = store;
