import React from "react";

import { InteractiveTextRegistry } from "./types";

export const InteractiveTextContext = React.createContext<InteractiveTextRegistry | null>(null);
