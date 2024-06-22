const SCRIPT_CONFIG = {
  title: "",
  month: 5,
  day: 13,
  bDayMsg: "",
  // Jan: 0, Feb: 1, ...
  specialDates: [
    null,
    null,
    null,
    null,
    null,
    new Map([[22, { msg: "Today is June 22th", keywords: ["bunny"] }]]),
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  imgKeywords: ["cat", "loaf"].join(","),
  bDayImgKeywords: ["cake", "round"].join(","),
};

let widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();

async function createWidget() {
  let widget = new ListWidget();

  // let gradient = new LinearGradient();
  // gradient.locations = [0, 1];
  // gradient.colors = [new Color("00A2E8 "), new Color("#39C5BB")];
  // widget.backgroundGradient = gradient;

  let titleStack = widget.addStack();
  let titleElement = titleStack.addText(SCRIPT_CONFIG.title);
  titleElement.textColor = Color.white();
  titleElement.textOpacity = 0.95;
  titleElement.font = Font.boldSystemFont(24);

  widget.addSpacer(4);

  let img;
  const date = new Date();
  const { imgKeywords, bDayImgKeywords, bDayMsg, specialDates } = SCRIPT_CONFIG;

  if (isBDay(date)) {
    img = await loadRandomImage(bDayImgKeywords);
    renderMsg(widget, bDayMsg);
  } else if (isSpecialDay(date)) {
    img = await loadRandomImage(
      specialDates[date.getMonth()].get(date.getDate()).keywords
    );
    renderMsg(
      widget,
      specialDates[date.getMonth()].get(date.getDate()).msg || ""
    );
  } else {
    img = await loadRandomImage(imgKeywords);
  }

  widget.backgroundImage = img;

  return widget;
}

async function loadImgMetaData(keywords) {
  let url = `https://loremflickr.com/json/g/540/540/${keywords.join(
    ","
  )}/all?random=1`;
  let req = new Request(url);
  return await req.loadJSON();
}

async function loadRandomImage() {
  let data = await loadImgMetaData();
  let url = data.file;
  let req = new Request(url);
  return req.loadImage();
}

function isBDay(date) {
  const { month, day } = SCRIPT_CONFIG;
  if (!month || !day) {
    return false;
  }
  return date.getMonth() === month - 1 && date.getDate() === day;
}

function isSpecialDay(date) {
  const { specialDates } = SCRIPT_CONFIG;
  // could modify this function so that it uses some api, making it essencially a calendar widget
  // if (specialDates.length === 0) {
  //   return false;
  // }
  const specialMonth = specialDates[date.getMonth()];
  if (!specialMonth) {
    return false;
  }
  const specialDay = specialMonth.get(date.getDate());
  if (!specialDay) {
    return false;
  }
  return true;
}

function renderMsg(widget, msg) {
  let textElement = widget.addText(msg);
  textElement.textColor = Color.white();
  textElement.textOpacity = 0.9;
  textElement.font = Font.boldSystemFont(20);
}
