import JSZip from '../node_modules/jszip';
import saveAs from '../node_modules/file-saver';
import { XcodeAsset, XcodeAssetColorItem } from './xcode';

document.getElementById('export').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'generate-color-asset' } }, '*');
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
}

window.onmessage = async (event) => {
  const pluginMessage = event.data.pluginMessage;

  if (!pluginMessage) {
      return;
  }

  if (pluginMessage.type === 'export') {
    const asset = pluginMessage.asset as XcodeAsset;
    const zip = new JSZip();
    generateAsset(zip, asset);
    asset.items.forEach(item => {
      generateAssetItem(zip, item);
    });
    zip.generateAsync({type:"blob"})
      .then(function (blob) {
        saveAs(blob, "Color.zip");

        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
      });
  }
};

function generateAsset(zip, asset: XcodeAsset) {
  let content = `
  {
    "info" : {
      "version" : 1,
      "author" : "xcode"
    }
  }`

  zip.folder("Color")
    .file("Contents.json", content);
}

function generateAssetItem(zip, item: XcodeAssetColorItem) {
  let content = `
  {
    "info" : {
      "version" : 1,
      "author" : "xcode"
    },
    "colors" : [
      {
        "idiom" : "universal",
        "color" : {
          "color-space" : "srgb",
          "components" : {
            "red" : \"${item.rgba.r.toFixed(3)}\",
            "alpha" : \"${item.rgba.a.toFixed(3)}\",
            "blue" : \"${item.rgba.b.toFixed(3)}\",
            "green" : \"${item.rgba.g.toFixed(3)}\"
          }
        }
      }
    ]
  }
  `

  let name = item.name.replace(" ", "-");
  zip.folder("Color")
    .folder(`${name}.colorset`)
    .file("Contents.json", content);
}
