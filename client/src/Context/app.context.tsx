import { createContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Camera } from 'src/types/camera.type'
import { User } from 'src/types/user.type'
import { LocalStorage } from 'src/utils/localStorage'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isConnected: boolean
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  fps: number
  setFps: React.Dispatch<React.SetStateAction<number>>
  isShowModalCamera: boolean
  setIsShowModalCamera: React.Dispatch<React.SetStateAction<boolean>>
  isShowModalConFirmDelete: boolean
  setIsShowModalConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>
  currentCameraPick: Camera | null
  setCurrentCameraPick: React.Dispatch<React.SetStateAction<Camera | null>>
  actionCamera: 'EDIT' | 'ADD' | 'DELETE' | 'ADVANCE' | null
  setActionCamera: React.Dispatch<React.SetStateAction<'EDIT' | 'ADD' | 'DELETE' | 'ADVANCE' | null>>
  socket: Socket | null
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
  currentIdCam: string | null
  setCurrentIdCam: React.Dispatch<React.SetStateAction<string | null>>
  currentAvatar: File | null
  setCurrentAvatar: React.Dispatch<React.SetStateAction<File | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(LocalStorage.getItemStorage('access_token')),
  setIsAuthenticated: () => null,
  isConnected: false,
  setIsConnected: () => null,
  profile: JSON.parse(LocalStorage.getItemStorage('profile') as string),
  setProfile: () => null,
  fps: 0,
  setFps: () => null,
  isShowModalCamera: false,
  setIsShowModalCamera: () => null,
  isShowModalConFirmDelete: false,
  setIsShowModalConfirmDelete: () => null,
  currentCameraPick: null,
  setCurrentCameraPick: () => null,
  actionCamera: null,
  setActionCamera: () => null,
  socket: null,
  setSocket: () => null,
  currentIdCam: null,
  setCurrentIdCam: () => null,
  currentAvatar: null,
  setCurrentAvatar: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [isConnected, setIsConnected] = useState<boolean>(initialAppContext.isConnected)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [fps, setFps] = useState<number>(initialAppContext.fps)
  const [isShowModalCamera, setIsShowModalCamera] = useState<boolean>(initialAppContext.isShowModalCamera)
  const [isShowModalConFirmDelete, setIsShowModalConfirmDelete] = useState<boolean>(
    initialAppContext.isShowModalConFirmDelete
  )
  const [currentCameraPick, setCurrentCameraPick] = useState(initialAppContext.currentCameraPick)
  const [actionCamera, setActionCamera] = useState(initialAppContext.actionCamera)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentIdCam, setCurrentIdCam] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<File | null>(null)
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isConnected,
        setIsConnected,
        profile,
        setProfile,
        fps,
        setFps,
        isShowModalCamera,
        setIsShowModalCamera,
        isShowModalConFirmDelete,
        setIsShowModalConfirmDelete,
        currentCameraPick,
        setCurrentCameraPick,
        actionCamera,
        setActionCamera,
        socket,
        setSocket,
        currentIdCam,
        setCurrentIdCam,
        currentAvatar,
        setCurrentAvatar
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
