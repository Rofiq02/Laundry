<?php

namespace App\Http\Controllers\API;

use App\Exports\TransactionExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Transaction;
use DB;
use Excel;

class DashboardControl extends Controller
{
    public function chart()
    {
        $filter = request()->year . '-' . request()->month; //get data bulan dan tahun yg dikirim sebagai parameter

        $parse = Carbon::parse($filter);

        //buat range tanggal pada bulan terkait
        $array_date = range($parse->startOfMonth()->format('d'), $parse->endOfMonth()->format('d'));

        //get data transaksi berdeasarkan bulan dan tanggal yg diminta
        //dikelompokkan berdasarkan tanggalnya
        //sum data amount dan simpan ke nama baru yaitu total
        $transaction = Transaction::select(DB::raw('date(created_at) as date, sum(amount) as total'))
                                    ->where('created_at', 'LIKE', '%' . $filter . '%')
                                    ->groupBy(DB::raw('date(created_at)'))->get();

        $data = [];

        foreach($array_date as $row){
            $f_date = strlen($row) == 1 ? 0 . $row:$row;

            //buat format tanggal YYYY-MM-DD
            $date = $filter . '-' . $f_date;

            //mencari data berdasarkan date pada collection hasil query
            $total = $transaction->firstWhere('date', $date);

            //simpan datanya ke dalam variable data
            $data[] = [
                'date' => $date,
                'total' => $total ? $total->total:0
            ];
        }
        return $data;
    }

    public function exportData(Request $request)
    {
        //meminta data dari method chart diatas karena datanya sama
        $transaction = $this->chart();

        return Excel::download(new TransactionExport($transaction, request()->month, request()->year), 'transaction.xlsx');
    }
}
