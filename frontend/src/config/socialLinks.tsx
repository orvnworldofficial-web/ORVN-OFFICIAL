import { InstagramIcon, LinkedinIcon, X } from "lucide-react";
import { FaTiktok, FaFacebook } from "react-icons/fa6";

export const socialLinks = [
  {
    name: "Instagram",
    icon: <InstagramIcon size={22} />,
    url: "https://www.instagram.com/orvnlabs?igsh=NTlvamU1cm5iZW04",
    color: "#E1306C",
  },
  {
    name: "TikTok",
    icon: <FaTiktok size={22} />,
    url: "https://www.tiktok.com/@orvnlabs?_t=ZS-8zLYUssAnpP&_r=1",
    color: "#69C9D0",
  },
  {
    name: "LinkedIn",
    icon: <LinkedinIcon size={22} />,
    url: "https://linkedin.com/company/orvn",
    color: "#0A66C2",
  },
  {
    name: "X",
    icon: <X size={22} />,
    url: "https://x.com/OrvnLabs?t=XxCXCo53faAyRz31nVSQiw&s=09",
    color: "#1DA1F2",
  },
  {
    name: "Facebook",
    icon: <FaFacebook size={22} />,
    url: "https://www.facebook.com/share/1AjKWTA1rK/",
    color: "#1877F2",
  },
];
