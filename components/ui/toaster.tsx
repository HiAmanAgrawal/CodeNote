"use client";

import * as React from "react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose } from "@radix-ui/react-toast";

export function Toaster() {
  return (
    <ToastProvider swipeDirection="right">
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-96 max-w-full z-50 outline-none" />
    </ToastProvider>
  );
}

// Example usage for showing a toast (can be used in your app logic):
// import { toast } from "@/components/ui/use-toast";
// toast({ title: "Hello!", description: "This is a toast message." }); 