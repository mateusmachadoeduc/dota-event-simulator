import { useEffect, useState } from 'react'
import { formatTime } from '../utils/time'

type TimerPanelProps = {
  gameTime: number
  isRunning: boolean
  onToggleRunning: () => void
  onReset: () => void
  onAdjustTime: (amount: number) => void
  onSetTime: (seconds: number) => void
}

function parseTimeInput(value: string): number | null {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d+):([0-5]\d)$/)

  if (!match) return null

  const minutes = Number(match[1])
  const seconds = Number(match[2])

  return minutes * 60 + seconds
}

export function TimerPanel({
  gameTime,
  isRunning,
  onToggleRunning,
  onReset,
  onAdjustTime,
  onSetTime,
}: TimerPanelProps) {
  const [timeInput, setTimeInput] = useState(formatTime(gameTime))
  const [inputError, setInputError] = useState('')
  const [isEditingTime, setIsEditingTime] = useState(false)

  useEffect(() => {
    if (!isEditingTime) {
      setTimeInput(formatTime(gameTime))
    }
  }, [gameTime, isEditingTime])

  function handleApplyTime() {
    const parsed = parseTimeInput(timeInput)

    if (parsed === null) {
      setInputError('Use o formato mm:ss')
      return
    }

    setInputError('')
    setIsEditingTime(false)
    onSetTime(parsed)
  }

  function handleCancelEdit() {
    setInputError('')
    setIsEditingTime(false)
    setTimeInput(formatTime(gameTime))
  }

  function handleUseCurrentTime() {
    setInputError('')
    setIsEditingTime(false)
    setTimeInput(formatTime(gameTime))
  }

  return (
    <section className="card timer-card enhanced-timer-card">
      <div className="card-header">
        <div className="section-title-row">
          <h2>Tempo da partida</h2>
          <span className="section-caption">Painel principal</span>
        </div>

        <div className={`live-indicator ${isRunning ? 'running' : 'paused'}`}>
          {isRunning ? 'Rodando' : 'Pausado'}
        </div>
      </div>

      <div className="timer-display">{formatTime(gameTime)}</div>

      <div className="play-controls">
        <button
          className={`primary-button ${isRunning ? 'pause' : 'play'}`}
          onClick={onToggleRunning}
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>

        <button onClick={onReset}>Reset</button>
      </div>
      <div className="time-adjust-layout">
        <button onClick={() => onAdjustTime(-1)}>-1 s</button>
        <button onClick={() => onAdjustTime(1)}>+1 s</button>

        <button onClick={() => onAdjustTime(-10)}>-10 s</button>
        <button onClick={() => onAdjustTime(10)}>+10 s</button>

        <button onClick={() => onAdjustTime(-60)}>-1 min</button>
        <button onClick={() => onAdjustTime(60)}>+1 min</button>
      </div>

      <div className="sync-block compact-sync">
        <label htmlFor="time-sync-input" className="sync-label">
          Sincronização manual
        </label>

        <div className="sync-controls">
          <input
            id="time-sync-input"
            type="text"
            value={timeInput}
            onFocus={() => setIsEditingTime(true)}
            onChange={(e) => {
              setTimeInput(e.target.value)
              setIsEditingTime(true)
              if (inputError) setInputError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyTime()
              if (e.key === 'Escape') handleCancelEdit()
            }}
            placeholder="mm:ss"
            className="time-input"
          />

          <button onClick={handleApplyTime}>Aplicar</button>
          <button onClick={handleUseCurrentTime}>Atual</button>
          {isEditingTime && <button onClick={handleCancelEdit}>Cancelar</button>}
        </div>

        {inputError && <div className="input-error">{inputError}</div>}
      </div>
    </section>
  )
}