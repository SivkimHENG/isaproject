
import { useState, useEffect, useCallback } from "react";
import { Input } from "./ui/input";
import { Search, Plus, Minus, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProductSearch({
    onProductSelect = null,
    showSelectedProducts = true
}) {
    const { products, filters } = usePage().props;

    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [showResults, setShowResults] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);


    const debouncedSearch = useCallback(
        debounce((query) => {
            const targetRoute = route('order.index');
            router.get(
                targetRoute,
                { search: query },
                {
                    preserveState: true,
                    replace: true,
                    only: ['products', 'filters']
                }
            );
        }, 300),
        []
    );

    // Handle search input changes
    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            setShowResults(true);
            debouncedSearch(value);
        } else {
            setShowResults(false);
            debouncedSearch('');
        }
    }

    // Filter products based on search query for display
    const filteredProducts = products?.filter(product =>
        searchQuery && (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_id?.toString().includes(searchQuery)
        )
    ) || [];

    function handleAddProduct(product) {

        if (product.quantity <= 0) {
            alert(`Product "${product.name}" is out of stock!`);
            return;
        }


        // If onProductSelect callback is provided, use it instead of internal state
        if (onProductSelect) {
            onProductSelect(product);
            setSearchQuery("");
            setShowResults(false);
            return;
        }

        // Otherwise, use internal selected products state
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
            setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
        }

        setSearchQuery("");
        setShowResults(false);
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

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="product-search">Search Products</Label>
                <div className="relative search-container">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="product-search"
                        placeholder="Search by product name or ID..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                        onFocus={() => searchQuery && setShowResults(true)}
                    />

                    {showResults && searchQuery && (
                        <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto shadow-lg">
                            <CardContent className="p-2">
                                {filteredProducts.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                                                onClick={() => handleAddProduct(product)}
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID: {product.product_id || product.id} • ${product.sale_unit_price}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">
                                                        Stock: {product.stock || 0}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddProduct(product);
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No products found for "{searchQuery}"
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {showSelectedProducts && selectedProducts.length > 0 && (
                <div className="space-y-2 mt-6">
                    <Label>Selected Products</Label>
                    <Card className="border rounded-lg overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[40%]">Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        ID: {product.product_id || product.id}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>${product.sale_unit_price}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="min-w-[2ch] text-center font-medium">
                                                        {product.quantity}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${(product.sale_unit_price * product.quantity).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
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
                        </CardContent>
                        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                {selectedProducts.length} product(s) selected
                            </span>
                            <span className="font-semibold text-lg">
                                Total: ${calculateTotal()}
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    );
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
