import { useEffect, useRef, useContext, useState } from 'react'
import { AppContext } from 'src/Context/app.context'
import { Socket } from 'socket.io-client'
import { toast } from 'react-toastify'
import image from '../../../../public/image/frame_6407.jpg'

type BoundingBox = {
  class: string
  confidence: number
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

interface Props {
  socket: Socket
}

function CardCamera({ socket }: Props) {
  const { setFps } = useContext(AppContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageData, setImageData] = useState<ArrayBuffer | null>(null)

  useEffect(() => {
    // Gửi tín hiệu từ client tới server
    socket.emit('signal', 'Hello from client')

    // Xử lý sự kiện nhận phản hồi ảnh real time từ server
    socket.on('response_data_image', (response) => {
      if (!response) return
      console.log('response', response)
      const imageData = response.data.pic
      setImageData(imageData)
    })

    // Xử lý sự kiện nhận fps từ server
    socket.on('response_fps', (fps) => {
      setFps(fps)
    })

    // Xử lý sự kiện nhận fps từ server
    socket.on('jpgstream_serverio', (data) => {
      console.log('>>>>>', data)
    })

    // Xử lý sự kiện khi mất kết nối với server
    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    // Hủy kết nối WebSocket khi component bị hủy
    return () => {
      socket.off('response_data_image')
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return

    const renderFrame = () => {
      if (imageData) {
        const imageDataArray = new Uint8Array(imageData)
        const imageBlob = new Blob([imageDataArray], { type: 'image/jpeg' })

        const image = new Image()
        image.onload = () => {
          context.clearRect(0, 0, canvas!.width, canvas!.height)
          context.drawImage(image, 0, 0, canvas!.width, canvas!.height)
        }
        image.src = URL.createObjectURL(imageBlob)
      }
    }

    renderFrame()

    return () => {
      URL.revokeObjectURL(canvas!.toDataURL())
    }
  }, [imageData])

  const handleChangeFps = (fptInput: '30' | '50') => {
    toast.warn('Thiết bị chưa hỗ trợ chức năng này.')
    // socket.emit('change_fps', fptInput)
  }
  return (
    <div className='relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-blueGray-700 shadow-lg'>
      <div className='mb-0 rounded-t bg-transparent px-4 pt-2'>
        <div className='flex flex-row flex-wrap items-center'>
          <div className='relative flex w-full max-w-full flex-1 flex-grow justify-between'>
            {/* Title */}
            <h6 className='my-2 text-xs font-semibold uppercase text-blueGray-100'>Kết nối camera</h6>
            {/* Button change fps */}
            <div className='flex items-center justify-center text-white'>
              <button
                className='bg-cam mr-2 rounded border border-gray-400 px-2 py-1 text-xs'
                onClick={() => handleChangeFps('30')}
              >
                30 FPS
              </button>
              <button
                className='rounded border border-gray-400 px-2 py-1 text-xs'
                onClick={() => handleChangeFps('50')}
              >
                50 FPS
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-auto p-4 pb-4'>
        {/* Camera */}
        <div className='relative flex items-center justify-center'>
          <img src={image} alt='' className='h-full w-full object-cover' />
          {/* <canvas ref={canvasRef} width={640} height={480} /> */}
        </div>
      </div>
    </div>
  )
}

export default CardCamera
