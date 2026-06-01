<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        session_write_close();
        
        $stats = \App\Models\SystemStatistic::first();
        
        return response()->json([
            'total_students' => $stats ? $stats->total_students : 0,
            'active_courses' => $stats ? $stats->active_courses : 0,
            'total_enrollments' => $stats ? $stats->total_enrollments : 0,
            'total_revenue' => $stats ? $stats->total_revenue : 0,
            'certificates_issued' => 0 // Placeholder
        ]);
    }

    public function getLatestStudents()
    {
        session_write_close();
        
        $students = \Illuminate\Support\Facades\DB::table('users')
            ->where('role', 'student')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();
            
        return response()->json($students);
    }

    public function getLatestPayments()
    {
        session_write_close();
        
        $payments = \Illuminate\Support\Facades\DB::table('enrollments')
            ->join('users', 'enrollments.user_id', '=', 'users.id')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->select(
                'enrollments.id',
                'users.name as student',
                'courses.title as course',
                'enrollments.created_at as date'
            )
            ->orderByDesc('enrollments.created_at')
            ->limit(5)
            ->get();
            
        return response()->json($payments);
    }
}
