<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\OrderControlller;
use App\Http\Controllers\OrderDetailsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleManagementControlller;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\SupplierController;
use App\Models\Order;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/staffs', [StaffController::class, 'index'])->name('staff.index');
Route::post('/staffs', [StaffController::class, 'store'])->name('staff.store');
Route::put('/staffs/{id}', [StaffController::class, 'update'])->name('staff.update');
Route::delete('/staffs/{id}', [StaffController::class, 'destroy'])->name('staff.destroy');


Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::post('/products', [ProductController::class, 'store'])->name('product.store');
Route::put('/products/{id}', [ProductController::class, 'update'])->name('product.update');
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('product.destroy');


Route::get('/suppliers', [SupplierController::class, 'index'])->name('supplier.index');
Route::post('/suppliers', [SupplierController::class, 'store'])->name('supplier.store');
Route::put('/suppliers/{id}', [SupplierController::class, 'update'])->name('supplier.update');
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy'])->name('supplier.destroy');


Route::get('/customers', [CustomerController::class, 'index'])->name('customer.index');
Route::post('/customers', [CustomerController::class, 'store'])->name('customer.store');
Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('customer.update');
Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('customer.destroy');



Route::get('/orders',[OrderControlller::class,'index'])->name('order.index');
Route::post('/orders',[OrderControlller::class,'store'])->name('order.store');



Route::get('/payments',[PaymentController::class,'index'])->name('payment.index');
Route::get('/payments/{id}', [PaymentController::class,'getRemainingAmount'])->name('payment.remaining.amount');
Route::post('/payments',[PaymentController::class,'store'])->name('payment.store');
Route::get('/orders/{order}/remaining-amount', [PaymentController::class, 'getRemainingAmount'])
    ->name('orders.remaining-amount');



Route::get('/imports',[ImportController::class,'index'])->name('import.index');
Route::post('/imports',[ImportController::class,'store'])->name('import.store');






require __DIR__.'/auth.php';
