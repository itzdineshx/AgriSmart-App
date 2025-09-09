import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingChatbot() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-elegant bg-gradient-primary text-primary-foreground hover:scale-110 transition-all duration-300"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}