import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { TASK_STATUSES } from '../tasks'

const useTaskTimer = ({ status, timeSec, startedAt }) => {
  const [time, setTime] = useState(timeSec)

  const timerRef = useRef()

  useEffect(() => {
    if (status === TASK_STATUSES.RUNNING) {
      const startTime = DateTime.fromISO(startedAt)

      timerRef.current = setInterval(() => {
        setTime(timeSec + DateTime.now().diff(startTime).as('seconds'))
      }, 5000)
    }

    return () => timerRef.current && clearInterval(timerRef.current)
  }, [status])

  return time
}

export default useTaskTimer
