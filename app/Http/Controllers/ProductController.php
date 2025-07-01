<?php

namespace App\Http\Controllers;

use App\Actions\CreateProductAction;
use App\Actions\UpdateProductAction;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();

        return Inertia::render('Product/Index',[
            'products' => $products


        ]);
    }

    public function store(StoreProductRequest $request, CreateProductAction $action)
    {
        $product = $action->execute($request->validated());
    }

    public function update(UpdateProductRequest $request,$id, UpdateProductAction  $action)
    {
        $product = $action->execute($id,$request->validated());

    }
    public function destroy($id)
    {
        $product =  Product::findOrFail($id);
        $product->delete();
        return back()->with('success', 'Product deleted successfully');
    }



}
