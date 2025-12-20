import ChatLayout from "../components/layout/ChatLayout";
import Snowfall from "react-snowfall"; 
import Header from "../components/layout/Header";

function ChatPage() {
  return (
    <>
      <Header username="User" onLogout={() => {}} />
      <Snowfall color="#82C3D9" />
      <ChatLayout />
    </>
  );
}


export default ChatPage;