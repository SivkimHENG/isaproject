
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, SearchIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useForm, router } from "@inertiajs/react";

export default function Index({ suppliers = [] }) {
    const [localSuppliers, setLocalSuppliers] = useState(suppliers);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Update local suppliers when props change
    useEffect(() => {
        setLocalSuppliers(suppliers);
    }, [suppliers]);

    // Form for adding new supplier
    const { data, setData, post, processing, errors, reset } = useForm({
        suppliers: '',
        address: '',
        contact: '',
    });

    // Form for editing supplier - Fixed to match backend validation
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        suppliers: '',
        address: '',
        contact: '',
    });

    const filteredSuppliers = useMemo(() => {
        if (!searchTerm) {
            return localSuppliers;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return localSuppliers.filter(
            (supplier) =>
                supplier.suppliers.toLowerCase().includes(lowerCaseSearchTerm) ||
                supplier.address.toLowerCase().includes(lowerCaseSearchTerm) ||
                (supplier.contact && supplier.contact.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [localSuppliers, searchTerm]);

    const handleAddSupplier = (e) => {
        e.preventDefault();

        post(route('supplier.store'), {
            preserveState: false,
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
            onError: (errors) => {
                console.error('Create errors:', errors);
            }
        });
    };

    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditData({
            suppliers: supplier.suppliers,
            address: supplier.address,
            contact: supplier.contact || '',
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSupplier = (e) => {
        e.preventDefault();

        put(route('supplier.update', selectedSupplier.id), {
            preserveState: false,
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedSupplier(null);
                resetEdit();
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
            }
        });
    };

    const handleDeleteSupplier = (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            setDeletingId(id);

            router.delete(route('supplier.destroy', id), {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Supplier deleted successfully');
                    setDeletingId(null);
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                    setDeletingId(null);
                    alert('Failed to delete supplier. Please try again.');
                },
                onFinish: () => {
                    setDeletingId(null);
                }
            });
        }
    };

    const handleAddModalChange = (open) => {
        setIsAddModalOpen(open);
        if (!open) {
            reset();
        }
    };

    const handleEditModalChange = (open) => {
        setIsEditModalOpen(open);
        if (!open) {
            setSelectedSupplier(null);
            resetEdit();
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">Supplier Management</CardTitle>
                    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalChange}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" /> Add New Supplier
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Supplier</DialogTitle>
                                <DialogDescription>Fill in the details below to add a new supplier to your list.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddSupplier} className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_name">Company Name</Label>
                                    <Input
                                        id="supplier_name"
                                        name="suppliers"
                                        placeholder="e.g., Tech Solutions Inc."
                                        value={data.suppliers}
                                        onChange={(e) => setData('suppliers', e.target.value)}
                                        className={errors.suppliers ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.suppliers && <p className="text-red-500 text-sm">{errors.suppliers}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_address">Company Address</Label>
                                    <Input
                                        id="supplier_address"
                                        name="address"
                                        placeholder="e.g., 123 Business Rd"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className={errors.address ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supplier_contact">Company Contact (Email/Phone)</Label>
                                    <Input
                                        id="supplier_contact"
                                        name="contact"
                                        placeholder="e.g., contact@techsolutions.com"
                                        value={data.contact}
                                        onChange={(e) => setData('contact', e.target.value)}
                                        className={errors.contact ? 'border-red-500' : ''}
                                    />
                                    {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => handleAddModalChange(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Adding...' : 'Add Supplier'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                            placeholder="Search suppliers..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell className="font-medium">{supplier.id}</TableCell>
                                            <TableCell>{supplier.suppliers}</TableCell>
                                            <TableCell>{supplier.address}</TableCell>
                                            <TableCell>{supplier.contact || "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditClick(supplier)}
                                                        aria-label="Edit supplier"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteSupplier(supplier.id)}
                                                        disabled={deletingId === supplier.id}
                                                        aria-label="Delete supplier"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        {deletingId === supplier.id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                                        ) : (
                                                            <Trash2Icon className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                            {searchTerm ? 'No suppliers found matching your search.' : 'No suppliers found. Click "Add New Supplier" to get started.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Supplier Modal */}
            {selectedSupplier && (
                <Dialog open={isEditModalOpen} onOpenChange={handleEditModalChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Supplier</DialogTitle>
                            <DialogDescription>
                                Make changes to the supplier details here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateSupplier} className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit_supplier_name">Company Name</Label>
                                <Input
                                    id="edit_supplier_name"
                                    name="suppliers"
                                    value={editData.suppliers}
                                    onChange={(e) => setEditData('suppliers', e.target.value)}
                                    className={editErrors.suppliers ? 'border-red-500' : ''}
                                    required
                                />
                                {editErrors.suppliers && <p className="text-red-500 text-sm">{editErrors.suppliers}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_supplier_address">Company Address</Label>
                                <Input
                                    id="edit_supplier_address"
                                    name="address"
                                    value={editData.address}
                                    onChange={(e) => setEditData('address', e.target.value)}
                                    className={editErrors.address ? 'border-red-500' : ''}
                                    required
                                />
                                {editErrors.address && <p className="text-red-500 text-sm">{editErrors.address}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_supplier_contact">Company Contact (Email/Phone)</Label>
                                <Input
                                    id="edit_supplier_contact"
                                    name="contact"
                                    value={editData.contact}
                                    onChange={(e) => setEditData('contact', e.target.value)}
                                    className={editErrors.contact ? 'border-red-500' : ''}
                                />
                                {editErrors.contact && <p className="text-red-500 text-sm">{editErrors.contact}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => handleEditModalChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
