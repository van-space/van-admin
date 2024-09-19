import logger from 'redux-logger'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { isDev } from '~/constants/env'

import { userSlice } from './slice/user.slice'

const persistConfig = {
  key: 'root',
  storage,
}

// 合并多个reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const rootStore = configureStore({
  reducer: persistedReducer,
  // 可以添加自己的中间件,比如打印日志的
  middleware: (getDefaultMiddleware) => {
    const thunkMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
    if (isDev) {
      thunkMiddleware.concat(logger)
    }
    return thunkMiddleware
  },
  devTools: true,
})
export const persistor = persistStore(rootStore)
// 获取全部store数据类型
export type RootState = ReturnType<typeof rootStore.getState>
