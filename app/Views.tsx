/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');
import models = require('Models');

import baseViews = require('./BaseViews');
import vendorViews = require('./vendorViews');
import inventoryViews = require('./InventoryViews');
import shiftViews = require('./shiftViews');
import kitchenViews = require('./KitchenViews');




export class MainView extends React.Component<{}, any> {
    render() {
        return (
            <div>
          <h1>RMS</h1>
          <inventoryViews.InventoryView></inventoryViews.InventoryView>
          { /* <vendorViews.VendorsView></vendorViews.VendorsView>
        <shiftViews.ShiftsView></shiftViews.ShiftsView>
      <kitchenViews.KitchenOrdersView></kitchenViews.KitchenOrdersView> */ }
            </div>
        );
    }
}
