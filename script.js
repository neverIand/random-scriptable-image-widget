const SCRIPT_CONFIG = {
  title: "我去，",
  month: 5,
  date: 13,
  msg: "生日快乐，蔡宝",
  imgKeywords: ["vocaloid", "miku"].join(","),
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
  let img = await loadRandomVocaloidImage();
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
    let textElement = widget.addText(SCRIPT_CONFIG.msg);
    textElement.textColor = Color.white();
    textElement.textOpacity = 0.9;
    textElement.font = Font.boldSystemFont(20);
  }

  return widget;
}

async function loadImgMetaData() {
  // see loremflickr docs
  let url = isBDay()
    ? `https://loremflickr.com/json/g/540/540/${SCRIPT_CONFIG.bDayImgKeywords}/all?random=1`
    : `https://loremflickr.com/json/g/540/540/${SCRIPT_CONFIG.imgKeywords}/all?random=1`;
  let req = new Request(url);
  return await req.loadJSON();
}

async function loadRandomVocaloidImage() {
  let data = await loadImgMetaData();
  let url = data.file;
  let req = new Request(url);
  return req.loadImage();
}

function isBDay() {
  const date = new Date();
  return (
    date.getMonth() === SCRIPT_CONFIG.month - 1 &&
    date.getDate() === SCRIPT_CONFIG.date
  );
}
