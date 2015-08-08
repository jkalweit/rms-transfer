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
            var ticketMerge = {};
            ticketMerge[ticket.key] = ticket;
            this.reconciliation = this.reconciliation.mergeDeep({ tickets: ticketMerge });
            this.onChanged(this.reconciliation);
        };
        return Store;
    })();
    var store = new Store();
    return store;
});
//# sourceMappingURL=Store.js.map