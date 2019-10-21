<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationControl extends Controller
{
    public function index(){
        $user = request()->user();

        return response()->json(['status' => 'success', 'data' => $user->unreadNotifications]); //mengambil data yg belum di read
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $user->unreadNotifications()->where('id', $request->id)->update(['read_at' => now()]);

        return response()->json(['status' => 'success']);
    }
}
