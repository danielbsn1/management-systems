<?php

namespace App\Notifications;

use App\Models\Solicitacao;
use Illuminate\Notifications\Notification;

class NovoEquipamento extends Notification
{
    public function __construct( 
        public string $tipo,
        public int $importados,
        public int $erros,
        public ?string $caminhoErros = null,
    ){}
      public function via(object $notifiable): array
      {
           return ['Database'];
      }

      public function toDatabase(object $notifiable): array
      {
          return [
              'tipo' => $this->tipo,
              'importados' => $this->importados,
              'erros' => $this->erros,
              'caminho_erros' => $this->caminhoErros,
              'mensagem' => "Cadastro de {$this->tipo} concluído: {$this->importados} cadastrados, {$this->erros} com erro.",
          ];
      }
    
}