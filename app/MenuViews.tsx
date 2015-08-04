/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import io = require('socket.io');
import moment = require('moment');
import models = require('Models');

import baseViews = require('./BaseViews');


export class MenuCategoriesView extends baseViews.BaseView<models.MenuCategoryModel, {}, any> {
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
              <baseViews.ModalView ref="addCategoryModal" onShown={() => { (this.refs as any).addCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="addCategoryView" entity={this.state.entity}
                onSave={(entity) => { this.insert(entity); (this.refs as any).addCategoryModal.toggle(); } }
                onCancel={ () => { (this.refs as any).addCategoryModal.toggle(); } }>
                </MenuCategoryEditView>
              </baseViews.ModalView>
              <div className="row" style={style}>
                <baseViews.Button className="col-4" onClick={() => { this.addCategory() } }><span className="fa fa-plus-circle fa-fw"></span> Category</baseViews.Button>
                <br />
                {nodes}
              </div>
            </div>
        );
    }
}

export class MenuCategoryDetailsView extends baseViews.BaseItemView<baseViews.BaseItemViewProps, any> {

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
              <div className="col-6 btn" onClick={() => { (this.refs as any).editCategoryView.reset(); (this.refs as any).editCategoryModal.show(); } }>{ this.state.entity.name }</div>
              <div className="col-3 btn" onClick={() => { (this.refs as any).addMenuItemModal.toggle(); } }><span className="fa fa-plus-circle fa-fw"></span> Item</div>

              <baseViews.ModalView ref="addMenuItemModal" onShown={() => { (this.refs as any).editItemView.doFocus(); } }>
                <MenuItemEditView ref="editItemView" entity={{}}
                onSave={(entity) => { this.insertMenuItem(entity); (this.refs as any).addMenuItemModal.hide(); } }
                onCancel={() => { (this.refs as any).addMenuItemModal.toggle(); } }>
                </MenuItemEditView>
              </baseViews.ModalView>
              <baseViews.ModalView ref="editCategoryModal" onShown={() => { (this.refs as any).editCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="editCategoryView" entity={this.state.entity}
                onSave={(entity) => { this.props.onUpdate(entity); (this.refs as any).editCategoryModal.toggle(); } }
                onCancel={ () => { (this.refs as any).editCategoryModal.toggle(); } }
                onRemove={ () => { this.remove(); } }>
                </MenuCategoryEditView>
              </baseViews.ModalView>

              { nodes }
            </div>
        );
    }
}

export class MenuCategoryEditView extends baseViews.SimpleItemEditView {
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
          <div>
            <button onClick={() => { this.cancel() } }>Cancel</button>
            <button onClick={this.save.bind(this) } disabled={!this.state.isDirty}>Save</button>
            <div className="btn" onClick={() => { this.remove() } } style={hide}>Delete</div>
          </div>
            </div>
        );
    }
}


export class MenuItemView extends baseViews.BaseItemView<baseViews.BaseItemViewProps, any> {
    render() {
        return (
            <div className="row" key={this.props.entity._id}>
              <div className="col-1"></div>
              <div className="col-8 btn" onClick={() => { (this.refs as any).editModal.toggle(); } }>{ this.props.entity.name }</div>
              <div className="col-4 text-right">{ baseViews.Utils.FormatDollars(this.props.entity.price) }</div>
              <baseViews.ModalView ref="editModal" onShown={() => { (this.refs as any).editView.doFocus(); } }>
                <MenuItemEditView ref="editView" entity={this.state.entity}
                onSave={(entity) => { this.props.onUpdate(entity); (this.refs as any).editModal.toggle(); } }
                onCancel={ () => { (this.refs as any).editModal.toggle(); } }
                onRemove={ () => { this.remove(); } }>
                </MenuItemEditView>
              </baseViews.ModalView>
            </div>
        );
    }
}

export class MenuItemEditView extends baseViews.SimpleItemEditView {
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
