<?php

namespace App\Http\Controllers;

use App\Actions\AvaliarSolicitacaoAction;
use App\Http\Requests\AvaliarSolicitacaoRequest;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Resources\SolicitacaoResource;
use App\Notifications\NovaSolicitacaoNotification;
use App\Models\Solicitacao;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SolicitacaoController extends Controller
{
    public function index()
    {
        if (Auth::user()?->role === 'admin') {
            return redirect()->route('solicitacoes.admin');
        }

        $solicitacoes = Solicitacao::where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Solicitacoes/Index', [
            'solicitacoes' => SolicitacaoResource::collection($solicitacoes)->resolve(),
        ]);
    }

    public function adminIndex()
    {
        $solicitacoes = Solicitacao::with('user')
            ->latest()
            ->get();

        return Inertia::render('Solicitacoes/Admin', [
            'solicitacoes' => SolicitacaoResource::collection($solicitacoes)->resolve(),
        ]);
    }

    public function store(StoreSolicitacaoRequest $request)
    {
        $solicitacao = Solicitacao::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->notify(new NovaSolicitacaoNotification($solicitacao));

        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $admins */
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NovaSolicitacaoNotification($solicitacao, true));

        return back()->with('success', 'Solicitação enviada com sucesso!');
    }

    public function avaliar(AvaliarSolicitacaoRequest $request, Solicitacao $solicitacao)
    {
        app(AvaliarSolicitacaoAction::class)->execute($solicitacao, $request->status);

        return back()->with('success', 'Solicitação ' . $request->status . ' com sucesso!');
    }
}
