<?php

namespace Database\Seeders;

use App\Models\Emprestimo;
use App\Models\Equipamento;
use App\Models\Funcionario;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Administrador',
                'password' => bcrypt('admin123'),
                'role'     => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'colaborador@colaborador.com'],
            [
                'name'     => 'Colaborador',
                'password' => bcrypt('password'),
                'role'     => 'user',
            ]
        );

        Funcionario::factory(20)->create();
        Equipamento::factory(20)->create();

        Emprestimo::factory(10)->devolvido()->create();
        Emprestimo::factory(5)->create();

        Solicitacao::factory(10)->create();
    }
}