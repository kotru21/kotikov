"use client";

import { Button } from "@/shared/ui";

export default function BackButton(): React.JSX.Element {
  return (
    <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>
      Назад
    </Button>
  );
}
