import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendContactEmail = async (formData) => {
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    reply_to: formData.email,
  };


  console.log("SERVICE_ID =", JSON.stringify(SERVICE_ID));
console.log("TEMPLATE_ID =", JSON.stringify(TEMPLATE_ID));
console.log("PUBLIC_KEY =", JSON.stringify(PUBLIC_KEY));

  return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
  });
};

