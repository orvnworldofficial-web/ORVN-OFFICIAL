import { InstagramIcon, LinkedinIcon, X } from "lucide-react";
import { FaTiktok, FaThreads } from "react-icons/fa6";

export const socialLinks = [
  {
    name: "Instagram",
    icon: <InstagramIcon size={22} />,
    url: "https://instagram.com/orvn",
    color: "#E1306C",
  },
  {
    name: "TikTok",
    icon: <FaTiktok size={22} />,
    url: "https://tiktok.com/@orvn",
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
    name: "Threads",
    icon: <FaThreads size={22} />,
    url: "https://threads.net/@orvn",
    color: "#000000",
  },
];
