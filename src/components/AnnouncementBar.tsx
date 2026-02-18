import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  text?: string | null;
}

const AnnouncementBar = ({ text }: Props) => {
  const [visible, setVisible] = useState(true);
  if (!visible || !text) return null;

  return (
    <div className="bg-gradient-gold py-2 px-4 text-center relative">
      <p className="text-sm font-medium text-primary-foreground tracking-wide">{text}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
