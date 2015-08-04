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
import menuViews = require('./MenuViews');

export class MainView extends React.Component<{}, any> {
    render() {
        return (
            <div>
            <div className="sticky-header">
              <ul>
                <li><a href="#">RMS</a></li>
                <li><a href="#menu">Menu</a></li>
              </ul>
            </div>
          <menuViews.MenuCategoriesView></menuViews.MenuCategoriesView>
          { /* <inventoryViews.InventoryView></inventoryViews.InventoryView>
            <vendorViews.VendorsView></vendorViews.VendorsView>
        <shiftViews.ShiftsView></shiftViews.ShiftsView>
      <kitchenViews.KitchenOrdersView></kitchenViews.KitchenOrdersView> */ }
            </div>
        );
    }
}
