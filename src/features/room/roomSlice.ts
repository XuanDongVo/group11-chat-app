import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RoomState } from '../../types/room';


const initialState: RoomState = {
  rooms: [],
  currentRoom: null,
  status: 'idle',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    createRoomRequest(state) {
      state.status = 'loading';
      state.error = undefined;
    },

    createRoomSuccess(state, action: PayloadAction<string>) {
      state.status = 'idle';
      state.rooms.push(action.payload);
      state.currentRoom = action.payload;
    },

    createRoomFail(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },

    joinRoom(state, action: PayloadAction<string>) {
      state.currentRoom = action.payload;
    },
  },
});

export const {
  createRoomRequest,
  createRoomSuccess,
  createRoomFail,
  joinRoom,
} = roomSlice.actions;

export default roomSlice.reducer;
