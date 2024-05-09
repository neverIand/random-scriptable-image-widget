let widget = await createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}
Script.complete();

async function createWidget() {
  let img = await loadRandomVocaloidImage();
  let title = "我去，";
  let widget = new ListWidget();

  let gradient = new LinearGradient();
  gradient.locations = [0, 1];
  gradient.colors = [new Color("00A2E8 "), new Color("#39C5BB")];
  widget.backgroundGradient = gradient;

  let titleStack = widget.addStack();
  let appIconElement = titleStack.addImage(img);
  appIconElement.imageSize = new Size(192, 192);
  appIconElement.cornerRadius = 4;

  titleStack.addSpacer(4);

  let titleElement = titleStack.addText(title);
  titleElement.textColor = Color.white();
  titleElement.textOpacity = 0.7;
  titleElement.font=Font.mediumSystemFont(13)

  return widget;
}

async function loadImgMetaData() {
  // see loremflickr docs
  let url = "https://loremflickr.com/json/g/540/540/vocaloid/all?random=1";
  let req = new Request(url);
  return await req.loadJSON();
}

async function loadRandomVocaloidImage() {
  let data = await loadImgMetaData();
  let url = data.file;
  let req = new Request(url);
  return req.loadImage();
}
