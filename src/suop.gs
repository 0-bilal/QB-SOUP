const TELEGRAM_TOKEN = '8206799207:AAES4J2bLU8413hKDCUL9umn1-p83nR-Gyw';
const CHAT_ID = '-1003339837029';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // إضافة البيانات للجدول
    sheet.appendRow([
      new Date(), 
      data.name, 
      "'" + data.phone, // إضافة الكوتيشن لحفظ رقم الجوال بشكل صحيح
      data.order, 
      data.total
    ]);

    // تجهيز رسالة التيليجرام
    const message = `🔔 *طلب جديد من شوربة* 🍲\n\n` +
                    `👤 *الاسم:* ${data.name}\n` +
                    `📱 *الجوال:* ${data.phone}\n` +
                    `📝 *الطلب:* \n${data.order}\n`+
                    `💰 *الإجمالي:* ${data.total}`;
    

    // إرسال للتيليجرام
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    };
    
    UrlFetchApp.fetch(url, options);

    return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}