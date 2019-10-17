<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontControl extends Controller
{
    public function index(){


        return view('index');
    }
}
