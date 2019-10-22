<?php

namespace App\Http\Controllers\API;

use App\DetailTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Transaction;
use DB;

class TransactionControl extends Controller
{
    public function store(Request $request)
    {
        $this->validasi($request, [
            'customer_id' => 'required',
            'detail' => 'required'
        ]);

        DB::beginTransaction();
        try{
            $user = $request->user(); //get user yg sedang login

            $transaction = Transaction::create([
                'customer_id' => $request->customer_id['id'],
                'user_id' => $user->id,
                'amount' => 0
            ]);

            foreach($request->detail as $row){
                //data yg diterima hanyalah item laundry price yg sudah dipilih
                if(!is_null($row['laundry_price'])){
                    //melaukan perhitungan untuk menentukan subtotal
                    $subtotal = $row['laundry_price']['price'] * $row['qty'];
                    if($row['laundry_price']['unit_type'] == 'Kilogram'){
                        $subtotal = $row['laundry_price']['price'] * ($row['qty'] / 100);
                    }

                    //menyimpan data detail transaksi
                    DetailTransaction::create([
                        'transaction_id' => $transaction->id,
                        'laundry_price_id' => $row['laundry_price']['id'],
                        'laundry_type_id' => $row['laundry_price']['laundry_type_id'],
                        'qty' => $row['qty'],
                        'price' => $row['laundry_price']['price'],
                        'subtotal' => $subtotal
                    ]);
                }
            }

            DB::commit();
            return response()->json(['status' => 'success']);

        }catch (\Exception $e){
            BD::rollback(); //jika terjadi error maka akan di rollback agar data yg berhasil disimpan dihapus
            return response()->json(['status' => 'error', 'data' => $e->getMessage()]);
        }
    }
}
