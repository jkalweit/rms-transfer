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
        var ticketMerge = {};
        ticketMerge[ticket.key] = ticket;
        this.reconciliation = this.reconciliation.mergeDeep({ tickets: ticketMerge });
        this.onChanged(this.reconciliation);
    }
}

var store = new Store();
export = store;
