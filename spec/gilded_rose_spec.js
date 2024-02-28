const {Shop, Item} = require('../src/gilded_rose.js');

const randomItems = (items, day = 0) => {
  if (day === 0) {
    day = randInt(2, 10);
  }
  const gildedRose = new Shop(items);
  for (let i = 0; i < day; i++) {
    gildedRose.updateQuality();
  }
  return gildedRose.items;
}

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

describe("Gilded Rose", function() {

  it("full test", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 39),

      // This Conjured item does not work properly yet
      new Item("Conjured Mana Cake", 3, 6),
    ];

    const days = Math.floor(Math.random() * 4 ) + 2;
    const gildedRose = new Shop(items);

    for (let day = 0; day < days; day++) {
      console.log(`\n-------- day ${day} --------`);
      console.log("name, sellIn, quality");
      items.forEach(item => console.log(`${item.name}, ${item.sellIn}, ${item.quality}`));
      gildedRose.updateQuality();
    }

    const calculatedBackstagePass = (days, sellIn, quality) => {
      for(let i = 0; i < days; i++, sellIn--) {
        if (sellIn > 10) {
          quality += 1;
        } else if (sellIn > 5 && sellIn <= 10) {
          quality += 2;
        } else if (sellIn > 0 && sellIn <= 5) {
          quality += 3;
        } else {
          quality = 0;
          break;
        }
      }
      return quality > 50 ? 50 : quality;
    }

    expect(items[0].sellIn === 10 - days && items[0].quality === 20 - days).toBe(true);
    expect(items[1].sellIn === 2 - days && items[1].quality === 2 + (days - 2) * 2).toBe(true);
    expect(items[2].sellIn === 5 - days && items[2].quality === 7 - days).toBe(true);
    expect(items[3].sellIn === 0 && items[3].quality === 80).toBe(true);
    expect(items[4].sellIn === -1 && items[4].quality === 80).toBe(true);
    expect(items[5].sellIn === 15 - days && items[5].quality === calculatedBackstagePass(days, 15, 20)).toBe(true);
    expect(items[6].sellIn === 10 - days && items[6].quality === calculatedBackstagePass(days, 10, 49)).toBe(true);
    expect(items[7].sellIn === 5 - days && items[7].quality === calculatedBackstagePass(days, 5, 39)).toBe(true);
  });

  it("quality should not be negative", function() {
    const items = randomItems([
      new Item("foo", 0, 0),
      new Item("foo", randInt(0, 2), randInt(0, 2)),
      new Item("foo", randInt(0, 50), randInt(0, 50)),
      new Item("foo", randInt(0, 50), randInt(0, 50))
    ])
    expect(items[0].quality >= 0).toBe(true);
    expect(items[1].quality >= 0).toBe(true);
    expect(items[2].quality >= 0).toBe(true);
    expect(items[3].quality >= 0).toBe(true);
  });

  it ("quality should not be greater than 50", function() {
    const items = randomItems([
      new Item("foo", 0, 0),
      new Item("foo", randInt(0, 2), randInt(0, 2)),
      new Item("Backstage passes to a TAFKAL80ETC concert", randInt(0, 50), randInt(0, 50)),
      new Item("Backstage passes to a TAFKAL80ETC concert", randInt(0, 50), randInt(0, 50)),
      new Item("Aged Brie", randInt(0, 50), randInt(45, 50)),
      new Item("Aged Brie", randInt(0, 50), randInt(49, 50))
    ])
    expect(items[0].quality <= 50).toBe(true);
    expect(items[1].quality <= 50).toBe(true);
    expect(items[2].quality <= 50).toBe(true);
    expect(items[3].quality <= 50).toBe(true);
    expect(items[4].quality <= 50).toBe(true);
    expect(items[5].quality <= 50).toBe(true);
  });

  it ("quality shoud be 2x degraded when outdated", function() {
    const items = randomItems([
      new Item("foo", -1, 10),
      new Item("foo", 50, 10)
    ], 1)

    expect(10 - items[0].quality === 2*(10 - items[1].quality)).toBe(true);
  })

  it ("Sulfuras quality should not be changed", function() {
    const items = randomItems([
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80)
    ])
    expect(items[0].quality).toBe(80);
    expect(items[1].quality).toBe(80);
  })
  
  it ("Backstage passes quality should augment", function() {
    const items = randomItems([
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)
    ], 1)

    expect(items[0].quality).toBe(21);
    expect(items[1].quality).toBe(22);
    expect(items[2].quality).toBe(23);
  })

  it("Backstage passes quality is 0 after concert", function() {
    const items = randomItems([
      new Item("Backstage passes to a TAFKAL80ETC concert", 11, randInt(10, 50)),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, randInt(10, 50)),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, randInt(10, 50))
    ], 12)

    expect(items[0].quality).toBe(0);
    expect(items[1].quality).toBe(0);
    expect(items[2].quality).toBe(0);
  })

  it("Aged Brie should increase quality", function() {
    const items = randomItems([
      new Item("Aged Brie", 10, 10),
      new Item("Aged Brie", 5, 10)
    ])
    expect(items[0].quality > 10).toBe(true);
    expect(items[1].quality > 10).toBe(true);
  })

  it("sellIn and quality should decrease", function() {
    const items = randomItems([
      new Item("foo", 10, 10),
      new Item("foo", 5, 10)
    ])
    expect(items[0].sellIn < 10).toBe(true);
    expect(items[1].sellIn < 5).toBe(true);

    expect(items[0].quality < 10).toBe(true);
    expect(items[1].quality < 10).toBe(true);
  })

  it("Conjured items should lose quality twice as fast", function() {
    const items = randomItems([
      new Item("Conjured foo", 10, 20),
      new Item("foo", 10, 20),
      new Item("Conjured foo", 3, 40),
      new Item("foo", 9, 40),
      new Item("Conjured foo", 0, 30),
      new Item("foo", 0, 30),
    ])
    expect(20 - items[0].quality === 2*(20 - items[1].quality) || items[0].quality === 0).toBe(true);
    if (items[2].sellIn >= 0) {
      expect(40 - items[2].quality === 2*(40 - items[3].quality) || items[2].quality === 0).toBe(true);
    } else {
      expect(40 - items[2].quality === 2*(40 - items[3].quality) - 2 * items[2].sellIn || items[2].quality === 0).toBe(true);
    }
    expect(30 - items[4].quality === 2*(30 - items[5].quality) || items[4].quality === 0).toBe(true);
  })
});