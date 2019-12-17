import { XcodeAsset } from './xcode';

figma.ui.onmessage = msg => {
  if (msg.type === 'generate-color-asset') {
    const paintStyles = figma.getLocalPaintStyles();
    const asset = new XcodeAsset(paintStyles);
    figma.ui.postMessage({
      type: 'export',
      asset: asset
    });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

figma.showUI(__html__, { height: 100});
