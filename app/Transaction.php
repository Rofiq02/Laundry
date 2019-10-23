<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];
    protected $appends = ['status_label'];

    public function detail()
    {
        //transaksi ke detail menggunakan relasi one to many
        return $this->hasMany(DetailTransaction::class);
    }

    public function customer()
    {
        //transaksi9 ke customer menggunakan reflek data terkait menggunakan belongsto
        return $this->belongsTo(Customer::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    //accesor untuk custom field status yg akan ditampilkan di append ke json
    public function getStatusLabelAttribute()
    {
        if($this->status == 1){
            return '<span class="label label-success">Selesai</span>';
        }

        //selain itu menampilkan label primary
        return '<span class="label label-primary">Proses</span>';
    }

    //relasi antara user dengan transaction
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
