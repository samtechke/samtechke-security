import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const phoneNumber = "254729289847"; // Your Kenya number
  const message = "Hello SAMTECHKE, I'm interested in your security systems.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default FloatingWhatsApp;