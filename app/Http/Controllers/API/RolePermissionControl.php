<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RolePermissionControl extends Controller
{
    //untuk mengambil semua role yg tersedia
    public function getAllRole()
    {
        $roles = Role::all();
        return response()->json(['status' => 'success', 'data' => $roles]);
    }

    //mengambil permission yg tersedia
    public function getAllPermission()
    {
        $permission = Permission::all();
        return response()->json(['status' => 'success', 'data' => $permission]);
    }

    //mengambil permission yg dimiliki oleh role tertentu
    public function getRolePermission(Requet $request)
    {
        $hasPermission = DB::table('role_has_permissions')
            ->select('permissions.name')
            ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->where('role_id', $request->role_id)->get();
            return response()->json(['status' => 'success', 'data' => $hasPermission]);
    }

    public function setRolePermission(Request $request)
    {
        $this->validate($request, [
            'role_id' => 'required|exists:roles,id'
        ]);

        $role = Role::find($request->role_id);
        $role->syncPermissions($request->permissions);

        return response()->json(['status' => 'success']);
    }

    public function setRoleUser(Request $request)
    {
        $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'role' => 'required'
        ]);

        $user = User::find($request->user_id);
        $user->syncRoles([$request->role]);
        return respone()->json(['status' => 'success']);
    }
}
