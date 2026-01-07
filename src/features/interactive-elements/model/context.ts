import React from "react";

import type { InteractiveTextRegistry } from "./types";

export const InteractiveTextContext = React.createContext<InteractiveTextRegistry | null>(null);
