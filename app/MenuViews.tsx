/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import moment = require('moment');
import models = require('Models');

import bv = require('./BaseViews');


export interface MenuCategoriesViewState {
    selectedCategory?: models.MenuCategoryModel;
}

export class MenuCategoriesView extends bv.BaseView<models.MenuCategoryModel, {}, MenuCategoriesViewState> {
    constructor(props) {
        super(props, models.MenuCategoryModel.collectionName);
    }
    insert(entity: models.MenuCategoryModel) {
        this.insertBase(entity);
        this.setState({ selectedCategory: entity });
    }
    addCategory() {
        (this.refs as any).addCategoryModal.toggle();
    }
    render() {
        console.log('Selected Cat: ' + JSON.stringify(this.state.selectedCategory));
        var nodes = this.state.data.map((entity: models.MenuCategoryModel) => {
            var className = (this.state.selectedCategory && this.state.selectedCategory._id === entity._id) ? 'active' : '';
            return (<li key={entity._id} className={className} onClick={() => { this.setState({ selectedCategory: entity }); } }>{ entity.name }</li>);
        });


        return (
            <div className="menu">
              <bv.ModalView ref="addCategoryModal" onShown={() => { (this.refs as any).addCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="addCategoryView" entity={this.state.entity}
                onSave={(entity) => { this.insert(entity); (this.refs as any).addCategoryModal.toggle(); } }
                onCancel={ () => { (this.refs as any).addCategoryModal.toggle(); } }>
                </MenuCategoryEditView>
              </bv.ModalView>
              <h3>Menu Categories</h3>
              <ul>
                <li>
                  <bv.Button className="btn-add" onClick={() => { this.addCategory() } }><span className="fa fa-plus-circle"></span> Category</bv.Button>
                </li>
                {nodes}
              </ul>
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
            /*nodes.push(
                <MenuItemView key={entity._id} entity={entity} onUpdate={this.updateMenuItem.bind(this) } onRemove={this.removeMenuItem.bind(this) }></MenuItemView>
            );*/

            nodes.push(
                <li key={entity._id}>{entity.name}</li>
            );
        }

        return (
            <li key={this.state.entity._id}>
              {this.state.entity.name}
            { /*
              <bv.Button className="col-1" onClick={() => {(this.refs as any).editCategoryView.reset(); (this.refs as any).editCategoryModal.show(); }}><span className="fa fa-pencil"></span></bv.Button>
              <bv.Button className="col-2 btn-add" onClick={() => {(this.refs as any).addMenuItemModal.toggle(); }}><span className="fa fa-plus-circle fa-fw"></span></bv.Button>

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
              */
            }

            </li>
        );
    }
}

export class MenuCategoryEditView extends bv.SimpleItemEditView {
    doFocus() {
        var input = React.findDOMNode(this.refs['type']) as any;
        input.focus();
    }
    render() {

        return (
            <div>
          <h2>Edit Menu Category</h2>
          <br />
          <br />
          <span className="col-4">Type: </span> <select className="col-4" ref="type" value={this.state.entity.type} onChange={ this.handleChange.bind(this, "type") } >
                    <option></option>
                    <option>Food</option>
                    <option>Alcohol</option>
          </select>
          <br />
          <div className="row"><span className="col-4">Name: </span> <input className="col-6" ref="name" value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } /></div>
          <div className="row"><span className="col-4">Note: </span> <input className="col-10" value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } /></div>
          <bv.SimpleConfirmView
          onCancel={() => { this.cancel() } }
          onSave={() => { this.save() } }
          onRemove={ this.props.onRemove ? () => { this.remove() } : null }
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
              <bv.Button className="col-8" onClick={() => { (this.refs as any).editModal.toggle(); } }>{ this.props.entity.name }</bv.Button>
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
          <div className="row"><span className="col-4">Name: </span><input className="col-6" ref="name" value={ this.state.entity.name } onChange={ this.handleChange.bind(this, "name") } /></div>
          <div className="row"><span className="col-4">Note: </span><input className="col-10" value={ this.state.entity.note } onChange={ this.handleChange.bind(this, "note") } /></div>
          <div className="row"><span className="col-4">Price: </span><input className="col-2" value={ this.state.entity.price } onChange={ this.handleChange.bind(this, "price") } /></div>
          <bv.SimpleConfirmView
          onCancel={() => { this.cancel() } }
          onSave={() => { this.save() } }
          onRemove={ this.props.onRemove ? () => { this.remove() } : null }
          isDirty={this.state.isDirty}
          ></bv.SimpleConfirmView>
            </div>
        );
    }
}
