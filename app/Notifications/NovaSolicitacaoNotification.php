<?php

namespace App\Notifications;

use App\Models\Solicitacao;
use Illuminate\Notifications\Notification;

class NovaSolicitacaoNotification extends Notification
{
    public function __construct(
        public readonly Solicitacao $solicitacao,
        public readonly bool $paraAdmin = false,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $tipo = $this->solicitacao->tipo_equipamento ?? 'equipamento';

        return [
            'tipo' => 'solicitacao',
            'solicitacao_id' => $this->solicitacao->id,
            'status' => $this->solicitacao->status,
            'mensagem' => $this->paraAdmin
                ? "{$this->solicitacao->user->name} solicitou {$tipo}."
                : "Sua solicitação de {$tipo} foi enviada e aguarda avaliação.",
        ];
    }

    
}