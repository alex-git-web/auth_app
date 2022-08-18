import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
type UserState = {
  isAuth: boolean,
  data: {
    userName: string | undefined,
    email: string | undefined,
    password: string | undefined
  }
}

// Define the initial state using that type
const initialState: UserState = {
  isAuth: true,
  data: {
    userName: 'Ivan',
    email: '',
    password: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<UserState>) => {
      state.isAuth = action.payload.isAuth;
      state.data = action.payload.data;
    },
  }
})

export const { setIsAuth } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user.isAuth

export default userSlice.reducer