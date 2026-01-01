import '../../../styles/UserList.css'
import type { UserListProps } from '../../../types/user';

export default function UserList({
  users,
  activeUser,
  onSelectUser,
}: UserListProps) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div
          key={user.name}
          className={`user-list__item ${activeUser === user.name ? "active" : ""
            }`}
          onClick={() => onSelectUser(user.name)}
        >
          <img
            src={user.avatar || "https://i.pravatar.cc/36"}
            alt={user.name}
          />
          <span className="user-list__name">{user.name}</span>
        </div>
      ))}
    </div>
  );
}
