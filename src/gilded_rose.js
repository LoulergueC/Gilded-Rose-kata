class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
  }
  updateQuality() {
    for (const item of this.items) {
      const name = item.name;
      if (name.match(/^Sulfuras.*/i)) continue;
      
      let qualityChange = 1;
      let sellIn = item.sellIn;

      // x2 when outdated
      if (sellIn <= 0) qualityChange++;

      // Backstage passes increase their quality depending the sellIn
      if (name.match(/^Backstage passes.*/i)) {
        if (sellIn <= 10) qualityChange++;
        if (sellIn <= 5) qualityChange++;
        if (sellIn <= 0) qualityChange = 0;
      }

      // Aged brie and backstage passes increase their quality
      if (name.match(/^(Aged Brie|Backstage passes).*/i)) qualityChange *= -1;

      // Conjured act 2* more
      if (name.match(/^Conjured.*/i)) qualityChange *= 2;

      item.sellIn--;
      item.quality = qualityChange ? Math.min(Math.max(item.quality - qualityChange, 0), 50) : 0;
    }

    return this.items;
  }
}
module.exports = {
  Item,
  Shop
}
