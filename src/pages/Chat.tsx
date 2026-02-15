import NoData from "@/components/NoData";
import { MessageCircle } from "lucide-react";

const Chat = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <NoData
        title="Chat Coming Soon"
        description="We are working hard to bring you real-time chat so you can connect with your friends!"
        icon={MessageCircle}
      />
    </div>
  );
};

export default Chat;
