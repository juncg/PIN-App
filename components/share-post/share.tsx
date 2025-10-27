"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  RedditShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon,
  XIcon,
} from "react-share";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ShareComponentProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareComponent({ url, title, description }: ShareComponentProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mt-4">
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Compartir enlace</h4>
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Compartir en redes sociales</h4>
            <div className="grid grid-cols-3 gap-3">
              <FacebookShareButton url={shareUrl} title={title}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <FacebookIcon size={40} round />
                  <span className="text-xs">Facebook</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <XIcon size={40} round />
                  <span className="text-xs">X</span>
                </div>
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl} title={title}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <WhatsappIcon size={40} round />
                  <span className="text-xs">WhatsApp</span>
                </div>
              </WhatsappShareButton>

              <TelegramShareButton url={shareUrl} title={title}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <TelegramIcon size={40} round />
                  <span className="text-xs">Telegram</span>
                </div>
              </TelegramShareButton>

              <LinkedinShareButton url={shareUrl} title={title} summary={description}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <LinkedinIcon size={40} round />
                  <span className="text-xs">LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <RedditShareButton url={shareUrl} title={title}>
                <div className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <RedditIcon size={40} round />
                  <span className="text-xs">Reddit</span>
                </div>
              </RedditShareButton>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}