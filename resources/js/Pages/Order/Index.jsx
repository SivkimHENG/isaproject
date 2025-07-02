



import OrderDetail from "@/components/OrderDetail";
import { usePage } from "@inertiajs/react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

export default function Index() {
    const { orders, products, customers, staff, flash } = usePage().props;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 ">
                <h1 className="text-3xl font-bold text-gray-900">Business Management System</h1>
                <p className="text-gray-600 mt-2">Manage your sales orders and inventory</p>

                <Tabs defaultValue="orderDetails" className="w-full mt-5">
                    <TabsList>
                        <TabsTrigger className="px-6 py-3" value="orderDetails">
                            Order Details
                        </TabsTrigger>
                        <TabsTrigger className="px-6 py-3" value="payment">
                            Payment
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orderDetails">
                        <div>
                            <OrderDetail />

                            {/* Optional: Display existing orders */}
                            {orders && orders.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Order ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Customer
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Staff
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.slice(0, 5).map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{order.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.customer?.name || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {order.staff?.fullname || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(order.order_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ${parseFloat(order.total).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="payment">
                        <h1>Payment Tab</h1>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
