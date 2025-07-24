import React, { useState, useMemo, useEffect } from "react";
import { router, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";
import ManageLayout from "@/Layouts/ManageLayout";

export default function CustomerIndex({ customers, flash }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [flashMessage, setFlashMessage] = useState("");
    const [flashType, setFlashType] = useState("");

    // Form handling
    const addForm = useForm({
        name: "",
        contact: "",
    });

    const editForm = useForm({
        name: "",
        contact: "",
    });

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            setFlashMessage(flash.success);
            setFlashType("success");
            setTimeout(() => setFlashMessage(""), 5000);
        }
        if (flash?.error) {
            setFlashMessage(flash.error);
            setFlashType("error");
            setTimeout(() => setFlashMessage(""), 5000);
        }
    }, [flash]);

    // Filter customers based on search term
    const filteredCustomers = useMemo(() => {
        return customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (customer.contact && customer.contact.includes(searchTerm)),
        )
    }, [customers, searchTerm]);

    // Handle add customer
    const handleAddCustomer = () => {
        addForm.post(route('customer.store'), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                addForm.reset();
            },
            preserveScroll: true,
        });
    };

    // Handle edit customer
    const handleEditCustomer = () => {
        if (!editingCustomer) return;

        editForm.put(route('customer.update', editingCustomer.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setEditingCustomer(null);
                editForm.reset();
            },
            preserveScroll: true,
        });
    };

    // Handle delete customer
    const handleDeleteCustomer = (id) => {
        router.delete(route('customer.destroy', id), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteConfirm(false)
        });
    };

    // Open add dialog
    const openAddDialog = () => {
        addForm.reset();
        setIsAddDialogOpen(true);
    };

    // Open edit dialog
    const openEditDialog = (customer) => {
        setEditingCustomer(customer);
        editForm.setData({
            name: customer.name,
            contact: customer.contact || "",
        });
        setIsEditDialogOpen(true);
    };

    // Open delete confirmation
    const openDeleteConfirm = (customer) => {
        setCustomerToDelete(customer);
        setShowDeleteConfirm(true);
    };

    return (
        <ManageLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Flash Message */}
                {flashMessage && (
                    <div className={`p-4 rounded-md border ${flashType === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                        }`}>
                        <div className="flex justify-between items-center">
                            <span>{flashMessage}</span>
                            <button
                                onClick={() => setFlashMessage("")}
                                className="text-sm underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
                        <p className="text-muted-foreground">Manage your customer database</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>
                                    Enter the customer details below. Customer name is required.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="add-name">Customer Name *</Label>
                                    <Input
                                        id="add-name"
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        placeholder="Enter customer name"
                                        maxLength={100}
                                        className={addForm.errors.name ? "border-red-500" : ""}
                                    />
                                    {addForm.errors.name && (
                                        <p className="text-sm text-red-600">{addForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="add-contact">Contact Number</Label>
                                    <Input
                                        id="add-contact"
                                        value={addForm.data.contact}
                                        onChange={(e) => addForm.setData('contact', e.target.value)}
                                        placeholder="Enter contact number"
                                        maxLength={10}
                                        className={addForm.errors.contact ? "border-red-500" : ""}
                                    />
                                    {addForm.errors.contact && (
                                        <p className="text-sm text-red-600">{addForm.errors.contact}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    disabled={addForm.processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddCustomer}
                                    disabled={addForm.processing}
                                >
                                    {addForm.processing ? "Adding..." : "Add Customer"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredCustomers.length} shown after filtering
                        </p>
                    </CardContent>
                </Card>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {searchTerm && (
                        <Button variant="outline" onClick={() => setSearchTerm("")}>
                            Clear
                        </Button>
                    )}
                </div>

                {/* Customer Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>A list of all customers in your database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-[100px]">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                                Contact
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCustomers.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-8 text-center text-gray-500"
                                                >
                                                    {searchTerm
                                                        ? "No customers found matching your search."
                                                        : "No customers found."
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCustomers.map((customer) => (
                                                <tr key={customer.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {customer.id}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {customer.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {customer.contact || "—"}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditDialog(customer)}
                                                                disabled={editForm.processing}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openDeleteConfirm(customer)}
                                                                disabled={editForm.processing}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Customer</DialogTitle>
                            <DialogDescription>
                                Update the customer details below. Customer name is required.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Customer Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    placeholder="Enter customer name"
                                    maxLength={100}
                                    className={editForm.errors.name ? "border-red-500" : ""}
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-600">{editForm.errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-contact">Contact Number</Label>
                                <Input
                                    id="edit-contact"
                                    value={editForm.data.contact}
                                    onChange={(e) => editForm.setData('contact', e.target.value)}
                                    placeholder="Enter contact number"
                                    maxLength={10}
                                    className={editForm.errors.contact ? "border-red-500" : ""}
                                />
                                {editForm.errors.contact && (
                                    <p className="text-sm text-red-600">{editForm.errors.contact}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={editForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEditCustomer}
                                disabled={editForm.processing}
                            >
                                {editForm.processing ? "Updating..." : "Update Customer"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
                            <p className="text-gray-600 mb-4">
                                This action cannot be undone. This will permanently delete the customer "
                                {customerToDelete?.name}" from the database.
                            </p>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleDeleteCustomer(customerToDelete.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ManageLayout>
    );
}
