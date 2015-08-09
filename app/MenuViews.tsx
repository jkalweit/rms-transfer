/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import moment = require('moment');

import models = require('./Models');

import bv = require('./BaseViews');







export interface MenuViewProps {
    menu: models.MenuModel;
}
export interface MenuViewState {
    selectedCategory?: models.MenuCategoryModel;
    selectedItem?: models.MenuItemModel;
}
export class MenuView extends bv.FreezerView<MenuViewProps, MenuViewState> {
    name: string = '  MenuView';
    constructor(props) {
        super(props);
        this.state = { selectedCategory: null }
    }
    render() {
        console.log(this.name + ': Render');
        var menuItems = {} as {[key: string]: models.MenuItemModel};
        if(this.state.selectedCategory) menuItems = this.state.selectedCategory.items;
        return (
            <div className="menu">
              <MenuCategoriesView categories={this.props.menu.categories} selectedCategory={ this.state.selectedCategory } onSelectCategory={ (category: models.MenuCategoryModel) => { this.setState({ selectedCategory: category }); } }></MenuCategoriesView>
              <MenuItemsView items={menuItems} selectedItem={this.state.selectedItem} onSelectItem={ (item: models.MenuItemModel) => { this.setState({ selectedItem: item}); } }></MenuItemsView>
            </div>
        );
    }
}





export interface MenuCategoriesViewProps {
    categories: { [key: string]: models.MenuCategoryModel };
    selectedCategory: models.MenuCategoryModel;
    onSelectCategory(category: models.MenuCategoryModel): void;
}
export class MenuCategoriesView extends bv.FreezerView<MenuCategoriesViewProps, any> {
    name: string = '    MenuCategoriesView';
    doTest() {
        var category: models.MenuCategoryModel = {
            key: new Date().toISOString(),
            name: 'Dinner Entrees',
            items: {}
        };

        (this.props.categories as any).set(category.key, category);
    }
    render() {
        console.log(this.name + ': Render');
        var nodes = Object.keys(this.props.categories).map((key) => {
            var category = this.props.categories[key];
            var isSelected = category === this.props.selectedCategory;
            return (<MenuCategoryView key={key} category={ category } isSelected={isSelected} onSelectCategory={ this.props.onSelectCategory.bind(this) }></MenuCategoryView>);
        });
        return (
            <div className="menu-categories">
              <h3>Menu Categories</h3>
              <button onClick={this.doTest.bind(this) }>Do Test</button>
              <ul>
                { nodes }
              </ul>
            </div>
        );
    }
}




export interface MenuCategoryViewProps {
    key: string;
    category: models.MenuCategoryModel;
    isSelected: boolean;
    onSelectCategory(cateogyr: models.MenuCategoryModel): void;
}
export class MenuCategoryView extends bv.FreezerView<MenuCategoryViewProps, any> {
    name: string = '      MenuCategoryView';
    render() {
        console.log(this.name + ': Render ' + this.props.category.name);
        var className = this.props.isSelected ? 'active' : '';
        return (
            <li className={className} onClick={() => { this.props.onSelectCategory(this.props.category); } }>{ this.props.category.name }</li>
        );
    }
}















export interface MenuItemsViewProps {
    items: { [key: string]: models.MenuItemModel };
    selectedItem: models.MenuItemModel;
    onSelectItem(category: models.MenuItemModel): void;
}
export class MenuItemsView extends bv.FreezerView<MenuItemsViewProps, any> {
    name: string = '    MenuItemsView';
    render() {
        console.log(this.name + ': Render');
        var nodes = Object.keys(this.props.items).map((key) => {
            var item = this.props.items[key];
            var isSelected = item === this.props.selectedItem;
            return (<MenuItemView key={item.key} item={ item } isSelected={isSelected} onSelect={ this.props.onSelectItem.bind(this) }></MenuItemView>);
        });
        return (
            <div className="menu-items">
              <h3>Menu Items</h3>
              <ul>
                { nodes }
              </ul>
            </div>
        );
    }
}

export interface MenuItemViewProps {
    key: string;
    item: models.MenuItemModel;
    onSelect: (menuItem: models.MenuItemModel) => void;
    isSelected: boolean;
}
export class MenuItemView extends bv.FreezerView<MenuItemViewProps, {}> {
    name: string = 'MenuItemView';
    render() {
        var className = this.props.isSelected ? 'active' : '';
        return (
            <li className={className} onClick={ () => { this.props.onSelect(this.props.item); } }>{this.props.item.name}</li>
        );
    }
}





/*export class MenuItemEditView extends bv.SimpleItemEditView {
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
}*/








/*export interface MenuViewState {
    categories?: MenuCategoryModel[];
    selectedCategory?: MenuCategoryModel;
    selectedItem?: MenuItemModel;
}*/

