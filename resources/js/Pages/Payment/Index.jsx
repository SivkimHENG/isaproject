import { router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, DollarSign, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";



export default function Index() {
    const { orders, staff, payments, stats, flash, errors: pageErrors } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        pay_date: new Date().toISOString().split('T')[0],
        staff_id: '',
        order_id: '',
        amount: ''
    });

    const [remainingAmount, setRemainingAmount] = useState(0);
    const [isFetchingRemaining, setIsFetchingRemaining] = useState(false);


    useEffect(() => {
        if (data.order_id) {
            setIsFetchingRemaining(true);

            // Use axios instead of Inertia router
            axios.get(route('orders.remaining-amount', { order: data.order_id }))
                .then(response => {
                    setRemainingAmount(response.data.remaining_amount || 0);
                })
                .catch(() => {
                    setRemainingAmount(0);
                })
                .finally(() => {
                    setIsFetchingRemaining(false);
                });
        } else {
            setRemainingAmount(0);
        }
    }, [data.order_id]);



    const handleSubmit = e => {
        e.preventDefault();
        post(route('payment.store'), {
            onSuccess: () => {
                reset();
                setRemainingAmount(0);
            }
        });
    };

    const formatCurrency = amount =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);

    const formatDate = dateString =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    return (

        <>

            <div className="container mx-auto p-6">
                <div className="mb-6 ">
                    <h1 className="text-3xl font-bold text-gray-900">Business Management System</h1>
                    <p className="text-gray-600 mt-2">Manage your sales orders and inventory</p>
                </div>


                <div className="space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert className="border-green-200 bg-green-50">
                            <AlertCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}
                    {pageErrors?.error && (
                        <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                                {pageErrors.error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="text-2xl font-bold">{stats?.totalOrders?.toLocaleString()}</p>
                                        <p className="text-xs text-green-500">+{stats?.orderGrowth || 0}% from last month</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Package className="text-blue-600" size={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Pending Payments</p>
                                        <p className="text-2xl font-bold">{stats?.pendingPayments}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatCurrency(stats?.pendingAmount)}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <AlertCircle className="text-yellow-600" size={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Recent Imports</p>
                                        <p className="text-2xl font-bold">{stats?.recentImports}</p>
                                        <p className="text-xs text-gray-500">This week</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <Package className="text-purple-600" size={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Revenue</p>
                                        <p className="text-2xl font-bold">{formatCurrency(stats?.revenue)}</p>
                                        <p className="text-xs text-green-500">+{stats?.revenueGrowth || 0}% from last month</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <DollarSign className="text-green-600" size={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form & Payment History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Process Payment</CardTitle>
                                <CardDescription>Add a new payment for an order</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pay_date">Payment Date</Label>
                                        <Input
                                            id="pay_date"
                                            type="date"
                                            value={data.pay_date}
                                            onChange={e => setData('pay_date', e.target.value)}
                                        />
                                        {errors.pay_date && (
                                            <p className="text-sm text-red-500">{errors.pay_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="staff_id">Staff Member</Label>
                                        <Select
                                            value={data.staff_id}
                                            onValueChange={val => setData('staff_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select staff member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staff.map(s => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>
                                                        {s.fullname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.staff_id && (
                                            <p className="text-sm text-red-500">{errors.staff_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="order_id">Order</Label>
                                        <Select
                                            value={data.order_id}
                                            onValueChange={val => setData('order_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select pending order" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orders.map(o => (
                                                    <SelectItem key={o.id} value={o.id.toString()}>
                                                        Order {o.id} - {formatCurrency(o.total)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.order_id && (
                                            <p className="text-sm text-red-500">{errors.order_id}</p>
                                        )}

                                        {data.order_id && (
                                            <div className="p-3 bg-blue-50 rounded-md text-blue-900 text-sm">
                                                Remaining Amount: {isFetchingRemaining ?
                                                    "Loading..." :
                                                    formatCurrency(remainingAmount)
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Payment Amount</Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                max={remainingAmount || undefined}
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                placeholder="0.00"
                                                className="pl-8"
                                            />
                                        </div>
                                        {errors.amount && (
                                            <p className="text-sm text-red-500">{errors.amount}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing || !data.order_id || !data.staff_id || !data.amount}
                                        className="w-full"
                                    >
                                        {processing ? "Processing..." : "Process Payment"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Recent Payments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Payments</CardTitle>
                                <CardDescription>Latest payment transactions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {payments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No recent payments
                                    </p>
                                ) : (
                                    payments.map(p => {
                                        // Calculate payment status
                                        const isFullPayment = p.amount === p.order.total;
                                        const isPartialPayment = p.amount < p.order.total;
                                        const paidPercentage = Math.round((p.amount / p.order.total) * 100);

                                        return (
                                            <div key={p.id} className="border p-3 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">Payment #{p.id}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Order #{p.order_id} • {p.staff?.fullname}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{formatCurrency(p.amount)}</p>
                                                        <Badge
                                                            variant={isFullPayment ? "success" : "warning"}
                                                            className="mt-1"
                                                        >
                                                            {isFullPayment ? "Full Payment" : "Partial Payment"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>Order Total: {formatCurrency(p.order.total)}</span>
                                                        <span>{paidPercentage}% Paid</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${paidPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDate(p.pay_date)}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>



                    </div>
                </div>

            </div>
        </>

    );
}
