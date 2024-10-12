import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RESTManager } from '~/utils/rest'

interface AppState {
  app: AppInfo | null
}
const initialState: AppState = {
  app: null,
}

export const fetchApp = createAsyncThunk('app/fetchApp', async () => {
  const result = await RESTManager.api.get<AppInfo>()
  return result
})

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApp.fulfilled, (state, action) => {
      const app = action.payload
      if (app) {
        state.app = app
      }
    })
  },
})
