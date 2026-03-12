const HELP_ITEMS = [
  {
    title: 'Timer da partida',
    description:
      'É o relógio principal do app. Você pode iniciar, pausar, resetar e ajustar o tempo manualmente.',
  },
  {
    title: 'Sincronização manual',
    description:
      'Use o campo mm:ss para alinhar o app com o tempo real da partida quando entrar no jogo já em andamento.',
  },
  {
    title: 'Rota',
    description:
      'A rota sugerida altera automaticamente a prioridade de alguns objetivos. Você ainda pode sobrescrever manualmente.',
  },
  {
    title: 'Filtros',
    description:
      'Mostram apenas os tipos de eventos que você quer acompanhar: runas, objetivos, recursos, mapa ou economia.',
  },
  {
    title: 'Prioridade',
    description:
      'Cada evento pode ter prioridade baixa, média ou alta. Isso afeta a ordem visual dos próximos eventos e os marcadores do mini mapa.',
  },
  {
    title: 'Mini mapa',
    description:
      'Exibe os pontos importantes do mapa. Os objetivos mais urgentes podem ser destacados e pulsar visualmente.',
  },
  {
    title: 'Próximos eventos',
    description:
      'Lista as próximas ocorrências com base no tempo atual, categoria ativa e prioridades configuradas.',
  },
  {
    title: 'Log recente',
    description:
      'Mostra os eventos que já aconteceram conforme o tempo da partida avança.',
  },
]

export function HelpPanel() {
  return (
    <div className="help-panel">
      {HELP_ITEMS.map((item) => (
        <div key={item.title} className="help-item">
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}