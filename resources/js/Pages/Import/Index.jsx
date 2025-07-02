import React, { useState, useEffect } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Plus,
    Package,
    Calendar,
    DollarSign,
    Building2,
    Trash2,
    Eye,
} from "lucide-react";

export default function Index() {
    const {
        staffs,
        suppliers,
        products,
        stats,
        recentImports,
    } = usePage().props;

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [processing, setProcessing] = useState(false);
    // Form data state
    const [formData, setFormData] = useState({
        import_date: new Date().toISOString().split("T")[0],
        staff_id: "",
        supplier_id: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            import_date: new Date().toISOString().split("T")[0],
            staff_id: "",
            supplier_id: "",
        });
        setSelectedProducts([]);
        setErrors({});

    }, []);

    const addProduct = () => {
        setSelectedProducts([
            ...selectedProducts,
            {
                id: Date.now(), // Temporary UI ID
                product_id: "", // Actual product ID from database
                quantity: 1,
                price: 0,
            },
        ]);
    };

    const updateProduct = (id, field, value) => {
        setSelectedProducts((prev) =>
            prev.map((product) =>
                product.id === id ? { ...product, [field]: value } : product
            )
        );
    };

    const removeProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.filter((product) => product.id !== id)
        );
    };

    const calculateTotal = () => {
        return selectedProducts.reduce(
            (sum, p) => sum + (parseFloat(p.quantity) || 0) * (parseFloat(p.price) || 0),
            0
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Prepare import details
        const importDetails = selectedProducts.map((p) => ({
            product_id: parseInt(p.product_id), // Use product_id from the product selection
            quantity: parseInt(p.quantity) || 0,
            price: parseFloat(p.price) || 0,
            amount: (parseInt(p.quantity) || 0) * (parseFloat(p.price) || 0),
        }));

        // Prepare the complete form data
        const submitData = {
            import_date: formData.import_date,
            staff_id: formData.staff_id,
            supplier_id: formData.supplier_id,
            total: calculateTotal(),
            import_details: importDetails,
        };

        console.log('Submitting data:', submitData); // Debug log

        // Submit using Inertia router directly
        router.post(route("import.store"), submitData, {
            onSuccess: (page) => {
                console.log('Success!', page);
                setFormData({
                    import_date: new Date().toISOString().split("T")[0],
                    staff_id: "",
                    supplier_id: "",
                });
                setSelectedProducts([]);
                setErrors({});
                setProcessing(false);
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <>
            <Head title="Import Management" />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <h1 className="text-2xl font-bold">Business Management System</h1>
                        <p className="text-gray-600">
                            Manage orders, payments, and inventory imports
                        </p>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                                <CardTitle className="text-sm text-gray-600">Total Imports</CardTitle>
                                <Package className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.total_imports || 0}</div>
                                <p className="text-sm text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                                <CardTitle className="text-sm text-gray-600">This Week</CardTitle>
                                <Calendar className="h-5 w-5 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.this_week_imports || 0}</div>
                                <p className="text-sm text-muted-foreground">${(stats?.this_week_value || 0).toFixed(2)}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                                <CardTitle className="text-sm text-gray-600">This Month</CardTitle>
                                <Building2 className="h-5 w-5 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.this_month_imports || 0}</div>
                                <p className="text-sm text-green-600">
                                    Avg: ${(stats?.average_import_value || 0).toFixed(2)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                                <CardTitle className="text-sm text-gray-600">Total Value</CardTitle>
                                <DollarSign className="h-5 w-5 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${(stats?.total_value || 0).toFixed(2)}</div>
                                <p className="text-sm text-muted-foreground">All imports</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form + Recent Imports */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Import Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Package className="h-5 w-5" /> Import Management
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Import Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="import_date">Import Date *</Label>
                                    <Input
                                        id="import_date"
                                        type="date"
                                        value={formData.import_date}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            import_date: e.target.value
                                        }))}
                                    />
                                    {errors.import_date && (
                                        <p className="text-red-500 text-sm">{errors.import_date}</p>
                                    )}
                                </div>

                                {/* Staff Member */}
                                <div className="space-y-2">
                                    <Label htmlFor="staff_id">Staff Member *</Label>
                                    <Select
                                        value={formData.staff_id}
                                        onValueChange={(val) => setFormData(prev => ({
                                            ...prev,
                                            staff_id: val
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(staffs) && staffs.length > 0 ? (
                                                staffs.map((staff) => (
                                                    <SelectItem key={staff.id} value={staff.id.toString()}>
                                                        {staff.fullname}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-staff" disabled>No staff available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.staff_id && (
                                        <p className="text-red-500 text-sm">{errors.staff_id}</p>
                                    )}
                                </div>

                                {/* Supplier */}
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_id">Supplier *</Label>
                                    <Select
                                        value={formData.supplier_id}
                                        onValueChange={(val) => setFormData(prev => ({
                                            ...prev,
                                            supplier_id: val
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.isArray(suppliers) && suppliers.length > 0 ? (
                                                suppliers.map((supplier) => (
                                                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                        {supplier.suppliers}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-supplier" disabled>No suppliers available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.supplier_id && (
                                        <p className="text-red-500 text-sm">{errors.supplier_id}</p>
                                    )}
                                </div>

                                {/* Import Details */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">Import Details</h3>
                                        <Button
                                            type="button"
                                            onClick={addProduct}
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" /> Add Product
                                        </Button>
                                    </div>

                                    {selectedProducts.length === 0 ? (
                                        <div className="border rounded-lg p-6 text-center text-gray-400">
                                            No products added yet.
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 px-4 py-2 grid grid-cols-5 gap-4 text-sm font-semibold">
                                                <div>Product</div>
                                                <div>Qty</div>
                                                <div>Price</div>
                                                <div>Amount</div>
                                                <div></div>
                                            </div>

                                            {selectedProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="px-4 py-3 grid grid-cols-5 gap-4 border-t items-center"
                                                >
                                                    <select
                                                        value={product.product_id || ""}
                                                        onChange={(e) => {
                                                            const selectedId = e.target.value;
                                                            const selectedProduct = Array.isArray(products) ?
                                                                products.find(p => p.id === parseInt(selectedId)) : null;

                                                            // Update the product_id field (not the temporary id)
                                                            updateProduct(
                                                                product.id, // temporary UI id
                                                                "product_id", // actual product id field
                                                                selectedId
                                                            );

                                                            if (selectedProduct) {
                                                                // Use the price field from your controller
                                                                updateProduct(
                                                                    product.id,
                                                                    "price",
                                                                    parseFloat(selectedProduct.price) || 0
                                                                );
                                                            }
                                                        }}
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                    >
                                                        <option value="">Select Product</option>
                                                        {Array.isArray(products) && products.length > 0 ? (
                                                            products.map((p) => (
                                                                <option key={p.id} value={p.id}>
                                                                    {p.name} (${parseFloat(p.price || 0).toFixed(2)})
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option value="no-products" disabled>No products available</option>
                                                        )}
                                                    </select>

                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={product.quantity}
                                                        onChange={(e) =>
                                                            updateProduct(
                                                                product.id,
                                                                "quantity",
                                                                parseInt(e.target.value) || 0
                                                            )
                                                        }
                                                        className="text-center"
                                                    />

                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={product.price}
                                                        onChange={(e) =>
                                                            updateProduct(
                                                                product.id,
                                                                "price",
                                                                parseFloat(e.target.value) || 0
                                                            )
                                                        }
                                                        className="text-center"
                                                    />

                                                    <div className="text-sm text-center">
                                                        ${((parseFloat(product.quantity) || 0) * (parseFloat(product.price) || 0)).toFixed(2)}
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => removeProduct(product.id)}
                                                        className="text-red-500 hover:text-red-700 justify-center"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {errors.import_details && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.import_details}
                                        </p>
                                    )}
                                </div>

                                {/* Total and Submit */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="font-semibold text-lg">Total:</span>
                                    <span className="text-lg font-bold">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        selectedProducts.length === 0 ||
                                        !formData.staff_id ||
                                        !formData.supplier_id
                                    }
                                    className="w-full"
                                >
                                    {processing ? "Submitting..." : "Record Import"}
                                </Button>
                            </form>

                        </div>

                        {/* Recent Imports */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold">Recent Imports</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {recentImports?.length > 0 ? (
                                    recentImports.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center border p-4 rounded hover:bg-gray-50"
                                        >
                                            <div>
                                                <div className="font-semibold">
                                                    Import {item.import_number}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.supplier} • {item.import_date} •{" "}
                                                    {item.items_count} items
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="font-semibold">
                                                    ${parseFloat(item.total).toFixed(2)}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.get(`/imports/${item.id}`)
                                                    }
                                                    className="text-gray-500 hover:text-blue-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No recent imports found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
