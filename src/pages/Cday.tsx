type QixiMessage = {
  festivalMessage: string | undefined;
  greetingMessage: string | undefined;
};

function isQixiFestival(): boolean {
  const festivalDate = new Date();
  festivalDate.setMonth(7, 10);

  const today = new Date();
  return today.getDate() === festivalDate.getDate() && today.getMonth() === festivalDate.getMonth();
}

const isQixiToday = (): string | undefined => {
  if (isQixiFestival()) {
    return "Happy Qixi Festival! Lovely One, I Just Want To Express My Emotion Right Now!!";
  }
  return undefined;
}

const qixiGreeting = (): string | undefined => {
  if (isQixiFestival()) {
    return "Jangan Begadang Molo + Selanjutnya Pengen Dikirimin Coklat(Kalau Bisa) ";
  }
  return "Broke Up + !isQixiFestival()"
}

export { isQixiFestival, isQixiToday, qixiGreeting };
