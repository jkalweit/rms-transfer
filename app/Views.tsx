/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import Freezer = require('freezer-js');

import models = require('./Models');

import baseViews = require('./BaseViews');
import vendorViews = require('./vendorViews');
import inventoryViews = require('./InventoryViews');
import shiftViews = require('./shiftViews');
import kitchenViews = require('./KitchenViews');
import menuViews = require('./MenuViews');
import recViews = require('./ReconciliationViews');


export interface NavigatorProps {
    hash: string;
    children?: any;
}

export class NavigationBase extends React.Component<NavigatorProps, any> {
    constructor(props) {
        super(props);
        this.state = { isSelected: this.compareHash() };
        window.addEventListener('hashchange', () => {
            this.setState({ isSelected: this.compareHash() });
        });
    }
    compareHash(): boolean {

        var normalizedHash = (location.hash || '').toLowerCase();
        if (normalizedHash == '') normalizedHash = '#';

        return normalizedHash == this.props.hash;
    }
    render() {
        return (<div>Navigator Base is an abstract class.You must implement your own render().</div>);
    }
}


export class NavigationView extends NavigationBase {
    render() {
        var style = {
            zIndex: this.state.isSelected ? 1 : 0,
            opacity: this.state.isSelected ? 1 : 0
        };
        /*if (!this.state.isSelected) {
            style = {
                height: '0',
                overflow: 'auto'
            };
        }*/

        return (
            <div className="navigation-view" style={style}>
              { this.props.children }
            </div>
        );
    }
}


export class NavigationItem extends NavigationView {
    render() {
        var className = this.state.isSelected ? 'active' : '';
        return (
            <a className={className} href={this.props.hash}>
              { this.props.children }
            </a>
        );
    }
}





var reconciliationStore = new Freezer<models.Reconciliation>({
    menu: {
        categories: {}
    },
    tickets: {
      '0': { key: '0', name: 'Justin' }
    }
});



export interface MainViewState {
    reconciliation: models.Reconciliation;
}
export class MainView extends React.Component<{}, MainViewState> {
    constructor(props) {
        super(props);
        this.state = {
            reconciliation: reconciliationStore.get()
        };
    }
    componentDidMount() {
        reconciliationStore.on('update', () => {
            var reconciliation = reconciliationStore.get();
            console.log('MainView Store: ' + JSON.stringify(reconciliation));
            this.setState({
                reconciliation: reconciliation
            })
        });
    }
    render() {
        var rec = this.state.reconciliation;
        return (
            <div>
            <div className="sticky-header">
              <ul>
                <li><NavigationItem hash="#"><span className="col-2">RMS</span></NavigationItem></li>
                <li><NavigationItem hash="#reconciliation"><span className="col-6">Reconciliation</span></NavigationItem></li>
                <li><NavigationItem hash="#menu"><span className="col-5">Menu</span></NavigationItem></li>
                <li><NavigationItem hash="#kitchen"><span className="col-5">Kitchen</span></NavigationItem></li>
              </ul>
            </div>
            <NavigationView hash="#">
              <h1>Welcome to RMS</h1>
              <p>There will be a dashboard here later.</p>
              <p>Use the navigation above to select a location.</p>
            </NavigationView>
            <NavigationView hash="#reconciliation"><recViews.ReconciliationView tickets={rec.tickets}></recViews.ReconciliationView></NavigationView>
            <NavigationView hash="#menu"><menuViews.MenuView menu={rec.menu}></menuViews.MenuView></NavigationView>
            <NavigationView hash="#kitchen"><h1>The kitchen!</h1></NavigationView>
          { /*
            <kitchenViews.KitchenOrdersView></kitchenViews.KitchenOrdersView>
             <inventoryViews.InventoryView></inventoryViews.InventoryView>
            <vendorViews.VendorsView></vendorViews.VendorsView>
        <shiftViews.ShiftsView></shiftViews.ShiftsView>
       */ }
            </div>
        );
    }
}
