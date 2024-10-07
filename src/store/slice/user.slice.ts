import type { UserModel } from '~/models/user'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { setToken } from '~/utils/auth'
import { RESTManager } from '~/utils/rest'

let tokenIsUpstream = false

export const setTokenIsUpstream = (isUpstream: boolean) => {
  tokenIsUpstream = isUpstream
}

export const getTokenIsUpstream = () => {
  return tokenIsUpstream
}

interface UserState {
  user: UserModel | null
  token: string | null
}
const initialState: UserState = {
  user: null,
  token: null,
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const result = await RESTManager.api.master.get<UserModel>()
    return result
  } catch (error: any) {
    if (error.data?.message === '没有完成初始化！') {
      window.location.pathname = '/setup'
    }
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
    },
    updateToken(state, action) {
      if (action.payload.token) {
        setToken(action.payload.token)
      }
      state.token = action.payload.token
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const user = action.payload
      if (user) {
        state.user = user
      }
    })
  },
})
