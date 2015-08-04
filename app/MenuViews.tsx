/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import io = require('socket.io');
import moment = require('moment');
import models = require('Models');

import bv = require('./BaseViews');


export class MenuCategoriesView extends bv.BaseView<models.MenuCategoryModel, {}, any> {
    constructor(props) {
        super(props, models.MenuCategoryModel.collectionName);
        //this.state.isDisabled = true;
    }
    insert(entity) {
        this.insertBase(entity);
    }
    addCategory() {
        (this.refs as any).addCategoryModal.toggle();
    }
    render() {
        var nodes = this.state.data.map((entity) => {
            return (
                <MenuCategoryDetailsView key={entity._id} entity={entity} onUpdate={this.update.bind(this) } onRemove={this.remove.bind(this) }></MenuCategoryDetailsView>
            );
        });

        var style = {
            display: this.state.isDisabled ? 'none' : 'block'
        };

        return (
            <div>
              <div onClick={ this.toggleIsDisabled.bind(this) }>
                <h2>Menu Categories</h2>
              </div>
              <bv.ModalView ref="addCategoryModal" onShown={() => { (this.refs as any).addCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="addCategoryView" entity={this.state.entity}
                onSave={(entity) => { this.insert(entity); (this.refs as any).addCategoryModal.toggle(); } }
                onCancel={ () => { (this.refs as any).addCategoryModal.toggle(); } }>
                </MenuCategoryEditView>
              </bv.ModalView>
              <div className="row" style={style}>
                <bv.Button className="col-4" onClick={() => { this.addCategory() } }><span className="fa fa-plus-circle fa-fw"></span> Category</bv.Button>
                <br />
                {nodes}
              </div>
            </div>
        );
    }
}

export class MenuCategoryDetailsView extends bv.BaseItemView<bv.BaseItemViewProps, any> {

    insertMenuItem(item) {
        var newEntity = this.state.entity;
        newEntity.menuItems = newEntity.menuItems || {};
        item._id = new Date().toUTCString();
        newEntity.menuItems[item._id] = item;
        this.setState({
            isDirty: true,
            entity: newEntity
        });
        this.update();
    }

    updateMenuItem(item) {
        var newEntity = this.state.entity;
        newEntity.menuItems[item._id] = item;
        this.setState({
            isDirty: true,
            entity: newEntity
        });
        this.update();
    }

    removeMenuItem(_id) {
        var newEntity = this.state.entity;
        delete newEntity.menuItems[_id];
        this.setState({
            isDirty: true,
            entity: newEntity
        });
        this.update();
    }
    render() {
        var items = this.state.entity.menuItems || {};
        var nodes = [];
        for (var id in this.state.entity.menuItems) {
            var entity = this.state.entity.menuItems[id];
            nodes.push(
                <MenuItemView key={entity._id} entity={entity} onUpdate={this.updateMenuItem.bind(this) } onRemove={this.removeMenuItem.bind(this) }></MenuItemView>
            );
        }

        var style = { marginTop: '20px' }

        return (
            <div className="row" style={style} key={this.state.entity._id}>
              <bv.Button className="col-6" onClick={() => {(this.refs as any).editCategoryView.reset(); (this.refs as any).editCategoryModal.show(); }}>{ this.state.entity.name }</bv.Button>
              <bv.Button className="col-3" onClick={() => {(this.refs as any).addMenuItemModal.toggle(); }}><span className="fa fa-plus-circle fa-fw"></span> Item</bv.Button>

              <bv.ModalView ref="addMenuItemModal" onShown={() => { (this.refs as any).editItemView.doFocus(); } }>
                <MenuItemEditView ref="editItemView" entity={{}}
                onSave={(entity) => { this.insertMenuItem(entity); (this.refs as any).addMenuItemModal.hide(); } }
                onCancel={() => { (this.refs as any).addMenuItemModal.toggle(); } }>
                </MenuItemEditView>
              </bv.ModalView>
              <bv.ModalView ref="editCategoryModal" onShown={() => { (this.refs as any).editCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="editCategoryView" entity={this.state.entity}
                onSave={(entity) => { this.props.onUpdate(entity); (this.refs as any).editCategoryModal.toggle(); } }
                onCancel={ () => { (this.refs as any).editCategoryModal.toggle(); } }
                onRemove={ () => { this.remove(); } }>
                </MenuCategoryEditView>
              </bv.ModalView>

              { nodes }
            </div>
        );
    }
}

export class MenuCategoryEditView extends bv.SimpleItemEditView {
    doFocus() {
        var input = React.findDOMNode(this.refs['type']) as any;
        input.focus();
    }
    render() {

        var hide = { float: 'right', display: this.props.onRemove ? 'block' : 'none' };

        return (
            <div>
          <h2>Edit Menu Category</h2>
          <p>
          Type: <select ref="type" value={this.state.entity.type} onChange={ this.handleChange.bind(this, "type") } >
                    <option></option>
                    <option>Food</option>
                    <option>Alcohol</option>
          </select>
          </p>
          <p>Name: <input ref="name" value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } /></p>
          <p>Note: <input value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } /></p>
          <bv.SimpleConfirmView
            onCancel={() => { this.cancel() }}
            onSave={() => { this.save() }}
            onRemove={() => { this.remove() }}
            isDirty={this.state.isDirty}
            ></bv.SimpleConfirmView>
            </div>
        );
    }
}


export class MenuItemView extends bv.BaseItemView<bv.BaseItemViewProps, any> {
    render() {
        return (
            <div className="row" key={this.props.entity._id}>
              <div className="col-1"></div>
              <div className="col-8 btn" onClick={() => { (this.refs as any).editModal.toggle(); } }>{ this.props.entity.name }</div>
              <div className="col-4 text-right">{ bv.Utils.FormatDollars(this.props.entity.price) }</div>
              <bv.ModalView ref="editModal" onShown={() => { (this.refs as any).editView.doFocus(); } }>
                <MenuItemEditView ref="editView" entity={this.state.entity}
                onSave={(entity) => { this.props.onUpdate(entity); (this.refs as any).editModal.toggle(); } }
                onCancel={ () => { (this.refs as any).editModal.toggle(); } }
                onRemove={ () => { this.remove(); } }>
                </MenuItemEditView>
              </bv.ModalView>
            </div>
        );
    }
}

export class MenuItemEditView extends bv.SimpleItemEditView {
    doFocus() {
        var input = React.findDOMNode(this.refs['name']) as any;
        input.focus();
        input.select();
    }
    render() {

        var hide = { float: 'right', display: this.props.onRemove ? 'block' : 'none' };

        return (
            <div>
          <h2>Edit Menu Item</h2>
          <p>Name: <input ref="name" value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } /></p>
          <p>Note: <input value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } /></p>
          <p>Price: <input value={ this.state.entity.price } onChange={ this.handleChange.bind(this, "price") } /></p>
          <div>
            <button onClick={() => { this.cancel() } }>Cancel</button>
            <button onClick={this.save.bind(this) } disabled={!this.state.isDirty}>Save</button>
            <button onClick={() => { this.remove() } } style={hide}>Delete</button>
          </div>
            </div>
        );
    }
}
