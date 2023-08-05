// import { io } from 'socket.io-client'
import CardCamera from 'src/components/Cards/CardCamera'
import CardControl from 'src/components/Cards/CardControl'
// import env from 'src/constants/env'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'

function Dashboard() {
  const { socket } = useContext(AppContext)

  return (
    <div className='flex flex-wrap'>
      {' '}
      <div className='mb-12 w-full px-4 xl:mb-0 xl:w-8/12'>{socket && <CardCamera socket={socket} />}</div>
      <div className='w-full px-4 xl:w-4/12'>{socket && <CardControl socket={socket} />}</div>
    </div>
  )
}

export default Dashboard
