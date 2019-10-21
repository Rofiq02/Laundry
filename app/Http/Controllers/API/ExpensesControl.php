<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ExpenseCollection;
use App\Notifications\ExpensesNotification;
use Illuminate\Support\Facades\Notification;
use App\Expense;
use App\User;

class ExpensesControl extends Controller
{
    public function index(){
        $user = request()->user(); //ambil data user yg sedang login
        $expenses = Expense::with(['user'])->orderBy('created_at','DESC');

        if(request()->q != ''){
            $expenses = $expenses->where('description', 'LIKE', '%' . request()->q . '%');
        }

        //jika role user yg sedang login 1 (admin) 3(kurir)  maka ambil data khusus tersebut
        if(in_array($user->role, [1,3])){
            $expenses = $expenses->where('user_id', $user->id);
        }
        return (new ExpenseCollection($expenses->paginate(10)));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required|integer',
            'note' => 'nullable|string'
        ]);


        $user = $request->user(); //get user yg sedang login
        //jika  user sedang login yg rolenya superadmin /finance maka secara otomatis di approve selain itu 0
        $status = $user->role == 0 || $user->role == 2 ? 1:0;
        $request->request->add([
            'user_id' => $user->id,
            'status' => $status
        ]);

        $expenses = Expense::create($request->all());

        //yg akan mendapatkan notifikasi superadmin dan finance
        $users = User::whereIn('role', [0,2])->get();
        Notification::send($users, new ExpensesNotification($expenses, $user));

        return response()->json(['status' => 'success']);
    }

    public function edit($id)
    {
        $expenses = Expense::with(['user'])->find($id);
        return response()->json(['status' => 'success', 'data' => $expenses]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required|integer',
            'note' => 'nullable|string'
        ]);
        $expenses = Expense::find($id);
        $expenses->update($request->except('id'));
        return response()->json(['status' => 'success']);

    }

    public function destroy($id)
    {
        $expenses = Expense::find($id);
        $expenses->delete();
        return response()->json(['status' => 'success']);
    }

    public function accept(Request $request)
    {
        $this->validate($request, ['id' => 'required|exists:expenses,id']);
        $expenses = Expense::with(['user'])->find($request->id);
        $expenses->update(['status' => 1]); //ubah statusnya jadi approve
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user));

        return response()->json(['status' => 'success']);
    }

    public function cancelRequest(Request $request)
    {
        $this->validate($request, ['id' => 'required|exists:expenses,id', 'reason' => 'required|string']);
        $expenses = Expense::with(['user'])->find($request->id);
        $expenses->update(['status' => 2, 'reason' => $request->reason]);
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user));

        return response()->json(['status' => 'success']);
    }
}
