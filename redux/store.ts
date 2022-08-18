import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './user.slice';

const rootReducer = combineReducers({
  user: userSlice
});

export type RootState = ReturnType<typeof store.getState>

const store = configureStore({
  reducer: rootReducer
})

export default store