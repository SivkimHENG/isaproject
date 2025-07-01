<?php

namespace App\Actions;

use App\Models\Staff;

class UpdateStaffAction
{

    public function execute(int $id, array $data): Staff
    {

        $staff = Staff::findOrFail($id);

        $staffData = [
            'fullname' => $data['fullname'],
            'gender' => $data['gender'],
            'date_of_birth' => $data['date_of_birth'],
            'position' => $data['position'],
            'salary' => $data['salary'],
            'stopwork' => $data['stopwork'] ?? false,

        ];

        $staff->update($staffData);

        return $staff->fresh();

    }
}
