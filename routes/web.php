<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Controllers\EquipamentoController;
use App\Http\Controllers\EquipamentoImportacaoController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\FuncionarioImportacaoController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\SolicitacaoController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    // Rotas para usuários comuns
    Route::get('/solicitacoes', [SolicitacaoController::class, 'index'])->name('solicitacoes.index');
    Route::post('/solicitacoes', [SolicitacaoController::class, 'store'])->name('solicitacoes.store');

    Route::get('/notificacoes', [NotificationController::class, 'index'])->name('notificacoes.index');
    Route::post('/notificacoes/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notificacoes.read');
    Route::post('/notificacoes/read-all', [NotificationController::class, 'markAllAsRead'])->name('notificacoes.read-all');
    Route::get('/notificacoes/{notification}/erros', [NotificationController::class, 'downloadErros'])->name('notificacoes.erros');
});

Route::middleware(['auth', 'admin'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/solicitacoes/admin', [SolicitacaoController::class, 'adminIndex'])->name('solicitacoes.admin');
    Route::patch('/solicitacoes/{solicitacao}/avaliar', [SolicitacaoController::class, 'avaliar'])->name('solicitacoes.avaliar');

    Route::get('/equipamentos', [EquipamentoController::class, 'index'])
        ->name('equipamentos.index');

    Route::get('/equipamentos/create', [EquipamentoController::class, 'create'])
        ->name('equipamentos.create');

    Route::post('/equipamentos', [EquipamentoController::class, 'store'])
        ->name('equipamentos.store');

    Route::get('/equipamentos/{equipamento}', [EquipamentoController::class, 'show'])
        ->name('equipamentos.show');

    Route::get('/equipamentos/{equipamento}/edit', [EquipamentoController::class, 'edit'])
        ->name('equipamentos.edit');

    Route::put('/equipamentos/{equipamento}', [EquipamentoController::class, 'update'])
        ->name('equipamentos.update');

    Route::delete('/equipamentos/{equipamento}', [EquipamentoController::class, 'destroy'])
        ->name('equipamentos.destroy');

    Route::resource('usuarios', UserController::class)
    ->parameters(['usuarios' => 'user'])
    ->except('show');

    Route::get('/funcionarios', [FuncionarioController::class, 'index'])
        ->name('funcionarios.index');

    Route::get('/funcionarios/create', [FuncionarioController::class, 'create'])
        ->name('funcionarios.create');

    Route::post('/funcionarios', [FuncionarioController::class, 'store'])
        ->name('funcionarios.store');

    Route::get('/funcionarios/{funcionario}', [FuncionarioController::class, 'show'])
        ->name('funcionarios.show');

    Route::get('/funcionarios/{funcionario}/edit', [FuncionarioController::class, 'edit'])
        ->name('funcionarios.edit');

    Route::put('/funcionarios/{funcionario}', [FuncionarioController::class, 'update'])
        ->name('funcionarios.update');

    Route::patch('/funcionarios/{funcionario}/inativar', [FuncionarioController::class, 'inativar'])
        ->name('funcionarios.inativar');

    Route::delete('/funcionarios/{funcionario}', [FuncionarioController::class, 'destroy'])
        ->name('funcionarios.destroy');

    Route::get('/emprestimos', [EmprestimoController::class, 'index'])
        ->name('emprestimos.index');

    Route::get('/emprestimos/create', [EmprestimoController::class, 'create'])
        ->name('emprestimos.create');

    Route::post('/emprestimos', [EmprestimoController::class, 'store'])
        ->name('emprestimos.store');

    Route::get('/emprestimos/{emprestimo}', [EmprestimoController::class, 'show'])
        ->name('emprestimos.show');

    Route::get('/emprestimos/{emprestimo}/edit', [EmprestimoController::class, 'edit'])
        ->name('emprestimos.edit');

    Route::put('/emprestimos/{emprestimo}', [EmprestimoController::class, 'update'])
        ->name('emprestimos.update');

    Route::delete('/emprestimos/{emprestimo}', [EmprestimoController::class, 'destroy'])
        ->name('emprestimos.destroy');

    Route::patch('/emprestimos/{emprestimo}/devolver', [EmprestimoController::class, 'devolver'])
        ->name('emprestimos.devolver');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::post('/equipamentos/importar', [EquipamentoImportacaoController::class, 'import'])
        ->name('equipamentos.import');

    Route::get('/equipamentos/importar/template', [EquipamentoImportacaoController::class, 'template'])
        ->name('equipamentos.import.template');

    Route::post('/funcionarios/importar', [FuncionarioImportacaoController::class, 'import'])
        ->name('funcionarios.import');

    Route::get('/funcionarios/importar/template', [FuncionarioImportacaoController::class, 'template'])
        ->name('funcionarios.import.template');

    Route::get('/relatorios', [RelatorioController::class, 'index'])->name('relatorios.index');
    Route::get('/relatorios/equipamentos', [RelatorioController::class, 'equipamentos'])->name('relatorios.equipamentos');
    Route::get('/relatorios/equipamentos/pdf', [RelatorioController::class, 'equipamentosPdf'])->name('relatorios.equipamentos.pdf');
    Route::get('/relatorios/funcionarios', [RelatorioController::class, 'funcionarios'])->name('relatorios.funcionarios');
    Route::get('/relatorios/funcionarios/pdf', [RelatorioController::class, 'funcionariosPdf'])->name('relatorios.funcionarios.pdf');
    Route::get('/relatorios/emprestimos', [RelatorioController::class, 'emprestimos'])->name('relatorios.emprestimos');
    Route::get('/relatorios/emprestimos/pdf', [RelatorioController::class, 'emprestimosPdf'])->name('relatorios.emprestimos.pdf');
});

require __DIR__.'/auth.php';