/*export class MenuView extends React.Component<{}, MenuViewState> {
    constructor(props) {
        super(props);
    }
    handleInsertCategory(category: models.MenuCategoryModel) {
      category._id = category._id || new Date().toISOString();
      category.menuItems = category.menuItems || [];

      console.log('adding cat: ' + JSON.stringify(category));
      this.setState({
          categories: this.state.categories.concat([category]),
          selectedCategory: category,
          selectedItem: null
        });
    }
    handleInsertItem(item: models.MenuItemModel) {
      item._id = item._id || new Date().toISOString();

      console.log('adding item: ' + JSON.stringify(item));
      var categories = this.state.categories;
      for(var i = 0; i < categories.length; i++) {
        if(categories[i]._id === this.state.selectedCategory._id){
          //var category = categories.id;
        }
      }
      this.setState({
          categories: this.state.categories.concat([category]),
          selectedCategory: category,
          selectedItem: null
        });
    }
    render() {
        return (
            <div className="menu">
            {
              <MenuCategoriesView
                categories={this.state.categories}
                selectedCategory={this.state.selectedCategory}
                onCategorySelected={(category: models.MenuCategoryModel) => { this.setState({ selectedCategory: category, selectedItem: null }) } }
                onInsertCategory={ this.handleInsertCategory.bind(this) }>
              </MenuCategoriesView>
              <MenuItemsView
                menuItems={ this.state.selectedCategory ? this.state.selectedCategory.menuItems : [] }
                selectedItem={ this.state.selectedItem }
                onItemSelected={(item: models.MenuItemModel) => { this.setState({ selectedItem: item }); }}
                onInsertItem={ this.handleInsertItem.bind(this) }>
              </MenuItemsView> }
            </div>
        );
    }
}*/


/*
export interface MenuCategoriesViewProps {
    categories: models.MenuCategoryModel[];
    selectedCategory: models.MenuCategoryModel;
    onCategorySelected: (category: models.MenuCategoryModel) => void;
    onInsertCategory?: (category: models.MenuCategoryModel) => void;
}

export class MenuCategoriesView extends React.Component<MenuCategoriesViewProps, {}> {
    render() {
        var nodes = this.props.categories.map((category: models.MenuCategoryModel) => {
            var className = (this.props.selectedCategory && this.props.selectedCategory._id === category._id) ? 'active' : '';
            return (<li key={category._id} className={className} onClick={() => { this.props.onCategorySelected(category); }}>{ category.name }</li>);
        });

        return (
            <div className="menu-categories">
              <h3>Menu Categories</h3>
              <ul>
                <li>
                  <bv.Button className="btn-add" onClick={() => { (this.refs as any).addCategoryModal.toggle(); } }><span className="fa fa-plus-circle"></span> Category</bv.Button>
                </li>
                {nodes}
              </ul>


              <bv.ModalView ref="addCategoryModal" onShown={() => { (this.refs as any).addCategoryView.doFocus(); } }>
                <MenuCategoryEditView ref="addCategoryView"
                    onSave={(entity) => {
                      this.props.onInsertCategory(entity);
                      (this.refs as any).addCategoryModal.toggle();
                      }}
                    onCancel={ () => { (this.refs as any).addCategoryModal.toggle(); } }>
                </MenuCategoryEditView>
              </bv.ModalView>

            </div>
        );
    }
}*/

/*
export interface MenuItemsViewProps {
    menuItems: models.MenuItemModel[];
    selectedItem: models.MenuItemModel;
    onItemSelected: (item: models.MenuItemModel) => void;
    onInsertItem: (item: models.MenuItemModel) => void;
}
export class MenuItemsView extends React.Component<MenuItemsViewProps, any> {
    render() {
      var nodes = this.props.menuItems.map((item: models.MenuItemModel) => {
          var className = (this.props.selectedItem && this.props.selectedItem._id === item._id) ? 'active' : '';
          return (<li key={item._id} className={className} onClick={() => { this.props.onItemSelected(item); }}>{ item.name }</li>);
      });

        return (
            <div className="menu-items">
              <h3>Menu Items</h3>
              <ul>
              <li>
                <bv.Button className="btn-add" onClick={() => { (this.refs as any).addItemModal.toggle(); } }><span className="fa fa-plus-circle"></span> Item</bv.Button>
              </li>
                { nodes }
              </ul>


              <bv.ModalView ref="addMenuItemModal" onShown={() => { (this.refs as any).editItemView.doFocus(); } }>
                <MenuItemEditView ref="editItemView" entity={{}}
                    onSave={(entity) => { this.props.onInsertItem(entity); (this.refs as any).addMenuItemModal.hide(); } }
                    onCancel={() => { (this.refs as any).addMenuItemModal.toggle(); } }>
                </MenuItemEditView>
              </bv.ModalView>

            </div>
        );
    }
}
*/

/*export class MenuCategoryDetailsView extends bv.BaseItemView<bv.BaseItemViewProps, any> {

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
                <li key={entity._id}>{entity.name}</li>
            );
        }

        return (
            <li key={this.state.entity._id}>
              {this.state.entity.name}
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
            }

            </li>
        );
    }
}*/

/*export class MenuCategoryEditView extends bv.SimpleItemEditView {
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
}*/

/*
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
}*/
