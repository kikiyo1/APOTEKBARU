/**
 * Advanced receipt printing utility for thermal printers
 */

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}

interface ReceiptData {
  transactionNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  globalDiscount?: number;
  globalDiscountAmount?: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  cashier: string;
  customer?: string;
  timestamp: Date;
}

class ThermalPrinter {
  private readonly ESC = '\x1b';
  private readonly GS = '\x1d';
  
  // Thermal printer commands
  private commands = {
    INIT: this.ESC + '@',
    FONT_A: this.ESC + 'M' + '\x00',
    FONT_B: this.ESC + 'M' + '\x01',
    BOLD_ON: this.ESC + 'E' + '\x01',
    BOLD_OFF: this.ESC + 'E' + '\x00',
    CENTER: this.ESC + 'a' + '\x01',
    LEFT: this.ESC + 'a' + '\x00',
    RIGHT: this.ESC + 'a' + '\x02',
    CUT: this.GS + 'V' + '\x00',
    DRAWER: this.ESC + 'p' + '\x00' + '\x32' + '\xFA',
    DOUBLE_HEIGHT: this.ESC + '!' + '\x10',
    DOUBLE_WIDTH: this.ESC + '!' + '\x20',
    NORMAL: this.ESC + '!' + '\x00',
    UNDERLINE_ON: this.ESC + '-' + '\x01',
    UNDERLINE_OFF: this.ESC + '-' + '\x00'
  };

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  }

  private formatNumber(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
  }

  private centerText(text: string, width: number = 32): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  private rightAlign(text: string, width: number = 32): string {
    const padding = Math.max(0, width - text.length);
    return ' '.repeat(padding) + text;
  }

  private padLine(left: string, right: string, width: number = 32): string {
    const availableSpace = width - left.length - right.length;
    const padding = Math.max(1, availableSpace);
    return left + ' '.repeat(padding) + right;
  }

  private createSeparator(char: string = '-', width: number = 32): string {
    return char.repeat(width);
  }

  generateReceiptContent(data: ReceiptData): string {
    let content = '';

    // Initialize printer
    content += this.commands.INIT;
    
    // Header - Store Info
    content += this.commands.CENTER + this.commands.BOLD_ON + this.commands.DOUBLE_WIDTH;
    content += 'APOTEK SEHAT BERSAMA\n';
    content += this.commands.NORMAL + this.commands.CENTER;
    content += 'JL. KESEHATAN SEJAHTERA NO.123\n';
    content += 'JAKARTA - Telp: (021) 7005000\n';
    content += '\n';

    // Transaction Info
    content += this.commands.LEFT + this.commands.FONT_A;
    content += this.createSeparator('=') + '\n';
    content += `TRX: ${data.transactionNumber}\n`;
    content += `Tanggal: ${data.timestamp.toLocaleDateString('id-ID')}\n`;
    content += `Waktu: ${data.timestamp.toLocaleTimeString('id-ID')}\n`;
    content += `Kasir: ${data.cashier}\n`;
    if (data.customer) {
      content += `Customer: ${data.customer}\n`;
    }
    content += this.createSeparator('=') + '\n';

    // Items
    content += this.commands.FONT_B;
    content += 'ITEM                QTY   HARGA\n';
    content += this.createSeparator('-') + '\n';

    data.items.forEach(item => {
      // Item name (truncate if too long)
      const itemName = item.name.length > 16 ? 
        item.name.substring(0, 16) + '...' : 
        item.name;
      
      content += `${itemName}\n`;
      
      // Quantity, price, subtotal
      const qtyPriceTotal = this.padLine(
        `${item.quantity}x`,
        `${this.formatNumber(item.price)}`,
        32
      );
      content += qtyPriceTotal + '\n';
      
      // Item discount if any
      if (item.discount && item.discount > 0) {
        content += this.padLine(
          `  Disc ${item.discount}%`,
          `-${this.formatNumber(item.total * item.discount / 100)}`,
          32
        ) + '\n';
      }
      
      // Item total
      content += this.padLine(
        '  Subtotal:',
        this.formatNumber(item.total - (item.total * (item.discount || 0) / 100)),
        32
      ) + '\n';
      
      content += '\n';
    });

    // Totals
    content += this.createSeparator('-') + '\n';
    content += this.commands.FONT_A;
    
    content += this.padLine('Subtotal:', this.formatNumber(data.subtotal)) + '\n';
    
    if (data.globalDiscount && data.globalDiscount > 0) {
      content += this.padLine(
        `Diskon (${data.globalDiscount}%):`,
        `-${this.formatNumber(data.globalDiscountAmount || 0)}`
      ) + '\n';
    }
    
    content += this.createSeparator('-') + '\n';
    content += this.commands.BOLD_ON + this.commands.DOUBLE_HEIGHT;
    content += this.padLine('TOTAL:', this.formatNumber(data.total)) + '\n';
    content += this.commands.NORMAL;

    // Payment Info
    content += this.createSeparator('-') + '\n';
    content += this.padLine('Bayar (' + data.paymentMethod + '):', this.formatNumber(data.amountPaid)) + '\n';
    content += this.padLine('Kembalian:', this.formatNumber(data.change)) + '\n';

    // Footer
    content += '\n';
    content += this.createSeparator('=') + '\n';
    content += this.commands.CENTER;
    content += 'TERIMA KASIH\n';
    content += 'ATAS KUNJUNGAN ANDA\n';
    content += '\n';
    content += 'Barang yang sudah dibeli\n';
    content += 'tidak dapat dikembalikan\n';
    content += '\n';
    content += `Print: ${new Date().toLocaleString('id-ID')}\n`;

    // Cut paper and open drawer
    content += '\n\n\n';
    content += this.commands.CUT;
    content += this.commands.DRAWER;

    return content;
  }

  async printToThermalPrinter(content: string): Promise<void> {
    try {
      // For web-based thermal printing, try WebUSB or WebSerial API
      if ('serial' in navigator) {
        await this.printViaWebSerial(content);
      } else if ('usb' in navigator) {
        await this.printViaWebUSB(content);
      } else {
        // Fallback to browser print
        this.printViaBrowser(content);
      }
    } catch (error) {
      console.error('Printing failed:', error);
      // Fallback to browser print
      this.printViaBrowser(content);
    }
  }

  private async printViaWebSerial(content: string): Promise<void> {
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      
      await writer.write(encoder.encode(content));
      await writer.close();
      await port.close();
    } catch (error) {
      throw new Error('WebSerial printing failed: ' + error);
    }
  }

  private async printViaWebUSB(content: string): Promise<void> {
    try {
      const device = await (navigator as any).usb.requestDevice({
        filters: [
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x0519 }, // Star
          { vendorId: 0x1fc9 }  // Other thermal printers
        ]
      });
      
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      
      await device.transferOut(1, data);
      await device.close();
    } catch (error) {
      throw new Error('WebUSB printing failed: ' + error);
    }
  }

  private printViaBrowser(content: string): void {
    // Create a printable version for regular browser printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk Pembayaran</title>
        <style>
          @page { margin: 0; size: 58mm auto; }
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
            margin: 0; 
            padding: 5mm;
            white-space: pre;
            line-height: 1.2;
          }
          @media print {
            body { margin: 0; padding: 2mm; }
          }
        </style>
      </head>
      <body>${content.replace(/\n/g, '<br>')}</body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  // Auto-detect and print
  async autoPrint(data: ReceiptData): Promise<void> {
    const content = this.generateReceiptContent(data);
    await this.printToThermalPrinter(content);
  }
}

// Export printer instance
export const thermalPrinter = new ThermalPrinter();

// Main print function
export const printReceipt = async (data: ReceiptData): Promise<void> => {
  await thermalPrinter.autoPrint(data);
};