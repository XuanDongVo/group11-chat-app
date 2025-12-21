import { X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import {
  createRoomRequest,
} from '../../features/room/roomSlice';
import { wsService } from '../../services/websocket';
import '../../styles/CreateRoomModal.css';
import type  {CreateRoomModalProps} from '../../types/room';


export default function CreateRoomModal({ open, onClose }: CreateRoomModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.room);

  const [roomName, setRoomName] = useState('');

  if (!open) return null;

  const handleCreate = () => {
    if (!roomName.trim()) return;

    dispatch(createRoomRequest());

    wsService.send({
      action: 'onchat',
      data: {
        event: 'CREATE_ROOM',
        data: {
          name: roomName.trim(),
        },
      },
    });

    setRoomName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3>Tạo phòng mới</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <input
            placeholder="Nhập tên phòng..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            disabled={status === 'loading'}
          />

          {error && <p className="error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn primary"
            onClick={handleCreate}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Đang tạo...' : 'Tạo phòng'}
          </button>
        </div>
      </div>
    </div>
  );
}
