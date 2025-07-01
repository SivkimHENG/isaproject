<?php


namespace App\Actions;
use App\Models\Staff;
use Illuminate\Http\Request;

class CreateStaffAction {

    public function execute(array $data ) : Staff
    {
        $staffData = [
            'fullname' => $data['fullname'],
            'gender' => $data['gender'],
            'date_of_birth' => $data['date_of_birth'],
            'position' => $data['position'],
            'salary' => $data['salary'],
            'stopwork' => $data['stopwork'] ?? false

        ];

        return Staff::create($staffData);

    }
}

