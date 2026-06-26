import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = [
  { id: "1", category: "vodka", brand: "Ciroc", name: "Ciroc Original", filename: "vodka-ciroc-original.webp", sourceUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=600&h=1200&fit=crop&bg=transparent" },
  { id: "2", category: "vodka", brand: "Grey Goose", name: "Grey Goose", filename: "vodka-grey-goose.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  { id: "3", category: "vodka", brand: "Belvedere", name: "Belvedere", filename: "vodka-belvedere.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "4", category: "vodka", brand: "Absolut", name: "Absolut Vodka", filename: "vodka-absolut.webp", sourceUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=600&h=1200&fit=crop" },
  { id: "5", category: "vodka", brand: "Smirnoff", name: "Smirnoff Red", filename: "vodka-smirnoff.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  
  { id: "6", category: "gin", brand: "Gordons", name: "Gordons London Dry", filename: "gin-gordons-london-dry.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "7", category: "gin", brand: "Tanqueray", name: "Tanqueray", filename: "gin-tanqueray.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "8", category: "gin", brand: "Bombay Sapphire", name: "Bombay Sapphire", filename: "gin-bombay-sapphire.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  
  { id: "9", category: "whiskey", brand: "Jameson", name: "Jameson Irish Whiskey", filename: "whiskey-jameson.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  { id: "10", category: "whiskey", brand: "Jack Daniels", name: "Jack Daniels Old No. 7", filename: "whiskey-jack-daniels.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "11", category: "whiskey", brand: "Johnnie Walker", name: "Johnnie Walker Black Label", filename: "whiskey-johnnie-walker-black.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  { id: "12", category: "whiskey", brand: "Johnnie Walker", name: "Johnnie Walker Red Label", filename: "whiskey-johnnie-walker-red.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  
  { id: "13", category: "brandy", brand: "Hennessy", name: "Hennessy VS", filename: "brandy-hennessy-vs.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "14", category: "brandy", brand: "Amarula", name: "Amarula Cream", filename: "brandy-amarula.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  
  { id: "15", category: "rum", brand: "Captain Morgan", name: "Captain Morgan Spiced", filename: "rum-captain-morgan.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "16", category: "rum", brand: "Bacardi", name: "Bacardi Superior", filename: "rum-bacardi-superior.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  
  { id: "17", category: "tequila", brand: "Jose Cuervo", name: "Jose Cuervo Especial", filename: "tequila-jose-cuervo.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  
  { id: "18", category: "champagne", brand: "Moet & Chandon", name: "Moet Imperial", filename: "champagne-moet-imperial.webp", sourceUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=600&h=1200&fit=crop" },
  { id: "19", category: "champagne", brand: "Veuve Clicquot", name: "Veuve Clicquot Brut", filename: "champagne-veuve-clicquot.webp", sourceUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=600&h=1200&fit=crop" },
  
  { id: "20", category: "cider", brand: "Hunters", name: "Hunters Gold", filename: "cider-hunters-gold.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "21", category: "cider", brand: "Savanna", name: "Savanna Dry", filename: "cider-savanna-dry.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  
  { id: "22", category: "beer", brand: "Windhoek", name: "Windhoek Lager", filename: "beer-windhoek-lager.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "23", category: "beer", brand: "Tafel", name: "Tafel Lager", filename: "beer-tafel-lager.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "24", category: "beer", brand: "Heineken", name: "Heineken", filename: "beer-heineken.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  { id: "25", category: "beer", brand: "Castle Lite", name: "Castle Lite", filename: "beer-castle-lite.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  { id: "26", category: "beer", brand: "Corona", name: "Corona Extra", filename: "beer-corona-extra.webp", sourceUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=1200&fit=crop" },
  { id: "27", category: "beer", brand: "Stella Artois", name: "Stella Artois", filename: "beer-stella-artois.webp", sourceUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=600&h=1200&fit=crop" },
  
  { id: "28", category: "cooldrink", brand: "Coca-Cola", name: "Coca-Cola Original", filename: "cooldrink-coca-cola.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  { id: "29", category: "cooldrink", brand: "Coca-Cola", name: "Coke Zero", filename: "cooldrink-coke-zero.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  { id: "30", category: "cooldrink", brand: "Fanta", name: "Fanta Orange", filename: "cooldrink-fanta-orange.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  { id: "31", category: "cooldrink", brand: "Sprite", name: "Sprite", filename: "cooldrink-sprite.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  { id: "32", category: "cooldrink", brand: "Schweppes", name: "Schweppes Tonic", filename: "cooldrink-schweppes-tonic.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  
  { id: "33", category: "water", brand: "Generic", name: "Still Water", filename: "water-still-water.webp", sourceUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=1200&fit=crop" },
  { id: "34", category: "water", brand: "Generic", name: "Sparkling Water", filename: "water-sparkling-water.webp", sourceUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=1200&fit=crop" },
  
  { id: "35", category: "juice", brand: "Generic", name: "Orange Juice", filename: "juice-orange-juice.webp", sourceUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=1200&fit=crop" },
  { id: "36", category: "juice", brand: "Generic", name: "Apple Juice", filename: "juice-apple-juice.webp", sourceUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=1200&fit=crop" },
  
  { id: "37", category: "energy-drink", brand: "Red Bull", name: "Red Bull", filename: "energy-drink-red-bull.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
  { id: "38", category: "energy-drink", brand: "Monster", name: "Monster Energy", filename: "energy-drink-monster.webp", sourceUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=1200&fit=crop" },
];

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'products');

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function processAssets() {
  console.log("Starting StockBru Asset Pipeline...");
  
  for (const product of products) {
    const categoryDir = path.join(PUBLIC_DIR, product.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const rawPath = path.join(categoryDir, `raw-${product.filename}`);
    const finalPath = path.join(categoryDir, product.filename);
    
    try {
      console.log(`Processing: ${product.name} ...`);
      
      // 1. Download
      await downloadImage(product.sourceUrl, rawPath);
      
      // 2. Process with Sharp
      await sharp(rawPath)
        .resize({ height: 1200, fit: 'inside' })
        .webp({ quality: 80, effort: 6 })
        .toFile(finalPath);
        
      const stats = fs.statSync(finalPath);
      console.log(`✅ Success: ${product.filename} (${(stats.size / 1024).toFixed(2)} KB)`);
      
      // Cleanup raw
      fs.unlinkSync(rawPath);
      
    } catch (error) {
      console.error(`❌ Failed: ${product.name}`, error.message);
    }
  }
  
  console.log("Asset Pipeline Complete!");
}

processAssets();
