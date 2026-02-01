import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing-module';
import { CategoryList } from './pages/category-list/category-list';
import { ProductList } from './pages/product-list/product-list';
import { ProductForm } from './pages/product-form/product-form';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    CategoryList,
    ProductList,
    ProductForm,
  ],
})
export class InventoryModule {}
