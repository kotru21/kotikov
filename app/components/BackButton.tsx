"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui";

export default function BackButton(): React.JSX.Element {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/");
      }}
    >
      Назад
    </Button>
  );
}
