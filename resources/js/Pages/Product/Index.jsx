
import React, { useState } from 'react';
import { useForm, router } from "@inertiajs/react";
import { Plus, Edit2, Trash2, Package, DollarSign, Hash, Tag } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"



export default function Index({ products = [] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const { data, setData, put, post, delete: destroy, errors, processing, reset } = useForm({
        name: '',
        quantity: '',
        unit_price_stock: '',
        sale_unit_price: '',
    });

    /**
     * Handle form submission for create/update
     * @param {Event} e
     */
    function handleSubmit(e) {
        e.preventDefault();

        if (editingProduct) {
            // Update existing product
            put(route('product.update', editingProduct.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingProduct(null);
                    reset();
                },
                onError: () => {
                    // Errors are automatically handled by Inertia
                }
            });
        } else {
            // Create new product
            post(route('product.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
                onError: () => {
                    // Errors are automatically handled by Inertia
                }
            });
        }
    }

    /**
     * Open edit dialog with product data
     * @param {Object} product
     */
    function handleEdit(product) {
        setEditingProduct(product);
        setData({
            name: product.name,
            quantity: product.quantity.toString(),
            unit_price_stock: product.unit_price_stock.toString(),
            sale_unit_price: product.sale_unit_price.toString(),
        });
        setIsDialogOpen(true);
    }

    /**
     * Delete product with confirmation
     * @param {number} id
     */
    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('product.destroy', id));

        }
    }

    /**
     * Reset form and open create dialog
     */
    function openCreateDialog() {
        setEditingProduct(null);
        reset();
        setIsDialogOpen(true);
    }

    /**
     * Close dialog and reset form
     */
    function closeDialog() {
        setIsDialogOpen(false);
        setEditingProduct(null);
        reset();
    }

    /**
     * Calculate profit percentage
     */
    function calculateProfit(salePrice, stockPrice) {
        return ((salePrice - stockPrice) / stockPrice * 100).toFixed(1);
    }

    /**
     * Format currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-black p-3 rounded-lg">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl">Product Management</CardTitle>
                                    <CardDescription className="text-lg">
                                        Manage your inventory and pricing
                                    </CardDescription>
                                </div>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={openCreateDialog}
                                        className="bg-black hover:bg-gray-800 text-white"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Product
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingProduct
                                                ? 'Update the product information below.'
                                                : 'Fill in the product details to add it to your inventory.'
                                            }
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center">
                                                <Tag className="w-4 h-4 mr-2 text-gray-600" />
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                    }`}
                                                placeholder="Enter product name"
                                                disabled={processing}
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center">
                                                <Hash className="w-4 h-4 mr-2 text-gray-600" />
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                    }`}
                                                placeholder="0"
                                                min="0"
                                                disabled={processing}
                                            />
                                            {errors.quantity && (
                                                <p className="text-red-500 text-sm">{errors.quantity}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                                                    Stock Price
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.unit_price_stock}
                                                    onChange={(e) => setData('unit_price_stock', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors.unit_price_stock ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                        }`}
                                                    placeholder="0.00"
                                                    min="0"
                                                    disabled={processing}
                                                />
                                                {errors.unit_price_stock && (
                                                    <p className="text-red-500 text-sm">{errors.unit_price_stock}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                                                    Sale Price
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.sale_unit_price}
                                                    onChange={(e) => setData('sale_unit_price', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 ${errors.sale_unit_price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                        }`}
                                                    placeholder="0.00"
                                                    min="0"
                                                    disabled={processing}
                                                />
                                                {errors.sale_unit_price && (
                                                    <p className="text-red-500 text-sm">{errors.sale_unit_price}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-3 pt-4">
                                            <Button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={processing}
                                                className="flex-1 bg-black hover:bg-gray-800 text-white"
                                            >
                                                {processing ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={closeDialog}
                                                disabled={processing}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                </Card>

                {/* Products Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Inventory</CardTitle>
                        <CardDescription>
                            {products.length} products in inventory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {products.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-semibold">Product</th>
                                            <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                                            <th className="text-right py-3 px-4 font-semibold">Stock Price</th>
                                            <th className="text-right py-3 px-4 font-semibold">Sale Price</th>
                                            <th className="text-center py-3 px-4 font-semibold">Profit %</th>
                                            <th className="text-center py-3 px-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <div className="bg-gray-800 p-2 rounded-lg mr-3">
                                                            <Package className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-semibold">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${product.quantity > 100 ? 'bg-white border-gray-800 text-gray-800' :
                                                        product.quantity > 50 ? 'bg-gray-100 border-gray-600 text-gray-700' :
                                                            'bg-gray-800 border-gray-800 text-white'
                                                        }`}>
                                                        {product.quantity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right font-semibold">
                                                    {formatCurrency(product.unit_price_stock)}
                                                </td>
                                                <td className="py-4 px-4 text-right font-semibold">
                                                    {formatCurrency(product.sale_unit_price)}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border">
                                                        +{calculateProfit(product.sale_unit_price, product.unit_price_stock)}%
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-4">Get started by adding your first product</p>
                                <Button onClick={openCreateDialog} className="bg-black hover:bg-gray-800 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
