interface Novel {
  [key: string]: Array<{
    userId: string;
    content: string;
  }>;
}

export interface Game {
  roomId: string;
  turn: number;
  novels: Array<Novel>;
}
