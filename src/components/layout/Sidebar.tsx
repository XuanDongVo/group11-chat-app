import SidebarItem from "../../features/chat/components/SidebarItem";

export default function Sidebar() {
  return (
    <aside className="chat-sidebar">
      <h3 className="chat-sidebar__title">Messages</h3>

      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=5"
        name="Trí Đức"
        lastMessage="alo alo"
        active
      />

      <SidebarItem
        avatar="https://i.pravatar.cc/40?img=8"
        name="Công Vinh"
        lastMessage="Nai xừ..."
      />
    </aside>
  );
}
