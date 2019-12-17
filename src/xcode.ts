function isSolidPaint(arg: any): arg is SolidPaint {
  return arg !== null &&
    typeof arg === 'object' &&
    arg.type === 'SOLID'
}  

export class XcodeAssetColorItem {
  name: string
  rgba: { [key: string]: number }

  constructor(name: string, paint: SolidPaint) {
    this.name = name;
    this.rgba = {
      r: paint.color.r,
      g: paint.color.g,
      b: paint.color.b,
      a: paint.opacity,
    };
  }
}
  
export class XcodeAsset {
  items: XcodeAssetColorItem[]

  constructor(paintStyles: PaintStyle[]) {
    let arr = paintStyles.map((style) => {
      let paint = style.paints[0];
      if (style.paints.length == 1 && isSolidPaint(paint)) {
        return new XcodeAssetColorItem(style.name, paint);
      } else {
        return null;
      }
    });

    this.items = arr.filter((item: XcodeAssetColorItem | null): item is XcodeAssetColorItem => item !== null);
  }
}
  