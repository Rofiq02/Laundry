<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Abdul Rofiq',
            'email' => 'a@gmail.com',
            'email_verified_at' => now(),
            'password' => 'rafiq123',
            'role' => 0
        ]);
    }
}
