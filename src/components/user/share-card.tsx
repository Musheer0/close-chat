"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { QRCodeCanvas } from "qrcode.react";
import { useShareCard } from "@/hooks/use-share-card";

const ShareCard = () => {
  const { user } = useUser();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {isOpen,setIsOpen} =useShareCard()
  useEffect(() => {
    if (user) {
      setLink(`${window.location.origin}/add/${user.id}`);
    }
  }, [user]);

  if (!user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert QR canvas → blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], "qr-code.png", { type: "image/png" });

      if (navigator.share && (navigator).canShare?.({ files: [file] })) {
        // Web Share API with image
        try {
          await navigator.share({
            title: "Join me on Close Chat",
            text: `${user.username} is inviting you to chat`,
            url: link,
            files: [file],
          });
        } catch (err) {
          console.error("Share cancelled:", err);
        }
      } else {
        // Fallback → force download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };
if(user)
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent >
        <DrawerHeader>
        
          <DrawerTitle>{user.username} is inviting you</DrawerTitle>
          <DrawerDescription>
            Scan the QR or click the link below to start texting
          </DrawerDescription>
        </DrawerHeader>

        {link && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-[220px] h-[220px] flex items-center justify-center">
              <QRCodeCanvas
                ref={canvasRef}
                value={link}
                size={220}
                level="H"
                includeMargin
              />
               {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-10 h-10 rounded-full border-4 border-white"
            />
          )}
            </div>
            <p className="text-sm text-muted-foreground break-all">{link}</p>
          </div>
        )}

        <DrawerFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? "Copied ✅" : "Copy link"}
          </Button>
          <Button onClick={handleShare}>Share QR</Button>
          <DrawerClose className="flex items-center gap-2 justify-center" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareCard;
