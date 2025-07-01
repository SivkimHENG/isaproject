import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign } from "lucide-react"

export default function Payment() {





    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Process Payment
                </CardTitle>
                <CardDescription>Record payment for pending orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Staff Member *</Label>
                        <Select
                            value={selectedStaff?.toString()}
                            onValueChange={(value) => setSelectedStaff(Number.parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                            <SelectContent>
                                {staff.map((member) => (
                                    <SelectItem key={member.staffID} value={member.staffID.toString()}>
                                        {member.fullName} - {member.position}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Order to Pay *</Label>
                    <Select value={selectedOrder?.toString()} onValueChange={(value) => setSelectedOrder(Number.parseInt(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select pending order" />
                        </SelectTrigger>
                        <SelectContent>
                        </SelectContent>
                    </Select>
                </div>


                <div className="space-y-2">
                    <Label>Payment Amount *</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {selectedOrderData && paymentAmount && (
                        <p className="text-sm text-muted-foreground">
                            {Number.parseFloat(paymentAmount) === selectedOrderData.totalAmount
                                ? "✓ Full payment"
                                : Number.parseFloat(paymentAmount) < selectedOrderData.totalAmount
                                    ? `Partial payment (${((Number.parseFloat(paymentAmount) / selectedOrderData.totalAmount) * 100).toFixed(1)}%)`
                                    : "⚠ Amount exceeds order total"}
                        </p>
                    )}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!selectedStaff || !selectedOrder || !paymentAmount || isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Processing..." : "Process Payment"}
                </Button>

                {message && (
                    <Alert variant={message.type === "error" ? "destructive" : "default"}>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}


}
