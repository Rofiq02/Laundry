<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $guarded = [];
    protected $appends = ['type_label'];

    //membuat attribute baru
    public function getTypeLabelAttribute()
    {
        if($this->type == 0){
            return 'Cash';
        }
        return 'Deposit';
    }
}
