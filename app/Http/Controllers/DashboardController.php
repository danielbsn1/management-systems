<?php

namespace App\Http\Controllers;

use App\Models\Equipamento;
use App\Models\Funcionario;
use App\Models\Emprestimo;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'totalEquipamentos' => Equipamento::count(),
            'disponiveis'       => Equipamento::where('status', 'disponivel')->count(),
            'emUso'             => Equipamento::where('status', 'em_uso')->count(),
            'manutencao'        => Equipamento::where('status', 'manutencao')->count(),
            'inativos'          => Equipamento::where('status', 'inativo')->count(),
            'funcionarios'      => Funcionario::count(),
            'porTipo'           => Equipamento::selectRaw('tipo, count(*) as total')
                                    ->groupBy('tipo')
                                    ->pluck('total', 'tipo'),
            'porUso'            => [
                'usados'     => Equipamento::whereIn('status', ['em_uso', 'manutencao', 'inativo'])->count(),
                'nao_usados' => Equipamento::where('status', 'disponivel')->count(),
            ],
            'porStatus'         => Equipamento::selectRaw('status, count(*) as total')
                                    ->groupBy('status')
                                    ->pluck('total', 'status'),
        ]);
    }
}