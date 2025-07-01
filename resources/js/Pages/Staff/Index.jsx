


import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Switch } from "@/components/ui/switch"
import { useForm, router, usePage } from "@inertiajs/react";
import { Users, Search, Edit, Trash2 } from "lucide-react";

export default function Index({ staff = [], stats = {}, filters = {} }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [deletingId, setDeletingId] = useState(null);
    const [localStaff, setLocalStaff] = useState(staff);

    // Update local staff when props change (after successful operations)
    useEffect(() => {
        setLocalStaff(staff);
    }, [staff]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        fullname: '',
        gender: '',
        date_of_birth: '',
        position: '',
        salary: '',
        stopwork: false,
    });

    // Calculate stats from local staff data
    const totalStaff = localStaff.length;
    const activeStaff = localStaff.filter(s => !s.stopwork).length;
    const inactiveStaff = localStaff.filter(s => s.stopwork).length;

    // Filter staff based on search term
    const filteredStaff = localStaff.filter(staffMember =>
        staffMember.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.id.toString().includes(searchTerm)
    );

    function handleSubmit(e) {
        e.preventDefault();

        if (editingStaff) {
            put(route('staff.update', editingStaff.id), {
                preserveState: false, // Refresh the data from server
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingStaff(null);
                    reset();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            post(route('staff.store'), {
                preserveState: false, // Refresh the data from server
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                }
            });
        }
    }

    function handleEdit(staffMember) {
        setEditingStaff(staffMember);
        setData({
            fullname: staffMember.fullname,
            gender: staffMember.gender,
            date_of_birth: staffMember.date_of_birth,
            position: staffMember.position,
            salary: staffMember.salary.toString(),
            stopwork: staffMember.stopwork || false,
        });
        setIsOpen(true);
    }

    function handleDelete(id) {
        console.log("Delete staff ID:", id);
        if (confirm('Are you sure you want to delete this staff member?')) {
            setDeletingId(id);

            // Use router.delete for DELETE requests
            router.delete(route('staff.destroy', id), {
                preserveState: false, // This will refresh the page data
                preserveScroll: true, // Keep scroll position
                onSuccess: () => {
                    console.log('Staff member deleted successfully');
                    setDeletingId(null);
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                    setDeletingId(null);
                    alert('Failed to delete staff member. Please try again.');
                },
                onFinish: () => {
                    setDeletingId(null);
                }
            });
        }
    }

    function handleOpenChange(open) {
        setIsOpen(open);
        if (!open) {
            setEditingStaff(null);
            reset();
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>Add Staff</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                            </DialogTitle>
                            <DialogDescription>
                                Enter the details for the {editingStaff ? 'staff member' : 'new staff member'}.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    id="fullname"
                                    placeholder="Enter full name..."
                                    value={data.fullname}
                                    onChange={(e) => setData('fullname', e.target.value)}
                                    className={errors.fullname ? 'border-red-500' : ''}
                                />
                                {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                            </div>

                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Male</SelectItem>
                                        <SelectItem value="F">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>

                            <div>
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className={errors.date_of_birth ? 'border-red-500' : ''}
                                />
                                {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                            </div>

                            <div>
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    placeholder="Enter position..."
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className={errors.position ? 'border-red-500' : ''}
                                />
                                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                            </div>

                            <div>
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    placeholder="Enter salary..."
                                    value={data.salary}
                                    onChange={(e) => setData('salary', e.target.value)}
                                    className={errors.salary ? 'border-red-500' : ''}
                                />
                                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="stopwork"
                                    checked={data.stopwork}
                                    onCheckedChange={(checked) => setData('stopwork', checked)}
                                />
                                <Label htmlFor="stopwork">No Longer Working</Label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : (editingStaff ? 'Update' : 'Create')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff}</div>
                        <p className="text-xs text-muted-foreground">All registered staff members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                        <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStaff}</div>
                        <p className="text-xs text-muted-foreground">Currently working staff</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Staff</CardTitle>
                        <Users className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveStaff}</div>
                        <p className="text-xs text-muted-foreground">No longer working</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Staff Directory</CardTitle>
                    <CardDescription>A list of all staff members in your organization</CardDescription>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, position, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="min-w-full divide-y divide-gray-200">
                            <div className="bg-gray-50">
                                <div className="grid grid-cols-8 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div>ID</div>
                                    <div>Full Name</div>
                                    <div>Gender</div>
                                    <div>Date of Birth</div>
                                    <div>Position</div>
                                    <div>Salary</div>
                                    <div>Status</div>
                                    <div className="text-right">Actions</div>
                                </div>
                            </div>
                            <div className="bg-white divide-y divide-gray-200">
                                {filteredStaff.length === 0 ? (
                                    <div className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm ? 'No staff members found matching your search.' : 'No staff members found. Click "Add Staff" to get started.'}
                                    </div>
                                ) : (
                                    filteredStaff.map((staffMember) => (
                                        <div key={`staff-${staffMember.id}`} className="grid grid-cols-8 gap-4 px-6 py-4 whitespace-nowrap text-sm hover:bg-gray-50">
                                            <div className="font-medium text-gray-900">{staffMember.id}</div>
                                            <div className="text-gray-900">{staffMember.fullname}</div>
                                            <div className="text-gray-900 capitalize">{staffMember.gender === 'M' ? 'Male' : 'Female'}</div>
                                            <div className="text-gray-900">{new Date(staffMember.date_of_birth).toLocaleDateString()}</div>
                                            <div className="text-gray-900">{staffMember.position}</div>
                                            <div className="text-gray-900">${staffMember.salary?.toLocaleString()}</div>
                                            <div>
                                                <Badge variant={staffMember.stopwork ? "destructive" : "default"}>
                                                    {staffMember.stopwork ? "Inactive" : "Active"}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(staffMember)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(staffMember.id)}
                                                        disabled={deletingId === staffMember.id}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        {deletingId === staffMember.id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
