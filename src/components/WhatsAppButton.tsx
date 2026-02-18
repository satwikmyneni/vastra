import WhatsAppLogo from "@/assets/whatsapp-icon.svg";

interface Props {
  whatsappNumber?: string;
}

const WhatsAppButton = ({ whatsappNumber }: Props) => {
  const number = whatsappNumber || "919876543210";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe57] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
    >
      <img
        src={WhatsAppLogo}
        alt="WhatsApp"
        className="w-7 h-7"
      />
    </a>
  );
};

export default WhatsAppButton;