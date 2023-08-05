import CardProfile from 'src/components/Cards/CardProfile'
import CardSetting from 'src/components/Cards/CardSetting/CardSetting'

function SettingPage() {
  return (
    <div className='flex flex-wrap'>
      <div className='w-full px-4 lg:w-8/12'>
        <CardSetting />
      </div>
      <div className='w-full px-4 lg:w-4/12'>
        <CardProfile />
      </div>
    </div>
  )
}

export default SettingPage
