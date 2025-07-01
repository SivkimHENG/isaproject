<?php

namespace App\Http\Controllers;

use App\Actions\CreateStaffAction;
use App\Actions\UpdateStaffAction;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Staff;
use Inertia\Inertia;

//FIXME : Fix the destroy
class StaffController extends Controller

{
    public function index()
    {

        $staff = Staff::all();

        return Inertia::render('Staff/Index', [
            'staff' => $staff, 'stats' => ['total' => $staff->count(),
            'active' => $staff->where('stopwork', false)->count(),
            'inactive' => $staff->where('stopwork', true)->count(),
        ], ]);

    }

    public function store(StoreStaffRequest $request, CreateStaffAction $action)
    {
        $staff = $action->execute($request->validated());

    }

    public function update(UpdateStaffRequest $request, $id, UpdateStaffAction $action)
    {
        $staff = $action->execute($id, $request->validated());
    }

    public function destroy($id)
    {
        try {
            $staff = Staff::findOrFail($id);
            $staff->delete();

            if (request()->wantsJson()) {
                return response()->json(['message' => 'Staff member deleted successfully']);
            }

            return redirect()->route('staff.index')->with('success', 'Staff member deleted successfully');
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['error' => 'Failed to delete staff member'], 500);
            }

            return redirect()->route('staff.index')->with('error', 'Failed to delete staff member');
        }
    }
}
