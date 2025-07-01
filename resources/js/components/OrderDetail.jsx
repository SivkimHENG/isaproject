
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Search, Plus, Minus, X } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ShoppingCart } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "./ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import ProductSearch from "./ProductSearch";

export default function OrderDetail() {
    const { customers, staff, flash, products, filters } = usePage().props;

    const [customerId, setCustomerId] = useState("");
    const [staffId, setStaffId] = useState("");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleAddProduct(product) {
        const existingProduct = selectedProducts.find(p => p.id === product.id);

        if (existingProduct) {
            setSelectedProducts(prev =>
                prev.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            );
        } else {
            setSelectedProducts(prev => [...prev, {
                ...product,
                quantity: 1,
                sale_unit_price: product.sale_unit_price || product.sale_price
            }]);
        }
    }

    function updateProductQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            setSelectedProducts(prev => prev.filter(p => p.id !== productId));
        } else {
            setSelectedProducts(prev =>
                prev.map(p =>
                    p.id === productId
                        ? { ...p, quantity: newQuantity }
                        : p
                )
            );
        }
    }

    function removeProduct(productId) {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    }

    function calculateTotal() {
        return selectedProducts.reduce((total, product) => {
            return total + (product.sale_unit_price * product.quantity);
        }, 0).toFixed(2);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!customerId || !staffId || selectedProducts.length === 0) {
            alert("Please fill all required fields and add at least one product");
            return;
        }

        setLoading(true);

        const formData = {
            customer_id: customerId,
            staff_id: staffId,
            order_date: orderDate,
            products: selectedProducts.map(p => ({
                id: p.id,
                quantity: p.quantity
            }))
        };

        router.post(route('order.store'), formData, {
            onSuccess: () => {
                setSelectedProducts([]);
                setCustomerId("");
                setStaffId("");
                setOrderDate(new Date().toISOString().split("T")[0]);
                setLoading(false);
            },
            onError: (errors) => {
                console.error("Form errors:", errors);
                setLoading(false);
            }
        });
    }

    return (
        <>
            {flash?.success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {flash.error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart />
                        Create New Order
                    </CardTitle>
                    <CardDescription>
                        Add customer information and select products to create a new order
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer">Customer *</Label>
                                <Select
                                    value={customerId}
                                    onValueChange={setCustomerId}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers && customers.length > 0 ? (
                                            customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                No customers available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="staff">Staff Member *</Label>
                                <Select
                                    value={staffId}
                                    onValueChange={setStaffId}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staff && staff.length > 0 ? (
                                            staff.map((member) => (
                                                <SelectItem key={member.id} value={member.id.toString()}>
                                                    {member.id} - {member.fullname} - {member.position}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="" disabled>
                                                No staff members available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order-date">Order Date *</Label>
                                <Input
                                    id="order-date"
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Use ProductSearch with callback and correct route */}
                        <ProductSearch
                            onProductSelect={handleAddProduct}
                            showSelectedProducts={false}
                        />

                        {/* Selected Products Table */}
                        {selectedProducts.length > 0 && (
                            <div className="space-y-2">
                                <Label>Selected Products</Label>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Total</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedProducts.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            <div>{product.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                ID: {product.product_id || product.id}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        ${product.sale_unit_price.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-10 text-center">
                                                                {product.quantity}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        ${(product.sale_unit_price * product.quantity).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => removeProduct(product.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {/* Total and Submit */}
                        <div className="flex justify-between items-center pt-4">
                            <div className="text-lg font-semibold">
                                Total: ${calculateTotal()}
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || selectedProducts.length === 0}
                            >
                                {loading ? "Processing..." : "Create Order"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
