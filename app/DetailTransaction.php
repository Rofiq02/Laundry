<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetailTransaction extends Model
{
    protected $guarded = [];
    protected $dates = ['start_date', 'end_date'];
    protected $appends = ['service_time','status_label']; //AGAR ATTRIBUTE BARU TERSEBUT MUNCUL DI DALAM JSON, MAKA APPEND NAMA ATTRIBUTENYA. Contoh: ServiceTime menjadi service_time. kata GET dan ATTRIBUTE dibuang

    public function getServiceTimeAttribute()
    {
        return $this->start_date->format('d-m-Y H:i:s') . ' s/d ' . $this->end_date->format('d-m-Y H:i:s');
    }

    //atribute untuk label status
    public function getStatusLabelAttribute()
    {
        if($this->status == 1){
            return '<span class="label label-success">Selesai</span>';
        }
        return '<span class="label label-primary">Proses</span>';
    }

    //relasi ke table transactions
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    //relasi ke laundry price
    public function product()
    {
        return $this->belongsTo(LaundryPrice::class, 'laundry_price_id');
    }
}
