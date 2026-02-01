import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryList } from './pages/category-list/category-list';
import { ProductList } from './pages/product-list/product-list';
import { ProductForm } from './pages/product-form/product-form';

const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'categories', component: CategoryList },
  { path: 'new', component: ProductForm },
  { path: 'edit/:id', component: ProductForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
