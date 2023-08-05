import CardStats from 'src/components/Cards/CardStats'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'
import { path } from 'src/constants/paths'
interface Props {
  currentPath: string
}

export default function HeaderStats({ currentPath }: Props) {
  const handleShowCardStat = (currentPath: string) => {
    if (currentPath.indexOf(path.controls) !== -1) return true
    return false
  }

  const { fps } = useContext(AppContext)
  return (
    <>
      {/* Header */}
      <div className='relative bg-lightBlue-600 pb-32 pt-12 md:pt-28'>
        <div className='mx-auto w-full px-4 md:px-10'>
          <div>
            {/* Card stats */}
            {handleShowCardStat(currentPath) && (
              <div className='flex flex-wrap'>
                <div className='w-full px-4 lg:w-6/12 xl:w-3/12'>
                  <CardStats
                    statSubtitle='FPS'
                    statTitle={fps.toString()}
                    statPercent='3.48'
                    statPercentColor='text-emerald-500'
                    statDescription='Khung hình trên giây'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'
                        />
                      </svg>
                    }
                    statIconColor='bg-lightBlue-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-3/12'>
                  <CardStats
                    statSubtitle='Đám cháy'
                    statTitle='3'
                    statPercent='12'
                    statPercentColor='text-emerald-500'
                    statDescription='Số đám cháy phát hiện'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z'
                        />
                      </svg>
                    }
                    statIconColor='bg-red-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-3/12'>
                  <CardStats
                    statSubtitle='Khoảng cách'
                    statTitle='0'
                    statPercent='3.48'
                    statPercentColor='text-red-500'
                    statDescription='Khoảng cách đến đám cháy(m)'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
                        />
                      </svg>
                    }
                    statIconColor='bg-orange-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-3/12'>
                  <CardStats
                    statSubtitle='Máy bơm'
                    statTitle='Tắt'
                    statPercent='1.10'
                    statPercentColor='text-orange-500'
                    statDescription='Tình trạng máy bơm'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
                        />
                      </svg>
                    }
                    statIconColor='bg-pink-500'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
