const SCRIPT_CONFIG = {
  title: "",
  month: 5,
  day: 13,
  bDayMsg: "",
  specialDates: {
    // Jan: Map<number, array> // <day, keywords>
    // ...
  },
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
  let img = await loadRandomImage();
  let widget = new ListWidget();

  // let gradient = new LinearGradient();
  // gradient.locations = [0, 1];
  // gradient.colors = [new Color("00A2E8 "), new Color("#39C5BB")];
  // widget.backgroundGradient = gradient;
  widget.backgroundImage = img;

  let titleStack = widget.addStack();
  let titleElement = titleStack.addText(SCRIPT_CONFIG.title);
  titleElement.textColor = Color.white();
  titleElement.textOpacity = 0.95;
  titleElement.font = Font.boldSystemFont(24);

  widget.addSpacer(4);

  if (isBDay()) {
    let textElement = widget.addText(SCRIPT_CONFIG.bDayMsg);
    textElement.textColor = Color.white();
    textElement.textOpacity = 0.9;
    textElement.font = Font.boldSystemFont(20);
  }

  return widget;
}

async function loadImgMetaData() {
  const { bDayImgKeywords, imgKeywords } = SCRIPT_CONFIG;
  let url = isBDay()
    ? `https://loremflickr.com/json/g/540/540/${bDayImgKeywords}/all?random=1`
    : `https://loremflickr.com/json/g/540/540/${imgKeywords}/all?random=1`;
  let req = new Request(url);
  return await req.loadJSON();
}

async function loadRandomImage() {
  let data = await loadImgMetaData();
  let url = data.file;
  let req = new Request(url);
  return req.loadImage();
}

function isBDay() {
  const { month, day } = SCRIPT_CONFIG;
  if (!month || !day) {
    return false;
  }
  const date = new Date();
  return date.getMonth() === month - 1 && date.getDate() === day;
}
