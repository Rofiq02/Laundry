<?php

namespace App\Http\Controllers\API;

use App\DetailTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Transaction;
use DB;
use Illuminate\Support\Carbon;

class TransactionControl extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
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

            $amount = 0;
            foreach($request->detail as $row){
                //data yg diterima hanyalah item laundry price yg sudah dipilih
                if(!is_null($row['laundry_price'])){
                    //melaukan perhitungan untuk menentukan subtotal
                    $subtotal = $row['laundry_price']['price'] * $row['qty'];
                    if($row['laundry_price']['unit_type'] == 'Kilogram'){
                        $subtotal = $row['laundry_price']['price'] * ($row['qty']) / 1000;
                    }

                    $start_date = Carbon::now();
                    $end_date = Carbon::now()->addHours($row['laundry_price']['service']);
                    if($row['laundry_price']['service_type'] == 'Hari'){
                        $end_date = Carbon::now()->addDays($row['laundry_price']['service']);
                    }

                    //menyimpan data detail transaksi
                    DetailTransaction::create([
                        'transaction_id' => $transaction->id,
                        'laundry_price_id' => $row['laundry_price']['id'],
                        'laundry_type_id' => $row['laundry_price']['laundry_type_id'],
                        'start_date' => $start_date->format('Y-m-d H:i:s'),
                        'end_date' => $end_date->format('Y-m-d H:i:s'),
                        'qty' => $row['qty'],
                        'price' => $row['laundry_price']['price'],
                        'subtotal' => $subtotal
                    ]);

                    $amount += $subtotal;
                }
            }
            $transaction->update(['amount' => $amount]);
            DB::commit();
            return response()->json(['status' => 'success']);

        }catch (\Exception $e){
            BD::rollback(); //jika terjadi error maka akan di rollback agar data yg berhasil disimpan dihapus
            return response()->json(['status' => 'error', 'data' => $e->getMessage()]);
        }
    }
}
