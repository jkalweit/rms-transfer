/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />
define(["require", "exports", 'immutable'], function (require, exports, Immutable) {
    var Store = (function () {
        function Store() {
            this.reconciliation = Immutable.fromJS({
                menu: {
                    categories: {}
                },
                tickets: {
                    '0': { key: '0', name: 'Justin' }
                }
            });
        }
        Store.prototype.insertTicket = function (ticket) {
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
        };
        return Store;
    })();
    var store = new Store();
    return store;
});
//# sourceMappingURL=Store.js.map