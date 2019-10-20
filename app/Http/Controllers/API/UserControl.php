<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\Http\Resources\UserCollection;
use DB, File;
use Spatie\Permission\Models\Permission;

class UserControl extends Controller
{
    public function index()
    {
        $users = User::with(['outlet'])->orderBy('created_at','DESC')->courier();
        if(request()->q != ''){
            $users = $users->where('name','LIKE','%' . request()->q . '%');
        }
        $users = $users->paginate(10);
        return new UserCollection($users);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|string',
            'outlet_id' => 'required|exists:outlets,id',
            'photo' => 'required|image'
        ]);

        DB::beginTransaction();
        try{
            $name = NULL;
            //apabila ada file yg dikirimkan
            if($request->hasFile('photo')){
                //maka file tersebut akan disimpan ke storage
                $file = $request->file('photo');
                $name = $request->email . '-' . time() . '.' .$file->getClientOriginalExtension();
                $file->storeAs('public/couriers',$name);
            }

            $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => $request->password,
                    'role' => $request->role,
                    'photo' => $name,
                    'outlet_id' => $request->outlet_id,
                    'role' => 3
            ]);
            $user->assignRole('courier');
            DB::commit();

            return response()->json(['status' => 'success'], 200);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['status' => 'error', 'data' => $e->getMessage()], 200);
        }
    }

    public function edit($id)
    {
        $user = User::find($id); //mengambil data berdasarkan id
        return response()->json(['status' => 'success', 'data' => $user], 200);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => 'required|string|max:150',
            'email' => 'required|email',
            'password' => 'nullable|min:6|string',
            'outlet_id' => 'required|exists:outlets,id',
            'photo' => 'nullable|image'
        ]);

        try{
            $user = User::find($id); //mengambil data yantg akan diubah
            //jika password tidak dkosongkan, maka password akan diperbarui
            $password = $request->password != '' ? bcrypt($request->password):$user->password;
            $filename = $user->photo;

            //jika ada file baru yg dikirimkan
            if($request->hasFile('photo')){
                //maka foto yang lama akan diganti
                $file = $request->file('photo');
                //dan file foto yg lama akan dihapus
                File::delete(storage_path('app/public/couriers/' . $filename));
                $filename = $request->email . '-' . time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/couriers', $filename);
            }

            //memperbarui data yang ada di database
            $user->update([
                'name' => $request->name,
                'password' => $password,
                'photo' => $filename,
                'outlet_id' => $request->outlet_id
            ]);

            return response()->json(['status' => 'success'], 200);
        }catch(\Exception $e){
            return response()->json(['status' => 'error', 'data' => $e->getMessage()], 200);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id); //mengambil data yg akan dihapus
        File::delete(storage_path('app/public/couriers/' . $user->photo)); //menghapus file foto
        $user->delete();
        return response()->json(['status' => 'success']);
    }

    public function userLists()
    {
        $user = User::where('role', '!=', 3)->get();
        return new UserCollection($user);
    }

    public function getUserLogin()
    {
        $user = request()->user();
        $permissions = [];
        foreach (Permission::all() as $permission){
            if(request()->user()->can($permission->name)){
                $permissions[] = $permission->name;
            }
        }
        $user['permission'] = $permissions;
        return response()->json(['status' => 'success', 'data' => $user]);
    }

}
