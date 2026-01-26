"use client";

const WHATSAPP_NUMBER = "+393780930448";
const DEFAULT_MESSAGE = "Ciao! Vorrei avere maggiori informazioni.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <span className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-[#25D366] opacity-40" />
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattaci su WhatsApp"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-6 w-6 fill-white"
        >
          <path d="M16.004 0C7.164 0 0 7.163 0 16c0 2.822.736 5.572 2.132 8.004L.072 32l8.208-2.152A15.936 15.936 0 0 0 16.004 32C24.836 32 32 24.837 32 16S24.836 0 16.004 0zm0 29.2a13.176 13.176 0 0 1-6.716-1.836l-.48-.288-4.98 1.308 1.328-4.856-.312-.496A13.165 13.165 0 0 1 2.8 16c0-7.284 5.92-13.2 13.204-13.2S29.2 8.716 29.2 16s-5.912 13.2-13.196 13.2zm7.24-9.876c-.396-.2-2.348-1.16-2.712-1.292-.364-.132-.628-.2-.892.2s-1.024 1.292-1.256 1.556c-.232.264-.464.296-.86.1-.396-.2-1.672-.616-3.184-1.964-1.176-1.048-1.972-2.344-2.204-2.74-.232-.396-.024-.608.176-.808.18-.18.396-.464.596-.696.2-.232.264-.396.396-.66.132-.264.068-.496-.032-.696-.1-.2-.892-2.148-1.224-2.944-.32-.772-.648-.668-.892-.68-.232-.012-.496-.016-.76-.016s-.696.1-1.06.496c-.364.396-1.392 1.36-1.392 3.316s1.424 3.844 1.624 4.108c.2.264 2.804 4.28 6.792 6.004.948.412 1.688.656 2.264.84.952.3 1.82.26 2.504.156.764-.116 2.348-.96 2.68-1.888.332-.928.332-1.724.232-1.888-.1-.164-.364-.264-.76-.464z" />
        </svg>
      </a>
    </div>
  );
}
