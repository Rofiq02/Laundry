<?php

namespace App\Http\Controllers\API;

use App\DetailTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Transaction;
use DB;
use Illuminate\Support\Carbon;
use App\Payment;
use App\Http\Resources\TransactionCollection;

class TransactionControl extends Controller
{
    public function index()
    {
        $search = request()->q; //untuk menampung query pencarian
        $user = request()->user(); //get user yg sedang login

        //wherehas digunakan untuk mefilter nama customer yg dicari user
        //parameter pertama dari wherehas adalah nama relasi yg didefinisikan model
        $transaction = Transaction::with(['user','detail','customer'])->orderBy('created_at','DESC')
                        ->whereHas('customer', function($q) use($search){
                            $q->where('name','LIKE','%' . $search . '%');
                        });

        //jika filternya adalah 0 dan 1. dimana 0 = proses, 1 = selesai dan 2 = semua data
        if(in_array(request()->status,[0, 1])){
            //maka ambil data berdasarkan status tersebut
            $transaction = $transaction->where('status', request()->status);
        }

        //jika rolenya bukan superadmin
        if($user->role != 0){
            //maka user hanya akan mendapatkan transaksi miliknya saja
            $transaction = $transaction->where('user_id', $user->id);
        }
        $transaction = $transaction->paginate(10);
        return new TransactionCollection($transaction);
    }

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
            return response()->json(['status' => 'success', 'data' => $transaction]);

        }catch (\Exception $e){
            BD::rollback(); //jika terjadi error maka akan di rollback agar data yg berhasil disimpan dihapus
            return response()->json(['status' => 'error', 'data' => $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $transaction = Transaction::with(['customer','payment','detail','detail.product'])->find($id);
        return response()->json(['status' => 'success', 'data' => $transaction]);
    }

    public function completeItem(Request $request)
    {
        //validasi untuk mengecek idnya ada atau tidak
        $this->validate($request, [
            'id' => 'required|exists:detail_transactions,id'
        ]);

        $transaction = DetailTransaction::with(['transaction.customer'])->find($request->id);
        $transaction->update(['status' => 1]);
        $transaction->transaction->customer()->update(['point' => $transaction->transaction->customer->point + 1]);
        return response()->json(['status' => 'success']);
    }

    public function makePayment(Request $request)
    {
        //validasi request
        $this->validate($request, [
            'transaction_id' => 'required|exists:transactions,id',
            'amount' => 'required|integer'
        ]);

        DB::beginTransaction();
        try{
            //mencari transaksi berdasarkan id
            $transaction = Transaction::find($request->transaction_id);

            //set default kemabil = 0
            $customer_change = 0;

            //jika via deposit true
            if($request->via_deposit){
                //jika deposit customer kurang dari total tagihan
                if($transaction->customer->deposit < $request->amount){
                    return response()->json(['status' => 'error', 'data' => 'Deposit Kurang!']);
                }

                //selain itu maka perbarui deposit customer
                $transaction->customer()->update(['deposit' => $transaction->customer->deposit - $request->amount]);
                //jika value via deposit false(VIA CASH)
            }else{
                //maka di cek lagi jika ada kembaliannya
                if($request->customer_change){

                    $customer_change = $request->amount - $transaction->amount; // maka daptakan besaran kembalian

                    //menambhkan ke deposit customer
                    $transaction->customer()->update(['deposit' => $transaction->customer->deposit + $customer_change]);
                }
            }




            //menymbapan data
            Payment::create([
                'transaction_id' => $transaction->id,
                'amount' => $request->amount,
                'customer_change' => $customer_change,
                'type' => $request->via_deposit
            ]);

            //update status transaksi menjadi 1 yg artinya sudah dibayar
            $transaction->update(['status' => 1]);
            //jika tidak ada error commit perubahan
            DB::commit();
            return response()->json(['status' => 'success']);
        }catch (\Exception $e){
            return response()->json(['status' => 'failed', 'data' => $e->getMessage()]);
        }
    }
}
